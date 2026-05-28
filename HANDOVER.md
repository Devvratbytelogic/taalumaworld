# TaalumaWorld — Handover

## Project Overview

**TaalumaWorld** is a Next.js frontend for a digital content marketplace. Users browse, purchase, and read **books** and **blueprints**. Admins and authors manage content via `/admin`.


|              |                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| **Repo**     | [https://github.com/Devvratbytelogic/taalumaworld](https://github.com/Devvratbytelogic/taalumaworld) |
| **Stack**    | Next.js 16 · React 19 · TypeScript · Redux Toolkit · HeroUI · Tailwind CSS 4                         |
| **Backend**  | Separate REST API — this repo is frontend only                                                       |
| **Payments** | M-Pesa (primary, cart + direct purchase)                                                             |


### Key Packages


| Package                                      | Why it's used                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Next.js 16**                               | App Router, routing, and the `/api` route for server-side logic                           |
| **React 19**                                 | UI layer for all pages and components                                                     |
| **TypeScript**                               | Type safety across API responses, Redux state, and forms                                  |
| **Redux Toolkit + React Redux**              | Global state (cart, modals, reading progress) and **RTK Query** for all backend API calls |
| **HeroUI**                                   | Primary component library — modals, inputs, toasts, and admin UI                          |
| **Tailwind CSS 4**                           | Utility-first styling across the app                                                      |
| **Formik + Yup**                             | Form state and validation for auth, admin CRUD, checkout, and settings                    |
| **js-cookie**                                | Stores auth tokens and user metadata in browser cookies                                   |
| **react-markdown + remark-gfm + rehype-raw** | Renders blueprint/book content as formatted markdown for readers                          |
| **sonner**                                   | Toast notifications for success/error feedback (e.g. payments, form saves)                |
| **nextjs-toploader**                         | Top loading bar on page navigation                                                        |
| **moment**                                   | Date formatting in user dashboard settings                                                |


---

## Quick Start

```bash
git clone https://github.com/Devvratbytelogic/taalumaworld.git
cd taalumaworld
npm install
```

Create `.env.local` (see below), then:

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # run production build
npm run lint     # ESLint
```

**Requirements:** Node.js 20+

---

## Environment Variables

Create `.env.local` in the project root:

```env
# Required
NEXT_PUBLIC_API_BASE_URL=https://dev-api.taaluma.world/api
```


| Variable                   | Required | Description                                                       |
| -------------------------- | -------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes      | Backend API base URL (used by RTK Query in `src/utils/config.ts`) |


---

## Key Routes


| Route                                                  | Purpose                                           |
| ------------------------------------------------------ | ------------------------------------------------- |
| `/`                                                    | Home / content library                            |
| `/cart`                                                | Shopping cart + M-Pesa checkout                   |
| `/read-chapter/[id]`                                   | Read a blueprint                                  |
| `/read-book/[id]`                                      | Read a book                                       |
| `/user-dashboard`                                      | User account (library, settings, reading history) |
| `/authors`                                             | Author listing                                    |
| `/admin`                                               | Admin panel (redirects to dashboard)              |
| `/admin/dashboard`                                     | Admin home                                        |
| `/admin/books`, `/admin/chapters`, `/admin/authors`, … | Admin CRUD sections                               |


Full route helpers live in `src/routes/routes.ts`.

---

## Project Structure

```
src/
├── app/                    # Pages (App Router)
├── components/             # UI (admin, auth, cart, layout, modals, payments)
├── store/
│   ├── services/           # RTK Query base setup (auth headers, error toasts)
│   ├── rtkQueries/         # API endpoint definitions
│   └── slices/             # Redux slices (cart, reading, modals, etc.)
├── hooks/                  # useAuth, useMpesaPaymentFlow, etc.
├── routes/routes.ts        # Route path helpers
├── utils/                  # config, auth cookies, validation
└── proxy.ts                # Route protection logic (not wired yet — see Notes)
```

All API calls go through RTK Query (`src/store/services/rtkQuerieSetup.ts`) and hit `NEXT_PUBLIC_API_BASE_URL`.

---

## Auth

- Login/signup runs through **modals**.
- Cookies set on login: `auth_token`, `userID`, `user_role`, `device`.
- All API requests automatically send `Authorization: Bearer <token>` plus `userID` and `device` headers.

**Roles:** `user` (reader) · `admin` · `author`

### Test Credentials

Use these accounts to log in via the site sign-in modal (admin/author both access `/admin` after login).

**Admin**


|              |                       |
| ------------ | --------------------- |
| **Email**    | `admin@taaluma.world` |
| **Password** | `12345678`            |


**Author**


|              |                            |
| ------------ | -------------------------- |
| **Email**    | `danielmuchika@gmail.com`  |
| **Password** | Reset yourself (if needed) |


---

## Payments

- **M-Pesa:** Powers checkout on `/cart` and in the blueprint purchase modal. After the STK push is sent, the app polls the backend until payment succeeds or times out.

---

