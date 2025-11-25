# UX & Design Backlog — Sprint 5 (Dead Pigeons)

Goal:
Align critical screens with `DESIGN_TOKENS_MATH.md`, `DESIGN_TOKENS_IMPROVEMENTS.md`, and `BODY_TEXT_QUICK_REFERENCE.md`, focusing on typography, color, spacing, and clarity.

Priority legend:
- 🔴 **Critical** (before exam submission)
- 🟠 **High** (strongly recommended before submission)
- 🟡 **Medium** (nice-to-have, improves polish)
- 🟢 **Low** (future work, non-blocking)

---

## 1. Global Typography & Titles

### 1.1 Page titles use **black/neutral**, not red — 🔴

**Current State**

- Several pages (Spiloversigt, Admin Spil, Admin transaktioner, etc.) use dark red titles.
- Violates DESIGN_TOKENS_MATH.md heading hierarchy.

**Expected per Design Tokens**

- Page titles: `t4` (39px, `text-3xl`) with **text-base-content** (black #111827).
- Accent red reserved for:
  - CTAs (buttons)
  - Badges (status indicators)
  - Emphasis elements (alerts, highlights)

**Action Items**

- [ ] Adjust all page titles to:
  ```tsx
  <h1 className="text-3xl font-semibold text-base-content mb-4">Page Title</h1>
  ```
- [ ] Keep subtitle as `t0`/`t1` muted gray: `className="text-base text-base-content/70"`
- [ ] Files to update:
  - `GamesPage.tsx` (Spiloversigt)
  - `AdminGamesPage.tsx` (Spil Admin)
  - `AdminPlayersPage.tsx` (Spilleradministration)
  - `AdminTransactionsPage.tsx` (Admin transaktioner)
  - Any other admin page with red title

**Estimated effort:** 30 minutes

---

## 2. Player Spiloversigt

### 2.1 Active game card styling — 🟠

**Issues**

- Card lacks consistent rounded corners (likely missing `rounded-2xl` or equivalent).
- Custom padding instead of spacing tokens (`s4`, `s5`).
- Text line-height may not match `BODY_TEXT_QUICK_REFERENCE.md` specs.

**Expected per Design Tokens**

- Card wrapper:
  ```tsx
  className="card bg-error text-error-content rounded-2xl shadow-md p-6 space-y-3"
  ```
- Card title (active game label):
  ```tsx
  className="text-sm leading-body text-error-content/80"
  ```
- Game week/year (larger label):
  ```tsx
  className="text-2xl font-bold leading-display"
  ```

**Action Items**

- [ ] Apply standard card padding: `p-6` (s5 token, 24px)
- [ ] Use consistent rounded corners: `rounded-2xl` (r-card)
- [ ] Ensure line-height: `leading-body` (1.5) for text, `leading-display` (1.2) for headings
- [ ] Verify no custom `<div>` styling overrides card styles

**Estimated effort:** 20 minutes

---

### 2.2 "Seneste 12 spil" table uses legacy style — 🟠

**Issues**

- Table structure/spacing differs from standardized tables elsewhere.
- Headers may not match `text-xs font-semibold` pattern.
- Body row text size inconsistent.

**Expected per Design Tokens**

- Table header row:
  ```tsx
  className="text-xs font-semibold text-neutral/70 leading-caption uppercase tracking-wide"
  ```
- Table body rows:
  ```tsx
  className="text-sm leading-body"
  ```
- Striped background:
  ```tsx
  className="odd:bg-base-100 even:bg-base-200/50"
  ```
- Active/completed row highlight:
  - Active: left border `border-l-4 border-error`
  - Completed: left border `border-l-4 border-success`

**Action Items**

- [ ] Refactor table header styling
- [ ] Apply consistent body text size and line-height
- [ ] Ensure row striping uses base-100 / base-200
- [ ] Add colored left border for active/completed states

**Estimated effort:** 25 minutes

---

## 3. Admin Spil & Spiloversigt

### 3.1 "Næste spil" banner copy & color — 🔴 (linked to RaT Issue 2.1)

**Current State**

- Shows "Uge 1, 2024" (wrong year).
- Text says "Spillet aktiveres automatisk når det aktuelle spil afsluttes" (misleading, game is already activated).

**Expected Behavior**

- When next game exists and is NOT yet active:
  - Show: "Næste spil (klar til aktivering)"
  - Year: correct (2025 or later, not 2024).
  - Copy: "Spillet aktiveres automatisk når det aktuelle spil afsluttes."
  - Card color: `bg-base-100` (neutral) or `bg-info` (blue, informational).
- When next game is already active (recent completion):
  - Hide the "Næste spil" card entirely, OR
  - Change to: "Nyt aktivt spil" with updated copy.

**Action Items (Backend)**

- [ ] Verify year calculation in game selection logic (ISOWeek vs DateTime.Year).
- [ ] Ensure "next game" query filters by `status = Pending` only.
- [ ] Check seeding for correct year range (2024–2045).

**Action Items (Frontend)**

- [ ] Conditionally render "Næste spil" only when status ≠ Active.
- [ ] Update banner color from red (`bg-error`) to neutral (`bg-info` or `bg-base-100`).
- [ ] Typography:
  ```tsx
  className="text-sm text-base-content/70 leading-body"  // label
  className="text-2xl font-bold text-base-content leading-display"  // week/year
  ```

**Estimated effort:** 40 minutes (10 min frontend, 30 min backend debugging)

---

### 3.2 Year selector row & table spacing — 🟡

**Issues**

- Year buttons may not have consistent padding or selected state styling.
- Table may use inconsistent row spacing.

**Expected**

- Year pill buttons:
  ```tsx
  className={`btn btn-sm ${selectedYear === year ? "btn-primary" : "btn-ghost"} h-10 px-4`}
  ```
- Table row padding: consistent `py-3 px-4` per row.
- Hover state: `hover:bg-base-200 transition-colors`.

**Action Items**

- [ ] Verify year selector buttons match pattern in AdminGamesPage.
- [ ] Ensure table rows use consistent spacing tokens.

**Estimated effort:** 15 minutes

---

## 4. Transactions (Player + Admin)

### 4.1 "Anmod om indbetaling" → "Opret indbetaling" — 🔴 (copy only)

**Current State**

- Page heading: "Anmod om indbetaling" (request a deposit).
- Conceptually should be "Opret indbetaling" (create/initiate deposit).

**Expected**

- Change heading to "Opret indbetaling".
- Subtitle: "Indbetal penge til din konto via MobilePay".
- Button text: "Opret indbetaling" (not "Anmod").

**Action Items**

- [ ] Update page heading text.
- [ ] Update button copy.
- [ ] Update form labels and helper text for clarity.

**Estimated effort:** 10 minutes

---

### 4.2 Deposit form layout — 🟠

**Issues**

- Form spacing and typography may not match DESIGN_TOKENS_MATH.md.
- Input line-height may not be optimized.

**Expected per Design Tokens**

```tsx
// Label
<label className="label">
  <span className="label-text text-sm font-medium leading-body">Beløb (DKK)</span>
</label>

// Input
<input
  type="number"
  className="input input-bordered h-12 text-base leading-body placeholder:text-base-content/50"
  placeholder="f.eks. 200"
/>

// Hint
<label className="label">
  <span className="label-text-alt text-xs leading-caption text-base-content/70">
    Beløbet skal være mindst 50 DKK.
  </span>
</label>

// Quick amount buttons
<div className="flex gap-2 flex-wrap">
  {[100, 200, 500].map(amt => (
    <button key={amt} className="btn btn-sm btn-outline h-10 px-4">
      +{amt} kr
    </button>
  ))}
</div>
```

**Action Items**

- [ ] Apply consistent form spacing: `space-y-3` between field groups.
- [ ] Ensure inputs use `h-12` (48px) for touch targets.
- [ ] Update label/hint typography to match pattern above.
- [ ] Add quick amount buttons with proper spacing.

**Estimated effort:** 20 minutes

---

### 4.3 Error / success feedback — 🟠 (linked to RaT Issue 2.4)

**Current State**

- Success shows red error banner (should be green or hidden).
- User confused about whether transaction succeeded.

**Expected**

- On **success** (HTTP 2xx):
  - Show green success alert: `alert alert-success`.
  - OR redirect to "Mine transaktioner" with toast notification.
  - **Do not** show error styling.
- On **failure** (HTTP 4xx/5xx):
  - Show red error alert with meaningful message.
  - Preserve form data so user can retry.

**Action Items (Frontend)**

- [ ] Fix response handling:
  ```tsx
  if (response.ok) {
    // Success path
    setSuccess("Indbetaling oprettet! Den vises for admin godkendelse.");
    setFormData({ ... }); // Clear form
    // Optional: redirect or show toast
  } else {
    const err = await response.json();
    setError(err.message || "Indbetaling mislykkedes.");
  }
  ```
- [ ] Use proper alert classes.

**Action Items (Backend)**

- [ ] Verify API returns `201 Created` or `200 OK` on success.
- [ ] Return meaningful error messages on validation failures.

**Estimated effort:** 25 minutes

---

### 4.4 Missing "Afvis" (Reject) button — 🔴 (functional + linked to RaT Issue 2.3)

**Current State**

- Admin can approve pending transactions.
- No way to reject/decline suspicious deposits.
- No soft-delete or rejection status in transaction model.

**Expected**

- Admin sees "Afvis" button per pending transaction:
  ```tsx
  <button className="btn btn-sm btn-outline btn-warning h-10 px-4">
    Afvis
  </button>
  ```
- Clicking "Afvis" → confirmation modal:
  - "Er du sikker? Spilleren får ingen besked, men transaktionen markeres som afslået."
  - OK / Annuller buttons.
- On confirm:
  - Mark transaction as rejected (backend: `RejectedAt` field or `Status = Rejected`).
  - Player balance **unchanged** (approval not reversed).
  - Transaction still visible in admin history with rejected state.

**Action Items (Backend)**

- [ ] Add `RejectedAt` field to Transaction entity (datetime, nullable).
- [ ] Create `POST /api/Transactions/{id}/reject` endpoint.
- [ ] Verify soft-delete logic doesn't hide rejected transactions.
- [ ] Update transaction queries to show rejection status.

**Action Items (Frontend)**

- [ ] Add "Afvis" button in `AdminTransactionsPage` pending table.
- [ ] Wire to new reject endpoint.
- [ ] Show confirmation modal before rejecting.
- [ ] Display rejected state with icon/badge in transaction history.

**Estimated effort:** 60 minutes (30 min backend, 30 min frontend)

---

## 5. Mine plader & Auto-repeat

### 5.1 Auto vs single badges — 🟠

**Issues**

- "Automatisk" badge too cramped; needs padding.
- "Enkelt" rendered as plain text, not badge.

**Expected per Design Tokens**

```tsx
// Auto-repeat badge
<span className="badge badge-success badge-sm gap-2">
  <svg className="w-4 h-4" ... /> Automatisk
</span>

// Single badge
<span className="badge badge-neutral badge-outline badge-sm">
  Enkelt
</span>
```

**Action Items**

- [ ] Replace text "Automatisk" with badge component.
- [ ] Add "Enkelt" badge for non-repeating boards.
- [ ] Ensure consistent vertical alignment with game title.
- [ ] Use semantic colors: success (green) for auto, neutral for single.

**Estimated effort:** 15 minutes

---

### 5.2 Board cards layout — 🟡

**Issues**

- Card spacing may not follow token rhythm.
- Number chips may have inconsistent `gap`.

**Expected**

- Card wrapper:
  ```tsx
  className="card bg-base-100 shadow-sm rounded-box p-4 md:p-6 space-y-3"
  ```
- Numbers container:
  ```tsx
  className="flex flex-wrap gap-2"
  ```
- Number chips:
  ```tsx
  className="badge badge-primary badge-sm"
  ```

**Action Items**

- [ ] Audit and apply consistent card padding (s4/s5 tokens).
- [ ] Use `gap-2` (s2, 8px) for number chip spacing.
- [ ] Ensure line-height for board metadata is `leading-body`.

**Estimated effort:** 15 minutes

---

## 6. Board Purchase Flow

### 6.1 Auto-repeat checkbox discoverability — 🟡

**Current State**

- Checkbox near bottom of form; easy to miss.
- No helper text explaining feature.

**Expected**

- Group checkbox with price/summary:
  ```tsx
  <div className="form-control space-y-2">
    <label className="label cursor-pointer gap-3">
      <input type="checkbox" className="checkbox checkbox-primary" />
      <span className="label-text font-medium">Gentag automatisk næste uge</span>
    </label>
    <p className="text-xs text-base-content/70 ml-8">
      Pladen købes automatisk igen næste spil for samme pris og numre.
    </p>
  </div>
  ```
- Increase spacing around checkbox so it visually groups with price calculation.

**Action Items**

- [ ] Add helper text explaining auto-repeat behavior.
- [ ] Improve visual grouping with price/totals section.
- [ ] Use consistent spacing tokens (gap-3, ml-8).

**Estimated effort:** 10 minutes

---

### 6.2 Purchase confirmation — 🟡

**Current State**

- Brief toast near top; user may miss success.
- Immediate redirect back to boards list.

**Expected Options**

1. **Inline success panel** (preferred for small transactions):
   ```tsx
   <div className="alert alert-success space-y-2">
     <p className="font-bold">Plade købt!</p>
     <p>Numre: 3, 7, 12, 15, 18, 21</p>
     <p className="text-sm">Pris: 40 DKK | Ny saldo: 220 DKK</p>
     <button className="btn btn-sm btn-ghost">Gå tilbage</button>
   </div>
   ```

2. **Confirmation modal**:
   ```tsx
   <dialog className="modal">
     <div className="modal-box space-y-4">
       <h3 className="font-bold text-lg">Plade købt!</h3>
       <p>Numre: 3, 7, 12, 15, 18, 21</p>
       <p className="text-sm text-base-content/70">Pris: 40 DKK</p>
       <div className="modal-action">
         <button className="btn" onclick="modal.close()">OK</button>
       </div>
     </div>
   </dialog>
   ```

**Action Items**

- [ ] Choose confirmation style (inline panel or modal).
- [ ] Show purchased numbers, price, and new balance.
- [ ] Add "OK" or "Gå tilbage" button to dismiss.
- [ ] Keep toast notification as secondary confirmation.

**Estimated effort:** 20 minutes

---

## 7. Spiloversigt & Numbers Styling

### 7.1 Winning numbers list (admin detail page) — 🟡

**Issues**

- Winning numbers may use legacy blue badges.
- Spacing between badges inconsistent.

**Expected per Design Tokens**

```tsx
<div className="flex flex-wrap gap-2">
  {game.winningNumbers?.map(num => (
    <span key={num} className="badge badge-error badge-sm">
      {num}
    </span>
  ))}
</div>
```

**Action Items**

- [ ] Replace `badge-primary` with `badge-error` for winning numbers.
- [ ] Ensure `gap-2` (s2) spacing between badges.
- [ ] Verify no hardcoded colors (use DaisyUI semantic classes).

**Estimated effort:** 10 minutes

---

## 8. Implementation Notes

### Typography Token Mapping

- All typography should use:
  - `leading-body` (line-height: 1.5) for normal text ≥16px
  - `leading-caption` (line-height: 1.375) for small metadata (<14px)
  - `leading-display` (line-height: 1.2) for headings
- Avoid ad-hoc arbitrary values when a token exists.
- When in doubt, cross-check `DESIGN_TOKENS_MATH.md` and `BODY_TEXT_QUICK_REFERENCE.md`.

### Color Matrix Rules

- **Page titles**: `text-base-content` (black) **never** red
- **CTAs & buttons**: `bg-primary` (red #d40000) or `bg-error`
- **Badges**: semantic colors only (`badge-success`, `badge-warning`, `badge-error`)
- **Muted text**: `text-base-content/70` or `text-base-content/60`
- **Backgrounds**: `bg-base-100`, `bg-base-200`, `bg-base-300` (never raw white or gray)

### Spacing Rhythm (√2 scale)

- Always use multiples of 4px or derived token values
- Common: `gap-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px)
- Never jump more than one step (e.g., gap-2 → gap-4, not gap-2 → gap-6)

---

## 9. PR Checklist Before Exam Submission

- [ ] **Issue 1.1 Fixed:** All page titles are black (`text-base-content`), not red
- [ ] **Issue 2.1 Fixed:** Spiloversigt active card uses standard card styling with rounded corners
- [ ] **Issue 2.2 Fixed:** "Seneste 12 spil" table uses standardized header/body typography
- [ ] **Issue 3.1 Fixed:** "Næste spil" banner shows correct year and appropriate copy
- [ ] **Issue 3.2 Fixed:** Year selector and table spacing follow token rhythm
- [ ] **Issue 4.1 Fixed:** Page heading changed to "Opret indbetaling"
- [ ] **Issue 4.2 Fixed:** Deposit form layout matches DESIGN_TOKENS_MATH.md pattern
- [ ] **Issue 4.3 Fixed:** Success/error feedback shows correct alert types
- [ ] **Issue 4.4 Fixed:** "Afvis" button implemented with backend support
- [ ] **Issue 5.1 Fixed:** Auto-repeat badges standardized
- [ ] **Issue 5.2 Fixed:** Board card spacing follows token rhythm
- [ ] **Issue 6.1 Fixed:** Auto-repeat checkbox includes helper text
- [ ] **Issue 6.2 Fixed:** Purchase confirmation modal/panel implemented
- [ ] **Issue 7.1 Fixed:** Winning numbers use red badges (`badge-error`)
- [ ] **No violations:** No arbitrary colors, no hardcoded pixel values, no mismatched line-heights
- [ ] **Build passes:** `npm run build` shows 0 errors

---

## Priority Implementation Order

### Phase 1 (Critical for exam, ~2–3 hours):
1. Fix page titles to black (1.1)
2. Fix "Næste spil" year + copy (3.1)
3. Add "Afvis" transaction flow (4.4)
4. Fix deposit error handling (4.3)

### Phase 2 (High polish, ~2–3 hours):
5. Fix active game card styling (2.1)
6. Fix "Seneste 12 spil" table (2.2)
7. Fix deposit form layout (4.2)
8. Auto-repeat badge standardization (5.1)

### Phase 3 (Nice-to-have, ~1–2 hours):
9. Year selector styling (3.2)
10. Board card spacing (5.2)
11. Auto-repeat checkbox UX (6.1)
12. Purchase confirmation (6.2)
13. Winning numbers styling (7.1)

---

**Last Updated:** 2025-11-25
**Status:** Backlog created from Requirements Acceptance Testing results

