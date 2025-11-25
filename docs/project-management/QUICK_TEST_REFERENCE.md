# Quick Test Reference — Sprint 5 Manual Testing

**Use this as a checklist while executing tests. For detailed test cases, see `MANUAL_TEST_PLAN_SPRINT_5.md`**

---

## Pre-Test Checklist ✅

```
Database:
☐ Dropped and recreated: dotnet ef database drop && dotnet ef database update
☐ Verified year = 2025, games span 2024–2045
☐ Admin account active: admin@jerneif.dk / Admin123!
☐ Player account active: player@jerneif.dk / Player123!

API & Client:
☐ API running: http://localhost:5000 (check Swagger: http://localhost:5000/swagger)
☐ Client running: http://localhost:5173
☐ Browser cache cleared (Ctrl+Shift+Del)
☐ DevTools ready (F12) for error checking
```

---

## Test Suite 1: Authentication (3 tests) ⏱️ 5 min

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 1.1 | Admin login (`admin@jerneif.dk`) | ☐ | Should redirect to `/admin/dashboard` |
| 1.2 | Inactive player login FAILS | ☐ | Create inactive player, should reject login |
| 1.3 | Active player login succeeds | ☐ | Should redirect to `/dashboard` |

---

## Test Suite 2: Player Active Status Check ⭐ CRITICAL (2 tests) ⏱️ 8 min

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 2.1 | Newly activated player can purchase | ☐ | **CRITICAL BUGFIX TEST** — Fresh `/api/Players/me` fetch |
| 2.2 | Deactivated player cannot purchase | ☐ | Must show warning banner + disable button |

**⚠️ If these fail, the main bugfix is broken. Stop and debug.**

---

## Test Suite 3: Game Workflow (3 tests) ⏱️ 10 min

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 3.1 | Active game shows 2025 (not 2044) | ☐ | **CRITICAL** — If shows 2044, database not reseeded correctly |
| 3.2 | Admin completes game (3 winning numbers) | ☐ | Verify game status = "Completed", numbers stored |
| 3.3 | Next game auto-activates | ☐ | Verify automatic advancement (no scheduler) |

---

## Test Suite 4: Board Purchase & Balance (3 tests) ⏱️ 12 min

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 4.1 | Purchase 6-number board (40 DKK) | ☐ | Balance: 500 → 460, board appears in "Mine plader" |
| 4.2 | Cannot purchase with insufficient balance | ☐ | Button disabled, error shown |
| 4.3 | Repeating board auto-copies next game | ☐ | After game completion, board appears in next week |

---

## Test Suite 5: Admin Transactions (2 tests) ⏱️ 6 min

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 5.1 | Approve pending deposit (200 DKK) | ☐ | Balance increases, ApprovedAt timestamp recorded |
| 5.2 | Reject suspicious transaction | ☐ | Soft-delete (not removed), balance unchanged |

---

## Test Suite 6: UI/UX Improvements (3 tests) ⏱️ 5 min

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 6.1 | Spiloversigt uses **RED** color scheme | ☐ | Title red, badges red, active row has red border |
| 6.2 | Board numbers show **1-16** only | ☐ | Not 1-90, grid layout 4 cols (mobile) / 8 (desktop) |
| 6.3 | Page titles consistently **dark red** | ☐ | All pages have red titles + subtitle |

---

## Test Suite 7: Saturday 5 PM Cutoff (2 tests) ⏱️ 5 min

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 7.1 | Purchase allowed before Saturday 5 PM UTC | ☐ | Time-dependent; may need to mock time |
| 7.2 | Purchase blocked after Saturday 5 PM UTC | ☐ | Button disabled, error shown |

---

## Test Suite 8: 0 DKK Auto-Renewal (1 test) ⏱️ 2 min

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 8.1 | Repeating board shows 0 DKK in transactions | ☐ | No additional charge for auto-renewal |

---

## Failure Triage

**If a test fails, follow this checklist:**

```
1. Check browser DevTools (F12):
   ☐ Console for JavaScript errors
   ☐ Network tab for failed API requests (red status codes)
   ☐ Application → localStorage → check token exists

2. Check API logs:
   ☐ API console for exceptions or error logs
   ☐ Verify API is responding (Swagger at http://localhost:5000/swagger)

3. Check database:
   ☐ Query: SELECT * FROM "Games" WHERE "Status" = 'Active' LIMIT 1;
   ☐ Verify year = 2025, not 2044

4. Restart & Clear:
   ☐ Clear browser cache (Ctrl+Shift+Del)
   ☐ Stop and restart API (`Ctrl+C` → run again)
   ☐ Stop and restart client (`Ctrl+C` → npm run dev)

5. Document failure:
   ☐ Screenshot of error
   ☐ Console error message (copy exact text)
   ☐ API response (DevTools Network tab)
   ☐ Notes on reproduction steps
```

---

## Summary Checklist

**After all tests complete:**

```
Critical Tests (MUST PASS):
☐ 2.1: Newly activated player can purchase (Player Active Check)
☐ 2.2: Deactivated player cannot purchase (Player Active Check)
☐ 3.1: Active game shows 2025, not 2044 (Year Bug)

Other Tests:
☐ All 25 tests completed
☐ No console errors (F12 → Console)
☐ No failed API requests (F12 → Network)
☐ Database integrity verified

Sign-Off:
☐ Tester name: _______________________
☐ Date/Time: _______________________
☐ Overall result: ☐ PASS ☐ FAIL
☐ Notes documented: ☐ Yes ☐ No

Next Step:
→ If PASS: Ready for E2E tests (TASK-5.9)
→ If FAIL: Debug, fix, and re-run failed tests
```

---

## Key Credentials & URLs

| Item | Value |
|------|-------|
| **Admin Email** | admin@jerneif.dk |
| **Admin Password** | Admin123! |
| **Player Email** | player@jerneif.dk |
| **Player Password** | Player123! |
| **API Health** | http://localhost:5000/swagger |
| **App URL** | http://localhost:5173 |
| **Database** | PostgreSQL (port 5432) |

---

## Time Budget

| Suite | Tests | Time | Notes |
|-------|-------|------|-------|
| 1: Auth | 3 | 5 min | Baseline login tests |
| 2: Active Check ⭐ | 2 | 8 min | **CRITICAL — if fails, stop** |
| 3: Games | 3 | 10 min | Game workflow + auto-activation |
| 4: Purchase | 3 | 12 min | Balance calculation, repeating boards |
| 5: Transactions | 2 | 6 min | Approval workflow |
| 6: UI/UX | 3 | 5 min | Color scheme, layout, numbers |
| 7: Cutoff | 2 | 5 min | Time-dependent (may skip) |
| 8: 0 DKK | 1 | 2 min | Quick check |
| **TOTAL** | **25** | **53 min** | ~1 hour actual (buffer: 2–3 hours) |

---

## Need Help?

**For detailed test case steps and expected results, see:** `docs/testing/MANUAL_TEST_PLAN_SPRINT_5.md`

**For sprint status, see:** `docs/agile/sprint-05-epic.md`

**For code changes, see:** Recent commits on `feature/ui-client-fixes` branch

---

## Quick Links

- 📋 **Full Manual Test Plan:** `docs/testing/MANUAL_TEST_PLAN_SPRINT_5.md`
- 📊 **Sprint Status:** `docs/agile/sprint-05-epic.md`
- 🔍 **API Swagger:** http://localhost:5000/swagger
- 🎮 **App:** http://localhost:5173
- 📝 **EXAM Requirements:** `docs/internal/EXAM.txt`

