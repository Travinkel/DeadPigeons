# Design Tokens Math

This reference outlines how we map free-form measurements and effects to our design tokens so that spacing, type, and elevation stay consistent across the app.

## Automatic Token Mapping Rules

When you encounter an ad-hoc value, round it to the closest design token using the heuristics and lookup tables below. The goal is to land on the smallest perceptible change that still aligns with the system, rather than reintroducing bespoke values.

### Decision heuristic

1. **Normalize units:** Convert pixel values to `rem` using a 16px base and remove trailing precision beyond two decimals.
2. **Find the nearest token:** Use the absolute distance to the closest token step on the relevant scale (typography, spacing, or shadow intensity). Favor the option within ±10% of the original request; if both neighbors fit, pick the smaller token for tighter, more readable layouts.
3. **Escalate intentionally:** Only move up to the larger neighbor when the smaller option would break readability (e.g., headlines) or touch targets (e.g., spacing under 8px).
4. **Document exceptions:** If a value cannot be mapped without visual regression, log the deviation in the PR to keep the token scales honest.

### Typography mappings

| Ad-hoc size             | Nearest token | Token value     |
| ----------------------- | ------------- | --------------- |
| 13–14px body copy       | `text-sm`     | 0.875rem (14px) |
| 15–17px body copy       | `text-base`   | 1rem (16px)     |
| 18–19px callouts        | `text-lg`     | 1.125rem (18px) |
| 20–22px subhead         | `text-xl`     | 1.25rem (20px)  |
| 23–26px short headlines | `text-2xl`    | 1.5rem (24px)   |
| 30–32px hero kicker     | `text-3xl`    | 1.875rem (30px) |

Use the custom heading tokens from `tailwind.config.js` (`h1`–`h4`) when matching title styles; otherwise, default Tailwind font sizes cover most cases.

### Spacing mappings

| Ad-hoc spacing             | Nearest token | Token value     |
| -------------------------- | ------------- | --------------- |
| 2–3px hairlines            | `space-0.5`   | 0.125rem (2px)  |
| 4–5px tight gutters        | `space-1`     | 0.25rem (4px)   |
| 6–7px dense clusters       | `space-1.5`   | 0.375rem (6px)  |
| 9–11px pills/controls      | `space-2.5`   | 0.625rem (10px) |
| 15–17px card padding       | `space-4`     | 1rem (16px)     |
| 19–21px breathing room     | `space-5`     | 1.25rem (20px)  |
| 23–26px comfortable stacks | `space-6`     | 1.5rem (24px)   |
| 31–33px section padding    | `space-8`     | 2rem (32px)     |

Values already on the 4px grid should rarely need adjustment; favor rounding up only when touch targets would fall below 44px combined height.

### Shadow mappings

| Ad-hoc shadow                 | Nearest token | Token value                                                        |
| ----------------------------- | ------------- | ------------------------------------------------------------------ |
| `0 1px 2px rgba(0,0,0,0.08)`  | `shadow-sm`   | `0 1px 2px 0 rgba(0,0,0,0.05)`                                     |
| `0 2px 6px rgba(0,0,0,0.12)`  | `shadow`      | `0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)`      |
| `0 4px 12px rgba(0,0,0,0.16)` | `shadow-md`   | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)`   |
| `0 6px 18px rgba(0,0,0,0.2)`  | `shadow-lg`   | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` |

When matching bespoke shadows, prioritize opacity and blur radius over spread to preserve perceived depth; prefer reducing opacity before shrinking blur if a token appears too heavy.
