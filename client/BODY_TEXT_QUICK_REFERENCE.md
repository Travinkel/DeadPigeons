# Body Text & Readability — Quick Reference

**For rapid implementation of line-height, letter-spacing, and form field improvements**

---

## Quick Copy-Paste: tailwind.config.js Extensions

```javascript
// Add to your theme.extend section

lineHeight: {
  'caption': '1.2',      // 12-13px text (badges, timestamps)
  'body': '1.5',         // 14-16px text (WCAG AA standard)
  'display': '1.25',     // 18-31px text (headers, subtitles)
  'jumbo': '1.1',        // 39px+ text (large figures, hero text)
},

letterSpacing: {
  'tight': '-0.025em',   // Headlines, emphasis
  'normal': '0em',       // Default (no change)
  'wide': '0.05em',      // Badges, metadata, all-caps
},

maxWidth: {
  'prose': '65ch',       // Optimal paragraph width (50-75 chars)
  'prose-sm': '55ch',    // Mobile-friendly (narrower)
  'prose-lg': '75ch',    // Wide (admin, tables)
},
```

---

## Copy-Paste Component Patterns

### Pattern 1: Standard Body Paragraph

```jsx
<p className="text-base leading-body text-base-content">
  Your available balance is the sum of all approved deposits minus board purchases.
</p>
```

### Pattern 2: Secondary/Muted Text

```jsx
<p className="text-sm leading-body text-base-content/70">Updated 2 hours ago</p>
```

### Pattern 3: Page Title + Subtitle

```jsx
<div className="space-y-2">
  <h1 className="text-4xl leading-jumbo font-bold text-secondary">Player Dashboard</h1>
  <p className="text-base leading-body text-base-content/70">
    Manage your balance, boards, and game history.
  </p>
</div>
```

### Pattern 4: Form Field (Complete)

```jsx
<div className="form-control">
  <label className="label">
    <span className="label-text text-sm font-medium leading-body">
      Email Address
      <span className="text-error ml-1">*</span>
    </span>
  </label>

  <input
    type="email"
    placeholder="name@example.com"
    className="input input-bordered h-12 text-base leading-body placeholder:text-base-content/50"
  />

  {/* Hint text */}
  <label className="label">
    <span className="label-text-alt text-xs leading-tight text-base-content/70">
      We'll never share this email.
    </span>
  </label>

  {/* Error (conditional) */}
  {error && (
    <label className="label">
      <span className="label-text-alt text-xs leading-tight text-error">{error}</span>
    </label>
  )}
</div>
```

### Pattern 5: List with Proper Spacing

```jsx
<ul className="space-y-2 list-disc list-inside text-base leading-body text-base-content">
  <li>First item in the list</li>
  <li>Second item with more detail</li>
  <li>Third item for completeness</li>
</ul>
```

### Pattern 6: On Dark Background (Navbar, Primary Card)

```jsx
<div className="bg-primary px-6 py-4 rounded-box">
  <p className="text-base leading-body text-primary-content">Active game: Week 49, 2025</p>
</div>
```

### Pattern 7: Long-Form Content (Articles, Help Text)

```jsx
<article className="max-w-prose mx-auto px-4 py-8">
  <h2 className="text-2xl leading-display font-bold text-base-content mb-4">How Balances Work</h2>

  <p className="text-base leading-body text-base-content mb-4">
    Your balance is automatically calculated from your transaction history.
  </p>

  <p className="text-base leading-body text-base-content mb-6">
    Approved deposits increase your balance, while board purchases decrease it.
  </p>

  <h3 className="text-xl leading-display font-semibold text-base-content mb-3">Example</h3>

  <ul className="space-y-2 list-disc list-inside text-base leading-body text-base-content">
    <li>Start with 500 DKK deposit</li>
    <li>Buy a 5-number board (-20 DKK)</li>
    <li>New balance: 480 DKK</li>
  </ul>
</article>
```

### Pattern 8: Table with Proper Text Sizing

```jsx
<table className="table">
  <thead>
    <tr>
      <th className="text-base leading-body font-semibold">Week</th>
      <th className="text-base leading-body font-semibold">Status</th>
      <th className="text-right">Boards</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="text-base leading-body text-base-content">Week 49, 2025</td>
      <td className="text-base leading-body">
        <span className="badge badge-success">Active</span>
      </td>
      <td className="text-right text-base leading-body font-semibold">12</td>
    </tr>
    <tr>
      <td className="text-sm leading-caption text-base-content/70">Oct 15, 2024</td>
      <td className="text-sm leading-caption">
        <span className="badge badge-ghost">Completed</span>
      </td>
      <td className="text-right text-sm leading-caption font-semibold">8</td>
    </tr>
  </tbody>
</table>
```

---

## Typography Cheat Sheet

| Use Case           | Classes to Use                                    | Example             |
| ------------------ | ------------------------------------------------- | ------------------- |
| **Page title**     | `text-4xl leading-jumbo font-bold text-secondary` | h1 headlines        |
| **Section title**  | `text-2xl leading-display font-bold`              | Section headers     |
| **Body paragraph** | `text-base leading-body text-base-content`        | Main content        |
| **Secondary text** | `text-sm leading-body text-base-content/70`       | Captions, hints     |
| **Form label**     | `text-sm font-medium leading-body`                | Input labels        |
| **Badge/metadata** | `text-xs leading-caption tracking-wide`           | Badges, timestamps  |
| **Error message**  | `text-xs leading-tight text-error`                | Validation feedback |

---

## Before & After Examples

### Before (ad-hoc, inconsistent)

```jsx
// ❌ No explicit line-height, ad-hoc text sizes
<p className="text-lg">This paragraph is inconsistent.</p>
<label>Email</label>
<input className="text-[16px] py-2 px-3" />
<span className="text-gray-600 text-sm">Optional hint text</span>
```

### After (semantic, consistent)

```jsx
// ✅ Explicit line-height, semantic sizing
<p className="text-base leading-body text-base-content">
  This paragraph follows the design system.
</p>

<label className="label">
  <span className="label-text text-sm font-medium leading-body">
    Email
  </span>
</label>

<input
  className="input input-bordered h-12 text-base leading-body placeholder:text-base-content/50"
/>

<label className="label">
  <span className="label-text-alt text-xs leading-tight text-base-content/70">
    Optional hint text
  </span>
</label>
```

---

## Contrast & Accessibility Quick Check

| Combination                                               | Contrast Ratio | WCAG Level      |
| --------------------------------------------------------- | -------------- | --------------- |
| `text-base-content` on `bg-base-100` (#111827 on #ffffff) | 18:1           | AAA ✅          |
| `text-base-content/70` on `bg-base-100`                   | 7.5:1          | AA ✅           |
| `text-base-content/50` on `bg-base-100`                   | 4.5:1          | AA (minimum) ⚠️ |
| `text-primary-content` on `bg-primary` (#fff on #d40000)  | 9:1            | AAA ✅          |
| `text-error-content` on `bg-error`                        | varies         | Check with WAVE |

**Tool:** Use [WAVE](https://wave.webaim.org/) or [Lighthouse](https://developers.google.com/web/tools/lighthouse) to audit.

---

## Line-Height Quick Decision Tree

```
Is this text...?

├─ A page title (39px+)?          → Use `leading-jumbo` (1.1)
├─ A section header (18-31px)?    → Use `leading-display` (1.25)
├─ Body text (14-16px)?           → Use `leading-body` (1.5)
├─ Metadata/badge (12px)?         → Use `leading-caption` (1.2)
└─ Unsure?                        → Default to `leading-body` (1.5)
```

---

## Common Mistakes to Avoid

❌ **Don't:** Mix arbitrary values with tokens

```jsx
<p className="text-[16px] leading-6">Bad mix</p>
```

✅ **Do:** Use semantic tokens consistently

```jsx
<p className="text-base leading-body">Good consistency</p>
```

---

❌ **Don't:** Use `text-lg` for body text

```jsx
<p className="text-lg">Too large for body</p>
```

✅ **Do:** Use `text-base` for standard body

```jsx
<p className="text-base leading-body">Standard body size</p>
```

---

❌ **Don't:** Forget line-height in forms

```jsx
<input className="input h-11 px-4" /> {/* Missing leading-body */}
```

✅ **Do:** Match line-height with input content

```jsx
<input className="input h-12 px-4 text-base leading-body" />
```

---

## Testing Checklist

- [ ] Zoom to 200% — text readable without horizontal scroll?
- [ ] Dark mode — text visible on all backgrounds?
- [ ] Mobile (360px) — paragraphs readable?
- [ ] Keyboard — all inputs focusable with visible focus?
- [ ] WAVE tool — no contrast errors?
- [ ] Screen reader — labels properly associated?

---

## ESLint Rule (Optional Enforcement)

Add to `.eslintrc.js` to catch ad-hoc text sizes:

```javascript
{
  rules: {
    'tailwindcss/no-arbitrary-value': ['warn', {
      'callees': ['cn', 'clsx', 'classnames'],
      'skipped': ['spacing', 'zIndex'],
      'level': 'warn',
    }],
  },
}
```

This helps prevent `/\[(?!var\(--).*\]/` arbitrary values without CSS variable backing.
