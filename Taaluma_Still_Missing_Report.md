# Taaluma Admin Panel — Still Missing Report
## Current Phase — Pending Implementation

**Verification Date:** 5 November 2026  
**Verified By:** QA — Claude (Cowork Mode)  
**Live URL:** https://taalumaworld.vercel.app  
**Admin Credentials:** admin@taaluma.world / Test@1234 (OTP: 9999)  
**Mentor Credentials:** rohitjoshi@yopmail.com / Test@1234 (OTP: 9999)  

---

## ❌ GAP-004 — Referral Chain / History Drill-down

**Priority:** Medium  
**Original Report Says:**
> "Per-user referral wallet balance + credit ledger", "Referral chain/history drill-down from the performance view", "Manual credit adjustment with audit trail"

---

### Kya Missing Hai — Simple Explanation

**Jo abhi dikh raha hai** (`/admin/referrals/performance` page pe):

| Referrer | Registrations | Conversions | Revenue |
|----------|---------------|-------------|---------|
| Devvrat Sarkar | 3 | 2 | KSh 2,275 |

Bas itna — sirf totals. Rows clickable nahi hain.

**Jo hona chahiye — Drill-down detail page:**

Admin ko kisi bhi referrer ke naam pe click karna chahiye aur ek detail page khulni chahiye:

| Referred User | Join Date | Status | Purchase? | Commission Earned |
|---------------|-----------|--------|-----------|-------------------|
| Rahul Sharma | 12 Oct 2026 | Active | ✅ Yes — KSh 1,380 | KSh 138 |
| Priya Nair | 18 Oct 2026 | Active | ✅ Yes — KSh 895 | KSh 89 |
| Ahmed Omar | 25 Oct 2026 | Registered | ❌ No purchase yet | KSh 0 |

Matlab — **kis specific user ko refer kiya, kab kiya, unhone kharida ya nahi, aur usse exactly kitna commission bana.**

---

### Live Verification Evidence

| Check | Result |
|-------|--------|
| `/admin/referral-wallets` page | ✅ Exists — per-user wallet list (Balance, Earned, Spent, Conv.%) |
| `/admin/referrals/performance` page | ✅ Exists — referrer summary table (214 referrers, 44.44% conversion) |
| Click on referrer row in performance table | ❌ **Not clickable — no drill-down** |
| Click on account name in wallet list | ❌ **Goes to user profile, NOT referral chain** |
| `GET /api/admin/referrals/:id/chain` | **404 Not Found** |
| `GET /api/admin/referrals/:id/wallet` | **404 Not Found** |
| `GET /api/admin/referrals/:id/history` | **404 Not Found** |
| `GET /api/admin/referral-wallets/:id` | **404 Not Found** |
| Manual credit adjustment control | ❌ **Not present** |

---

### How to Reproduce

1. Login as Super Admin → go to `/admin/referrals/performance`
2. Try clicking any referrer row → **nothing happens**
3. Go to `/admin/referral-wallets` → click any account name → **opens user profile, not chain detail**
4. No page exists showing: who was referred, when, did they convert, what commission was earned

---

### Expected Feature (Developer Action Required)

**New page:** `/admin/referral-wallets/:id` or `/admin/referrals/:id/detail`

Should contain:
- **Referral Chain section:** List of users referred by this person — name, email, join date, status (registered/converted), purchase amount, commission earned
- **Credit Ledger section:** Each credit event with date — e.g. "Ahmed Omar converted → +KSh 138 earned on 15 Oct 2026"
- **Manual Adjustment form:** Admin can add/deduct credits with a reason field (creates an audit entry)

**API endpoints needed:**
- `GET /api/admin/referral-wallets/:id` — single wallet detail with chain + ledger
- `POST /api/admin/referral-wallets/:id/adjust` — manual credit adjustment

---

### Screenshot Proof

| File | What It Shows |
|------|---------------|
| `GAP004_referral_wallets_list.jpg` | Referral Wallets list — no clickable drill-down per row |
| `GAP004_referral_performance_no_drilldown.jpg` | Referral Performance page — rows not clickable |

Screenshots saved in: `Downloads/GAP_Missing_Screenshots/`

---

*Report compiled from live verification — 5 November 2026*  
*Verified by QA using Super Admin session (admin@taaluma.world)*
