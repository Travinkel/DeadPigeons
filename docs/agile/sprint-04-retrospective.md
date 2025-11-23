# Retrospectives and Lessons Learned

This document captures retrospective insights, lessons learned, and process improvements identified across sprints.

---

## Sprint 4 - Process Issues

### CI/CD Silent Failure Incident

**Date Identified:** November 2025

**Summary:**
Releases v1.3.0, v1.3.1, and v1.3.2 were shipped with a CI pipeline that showed as passing despite integration tests silently failing.

**What Went Wrong:**
- Integration tests were not properly failing the CI build
- No validation that test steps actually executed successfully
- Releases proceeded based on misleading "green" status

**Root Cause Analysis:**
The CI pipeline configuration did not properly propagate test failure exit codes. Integration tests could fail without causing the overall pipeline to fail.

**Lessons Learned:**
1. **Verify CI/CD behavior, not just configuration** - A "green" pipeline doesn't guarantee tests passed
2. **Test the tests** - Regularly validate that failing tests actually fail the build
3. **Multiple validation gates** - Don't rely on a single check before deployment

**Action Items:**
| Action | Owner | Status |
|--------|-------|--------|
| Audit CI pipeline exit code handling | DevOps | Pending |
| Add integration test gate validation | DevOps | Pending |
| Implement release checklist with CI verification | Team | Pending |
| Create post-mortem template for releases | PM | Pending |

---

### Additional Findings (Nov 2025)

- A PR merged to `main` with integration tests silently failing on GitHub (missing `Players` table) — discovered post-merge.
- Fly.io deployment failed because both a Fly API token **and** a client app token were needed; deploy job stalled.
- Multiple commits landed directly on `main`, violating GitHub Flow; work should move to feature branches (e.g., `exam-prep`) and merge via PRs.

**Action Items:**
| Action | Owner | Status |
|--------|-------|--------|
| Enforce branch protection and required green integration tests | DevOps | Pending |
| Document Fly token requirements and gate deploy jobs on token presence | DevOps | Pending |
| Move ongoing work to feature branch (`exam-prep`) and keep `main` clean | Team | Pending |

---

## Process Improvements

### Recommended: Release Post-Mortem Practice

**Proposal:**
Implement a mandatory release post-mortem document for each production release that includes:

1. **CI/CD Verification**
   - Confirm all test suites executed
   - Verify test counts match expectations
   - Check for any skipped or ignored tests

2. **Release Checklist**
   - [ ] All tests pass (verified in logs, not just status)
   - [ ] Integration tests executed against real dependencies
   - [ ] No silent failures in pipeline output
   - [ ] Test coverage meets threshold

3. **Known Issues Log**
   - Document any CI/CD anomalies discovered
   - Track patterns across releases

**Template Location:** `docs/agile/templates/release-postmortem.md` (to be created)

---

## Historical Retrospectives

*Previous sprint retrospectives will be documented here as they occur.*
