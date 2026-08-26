# Trello commands

Run these from the repo root. Credentials live in `.env.local` or `.env` (do not commit those files).

Required:

```
TRELLO_API_KEY
TRELLO_TOKEN
TRELLO_BOARD_ID
```

Optional (defaults match the current Taaluma board):

```
TRELLO_READY_LIST_NAME=🔴 P0 — Critical
TRELLO_QA_LIST_NAME=Re - Testing
```

Current board lists:

- 🟢 P3 — Low
- 🟡 P2 — Medium
- 🟠 P1 — High
- 🔴 P0 — Critical
- Reopened
- Re - Testing
- ✅ Resolved / Fixed

Pass extra arguments after `--`.  
Commands **without an id** use the first card in **🔴 P0 — Critical**.

## Lists and cards

```bash
npm run trello:lists
npm run trello
```

Show open board columns.

```bash
npm run trello -- "P0 — Critical"
npm run trello -- "P1 — High"
npm run trello -- "P2 — Medium"
npm run trello -- "P3 — Low"
```

Show all cards in a list.

```bash
npm run trello -- vtebVuUR
npm run trello -- https://trello.com/c/vtebVuUR
npm run trello -- "mentor profile"
```

Show one card by id, URL, or part of the title.

## Frontend or backend

Uses the card title, description, and labels. This is a guess, not a guarantee.

```bash
npm run trello:side -- vtebVuUR
npm run trello:side -- https://trello.com/c/vtebVuUR
npm run trello:side -- "P0 — Critical"
```

One card prints `frontend`, `backend`, `both`, or `unclear`.  
A list name classifies every card in that column.

## Preview or move backend cards

Default is a **preview**. Nothing is created or moved.

```bash
npm run trello:backend
npm run trello:backend -- "P0 — Critical"
```

Only this flag moves cards (creates a **Backend** list if needed):

```bash
npm run trello:backend -- --move
npm run trello:backend -- "P0 — Critical" --move
```

Cards marked `both` or `unclear` stay put. Resolved / Re - Testing / Reopened lists are skipped unless you pass a list name.

## Explain a card

Opens Cursor Agent with a short explain-only prompt for this Next.js repo. Does not fix code. Does not change Trello.

If the bug is already fixed, or the page/feature is not in this project, Agent only returns a short message.

Without id (first card in **🔴 P0 — Critical**):

```bash
npm run trello:explain
```

With id:

```bash
npm run trello:explain -- vtebVuUR
```

Review the prompt in the Agent tab and press Send.

## Fix a card

Opens Cursor Agent with the card. Does not change Trello.

If the bug is already fixed, or the page/feature is not in this project, do not change code. Agent only returns a short message.

Without id (first card in **🔴 P0 — Critical**):

```bash
npm run trello:fix
```

With id:

```bash
npm run trello:fix -- vtebVuUR
```

Review the prompt in the Agent tab and press Send.

## Move to Re - Testing

Without id (first card in **🔴 P0 — Critical**):

```bash
npm run trello:qa
```

With id:

```bash
npm run trello:qa -- vtebVuUR
```

These only move the card. They do not ask about the clipboard.

## Move with a comment

Without id:

```bash
npm run trello:qa -- --comment "Done"
```

With id:

```bash
npm run trello:qa -- vtebVuUR --comment "Done"
```

Copy a screenshot first, then this asks:

```
Do you want the attachment from your clipboard? (y/n)
```

- `y` — attach it, then move the card.
- `n` — move with the comment only.
- `y` with no image on the clipboard — stop. The card is not moved.

## Typical flow

```bash
npm run trello
npm run trello -- "P0 — Critical"
npm run trello:side -- "P0 — Critical"
npm run trello:explain
npm run trello:explain -- vtebVuUR
npm run trello:fix
npm run trello:fix -- vtebVuUR
npm run trello:qa
npm run trello:qa -- vtebVuUR
npm run trello:qa -- --comment "Done"
npm run trello:qa -- vtebVuUR --comment "Done"
```
