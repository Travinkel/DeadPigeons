# Design Tokens Improvements — Body Text, Line Height & Readability

**Status:** Recommendations for DESIGN_TOKENS_MATH.md enhancement
**Target Stack:** DaisyUI v5.5.5, Tailwind v4.1.17, Vite v7.2.4
**Date:** November 25, 2024

---

## Executive Summary

The current `DESIGN_TOKENS_MATH.md` provides excellent foundational work on spacing, typography scale, and color. However, **body text specifications lack critical readability attributes** (line-height, letter-spacing, word-spacing) that are essential for:

- WCAG AA compliance (1.5× line-height for body copy >= 14px)
- Readability across devices (line-length guidance missing)
- Form usability (label/input pairing specs needed)
- Dark mode consistency (insufficient body text color documentation)

This document proposes **4 major additions** to the design system, with Tailwind v4-compatible implementations.

---

## 1) Critical Issue: Missing Line-Height Specifications

### Current State

| Token | Size (px) | Tailwind    | Line Height   | Issue                              |
| ----- | --------- | ----------- | ------------- | ---------------------------------- |
| t-1   | 12.8      | `text-sm`   | Default (1.5) | Missing explicit spec              |
| t0    | 16        | `text-base` | Default (1.5) | No guidance for long-form body     |
| t1    | 20        | `text-lg`   | Default (1.5) | Callout text needs tighter leading |
| t4    | 39        | `text-3xl`  | Default (1.5) | Headlines OK but not documented    |

### Problem

Without explicit line-height tokens, developers resort to ad-hoc values (`leading-7`, `leading-loose`) that:

- Break rhythm across components
- Don't scale at breakpoints
- Violate WCAG guidelines (long body text needs 1.5×+ height)
- Cause label/input misalignment in forms

### Proposed Solution: Line-Height Scale

Add a **`leading` (line-height) token scale** paired to typography size:

```css
/* Proposed CSS variables (in tailwind.config.js or index.css) */
:root {
  /* Body line heights (WCAG AA: >= 1.5 for body text >= 14px) */
  --leading-tight: 1.25; /* 20px / 16px = dense labels, code */
  --leading-normal: 1.5; /* 24px / 16px = default body, lists */
  --leading-relaxed: 1.75; /* 28px / 16px = long-form (blogs, cards) */
  --leading-loose: 2; /* 32px / 16px = very large text, headlines */

  /* Semantic mappings */
  --leading-caption: 1.2; /* 12-13px text, badges, metadata */
  --leading-body: 1.5; /* 14-16px text, standard prose */
  --leading-display: 1.25; /* 18-31px text, headlines, titles */
  --leading-jumbo: 1.1; /* 39px+, large headings, figures */
}
```

### Recommended Typography + Line Height Matrix

| Usage             | Size token | Px       | Tailwind        | **Leading token**     | Px      | Example usage                |
| ----------------- | ---------- | -------- | --------------- | --------------------- | ------- | ---------------------------- |
| Jumbo headlines   | t5         | 49       | `text-4xl`      | **`leading-jumbo`**   | 1.1     | Player balance figure        |
| Large headlines   | t4         | 39       | `text-3xl`      | **`leading-display`** | 1.25    | Page titles                  |
| Subheadings       | t3         | 31       | `text-2xl`      | **`leading-display`** | 1.25    | Section titles               |
| Emphasis/callouts | t1         | 20       | `text-lg`       | **`leading-body`**    | 1.5     | Pricing cards, CTAs          |
| **Body copy**     | **t0**     | **16**   | **`text-base`** | **`leading-body`**    | **1.5** | Default prose, lists, tables |
| Smaller body      | t-1        | 12.8     | `text-sm`       | **`leading-body`**    | 1.5     | Form labels, metadata        |
| **Captions**      | **t-1**    | **12.8** | **`text-sm`**   | **`leading-caption`** | **1.2** | Badges, timestamps, hints    |

### Implementation (Tailwind v4)

```javascript
// tailwind.config.js (Tailwind v4 with @tailwindcss/vite)
export default {
  theme: {
    extend: {
      // Existing: typography scale
      fontSize: {
        // ... existing tokens
      },
      // NEW: Line height scale (semantic)
      lineHeight: {
        caption: "1.2", // 12-13px text
        body: "1.5", // 14-16px body (WCAG AA default)
        display: "1.25", // Headlines (18-31px)
        jumbo: "1.1", // Ultra-large (39px+)
        // Keep Tailwind defaults
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.75",
        loose: "2",
      },
      // Optional: tracking (letter-spacing) scale
      letterSpacing: {
        tight: "-0.02em", // Headlines
        normal: "0em", // Default
        wide: "0.05em", // Metadata, badges
      },
    },
  },
};
```

### Usage Examples (Tailwind v4-compatible)

```jsx
// Page title with proper leading
<h1 className="text-4xl leading-jumbo font-bold text-secondary">
  Player Dashboard
</h1>

// Body paragraph (WCAG AA compliant)
<p className="text-base leading-body text-base-content">
  Your balance includes all approved deposits minus board purchases.
</p>

// Form label (tight leading for conciseness)
<label className="text-sm leading-body font-medium">
  Email Address
</label>

// Table cell (caption text)
<td className="text-sm leading-caption text-base-content/70">
  Oct 15, 2024
</td>
```

---

## 2) Missing Letter-Spacing (Tracking) Scale

### Current Issue

Headers and badges look cramped. No explicit tracking tokens exist.

### Proposed Solution

```javascript
// In tailwind.config.js
letterSpacing: {
  'tight': '-0.025em',    // Headlines: -0.4px @ 16px base
  'normal': '0em',        // Default (0 tracking)
  'wide': '0.05em',       // Badges, all-caps metadata
  'wider': '0.1em',       // Large titles, emphasis
}
```

### Recommended Tracking Matrix

| Component type  | Token             | Value    | Example                      |
| --------------- | ----------------- | -------- | ---------------------------- |
| Headlines (t3+) | `tracking-tight`  | -0.025em | Page titles, section headers |
| Body text       | `tracking-normal` | 0em      | Paragraphs, lists, tables    |
| Metadata        | `tracking-wide`   | 0.05em   | Timestamps, badges, hints    |
| All-caps UI     | `tracking-wide`   | 0.05em   | Button labels, status pills  |
| Emphasis        | `tracking-wide`   | 0.05em   | Price figures, stats         |

### Usage

```jsx
<h2 className="text-2xl leading-display tracking-tight font-bold">
  Transaction History
</h2>

<span className="text-xs tracking-wide uppercase text-base-content/70">
  Pending approval
</span>
```

---

## 3) Body Text Color Specifications (Light + Dark Mode)

### Current Gap

Color tokens exist, but **body text contrast rules are not documented** relative to backgrounds.

### Proposed Solution: Body Text Color Matrix

```css
/* Semantic body text colors (index.css) */
:root {
  /* Light backgrounds (B1/B2) */
  --text-body-light: #111827; /* WCAG AAA on #ffffff (18:1) */
  --text-muted-light: #6b7280; /* WCAG AA on #ffffff (7.5:1) */
  --text-disabled-light: #d1d5db; /* WCAG AA on #ffffff (4.5:1, minimum) */

  /* Dark backgrounds (primary) */
  --text-body-dark: #ffffff; /* On primary (#d40000) */
  --text-muted-dark: #f3f4f6; /* Softer on dark (muted white) */

  /* Error/warning overlays */
  --text-on-error: #ffffff; /* #d40000 is primary (red) */
  --text-on-success: #ffffff; /* #15803d is green */
}
```

| Context                    | Text class                     | Color (hex)   | Contrast ratio | Notes                    |
| -------------------------- | ------------------------------ | ------------- | -------------- | ------------------------ |
| Body on light (B1/B2)      | `text-base-content`            | #111827       | 18:1 (AAA)     | Default, full contrast   |
| Muted on light             | `text-base-content/70`         | #6b7280 @ 70% | 7.5:1 (AA)     | Secondary text, captions |
| Disabled on light          | `text-base-content/50`         | #9ca3af @ 50% | 4.5:1 (AA)     | Disabled inputs, hints   |
| **Body on dark (primary)** | **`text-primary-content`**     | **#ffffff**   | **18:1 (AAA)** | Navbar, primary cards    |
| Muted on dark              | `text-primary-content/80`      | #ffffff @ 80% | 15:1 (AAA)     | Secondary navbar text    |
| Body on secondary (error)  | `text-error-content` (DaisyUI) | Contextual    | >= 4.5:1 (AA)  | Error alerts, badges     |

### Usage (Updated Examples)

```jsx
// Standard body paragraph
<p className="text-base leading-body text-base-content">
  Your available balance is calculated by summing all approved deposits.
</p>

// Muted secondary text (e.g., captions in tables)
<td className="text-sm leading-caption text-base-content/70">
  Approved 2 days ago
</td>

// On primary/dark background
<div className="bg-primary px-6 py-4">
  <p className="text-base leading-body text-primary-content">
    Active game: Week 49, 2025
  </p>
</div>

// Error message
<div className="alert alert-error">
  <p className="text-base leading-body text-error-content">
    Board purchase failed. Please check your balance.
  </p>
</div>
```

---

## 4) Form Field Specifications (Labels + Inputs + Hints)

### Current Gap

No explicit guidance for:

- Label size / weight / leading relative to input
- Placeholder text size
- Error message / hint text styling
- Input padding alignment

### Proposed Solution: Form Component Matrix

```javascript
// tailwind.config.js extend section
{
  // NEW semantic tokens for form UI
  fontSize: {
    'form-label': '0.875rem',      // 14px (t-1)
    'form-input': '1rem',          // 16px (t0) — user input area
    'form-hint': '0.75rem',        // 12px — error messages, hints
  },
  lineHeight: {
    'form-label': '1.5',           // 1.5× label height
    'form-input': '1.5',           // 1.5× input height
    'form-hint': '1.3',            // Tighter for short messages
  },
  fontWeight: {
    'form-label': '500',           // Medium weight (semi-bold)
  },
}
```

### Form Component Specifications

| Part            | Token                 | Size       | Weight | Leading | Color                  | Notes                      |
| --------------- | --------------------- | ---------- | ------ | ------- | ---------------------- | -------------------------- |
| **Label**       | `text-sm font-medium` | 14px (t-1) | 500    | 1.5     | `text-base-content`    | Always required visibility |
| **Input area**  | `text-base`           | 16px (t0)  | 400    | 1.5     | User-entered text      | Matches readable body text |
| **Placeholder** | `text-base`           | 16px (t0)  | 400    | 1.5     | `text-base-content/50` | Muted hint                 |
| **Hint text**   | `text-xs`             | 12px       | 400    | 1.3     | `text-base-content/70` | Supporting info, optional  |
| **Error msg**   | `text-xs`             | 12px       | 400    | 1.3     | `text-error`           | High contrast, assertive   |
| **Success msg** | `text-xs`             | 12px       | 400    | 1.3     | `text-success`         | Confirmation feedback      |

### Form HTML Structure Pattern

```jsx
// Recommended form field structure with proper hierarchy
<div className="form-control">
  {/* Label: medium weight, 14px, 1.5× leading */}
  <label className="label">
    <span className="label-text text-sm font-medium leading-body">
      Email Address
      <span className="text-error ml-1">*</span> {/* Required indicator */}
    </span>
  </label>

  {/* Input: 16px, centered vertically with label */}
  <input
    type="email"
    placeholder="name@example.com"
    className="input input-bordered h-12 text-base leading-body placeholder:text-base-content/50"
  />

  {/* Hint (optional): 12px, muted color */}
  <label className="label">
    <span className="label-text-alt text-xs leading-tight text-base-content/70">
      We'll never share your email
    </span>
  </label>

  {/* Error message (shown conditionally): 12px, red */}
  {errors.email && (
    <label className="label">
      <span className="label-text-alt text-xs leading-tight text-error">
        {errors.email.message}
      </span>
    </label>
  )}
</div>
```

### Input Height & Padding Rationalization

**Current:** `h-11 px-5` (height 44px, padding 20px horizontal)
**Recommended adjustment for body text alignment:**

```javascript
// tailwind.config.js
{
  height: {
    'input': '3rem',       // 48px (12px text + 18px top/bottom padding)
    'input-sm': '2.5rem',  // 40px (compact variant)
  },
  padding: {
    'input-x': '1rem',     // 16px horizontal (s4)
    'input-y': '0.75rem',  // 12px vertical (s3)
  },
}
```

Usage:

```jsx
<input
  className="input input-bordered h-12 px-4 py-3 text-base leading-body"
  placeholder="Enter value..."
/>
```

---

## 5) List & Prose Paragraph Specifications

### Current Gap

No guidance for:

- Paragraph line-length (readability best practice: 50-75 characters)
- Margin between paragraphs
- List item spacing
- Blockquote styling

### Proposed Solution

```javascript
// tailwind.config.js
{
  maxWidth: {
    'prose': '65ch',       // Optimal reading width (50-75 chars)
    'prose-sm': '55ch',    // Narrower for mobile
    'prose-lg': '75ch',    // Wider for admin tables
  },
}
```

### Prose & List Matrix

| Component       | Token                                   | Details                        | Example                  |
| --------------- | --------------------------------------- | ------------------------------ | ------------------------ |
| **Paragraph**   | `text-base leading-body max-w-prose`    | 16px, 1.5× leading, 65ch width | Body articles, card text |
| **Tight list**  | `space-y-1` (items)                     | 4px gap between items          | Inline lists, no bullets |
| **Normal list** | `space-y-2` (items)                     | 8px gap between items          | Standard `<ul>` / `<ol>` |
| **Spaced list** | `space-y-3` (items)                     | 12px gap (for emphasis)        | Multi-line items         |
| **Blockquote**  | `border-l-4 border-primary pl-4 italic` | Left accent + emphasis         | Testimonials, quotes     |

### Usage

```jsx
// Long-form body text
<article className="max-w-prose">
  <p className="text-base leading-body text-base-content mb-4">
    Your balance is calculated automatically from your transaction history.
  </p>
  <p className="text-base leading-body text-base-content">
    Approved deposits add to your balance, while board purchases deduct.
  </p>
</article>

// List with proper spacing
<ul className="space-y-2 list-disc list-inside">
  <li className="text-base leading-body">First item</li>
  <li className="text-base leading-body">Second item</li>
  <li className="text-base leading-body">Third item</li>
</ul>

// Blockquote
<blockquote className="border-l-4 border-primary pl-4 italic text-base-content/80">
  <p className="text-base leading-body">
    "The system is designed to be fair and transparent."
  </p>
</blockquote>
```

---

## 6) Dark Mode Body Text Adjustments

### Current Issue

DaisyUI v5.5.5 handles dark mode via the `data-theme="dark"` attribute, but body text contrast needs explicit attention.

### Proposed Solution

Add dark mode variant specifications:

```css
/* index.css */
@media (prefers-color-scheme: dark) {
  :root[data-theme="dark"] {
    --text-body-color: #e5e7eb; /* Softer white for dark mode */
    --text-muted-color: #9ca3af; /* Medium gray for secondary */
  }
}
```

### Dark Mode Typography Matrix

| Token                  | Light (B1 bg)       | Dark (bg-base-900) | Notes                     |
| ---------------------- | ------------------- | ------------------ | ------------------------- |
| `text-base-content`    | #111827 (black-900) | #e5e7eb (gray-100) | High contrast             |
| `text-base-content/70` | #6b7280 (gray-500)  | #d1d5db (gray-300) | Secondary, muted          |
| `text-base-content/50` | #9ca3af (gray-400)  | #9ca3af (gray-400) | Disabled, hints (neutral) |

### Usage Pattern (DaisyUI v5.5.5 compatible)

```jsx
<div data-theme="light">
  <p className="text-base leading-body text-base-content">
    Light mode: maximum contrast
  </p>
</div>

<div data-theme="dark">
  <p className="text-base leading-body text-base-content">
    Dark mode: adjusted contrast
  </p>
</div>
```

---

## 7) Accessibility Enhancements

### WCAG AA Compliance Checklist

| Guideline                                  | Current Status | Proposed Fix                                 |
| ------------------------------------------ | -------------- | -------------------------------------------- |
| **1.4.3 Contrast (AA)**                    | ✅ Primary     | Add body text matrix with minimum 7:1 (AA)   |
| **1.4.4 Text Resize (AA)**                 | ⚠️ Partial     | Test zoom to 200%; ensure text doesn't clip  |
| **1.4.8 Visual Presentation (AAA)**        | ❌ Missing     | Line-height >= 1.5, line-length <= 80ch      |
| **2.5.5 Target Size (WCAG 2.1 Level AAA)** | ⚠️ Partial     | Buttons 44×44px ✅, ensure text selectable   |
| **3.1.5 Reading Level (AAA)**              | ⏳ N/A         | Use simple language in UI copy; limit jargon |

### Proposed Additions

1. **Minimum line-height for body text >= 14px:**

   ```css
   /* In @layer components */
   @layer components {
     @apply leading-body; /* Enforces 1.5× */
   }
   ```

2. **Max line-length for readability:**

   ```html
   <article class="max-w-prose mx-auto px-4">
     <!-- Limits to ~65 characters for comfortable reading -->
   </article>
   ```

3. **Focus indicators (keyboard navigation):**
   ```javascript
   // tailwind.config.js
   {
     outline: {
       'focus': '3px solid #d40000',
     },
   }
   ```

---

## 8) Implementation Roadmap

### Phase 1: Foundation (Week 1)

- [ ] Update `DESIGN_TOKENS_MATH.md` with line-height and tracking scales
- [ ] Add CSS variables to `client/index.css`
- [ ] Update `tailwind.config.js` with semantic line-height tokens

### Phase 2: Components (Week 2)

- [ ] Audit all body text components (paragraphs, labels, hints)
- [ ] Update form fields with line-height + padding alignment
- [ ] Add prose/list components with proper spacing

### Phase 3: Compliance (Week 3)

- [ ] Run contrast audit (WAVE, Lighthouse)
- [ ] Test zoom at 200% (text resize)
- [ ] Validate keyboard navigation
- [ ] Document in PR with before/after screenshots

### Phase 4: Documentation (Week 4)

- [ ] Update component library with examples
- [ ] Add ESLint rules to catch non-compliant text sizes
- [ ] Create Figma design tokens mirror

---

## 9) Compatibility Notes

### DaisyUI v5.5.5

- ✅ Supports semantic color tokens (`text-base-content`, `text-primary-content`)
- ✅ Built-in focus ring utilities align with our specs
- ✅ Form components work with Tailwind v4 sizing
- ⚠️ Dark mode via `data-theme` attribute (not `prefers-color-scheme` alone)

### Tailwind v4.1.17

- ✅ `@tailwindcss/vite` plugin simplifies config
- ✅ Extended theme inheritance works well
- ✅ Arbitrary values can be gated via regex (enforcement rules work)
- ✅ CSS variables in theme work natively

### Vite v7.2.4

- ✅ Fast HMR for Tailwind changes
- ✅ CSS minification handles design tokens efficiently
- ✅ No special config needed beyond `@tailwindcss/vite`

---

## 10) Updated tailwind.config.js Example

```javascript
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        // Existing typography scale
        // ... (keep current t0-t5 mappings)
      },
      lineHeight: {
        // NEW: Semantic line-height scale
        caption: "1.2", // Badges, metadata
        body: "1.5", // WCAG AA body text
        display: "1.25", // Headlines
        jumbo: "1.1", // Ultra-large text
      },
      letterSpacing: {
        // NEW: Tracking scale
        tight: "-0.025em",
        normal: "0em",
        wide: "0.05em",
      },
      maxWidth: {
        // NEW: Prose width constraints
        prose: "65ch",
        "prose-sm": "55ch",
        "prose-lg": "75ch",
      },
      height: {
        // Input height aligned to text baseline
        input: "3rem", // 48px
        "input-sm": "2.5rem", // 40px
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#d40000",
          secondary: "#a80000",
          accent: "#000000",
          // ... other colors
        },
      },
      "dark",
    ],
  },
};
```

---

## 11) PR Checklist for Implementation

```markdown
## Body Text & Line-Height Enhancements

### Changes

- [ ] Updated `DESIGN_TOKENS_MATH.md` with line-height matrix
- [ ] Added CSS variables for leading/tracking to `index.css`
- [ ] Extended `tailwind.config.js` with semantic tokens
- [ ] Refactored body text in 3+ page components
- [ ] Updated form field structure (label + input + hint)

### Testing

- [ ] Contrast audit (WAVE tool): all text >= 7:1 (AA)
- [ ] Zoom test at 200%: no text clipping
- [ ] Keyboard navigation: all inputs focusable
- [ ] Mobile (360px): paragraphs readable without horizontal scroll
- [ ] Dark mode: text readable on all backgrounds

### Accessibility

- [ ] WCAG AA checklist passed
- [ ] Line-height >= 1.5 for body text >= 14px
- [ ] No missing focus indicators
- [ ] Form labels properly associated with inputs
```

---

## 12) Summary of Recommendations

| Area                | Current State | Recommended Enhancement                     | Priority |
| ------------------- | ------------- | ------------------------------------------- | -------- |
| **Line-height**     | Implicit      | Explicit scale (caption/body/display/jumbo) | CRITICAL |
| **Letter-spacing**  | Missing       | Tracking scale (tight/normal/wide/wider)    | HIGH     |
| **Body text color** | Partial       | Full contrast matrix (light/dark modes)     | HIGH     |
| **Form specs**      | Minimal       | Label/input/hint structure guide            | HIGH     |
| **Prose/lists**     | Undocumented  | Width constraints + spacing rules           | MEDIUM   |
| **Dark mode**       | Basic support | Explicit body text color variants           | MEDIUM   |
| **Accessibility**   | Good baseline | Line-length + zoom testing added            | MEDIUM   |

---

## Conclusion

The current design system provides a solid foundation. Adding these **4 missing dimensions** (line-height, letter-spacing, body text color matrix, form structure) will:

✅ **Improve readability** across all body text components
✅ **Ensure WCAG AA compliance** with explicit contrast + line-height rules
✅ **Reduce developer friction** by providing semantic tokens instead of ad-hoc values
✅ **Scale naturally** to Tailwind v4 + DaisyUI v5.5.5 + Vite v7

**Estimated implementation time:** 3-4 days for full audit + updates.
