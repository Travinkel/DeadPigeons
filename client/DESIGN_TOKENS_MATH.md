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

# DESIGN_TOKENS_MATH.md

## 1. Mathematical Foundations

- **Typography modular scale:** Base size `t0 = 16px` chosen to satisfy WCAG 2.2 minimum readable body size and avoid iOS zoom; ratio `r = 1.25` (major third) to align with existing extended heading sizes. Formula: `t(n) = t0 × r^n`. Custom literals (`17px`, `15px`, `28px`) map to fractional `n` solving `n = log(value/t0)/log(r)`.
- **Spacing system:** Observed spacing steps follow 4px and 8px grids. Normalize to `s0 = 4px`, perceptual ratio `ρ = √2 ≈ 1.414` to keep growth gentle (Stevens’ law) while hitting used values: `s(n) = s0 × ρ^n` (rounded to nearest whole pixel). Linear multiples (e.g., `p-8 = 32px`) map to integer `n` that best fits the grid.
- **Radius rule:** Radii derive from padding per material curvature guidance: `radius(n) = s(n) × 0.5`. DaisyUI base radii (`--rounded-box`, `--rounded-btn`, `--rounded-badge`) map to specific `n` values; the global card override `0.75rem` is treated as a dedicated token.
- **Shadow elevation:** Elevation blur grows geometrically with ratio `λ = 1.5`: `shadow(n) = {x=0, y=n, blur=8×λ^n, spread=0}`; map Tailwind `shadow|shadow-md|shadow-lg|shadow-xl` to consecutive `n`.
- **Color harmonics:** Brand base crimson `P = #d40000`. Generate 12-step luminance ladder via `C(k) = mix(P, white, k·0.06)` for tints and `C(-k) = mix(P, black, k·0.06)` for shades, enforcing ≥4.5:1 contrast for text ≥16px (WCAG). Neutral anchor `N = #1f2937`; bases `B1/B2/B3` from DaisyUI theme. Semantic hues pulled directly from theme slots.
- **Motion:** Interaction time constant `τ = 150ms` within the 100–200ms ergonomic band; easing `cubic-bezier(0.4, 0, 0.2, 1)`; button focus scale `0.95` (from theme variable) aligns with Fitts’ target confirmation.
- **Grid:** Content shell width `max-w-6xl`; horizontal padding uses `s(2) ≈ 6px` at sm and `s(3) ≈ 8px` base, scaling to `s(4) ≈ 11px` equivalent of `px-6` (24px) through integral multiples of `s0`.

## 2. Typography Tokens

| Token   | Formula                | Computed px | Tailwind Class            | Where Used                                                                                                                                                                 |
| ------- | ---------------------- | ----------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `t-1`   | `t(-1)=16×1.25^-1`     | 12.8        | `text-sm`                 | Body helpers in auth cards, labels. 【F:client/src/features/auth/LoginPage.tsx†L71-L78】【F:client/src/features/auth/RegisterPage.tsx†L59-L66】                            |
| `t0`    | `t(0)=16`              | 16          | `text-base`               | Default text across cards and tables.                                                                                                                                      |
| `t0.1`  | `t(0.1)=16×1.25^0.1`   | 17.4        | `text-[17px]`             | Boards empty state lead, purchase CTA text. 【F:client/src/features/boards/BoardsPage.tsx†L66-L74】                                                                        |
| `t-0.3` | `t(-0.3)=16×1.25^-0.3` | 15.0        | `text-[15px]`             | Boards empty state subcopy. 【F:client/src/features/boards/BoardsPage.tsx†L76-L81】                                                                                        |
| `t1`    | `t(1)=20`              | 20          | `text-lg`                 | Pricing stats, nav brand at sm, active game info. 【F:client/src/features/boards/PurchaseBoardPage.tsx†L185-L193】【F:client/src/shared/components/Layout.tsx†L80-L83】    |
| `t2`    | `t(2)=25`              | 25          | `text-xl` / `text-[25px]` | Theme preview heading, active game value. 【F:client/src/features/dashboard/ThemePreviewPage.tsx†L46-L55】                                                                 |
| `t2.5`  | `t(2.5)=28.0`          | 28          | `text-[28px]`             | Player & boards page titles. 【F:client/src/features/dashboard/PlayerDashboard.tsx†L82-L90】【F:client/src/features/boards/BoardsPage.tsx†L66-L74】                        |
| `t3`    | `t(3)=31`              | 31          | `text-2xl`                | Active game card value. 【F:client/src/features/games/GamesPage.tsx†L38-L45】                                                                                              |
| `t4`    | `t(4)=39`              | 39          | `text-3xl` / `text-h1`    | Page headlines on admin/transactions/register/login. 【F:client/src/features/auth/RegisterPage.tsx†L43-L50】【F:client/src/features/dashboard/AdminDashboard.tsx†L61-L67】 |
| `t5`    | `t(5)=49`              | 49          | `text-4xl`                | Player balance figure. 【F:client/src/features/dashboard/PlayerDashboard.tsx†L86-L90】                                                                                     |

## 3. Spacing Tokens

| Token  | Formula (`s(n)=4×1.414^n`) | Computed px (rounded) | Tailwind Mapping                                | Where Used                                                                                                                                                   |
| ------ | -------------------------- | --------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `s0`   | n=0                        | 4                     | `p-1`, `gap-1`                                  | Badge chips, small gaps in number lists. 【F:client/src/features/dashboard/PlayerDashboard.tsx†L130-L138】                                                   |
| `s1`   | n=1                        | 6                     | `p-1.5`≈`p-2`                                   | Dropdown padding, small button radius base.                                                                                                                  |
| `s2`   | n=2                        | 8                     | `p-2`, `gap-2`, `px-4`                          | Auth form padding multiples, grid gaps. 【F:client/src/features/auth/LoginPage.tsx†L71-L78】【F:client/src/features/boards/PurchaseBoardPage.tsx†L260-L269】 |
| `s3`   | n=3                        | 11                    | `px-3`, `py-2`                                  | Input padding on auth forms. 【F:client/src/features/auth/LoginPage.tsx†L109-L139】                                                                          |
| `s3.5` | n=3.5                      | 13                    | `p-3`, `gap-3`                                  | Navbar logo gap, colour swatches gap. 【F:client/src/shared/components/Layout.tsx†L80-L83】【F:client/src/features/dashboard/ThemePreviewPage.tsx†L73-L82】  |
| `s4`   | n=4                        | 16                    | `p-4`, `px-4`, `py-4`                           | Page shell padding, alerts. 【F:client/src/shared/components/Layout.tsx†L101-L102】【F:client/src/features/auth/LoginPage.tsx†L71-L74】                      |
| `s4.5` | n=4.5                      | 19                    | `p-5`≈`20px`                                    | Button horizontal padding (`px-6` ≈ 24 aligns to `s5`).                                                                                                      |
| `s5`   | n=5                        | 23                    | `px-6` (24)                                     | Navbar sm padding, call-to-action buttons. 【F:client/src/shared/components/Layout.tsx†L47-L99】【F:client/src/features/boards/BoardsPage.tsx†L66-L74】      |
| `s6`   | n=6                        | 32                    | `p-8`, `gap-8`                                  | Auth card body padding, empty-state blocks. 【F:client/src/features/auth/LoginPage.tsx†L72-L83】【F:client/src/features/boards/BoardsPage.tsx†L76-L83】      |
| `s7`   | n=7                        | 45                    | `p-10`≈`40-44`                                  | Implicit navbar height (60–64px) built from vertical padding multiples.                                                                                      |
| `s8`   | n=8                        | 64                    | `h-16` / `min-h-[200px]` proportional to `s8×3` | Loading shells, hero heights. 【F:client/src/features/dashboard/PlayerDashboard.tsx†L52-L57】                                                                |

## 4. Color Tokens

| Token           | Formula           | Hex            | Tailwind/DaisyUI Class               | Where Used                                                                                                                             |
| --------------- | ----------------- | -------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `P0` (primary)  | base              | #d40000        | `bg-primary`, `text-primary`         | Navbar, CTA buttons, stats. 【F:client/src/shared/components/Layout.tsx†L46-L83】【F:client/src/features/games/GamesPage.tsx†L18-L66】 |
| `P-1` (shade)   | `darken(P,0.06)`  | mix with black | Hover state `bg-secondary` (#a80000) | CTA hover, badge secondary. 【F:client/src/index.css†L13-L38】                                                                         |
| `P+1` (tint)    | `lighten(P,0.06)` | tint           | `primary-focus`                      | Stats blocks on primary cards. 【F:client/src/features/games/GamesPage.tsx†L60-L72】                                                   |
| `A0` (accent)   | base              | #000000        | `bg-accent`                          | Theme preview swatch. 【F:client/src/features/dashboard/ThemePreviewPage.tsx†L73-L82】                                                 |
| `N0` (neutral)  | base              | #1f2937        | `text-neutral`, `border-neutral`     | Colour chip borders. 【F:client/src/features/dashboard/ThemePreviewPage.tsx†L73-L82】                                                  |
| `B1`            | base surface      | #ffffff        | `bg-base-100`                        | Cards, inputs. 【F:client/src/features/auth/LoginPage.tsx†L71-L74】                                                                    |
| `B2`            | tint              | #f3f4f6        | `bg-base-200`                        | Page background. 【F:client/src/shared/components/Layout.tsx†L46-L47】                                                                 |
| `B3`            | tint              | #e5e7eb        | `bg-base-300`                        | Hover fills in number grid. 【F:client/src/features/boards/PurchaseBoardPage.tsx†L330-L343】                                           |
| `INFO`          | theme             | #1a56db        | `badge-info`, `alert-info`           | Transaction/type badges. 【F:client/src/features/transactions/TransactionsPage.tsx†L90-L111】                                          |
| `SUCCESS`       | theme             | #15803d        | `badge-success`, `text-success`      | Balance, approval states. 【F:client/src/features/dashboard/PlayerDashboard.tsx†L176-L186】                                            |
| `WARNING`       | theme             | #d97706        | `badge-warning`, `text-warning`      | Pending deposits alerts. 【F:client/src/features/transactions/TransactionsPage.tsx†L64-L87】                                           |
| `ERROR`         | theme             | #d40000        | `badge-error`, `text-error`          | Validation errors and alerts. 【F:client/src/features/auth/LoginPage.tsx†L85-L102】                                                    |
| `CONTENT-LIGHT` | `base-content`    | #111827        | Default text                         | Body copy on light surfaces. 【F:client/src/index.css†L21-L24】                                                                        |
| `CONTENT-DARK`  | `primary-content` | #ffffff        | On-primary text                      | Navbar/menu text. 【F:client/src/index.css†L13-L18】【F:client/src/shared/components/Layout.tsx†L46-L83】                              |

## 5. Radius Tokens

| Token      | Formula             | Px          | Tailwind/DaisyUI Mapping            | Where Used                                                                                                                  |
| ---------- | ------------------- | ----------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `r-box`    | `radius(s4)=16×0.5` | 8           | `rounded-box`                       | Cards, stats, dropdowns. 【F:client/src/index.css†L47-L49】【F:client/src/features/dashboard/PlayerDashboard.tsx†L94-L107】 |
| `r-btn`    | `radius(s3)=11×0.5` | 6           | `rounded-btn` / `rounded-md`        | Buttons, form inputs. 【F:client/src/index.css†L47-L52】【F:client/src/features/auth/LoginPage.tsx†L109-L139】              |
| `r-badge`  | `radius(s6)=32×0.6` | 19 (1.9rem) | `rounded-badge`                     | Status badges. 【F:client/src/index.css†L47-L49】                                                                           |
| `r-card`   | explicit            | 12          | `.card { border-radius: 0.75rem; }` | All `.card` components. 【F:client/src/index.css†L69-L72】                                                                  |
| `r-circle` | ∞                   | 999         | `rounded-full`                      | Number chips `w-10 h-10`. 【F:client/src/features/boards/BoardsPage.tsx†L105-L115】                                         |

## 6. Shadow Tokens

| Token  | Formula (`shadow(n)= {0,n, 8×1.5^n, 0}`) | Approx Blur px | Tailwind Class | Where Used                                                                                          |
| ------ | ---------------------------------------- | -------------- | -------------- | --------------------------------------------------------------------------------------------------- |
| `sh-0` | n=0                                      | 8              | `shadow`       | Stats blocks. 【F:client/src/features/dashboard/AdminDashboard.tsx†L68-L76】                        |
| `sh-1` | n=1                                      | 12             | `shadow-md`    | Hover accent on auth submit buttons. 【F:client/src/features/auth/LoginPage.tsx†L159-L165】         |
| `sh-2` | n=2                                      | 18             | `shadow-lg`    | Navbar, CTA buttons. 【F:client/src/shared/components/Layout.tsx†L46-L83】                          |
| `sh-3` | n=3                                      | 27             | `shadow-xl`    | Cards across dashboards/forms. 【F:client/src/features/transactions/TransactionsPage.tsx†L78-L111】 |

## 7. Timing Tokens

| Token           | Formula        | Value           | Mapping                           | Where Used                                                                    |
| --------------- | -------------- | --------------- | --------------------------------- | ----------------------------------------------------------------------------- |
| `τ-btn`         | constant       | 0.25s           | `--animation-btn`                 | Button transitions. 【F:client/src/index.css†L47-L52】                        |
| `τ-input`       | constant       | 0.2s            | `--animation-input`               | Input focus transitions. 【F:client/src/index.css†L47-L52】                   |
| `τ-fast`        | ergonomics     | 150ms           | `duration-150`                    | Auth form transitions. 【F:client/src/features/auth/LoginPage.tsx†L109-L144】 |
| `ease-material` | cubic-bezier   | `(0.4,0,0.2,1)` | `transition-all` + default easing | Buttons, cards.                                                               |
| `scale-focus`   | multiplicative | 0.95            | `--btn-focus-scale`               | Focused buttons. 【F:client/src/index.css†L50-L52】                           |

## 8. Interaction Rules

- **Hit areas:** Minimum `44×44px` (`s6`) for tappable controls per Fitts’ Law; `btn` sizes (`h-10/h-11`) meet this for touch.
- **Contrast:** Use `P0` on `CONTENT-DARK` or inverse; ensure text ≥ `t-1` with 4.5:1 contrast (crimson on white passes for ≥14px bold). Inputs keep `B1` background with `N0` text for clarity.
- **Focus/hover:** Apply `scale-focus` and `τ-btn` easing; hover darkens via `P-1` or lightens via `B2/B3` only.
- **Spacing rhythm:** Vertical stacks use `{s4, s5, s6}` increments; horizontal gutters use `{s2, s3}`. Lists/tables apply `s2` cell padding.

## 9. Primitive Component Specs

- **Buttons:** Height `h = s6 (≈32) + vertical padding to reach 40–44px`; horizontal padding `px = s5 (≈24)`. Radius `r-btn`; shadow `sh-1` default, `sh-2` on primary CTAs. Primary colors `P0/CONTENT-DARK`, secondary `P-1`, ghost uses transparent with `P0` text. Ensure min hit area `s6×s6`.
- **Inputs:** Padding `px = s3`, `py = s2`; border `1px` in `B3`; radius `r-btn`; focus ring tint `P+1` using `τ-input`. Height `h-12` (48px ≈ `s6 + s2`).
- **Cards:** Background `B1`; radius `r-card`; padding `s6`; shadow `sh-3`. Titles at `t2–t3`, body `t0`.
- **Badges:** Radius `r-badge`; padding `s1` horizontal; font `t-1`; color maps to semantic tokens.
- **Alerts:** Padding `s4`; icon size `s5`; color aligns to semantic tokens with `CONTENT-DARK` or `CONTENT-LIGHT` contrast per hue.
- **Tables:** Cell padding `s2`; header text `t0`; body `t-1` or `t0`; row hover uses `B3`.
- **Stats tiles:** Surface `B1`; radius `r-box`; padding `s4`; shadow `sh-0`; title `t-1`, value `t1–t2` with semantic colors.

## 10. Composite Component Specs

- **Navbar:** Height ≈ `s7` (60–64px) via `py-3` + `py-4` mix; background `P0`; text `CONTENT-DARK`; shadow `sh-2`; horizontal padding `s5` responsive; brand text `t1–t2` bold; mobile dropdown uses `r-box`, `s2` padding.
- **Dropdown:** Surface `B1`; radius `r-box`; padding `s2`; shadow `sh-2`; menu items `t0` with `s1` gaps.
- **Auth Card:** Wrapper `B2` background with center alignment; card uses `B1`, `r-card`, `sh-3`, padding `s6`. Logo chip `r-circle` with `s2` padding; headings `t4`, subhead `t-1`; form controls per input spec; submit button primary per button spec and `τ-fast` motion.
- **Dashboard Shells:** Page padding `{s4, s5}`; grid gaps `s2–s4`; hero balance card uses primary scheme (`P0`, `CONTENT-DARK`, `sh-3`); tables and stats follow primitives.
- **Boards Flow:** Page titles `t2.5`; CTA button `h=44`, `px=s5`, `sh-2`; number grid uses `r-circle`, `s2` gaps, background `B2/B3` with primary selected; price tiles reuse stats spec with primary highlight state.
- **Games:** Active game card uses primary palette, `sh-3`, stats row `B3` overlay; completed games table per table spec with badge semantic tokens.
- **Transactions:** Summary stats tiles (`r-box`, `sh-0`); alerts use warning/error tokens; tables mirror standard tokens; action buttons `btn-primary`/`btn-outline` tokens.
- **Mobile Layouts:** Stacks default to single column; grids collapse to 1 col with `s4` vertical rhythm; buttons full-width with min hit area; tables scroll within `overflow-x-auto` containers preserving padding tokens.
- **Desktop Grids:** Use `grid-cols-3/4` for dashboards; gutters `s2–s4`; keep card widths within `max-w-6xl` shell.

## 11. Usage Index by Source File

- `client/src/shared/components/Layout.tsx`: Navbar spacing (`px-4`, `px-6`, `h-6` icons), text sizes (`text-lg/text-xl`), shadows (`shadow-lg`), background tokens (`bg-primary`, `bg-base-200`).
- `client/src/features/auth/LoginPage.tsx` & `RegisterPage.tsx`: Auth card paddings (`p-8`), custom text sizes (`text-sm`, `text-3xl`), gradients (`from-red-600 to-red-700` → `P0/P-1`), shadows (`shadow-sm`, `shadow-md`).
- `client/src/features/dashboard/PlayerDashboard.tsx` & `AdminDashboard.tsx`: Titles (`text-[28px]`, `text-3xl`), stats tiles (`rounded-box shadow`), tables (`table`, `badge-*`), balance card (`text-4xl`).
- `client/src/features/boards/*.tsx`: CTA button sizing (`h-11 px-6`), number chips (`w-10 h-10 rounded-full`), grid gaps (`gap-2`), badges, alert/tile usage.
- `client/src/features/games/GamesPage.tsx`: Primary cards, stats overlays, badges in tables.
- `client/src/features/transactions/*.tsx`: Summary stats, warning alerts, tables with semantic badges, buttons (`btn-primary`).
- `client/src/features/dashboard/ThemePreviewPage.tsx`: Color swatches, badge variants, header padding (`py-4 px-6`).
- `client/src/index.css`: DaisyUI theme variables (colors, radii, timing), card radius override.
- `client/tailwind.config.js`: Extended heading sizes `h1–h4` confirming modular scale anchors.

## 12. Future-proofing Notes

- Refactor literals (`text-[17px]`, `text-[15px]`, `text-[28px]`, `h-10/h-11/w-10`) into explicit `t(n)` or `s(n)` utility aliases to avoid drift.
- Expose helper functions in a design token module to compute `t(n)` and `s(n)` so future components can bind to math rather than ad-hoc Tailwind classes.
- Expand color ladder functions to include opacity (`alpha(P0,0.1)`) for focus rings and overlays while keeping contrast ≥3:1 for non-text fills.
- Document elevation with exact blur/spread per `shadow(n)` in a shared constants file to match design across frameworks.
- Enforce “tokens only” lint rule via ESLint plugin or Tailwind config to block arbitrary pixel classes.

## 13. Implementation Constraints

- ❌ No raw Tailwind arbitrary values or unlisted `text-[...]`, `px-[...]`, `bg-[#...]` outside token tables.
- ❌ Avoid ad-hoc shadows/radii not mapped to tokens.
- ✔ Use only tokens defined above for typography, spacing, color, radius, shadow, timing.
- ✔ New components must map sizes to `t(n)` and `s(n)`; colors to palette tokens; radii/shadows to defined levels.
