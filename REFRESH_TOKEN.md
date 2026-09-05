# Refresh token — frontend guide

Backend now issues a short-lived **access token** and a longer-lived **refresh token**. Existing API JSON bodies are unchanged. Refresh is never sent in the response body.

## Token rules

| Token | Where it lives | Lifetime | Used for |
|---|---|---|---|
| Access | `data.token` in login / refresh JSON. FE stores it (memory or localStorage) and sends `Authorization: Bearer <token>` | **15 minutes** | Every authenticated API |
| Refresh | `httpOnly` cookie named `refresh_token`. Browser stores it automatically. JS **cannot** read it | **1 day** | `POST /refresh` only |

Do **not** put the refresh token in localStorage, Redux, or request headers.

## Login (no body change)

Admin / mentor portal:

`POST /api/admin/login`  
`POST /api/admin/verify` (when 2FA completes login)

Career Architect / ICA:

`POST /api/user/login`  
`POST /api/user/auth/google`  
`POST /api/user/auth/linkedin`  
`POST /api/user/auth/meta`

Response is the same as before. Read access token from `data.token` (or whatever wrapper field you already use).

The browser also receives `Set-Cookie: refresh_token=...; HttpOnly; Path=/; ...`.

**Required on every auth request (login, refresh, logout, and all APIs):**

- `credentials: "include"` (fetch)
- `withCredentials: true` (axios)

Without this, the refresh cookie is never stored or sent.

## Calling APIs

Same as today:

```http
Authorization: Bearer <access_token>
```

If the access token is expired, the API returns **401**. Middleware does **not** refresh the token. That is the frontend interceptor’s job.

## Refresh

Call the same origin prefix you used for login.

```http
POST /api/admin/refresh
POST /api/user/refresh
```

- No body
- No `Authorization` header required
- Cookie is sent automatically when `credentials` / `withCredentials` is on

Success `200`:

```json
{
  "success": true,
  "data": { "token": "<new access token>" },
  "message": "Token refreshed successfully"
}
```

Replace the stored access token with `data.token`.

Failure `401` (missing / invalid / revoked / user blocked):

Send the user to login. Clear the stored access token.

## Logout

```http
POST /api/admin/logout
POST /api/user/logout
```

- No auth header required
- Revokes the current refresh session and clears the cookie

Always call logout on sign-out, even if the access token is already expired.

## Axios interceptor (recommended)

Queue parallel 401s so only **one** refresh runs. Then retry the original request.

```js
import axios from "axios";

const api = axios.create({
  baseURL: "https://taluma.plan-it.pro/api",
  withCredentials: true,
});

let accessToken = null;
let refreshPromise = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const refreshAccessToken = async (prefix) => {
  if (!refreshPromise) {
    refreshPromise = api
      .post(`${prefix}/refresh`)
      .then((res) => {
        const token = res.data?.data?.token;
        setAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || "";

    if (status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    if (url.includes("/refresh") || url.includes("/login") || url.includes("/logout")) {
      return Promise.reject(error);
    }

    original._retry = true;
    const prefix = url.startsWith("/admin") ? "/admin" : "/user";

    try {
      await refreshAccessToken(prefix);
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (refreshError) {
      setAccessToken(null);
      // redirect to the matching login page
      return Promise.reject(refreshError);
    }
  },
);

export default api;
```

After login success:

```js
setAccessToken(response.data.data.token);
```

## Fetch equivalent

```js
fetch(`${API}/admin/users`, {
  headers: { Authorization: `Bearer ${accessToken}` },
  credentials: "include",
});
```

On 401 (and the request was not `/refresh`):

```js
const refreshed = await fetch(`${API}/admin/refresh`, {
  method: "POST",
  credentials: "include",
});
const body = await refreshed.json();
if (!refreshed.ok) {
  // go to login
}
accessToken = body.data.token;
// retry the original request with the new Bearer token
```

## CORS / cookie notes

- API already allows credentials (`Access-Control-Allow-Credentials: true`).
- Frontend origin must be in the API CORS allowlist.
- Local HTTP: cookie is `SameSite=Lax`.
- HTTPS / Vercel → API on another host: cookie is `SameSite=None; Secure`.
- Do not set `Authorization` on `/refresh`. The cookie is enough.

## What not to do

- Do not expect a new access token from `GET /users` or any business API.
- Do not read `document.cookie` for `refresh_token` — it is httpOnly.
- Do not loop `/refresh` when `/refresh` itself returns 401.
- Do not fire 5 parallel `/refresh` calls; single-flight as in the interceptor above.

## Quick test

1. Login → response has `token`; DevTools → Application → Cookies → `refresh_token` (HttpOnly).
2. Call any auth API with that Bearer token → 200.
3. Wait 15 minutes or drop the Bearer token → API 401.
4. `POST /admin/refresh` (or `/user/refresh`) with credentials → new `data.token`.
5. Retry the API with the new token → 200.
6. `POST /logout` → cookie gone; `/refresh` now 401.
