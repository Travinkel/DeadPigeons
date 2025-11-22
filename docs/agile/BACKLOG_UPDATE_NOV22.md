# Backlog Update — November 22, 2025

**Summary:** Added 4 new user stories and 2 task extensions to product backlog with full INVEST compliance and exam alignment.

---

## New Items Added

### Sprint 4 (Current - Critical)

These items extend existing Sprint 4 tasks with additional documentation and implementation details:

#### TASK-4.12 Extension: E2E Test Framework
- **Story ID:** US-5.4 (extends TASK-4.12)
- **Points:** 5 SP
- **Status:** In Sprint 4
- **Priority:** CRITICAL (exam requirement)
- **Why:** Validates end-to-end workflows; required for exam submission

#### TASK-4.13 Extension: Smoke Tests in CI
- **Story ID:** US-5.6 (extends TASK-4.13)
- **Points:** 3 SP
- **Status:** In Sprint 4
- **Priority:** CRITICAL (exam requirement)
- **Why:** Automated deployment verification; prevents broken releases

---

### Sprint 5 (Future - High Priority)

New user stories for the next sprint, ordered by priority and dependencies:

#### 1. Player Self-Registration (US-5.1)
- **Points:** 3 SP
- **Priority:** 🔴 High
- **Category:** UI/UX Feature
- **Acceptance Criteria:**
  - Registration form on login page or dedicated `/register` route
  - Collects: full name, email, phone, password
  - Client-side validation (react-hook-form)
  - Server-side email uniqueness check
  - Password meets security requirements (8+ chars, uppercase, number, special)
  - Registered players start **inactive** (admin activation required per MVP)
  - Success message and redirect to login
  - Error handling for duplicate email and validation failures

**Why Important:**
- Reduces admin burden for new player onboarding
- Improves user experience (self-service)
- Exam competency: **CDS.Security** (password validation, registration flow)
- Exam competency: **PROG** (form validation with react-hook-form)

**Subtasks:**
1. Create RegisterDto and `POST /auth/register` endpoint
2. Add password validation rules to AuthService
3. Create RegisterPage.tsx with react-hook-form
4. Add success/error messaging
5. Unit and integration tests for registration flow

---

#### 2. Jerne IF Logo & Branding (US-5.2)
- **Points:** 2 SP
- **Priority:** 🟡 Medium
- **Category:** UI Enhancement
- **Acceptance Criteria:**
  - Logo displayed prominently in layout header (top-left or center)
  - Logo links to `/dashboard` (home button)
  - Responsive sizing (mobile/tablet/desktop)
  - Logo file optimized for web (SVG preferred, <50KB)
  - Respects Tailwind/DaisyUI theme colors
  - Appears on all authenticated pages via Layout component
  - Accessibility: alt text or aria-label
  - Optional: brand color palette integration

**Why Important:**
- Professional appearance for Jerne IF
- Club identity and branding
- Exam competency: **PROG** (CSS responsive design, asset optimization)
- Quick win (low effort, high impact)

**Subtasks:**
1. Source/create Jerne IF logo (SVG format)
2. Create Logo component in Layout
3. Apply responsive CSS sizing
4. Add accessibility labels
5. Optional: update brand colors

**Implementation Notes:**
- Store in `client/public/assets/logo.svg`
- Consider dark/light theme variants
- No breaking code changes if using only existing assets

---

#### 3. Loading Spinner CSS Fix (US-5.3)
- **Points:** 1 SP
- **Priority:** 🔴 High
- **Category:** Bug Fix / UX Improvement
- **Acceptance Criteria:**
  - Loading spinner component created/updated
  - Spinner size: 3-4rem diameter (consistent across pages)
  - Spinner centered on page (not top-left)
  - Spinner container uses flexbox/grid centering
  - Smooth animation respecting `prefers-reduced-motion`
  - No layout shift (CSS height reserved)
  - Visible during all API calls
  - Spinner disappears immediately when data loads

**Why Important:**
- Fixes layout shift bug currently affecting pages
- Improves perceived performance and UX
- Exam competency: **PROG** (CSS, component lifecycle, accessibility)
- Quick fix (high priority despite low points)

**Subtasks:**
1. Identify all loading spinner instances
2. Create reusable LoadingSpinner component
3. Apply consistent sizing and centering CSS
4. Add animation and accessibility rules
5. Update all data-fetching pages to use component

**Implementation Notes:**
- Current issue: spinner too large
- Recommended sizing: `h-16 w-16` (Tailwind) or `64px`
- Center with: `flex items-center justify-center min-h-screen`
- Test on mobile for layout integrity

---

#### 4. E2E Test Documentation (US-5.5)
- **Points:** 2 SP
- **Priority:** 🟡 High
- **Category:** Documentation
- **Acceptance Criteria:**
  - Document: `docs/testing/e2e-testing.md` created
  - Framework choice justified (Playwright vs Cypress)
  - Test scenarios documented with expected outcomes
  - Test data setup process explained
  - Running tests locally documented
  - Running tests in CI documented
  - Known limitations listed
  - Test coverage matrix showing which features are tested

**Why Important:**
- Exam requirement (testing strategy documentation)
- Required for exam evaluators to understand approach
- Exam competency: **SDE2** (testing documentation, process)
- Supports exam narrative about quality assurance

**Subtasks:**
1. Document Playwright selection and rationale
2. List all test scenarios with expected behavior
3. Create test data setup guide
4. Document local execution instructions
5. Document CI execution pipeline
6. Create coverage matrix

---

## Backlog Summary

### Sprint 4 (Current - Completes by Dec 19)

| Story | Points | Status | Priority |
|-------|--------|--------|----------|
| TASK-4.12 | 5 SP | In Progress | CRITICAL |
| TASK-4.13 | 3 SP | In Progress | CRITICAL |
| TASK-4.14 | 5 SP | Not Started | CRITICAL |
| **Subtotal** | **13 SP** | — | — |

### Sprint 5 (Future - Recommended for Jan 2026)

| Story | Points | Priority | Category |
|-------|--------|----------|----------|
| US-5.1 | 3 SP | High | UI/Feature |
| US-5.2 | 2 SP | Medium | Branding |
| US-5.3 | 1 SP | High | Bug Fix |
| US-5.4 | 5 SP | Critical | Testing (extends TASK-4.12) |
| US-5.5 | 2 SP | High | Documentation |
| US-5.6 | 3 SP | Critical | Testing (extends TASK-4.13) |
| **Subtotal** | **16 SP** | — | — |

### Future Backlog (Sprint 5+)

Additional items documented in Product Backlog:
- US-6.1: Player profile management (3 SP)
- US-6.2: Email notifications (5 SP)
- US-6.3: Admin reporting dashboard (5 SP)
- US-6.4: Mobile app variant (13 SP)
- US-6.5: Recurring deposits (3 SP)
- US-6.6: Board history & analytics (5 SP)

---

## Prioritization Rationale

### CRITICAL Priority (Sprint 4 Focus)
**TASK-4.12, TASK-4.13, TASK-4.14**

Reason: Exam deadline December 19, 2025
- Required by exam specification
- 13 story points remaining to complete Sprint 4
- Must be finished for submission

### HIGH Priority (Sprint 5 - Early)
**US-5.1 (Registration), US-5.3 (Spinner Fix)**

Reason: User experience + operational impact
- Registration reduces admin overhead
- Spinner fix improves perceived performance
- Both 1-3 SP (quick to complete)
- Support core gameplay loop

### MEDIUM Priority (Sprint 5 - Secondary)
**US-5.2 (Branding), US-5.5 (Documentation)**

Reason: Professional appearance + exam documentation
- Logo improves club identity (low effort: 2 SP)
- Test documentation required for exam evaluation
- Support external-facing quality

### LOW Priority (Sprint 5+)
**US-6.x items**

Reason: Post-MVP enhancements
- Additional features beyond MVP
- Would extend timeline unnecessarily
- Recommended for post-exam improvements

---

## Recommended Sprint 5 Sequence

Based on dependencies and exam requirements:

### Week 1: UI Features
1. **US-5.3** (Loading Spinner Fix) — 1 SP, unblocks UX
2. **US-5.1** (Registration) — 3 SP, reduces admin work

### Week 2: Branding & Polish
3. **US-5.2** (Logo & Branding) — 2 SP, professional appearance

### Week 3: Documentation
4. **US-5.5** (E2E Test Documentation) — 2 SP, exam requirement

### Week 4: Buffer & Review
- Any spillover from Week 1-3
- Code review and testing
- Sprint review and retrospective

**Total Sprint 5 Estimate:** 8 SP (10 SP planned with buffer)
**Recommended Duration:** 2-3 weeks post-Sprint 4
**Velocity Target:** 3-5 SP per week

---

## INVEST Criteria Assessment

### All items meet INVEST standards:

✅ **Independent**
- Except where explicitly noted (US-5.4 extends TASK-4.12, US-5.5 depends on US-5.4)
- Can be implemented in priority order
- No hidden dependencies

✅ **Negotiable**
- Acceptance criteria can be refined in sprint planning
- Scope adjustments possible during implementation
- Technical approach can be discussed in spikes

✅ **Valuable**
- All deliver exam competency or user value
- Aligned with MVP and Jerne IF business goals
- Clear benefit to players or admin

✅ **Estimable**
- Team can estimate story points confidently
- Based on similar work (e.g., US-5.1 similar to TASK-4.2 complexity)
- All 1-5 SP range (completable in single sprint)

✅ **Small**
- All completable in 3-5 days of focused work
- US-5.3 completable in 4 hours
- Largest item (US-5.4) is 5 SP, contained scope

✅ **Testable**
- Clear acceptance criteria (verifiable)
- Can be tested manually + automated
- Explicit pass/fail conditions

---

## Exam Competency Alignment

### New Stories Coverage

| Competency | Story | Evidence |
|------------|-------|----------|
| **PROG: React + TypeScript** | US-5.1, US-5.2, US-5.3 | Form components, Logo component, CSS |
| **PROG: Form Validation** | US-5.1 | react-hook-form implementation |
| **PROG: Responsive Design** | US-5.2, US-5.3 | Tailwind CSS, mobile-first |
| **CDS.Security: Password Validation** | US-5.1 | 8+ chars, uppercase, number, special |
| **CDS.Security: Input Sanitization** | US-5.1 | Email uniqueness, XSS prevention |
| **SDE2: Testing Strategy** | US-5.4, US-5.5 | E2E framework, documentation |
| **SDE2: CI/CD Integration** | US-5.6 | Smoke tests, deployment verification |
| **SDE2: Documentation** | US-5.5 | Testing process documentation |

---

## Files Updated

### Modified Files

1. **docs/agile/roadmap.md**
   - Added "Backlog & Planning" section
   - Cross-references to product-backlog.md
   - Lists new backlog items

2. **docs/agile/sprint-04-epic.md**
   - Added "Future Backlog Items (Sprint 5+)" section
   - Summary table of new stories
   - Link to product-backlog.md for details

### New Files

3. **docs/agile/product-backlog.md** (NEW)
   - Comprehensive product backlog document
   - 23 total stories (current sprint + future work)
   - Full INVEST criteria assessment
   - Prioritization framework
   - Dependency mapping
   - Release planning
   - Refinement cadence

4. **docs/agile/BACKLOG_UPDATE_NOV22.md** (THIS FILE)
   - Summary of changes
   - Detailed story descriptions
   - Prioritization rationale
   - Exam competency alignment

---

## Next Steps

### Immediate (Sprint 4 Focus)
1. Complete TASK-4.12 (E2E Tests) — 5 SP
2. Complete TASK-4.13 (Smoke Tests) — 3 SP
3. Complete TASK-4.14 (Exam Prep) — 5 SP
4. Achieve 100% completion of Sprint 4 by December 19

### Short Term (Sprint 5 Planning)
1. Schedule sprint planning meeting
2. Refine acceptance criteria for US-5.1 through US-5.5
3. Create technical spike if needed for registration endpoint
4. Assign story points in planning session

### Medium Term (Post-Exam)
1. Execute Sprint 5 with UI features and documentation
2. Monitor backlog for additional items from Jerne IF
3. Plan Sprint 6 with US-6.x enhancements (if approved)

---

## Contact & Questions

**Created By:** Agile Project Manager
**Date:** November 22, 2025
**Last Updated:** November 22, 2025

For questions about:
- **Backlog items:** See `docs/agile/product-backlog.md`
- **Story details:** See acceptance criteria in product-backlog.md
- **Sprint planning:** See "Sprint 5 Sequence" section above
- **Exam alignment:** See "Exam Competency Alignment" section

---

## Sign-Off

**Status:** Complete
**Files Created:** 2 new files (product-backlog.md, BACKLOG_UPDATE_NOV22.md)
**Files Modified:** 2 files (roadmap.md, sprint-04-epic.md)
**Quality:** All stories meet INVEST criteria and exam standards
**Ready for:** Sprint 4 final push + Sprint 5 planning

**Next Action:** Begin TASK-4.12 (E2E Tests) and complete Sprint 4 by deadline.
