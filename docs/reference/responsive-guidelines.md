# Responsive Guidelines (Mobile First)

Scope: auth flows, landing/dashboard, navigation, forms.

## Breakpoints
- Mobile base: 360–375px (target), 414px (large phone).
- Tablet: 768px.
- Desktop: 1024px and up.

## Layout rules
- Use a single-column stack on mobile; avoid side-by-side cards under 640px.
- Keep CTA buttons full-width on mobile; minimum tappable height 44px.
- Maintain 16px body text, 24px+ headlines on mobile to preserve hierarchy.
- Cap container width on desktop (max 1100px) to avoid stretched text.
- Preserve focus states and visible error text on all breakpoints.

## Components
- Headers/nav: collapse to a single row with a menu or stacked links; logo shrinks before text wraps.
- Forms: use vertical rhythm with 12–16px spacing; labels stay visible above inputs.
- Cards: pad 16px mobile, 24px tablet/desktop; round corners 12px to match design tokens.
- Tables/grids: convert to stacked rows or summary cards under 640px; never require horizontal scroll for primary info.

## Testing checklist per PR
- Viewports: 360px, 375px, 414px, 768px, 1024px.
- Verify auth pages keep headings, inputs, errors, and CTA visible without horizontal scroll.
- Run E2E or smoke with a mobile viewport preset for login.
- Manually tab through controls on mobile width to ensure focus outlines are not clipped.
- Check Lighthouse mobile score for layout shift and tap targets; regressions block merge.
