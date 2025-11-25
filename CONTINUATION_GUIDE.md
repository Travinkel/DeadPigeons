# Continuation Guide — Dead Pigeons Sprint 5 & Beyond

**Last Updated**: 2025-11-25
**Status**: Sprint 5 Complete — All major functional and UX fixes implemented
**Next Phase**: Exam preparation, E2E testing, deployment

---

## 📋 Quick Navigation

- **For implementing new features**: → [Adding New Features](#adding-new-features)
- **For design token compliance**: → [Design Token System](#design-token-system)
- **For bug fixes**: → [Bug Fix Workflow](#bug-fix-workflow)
- **For testing**: → [Testing & Validation](#testing--validation)
- **For git workflow**: → [Git Conventions](#git-conventions)
- **For agent usage**: → [Using Claude Code Agents](#using-claude-code-agents)

---

## 🎯 What Was Completed (Sprint 5)

### Functional Fixes (All Critical Issues)
1. ✅ **Dashboard Active Boards Count** - Fixed filtering to show only active game boards (not historical)
2. ✅ **Deposit API Response Code** - Changed from 200 OK to 201 Created (REST compliance)
3. ✅ **Integration Test Fixes** - Fixed CompleteGame validation, BoardService activation, TransactionService approval
4. ✅ **Page Titles** - Changed from dark red to black per design tokens (6 files)
5. ✅ **Badge Styling** - Fixed "Automatisk"/"Enkelt" badges with proper padding and spacing
6. ✅ **Transaction Reject Flow** - Implemented soft-delete endpoint + admin UI
7. ✅ **Timestamp Display** - Show ApprovedAt instead of CreatedAt for approved deposits

### UX & Design Token Improvements
1. ✅ **Table Styling** - Applied leading-body, text-base, consistent spacing to all tables
2. ✅ **Card Geometry** - Updated rounded-box → rounded-2xl, shadow-md → shadow-sm
3. ✅ **Admin Spil Redesign** - Year selector dropdown, year-grouped table, auto-scroll
4. ✅ **Typography System** - Full line-height and tracking scales in tailwind.config.js
5. ✅ **Component Patterns** - Documented in BODY_TEXT_QUICK_REFERENCE.md

### Documentation Created
- ✅ `DESIGN_TOKENS_MATH.md` - Complete design token specifications
- ✅ `DESIGN_TOKENS_IMPROVEMENTS.md` - Line-height, tracking, color matrix
- ✅ `BODY_TEXT_QUICK_REFERENCE.md` - Copy-paste component patterns
- ✅ `RAT_RESULTS_2025-11-25.md` - Functional test results
- ✅ `UX_BACKLOG_SPRINT_5.md` - Prioritized UX improvements backlog
- ✅ `SPRINT_5_STATUS.md` - Phase tracking and completion status

---

## 🎨 Design Token System

### Authority Documents (Use These as Reference)

All styling MUST comply with these three documents in this priority:

1. **DESIGN_TOKENS_MATH.md** (Type scale, spacing scale, color matrix)
   - Typography: `t-1` to `t5` using Major Third scale (1.25×)
   - Spacing: `s0` to `s8` using √2 scale (1.414×)
   - Colors: Jerne IF red (#d40000) + DaisyUI semantic classes

2. **DESIGN_TOKENS_IMPROVEMENTS.md** (Line-height, tracking, accessibility)
   - Line-height scale: `leading-caption` (1.2), `leading-body` (1.5), `leading-display` (1.25), `leading-jumbo` (1.1)
   - Tracking scale: `tracking-tight` (-0.025em), `tracking-normal` (0), `tracking-wide` (0.05em), `tracking-wider` (0.1em)
   - WCAG AA compliance matrix for colors

3. **BODY_TEXT_QUICK_REFERENCE.md** (Component patterns, quick copy-paste)
   - 8 reusable component patterns
   - Form field structure specification
   - Typography cheat sheet
   - Common mistakes to avoid

### Tailwind Config Extensions

The following tokens are already configured in `client/tailwind.config.js`:

```javascript
theme: {
  lineHeight: {
    'caption': '1.2',
    'body': '1.5',
    'display': '1.25',
    'jumbo': '1.1',
  },
  letterSpacing: {
    'tight': '-0.025em',
    'normal': '0em',
    'wide': '0.05em',
    'wider': '0.1em',
  },
}
```

**You can use these immediately in any component.**

### When Adding New Components

1. **Never use arbitrary values** (`text-[18px]`, `px-[7px]`, `bg-[#abc123]`)
2. **Map everything to tokens**:
   - Typography: Use `text-h1` through `text-h5`, `text-base`, `text-sm`, `text-xs`
   - Spacing: Use `px-3`, `px-4`, `px-6`, `py-3`, `py-4`, `py-6`, `gap-2`, `gap-4`, etc.
   - Line-height: Pair with `leading-body`, `leading-display`, `leading-jumbo`, `leading-caption`
   - Colors: Use `text-base-content`, `text-base-content/70`, `bg-primary`, `border-base-300`, etc.
3. **Add comments** when a token choice is non-obvious
4. **Reference the authority documents** in PR descriptions

### Example: Creating a New Card Component

❌ **Don't do this**:
```tsx
<div className="bg-white rounded-lg p-4 shadow-md border border-gray-300">
  <h2 className="text-lg font-bold mb-2">Title</h2>
  <p className="text-gray-600 text-sm">Description</p>
</div>
```

✅ **Do this**:
```tsx
<div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 px-6 py-4 space-y-2">
  {/* Heading: t2 (text-2xl) with leading-display + tracking-tight */}
  <h2 className="text-h2 text-base-content font-semibold leading-display tracking-tight">
    Title
  </h2>

  {/* Body text: t-1 (text-base) with leading-body + muted color */}
  <p className="text-base text-base-content/70 leading-body">
    Description
  </p>
</div>
```

---

## 🔧 Bug Fix Workflow

### When You Discover a Bug

**Step 1: Document It**
- Create a GitHub issue or note in the test plan
- Include: Expected behavior, actual behavior, steps to reproduce
- Link to related tests if applicable

**Step 2: Classify the Bug**

| Category | Example | Urgency | Who Fixes |
|----------|---------|---------|-----------|
| Functional | API returns 400 on valid input | CRITICAL | easv-fullstack-engineer agent |
| UX/Design | Button text is unclear | HIGH | jerne-ux-architect agent |
| Data | Balance calculation wrong | CRITICAL | easv-fullstack-engineer agent |
| Styling | Colors don't match tokens | MEDIUM | jerne-ux-architect agent |
| Performance | Page loads slowly | LOW | easv-fullstack-engineer agent |

**Step 3: Activate the Appropriate Agent**

For **functional/backend bugs**:
```
Activate: easv-fullstack-engineer agent
Task: Fix [bug description]
Context: [include error message, test output, file paths]
```

For **UX/design/styling bugs**:
```
Activate: jerne-ux-architect agent
Task: Fix [bug description]
Context: [include screenshots, design token violations, affected files]
```

**Step 4: Follow Agent Output**
- Agent will provide before/after code patches
- Review changes against design tokens and test coverage
- Confirm build passes: `npm run build` + `dotnet build`
- Verify no new test failures: `dotnet test` (requires Docker)

**Step 5: Commit**
```bash
git add .
git commit -m "fix: [description] - closes #[issue number]"
```

---

## 🧪 Testing & Validation

### Manual Testing (Before Submission)

Use the following test plans in order:

1. **QUICK_TEST_REFERENCE.md** (5-minute smoke test)
   - Quick sanity check for core flows
   - Use when you need fast validation

2. **MANUAL_TEST_PLAN_SPRINT_5.md** (45-minute comprehensive)
   - Full test suite for all functionality
   - Use before submitting to exam

3. **EXAM_PREP_CHECKLIST.md** (Exam readiness checklist)
   - Ensures all exam requirements are met
   - Final verification before submission

### Integration Tests (Backend)

Requires Docker running:

```bash
# Start Docker Desktop first, then:
dotnet test DeadPigeons.sln

# Run specific test suite:
dotnet test --filter "FullyQualifiedName~BoardsApiTests"

# Run with detailed output:
dotnet test --verbosity detailed
```

**Current Status**: 56 tests passing (as of 2025-11-25)

### Build Verification

Always verify before committing:

```bash
# Client build
cd client && npm run build

# Backend build
dotnet build DeadPigeons.sln --configuration Release

# Both together
cd client && npm run build && cd .. && dotnet build
```

**Target**: 0 TypeScript errors, 0 compiler errors

---

## 📝 Adding New Features

### Feature Implementation Workflow

**Step 1: Create a User Story**
- Go to `docs/agile/` directory
- Use agile-project-manager agent to create properly formatted user story
- Ensure story follows INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable)

**Step 2: Plan the Implementation**
- Is it frontend-only? → Consider feature scope
- Is it backend-only? → Plan API contract
- Is it both? → Split into frontend + backend tasks
- Document in user story

**Step 3: Design Against Tokens**
- If adding UI: Review DESIGN_TOKENS_MATH.md
- If adding forms: Check BODY_TEXT_QUICK_REFERENCE.md patterns
- Sketch component structure
- Identify what design tokens to use

**Step 4: Implement Incrementally**
- Backend: Create API endpoint → Test with integration test → Test with frontend
- Frontend: Create component → Wire to API → Test manually
- Never implement both simultaneously without testing in between

**Step 5: Test Each Layer**
- Unit tests for business logic (if applicable)
- Integration tests for API (backend only)
- Manual tests for full user flow (frontend + backend)
- Design compliance check

**Step 6: Document & Commit**
- Add comments for non-obvious logic
- Update relevant markdown documentation
- Create conventional commit:
  ```bash
  git commit -m "feat: [feature description]

  Adds [component/endpoint] to support [use case].

  Breaking changes: none
  Design tokens: [list any new tokens used]
  Tests added: [list test names]

  🤖 Generated with Claude Code"
  ```

---

## 🤖 Using Claude Code Agents

### Available Agents & When to Use Them

#### 1. **easv-fullstack-engineer**
**Best for**: Backend fixes, API changes, business logic, integration tests, .NET/React architecture

```
Activate when:
- Fixing functional bugs
- Adding API endpoints
- Changing database schemas
- Implementing business logic
- Fixing integration test failures
- Refactoring services/controllers
```

**Example Prompt**:
```
Fix the board balance deduction logic in BoardService.CreateAsync.

Current issue: Balance is not being deducted correctly when a board is created.

Context:
- File: server/DeadPigeons.Api/Services/BoardService.cs
- Integration test failing: BoardsApiTests.Create_DeductsBalance
- Expected: Player balance should decrease by board cost
- Actual: Balance not changing

Use EF Core patterns from the codebase. Ensure atomic transaction.
```

#### 2. **jerne-ux-architect**
**Best for**: UI design, component styling, layout improvements, design token compliance

```
Activate when:
- Designing new pages/components
- Fixing design token violations
- Improving UX/layout
- Adjusting typography/spacing
- Creating responsive designs
- Evaluating design compliance
```

**Example Prompt**:
```
Redesign the Admin Spil page year selector.

Current: Horizontal pill buttons (2025, 2024, 2023, etc.) that wrap on mobile.
Target: Dropdown + year-grouped table layout per DESIGN_TOKENS_MATH.md

Requirements:
1. Use native <select> dropdown for year filter
2. Group table rows by year with headers
3. Highlight active game with bg-primary/10 + border-primary
4. All cards use rounded-2xl + shadow-sm
5. Full design token compliance
```

#### 3. **agile-project-manager**
**Best for**: Sprint planning, user stories, backlog management, documentation

```
Activate when:
- Creating user stories
- Planning sprints
- Updating roadmaps
- Organizing epics
- Tracking progress
```

**Example Prompt**:
```
Create a user story for transaction filtering on the admin transactions page.

As: Admin
I want to: Filter transactions by player name or MobilePay ID
So that: I can quickly find specific player transactions

Acceptance Criteria:
1. Search box filters transactions in real-time
2. Case-insensitive matching
3. Partial matches supported
4. "Clear" button resets filter
5. No performance regression

Use INVEST criteria.
```

### Agent Best Practices

✅ **Do this**:
- Provide clear, specific task description
- Include relevant file paths and line numbers
- Reference authority documents (DESIGN_TOKENS_MATH.md, etc.)
- Specify expected output format
- Include context from previous work
- Ask for regression checks

❌ **Don't do this**:
- Vague prompts ("make it better")
- Incomplete context (missing file paths)
- Asking agents to "rewrite everything"
- Not specifying acceptance criteria
- Ignoring agent feedback
- Committing without verifying build

### Agent Output Process

After agent completes task:

1. **Review the changes** - Read before/after code
2. **Check build** - Verify 0 errors: `npm run build` + `dotnet build`
3. **Test manually** - If frontend, test in browser; if backend, run integration tests
4. **Review design tokens** - Ensure no arbitrary values
5. **Commit** - Use agent's provided commit message as template
6. **Update documentation** - Add to relevant markdown files if needed

---

## 📌 Git Conventions

### Branch Naming
```
feature/[feature-name]      # New feature
fix/[bug-name]              # Bug fix
refactor/[area]             # Code cleanup
docs/[topic]                # Documentation only
chore/[task]                # Maintenance, dependencies
```

Current branch: `feature/ui-client-fixes`

### Commit Message Format

```
[type]([scope]): [description]

[optional body]

[optional footer]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**: feat, fix, refactor, docs, test, chore, style, perf, ci

**Examples**:
```
feat(admin): implement transaction reject flow

fix(dashboard): correct active boards count filter

refactor(types): improve transaction model structure

docs(design): add line-height scale to tailwind config
```

### Before Committing

1. Run linter: `npm run lint:fix` (client)
2. Run build: `npm run build` + `dotnet build`
3. Run tests: `dotnet test` (if Docker available)
4. Check git status: `git status --short`
5. Review diff: `git diff --staged`

### Pushing & Creating PRs

```bash
# Push to remote
git push origin feature/ui-client-fixes

# Create PR using gh CLI
gh pr create --title "Sprint 5: Complete functional & UX fixes" \
  --body "$(cat <<'EOF'
## Summary
- Fixed dashboard active boards count
- Applied design tokens to all components
- Implemented transaction reject flow
- Redesigned admin spil page

## Test Plan
- [x] QUICK_TEST_REFERENCE.md passed
- [x] MANUAL_TEST_PLAN_SPRINT_5.md passed
- [x] Integration tests passing
- [x] Build: 0 errors

## Design Tokens
- All components use DESIGN_TOKENS_MATH.md
- No arbitrary Tailwind values
- WCAG AA compliance verified
EOF
)"
```

---

## 📚 Documentation Reference

### Core Documentation (Read These First)

| Document | Purpose | When to Use |
|----------|---------|-----------|
| `DESIGN_TOKENS_MATH.md` | Complete design system spec | Before designing any UI |
| `DESIGN_TOKENS_IMPROVEMENTS.md` | Typography & accessibility | When styling text components |
| `BODY_TEXT_QUICK_REFERENCE.md` | Component patterns | When building forms/tables |
| `MANUAL_TEST_PLAN_SPRINT_5.md` | Functional test suite | Before submitting features |
| `EXAM_PREP_CHECKLIST.md` | Exam requirements | Final validation |

### Agile Documentation (Track Progress)

- `SPRINT_5_STATUS.md` - Phase tracking and completion status
- `sprint-05-epic.md` - Epic breakdown and user stories
- `UX_BACKLOG_SPRINT_5.md` - Prioritized UX improvements
- `RAT_RESULTS_2025-11-25.md` - Testing results and known issues

### Architecture Documentation

- `README.md` (root) - Project overview
- `CLAUDE.md` - Claude Code guidance (already in codebase)
- `EXAM.txt` - Exam requirements and submission checklist

---

## 🚀 Next Immediate Tasks

### Before Exam Submission

1. **Database Migrations**
   ```bash
   # Apply pending migrations from transaction soft-delete
   dotnet ef database update --project server/DeadPigeons.DataAccess --startup-project server/DeadPigeons.Api
   ```

2. **API Server**
   ```bash
   # Build and test locally
   dotnet run --project server/DeadPigeons.Api

   # Verify API is running on http://localhost:5000
   # Test swagger: http://localhost:5000/swagger
   ```

3. **Client Build & Serve**
   ```bash
   # Build for production
   npm run build

   # Verify no errors, check bundle size
   # Test locally: npm run dev (if needed)
   ```

4. **Final Testing**
   - Run EXAM_PREP_CHECKLIST.md
   - Run QUICK_TEST_REFERENCE.md
   - Verify all core flows work
   - Check design compliance visually

5. **Deployment** (When Ready)
   - Push to main branch
   - Deploy to Fly.io (see README.md for instructions)

---

## ⚠️ Common Pitfalls

### Don't:
- ❌ Use arbitrary Tailwind values (`text-[18px]`, `px-[7px]`)
- ❌ Hardcode colors instead of using semantic classes
- ❌ Ignore line-height on body text (breaks WCAG)
- ❌ Modify tests without understanding the business logic
- ❌ Push directly to main branch (always use PRs)
- ❌ Assume design tokens without checking the authority docs
- ❌ Skip regression testing after bug fixes

### Do:
- ✅ Always reference DESIGN_TOKENS_MATH.md for styling
- ✅ Use semantic color classes (text-base-content, not text-gray-800)
- ✅ Apply leading-body to all body text
- ✅ Test changes manually before committing
- ✅ Create PRs and request review
- ✅ Update documentation when changing behavior
- ✅ Verify build passes: 0 errors, 0 warnings

---

## 🆘 Getting Help

### If Something Breaks

1. **Check the error message** - Read the full console output
2. **Google the error** - Usually indicates the issue
3. **Revert the change** - `git revert HEAD` or `git reset --hard HEAD^`
4. **Activate appropriate agent**:
   - Backend error → easv-fullstack-engineer
   - UI error → jerne-ux-architect
   - Git/setup error → Ask for help directly

### If You're Unsure About Design Tokens

1. Check DESIGN_TOKENS_MATH.md for the spec
2. Look at existing components for patterns (e.g., BoardsPage.tsx)
3. Reference BODY_TEXT_QUICK_REFERENCE.md for examples
4. Ask jerne-ux-architect agent for design review

### If You Need a New Feature

1. Create a user story using agile-project-manager agent
2. Plan implementation using easv-fullstack-engineer agent
3. Design UI using jerne-ux-architect agent
4. Implement incrementally
5. Test manually before merging

---

## 📊 Current Project Status

**Sprint 5**: ✅ COMPLETE
- All functional bugs fixed
- All UX improvements implemented
- Design token system fully established
- 56 integration tests passing
- Build verified: 0 errors

**Ready For**:
- Exam submission
- E2E testing
- Production deployment

**Known Limitations**:
- Saturday 17:00 cutoff timing tests skipped (time-dependent)
- Some UX polish items deferred (non-critical)
- Dark mode not yet implemented (future enhancement)

---

## 📞 Quick Command Reference

```bash
# Clone/setup
git clone [repo]
cd DeadPigeons
cd client && npm install && cd ..
dotnet restore

# Daily development
cd client && npm run dev              # Start client dev server (port 5173)
dotnet run --project server/DeadPigeons.Api  # Start API (port 5000)

# Before committing
npm run lint:fix                      # Fix linting issues
npm run format                        # Format code
npm run build                         # Build for production
dotnet build DeadPigeons.sln          # Build backend

# Testing
dotnet test DeadPigeons.sln           # Run integration tests (requires Docker)
npm run test                          # Client unit tests (if available)

# Database
dotnet ef migrations add [name] --project server/DeadPigeons.DataAccess --startup-project server/DeadPigeons.Api
dotnet ef database update --project server/DeadPigeons.DataAccess --startup-project server/DeadPigeons.Api
dotnet ef database drop --project server/DeadPigeons.DataAccess --startup-project server/DeadPigeons.Api

# Git
git status --short                    # Quick status
git diff                              # View unstaged changes
git diff --staged                     # View staged changes
git log --oneline -5                  # Recent commits
git push origin [branch]              # Push to remote
```

---

## 🎯 Success Criteria

When adding new work, ensure:

- ✅ Code follows DESIGN_TOKENS_MATH.md (if UI)
- ✅ All tests pass (integration + manual)
- ✅ Build succeeds: 0 errors, 0 warnings
- ✅ No breaking changes to existing features
- ✅ Git commit follows conventions
- ✅ Documentation updated
- ✅ PR created and reviewed
- ✅ No arbitrary Tailwind values

---

**Document Maintained By**: Claude Code (Haiku 4.5)
**Last Update**: 2025-11-25 22:30
**Next Review**: After exam submission or when major changes are planned

For questions, refer to the CLAUDE.md file in the project root or consult the authority design token documents.
