# Design Tokens Math

Design-token guardrails for Jerne IF. Use this as the numeric source of truth for Tailwind/DaisyUI tokens and the rules that keep spacing, type, and elevation consistent.

## 1) Automatic Token Mapping Rules

When you see an ad-hoc value, map it to the nearest token using these heuristics to avoid reintroducing bespoke classes.

### Decision heuristic

1. Normalize units to rem (16px base), round to two decimals.
2. Pick the closest token step on the relevant scale within +/-10%; if both neighbors fit, default to the smaller token unless touch/readability would suffer.
3. Only escalate to the larger neighbor when the smaller one breaks legibility or minimum hit targets.
4. If you must keep a literal, note the exception in the PR so the scale can be updated.

### Typography mappings

| Ad-hoc size       | Token       | Value           |
| ----------------- | ----------- | --------------- |
| 13-14px body      | `text-sm`   | 0.875rem (14px) |
| 15-17px body      | `text-base` | 1rem (16px)     |
| 18-19px callouts  | `text-lg`   | 1.125rem (18px) |
| 20-22px subhead   | `text-xl`   | 1.25rem (20px)  |
| 23-26px short h2s | `text-2xl`  | 1.5rem (24px)   |
| 30-32px hero      | `text-3xl`  | 1.875rem (30px) |

### Spacing mappings

| Ad-hoc spacing        | Token       | Value           |
| --------------------- | ----------- | --------------- |
| 2-3px hairlines       | `space-0.5` | 0.125rem (2px)  |
| 4-5px tight gutters   | `space-1`   | 0.25rem (4px)   |
| 6-7px dense clusters  | `space-1.5` | 0.375rem (6px)  |
| 9-11px pills/controls | `space-2.5` | 0.625rem (10px) |
| 15-17px card padding  | `space-4`   | 1rem (16px)     |
| 19-21px breathing     | `space-5`   | 1.25rem (20px)  |
| 23-26px stacks        | `space-6`   | 1.5rem (24px)   |
| 31-33px sections      | `space-8`   | 2rem (32px)     |

### Shadow mappings

| Ad-hoc shadow                 | Token       | Value                                                              |
| ----------------------------- | ----------- | ------------------------------------------------------------------ |
| `0 1px 2px rgba(0,0,0,0.08)`  | `shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)`                                     |
| `0 2px 6px rgba(0,0,0,0.12)`  | `shadow`    | `0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)`      |
| `0 4px 12px rgba(0,0,0,0.16)` | `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)`   |
| `0 6px 18px rgba(0,0,0,0.2)`  | `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` |

## 2) Disallowed Token Combinations

- Color: no primary + warning in one component; no danger text on success/info; avoid `content-dark` on dark surfaces or `content-light` on light surfaces.
- Spacing: do not jump more than one step inside a zone (for example, `s2` to `s6`); avoid `s1` next to `s5+` without transition.
- Shadow/radius: no heavy shadows on sharp corners; no pill radii with flat shadows; do not mix inset/ambient shadows on outlined surfaces.
- Typography: forbid `t5` on tables; no display tokens on controls; no caption tokens for primary card content.

## 3) Mathematical Foundations

- **Typography scale:** base `t0 = 16px`, ratio `r = 1.25` (Major Third). `t(n) = t0 * r^n`; literals (15px, 17px, 28px) map via fractional `n = log(value/t0)/log(r)`.
- **Spacing scale:** base `s0 = 4px`, ratio `rho = sqrt(2) ~ 1.414`. `s(n) = s0 * rho^n` (rounded). Map Tailwind `p-8 = 32px` to nearest `n`.
- **Radius:** `radius(n) ~ s(n) * 0.5`. DaisyUI radii map to specific `n`; card override is a dedicated token.
- **Shadow:** blur grows with `lambda = 1.5`: `shadow(n) = {x=0, y=n, blur=8 * lambda^n, spread=0}` mapped to `shadow`/`shadow-md`/`shadow-lg`/`shadow-xl`.
- **Color:** brand base `P = #d40000`; tints/shades from 6% mixes with white/black; enforce >= 4.5:1 contrast for text >= 16px.
- **Motion:** interaction constant `tau = 150ms`; easing `cubic-bezier(0.4, 0, 0.2, 1)`; focus scale `0.95`.
- **Grid:** shell `max-w-6xl`; base padding `px-4`/`px-6` aligns to `s2`-`s4`.

## 4) Token Scales

### Typography tokens

| Token | Formula          | Px   | Tailwind           | Example use                              |
| ----- | ---------------- | ---- | ------------------ | ---------------------------------------- |
| t-1   | `16 * 1.25^-1`   | 12.8 | `text-sm`          | Auth labels                              |
| t0    | `16`             | 16   | `text-base`        | Default body                             |
| t0.1  | `16 * 1.25^0.1`  | 17.4 | `text-[17px]`      | Boards empty state lead                  |
| t-0.3 | `16 * 1.25^-0.3` | 15.0 | `text-[15px]`      | Boards empty state subcopy               |
| t1    | `16 * 1.25^1`    | 20   | `text-lg`          | Pricing stats, nav brand (sm)            |
| t2    | `16 * 1.25^2`    | 25   | `text-xl` / `25px` | Theme preview heading                    |
| t2.5  | `16 * 1.25^2.5`  | 28   | `text-[28px]`      | Player/boards page titles                |
| t3    | `16 * 1.25^3`    | 31   | `text-2xl`         | Active game value                        |
| t4    | `16 * 1.25^4`    | 39   | `text-3xl` / `h1`  | Page headlines (auth/admin/transactions) |
| t5    | `16 * 1.25^5`    | 49   | `text-4xl`         | Player balance figure                    |

### Spacing tokens

| Token | Formula (`s(n)=4*1.414^n`) | Px  | Tailwind                | Examples                    |
| ----- | -------------------------- | --- | ----------------------- | --------------------------- |
| s0    | n=0                        | 4   | `p-1`, `gap-1`          | Badges, chip gaps           |
| s1    | n=1                        | 6   | `p-1.5` ~ `p-2`         | Dropdown padding            |
| s2    | n=2                        | 8   | `p-2`, `gap-2`, `px-4`  | Auth padding, grid gaps     |
| s3    | n=3                        | 11  | `px-3`, `py-2`          | Input padding               |
| s3.5  | n=3.5                      | 13  | `p-3`, `gap-3`          | Navbar logo gap, swatch gap |
| s4    | n=4                        | 16  | `p-4`, `px-4`, `py-4`   | Page shell padding, alerts  |
| s4.5  | n=4.5                      | 19  | `p-5`                   | Horizontal button padding   |
| s5    | n=5                        | 23  | `px-6`                  | Navbar padding, CTAs        |
| s6    | n=6                        | 32  | `p-8`, `gap-8`          | Auth cards, empty states    |
| s7    | n=7                        | 45  | `p-10` ~ 40-44px        | Navbar total height target  |
| s8    | n=8                        | 64  | `h-16`, `min-h-[200px]` | Loading shells              |

### Color tokens

| Token         | Hex     | Classes                          | Notes                   |
| ------------- | ------- | -------------------------------- | ----------------------- |
| P0 (primary)  | #d40000 | `bg-primary`, `text-primary`     | Navbar, CTAs, stats     |
| P-1 (shade)   | #a80000 | `bg-secondary`                   | Hover/secondary         |
| P+1 (tint)    | tint    | `primary-focus`                  | Primary focus/hover     |
| A0 (accent)   | #000000 | `bg-accent`                      | Accent swatch           |
| N0 (neutral)  | #1f2937 | `text-neutral`, `border-neutral` | Borders, chips          |
| B1            | #ffffff | `bg-base-100`                    | Cards, inputs           |
| B2            | #f3f4f6 | `bg-base-200`                    | Page background         |
| B3            | #e5e7eb | `bg-base-300`                    | Hover fills             |
| INFO          | #1a56db | `badge-info`, `alert-info`       | Transaction/type badges |
| SUCCESS       | #15803d | `badge-success`, `text-success`  | Balance, approvals      |
| WARNING       | #d97706 | `badge-warning`, `text-warning`  | Pending states          |
| ERROR         | #d40000 | `badge-error`, `text-error`      | Errors/alerts           |
| CONTENT-LIGHT | #111827 | Default text                     | Body copy on light      |
| CONTENT-DARK  | #ffffff | On-primary text                  | Navbar/menu text        |

### Radius tokens

| Token    | Px  | Mapping                            | Notes                |
| -------- | --- | ---------------------------------- | -------------------- |
| r-box    | 8   | `rounded-box`                      | Cards, stats, menus  |
| r-btn    | 6   | `rounded-btn` / `rounded-md`       | Buttons, inputs      |
| r-badge  | 19  | `rounded-badge`                    | Status badges        |
| r-card   | 12  | `.card { border-radius: .75rem; }` | Global card override |
| r-circle | 999 | `rounded-full`                     | Number chips         |

### Shadow tokens

| Token | Blur px | Tailwind    | Examples                      |
| ----- | ------- | ----------- | ----------------------------- |
| sh-0  | 8       | `shadow`    | Stats blocks                  |
| sh-1  | 12      | `shadow-md` | Hover on auth submit          |
| sh-2  | 18      | `shadow-lg` | Navbar, CTAs                  |
| sh-3  | 27      | `shadow-xl` | Cards across dashboards/forms |

### Timing tokens

| Token         | Value | Mapping             | Notes              |
| ------------- | ----- | ------------------- | ------------------ |
| tau-btn       | 0.25s | `--animation-btn`   | Button transitions |
| tau-input     | 0.2s  | `--animation-input` | Input focus        |
| tau-fast      | 150ms | `duration-150`      | Auth form speed    |
| ease-material | curve | `(0.4,0,0.2,1)`     | Default easing     |
| scale-focus   | 0.95  | `--btn-focus-scale` | Focused buttons    |

## 5) Token Combination Matrix

### Buttons (variant x state)

| Variant   | State    | Background        | Text                        | Radius | Height / padding | Shadow         | Allowed modifiers                                            |
| --------- | -------- | ----------------- | --------------------------- | ------ | ---------------- | -------------- | ------------------------------------------------------------ |
| Primary   | Default  | `bg-primary`      | `text-primary-content`      | `r1`   | `h-11 px-5`      | `shadow-md`    | Outline 1px, `ring-2 ring-primary/30`, 100% opacity          |
| Primary   | Hover    | `bg-primary/90`   | `text-primary-content`      | `r1`   | `h-11 px-5`      | `shadow-lg`    | Outline, `ring-2 ring-primary/40`, 98% opacity               |
| Primary   | Focus    | `bg-primary`      | `text-primary-content`      | `r1`   | `h-11 px-5`      | `shadow-md`    | `outline-2 outline-primary/50`, `ring-4 ring-primary/35`     |
| Primary   | Active   | `bg-primary/85`   | `text-primary-content`      | `r1`   | `h-10 px-5`      | `shadow`       | `ring-2 ring-primary/25`, 96% opacity                        |
| Primary   | Disabled | `bg-primary/50`   | `text-primary-content/60`   | `r1`   | `h-11 px-5`      | none           | No outline/ring, 60% opacity cap                             |
| Secondary | Default  | `bg-secondary`    | `text-secondary-content`    | `r1`   | `h-11 px-5`      | `shadow`       | `outline-secondary/35`, `ring-2 ring-secondary/25`           |
| Secondary | Hover    | `bg-secondary/90` | `text-secondary-content`    | `r1`   | `h-11 px-5`      | `shadow-md`    | `ring-2 ring-secondary/30`                                   |
| Secondary | Focus    | `bg-secondary`    | `text-secondary-content`    | `r1`   | `h-11 px-5`      | `shadow`       | `outline-2 outline-secondary/40`, `ring-4 ring-secondary/30` |
| Secondary | Active   | `bg-secondary/85` | `text-secondary-content`    | `r1`   | `h-10 px-5`      | `shadow-sm`    | `ring-2 ring-secondary/20`, 96% opacity                      |
| Secondary | Disabled | `bg-secondary/45` | `text-secondary-content/60` | `r1`   | `h-11 px-5`      | none           | No outline/ring, 60% opacity cap                             |
| Ghost     | Default  | `bg-transparent`  | `text-base-content`         | `r1`   | `h-10 px-4`      | none           | `outline-base-300`, `ring-2 ring-base-300/50`                |
| Ghost     | Hover    | `bg-base-200`     | `text-base-content`         | `r1`   | `h-10 px-4`      | none           | `ring-2 ring-base-300/60`                                    |
| Ghost     | Focus    | `bg-base-200`     | `text-base-content`         | `r1`   | `h-10 px-4`      | none           | `outline-2 outline-base-300`, `ring-4 ring-primary/25`       |
| Ghost     | Active   | `bg-base-300`     | `text-base-content`         | `r1`   | `h-10 px-4`      | none           | `ring-2 ring-primary/20`, 96% opacity                        |
| Ghost     | Disabled | `bg-transparent`  | `text-base-content/50`      | `r1`   | `h-10 px-4`      | none           | No outline/ring, 50% opacity cap                             |
| Subtle    | Default  | `bg-base-100`     | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow-sm`    | `outline-base-200`, `ring-2 ring-base-200/60`                |
| Subtle    | Hover    | `bg-base-200`     | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow`       | `ring-2 ring-base-200/70`                                    |
| Subtle    | Focus    | `bg-base-200`     | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow`       | `outline-2 outline-base-300`, `ring-4 ring-primary/30`       |
| Subtle    | Active   | `bg-base-300`     | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow-inner` | `ring-2 ring-primary/20`, 96% opacity                        |
| Subtle    | Disabled | `bg-base-200`     | `text-base-content/60`      | `r1`   | `h-10 px-4`      | none           | No outline/ring, 60% opacity cap                             |

### Card matrix

| Card type      | Background    | Border/radius                    | Spacing                | Title type      | Body type       | Shadow       |
| -------------- | ------------- | -------------------------------- | ---------------------- | --------------- | --------------- | ------------ |
| Auth-card      | `bg-base-100` | `border border-base-300`, `r2`   | `p-6 md:p-8`           | `t4` (31px/700) | `t1` (16px/400) | `shadow-xl`  |
| Dashboard-card | `bg-base-100` | `border border-base-200`, `r2`   | `p-5 md:p-6`           | `t3` (25px/600) | `t1`            | `shadow-lg`  |
| Table-card     | `bg-base-100` | `border border-base-300`, `r2`   | `p-4 md:p-5` + `gap-3` | `t2` (20px/600) | `t0` (14px/400) | `shadow-md`  |
| Game-card      | `bg-base-100` | `border border-primary/30`, `r3` | `p-5 md:p-7` + `gap-4` | `t3` (25px/700) | `t1` (16px/500) | `shadow-2xl` |

### Typography hierarchy

| Usage               | Token                                            |
| ------------------- | ------------------------------------------------ |
| Hero / page title   | `t5` (`text-h1`) + `text-secondary` (dark red)   |
| Page subtitle       | `text-base text-base-content/70` (body + muted)  |
| Section header      | `t4` (`text-h2`)                                 |
| Section description | `text-sm text-base-content/70` (caption + muted) |
| Card/module title   | `t3` (`text-h3`)                                 |
| Form/data label     | `t2`                                             |
| Body copy           | `t1` (`text-base`)                               |
| Meta/captions       | `t0` (`text-sm`)                                 |

**Subtitle/Description pattern:**

- Always pair titles with optional subtitles for better hierarchy
- Page-level subtitle: `text-base text-base-content/70` (full body size, muted)
- Section-level subtitle: `text-sm text-base-content/70` (smaller, muted)
- Wrap title + subtitle in container with `space-y-2` (better breathing room)
- **Title color:** use `text-secondary` (#a80000, P-1 dark red shade) for all page/hero titles for visual coherence
  - P0 bright (#d40000) reserves for buttons, alerts, active states
  - P-1 shade (#a80000) for typography to avoid aggressive red on large text sizes

### Spacing rhythm matrix

| Breakpoint  | Vertical rhythm                                      | Horizontal rhythm                           |
| ----------- | ---------------------------------------------------- | ------------------------------------------- |
| 360px       | `s1=8`, `s2=12`, `s3=16`, `s4=24`                    | `s1=8`, `s2=12`, `s3=16`, `s4=24`           |
| 414px       | `s1=8`, `s2=14`, `s3=18`, `s4=26`, `s5=32`           | `s1=10`, `s2=14`, `s3=18`, `s4=26`, `s5=32` |
| sm (640px)  | `s1=8`, `s2=16`, `s3=24`, `s4=32`, `s5=40`, `s6=48`  | `s1=12`, `s2=16`, `s3=24`, `s4=32`, `s5=40` |
| md (768px)  | `s1=8`, `s2=16`, `s3=24`, `s4=32`, `s6=48`, `s8=64`  | `s1=12`, `s2=16`, `s3=24`, `s4=32`, `s6=48` |
| lg (1024px) | `s1=10`, `s2=18`, `s3=26`, `s4=34`, `s6=50`, `s8=72` | `s1=14`, `s2=20`, `s3=28`, `s4=36`, `s6=52` |
| xl (1280px) | `s1=12`, `s2=20`, `s3=28`, `s4=36`, `s6=56`, `s8=80` | `s1=16`, `s2=24`, `s3=32`, `s4=40`, `s6=60` |

### Responsive rules

- 360px: card padding `p-4`, buttons `h-10 px-4`, prefer `t2` titles to avoid wrapping.
- 414px: allow `p-5` cards, keep `h-10 px-4`, use `gap-3` vertical rhythm.
- sm: restore `p-5`-`p-6`, allow `h-11` primary buttons, promote headers to `t4`.
- md: `p-6`-`p-7` game cards, table rows `py-3`, focus rings up to `ring-4`.
- lg: gutters `s5` (40px), allow `t5` hero, lift elevations one step.
- xl: max radius `r3`, gutters `s6` (48px), widen buttons to `px-6` when space allows.

## 6) Interaction Rules and Primitives

- Hit areas: min `44x44px` (`s6`) for touch; default `h-10/h-11` meets this.
- Contrast: P0 on dark text or inverse; keep text >= `t-1` at 4.5:1 contrast.
- Focus/hover: use `scale-focus` and `tau-btn`; hover via `P-1` or `B2/B3`.
- Spacing rhythm: vertical stacks `{s4,s5,s6}`; horizontal `{s2,s3}`; tables `s2` cell padding.

Primitives

- Buttons: height ~40-44px (`h-10/h-11`), `px=s5`, `r-btn`, default `sh-1`, primary hover `sh-2`, colors per palette.
- Inputs: `px=s3`, `py=s2`, `border B3`, `r-btn`, focus ring `P+1`, height `h-12` (~48px).
- Cards: `B1`, `r-card`, `p=s6`, `sh-3`, titles `t2-t3`, body `t0`.
- Badges: `r-badge`, `s1` horizontal, `t-1`, semantic colors.
- Alerts: `p=s4`, icon size `s5`, semantic colors with correct contrast.
- Tables: `s2` cell padding, header `t0`, body `t-1/t0`, hover `B3`.
- Stats tiles: `B1`, `r-box`, `p=s4`, `sh-0`, title `t-1`, value `t1-t2`.

## 7) Composite Specs

- Navbar: height ~`s7` (60-64px) via `py-3/py-4`, `bg-primary`, text `CONTENT-DARK`, `sh-2`, `px=s5`, brand `t1-t2`, mobile dropdown `r-box`, `p=s2`.
- Dropdown: `B1`, `r-box`, `p=s2`, `sh-2`, menu `t0` with `s1` gaps.
- Auth card: `B2` wrapper; card `B1`, `r-card`, `sh-3`, `p=s6`; logo chip `r-circle`; heading `t4`, subhead `t-1`; submit uses button spec and `tau-fast`.
- Dashboard shells: page padding `{s4,s5}`, grid gaps `s2-s4`, hero balance card primary (`P0`, `CONTENT-DARK`, `sh-3`), tables/stats per primitives.
- Boards flow: page titles `t2.5`, CTA `h=44 px=s5 sh-2`, number grid `r-circle s2` gaps, background `B2/B3`, price tiles reuse stats spec.
- Games: active game card primary palette, `sh-3`, stats row `B3`; completed games table per table spec.
- Transactions: summary stats (`r-box sh-0`), warning/error alerts, tables per standard, buttons `btn-primary`/`btn-outline`.
- Mobile layouts: single column, `s4` vertical rhythm, full-width buttons, tables scroll in `overflow-x-auto`.
- Desktop grids: `grid-cols-3/4`, gutters `s2-s4`, cap width at `max-w-6xl`.

## 8) QA Algorithm

Deterministic checks that link visual issues back to tokens:

- Spacing rhythm: verify each spacing step follows the expected ratio; flag components deviating >8% from nearest token and report the offending token.
- Elevation consistency: ensure depth is monotonic across layers; flag reversals (for example, dropdown weaker than page) with the shadow token causing it.
- Table overflow: simulate tables at key breakpoints; if total width exceeds viewport minus gutter tokens, mark overflow-prone and list the spacing/typography tokens involved.
- Mobile clipping: project component boxes at mobile breakpoints; flag overlaps with sticky headers/footers or sub-44px tap targets, citing implicated tokens.

## 9) Enforcement Rules

- Allowed token sources: CSS vars prefixed with `--color-`, `--space-`, `--radius-`, `--font-size-`, `--z-`; Tailwind theme keys (including extended `h1-h4`); semantic tokens (`text-primary`, `bg-surface`, etc.). Arbitrary values must reference a token var (`var(--space-3)`), not a literal.
- ESLint/Tailwind: enable `eslint-plugin-tailwindcss` with whitelists/class regex targeting tokens; block arbitrary values unless they are token vars; Tailwind `blocklist` like `/\[(?!var\(--).*\]/` prevents literal pixels/hex values.
- Regex guards:
  - Arbitrary non-token: `/\[(?!var\(--(?:color|space|radius|font-size|z)-)[^\]]+\]/`
  - Literal sizing: `/\b(?:p|px|py|m|mx|my|gap|w|h|min-w|min-h|max-w|max-h|text|leading|tracking|rounded)-\[(?:\d+(?:px)?|\d*\.\d+rem)\]/`
  - Hex/rgb colors: `/\b(?:bg|text|border|outline|shadow)-\[(?!var\(--color-)[^\]]*(?:#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})|rgb[a]?\()[^\]]*\]/`
  - Unrecognized semantic tokens: `/\b(?:bg|text|border|shadow)-(?!(?:primary|secondary|muted|surface|inverse|success|warning|danger)\b)[a-z0-9-]+/`

## 10) Usage Index (examples)

- `client/src/shared/components/Layout.tsx`: navbar spacing (`px-4/px-6`, `h-6` icons), text sizes (`text-lg/text-xl`), `shadow-lg`, `bg-primary`, `bg-base-200`.
- `client/src/features/auth/LoginPage.tsx`, `RegisterPage.tsx`: auth card `p-8`, `text-sm` labels, `text-3xl` headings, gradients using P0/P-1, `shadow-sm/md`.
- `client/src/features/dashboard/PlayerDashboard.tsx`, `AdminDashboard.tsx`: titles (`text-[28px]`, `text-3xl`), stats tiles (`rounded-box shadow`), tables, balance card (`text-4xl`).
- `client/src/features/boards/*.tsx`: CTA `h-11 px-6`, number chips `w-10 h-10 rounded-full`, `gap-2`, badges, alerts/tiles.
- `client/src/features/games/GamesPage.tsx`: primary cards, stats overlays, badges in tables.
- `client/src/features/transactions/*.tsx`: summary stats, warning alerts, tables with semantic badges, `btn-primary`.
- `client/src/features/dashboard/ThemePreviewPage.tsx`: color swatches, badge variants, header `py-4 px-6`.
- `client/src/index.css`: theme variables (colors, radii, timing), card radius override.
- `client/tailwind.config.js`: extended headings `h1-h4`.

## 11) Future-proofing

- Refactor literals (`text-[17px]`, `text-[15px]`, `text-[28px]`, `h-10/h-11/w-10`) into explicit helpers for `t(n)`/`s(n)`.
- Provide helper functions to compute `t(n)`/`s(n)` to avoid ad-hoc Tailwind classes.
- Expand color ladder to include opacity variants (`alpha(P0,0.1)`) for focus rings/overlays with contrast >= 3:1 for non-text.
- Document shadow blur/spread per `shadow(n)` in shared constants.
- Enforce "tokens only" via ESLint/Tailwind rules.

## 12) Implementation Constraints

- No raw arbitrary Tailwind values (`text-[...]`, `px-[...]`, `bg-[#...]`) unless they reference approved token vars.
- Avoid ad-hoc shadows/radii outside the mapped tokens.
- Use only the defined tokens for type, spacing, color, radius, shadow, timing.
- New components must map sizes to `t(n)`/`s(n)`, colors to palette tokens, radii/shadows to the defined levels.
