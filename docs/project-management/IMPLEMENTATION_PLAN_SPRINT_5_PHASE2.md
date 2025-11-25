# Sprint 5 Phase 2: UX Polish & Design Token Integration

**Date:** November 25, 2025
**Status:** Planning
**Focus:** Design System Alignment + Navigation/Interaction Polish

---

## Executive Summary

Five targeted UX improvements align with DESIGN_SYSTEM.md and address breadcrumb navigation, typography consistency, color theming, and interaction patterns. All changes use DaisyUI tokens and follow the Major Third typography scale (1.25x).

---

## Issue 1: Breadcrumb Navigation (Non-functional)

### Problem
Breadcrumbs in admin pages are static text, not interactive links. Example: "Admin / Spillere / Ny spiller" should navigate.

### Root Cause
Using plain `<a href>` tags instead of React Router `<Link>` component.

### Solution
Replace all breadcrumb anchors with React Router links:

```typescript
// BEFORE (static):
<p className="text-sm text-base-content/70">
  <a href="/admin">Admin</a> / Spillere / {player.name}
</p>

// AFTER (functional):
<p className="text-sm text-base-content/70">
  <Link to="/admin" className="link link-hover">Admin</Link>
  {" "} / <Link to="/admin/players" className="link link-hover">Spillere</Link>
  {" "} / {player.name}
</p>
```

**Files to Update:**
- `PlayerDetailPage.tsx` (Line 182-186)
- `AdminCreatePlayerPage.tsx` (Line 73-75)
- Any other admin pages with breadcrumbs

**Impact:** Medium; improves navigation intuitiveness

---

## Issue 2: Body Text Typography Not Following Design System

### Problem
Body text (breadcrumbs, email, descriptions) uses inconsistent styling. Should follow DESIGN_SYSTEM.md spacing and color hierarchy:
- Primary body: `text-base` (16px, 400), `text-base-content`
- Secondary/muted: `text-sm` (14px), `text-base-content/70`

### Root Cause
Some text uses raw color classes instead of semantic base-content colors.

### Solution
Audit and standardize body text across admin pages:

```typescript
// PATTERN 1: Primary body text
<p className="text-base text-base-content">
  [Active, primary information]
</p>

// PATTERN 2: Secondary/muted text (descriptions, hints)
<p className="text-sm text-base-content/70">
  [Breadcrumbs, subtitles, helper text]
</p>

// PATTERN 3: Small hints (helper text under inputs)
<label className="label">
  <span className="label-text-alt text-xs text-base-content/60">
    [Very small explanatory text]
  </span>
</label>
```

**Pages to Audit:**
- AdminPlayersPage (email column)
- PlayerDetailPage (all body text)
- AdminDashboard (all descriptions)
- AdminTransactionsPage (all descriptions)

**Impact:** High; improves readability and visual hierarchy

---

## Issue 3: Next Game Logic Filters by Year Incorrectly

### Problem
"Næste spil (klar til aktivering)" shows 2024 instead of correct upcoming week.

### Root Cause
Filter logic doesn't properly check `year >= activeGame.year`. Logic flow:
1. Get active game (e.g., Uge 48, 2025)
2. Filter future games where `status !== Active` AND `status !== Completed`
3. Sort descending by year, then week
4. Take last item (should be earliest upcoming)

### Solution
Update AdminGamesPage.tsx filter logic:

```typescript
// BEFORE (incomplete):
const upcomingGames = sortedGames.filter((g) => g.status !== "Active" && !g.completedAt);
const nextGame = upcomingGames.length > 0 ? upcomingGames[upcomingGames.length - 1] : null;

// AFTER (correct year logic):
const activeGame = games.find((g) => g.status === "Active");
const upcomingGames = games
  .filter((g) => {
    if (g.status === "Active" || g.status === "Completed") return false;
    if (!activeGame) return true; // If no active game, show all future
    // Only show games in same year or later
    return (g.year || 0) >= (activeGame.year || 0);
  })
  .sort((a, b) => {
    const yearDiff = (b.year || 0) - (a.year || 0);
    if (yearDiff !== 0) return yearDiff;
    return (b.weekNumber || 0) - (a.weekNumber || 0);
  });

const nextGame = upcomingGames[upcomingGames.length - 1] || null;
```

**Files to Update:**
- `AdminGamesPage.tsx` (Lines 57-66)

**Backend Consideration:**
Verify `GET /api/Games` endpoint returns games with correct year field for all 20-year range (2024-2045).

**Impact:** Critical; fixes core game workflow logic

---

## Issue 4: Admin Dashboard Missing Subtitle

### Problem
Dashboard violates EXAM requirement: "Every page must have title + subtitle".

### Solution
Add subtitle matching pattern across admin:

```typescript
// In AdminDashboard.tsx, after h1:
<div className="space-y-2">
  <h1 className="text-h1" style={{ color: "#111111" }}>
    Admin Dashboard
  </h1>
  <p className="text-base text-base-content/70">
    Oversigt over nøgledata for spillere, spil og transaktioner.
  </p>
</div>
```

**Pattern:** Every admin page h1 + subtitle in `space-y-2` wrapper

**Files to Update:**
- `AdminDashboard.tsx`
- `AdminTransactionsPage.tsx`

**Impact:** Medium; EXAM compliance

---

## Issue 5: Admin Transactions Page Uses Dark Red (#991B1B) Instead of Jerne IF Red

### Problem
Some elements use Tailwind's `red-700` or hardcoded dark red instead of DaisyUI's `error` (which maps to Jerne IF red #D40000).

### Solution
Replace all color references with DaisyUI semantic classes:

```typescript
// BEFORE (wrong red):
className="bg-red-700 text-white"

// AFTER (Jerne IF red):
className="bg-error text-error-content"
```

**Pattern to Apply:**
- Primary actions: `bg-error text-error-content`
- Secondary: `bg-base-100` with `border-error`
- Status badges: `badge-error`

**Files to Update:**
- `AdminTransactionsPage.tsx` (entire file audit)
- Any other pages with hardcoded red colors

**Impact:** Medium; visual consistency with design system

---

## Issue 6: Board Number Grid (16 Numbers)

### Current
Grid uses `grid-cols-4 sm:grid-cols-8` (4 cols mobile, 8 cols desktop).

### Critique
Could use better UX with:
- Consistent spacing tokens (8px base rhythm)
- Visual feedback for selected state
- Micro-animations

### Solution (Optional Enhancement)
Apply design token improvements:

```typescript
// Current (acceptable):
<div className="grid grid-cols-4 sm:grid-cols-8 gap-2">

// Enhanced (optional):
<div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-4 bg-base-100 rounded-lg border border-base-300">
  {Array.from({ length: 16 }, (_, i) => (
    <button
      key={i + 1}
      onClick={() => toggleNumber(i + 1)}
      className={`
        h-12 rounded-lg font-bold text-base transition-all duration-200
        ${selectedNumbers.includes(i + 1)
          ? 'bg-error text-error-content shadow-lg scale-100'
          : 'bg-base-200 text-base-content hover:bg-base-300 scale-95 hover:scale-100'}
      `}
    >
      {i + 1}
    </button>
  ))}
</div>
```

**Enhancement Details:**
- Selected: `bg-error text-error-content` (Jerne IF red)
- Unselected: `bg-base-200` (neutral gray)
- Hover effect: `scale-95 hover:scale-100` (micro-animation)
- Spacing: `gap-2` (16px, follows 8px base rhythm)

**Files to Update:**
- `PurchaseBoardPage.tsx`
- `CompleteGamePage.tsx`

**Impact:** Low-to-Medium; polish, not blocking

---

## Issue 7: Player Detail Page Edit Button Placement

### Problem
"Rediger detaljer" button is in secondary action position (below balance card), not prominently discoverable.

### Solution
Move edit button to top-right with clearer intent:

```typescript
// Layout change:
<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
  <div>
    {/* Player info */}
  </div>
  <div className="flex flex-col gap-3 items-stretch sm:items-end">
    {/* Balance card */}
    <div className="card bg-primary ...">...</div>

    {/* Edit button - now visible and prominent */}
    {!isEditing && (
      <button className="btn btn-outline btn-sm h-10 px-4">
        Rediger spiller
      </button>
    )}
  </div>
</div>
```

**Impact:** Medium; UX discoverability

---

## Summary of Changes

| # | File | Issue | Severity | Effort |
|---|------|-------|----------|--------|
| 1 | Multiple | Breadcrumbs non-functional | Medium | Low |
| 2 | Multiple | Body text typography inconsistent | High | Medium |
| 3 | AdminGamesPage.tsx | Next game filter wrong year | Critical | Low |
| 4 | AdminDashboard.tsx | Missing subtitle | Medium | Low |
| 5 | AdminTransactionsPage.tsx | Dark red instead of Jerne IF red | Medium | Low |
| 6 | PurchaseBoardPage.tsx, CompleteGamePage.tsx | Board grid UX enhancement | Low | Medium |
| 7 | PlayerDetailPage.tsx | Edit button placement | Medium | Low |

---

## Implementation Order (Recommended)

**Priority 1 (Must-have):**
1. Fix breadcrumb navigation (Issue #1)
2. Fix next game year filter (Issue #3)
3. Fix admin color theming (Issue #5)
4. Add dashboard subtitle (Issue #4)

**Priority 2 (Should-have):**
5. Standardize body text typography (Issue #2)
6. Improve edit button UX (Issue #7)

**Priority 3 (Nice-to-have):**
7. Enhance board grid animations (Issue #6)

---

## Design System Alignment Checklist

- ✅ Use DaisyUI semantic color classes (`bg-error`, `text-base-content/70`)
- ✅ Follow typography scale (h1/h2/h3/h4 + body + text-sm)
- ✅ Use 8px spacing rhythm (gap-2 = 16px, p-4 = 32px, etc.)
- ✅ Maintain WCAG AA contrast (5.78:1+ for red #D40000 on white)
- ✅ Add subtle animations (hover, focus, transitions)
- ✅ Use consistent border radius (DaisyUI default `rounded-lg`)
- ✅ Apply breadcrumb pattern consistently across all admin pages

---

## Testing Checklist

Before merging:
- [ ] Breadcrumbs navigate correctly (test on AdminPlayers, PlayerDetail, CreatePlayer)
- [ ] Next game displays correct year/week
- [ ] All headings use #111111 color
- [ ] All body text uses `text-base-content` or `text-base-content/70`
- [ ] No hardcoded colors (all DaisyUI semantic)
- [ ] Dashboard displays with subtitle
- [ ] Board numbers grid looks polished with proper spacing
- [ ] Edit button is discoverable on Player Detail

---

## Notes

- This plan prioritizes EXAM compliance (title + subtitle) and navigation intuitiveness
- Design token usage ensures visual consistency across future pages
- No breaking changes; all improvements are additive
- Build should remain at 0 errors after all changes

