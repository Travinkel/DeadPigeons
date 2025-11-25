# Design Tokens Math

This document summarizes how numerical design tokens are validated for consistency across components and viewports.

## QA Algorithm

The QA algorithm runs a suite of deterministic checks that link visual issues back to their originating design tokens:

- **Spacing rhythm**: iterate through spacing tokens (e.g., `spacing.xs` → `spacing.3xl`) and verify each step follows the expected ratio or delta. Flag any component whose computed margin/padding deviates from the nearest valid token by more than 8%. The report should map offending CSS variables back to their source tokens so spacing regressions are traceable.
- **Elevation consistency**: compare shadow/elevation tokens across layers (cards, modals, dropdowns) to ensure monotonic depth—each successive layer must have higher opacity/blur spread than the previous tier. Detect reversals (e.g., a dropdown casting a weaker shadow than the page background) and attribute them to the specific elevation token in use.
- **Table overflow detection**: simulate table layouts at key breakpoints using width-related tokens (grid gutters, column padding, min/max column widths). If calculated total width exceeds the viewport minus gutter tokens, mark the table as overflow-prone and surface which spacing/typography tokens contribute to the overrun. Recommend token-scale adjustments instead of ad-hoc CSS fixes.
- **Mobile clipping heuristics**: for core mobile breakpoints, project component bounding boxes using size, radius, and spacing tokens. Flag scenarios where elements overlap sticky headers/footers, clip within safe-area insets, or breach a minimum tap target derived from spacing tokens. Each alert should cite the implicated tokens so designers can tune the scale rather than patch individual components.
