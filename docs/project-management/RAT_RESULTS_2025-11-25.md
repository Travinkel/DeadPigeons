# Requirements Acceptance Testing — Results (2025-11-25)

Environment:
- API: http://localhost:5000 (local)
- Client: http://localhost:5173
- Database: Local PostgreSQL, year = 2025
- Tester: Stefan Ankersø
- Seed data: INIT-APPROVED-500, INIT-PENDING-200, demo boards + games

Related docs:
- Test plan: `docs/testing/MANUAL_TEST_PLAN_SPRINT_5.md`
- Quick checklist: `docs/testing/QUICK_TEST_REFERENCE.md`
- Exam checklist: `docs/internal/EXAM_PREP_CHECKLIST.md`

---

## 1. Summary

| Suite | Area                              | Result      | Notes |
|-------|-----------------------------------|------------|-------|
| 1     | Authentication                    | ✅ PASS     | Admin + player login OK; inactive player blocked. |
| 2     | Player Active Check               | ✅ PASS     | 2.1 + 2.2 behave as expected. Deactivated player cannot login at all. |
| 3     | Game workflow                     | ⚠️ PARTIAL  | Game completion + auto-activation work, but **"Next game" UI shows wrong year (2024)** and wording suggests manual activation even though it auto-activates. |
| 4     | Board purchase & balance          | ✅ PASS     | Prices, min/max numbers, insufficient balance, and auto-repeat all work logically. Confirmation UX can be improved. |
| 5     | Admin transactions                | ⚠️ PARTIAL  | Approvals work and affect balance correctly. **Reject flow not implemented. Player transactions table does not show newly approved deposit with real approval timestamp.** |
| 6     | UI / Design tokens alignment      | ⚠️ PARTIAL  | Core red theme OK, but **several pages ignore design tokens** (titles not black/dark, wrong table/card styles, tight badges). |
| 7     | Saturday 17:00 cutoff             | ⏩ NOT RUN  | Time-dependent; skipped in this pass. |
| 8     | 0 DKK auto-renewal                | ✅ PASS     | Auto-repeat board generates 0 DKK transaction as expected. |

Overall status **(2025-11-25)**:
> ✅ Functional core works, but **exam-level polish requires fixing the issues in §2 and §3**.

---

## 2. Functional Issues To Fix Before Exam

### 2.1 Game workflow / "Next game" banner (Admin → Spiloversigt)

**Observed**

- After finishing an active game, a new game is created and auto-activated (good).
- The banner for "Næste spil" shows:
  - `Uge 1, 2024`
  - Text: "Spillet aktiveres automatisk når det aktuelle spil afsluttes."
- Behaviour contradicts the wording: game is already auto-activated, and year is wrong.

**Expected**

- When there is an upcoming game that will auto-activate later:
  - Show **correct year (2025)** according to ISO week/year.
  - Only show "Klar til aktivering" if it is *not yet* active.
- When the current game has just been completed and the next one is already active:
  - Either hide the "Næste spil" card, or change text to reflect that the next game is active.

**Likely fixes**

- Backend: check the service/repository that selects "next game" and the seeding logic for year calculation (ISOWeek vs DateTime.Year).
- Frontend: conditionally show banner only when status = Pending, and render correct copy for that state.

---

### 2.2 Dashboard "Aktive plader" count

**Observed**

- Player dashboard shows **6 active boards** even after the relevant game has been completed.
- "Mine plader" lists all boards (both active and in completed games).

**Expected**

- `Aktive plader` on dashboard should count only **boards belonging to the *currently active game* (and maybe future games)**, not historical boards.
- "Mine plader" can show history, but dashboard KPI must match "live" boards.

**Likely fixes**

- Backend/Query:
  - When calculating active boards, join boards → game and filter `Game.Status = Active`.
- Frontend:
  - Ensure the dashboard uses that API field instead of counting all boards.

---

### 2.3 Admin Transactions — approval vs visible history

**Observed**

- Approving a pending deposit (e.g. +200 DKK) correctly:
  - Updates player balance (e.g. 500 → 700 → later 280 after purchases).
  - Moves transaction from "Afventende indbetalinger" to "Alle transaktioner".
- The **player dashboard summary** shows correct totals:
  - "Godkendte indbetalinger: 700,00 kr"
  - Balance math checks out: 700 – 20 – 160 – 40 – 160 – 40 = 280.
- But:
  - The **player's transaction history** does not clearly show the newly approved deposit with a realistic approval timestamp (the date/time seems to reflect creation, not approval).
  - There is no way to **reject** a suspicious transaction (no "Afvis" button and no endpoint wired).

**Expected**

- For **Test 5.1**:
  - Approved deposit appears in player transaction list with:
    - Type = `Indbetaling`
    - Status = `Godkendt`
    - Amount = `+200,00 kr`
    - **Timestamp that matches or is close to the approval time.**
- For **Test 5.2**:
  - An admin can **soft-reject** a pending deposit:
    - Status or DeletedAt set (audit trail).
    - Player balance unaffected.
    - Still visible in admin "Alle transaktioner" with a rejected marker.

**Likely fixes**

- Backend:
  - Ensure `ApprovedAt` is set at approval time and that the player "mine transaktioner" endpoint orders by and displays that value.
  - Add "reject" endpoint that soft-deletes or marks transaction as rejected.
- Frontend:
  - Add "Afvis" button in `/admin/transactions` and wire to new endpoint.
  - Display rejected state in admin history + optional icon in player history.

---

### 2.4 Deposit request form — error handling

**Observed**

- Player uses *Transaktioner → Anmod om indbetaling* to send a 200 kr request.
- UI displays error banner: **"Kunne ikke oprette indbetalingsanmodning. Prøv igen senere."**
- Despite the error, the request **does appear under admin "Afventende indbetalinger"**.
- MobilePay ID field currently accepts any text; it's probably not validated or used server-side.

**Expected**

- When the API call succeeds:
  - Show **success toast** or redirect to "Mine transaktioner".
  - **Do not** show a red error banner.
- If the API actually fails:
  - Show meaningful error text (e.g. validation error, auth error).
- Label text: the feature is conceptually "Opret indbetaling" (create deposit), not just "anmod".

**Likely fixes**

- Client:
  - Correctly handle HTTP 201/204 responses; only show the red alert on non-2xx or exception.
  - Rename heading/button copy: "Opret indbetaling".
- API:
  - Confirm response shape (`{ code, message }`) matches what the client expects.
  - Optionally validate MobilePay ID format and trim spaces.

---

### 2.5 Game auto-repeat & purchases

**Observed**

- Auto-repeat on purchase page:
  - Checkbox works; generates 0 DKK auto-repeat transaction.
  - UI for the checkbox is subtle; easy to miss.
- Board selection:
  - Enforces 5–8 numbers.
  - "Utilstrækkelig saldo" error displays and blocks purchase correctly.
  - Price calculation (20/40/80/160) works.

**Expected**

- Functionally OK (tests 4.1, 4.2, 4.3 all **PASS**).
- UX improvements tracked in §3 (confirmation and visibility).

No backend changes strictly required here; UX only.

---

## 3. UX & Design Issues (Linked to DESIGN_TOKENS_MATH.md)

These are **non-blocking** for functionality but important for exam-level polish and design-token credibility. Detailed backlog in `docs/ux/UX_BACKLOG_SPRINT_5.md`.

High-impact items:

1. **Spiloversigt (player)**
   - Title "Spiloversigt" currently red; should use **black / text-neutral** according to heading rules.
   - Active game card seems to use a non-standard card class (no rounded corners, inconsistent padding).
   - "Seneste 12 spil" table uses old table style instead of standardized table tokens.

2. **Admin Spiloversigt & Admin Transaktioner**
   - Page titles for `Spil (Admin)` and `Admin transaktioner` use dark red headers; should be black.
   - Some tables (years selector, transaction list) still use legacy spacing and typography.

3. **Deposit pages ("Anmod om indbetaling")**
   - Heading should be "Opret indbetaling".
   - Error banner appears on success (see 2.4).
   - Quick amount buttons + MobilePay ID field need spacing/line-height aligned with `BODY_TEXT_QUICK_REFERENCE.md`.

4. **Mine plader & Auto-repeat badges**
   - "Automatisk" badge too cramped; needs padding and consistent badge class.
   - Auto vs single ("Enkelt") should use standardized badge colors and spacing.

5. **Purchase flow confirmation**
   - After buying a board, user immediately redirected back to boards with only a brief toast.
   - Consider intermediate confirmation state/modal or more visible success banner.

---

## 4. RaT Test-by-Test Status

Use this as a snapshot; the main test plan remains in `MANUAL_TEST_PLAN_SPRINT_5.md`.

### Suite 1 — Authentication

- **1.1 Admin login** — ✅ PASS
- **1.2 Inactive player login fails** — ✅ PASS
- **1.3 Active player login succeeds** — ✅ PASS

### Suite 2 — Player Active Check

- **2.1 Newly activated player can purchase** — ✅ PASS
- **2.2 Deactivated player cannot purchase** — ✅ PASS (cannot even log in).

### Suite 3 — Game Workflow

- **3.1 Active game shows 2025, not 2044** — ✅ PASS
- **3.2 Admin completes game with 3 winning numbers** — ✅ PASS
- **3.3 Next game auto-activates** — ⚠️ PARTIAL
  - Behaviour OK, UI year and copy incorrect (see 2.1).

### Suite 4 — Board Purchase & Balance

- **4.1 Purchase 6-number board (40 kr)** — ✅ PASS
- **4.2 Cannot purchase with insufficient balance** — ✅ PASS
- **4.3 Repeating board auto-copies next game & 0 DKK line** — ✅ PASS (with minor UX issues).

### Suite 5 — Admin Transactions

- **5.1 Approve pending deposit (200 kr)** — ⚠️ PARTIAL
  - Balance and admin history OK; player transaction view/time display needs adjustment.
- **5.2 Reject suspicious transaction** — ❌ NOT IMPLEMENTED
  - No "Afvis" button / endpoint.

### Suite 6 — UI / UX

- **6.1 Spiloversigt uses red theme** — ⚠️ PARTIAL
  - Red theme present but card/table styles and title color do not fully match tokens.
- **6.2 Board numbers show 1–16 only** — ✅ PASS
- **6.3 Page titles consistently dark red** — ❌ FAILED BY DESIGN
  - Titles must actually be **black / neutral** per updated design guidelines.

### Suite 7 — Saturday 5 PM Cutoff

- **7.1 Purchase allowed before cutoff** — ⏩ SKIPPED
  - Time-dependent; can be tested manually when needed.
- **7.2 Purchase blocked after cutoff** — ⏩ SKIPPED
  - Time-dependent; can be tested manually when needed.

### Suite 8 — 0 DKK Auto-Renewal

- **8.1 Repeating board shows 0 DKK transaction** — ✅ PASS

---

## 5. Next Steps

1. **Implement functional fixes** from §2 (Priority order):
   - Fix next-game year banner (2.1)
   - Fix dashboard active boards count (2.2)
   - Add transaction reject flow (2.3)
   - Fix deposit request error handling (2.4)

2. **Work through UX backlog** in `docs/ux/UX_BACKLOG_SPRINT_5.md`.

3. **Re-run Quick Test Reference** checklist and update this file with a new date once all critical issues are resolved.

---

## Sign-Off

**Tester:** Stefan Ankersø
**Date:** 2025-11-25
**Time:** ~2–3 hours
**Result:** ✅ Core functional tests pass; UX/design polish + 5 functional issues need resolution before final exam submission.

