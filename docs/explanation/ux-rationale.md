# UX Design Rationale

**Knowledge Domains (RAG):**

- KD7 — Web Frontend (React + TypeScript)

_(Explanation document – describes why the UI looks and behaves as it does.
Implementation details live in the client code and component docs.)_

## 1. Goals

## 2. Key user flows (conceptual)

- Login / Session: user authenticates, receives token; UI reflects role (Admin/Player)
- Admin manages week: create player → create board → end current game and activate next
- Player checks status: open current week, view boards, see deposit status

## 3. UX vs backend/security boundaries

- UX responsibilities: clarity, affordances, feedback, error messaging
- Backend/security responsibilities: auth, authorization policies, validation, rate‑limiting
- Integration: UI reads auth state and role to show/hide actions, never bypasses server rules
- Network‑aware logging: correlation ID surfaced to UI for support when needed

## 4. Cross‑links

- README — Dead Pigeons Project
- Architecture Overview (Trust boundaries & OWASP)
- Security Model (auth/session/authorization)

The Dead Pigeons UI is designed for two main user groups:

- **Club admins** – manage players, boards, deposits, and game weeks.
- **Players** – view their boards and game status.

UX goals:

- Make core flows obvious on first use.
- Keep the interface lightweight and fast.
- Reflect the physical “board game” domain without adding visual noise.
- Stay consistent with the underlying design system (Tailwind CSS + DaisyUI).

---

## 5. Design System

### 2.1 Stack

The frontend uses:

- **React + TypeScript** – component-based UI, typed props.
- **Tailwind CSS** – utility-first styling.
- **DaisyUI** – component library on top of Tailwind for consistent, theme-able UI primitives
  (buttons, cards, tabs, badges, alerts, etc.).

DaisyUI is used for:

- Base components (buttons, inputs, forms, modals).
- Theme support (light/dark and color tokens).
- Consistent spacing, typography, and interaction states.

Project-specific components (e.g., boards, deposits, game weeks) are built on top of these primitives.

Public marketing / info pages may use a hero banner (headline + subheading + CTA) to communicate the value proposition quickly. Authenticated app views avoid large heroes and prioritize data visibility and primary actions above the fold.

---

## 6. Light Skeuomorphic Cues

We apply **light skeuomorphism** only where it clarifies the domain.

### 3.1 Boards as Cards

- Boards are rendered as **card-like components** using DaisyUI card + custom styling.
- Slight elevation (`shadow`, `rounded`) differentiates boards from the background.
- Optional subtle texture or border to suggest a physical board.

**Reason:** Users already know Dead Pigeons as a physical game with printed boards.

Representing boards as cards makes the mapping between “what I hold in my hand” and “what I see on screen” straightforward.

### 3.2 Game Weeks as Tabs

- Game weeks are presented as **tabs** (DaisyUI `tabs` component).
- The active week is visually highlighted; inactive weeks are still accessible but visually secondary.

**Reason:** A tab layout matches the mental model of “one week at a time” and makes switching weeks a single, predictable action.

### 3.3 Deposits as Tokens

- Deposit status is shown with **badge / chip-style** components (DaisyUI `badge`).
- Color and iconography communicate state:
  - Pending
  - Approved
  - Rejected

**Reason:** Token-style badges mirror the idea of physical chips or markers and make state inspection quick when scanning tables.

### 3.4 Approval as Stamps (Optional)

- Admin approval actions may display a small “Approved / Rejected” label styled like a stamp.
- Kept subtle: mostly layout + typography, not heavy textures.

**Reason:** Reinforces that the admin has _applied a decision_ to a board or deposit while remaining visually lightweight.

---

## 7. Layout & Navigation

### 4.1 Information Architecture

- **Global navigation**: top-level access to “Boards”, “Players”, “Games”, “Admin”.
- **Contextual panels**: detail views slide in or open in modals instead of sending users away from the current list.
- **Primary flows**:
  - Admin: create player → create board → review deposits.
  - Player: log in → see current week → view boards and status.

### 4.2 Responsive Behavior

- Layout is mobile-first with breakpoints optimized for:
  - Phone (single-column lists, stacked forms).
  - Tablet / desktop (two-column layout: list + detail).
- Skeuomorphic accents (shadows, textures) are reduced on small screens to keep the UI clean.

---

## 8. Accessibility & States

### 5.1 Accessibility

- DaisyUI components provide baseline keyboard + focus handling.
- Additional rules:
  - All interactive elements are reachable via keyboard.
  - Color is not the only indicator of state: icons + text labels are used.
  - Landmarks (`<main>`, `<nav>`, etc.) and ARIA attributes are added where appropriate.

### 5.2 State Communication

- Loading, empty, error, and success states are explicit.
- DaisyUI alert components are used for feedback:
  - Form validation errors
  - Network/API errors
  - Successful actions (created, updated, deleted)

---

## 9. Interaction Patterns

- **Forms**: vertical layout, single clear primary action per form (e.g., “Create board”).
- **Confirmation**: destructive actions require confirmation (modal or secondary step).
- **Inline validation**: invalid fields are highlighted as the user interacts, not only on submit.
- **Table operations**: sorting and filtering are introduced gradually to avoid overwhelming first-time users.

---

## 10. Evolution

This UX rationale is intentionally stable but not frozen:

- New components should be composed from Tailwind + DaisyUI + existing primitives.
- Any new skeuomorphic element must:
  - support a clear domain metaphor, and
  - avoid heavy textures or inconsistent visual language.

Changes to the design system or major interaction patterns should be reflected here and in the component documentation.

## 11. Microinteractions & Animation

To keep the UI feeling responsive:

- Use short durations for transitions: typically **150–250ms**, and avoid exceeding **300ms** for standard UI state changes.
- Prefer easing functions like `ease-out` or `ease-in-out`; avoid purely linear timing for motion.
- Use **shorter durations** for small elements (chips, buttons) than for larger layout transitions.
- Animations must never block interaction: state changes should be perceived as instant, with animation layered on top as feedback.
- Respect user preferences (e.g., “reduced motion”) and treat animations as **progressive enhancement** – core flows must work without them.
