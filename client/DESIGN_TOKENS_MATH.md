# Design Tokens Math

This document captures coupling rules that keep the design token system cohesive. When combining tokens, ensure choices reinforce hierarchy, legibility, and rhythm.

## Disallowed Token Combinations

### Color pairings

- Do not pair primary surfaces or accents with warning tokens in the same component; reserve warning pairings for destructive or cautionary contexts only.
- Avoid mixing danger text or icons on success or information surfaces, which blurs semantic meaning.
- `content-dark` tokens must not be used on `surface-dark` or other low-contrast backgrounds; use light or high-contrast content tokens instead.
- `content-light` tokens must not be used on `surface-light` backgrounds; favor dark or neutral content tokens to maintain readability.

### Spacing rhythm

- Avoid jumps of more than one step in the spacing scale inside a single layout zone (e.g., skipping from `spacing-2` to `spacing-6`); maintain a consistent progression to keep rhythm.
- Do not mix tiny gutters (e.g., `spacing-1`) directly against large paddings (e.g., `spacing-5` or above) within the same cluster—use transitional steps to avoid visual tension.

### Shadow and radius alignment

- Heavy or soft shadows (e.g., `shadow-lg`, `shadow-xl`) are not allowed with sharp corners (`radius-0` or `radius-xs`); pair them with at least `radius-sm` or above.
- Pill or large radii (`radius-lg` and higher) should not use the flattest shadows (`shadow-0` or `shadow-sm`); they require matching depth to avoid floating pills that look glued down.
- Outlined surfaces without elevation should not mix inset or ambient shadows, which muddle the intended flat appearance.

### Typography caps

- `t5` is not allowed on tables; table cells are capped at body-level text tokens (e.g., `t6`/`t7`) to preserve density and scanability.
- Display tokens (`t1`–`t3`) are not permitted on buttons, chips, or inputs; those controls must use label or body tokens sized for controls.
- Caption tokens (`t8` and smaller) are not allowed for primary content blocks such as cards or dialogs; they are reserved for meta labels only.
