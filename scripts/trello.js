import { execFile, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";

// -----------------------------------------------------------------------------
//   npm run trello:lists              show board columns
//   npm run trello -- vtebVuUR                 show one card (id or URL)
//   npm run trello -- "P0 — Critical"          show cards in that list
//   npm run trello:side -- vtebVuUR            say if that card looks frontend or backend
//   npm run trello:side -- "P0 — Critical"     classify every card in that list
//   npm run trello:backend                     preview backend cards (does not move)
//   npm run trello:backend -- --move           create Backend list and move those cards
//   npm run trello:backend -- "P0 — Critical" --move
//   npm run trello:explain                     explain the first P0 card, do not fix
//   npm run trello:explain -- vtebVuUR         explain that card, do not fix
//   npm run trello:fix                         open Cursor Agent for the first P0 card
//   npm run trello:fix -- vtebVuUR             open Cursor Agent for that card
//   npm run trello:qa                          move the first P0 card to Re - Testing
//   npm run trello:qa -- vtebVuUR              move that card to Re - Testing
//   npm run trello:qa -- vtebVuUR --comment "Fixed"
// -----------------------------------------------------------------------------

loadEnv(".env.local");
loadEnv(".env");

const KEY = required("TRELLO_API_KEY");
const TOKEN = required("TRELLO_TOKEN");
const BOARD_ID = required("TRELLO_BOARD_ID");
const FROM_LIST = process.env.TRELLO_READY_LIST_NAME || "🔴 P0 — Critical";
const TO_LIST = process.env.TRELLO_QA_LIST_NAME || "Re - Testing";
const CARD_FIELDS = "name,desc,shortUrl,shortLink,idList,labels";
const FRONTEND_HINTS = [
  "renders blank",
  "renders nothing",
  "renders completely blank",
  "client render",
  "react state",
  "ui reports",
  "ui shows",
  "ui absent",
  "only the rendering",
  "dialog will not open",
  "review dialog",
  "dropdown",
  "checkbox",
  "get method",
  "http get",
  "form uses get",
  "no error message",
  "loading indicator",
  "frontend",
  "front-end",
  "front end",
];
const BACKEND_HINTS = [
  "/api/",
  "api returns",
  "api level",
  "http 400",
  "http 401",
  "http 403",
  "http 500",
  "http 503",
  "returns 400",
  "returns 503",
  "db unchanged",
  "database",
  "uniqueness constraint",
  "endpoint",
  "webhook",
  "backend",
  "back-end",
  "back end",
  "validation error",
  "write requests",
];

const rawArgs = process.argv.slice(2);
const command = ["fix", "qa", "lists", "side", "backend", "explain"].includes(rawArgs[0])
  ? rawArgs[0]
  : null;
const { query, comment, images, move } = parseFlags(command ? rawArgs.slice(1) : rawArgs);

try {
  if (command === "explain") await explainCard(query);
  else if (command === "fix") await fixCard(query);
  else if (command === "qa") await moveToQa(query, { comment, images });
  else if (command === "lists") await listBoard();
  else if (command === "side") await classifySide(query);
  else if (command === "backend") await moveBackendCards(query, { move });
  else if (query) await showQuery(query);
  else await listBoard();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}

function parseFlags(argv) {
  const images = [];
  let comment = "";
  let move = false;
  const rest = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--comment" || arg === "-c") {
      comment = argv[++i] || "";
    } else if (arg.startsWith("--comment=")) {
      comment = arg.slice("--comment=".length);
    } else if (arg === "--image" || arg === "-i") {
      images.push(argv[++i] || "");
    } else if (arg.startsWith("--image=")) {
      images.push(arg.slice("--image=".length));
    } else if (arg === "--move") {
      move = true;
    } else if (
      arg === "--screenshot" ||
      arg === "-s" ||
      arg === "--paste" ||
      arg === "--clipboard"
    ) {
      images.push("paste");
    } else {
      rest.push(arg);
    }
  }

  return { query: rest[0], comment: comment.trim(), images: images.filter(Boolean), move };
}

async function listBoard() {
  const lists = await trello(`/boards/${BOARD_ID}/lists?filter=open`);

  console.log("Open lists on your Trello board:\n");
  for (const list of lists) {
    console.log(`  - "${list.name}"  (id: ${list.id})`);
  }
  console.log(
    "\nSet TRELLO_READY_LIST_NAME / TRELLO_QA_LIST_NAME in .env.local if names differ."
  );
  console.log("Show one card:  npm run trello -- vtebVuUR");
}

async function showQuery(query) {
  const lists = await trello(`/boards/${BOARD_ID}/lists?filter=open`);
  const list = lists.find((item) => sameName(item.name, query));

  if (list) {
    const cards = await trello(`/lists/${list.id}/cards`);
    console.log(`"${list.name}" has ${cards.length} card(s):\n`);
    for (const card of cards) {
      console.log(`  • ${card.name}`);
      console.log(`    ${card.shortUrl}   id: ${card.shortLink}`);
    }
    if (cards.length === 0) console.log("  (empty)");
    else console.log(`\nShow one card:  npm run trello -- ${cards[0].shortLink}`);
    return;
  }

  const card = await findCard(query);
  printCard(card, lists);
}

function printCard(card, lists) {
  const list = lists.find((item) => item.id === card.idList);
  console.log(card.name);
  console.log(card.shortUrl);
  console.log(`List: ${list?.name || card.idList}`);
  console.log(`id: ${card.shortLink}\n`);
  console.log(card.desc?.trim() || "(no description)");
  console.log(`\nFix this card:  npm run trello:fix -- ${card.shortLink}`);
  console.log(`Move to QA:     npm run trello:qa -- ${card.shortLink} --comment "Fixed"`);
  console.log(`Frontend/backend: npm run trello:side -- ${card.shortLink}`);
}

async function classifySide(query) {
  if (!query) {
    console.log("Say if a bug looks frontend, backend, both, or unclear.\n");
    console.log("  npm run trello:side -- vtebVuUR");
    console.log("  npm run trello:side -- https://trello.com/c/vtebVuUR");
    console.log('  npm run trello:side -- "P0 — Critical"');
    return;
  }

  const lists = await trello(`/boards/${BOARD_ID}/lists?filter=open`);
  const list = lists.find((item) => sameName(item.name, query));

  if (list) {
    const cards = await trello(`/lists/${list.id}/cards?fields=${CARD_FIELDS}`);
    printSideList(list, cards);
    return;
  }

  printSideCard(await findCard(query), lists);
}

function printSideList(list, cards) {
  const rows = cards.map((card) => ({ card, ...guessSide(card) }));
  const counts = { frontend: 0, backend: 0, both: 0, unclear: 0 };
  for (const row of rows) counts[row.side] += 1;

  console.log(`"${list.name}" — ${cards.length} card(s)\n`);
  console.log(`  frontend  ${counts.frontend}`);
  console.log(`  backend   ${counts.backend}`);
  console.log(`  both      ${counts.both}`);
  console.log(`  unclear   ${counts.unclear}\n`);

  if (cards.length === 0) {
    console.log("  (empty)");
    return;
  }

  for (const { card, side, why } of rows) {
    console.log(`  ${side.padEnd(9)} ${card.name}`);
    console.log(`            ${why}`);
    console.log(`            npm run trello -- ${card.shortLink}`);
  }
}

function printSideCard(card, lists) {
  const list = lists.find((item) => item.id === card.idList);
  const { side, why } = guessSide(card);
  const labels = (card.labels || []).map((item) => item.name).filter(Boolean);

  console.log(card.name);
  console.log(card.shortUrl);
  console.log(`List: ${list?.name || card.idList}`);
  if (labels.length) console.log(`Labels: ${labels.join(", ")}`);
  console.log(`id: ${card.shortLink}\n`);
  console.log(`Side: ${side}`);
  console.log(`Why: ${why}`);
  console.log(`\nFix this card:  npm run trello:fix -- ${card.shortLink}`);
}

function guessSide(card) {
  const fromLabels = sideFromLabels(card.labels || []);
  if (fromLabels) return fromLabels;

  const text = `${card.name}\n${card.desc || ""}`.toLowerCase();
  const fe = FRONTEND_HINTS.filter((hint) => text.includes(hint));
  const be = BACKEND_HINTS.filter((hint) => text.includes(hint));

  if (fe.length && be.length) {
    if (fe.length >= be.length + 2) return { side: "frontend", why: fe.slice(0, 3).join(", ") };
    if (be.length >= fe.length + 2) return { side: "backend", why: be.slice(0, 3).join(", ") };
    return {
      side: "both",
      why: `frontend: ${fe.slice(0, 2).join(", ")}; backend: ${be.slice(0, 2).join(", ")}`,
    };
  }
  if (fe.length) return { side: "frontend", why: fe.slice(0, 3).join(", ") };
  if (be.length) return { side: "backend", why: be.slice(0, 3).join(", ") };
  return { side: "unclear", why: "no frontend or backend clues in the title or description" };
}

async function moveBackendCards(query, extras = {}) {
  const shouldMove = extras.move === true;
  const lists = await trello(`/boards/${BOARD_ID}/lists?filter=open`);
  const existingBackend = lists.find((item) => sameName(item.name, "Backend"));
  const sources = sourceListsForMove(lists, existingBackend, query);

  const matches = [];
  for (const list of sources) {
    const cards = await trello(`/lists/${list.id}/cards?fields=${CARD_FIELDS}`);
    for (const card of cards) {
      if (guessSide(card).side !== "backend") continue;
      matches.push({ card, from: list.name });
    }
  }

  if (!shouldMove) {
    console.log(`Preview: ${matches.length} backend card(s). Nothing was moved.\n`);
    if (matches.length === 0) {
      console.log("  (none)");
      return;
    }
    for (const { card, from } of matches) {
      console.log(`  • ${card.name}`);
      console.log(`    from ${from}   ${card.shortUrl}`);
    }
    console.log('\nTo move them:  npm run trello:backend -- --move');
    return;
  }

  const backendList = await ensureList(lists, "Backend");
  for (const { card } of matches) {
    await trello(`/cards/${card.id}?idList=${backendList.id}`, { method: "PUT" });
  }

  console.log(`Moved ${matches.length} backend card(s) to "Backend".\n`);
  if (matches.length === 0) {
    console.log("  (none)");
    return;
  }

  for (const { card, from } of matches) {
    console.log(`  • ${card.name}`);
    console.log(`    from ${from}   ${card.shortUrl}`);
  }
}

async function ensureList(lists, name) {
  const existing = lists.find((item) => sameName(item.name, name));
  if (existing) {
    console.log(`Using list "${existing.name}"`);
    return existing;
  }

  const created = await trello(
    `/lists?name=${encodeURIComponent(name)}&idBoard=${BOARD_ID}&pos=bottom`,
    { method: "POST" }
  );
  lists.push(created);
  console.log(`Created list "${created.name}"`);
  return created;
}

function sourceListsForMove(lists, backendList, query) {
  if (query) {
    const list = lists.find((item) => sameName(item.name, query));
    if (!list) throw new Error(`List "${query}" not found.`);
    return [list];
  }

  return lists.filter(
    (item) => item.id !== backendList?.id && !isClosedWorkflowList(item.name)
  );
}

function isClosedWorkflowList(name) {
  const normalized = normalizeListName(name);
  return (
    normalized.includes("resolved") ||
    normalized.includes("re - testing") ||
    normalized.includes("retesting") ||
    normalized === "reopened"
  );
}

function sideFromLabels(labels) {
  const names = labels.map((item) => (item.name || "").trim().toLowerCase());
  const fe = names.some((name) => ["frontend", "front-end", "front end", "fe", "ui"].includes(name));
  const be = names.some((name) => ["backend", "back-end", "back end", "be", "api", "server"].includes(name));
  if (fe && be) return { side: "both", why: "Trello labels include frontend and backend" };
  if (fe) return { side: "frontend", why: "Trello label" };
  if (be) return { side: "backend", why: "Trello label" };
  return null;
}

async function explainCard(query) {
  const card = query
    ? await findCard(query)
    : (await trello(`/lists/${(await getList(FROM_LIST)).id}/cards`))[0];

  if (!card) {
    console.log(`No cards in "${FROM_LIST}".`);
    return;
  }

  const { side } = guessSide(card);
  console.log(`Explaining: ${card.name}`);
  console.log(`${card.shortUrl}`);
  console.log(`Looks like: ${side}\n`);

  const desc = card.desc?.trim() || "No description";
  const prompt = `Explain this Trello bug for the Taaluma World Next.js app in this repo. Do not change any code. Do not touch Trello.

Title: ${card.name}
Card: ${card.shortUrl}

${desc}

If the bug is already fixed in this repo, or the page/feature is not in this project, do not change any code. Only return a short message that it is already fixed or not available here.

Otherwise write a short, simple explanation only:
- What is broken (1-2 sentences)
- Where in this app it likely is (page, route, or feature)
- Frontend, backend, or both
- What the user sees vs what should happen

Keep it under 8 lines. No fix. No code. No file edits.`;

  await openCursorAgent(prompt);

  console.log("Review the prompt in the Agent tab and press Send.");
  console.log(`To fix it later:  npm run trello:fix -- ${card.shortLink}`);
}

async function fixCard(query) {
  const card = query
    ? await findCard(query)
    : (await trello(`/lists/${(await getList(FROM_LIST)).id}/cards`))[0];

  if (!card) {
    console.log(`No cards in "${FROM_LIST}".`);
    return;
  }

  console.log(`Opening Cursor Agent: ${card.name}`);
  console.log(`${card.shortUrl}\n`);

  const desc = card.desc?.trim() || "No description";
  const prompt = `Fix this Trello bug in the Taaluma World Next.js app in this repo.

Title: ${card.name}
Card: ${card.shortUrl}

${desc}

Rules:
- If the bug is already fixed in this repo, or the page/feature is not in this project, do not change any code. Only return a short message that it is already fixed or not available here.
- Otherwise make the smallest change that fixes the bug.
- Match existing code style.
- Run npm run lint and fix issues you introduce.
- Do not commit, push, or touch Trello.`;

  await openCursorAgent(prompt);

  console.log("Review the prompt in the Agent tab and press Send.");
  console.log(`When the fix is done:  npm run trello:qa -- ${card.shortLink}`);
}

async function moveToQa(query, extras = {}) {
  const { comment = "", images = [] } = extras;
  const to = await getList(TO_LIST);
  const card = query
    ? await findCard(query)
    : (await trello(`/lists/${(await getList(FROM_LIST)).id}/cards`))[0];

  if (!card) {
    console.log(`No cards in "${FROM_LIST}".`);
    return;
  }

  const files = [];
  for (const image of images) {
    files.push(await resolveImage(image));
  }
  if (comment && images.length === 0) {
    const file = await askClipboardAttachment();
    if (file) files.push(file);
  }

  const alreadyThere = card.idList === to.id;
  if (!alreadyThere) {
    await trello(`/cards/${card.id}?idList=${to.id}`, { method: "PUT" });
  }

  if (comment) {
    await trello(`/cards/${card.id}/actions/comments?text=${encodeURIComponent(comment)}`, {
      method: "POST",
    });
  }

  for (const file of files) {
    await attachToCard(card.id, file);
  }

  console.log(`${alreadyThere ? "Already in" : "Moved to"} "${TO_LIST}": ${card.name}`);
  console.log(card.shortUrl);
  if (comment) console.log(`Comment: ${comment}`);
  for (const file of files) console.log(`Attached: ${file}`);
}

async function resolveImage(source) {
  if (source === "screenshot" || source === "paste" || source === "clipboard") {
    const copied = await tryClipboardImage();
    if (copied) return copied;
    throw new Error("No image on clipboard. Copy a screenshot, then run again.");
  }
  return source;
}

function waitForEnter(message) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer || "");
    });
  });
}

async function askClipboardAttachment() {
  const copied = await tryClipboardImage();
  const answer = await waitForEnter("Do you want the attachment from your clipboard? (y/n) ");
  if (!/^y(es)?$/i.test(answer.trim())) return null;

  if (copied) return copied;

  const again = await tryClipboardImage();
  if (again) return again;

  throw new Error("No image on clipboard. Copy a screenshot, then run again.");
}

function tryClipboardImage() {
  return saveClipboardImage().catch(() => null);
}

function saveClipboardImage() {
  if (process.platform !== "darwin") {
    throw new Error("--paste only works on macOS");
  }

  const filePath = path.join(os.tmpdir(), `trello-clipboard-${Date.now()}.png`);
  const script = `
set outPath to ${JSON.stringify(filePath)}
set pngData to missing value
try
  set pngData to (the clipboard as «class PNGf»)
end try
if pngData is missing value then error "No image on clipboard. Copy or paste a screenshot, then run again with --paste."
set fileRef to open for access (POSIX file outPath) with write permission
set eof of fileRef to 0
write pngData to fileRef
close access fileRef
`;

  return new Promise((resolve, reject) => {
    execFile("osascript", ["-e", script], (err, _stdout, stderr) => {
      if (err) {
        reject(new Error(stderr?.trim() || err.message));
        return;
      }
      resolve(filePath);
    });
  });
}

async function attachToCard(cardId, source) {
  if (/^https?:\/\//i.test(source)) {
    const name = path.basename(new URL(source).pathname) || "image";
    await trello(
      `/cards/${cardId}/attachments?url=${encodeURIComponent(source)}&name=${encodeURIComponent(name)}`,
      { method: "POST" }
    );
    return;
  }

  const filePath = path.resolve(source);
  if (!fs.existsSync(filePath)) throw new Error(`Image not found: ${source}`);

  const name = path.basename(filePath);
  const form = new FormData();
  form.append("file", new Blob([fs.readFileSync(filePath)]), name);
  form.append("name", name);
  form.append("key", KEY);
  form.append("token", TOKEN);

  const res = await fetch(`https://api.trello.com/1/cards/${cardId}/attachments`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Trello API ${res.status}: ${await res.text()}`);
}

async function findCard(query) {
  const id = parseCardId(query);
  if (id) {
    try {
      return await trello(`/cards/${id}?fields=${CARD_FIELDS}`);
    } catch {
      throw new Error(`Card not found: ${query}`);
    }
  }

  const cards = await trello(`/boards/${BOARD_ID}/cards?fields=${CARD_FIELDS}`);
  const needle = query.trim().toLowerCase();
  const matches = cards.filter((card) => card.name.toLowerCase().includes(needle));

  if (matches.length === 1) return matches[0];
  if (matches.length === 0) throw new Error(`No card matching "${query}".`);

  console.log(`Several cards match "${query}":\n`);
  for (const card of matches.slice(0, 20)) {
    console.log(`  • ${card.name}`);
    console.log(`    npm run trello -- ${card.shortLink}`);
  }
  if (matches.length > 20) console.log(`  …and ${matches.length - 20} more`);
  throw new Error("Pass the card id from the list above.");
}

function parseCardId(query) {
  const fromUrl = query.match(/trello\.com\/c\/([a-zA-Z0-9]+)/);
  if (fromUrl) return fromUrl[1];
  if (/^[a-zA-Z0-9]{8}$/.test(query) || /^[a-f0-9]{24}$/i.test(query)) return query;
  return null;
}

async function openCursorAgent(prompt) {
  const promptFile = path.join(os.tmpdir(), `trello-fix-${Date.now()}.md`);
  fs.writeFileSync(promptFile, prompt);

  let text = prompt;
  let url = promptDeeplink(text);
  if (url.length > 7800) {
    text = `Fix this Trello bug. Read the full instructions in ${promptFile} and follow them.`;
    url = promptDeeplink(text);
  }

  focusCursorWindow();
  await copyToClipboard(prompt);
  await openUrl(url);
}

function promptDeeplink(text) {
  const url = new URL("cursor://anysphere.cursor-deeplink/prompt");
  url.searchParams.set("text", text);
  return url.toString();
}

function focusCursorWindow() {
  const cursorBin = cursorCliPath();
  if (!cursorBin) return;
  spawn(cursorBin, ["-r", process.cwd()], {
    detached: true,
    stdio: "ignore",
  }).unref();
}

function cursorCliPath() {
  const candidates = [
    "/Applications/Cursor.app/Contents/Resources/app/bin/cursor",
    path.join(os.homedir(), ".local/bin/cursor"),
  ];
  return candidates.find((file) => fs.existsSync(file)) || null;
}

function openUrl(url) {
  const [cmd, args] =
    process.platform === "darwin"
      ? ["open", [url]]
      : process.platform === "win32"
        ? ["cmd", ["/c", "start", "", url]]
        : ["xdg-open", [url]];

  return new Promise((resolve, reject) => {
    execFile(cmd, args, (err) => (err ? reject(err) : resolve()));
  });
}

function copyToClipboard(text) {
  if (process.platform !== "darwin") return Promise.resolve();

  return new Promise((resolve, reject) => {
    const child = spawn("pbcopy");
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error("Could not copy prompt to clipboard"))
    );
    child.stdin.end(text);
  });
}

async function getList(name) {
  const lists = await trello(`/boards/${BOARD_ID}/lists?filter=open`);
  const list = lists.find((item) => sameName(item.name, name));
  if (!list) {
    throw new Error(`List "${name}" not found. Board lists: ${lists.map((item) => item.name).join(", ")}`);
  }
  return list;
}

function sameName(a, b) {
  const left = normalizeListName(a);
  const right = normalizeListName(b);
  return left === right || left.includes(right) || right.includes(left);
}

function normalizeListName(name) {
  return name
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .trim()
    .toLowerCase();
}

async function trello(apiPath, options = {}) {
  const join = apiPath.includes("?") ? "&" : "?";
  const url = `https://api.trello.com/1${apiPath}${join}key=${encodeURIComponent(KEY)}&token=${encodeURIComponent(TOKEN)}`;
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Trello API ${res.status}: ${await res.text()}`);
  return res.json();
}

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name} in .env.local`);
  return value;
}

function loadEnv(file) {
  const envPath = path.join(process.cwd(), file);
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
