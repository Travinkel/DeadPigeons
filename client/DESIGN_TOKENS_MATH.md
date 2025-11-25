# Design Tokens Math

These notes capture how the Jerne IF design tokens scale from the 8px base grid and Major Third type ratio (×1.25). Use them as the numeric backing for Tailwind and DaisyUI tokens in the client.

- **Base spacing:** 8px rhythm → `s1=8`, `s2=16`, `s3=24`, `s4=32`, `s5=40`, `s6=48`, `s8=64`.
- **Type ladder (t(n))**: `t0=14px`, `t1=16px`, `t2=20px`, `t3=25px`, `t4=31px`, `t5=39px` (aligns with `text-sm` through `text-h1`).
- **Radii:** `r1=6px` for inputs and small buttons, `r2=12px` for cards, `r3=16px` for immersive surfaces.

## Token Combination Matrix

### Button matrix (variant × state)

| Variant   | State    | Background token  | Text token                  | Radius | Height / padding | Shadow token   | Allowed modifiers                                                                           |
| --------- | -------- | ----------------- | --------------------------- | ------ | ---------------- | -------------- | ------------------------------------------------------------------------------------------- |
| Primary   | Default  | `bg-primary`      | `text-primary-content`      | `r1`   | `h-11 px-5`      | `shadow-md`    | Outline (1px `outline-primary/40`), ring (`ring-2 ring-primary/30`), opacity 100%           |
| Primary   | Hover    | `bg-primary/90`   | `text-primary-content`      | `r1`   | `h-11 px-5`      | `shadow-lg`    | Outline, ring (`ring-2 ring-primary/40`), opacity 98%                                       |
| Primary   | Focus    | `bg-primary`      | `text-primary-content`      | `r1`   | `h-11 px-5`      | `shadow-md`    | Outline (`outline-2 outline-primary/50`), ring (`ring-4 ring-primary/35`), opacity 100%     |
| Primary   | Active   | `bg-primary/85`   | `text-primary-content`      | `r1`   | `h-10 px-5`      | `shadow`       | Outline, ring (`ring-2 ring-primary/25`), opacity 96%                                       |
| Primary   | Disabled | `bg-primary/50`   | `text-primary-content/60`   | `r1`   | `h-11 px-5`      | `shadow-none`  | Outline off, ring off, opacity 60% cap                                                      |
| Secondary | Default  | `bg-secondary`    | `text-secondary-content`    | `r1`   | `h-11 px-5`      | `shadow`       | Outline (1px `outline-secondary/35`), ring (`ring-2 ring-secondary/25`), opacity 100%       |
| Secondary | Hover    | `bg-secondary/90` | `text-secondary-content`    | `r1`   | `h-11 px-5`      | `shadow-md`    | Outline, ring (`ring-2 ring-secondary/30`), opacity 98%                                     |
| Secondary | Focus    | `bg-secondary`    | `text-secondary-content`    | `r1`   | `h-11 px-5`      | `shadow`       | Outline (`outline-2 outline-secondary/40`), ring (`ring-4 ring-secondary/30`), opacity 100% |
| Secondary | Active   | `bg-secondary/85` | `text-secondary-content`    | `r1`   | `h-10 px-5`      | `shadow-sm`    | Outline, ring (`ring-2 ring-secondary/20`), opacity 96%                                     |
| Secondary | Disabled | `bg-secondary/45` | `text-secondary-content/60` | `r1`   | `h-11 px-5`      | `shadow-none`  | Outline off, ring off, opacity 60% cap                                                      |
| Ghost     | Default  | `bg-transparent`  | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow-none`  | Outline (1px `outline-base-300`), ring (`ring-2 ring-base-300/50`), opacity 100%            |
| Ghost     | Hover    | `bg-base-200`     | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow-none`  | Outline, ring (`ring-2 ring-base-300/60`), opacity 98%                                      |
| Ghost     | Focus    | `bg-base-200`     | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow-none`  | Outline (`outline-2 outline-base-300`), ring (`ring-4 ring-primary/25`), opacity 100%       |
| Ghost     | Active   | `bg-base-300`     | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow-none`  | Outline, ring (`ring-2 ring-primary/20`), opacity 96%                                       |
| Ghost     | Disabled | `bg-transparent`  | `text-base-content/50`      | `r1`   | `h-10 px-4`      | `shadow-none`  | Outline off, ring off, opacity 50% cap                                                      |
| Subtle    | Default  | `bg-base-100`     | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow-sm`    | Outline (1px `outline-base-200`), ring (`ring-2 ring-base-200/60`), opacity 100%            |
| Subtle    | Hover    | `bg-base-200`     | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow`       | Outline, ring (`ring-2 ring-base-200/70`), opacity 98%                                      |
| Subtle    | Focus    | `bg-base-200`     | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow`       | Outline (`outline-2 outline-base-300`), ring (`ring-4 ring-primary/30`), opacity 100%       |
| Subtle    | Active   | `bg-base-300`     | `text-base-content`         | `r1`   | `h-10 px-4`      | `shadow-inner` | Outline, ring (`ring-2 ring-primary/20`), opacity 96%                                       |
| Subtle    | Disabled | `bg-base-200`     | `text-base-content/60`      | `r1`   | `h-10 px-4`      | `shadow-none`  | Outline off, ring off, opacity 60% cap                                                      |

### Card matrix

| Card type      | Background token | Border / radius                  | Spacing                             | Title typography | Body typography | Shadow / elevation |
| -------------- | ---------------- | -------------------------------- | ----------------------------------- | ---------------- | --------------- | ------------------ |
| Auth-card      | `bg-base-100`    | `border border-base-300`, `r2`   | `p-6 md:p-8`                        | `t4 (31px/700)`  | `t1 (16px/400)` | `shadow-xl`        |
| Dashboard-card | `bg-base-100`    | `border border-base-200`, `r2`   | `p-5 md:p-6`                        | `t3 (25px/600)`  | `t1 (16px/400)` | `shadow-lg`        |
| Table-card     | `bg-base-100`    | `border border-base-300`, `r2`   | `p-4 md:p-5` with `gap-y-3` rows    | `t2 (20px/600)`  | `t0 (14px/400)` | `shadow-md`        |
| Game-card      | `bg-base-100`    | `border border-primary/30`, `r3` | `p-5 md:p-7` with `gap-4` HUD slots | `t3 (25px/700)`  | `t1 (16px/500)` | `shadow-2xl`       |

### Typography hierarchy (`t(n)`) by usage

| Real usage              | Token | Notes                                           |
| ----------------------- | ----- | ----------------------------------------------- |
| Hero / page title       | `t5`  | Maps to `text-h1` (≈39px/900).                  |
| Section header          | `t4`  | `text-h2` (≈31px/700).                          |
| Card / module title     | `t3`  | `text-h3` (≈25px/600).                          |
| Form label / data label | `t2`  | 20px/500; align with medium weight for clarity. |
| Body copy               | `t1`  | 16px/400; primary paragraph style.              |
| Meta / captions         | `t0`  | 14px/400; also for table support text.          |

### Spacing rhythm matrix

| Breakpoint  | Vertical rhythm                                      | Horizontal rhythm                           |
| ----------- | ---------------------------------------------------- | ------------------------------------------- |
| 360px       | `s1=8`, `s2=12`, `s3=16`, `s4=24` for tighter stacks | `s1=8`, `s2=12`, `s3=16`, `s4=24`           |
| 414px       | `s1=8`, `s2=14`, `s3=18`, `s4=26`, `s5=32`           | `s1=10`, `s2=14`, `s3=18`, `s4=26`, `s5=32` |
| sm (640px)  | `s1=8`, `s2=16`, `s3=24`, `s4=32`, `s5=40`, `s6=48`  | `s1=12`, `s2=16`, `s3=24`, `s4=32`, `s5=40` |
| md (768px)  | `s1=8`, `s2=16`, `s3=24`, `s4=32`, `s6=48`, `s8=64`  | `s1=12`, `s2=16`, `s3=24`, `s4=32`, `s6=48` |
| lg (1024px) | `s1=10`, `s2=18`, `s3=26`, `s4=34`, `s6=50`, `s8=72` | `s1=14`, `s2=20`, `s3=28`, `s4=36`, `s6=52` |
| xl (1280px) | `s1=12`, `s2=20`, `s3=28`, `s4=36`, `s6=56`, `s8=80` | `s1=16`, `s2=24`, `s3=32`, `s4=40`, `s6=60` |

### Responsive rules

- **360px:** Compress card padding to `p-5→p-4`, buttons use `h-10` with `px-4`, and prefer `t2` titles to avoid wrapping.
- **414px:** Allow `p-5` defaults on cards, keep buttons at `h-10`/`px-4`, and enable `gap-3` vertical rhythm instead of `gap-2`.
- **sm (640px):** Restore full `p-5`–`p-6` card padding, allow `h-11` primary/secondary buttons, and promote section headers to `t4`.
- **md (768px):** Enable `p-6`–`p-7` game cards, widen table rows to `py-3`, and raise button rings to `ring-4` on focus for accessibility.
- **lg (1024px):** Increase dashboard gutters to `s5 (40px)`, allow `t5` hero on fold, and deepen elevations one step (`shadow-lg→shadow-xl`).
- **xl (1280px):** Apply max card radius `r3` where immersive, extend gutters to `s6 (48px)`, and allow buttons to expand to `px-6` when width permits.
