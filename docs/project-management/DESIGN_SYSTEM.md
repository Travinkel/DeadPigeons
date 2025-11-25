# Dead Pigeons Design System (Jerne IF)

Single source of truth for the Jerne IF red theme used with DaisyUI 5.5.5 + Tailwind v4.

> Harvard-style references are noted inline, e.g. (Fitts, 1954).

## 1. Foundations

- **Stack:** React, Tailwind v4, DaisyUI components (no raw Tailwind colors for brand actions).
- **Typography scale (Major Third 1.25x):**
  - `text-h1`: 2.44rem / 39px, 900
  - `text-h2`: 1.94rem / 31px, 700
  - `text-h3`: 1.56rem / 25px, 600
  - `text-h4`: 1.25rem / 20px, 500
  - Body: 16px, 400; `text-sm`: 14px
- **Spacing:** 8px base; use 8/16/24/32/40/48/64px only to keep rhythm (Lidwell et al., 2010).

## 2. Color Tokens (Jerne IF Red)

Declared in `client/tailwind.config.js` and consumed via DaisyUI component classes:

- Primary `#D40000`, Secondary `#A80000`, Accent `#000000`
- Base: `base-100 #FFFFFF`, `base-200 #F3F4F6`, `base-300 #E5E7EB`, `base-content #111827`
- Neutral: `#1F2937`
- Semantic: `success #15803D`, `warning #D97706`, `error #D40000`, `info #1A56DB`
- Required CSS vars overridden: `--p --pc --s --sc --a --ac --n --nc --b1 --b2 --b3 --bc`

Accessibility: Red (#D40000) on white ≈ 5.2:1; white on red ≈ 5.2:1 (passes AA/AAA for text ≥14px bold) (W3C, 2018).

## 3. Components (DaisyUI-first)

- **Buttons:** `btn btn-primary`; height 40–44px (`h-10`/`h-11`), weight 600, full-width on mobile (Fitts, 1954).
- **Inputs:** `input input-bordered w-full h-12`; 16px font to avoid iOS zoom (Apple, 2023).
- **Cards:** `card bg-base-100 shadow-xl p-6|p-8`; radius per DaisyUI default.
- **Navbar:** `navbar bg-primary text-primary-content shadow-lg h-[60-64px]`; links 17–18px/500–600 to offset red-background thinning (Ware, 2021).

## 4. Layout Patterns

- **Auth pages:** Centered card `max-w-md` with logo + title + subtitle + form. Current login/register follow this and are acceptable; if redundancy with navbar is added later, consider moving the “Dead Pigeons” title to navbar and keeping the card title as the page action (“Log ind”) for clarity (Nielsen, 1995).
- **Dashboard first fold:** Balance, active boards, current game status.
- **Tables → cards on mobile:** Preserve badges and primary action at bottom.

## 5. Reality Checks (marking mismatches)

- ✅ Theme variables are fully overridden in `tailwind.config.js` and DaisyUI is forced to `themes: ["jerneif"]`.
- ✅ Auth forms use DaisyUI components (`card`, `input input-bordered`, `btn btn-primary`).
- ⚠️ The older snippet showing `@plugin "daisyui" { themes: jerneif --default; }` in CSS is **not how the project is configured**; actual theming lives in `tailwind.config.js` + Vite plugin.
- ⚠️ Claims about “offset 12% from top” and “card max-w-sm” were partially aspirational; current cards use `max-w-md` and center vertically. Keep if preferred, but document the choice explicitly.
- ⚠️ Navbar sizing guidance (17–18px text, 56–64px height) is not consistently implemented in `Layout.tsx`; update when adjusting IA.

## 6. Auth Card Content Check

Current login card (`client/src/features/auth/LoginPage.tsx`):
- Logo centered, title uses `text-h1` (“Dead Pigeons”), subtitle “Log ind for at fortsætte”.
- This is visually acceptable. If you want brand hierarchy tighter, change title to the task (“Log ind”) and place the club name under the logo in `text-sm` or move to navbar once a public layout exists.

## 7. Documentation Placement

- Recommendation: move this file to `docs/explanation/` and merge overlap with `ux-rationale.md` so design principles and rationale live together. Keep this file as the normative token source; keep UX Rationale for “why”.

## 8. References

- Apple (2023) *Human Interface Guidelines* – Text input zoom behavior on iOS.
- Fitts, P. (1954) ‘The information capacity of the human motor system’, *J. Exp. Psychol.*
- Lidwell, W., Holden, K., Butler, J. (2010) *Universal Principles of Design*.
- Nielsen, J. (1995) *10 Usability Heuristics*.
- W3C (2018) *WCAG 2.1* contrast requirements.
- Ware, C. (2021) *Information Visualization: Perception for Design*.
