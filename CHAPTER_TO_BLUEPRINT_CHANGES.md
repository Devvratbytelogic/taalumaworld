# Chapter → Blueprint: User-Facing Text Changes

This document lists every place where user-facing copy was updated from **chapter/chapters** to **blueprint/blueprints**. Internal identifiers (API routes, types, enum values, variable names, database keys, programmatic strings, HTML `id`s, etc.) were **not** changed.

Abbreviation **Ch.** in search/author results was updated to **Bp.** (blueprint).

---

## User dashboard

| File | Before | After |
|------|--------|-------|
| `src/components/pages-components/user-dashboard/MyChaptersPage.tsx` | My Chapters | My Blueprints |
| | Your personal collection of purchased chapters | …purchased blueprints |
| | Total Chapters | Total Blueprints |
| | `{n} chapter(s)` | `{n} blueprint(s)` |
| | Chapter {number} | Blueprint {number} |
| | No Chapters Yet / …Chapters | No Blueprints Yet / …Blueprints |
| | You haven't purchased any chapters yet… | …any blueprints yet… |
| | No chapters match this filter | No blueprints match this filter |
| | Browse Chapters / Show All Chapters | Browse Blueprints / Show All Blueprints |
| `src/components/pages-components/user-dashboard/DashboardHome.tsx` | …explore new chapters | …explore new blueprints |
| | My Chapters / …chapter(s) owned / …purchased chapters | My Blueprints / …blueprint(s)… |
| | Explore Chapters | Explore Blueprints |
| `src/components/pages-components/user-dashboard/UserDashboard.tsx` | My Chapters (nav label) | My Blueprints |
| `src/components/pages-components/user-dashboard/ReadingHistory.tsx` | Chapter {number} | Blueprint {number} |
| | …recently read chapters… | …recently read blueprints… |
| | Browse Chapters | Browse Blueprints |
| `src/components/pages-components/user-dashboard/MyBooksPage.tsx` | {n} chapters | {n} blueprints |

## Header & navigation

| File | Before | After |
|------|--------|-------|
| `src/components/layout/header/PrimaryHeader.tsx` | My Chapters | My Blueprints |
| `src/components/layout/header/GlobalSearchBar.tsx` | Search books, chapters, authors… | …blueprints, authors… |
| | Chapters (section heading) | Blueprints |
| | Ch. {n} · {book} | Bp. {n} · {book} |
| `src/components/layout/header/MobileSearchBar.tsx` | (same three as GlobalSearchBar) | (same) |

## Home & content discovery

| File | Before | After |
|------|--------|-------|
| `src/components/pages-components/home/FilterOptions.tsx` | `{n} blueprints found` (display label; fixed modal to pass internal `chapters` mode) | — |
| `src/components/modals/FilterModal.tsx` | Chapters you started / Unread Chapters / …chapters… / Chapters you own | Blueprints you started / Unread Blueprints / …blueprints… / Blueprints you own |
| | Filter Chapters | Filter Blueprints |
| | Filter chapters based on… | Filter blueprints based on… |
| `src/components/cards/CommonCard.tsx` | By Chapter | By Blueprint |
| | {n} chapters / View Chapters | {n} blueprints / View Blueprints |
| | Blueprint {number} (badge; already updated) | — |
| `src/components/cards/BookCard.tsx` | By Chapter / {n} chapters / View Chapters | By Blueprint / {n} blueprints / View Blueprints |
| `src/components/cards/ContinueReadingCard.tsx` | Chapter {sequence} | Blueprint {sequence} |
| `src/app/authors/page.tsx` | Chapters (section heading) | Blueprints |
| | Ch. {n} · {book} | Bp. {n} · {book} |
| `src/data/data.ts` | Explore Chapters (about banner CTA) | Explore Blueprints |

## Reading experience

| File | Before | After |
|------|--------|-------|
| `src/app/read-chapter/[chapterId]/page.tsx` | Chapter not found | Blueprint not found |
| | …• Chapter {n} | …• Blueprint {n} |
| | No content available for this chapter | …this blueprint |
| | End of Chapter {n} | End of Blueprint {n} |
| | Continue to Next Chapter | Continue to Next Blueprint |
| | …end of available chapters | …available blueprints |
| | Chapter (nav label) / Previous Chapter / Next Chapter | Blueprint / Previous Blueprint / Next Blueprint |
| `src/app/read-book/[bookId]/page.tsx` | {n} chapter(s) | {n} blueprint(s) |
| | All Chapters | All Blueprints |
| | No chapters available yet | No blueprints available yet |
| | Unlock all {n} chapters | Unlock all {n} blueprints |
| `src/components/pages-components/chapter/ChapterPurchaseModal.tsx` | Chapter purchased successfully! | Blueprint purchased successfully! |
| | Chapter Locked | Blueprint Locked |
| | Chapter {n} / …this chapter… / Chapter Price: | Blueprint {n} / …this blueprint… / Blueprint Price: |
| | …access to this chapter… | …this blueprint… |
| `src/components/modals/CommonCardDetailsModal.tsx` | Access all {n} chapters | Access all {n} blueprints |
| | Purchase individual chapters below | …blueprints below |
| | Chapters ({n}) | Blueprints ({n}) |
| | No chapters available yet | No blueprints available yet |
| | Chapter {number} (row badge) | Blueprint {number} |
| | Read Free Chapter / Read Chapter | Read Free Blueprint / Read Blueprint |
| | About this Chapter | About this Blueprint |

## Cart & checkout

| File | Before | After |
|------|--------|-------|
| `src/components/pages-components/cart/CartPage.tsx` | {n} chapter(s) (summary) | {n} blueprint(s) |
| | Chapter {number} (badge) | Blueprint {number} |
| `src/components/pages-components/cart/CartNoData.tsx` | …adding chapters… / Browse Chapters | …adding blueprints… / Browse Blueprints |
| `src/components/pages-components/cart/PaymentConfirmed.tsx` | Your chapters are now unlocked… | Your blueprints are now unlocked… |
| `src/components/pages-components/cart/CheckoutPage.tsx` | Your chapters are now unlocked… / Your New Chapters | …blueprints… / Your New Blueprints |

## Auth & account

| File | Before | After |
|------|--------|-------|
| `src/components/auth/LoginRequiredModal.tsx` | …this chapter / …chapter details (when `itemType === 'chapter'`) | …this blueprint / …blueprint details |
| | Access your purchased chapters and books | …purchased blueprints and books |

## Admin — blueprints management

| File | Before | After |
|------|--------|-------|
| `src/components/admin/chapter/AdminChaptersHeader.tsx` | Chapters Management / Manage all chapters / Create New Chapter | Blueprints Management / …blueprints / Create New Blueprint |
| `src/app/admin/chapter/create/page.tsx` | ← Back to Chapters / Create New Chapter | ← Back to Blueprints / Create New Blueprint |
| `src/app/admin/chapter/edit/[id]/page.tsx` | ← Back to Chapters / Edit Chapter | ← Back to Blueprints / Edit Blueprint |
| `src/app/admin/layout.tsx` | Chapters (sidebar label) | Blueprints |
| `src/components/admin/layout/AdminHeader.tsx` | Chapters / Manage all chapters / Create Chapter / …keywords | Blueprints / …blueprints / Create Blueprint / …blueprint keywords |
| | Chapters (content mode toggle) | Blueprints |
| `src/components/admin/chapter/CreateChapterForm.tsx` | Chapter created successfully / Failed to create chapter | Blueprint created… / Failed to create blueprint |
| | Brief description of the chapter… | …the blueprint… |
| | Chapter content / Write your chapter content… | Blueprint content / Write your blueprint content… |
| | Attach a PDF…this chapter | …this blueprint |
| | Chapter Number / Free chapter | Blueprint Number / Free blueprint |
| | …this chapter has no separate price | …this blueprint… |
| | Chapter preview (alt) / Create Chapter | Blueprint preview / Create Blueprint |
| `src/components/admin/chapter/EditChapterForm.tsx` | (same form strings as CreateChapterForm) | (same blueprint equivalents) |
| | Update Chapter | Update Blueprint |
| `src/components/admin/chapter/ChapterListing.tsx` | Chapter marked as… / Chapter Title / Chapter {n} | Blueprint marked as… / Blueprint Title / Blueprint {n} |
| | No chapters found / …match… / Create your first chapter | No blueprints found / … / Create your first blueprint |
| `src/components/admin/chapter/DeleteChapterDialog.tsx` | Delete Chapter | Delete Blueprint |
| `src/components/admin/chapter/ChapterPreviewModal.tsx` | Chapter Preview / …chapter details / Chapter {n} / (Free chapter) / Chapter Number | Blueprint Preview / …blueprint details / Blueprint {n} / (Free blueprint) / Blueprint Number |
| `src/components/admin/chapter/AdminChaptersSearch.tsx` | …or chapter number… | …or blueprint number… |

## Admin — dashboard, settings & books

| File | Before | After |
|------|--------|-------|
| `src/components/admin/dashboard/DashboardWelcomeHeader.tsx` | Chapter Mode | Blueprint Mode |
| `src/components/admin/dashboard/DashboardTopContent.tsx` | Top Chapters | Top Blueprints |
| `src/components/admin/dashboard/DashboardQuickActions.tsx` | Chapters/books not yet published | Blueprints/books not yet published |
| `src/components/admin/dashboard/AdminDashboardTab.tsx` | Total Chapters / Total Chapters (swapped stat) | Total Blueprints / Total Blueprints |
| `src/components/admin/reports/AdminReportsHeader.tsx` | Chapter Mode | Blueprint Mode |
| `src/components/admin/analytics/AdminAnalyticsHeader.tsx` | Chapter Mode | Blueprint Mode |
| `src/components/admin/settings/ContentModeSettingsCard.tsx` | Chapter-focused / Chapter Mode / Chapters / individual chapters | Blueprint-focused / Blueprint Mode / Blueprints / individual blueprints |
| `src/components/admin/settings/GeneralSettingsCard.tsx` | …Chapter mode / Chapter (toggle) / meta placeholder …chapters | …Blueprint mode / Blueprint / …blueprints |
| `src/components/admin/books/AddBookModal.tsx` | SelectItem display: chapter | blueprint (value `chapter` unchanged) |
| `src/components/admin/books/EditBookModal.tsx` | SelectItem display: chapter | blueprint |
| `src/components/admin/books/BookPreviewModal.tsx` | per chapter | per blueprint |

## Validation, hooks & permissions

| File | Before | After |
|------|--------|-------|
| `src/utils/formValidation.ts` | Please enter a chapter title | Please enter a blueprint title |
| | …paid chapters / …when chapter is not free | …paid blueprints / …when blueprint is not free |
| `src/hooks/useCart.ts` | You already own this chapter | You already own this blueprint |
| `src/hooks/useMpesaPaymentFlow.ts` | …could not unlock the chapter | …unlock the blueprint |
| `src/utils/adminPermissions.ts` | Manage books, chapters, and categories | Manage books, blueprints, and categories |

## Legal, FAQ & misc

| File | Before | After |
|------|--------|-------|
| `src/app/terms-of-service/page.tsx` | Chapter-by-Chapter: Purchase individual chapters… | Blueprint-by-Blueprint: Purchase individual blueprints… |
| `src/components/search/FaqSearch.tsx` | Reading & Chapters | Reading & Blueprints |
| `src/components/editor/RichTextEditor.tsx` | Write your chapter content here… (default placeholder) | Write your blueprint content here… |
| `src/components/admin/activity-logs/AdminActivityLogsTab.tsx` | Purchased chapter (sample log) | Purchased blueprint |
| `src/components/admin/moderation/AdminModerationTab.tsx` | Career Chapter (sample item) | Career Blueprint |

---

## Intentionally unchanged (examples)

- Route paths: `/read-chapter/`, `/admin/chapters`, `?tab=my-chapters`
- API endpoints, RTK tags, Redux slice names, component/file names
- Types: `IChapterItem`, `ContentMode = 'chapters'`, `VISIBLE.CHAPTER = 'chapter'`
- Programmatic props: `itemType: 'chapter'`, `type: 'chapter'`, `displayMode: 'chapters'`
- HTML element IDs: `chapter-title`, `chapter-desc`, etc.
- Payment/review labels already using **Focus Area** (no word “chapter”)
- Comment-only JSX/code comments containing “chapter”

---

*Generated as part of the chapter → blueprint user-facing copy migration.*
