# Dead Pigeons Design System

Mathematical design system for Jerne IF brand identity.

## Typography Scale (1.25 Major Third)

Formula: `size(n) = base_size × ratio^n`

| Token | Calculation | Size | Weight |
|-------|-------------|------|--------|
| H1 | 16 × 1.25⁴ | 39px / 2.44rem | 900 |
| H2 | 16 × 1.25³ | 31px / 1.94rem | 700 |
| H3 | 16 × 1.25² | 25px / 1.56rem | 600 |
| H4 | 16 × 1.25¹ | 20px / 1.25rem | 500 |
| Body | 16 × 1 | 16px / 1rem | 400 |
| Small | 16 / 1.25 | 13px / 0.8rem | 400 |

## Color Palette

### Brand Colors (Jerne IF)
- **Primary Red**: `#D40000` (Luminance: 0.150)
- **White**: `#FFFFFF` (Luminance: 1.0)
- **Black**: `#000000` (Luminance: 0.0)

### Red Scale (CIE-LAB perceptual)
```css
--red-50:  #FFE5E5
--red-100: #FFB3B3
--red-200: #FF8080
--red-300: #FF4D4D
--red-400: #E63333
--red-500: #D40000  /* PRIMARY */
--red-600: #A80000  /* Hover */
--red-700: #7A0000  /* Active */
--red-800: #520000
--red-900: #2A0000
```

## Contrast Ratios (WCAG)

| Combination | Contrast | Status |
|-------------|----------|--------|
| White on Red (#D40000) | 5.25:1 | AAA ✓ |
| Black on Red | 4.0:1 | AA (large text only) |
| Red on White | 5.25:1 | AAA ✓ |

Formula: `(L1 + 0.05) / (L2 + 0.05) ≥ 4.5`

## Spacing Scale (1.25 ratio)

```css
--space-1:  4px
--space-2:  5px
--space-3:  6px
--space-4:  8px
--space-5:  10px
--space-6:  12px
--space-7:  16px
--space-8:  20px
--space-9:  25px
--space-10: 31px
--space-11: 39px
--space-12: 49px
```

## Button Geometry

- **Height**: `body_font × 2.5 = 40px`
- **Border Radius**: `6px` (sports design)
- **Icon Stroke**: `font_size / 16`

### States
- Default: `red-500` (#D40000)
- Hover: `red-600` (#A80000)
- Active: `red-700` (#7A0000)

## CSS Variables

```css
:root {
  /* Colors */
  --color-primary: #D40000;
  --color-primary-hover: #A80000;
  --color-primary-active: #7A0000;
  --color-white: #FFFFFF;
  --color-black: #000000;

  /* Typography (1.25 ratio) */
  --font-h1: 2.44rem;
  --font-h2: 1.94rem;
  --font-h3: 1.56rem;
  --font-h4: 1.25rem;
  --font-body: 1rem;
  --font-small: 0.8rem;

  /* Weights (optical compensation) */
  --weight-h1: 900;
  --weight-h2: 700;
  --weight-h3: 600;
  --weight-h4: 500;
  --weight-body: 400;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 25px;
  --space-xl: 39px;

  /* Components */
  --button-height: 40px;
  --button-radius: 6px;
  --input-height: 40px;
}
```

## Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D40000',
          50: '#FFE5E5',
          100: '#FFB3B3',
          200: '#FF8080',
          300: '#FF4D4D',
          400: '#E63333',
          500: '#D40000',
          600: '#A80000',
          700: '#7A0000',
          800: '#520000',
          900: '#2A0000',
        },
      },
      fontSize: {
        'h1': ['2.44rem', { lineHeight: '1.2', fontWeight: '900' }],
        'h2': ['1.94rem', { lineHeight: '1.25', fontWeight: '700' }],
        'h3': ['1.56rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.35', fontWeight: '500' }],
      },
      spacing: {
        '4.5': '1.125rem',  // 18px
        '5.5': '1.375rem',  // 22px
      },
    },
  },
};
```

## Loading Spinner

Standard loading spinner sizing:
- **Small** (`loading-sm`): 16px - inline, buttons
- **Default**: 24px - cards, sections
- **Large** (`loading-lg`): 32px - full page

```tsx
// Centered loading spinner
<div className="flex items-center justify-center min-h-[200px]">
  <span className="loading loading-spinner loading-sm text-primary"></span>
</div>
```

## Optical Weight Formula

```
optical_weight = (size / base_size) × base_weight
```

Example at base 16px, weight 400:
- 39px H1: (39/16) × 400 = 975 → 900
- 31px H2: (31/16) × 400 = 775 → 700
- 25px H3: (25/16) × 400 = 625 → 600
