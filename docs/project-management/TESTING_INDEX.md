# Testing Index — Sprint 5 Final Verification

**Quick Navigation for Manual Testing Setup and Execution**

---

## 📍 You Are Here

**Status:** Sprint 5 is 95% complete
**Current Phase:** Manual Testing (Phase 1) — Ready to Execute
**Next Action:** Execute 25 manual test cases (2–3 hours)
**Critical Gate:** 3 tests MUST pass before proceeding to E2E

---

## 📚 Documentation Structure

### For Manual Test Execution (Start Here!)

| Document | Purpose | Use When |
|----------|---------|----------|
| **QUICK_TEST_REFERENCE.md** | ⚡ Fast checklist | You're ready to start testing — use this as your checklist |
| **MANUAL_TEST_PLAN_SPRINT_5.md** | 📖 Detailed test cases | You need step-by-step instructions for a specific test |
| **This File (TESTING_INDEX.md)** | 🗺️ Navigation guide | You're lost and need to find the right document |

### For Sprint Context & Status

| Document | Purpose | Use When |
|----------|---------|----------|
| **SPRINT_5_SUMMARY.md** | 📊 This session's work | You want to know what was accomplished today |
| **sprint-05-epic.md** | 📋 Full sprint documentation | You need complete sprint context and history |
| **README.md (in root)** | 🚀 Project overview | You're new and need project setup |

### For Reference

| Document | Purpose | Use When |
|----------|---------|----------|
| **EXAM.txt** | 📝 Exam requirements | You need to verify exam compliance |
| **design_tokens_math.md** | 🎨 Design system | You want to understand UI design tokens |

---

## 🎯 Three Testing Phases

### Phase 1: Manual Testing ⏰ 2–3 hours (CURRENT)
**Status:** Ready to execute NOW

```
Start Here:
  1. Read: QUICK_TEST_REFERENCE.md (5 min overview)
  2. Setup: Verify database, API, client running
  3. Execute: 25 test cases in 8 suites
  4. Document: Results on test completion sheet

Critical Tests (MUST PASS):
  ✅ 2.1: Newly activated player can purchase
  ✅ 2.2: Deactivated player cannot purchase
  ✅ 3.1: Active game shows 2025 (not 2044)

If PASS → Proceed to Phase 2
If FAIL → Debug, fix, re-run
```

**Files:**
- `docs/testing/QUICK_TEST_REFERENCE.md`
- `docs/testing/MANUAL_TEST_PLAN_SPRINT_5.md`

---

### Phase 2: E2E Tests 🎭 (TASK-5.9)
**Status:** Pending Phase 1 completion

```
After manual tests pass:
  1. Implement Playwright tests (5–8 scenarios)
  2. Cover critical workflows: login → purchase → complete → next
  3. Target: 80%+ coverage of critical paths
  4. Estimated: 1–2 days work
```

**Reference:**
- Sprint-05-epic.md (Testing Roadmap section)

---

### Phase 3: Smoke Tests 💨 (TASK-5.10)
**Status:** Pending Phase 2 completion

```
After E2E tests pass:
  1. Add health checks to GitHub Actions
  2. Verify: API starts, DB connects, client builds
  3. Duration: < 30 seconds total
  4. Estimated: 0.5–1 day work
```

**Reference:**
- Sprint-05-epic.md (Testing Roadmap section)

---

## 🔧 Setup Checklist (Before Testing)

### Database
```bash
✅ Already done:
   dotnet ef database drop
   dotnet ef database update

✅ Verification:
   • Current year = 2025
   • Games span 2024–2045
   • Active game shows realistic week/year (e.g., "Uge 48, 2025")
   • NOT showing 2044
```

### API Server
```bash
Need to run (from solution root or /server):
  dotnet run --project server/DeadPigeons.Api

Check health:
  http://localhost:5000/swagger
  (Should load Swagger UI with API endpoints)
```

### Client
```bash
Need to run (from /client):
  npm run dev

Check status:
  http://localhost:5173
  (Should load login page or player dashboard)
```

### Browser
```bash
☐ Clear cache: Ctrl+Shift+Del
☐ Open DevTools: F12 (for error checking)
☐ Keep console open during tests
```

### Test Credentials
```
Admin:
  Email: admin@jerneif.dk
  Password: Admin123!
  Status: ✅ Active

Player:
  Email: player@jerneif.dk
  Password: Player123!
  Status: ✅ Active

Test Inactive (for negative test):
  Email: inactive@test.dk
  Password: (set during test)
  Status: ❌ Inactive
```

---

## 🚀 How to Execute Manual Tests

### Step 1: Read Quick Reference (5 min)
```
→ Open: docs/testing/QUICK_TEST_REFERENCE.md
→ Scan: Test suite overview + time estimates
→ Understand: What you're testing and why
```

### Step 2: Set Up Environment (10 min)
```
→ Start API: dotnet run --project server/DeadPigeons.Api
→ Start Client: cd client && npm run dev
→ Verify: Both load without errors
→ Check: URLs respond (Swagger + app)
```

### Step 3: Execute Tests (2–3 hours)
```
→ Open: docs/testing/QUICK_TEST_REFERENCE.md
→ Go through each suite in order
→ For detailed steps, reference: MANUAL_TEST_PLAN_SPRINT_5.md
→ Check off each test as PASS or FAIL
→ Note any errors (console, API response, etc.)
```

### Step 4: Sign Off
```
→ Open: MANUAL_TEST_PLAN_SPRINT_5.md (end of document)
→ Fill out test completion sheet:
   • Tester name
   • Date/time
   • Overall result (PASS / FAIL)
   • Notes on any failures
```

### Step 5: Next Steps
```
If all tests PASS:
  → Commit changes
  → Start Phase 2 (E2E tests)
  → Estimated: 1–2 days

If critical tests FAIL:
  → Debug issues
  → Check console errors
  → Re-run failed tests
  → Document blockers
```

---

## 🔍 What Each Test Suite Covers

| # | Suite | Tests | Time | Focus |
|---|-------|-------|------|-------|
| 1 | Authentication | 3 | 5 min | Login flows (admin, inactive, active) |
| 2 | Player Active Status ⭐ | 2 | 8 min | **CRITICAL** — newly activated player can purchase |
| 3 | Game Workflow | 3 | 10 min | Game completion, next game activation, year display |
| 4 | Board Purchase | 3 | 12 min | Pricing, balance, repeating boards |
| 5 | Transactions | 2 | 6 min | Approve/reject deposits |
| 6 | UI/UX | 3 | 5 min | Red theme, board numbers (1-16), page titles |
| 7 | Saturday Cutoff | 2 | 5 min | Purchase window restrictions |
| 8 | Auto-Renewal | 1 | 2 min | 0 DKK transaction check |

**Total:** 25 tests, 8 suites, ~53 min (2–3 hours with breaks)

---

## ⭐ Critical Tests (Must Pass)

These 3 tests BLOCK final submission if they fail.

### Test 2.1: Newly Activated Player Can Purchase
**What:** Admin activates a player → player logs in → can purchase board
**Why:** Tests the main bugfix (player active check using `/api/Players/me`)
**Location:** Suite 2, Test 2.1 in MANUAL_TEST_PLAN_SPRINT_5.md
**If Fails:** Entire player active status system is broken

### Test 2.2: Deactivated Player Cannot Purchase
**What:** Active player is deactivated → refreshes page → cannot purchase
**Why:** Verifies the inverse (server state respected immediately)
**Location:** Suite 2, Test 2.2 in MANUAL_TEST_PLAN_SPRINT_5.md
**If Fails:** Authorization checks not working correctly

### Test 3.1: Active Game Shows 2025 (Not 2044)
**What:** Admin dashboard displays current active game year
**Why:** Verifies database was reseeded correctly (BUG-5.1 fix)
**Location:** Suite 3, Test 3.1 in MANUAL_TEST_PLAN_SPRINT_5.md
**If Fails:** Seeding logic still broken (critical for exam submission)

---

## 🐛 If a Test Fails

### Debugging Checklist

```
1. Check Browser Console (F12):
   ☐ Any red error messages?
   ☐ Copy exact error text
   ☐ Check Network tab for failed API calls (red status)

2. Check API Logs:
   ☐ Any exceptions in API terminal window?
   ☐ Check for 500 errors vs 400 validation errors
   ☐ Verify API is responding

3. Check Database:
   ☐ Query: SELECT * FROM "Games" WHERE "Status" = 'Active' LIMIT 1;
   ☐ Is year 2025? (Should be, if reseeded correctly)
   ☐ Check for data integrity issues

4. Restart Services:
   ☐ Kill API (Ctrl+C), restart: dotnet run --project server/DeadPigeons.Api
   ☐ Kill Client (Ctrl+C), restart: npm run dev
   ☐ Clear browser cache (Ctrl+Shift+Del)
   ☐ Reload page

5. Document Failure:
   ☐ Screenshot of error
   ☐ Exact error message from console
   ☐ API response (DevTools Network)
   ☐ Steps to reproduce
```

### When to Ask for Help

If after debugging you're stuck:
1. Check `MANUAL_TEST_PLAN_SPRINT_5.md` for detailed test steps
2. Review `SPRINT_5_SUMMARY.md` for what was changed
3. Check `sprint-05-epic.md` Known Issues section
4. Review recent commits for code changes

---

## 📞 Important Contacts & Info

### Test Credentials
- **Admin:** admin@jerneif.dk / Admin123!
- **Player:** player@jerneif.dk / Player123!

### System URLs
- **API Health:** http://localhost:5000/swagger
- **Application:** http://localhost:5173
- **Database:** PostgreSQL (port 5432)

### Key Files Modified
- `client/src/features/games/GamesPage.tsx` (red theme)
- `client/src/features/boards/PurchaseBoardPage.tsx` (1-16 numbers)
- `server/DeadPigeons.Api/Controllers/PlayersController.cs` (GET /me endpoint)

---

## ✅ Success Criteria

**Manual Testing Complete When:**
```
☐ All 25 test cases executed
☐ 3 critical tests PASSED
☐ Console shows no errors
☐ No failed API requests (Network tab clean)
☐ Test completion sheet signed off
☐ Results documented (if failures exist)
```

**Ready for Next Phase When:**
```
☐ All above criteria met
☐ No critical failures blocking submission
☐ Changes committed to feature branch
→ Proceed to Phase 2 (E2E tests)
```

---

## 📋 Final Checklist

Before you start testing:

```
Environment:
☐ Database reseeded (correct year range)
☐ API running without errors
☐ Client running without errors
☐ Browser cache cleared
☐ DevTools open (F12)

Documentation:
☐ QUICK_TEST_REFERENCE.md available
☐ MANUAL_TEST_PLAN_SPRINT_5.md available
☐ Pen/paper or text editor for notes

Ready?
☐ Yes, start testing!
☐ No, check setup above
```

---

## 🎉 You're Ready!

**Start here:**
1. Open: `docs/testing/QUICK_TEST_REFERENCE.md`
2. Follow the checklist
3. For details on any test, reference: `docs/testing/MANUAL_TEST_PLAN_SPRINT_5.md`
4. Document results on completion sheet (end of manual test plan)

**Estimated time:** 2–3 hours total

**Next after passing:** Phase 2 (E2E tests with Playwright)

---

**Good luck! 🚀**

