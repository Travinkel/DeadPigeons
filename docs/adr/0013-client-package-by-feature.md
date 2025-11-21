# ADR-0013: Client Package-by-Feature Architecture

**Status:** Accepted
**Date:** 2025-11-21
**Deciders:** Development Team

## Context

The React client needs a clear organizational structure as we implement Sprint 4 UI features. Two common approaches exist:

1. **Package by Layer** - Group files by type (components/, hooks/, services/)
2. **Package by Feature** - Group files by domain feature (auth/, boards/, games/)

## Decision

We adopt **package-by-feature** organization for the client codebase.

## Structure

```
client/src/
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── AuthContext.tsx
│   │   ├── useAuth.ts
│   │   └── index.ts
│   ├── boards/
│   │   ├── BoardsPage.tsx
│   │   ├── BoardCard.tsx
│   │   ├── PurchaseForm.tsx
│   │   ├── useBoardPurchase.ts
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── PlayerDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── index.ts
│   ├── games/
│   │   ├── GamesPage.tsx
│   │   ├── GameCard.tsx
│   │   ├── CompleteGameForm.tsx
│   │   └── index.ts
│   ├── players/
│   │   ├── PlayersPage.tsx
│   │   ├── PlayerForm.tsx
│   │   └── index.ts
│   └── transactions/
│       ├── TransactionsPage.tsx
│       ├── DepositForm.tsx
│       ├── ApproveModal.tsx
│       └── index.ts
├── shared/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   ├── hooks/
│   │   └── useApi.ts
│   └── utils/
│       └── formatters.ts
├── api/
│   └── generated/
│       └── api-client.ts
├── routes/
│   └── router.tsx
├── App.tsx
└── main.tsx
```

## Rationale

### Why Package-by-Feature?

1. **Co-location**: Related files live together - easier to understand and modify
2. **Discoverability**: Find all board-related code in one place
3. **Exam presentation**: "Here's the boards feature" shows everything
4. **Deletion/refactoring**: Remove entire feature by deleting one folder
5. **Reduced cognitive load**: Context stays within feature boundary

### Why Not Package-by-Layer?

- Features scattered across multiple directories
- Harder to understand feature boundaries
- More mental context-switching
- Difficult to identify unused code

## Guidelines

### Feature Boundaries

Each feature folder should:
- Be self-contained (pages, components, hooks)
- Export via `index.ts` barrel file
- Not import from other features directly (use shared/)

### Shared Code

Move to `shared/` when:
- Used by 3+ features
- Truly generic (Layout, formatting utilities)

### Naming Conventions

- Pages: `*Page.tsx` (e.g., `BoardsPage.tsx`)
- Components: PascalCase (e.g., `BoardCard.tsx`)
- Hooks: `use*.ts` (e.g., `useBoardPurchase.ts`)
- Index: Re-exports public API

## Consequences

### Positive
- Clear feature ownership
- Easy to add new features
- Better code review experience
- Aligns with domain-driven thinking

### Negative
- May lead to some duplication initially
- Team must agree on feature boundaries
- Refactoring to shared/ requires judgment

## References

- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [Feature-Sliced Design](https://feature-sliced.design/)
- React community best practices
