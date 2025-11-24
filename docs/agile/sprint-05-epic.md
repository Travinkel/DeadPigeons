# Sprint 5 Epic — Exam Prep, Cleanup, and Mobile Polish

**Goal:** Hardening for exam submission: fix CI integrity, restore GitHub Flow, unblock Fly deployment, re-run gated tests, and finish responsive/mobile polish.
**Duration:** Short hardening sprint (exam prep)
**Branch:** `feature/sprint5-polish-ui` (keep `main` clean)

## Objectives

1) **CI Integrity**  
- Fix TestContainers integration tests gate (apply migrations/seed, fail on error).  
- Require E2E/smoke gates before release.  
- Add branch protection to block direct commits to `main`.  

2) **Deployment Readiness**  
- Document and supply both Fly tokens (API and client app).  
- Gate deploy job on token presence; fail fast when missing.  
- Run migrations before seeding on startup.  

3) **Testing**  
- Re-enable/rewrite E2E (TASK-4.12) and smoke tests (TASK-4.13).  
- Verify integration tests green in GitHub Actions.  

4) **Responsive and UI Hardening**  
- Apply design tokens (text-h1..h4, h-10/h-12 controls) consistently in auth flows.  
- Add mobile-first responsive layouts for auth and core flows (<= 375px and 414px).  
- Ensure buttons/forms remain accessible and visible on mobile (no clipped CTAs).  

5) **Process Compliance**  
- Keep active work on `feature/sprint5-polish-ui` (or short-lived feature branches) and merge via PR into `main`.  
- Update exam-alignment.md to reflect real status (tests, deploy, responsive).  
- Add branch protection policy and keep `main` clean to GitHub Flow.  

## Deliverables and Acceptance

- Branch protection enabled; no direct pushes to `main`.  
- CI fails if integration/E2E/smoke fail or are skipped.  
- Fly deploy succeeds with documented token setup (API and client token).  
- Integration tests pass in CI (TestContainers with migrations and seed).  
- E2E and smoke tests present and executable (document how and where to run).  
- exam-alignment.md updated to reflect current compliance.  
- Design tokens visible in auth UI (text-h1 etc.).  
- Mobile layout verified at <= 375px for auth pages and primary flows; CTAs and nav stay usable.  
- API migrates and seeds automatically on startup.  
- Seeder fixed to avoid overwriting real admin/player credentials on each startup; CI updated to use `fly.toml`.  

## Risks and Mitigations

- **Token misconfiguration:** Add preflight check and docs.  
- **Flaky integration tests:** Seed deterministic data; fail hard on migration errors.  
- **Time:** Scope to hardening only; defer new features.  
- **Mobile regressions:** Add mobile viewport checks to PR checklist and smoke/E2E coverage.  
- **Bingo UX defects:** Buying a board with invalid numbers still charges and creates a board; board names are cryptic; player display name missing. Track and fix before release.  
- **Mobile layout break:** Auth/dashboard on phones show a white overlay square; content clipped and clickable outside bounds—requires responsive fixes and smoke coverage.  
- **Game list ordering bug:** Finished games show descending future years (e.g., week 52 of 2044). Fix ordering/formatting before release to avoid confusing users.  
- **Payment flow gap:** Board purchase succeeds without collecting MobilePay ID; payments are recorded but flow skips required payer info. Add validation/UX fix before release.  
- **Dashboard clarity:** Boards display cryptic week codes (e.g., `Uge 77f82341`) and greyed numbers; needs friendly labeling and color updates (e.g., Jerneif red + white) for readability.  
- **/games typography contrast:** Active-game banner uses thin white text on red and inconsistent sizing; increase weight/size for legibility and visual balance.  
- **Admin payments:** Pending deposits show GUIDs as player names and “Godkend” does not approve; must fix name display + approval action.  
- **Finished games correctness:** Admin sees “finished” games in future years; align game generation/ordering with real weeks (see `docs/internal/EXAM.txt` guidance on seeding inactive future weeks).  

## Breakout Tasks (sprint 5)
- Fix board purchase validation so invalid number counts are blocked before charging; ensure board IDs/names render friendly labels (week/year).  
- Enforce MobilePay ID capture on deposit/purchase flows; surface validation errors in UI.  
- Add player display names everywhere (dashboard, admin deposits, board listings).  
- Make “Godkend” approve pending deposits (update status + balance + UI refresh).  
- Correct game list ordering/status to avoid future-year “finished” entries; align with seeded calendar weeks.  
- Retheme dashboard/cards (/games and boards) for legibility: heavier weights on red, consistent heading sizes.  
- Mobile layout fixes: remove white overlay, ensure auth/dashboard fit 360–414px, buttons and nav stay visible.  
- Add smoke/E2E coverage for mobile login and board purchase with validation and MobilePay ID required.  
- UX hardening: apply design tokens (weights/sizes/spacing/colors) across /games, dashboard, boards, and auth for consistent readable hierarchy.  

### UX hardening acceptance + token guide
- Typography weights: headings on red backgrounds use at least semi-bold (600); body on red uses 500; body on white stays 400–500.  
- Sizes: H1 28–32px, H2 24–26px, H3 20–22px, body 16px, small labels 14px.  
- Spacing: vertical rhythm 12–16px on mobile, 16–20px on desktop; card padding 16px mobile, 24px desktop.  
- Color: Jerneif red background with white text meets contrast; avoid thin weights on red. Input/error text stays high-contrast.  
- Cards/banners: cap width for readability; single-column on mobile; no clipped nav/CTAs.  
- Acceptance: mobile (360–414px) and desktop checked for /games banner (“Aktiv”, “Plader”, “Startet”), board lists, dashboard cards, auth forms.  

## User Stories (Gherkin)
```
Feature: Board purchase validation
  As a player
  I want to be stopped when I pick fewer than 5 or more than 8 numbers
  So that I am not charged for an invalid board

  Scenario: Reject invalid board size
    Given I am signed in as player@jerneif.dk
    And I have a positive balance
    When I select an invalid count (e.g., 4, 9) and attempt to buy a board
    Then I see a validation error explaining 5–8 numbers are required
    And no charge or board is created
    And the same holds for all disallowed counts (0–4, 9+)
    And selecting any valid count (5–8) succeeds without duplicate charges
```
```
Feature: MobilePay ID capture
  As a player
  I want to submit my MobilePay ID when depositing or paying
  So that admins can reconcile payments

  Scenario: Require MobilePay ID on deposit
    Given I am on the deposit screen
    When I submit an amount without MobilePay ID
    Then I see a field error requiring MobilePay ID
    And the deposit is not created
```
```
Feature: Friendly board naming
  As a player
  I want boards labeled by week and year
  So I can understand what I bought

  Scenario: Board displays readable title
    Given I purchased a board for week 48 of 2025
    When I view my boards
    Then I see “Uge 48, 2025” instead of a GUID
```
```
Feature: Admin approves deposits
  As an admin
  I want pending deposits to show player names and approve correctly
  So balances update when I click “Godkend”

  Scenario: Approve pending deposit
    Given a pending deposit exists for player@jerneif.dk
    When I click “Godkend”
    Then the deposit status changes to approved
    And the player balance increases
    And the list refreshes without GUIDs
```
```
Feature: Game list correctness
  As a user
  I want finished games ordered and dated correctly
  So I’m not shown future-year completed games

  Scenario: List finished games by recent weeks only
    Given the system seeds future weeks as inactive
    When I view the games list
    Then finished games appear in descending real weeks of the current/previous year
    And no finished games show years that have not occurred
```
```
Feature: Mobile layout stability
  As a mobile user
  I want pages to fit my screen without overlays or clipped content
  So I can navigate and act on CTAs

  Scenario: Dashboard fits 360px wide
    Given I open the dashboard on a 360px viewport
    Then content fits without horizontal scroll
    And nav/buttons remain visible and tappable
    And no white overlay blocks interaction
```

## Definition of Done (Sprint 5)

- [ ] CI gates: unit + integration + E2E + smoke wired and green in GitHub Actions  
- [ ] Fly deploy job succeeds with required tokens  
- [ ] `main` clean; `feature/sprint5-polish-ui` (and short-lived fixes) hold in-flight work  
- [ ] Docs updated (exam-alignment.md, deployment notes, CI steps, branch protection, responsive)  
- [ ] Design system tokens applied in UI (auth headings/buttons/inputs)  
- [ ] Mobile responsive behaviors verified at <= 375px (auth + core flows)  
- [ ] API migrations run on startup (no missing tables in prod)  

## Notes on issue numbering
- GitHub issues in this repo start at #23 because earlier numbers were consumed by prior issues/PRs; production tracking begins with #23 and onward.

## QA & Validation Scope
- **Smoke (CI-aligned):** API health, migrations/seed success, auth login/register, board list fetch, deposit list fetch, one board purchase happy path, one deposit approve path.
- **Integration (Docker):** TestContainers suite green; verify migrations + seed run once and do not overwrite existing admin/player; board purchase rejects <5 or >8 numbers; MobilePay ID required on deposit/purchase.
- **Playwright (mobile + desktop):** Login, register, board purchase, deposit approval flows at 360-414px and desktop; verify CTAs visible, no overlays or clipping.
- **Regression on critical endpoints:** /games ordering and finished state, pending deposits approve action updates balance and refreshes UI, friendly board labels (week/year), CORS/HTTPS config untouched.
- **Docs/ops:** Confirm tokens present for Fly deploy jobs; PR checklist includes screenshots/curl output for UI/API changes; main remains protected with work on `feature/sprint5-polish-ui`.

## Requirements Acceptance Testing (RaT)
- **Source:** docs/internal/EXAM.txt (official brief) and README.md (current state).
- **RaT checkpoints:** distributed app (React client + .NET API + Postgres), auth/authz enforced, validation on inputs, NSwag/OpenAPI present, no secrets in git, TestContainers + Xunit.DependencyInjection in place, all service methods tested (happy/unhappy), cloud deploy path documented (Fly), authz matrix and environment/config notes in README.
- **Execution:** Run after Batch B/C are green; document results and gaps in exam-alignment.md and PR notes.
