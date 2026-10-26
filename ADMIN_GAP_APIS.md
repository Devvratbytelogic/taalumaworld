# Admin gap APIs

These routes were added for the admin panel. Every JSON response uses the standard envelope. Send the access token as `Authorization: Bearer <token>`.

```json
{
  "http_status_code": 200,
  "http_status_msg": "OK",
  "success": true,
  "data": {},
  "message": "",
  "timestamp": "2026-10-21T00:00:00.000Z"
}
```

Base path: `/api/admin`.

Pagination on every list is `page` (default `1`) and `limit` (default `20`, maximum `100`). The list payload always includes `data`, `total`, `page`, `limit`, and `totalPages`.

A missing or invalid token returns **401**. A Mentor or Career Architect calling a staff-only route returns **403** with `You don't have permission to access this resource.`

| API | Who can call it |
| --- | --- |
| Wishlists | Super Administrator, staff, and Mentor. A Mentor only sees saves of series they created and blueprints on those series. |
| Addresses | Super Administrator and staff |
| Referral wallets | Super Administrator and staff |
| Institution students | Super Administrator and staff |
| Coupon usage and redemptions | Super Administrator and staff |

Staff includes Finance Administrator and custom staff roles.

Date filters accept `YYYY-MM-DD` or a full timestamp. A date-only `to` value includes the whole day. `fromDate` and `toDate` are accepted wherever `from` and `to` are accepted.

---

## 1. Wishlists

`GET /api/admin/wishlists`

Saved series and blueprints. Staff see every save. A Mentor sees only saves of their own series and of blueprints that belong to those series.

### Query

| Query | Required | Values |
| --- | --- | --- |
| `page` | no | Default `1` |
| `limit` | no | Default `20`, max `100` |
| `view` | no | `list` (default) or `aggregate` |
| `type` | no | `series`, `blueprint`, `book`, or `chapter` |
| `user_id` | no | User Mongo id |
| `series_id` | no | That series, plus blueprints that belong to it. `book_id` is also accepted. |
| `blueprint_id` | no | One blueprint. `chapter_id` is also accepted. |
| `item_id` | no | Exact saved item id |
| `search` | no | User name, email, or series/blueprint title |
| `from`, `to` | no | Saved date (`createdAt`) |
| `format` | no | `csv` downloads a file and skips the JSON envelope |

`view=aggregate` groups by item and sorts by save count, then latest save. `format=csv` exports up to 10,000 rows and ignores `page`.

Invalid `view` or `type` returns **400**.

### List row

`type` in JSON is `series` or `blueprint`. `legacyType` is the stored value `book` or `chapter`.

```json
{
  "id": "wishlist id",
  "type": "blueprint",
  "legacyType": "chapter",
  "item_id": "item id",
  "saved_at": "2026-10-21T00:00:00.000Z",
  "user": { "id": "user id", "name": "Ada", "email": "ada@example.com" },
  "series": null,
  "blueprint": {
    "id": "blueprint id",
    "title": "Blueprint title",
    "slug": "blueprint-slug",
    "series_id": "series id",
    "series_title": "Series title"
  }
}
```

A series save fills `series` (`id`, `title`, `slug`) and leaves `blueprint` null.

### Aggregate row

```json
{
  "type": "series",
  "legacyType": "book",
  "item_id": "series id",
  "saves": 12,
  "last_saved_at": "2026-10-21T00:00:00.000Z",
  "series": { "id": "series id", "title": "Series title", "slug": "series-slug" },
  "blueprint": null
}
```

### CSV

`format=csv` returns `text/csv`.

List file `wishlists.csv`:

```text
saved_at,user_name,user_email,type,title,series
```

Aggregate file `wishlist-summary.csv`:

```text
type,title,series,saves,last_saved_at
```

`type` in the CSV is `Series` or `Blueprint`.

```bash
curl "http://127.0.0.1:7100/api/admin/wishlists?page=1&limit=20" \
  -H "Authorization: Bearer TOKEN"

curl "http://127.0.0.1:7100/api/admin/wishlists?view=aggregate&type=blueprint" \
  -H "Authorization: Bearer TOKEN"

curl "http://127.0.0.1:7100/api/admin/wishlists?format=csv" \
  -H "Authorization: Bearer TOKEN" -o wishlists.csv
```

Message: `Wishlists fetched successfully`.

---

## 2. User addresses

One handler, three URLs. `user_id` is required on the query routes. The path route takes the id from the URL.

- `GET /api/admin/addresses?user_id=`
- `GET /api/admin/user-addresses?user_id=`
- `GET /api/admin/users/:id/addresses`

The id may be the user Mongo id or the numeric user id. This returns every saved address for that user, including Mentor, Career Architect, and Institutional Career Architect. There is no role filter on the target user.

Missing id returns **400** `User id is required`. An id that is neither a Mongo id nor a number returns **400** `Invalid user id`. An unknown user returns **404** `User not found`. A user with no addresses returns **200** and `data: []`.

### Query

| Query | Required | Values |
| --- | --- | --- |
| `user_id` or `id` | yes, unless the id is in the path | Mongo id or numeric user id |
| `page` | no | Default `1` |
| `limit` | no | Default `20`, max `100` |

Default address is first, then newest.

### Response `data`

```json
{
  "user": {
    "id": "user mongo id",
    "name": "Ada",
    "email": "ada@example.com",
    "role": "Mentor",
    "user_type": "mentor"
  },
  "data": [
    {
      "_id": "address id",
      "user_id": "user mongo id",
      "full_name": "Ada Lovelace",
      "phone": "+234000000000",
      "address_line1": "12 Broad Street",
      "address_line2": null,
      "landmark": null,
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "postal_code": "100001",
      "isDefault": true,
      "createdAt": "2026-10-21T00:00:00.000Z",
      "updatedAt": "2026-10-21T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

`user_type` is `mentor`, `user` (Career Architect and Institutional Career Architect), or `staff`.

```bash
curl "http://127.0.0.1:7100/api/admin/addresses?user_id=USER_ID&page=1&limit=20" \
  -H "Authorization: Bearer STAFF_TOKEN"
```

Message: `Addresses fetched successfully`.

---

## 3. Referral wallets

`GET /api/admin/referral-wallets`

Every user except rejected and deleted accounts, with wallet and referral totals on each row. This is a list only. It does not return the referral chain or the credit ledger.

Rejected and deleted users stay out unless `status` is set to `rejected` or `deleted`.

### Query

| Query | Required | Values |
| --- | --- | --- |
| `page`, `limit` | no | Default `1` and `20`, max `100` |
| `search` | no | Name, email, or referral code (`short_code`) |
| `role` | no | Role name, case-insensitive. An unknown role returns an empty page. |
| `user_type` | no | `mentor`, `user`, `staff`, or `all`. Ignored when `role` is set. |
| `status` | no | `active`, `inactive`, `suspended`, `pending`, `rejected`, `retired`, `deleted` |
| `from`, `to` | no | Limits referral counts to referrals created in this range. Wallet balance is not date-scoped. |
| `has_referrals` | no | `true` or `false` |
| `has_completed` | no | `true` or `false`. Completed means the referred user purchased. |
| `has_balance` | no | `true` or `false`. `true` means wallet balance is greater than 0. |
| `sort` | no | `created_at` (default), `name`, `balance`, `referrals`, `completed` |
| `order` | no | `asc` or `desc`. Default is `desc`, except `name` defaults to `asc`. |

`user_type=user` is Career Architect and Institutional Career Architect. `user_type=staff` is every role that is not Mentor and not a Career Architect role.

Invalid `sort`, `order`, `user_type`, `status`, or boolean flag returns **400**.

### Row

```json
{
  "id": "user id",
  "name": "Ada",
  "email": "ada@example.com",
  "profile_pic": "https://example.com/pic.jpg",
  "role": "Mentor",
  "user_type": "mentor",
  "status": "active",
  "referral_code": "ADA123",
  "wallet_balance": 25.5,
  "lifetime_earnings": 40,
  "lifetime_spent": 14.5,
  "total_referrals": 4,
  "completed_referrals": 1,
  "pending_referrals": 3,
  "conversion_rate": 25,
  "commission": 10
}
```

`conversion_rate` is a percentage. `commission` is credited commission only. Users with no wallet return zeros.

```bash
curl "http://127.0.0.1:7100/api/admin/referral-wallets?page=1&limit=20" \
  -H "Authorization: Bearer STAFF_TOKEN"
```

Message: `Referral accounts fetched successfully`.

---

## 4. Institution students

`GET /api/admin/institutions/:id/users`

Students linked to that institution. A student is a user whose role is `Institutional Career Architect` and whose `institution_id` is this institution.

`:id` must be the institution Mongo id. An invalid id returns **400** `Invalid institution id`. A missing or soft-deleted institution returns **404** `Institution not found`.

### Query

| Query | Required | Values |
| --- | --- | --- |
| `page`, `limit` | no | Default `1` and `20`, max `100` |
| `search` | no | Name or email |
| `status` | no | `active`, `inactive`, `suspended`, `pending`, `rejected`, `retired`, `deleted` |
| `verified` | no | `true` or `false`. `is_verified` is also accepted. |
| `from`, `to` | no | Join date (`createdAt`) |
| `sort` | no | `created_at` (default), `name`, `email` |
| `order` | no | `asc` or `desc`. Default `desc`. |

Without `status`, rejected and deleted students are omitted.

### Response `data`

```json
{
  "institution": {
    "id": "institution id",
    "name": "University of Lagos",
    "status": "Active",
    "domains": ["unilag.edu.ng"],
    "contact_email": "admin@unilag.edu.ng"
  },
  "data": [
    {
      "id": "user id",
      "name": "Ada",
      "email": "ada@unilag.edu.ng",
      "profile_pic": null,
      "phone": null,
      "status": "active",
      "is_verified": true,
      "role": "Institutional Career Architect",
      "joined_at": "2026-10-21T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

```bash
curl "http://127.0.0.1:7100/api/admin/institutions/INSTITUTE_ID/users?page=1&limit=20" \
  -H "Authorization: Bearer STAFF_TOKEN"
```

Message: `Institution students fetched successfully`.

---

## 5. Coupon usage

`GET /api/admin/coupons/usage`

One row per coupon, with paid-order usage. Soft-deleted coupons are excluded. Only orders with `payment_status: "Paid"` count toward `orders_count`, discount, revenue, and `last_used_at`.

`redeemed_count` is the lifetime counter stored on the coupon. `orders_count` is paid orders, and it follows `from` / `to` when those are set. Those two numbers can differ.

### Query

| Query | Required | Values |
| --- | --- | --- |
| `page`, `limit` | no | Default `1` and `20`, max `100` |
| `search` | no | Coupon code |
| `status` | no | `active`, `inactive`, or `all` |
| `coupon_for` | no | `university`, `event`, `campaign`, `normal`, or `all` |
| `coupon_type` | no | `Percentage`, `Fixed`, or `Free` |
| `has_usage` | no | `true` or `false`, based on paid orders |
| `from`, `to` | no | Limits paid-order stats to this range |
| `sort` | no | `created_at` (default), `code`, `orders`, `discount`, `revenue` |
| `order` | no | `asc` or `desc`. Default is `desc`, except `code` defaults to `asc`. |

### Row

```json
{
  "id": "coupon id",
  "coupon_code": "WELCOME10",
  "coupon_type": "Percentage",
  "coupon_for": "normal",
  "value": 10,
  "status": "active",
  "expiry_date": "2026-12-31T00:00:00.000Z",
  "usage_limit": 100,
  "redeemed_count": 8,
  "uses_remaining": 92,
  "orders_count": 8,
  "total_discount_given": 40,
  "total_revenue": 360,
  "last_used_at": "2026-10-21T00:00:00.000Z"
}
```

`uses_remaining` is `null` when `usage_limit` is null.

```bash
curl "http://127.0.0.1:7100/api/admin/coupons/usage?page=1&limit=20" \
  -H "Authorization: Bearer STAFF_TOKEN"
```

Message: `Coupon usage fetched successfully`.

---

## 6. Coupon redemptions

`GET /api/admin/coupons/:id/redemptions`

Paid redemptions for one coupon. `:id` may be the coupon Mongo id or the coupon code. Unknown id or code returns **404** `Coupon not found`.

The coupon header is only `id`, `coupon_code`, `coupon_type`, `coupon_for`, `value`, and `status`.

### Query

| Query | Required | Values |
| --- | --- | --- |
| `page`, `limit` | no | Default `1` and `20`, max `100` |
| `search` | no | User name, email, order number, or numeric order id |
| `from`, `to` | no | Order `createdAt` |

Newest redemption first.

### Row

```json
{
  "coupon": {
    "id": "coupon id",
    "coupon_code": "WELCOME10",
    "coupon_type": "Percentage",
    "coupon_for": "normal",
    "value": 10,
    "status": "active"
  },
  "data": [
    {
      "id": "order id",
      "order_number": "ORD-1001",
      "redeemed_at": "2026-10-21T00:00:00.000Z",
      "discount": 10,
      "order_total": 90,
      "user": { "id": "user id", "name": "Ada", "email": "ada@example.com" }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

`redeemed_at` is `paid_at` when present, otherwise the order `createdAt`. `discount` is `coupon_discount`, or `discount_amount` when the coupon discount is missing. `user` is `null` when the account cannot be loaded.

```bash
curl "http://127.0.0.1:7100/api/admin/coupons/COUPON_ID/redemptions?page=1&limit=20" \
  -H "Authorization: Bearer STAFF_TOKEN"
```

Message: `Coupon redemptions fetched successfully`.
