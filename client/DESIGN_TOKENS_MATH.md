# Design Tokens Math

This document captures the constraints we want on design-token usage so that spacing, sizing, and color math stay predictable across the app.

## Enforcement Rules

### Allowed token sources

- **CSS custom properties** prefixed with `--color-`, `--space-`, `--radius-`, `--font-size-`, and `--z-`. These should be the only values fed into inline `style` props or Tailwind arbitrary values.
- **Tailwind theme keys** defined in `tailwind.config.js`, including the extended `fontSize` scale (`h1`, `h2`, `h3`, `h4`) and the default spacing, color, and radius scales that ship with Tailwind. Arbitrary values (e.g., `p-[13px]`) are not allowed unless they reference a token variable (e.g., `p-[var(--space-3)]`).
- **Semantic tokens** exposed through our design system (e.g., `text-primary`, `bg-surface`, `border-muted`). If a new semantic token is needed, add it to the Tailwind config rather than using a raw value.

### ESLint and Tailwind plugin guidance

- Enable `eslint-plugin-tailwindcss` with `whitelist`/`classRegex` configured to our token patterns so that any class containing pixel, rem, or hex literals is flagged. The rule set should reject arbitrary classes unless the value starts with `var(--` and matches one of the allowed token prefixes.
- Pair the ESLint rule with Tailwind's built-in [arbitrary value](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values) validation by setting `blocklist` entries in `tailwind.config.js` (e.g., `/\[(?!var\(--).*\]/`) to prevent accidental literal values from compiling.
- In code review, prefer utility classes that map to theme tokens (e.g., `text-h3`, `p-4`, `bg-slate-900`) and ask for configuration updates if a token is missing instead of merging an arbitrary class.

### Regex/pattern checks for non-token values

- **Arbitrary values without tokens:** `/\[(?!var\(--(?:color|space|radius|font-size|z)-)[^\]]+\]/` catches any arbitrary Tailwind value that does not reference an approved token variable.
- **Literal pixel or rem values in class strings:** `/\b(?:p|px|py|m|mx|my|gap|w|h|min-w|min-h|max-w|max-h|text|leading|tracking|rounded)-\[(?:\d+(?:px)?|\d*\.\d+rem)\]/` flags hard-coded numeric sizing.
- **Hex/rgb color literals:** `/\b(?:bg|text|border|outline|shadow)-\[(?!var\(--color-)[^\]]*(?:#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})|rgb[a]?\()[^\]]*\]/` ensures colors come from tokens.
- **Unrecognized semantic tokens:** `/\b(?:bg|text|border|shadow)-(?!(?:primary|secondary|muted|surface|inverse|success|warning|danger)\b)[a-z0-9-]+/` helps spot made-up semantic names so they can be added to the theme first.

When lint or Tailwind blocks a class string, replace the literal with the nearest semantic token or add a new token to the theme before merging.
