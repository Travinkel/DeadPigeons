# Manual Testing Plan — Sprint 5 Final Verification

**Date:** November 25, 2025
**Sprint:** 5
**Scope:** Critical workflows validation after database reseeding (2024–2045)
**Status:** Ready for Testing

---

## Prerequisites

✅ Database reseeded with correct years:
```bash
dotnet ef database drop
dotnet ef database update
```

✅ Verification:
- Current year = 2025
- Active game = Week 48 or later, 2025 (depending on current date)
- Seeded games span 2024–2045
- Next game is realistic (2025/2026, not 2044)

✅ API running (port 5000)
✅ Client running (port 5173)
✅ Credentials ready:
- Admin: `admin@jerneif.dk` / `Admin123!`
- Player: `player@jerneif.dk` / `Player123!`

---

## Test Strategy: Happy Path + Edge Cases

Each test section includes:
1. **Setup** — Data state before test
2. **Action** — User steps to execute
3. **Expected Result** — What should happen
4. **Verification** — How to confirm success
5. **Notes** — Any warnings or gotchas

---

## TEST SUITE 1: Authentication & Authorization

### Test 1.1: Admin Login
**Priority:** CRITICAL
**Estimated Time:** 2 min

**Setup:**
- Fresh browser session (clear cache)
- Admin account exists: `admin@jerneif.dk`

**Actions:**
1. Navigate to `http://localhost:5173/login`
2. Enter email: `admin@jerneif.dk`
3. Enter password: `Admin123!`
4. Click "Log ind" (Log in)

**Expected Result:**
- ✅ Redirects to `/admin/dashboard`
- ✅ Page title shows "Admin Dashboard"
- ✅ Admin menu visible in sidebar
- ✅ JWT token stored in localStorage

**Verification:**
- Check browser DevTools → Application → localStorage → token
- Verify `/admin` routes accessible
- Verify `/boards` (player routes) not in sidebar

**Notes:**
- Token should be JWT format (3 dot-separated segments)
- Token expiry should be reasonable (24h or more)

---

### Test 1.2: Player Login (Inactive Player)
**Priority:** HIGH
**Estimated Time:** 3 min

**Setup:**
- Create new inactive player via admin UI
  - Name: "Test Inactive"
  - Email: "inactive@test.dk"
  - Phone: "+4512345678"
  - Save (default: inactive)

**Actions:**
1. Logout (or new browser)
2. Navigate to `http://localhost:5173/login`
3. Enter email: `inactive@test.dk`
4. Enter password: (set during creation)
5. Click "Log ind"

**Expected Result:**
- ❌ Login FAILS with error message
- ❌ Cannot proceed to dashboard
- Error message: "Brugeren er ikke aktiv" or similar

**Verification:**
- Confirm error alert is displayed
- Verify no JWT token stored
- Player cannot access any protected routes

**Notes:**
- This is the critical fix from earlier: only active players can log in
- Backend enforces this via PlayerService.AuthenticateAsync()

---

### Test 1.3: Player Login (Active Player)
**Priority:** CRITICAL
**Estimated Time:** 2 min

**Setup:**
- Player exists and is ACTIVE: `player@jerneif.dk`
- Admin has verified this in admin players list

**Actions:**
1. Navigate to `http://localhost:5173/login`
2. Enter email: `player@jerneif.dk`
3. Enter password: `Player123!`
4. Click "Log ind"

**Expected Result:**
- ✅ Redirects to `/dashboard` (player dashboard)
- ✅ Page shows "Min profil" (My profile)
- ✅ Player menu visible (no admin options)
- ✅ JWT token stored

**Verification:**
- Dashboard loads without "inactive" warning
- Player balance displayed (should show 500 DKK from seeding)
- "Køb plade" link accessible

**Notes:**
- This is the happy path for the player active check fix

---

## TEST SUITE 2: Player Active Status Check (Critical Fix)

### Test 2.1: Newly Activated Player Can Purchase Board
**Priority:** CRITICAL
**Estimated Time:** 5 min

**Setup:**
- Player is currently INACTIVE: "Test Inactive"
- Admin is logged in

**Actions:**
1. **Admin side:**
   - Navigate to `/admin/players`
   - Find "Test Inactive"
   - Click "Rediger" (Edit) or player row
   - Toggle "Aktiv" (Active) to ON
   - Save
   - Logout

2. **Player side:**
   - Open new browser/tab
   - Login with "inactive@test.dk" (now should work)
   - Navigate to "Køb plade"
   - Select 5-8 numbers (e.g., 1, 3, 5, 7, 9)
   - Verify NO "Din konto er inaktiv" warning appears
   - Verify "Køb plade" button is ENABLED

**Expected Result:**
- ✅ Login succeeds (no longer inactive)
- ✅ "Køb plade" page loads without warning banner
- ✅ Purchase button is enabled
- ✅ Player can proceed to payment

**Verification:**
- Page title = "Køb plade"
- No red warning banner visible
- Button text = "Køb plade" (not disabled/grayed)
- Subtotal calculation works (5 × 20 = 100 DKK)

**Notes:**
- **CRITICAL:** This tests the `/api/Players/me` endpoint fresh fetch
- This is the main bug fix we implemented
- If this test fails, the player active check is still broken

---

### Test 2.2: Deactivated Player Cannot Purchase Board
**Priority:** HIGH
**Estimated Time:** 5 min

**Setup:**
- Player is currently ACTIVE: "player@jerneif.dk"
- Player is logged in on "Køb plade" page
- Admin dashboard is open in another window

**Actions:**
1. **Admin side (other window):**
   - Navigate to `/admin/players`
   - Find "player@jerneif.dk"
   - Click edit, toggle Active to OFF
   - Save

2. **Player side (original window):**
   - Refresh the "Køb plade" page (F5)
   - Observe warning banner and button state

**Expected Result:**
- ✅ Orange warning banner appears: "Din konto er inaktiv..."
- ✅ "Køb plade" button is DISABLED
- ✅ Number selection is disabled
- ✅ Cannot submit purchase

**Verification:**
- Red/orange alert visible
- Button is grayed out / has `disabled` attribute
- Clicking button does nothing
- Console shows no errors

**Notes:**
- Tests the real-time fetch from server
- Player state should update within 5 seconds of refresh

---

## TEST SUITE 3: Game Workflow

### Test 3.1: Active Game Displays Correct Year (2025, not 2044)
**Priority:** CRITICAL
**Estimated Time:** 2 min

**Setup:**
- Admin dashboard open
- Database reseeded to 2025–2045

**Actions:**
1. Navigate to `/admin/games`
2. Observe "Aktivt spil" (Active Game) section
3. Check the displayed game year

**Expected Result:**
- ✅ Active game shows **2025** (current year)
- ✅ Week number matches current week (roughly 47–52)
- ✅ NO year 2044 anywhere visible
- ✅ "Næste spil" (Next Game) shows realistic next week/year

**Verification:**
- Admin Games page displays: "Uge 48, 2025" or similar
- Year is NOT in the 2040s
- Database seeding was correct (2024–2045)

**Notes:**
- This was BUG-5.1, the critical year seeding bug
- If this shows 2044, the database was not properly reseeded

---

### Test 3.2: Admin Completes Active Game
**Priority:** HIGH
**Estimated Time:** 5 min

**Setup:**
- Active game exists (Week 48, 2025)
- Player has purchased 1+ boards in this game
- Admin is logged in

**Actions:**
1. Navigate to `/admin/games`
2. Click "Afslut spil" (Complete Game) button on active game
3. Redirected to game completion page
4. Select exactly 3 winning numbers (e.g., 1, 7, 13)
5. Click "Afslut og gem" (Complete & Save)

**Expected Result:**
- ✅ Game status changes to "Completed"
- ✅ Winning numbers stored in database
- ✅ Redirects to `/admin/games` or game list
- ✅ Active game card disappears (no active game)
- ✅ Completed game appears in table with winning numbers

**Verification:**
- Check admin games list:
  - Week 48, 2025 shows "Afsluttet" status
  - Shows 1, 7, 13 in winning numbers column
  - Shows winning board count (e.g., "1")
- Check `/games` (player view):
  - Game appears in "Seneste 12 spil" table
  - Winning numbers visible (red badges)

**Notes:**
- Winning numbers are stored as array [1, 7, 13]
- Sequence order doesn't matter (4-1-7 = 1-4-7)

---

### Test 3.3: Next Game Activates Automatically
**Priority:** HIGH
**Estimated Time:** 3 min

**Setup:**
- Previous test completed (game marked as completed)
- Admin dashboard refreshed

**Actions:**
1. Navigate to `/admin/games`
2. Observe "Aktivt spil" section
3. Check game details

**Expected Result:**
- ✅ NEW active game is displayed
- ✅ Game is next sequential week (Week 49, 2025)
- ✅ Status = "Active"
- ✅ "Næste spil" shows Week 50, 2025

**Verification:**
- Active game card shows different week number
- Year is still 2025
- Game sequence makes sense: 48 → 49 → 50

**Notes:**
- This was EXAM requirement Tip #1: State-less, automatic advancement
- No scheduler needed; just database transaction logic
- Tests that GameService.CompleteGameAsync() auto-activates next game

---

## TEST SUITE 4: Board Purchase & Balance

### Test 4.1: Player Purchases Board with Correct Price
**Priority:** HIGH
**Estimated Time:** 5 min

**Setup:**
- Player logged in: `player@jerneif.dk`
- Current balance: 500 DKK (from seeding)
- Active game exists

**Actions:**
1. Navigate to "Køb plade"
2. Select 6 numbers (e.g., 1, 3, 5, 7, 9, 11)
3. Select MobilePayID: "1234567"
4. Verify total price displays: 40 DKK (price for 6 numbers)
5. Click "Køb plade"

**Expected Result:**
- ✅ Purchase succeeds
- ✅ Transaction recorded as "Purchase" with amount -40
- ✅ Player balance updated to 460 DKK (500 - 40)
- ✅ Board appears in "Mine plader" (My boards)
- ✅ Numbers match selection: [1, 3, 5, 7, 9, 11]

**Verification:**
- Check player dashboard → balance shows 460 DKK
- Navigate to "Mine plader" → board visible with selected numbers
- Admin view: `/admin/players/{playerId}` → boards section shows purchase

**Notes:**
- Price table: 5 nums = 20 DKK, 6 = 40, 7 = 80, 8 = 160
- MobilePayID is stored but not charged immediately
- Balance calculated: SUM(approved deposits) - SUM(purchases)

---

### Test 4.2: Player Cannot Purchase with Negative Balance
**Priority:** MEDIUM
**Estimated Time:** 4 min

**Setup:**
- Player balance is low: 10 DKK
- Player tries to purchase 6-number board (40 DKK)

**Actions:**
1. Navigate to "Køb plade"
2. Select 6 numbers
3. Observe total price: 40 DKK
4. Observe balance warning (if shown)
5. Attempt to click "Køb plade"

**Expected Result:**
- ✅ Button is DISABLED or shows warning
- ❌ Purchase FAILS with error: "Utilstrækkelig saldo" (Insufficient balance)
- ✅ No transaction created
- ✅ Balance unchanged: still 10 DKK

**Verification:**
- Button is disabled/grayed
- Error message displays clearly
- Check transaction history: NO new purchase transaction
- Balance in dashboard unchanged

**Notes:**
- Server-side validation must prevent negative balance
- Client should also disable button if balance < price

---

### Test 4.3: Repeating Board Copies to Next Game
**Priority:** MEDIUM
**Estimated Time:** 5 min

**Setup:**
- Active game: Week 48, 2025
- Player has purchased repeating board for 3 weeks

**Actions:**
1. Navigate to "Mine plader"
2. Purchase board with "Gentag 3 gange" selected
3. Admin completes Week 48 game
4. Next game (Week 49) activates
5. Player navigates to "Mine plader" again

**Expected Result:**
- ✅ Board appears in Week 49 automatically
- ✅ Same numbers repeated
- ✅ 2 remaining repeats (3 - 1 = 2)
- ✅ After Week 49 completion: 1 remaining
- ✅ After Week 50 completion: Board stops repeating

**Verification:**
- Check board details: shows "Gentages X gange mere"
- Count decreases each week
- No manual intervention needed

**Notes:**
- Repeating board creation is handled at purchase time
- Each week's board is separate record with same numbers
- Price charged for each week's instance

---

## TEST SUITE 5: Admin Transactions & Approvals

### Test 5.1: Admin Approves Pending Deposit
**Priority:** HIGH
**Estimated Time:** 5 min

**Setup:**
- Pending transaction exists: 200 DKK (from seeding)
- Player balance = 500 DKK (only approved deposits counted)

**Actions:**
1. Admin navigates to `/admin/transactions`
2. Filter or find "Status = Pending"
3. Find transaction: 200 DKK, Player: "Test Spiller"
4. Click "Godkend" (Approve)
5. Confirm approval

**Expected Result:**
- ✅ Transaction status changes to "Approved"
- ✅ ApprovedAt timestamp recorded
- ✅ ApprovedById = admin's GUID
- ✅ Player's balance updates to 700 DKK (500 + 200)

**Verification:**
- Transaction table shows status = "Godkendt"
- Player dashboard (player view) shows updated balance: 700 DKK
- Transaction appears in "Transaktioner" (Transactions) for player

**Notes:**
- MobilePayID should be visible for manual verification
- Admin can verify transaction in MobilePay app using this ID

---

### Test 5.2: Admin Rejects Pending Deposit
**Priority:** MEDIUM
**Estimated Time:** 3 min

**Setup:**
- Pending transaction exists: 300 DKK, suspicious MobilePayID
- Player balance = 700 DKK

**Actions:**
1. Admin navigates to `/admin/transactions`
2. Find suspicious transaction
3. Click "Afvis" (Reject) or delete option
4. Confirm rejection

**Expected Result:**
- ✅ Transaction is soft-deleted (marked with DeletedAt)
- ✅ Does NOT affect balance (never approved anyway)
- ✅ Balance remains 700 DKK
- ✅ Transaction still visible in history (audit trail)

**Verification:**
- Transaction table shows deleted/rejected state
- Player balance unchanged
- Admin can see full transaction history including rejected ones

**Notes:**
- Soft-delete required per EXAM Tip #2
- No data is permanently erased (audit trail maintained)

---

## TEST SUITE 6: UI/UX Improvements (Design System)

### Test 6.1: Spiloversigt Page Uses Red Theme
**Priority:** MEDIUM
**Estimated Time:** 3 min

**Setup:**
- Player logged in
- Navigate to `/games` (Spiloversigt)

**Actions:**
1. Observe page title and layout
2. Check active game card color
3. Check table accents
4. Check badge colors

**Expected Result:**
- ✅ Page title: "Spiloversigt" in RED (text-error)
- ✅ Subtitle visible: "Oversigt over alle aktive og afsluttede spil..."
- ✅ Active game card: RED background (bg-error), white text
- ✅ Winning number badges: RED (badge-error)
- ✅ Active game row: RED left border + light red background
- ✅ Winning game rows: GREEN left border + light green background

**Verification:**
- No blue colors in this section (except badges for status)
- Red (#D40000) used consistently
- Proper contrast (text readable)
- Mobile responsive (stacks on small screens)

**Notes:**
- This was OPTION A deliverable
- Red = Jerne IF brand color
- Green for "Active" status is UI convention (go-state)

---

### Test 6.2: Board Numbers Show 1-16, Not 1-90
**Priority:** HIGH
**Estimated Time:** 2 min

**Setup:**
- Player on "Køb plade" page
- Check number grid

**Actions:**
1. Count visible number buttons
2. Check lowest and highest numbers
3. Check grid layout (should be compact)

**Expected Result:**
- ✅ Exactly 16 numbers displayed (1–16)
- ✅ Grid layout: 4 columns on mobile, 8 on desktop
- ✅ NO numbers beyond 16 visible
- ✅ Button size reasonable (~40px)

**Verification:**
- Count: 16 buttons in grid
- Highest number = 16
- Grid fits in viewport without horizontal scroll

**Notes:**
- This was OPTION B deliverable
- Per EXAM.txt line 860: "numbers will always be 1-16"
- Changed from 1-90 (too many to display)

---

### Test 6.3: Page Titles Use Consistent Dark Red
**Priority:** LOW
**Estimated Time:** 2 min

**Setup:**
- Navigate through player pages:
  - `/dashboard`
  - `/games`
  - `/boards` (Mine plader)
  - `/transactions`

**Actions:**
1. Observe page title color on each page
2. Verify subtitle present on most pages
3. Check section heading colors

**Expected Result:**
- ✅ All page titles: dark red (text-error)
- ✅ All pages have subtitle explaining purpose
- ✅ Section headings: smaller red (text-h3)
- ✅ Consistent font weights and spacing

**Verification:**
- Screenshots show uniform red title styling
- No page has blue titles
- Subtitles are smaller gray text (text-base-content/70)

**Notes:**
- This provides visual consistency
- Helps users understand page purpose

---

## TEST SUITE 7: Saturday 5 PM Cutoff

### Test 7.1: Purchase Allowed Before Cutoff
**Priority:** LOW (Time-dependent)
**Estimated Time:** 5 min

**Setup:**
- Current day: Monday–Friday or Saturday before 5 PM (UTC)
- Active game exists

**Actions:**
1. Player on "Køb plade" page
2. Attempt to purchase board

**Expected Result:**
- ✅ Purchase proceeds normally
- ✅ No cutoff warning visible
- ✅ Button enabled

**Verification:**
- Board purchase successful
- No error about cutoff time

---

### Test 7.2: Purchase Blocked After Cutoff
**Priority:** LOW (Time-dependent)
**Estimated Time:** 5 min

**Setup:**
- Current time: Saturday 5:01 PM UTC (17:01)
- Active game exists

**Actions:**
1. Player attempts to purchase board
2. Observe button/warning

**Expected Result:**
- ✅ Button DISABLED with message
- ❌ Purchase FAILS: "Køb vindue lukket" or "Fristen er overskredet"

**Verification:**
- Clear user message about cutoff
- No purchase transaction created

**Notes:**
- UTC cutoff = Saturday 17:00:00 UTC
- Danish time (UTC+1) = Saturday 18:00:00
- Can test by mocking system clock or waiting until actual time

---

## TEST SUITE 8: Transactions Show 0 DKK Auto-Renewal

### Test 8.1: Repeating Board Transactions Are 0 DKK
**Priority:** LOW
**Estimated Time:** 3 min

**Setup:**
- Repeating board purchased in Week 48
- Week 48 completes
- Week 49 auto-repeats board
- Admin navigates to transactions for this player

**Actions:**
1. Admin views `/admin/players/{playerId}` → Transactions
2. Look for Week 49 board transaction
3. Check amount field

**Expected Result:**
- ✅ Auto-renewal transaction shows 0 DKK (NOT charged again)
- ✅ Type = "Purchase" or similar
- ✅ Status = "Approved" (automatic)
- ✅ ApprovedAt = time of auto-renewal

**Verification:**
- Amount column = 0
- No balance deduction for repeat
- Player sees board in Week 49 without additional charge

**Notes:**
- Repeating boards are created at purchase time (all weeks pre-created)
- No charging on each renewal (price paid upfront)
- If 0 DKK transactions not desired, they could be omitted from history

---

## Test Execution Checklist

### Pre-Testing
- [ ] Database reseeded: `dotnet ef database drop && dotnet ef database update`
- [ ] API running: `dotnet run --project server/DeadPigeons.Api` (port 5000)
- [ ] Client running: `npm run dev` (port 5173, from `client/` dir)
- [ ] Browser cache cleared
- [ ] Credentials verified (admin + player accounts active)

### Test Suites
- [ ] Suite 1: Authentication & Authorization (3 tests)
- [ ] Suite 2: Player Active Status Check (2 tests) ⭐ **CRITICAL**
- [ ] Suite 3: Game Workflow (3 tests)
- [ ] Suite 4: Board Purchase & Balance (3 tests)
- [ ] Suite 5: Admin Transactions (2 tests)
- [ ] Suite 6: UI/UX Improvements (3 tests)
- [ ] Suite 7: Saturday 5 PM Cutoff (2 tests, time-dependent)
- [ ] Suite 8: 0 DKK Auto-Renewal (1 test)

### Post-Testing
- [ ] All critical tests passed (Suite 2 ⭐, Suite 3.1)
- [ ] No console errors in DevTools
- [ ] Database contains expected data
- [ ] Ready to move to E2E tests (Playwright)

---

## Failure Triage

If any test fails:

1. **Check browser DevTools:**
   - Console for errors
   - Network tab for failed API requests
   - Application tab for localStorage/token

2. **Check API logs:**
   - Server console for exceptions
   - Check 500 errors vs 400 validation errors

3. **Check database:**
   - Query games table: `SELECT * FROM "Games" WHERE "Status" = 'Active' LIMIT 1;`
   - Verify year = 2025, not 2044

4. **Clear & restart:**
   - Clear browser cache (Ctrl+Shift+Del)
   - Restart API server
   - Restart client dev server

5. **Check credentials:**
   - Verify admin/player accounts exist and are active
   - Run seeder again if needed

---

## Sign-Off

**Tester Name:** ___________________
**Date:** ___________________
**Result:** ☐ PASS ☐ FAIL
**Notes:** _____________________________________________________

---

## Next Steps (Post-Manual Testing)

✅ Manual tests complete and signed off
→ **TASK 5.9:** Implement Playwright E2E tests
→ **TASK 5.10:** Create CI/CD smoke tests
→ **Sprint 5 Complete** → Submit for review

