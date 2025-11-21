# UI Wireframes

**Knowledge Domains (RAG):** KD7 - Web Frontend (React + TypeScript)

This document describes wireframe layouts for the Dead Pigeons application. All wireframes use DaisyUI components following the design patterns established in the UX Rationale.

---

## 1. Login Page

The entry point for all users. Clean branding with focused form.

```
+--------------------------------------------------+
|                                                  |
|              🎯 Dead Pigeons                     |
|         Weekly board raffle platform             |
|                                                  |
|  +------------------------------------------+    |
|  |                                          |    |
|  |   Email                                  |    |
|  |   +----------------------------------+   |    |
|  |   | user@example.com                 |   |    |
|  |   +----------------------------------+   |    |
|  |                                          |    |
|  |   Password                               |    |
|  |   +----------------------------------+   |    |
|  |   | ********                         |   |    |
|  |   +----------------------------------+   |    |
|  |                                          |    |
|  |   [        Sign In (btn-primary)     ]   |    |
|  |                                          |    |
|  |   [Alert: error message if invalid]      |    |
|  |                                          |    |
|  +------------------------------------------+    |
|                                                  |
|  By signing in, you accept our terms of service  |
|                                                  |
+--------------------------------------------------+
```

**DaisyUI Components:**
- `card` - Container for login form
- `input` - Email and password fields
- `btn btn-primary` - Sign in button
- `alert alert-error` - Validation/auth errors

**Behavior:**
- Inline validation on blur
- Loading spinner on submit
- Redirect to role-appropriate dashboard on success

**Access Control:**
- Anonymous only
- Authenticated users redirect to `/dashboard`

**API Endpoint:** `POST /api/auth/login`

---

## 2. Player Dashboard

Primary view for players showing their game participation status.

```
+--------------------------------------------------+
| [Logo]    Boards    History    [User] [Logout]   |
+--------------------------------------------------+
|                                                  |
|  Welcome back, [Player Name]                     |
|                                                  |
|  +---------------------+  +--------------------+ |
|  | Current Balance     |  | Active Week        | |
|  |                     |  |                    | |
|  |    DKK 450.00       |  |   Week 12          | |
|  |                     |  |   Ends: Nov 24     | |
|  +---------------------+  +--------------------+ |
|                                                  |
|  My Boards                    [+ Purchase Board] |
|  +------------------------------------------+    |
|  |                                          |    |
|  | +--------+  +--------+  +--------+       |    |
|  | | Board  |  | Board  |  | Board  |       |    |
|  | |   1    |  |   2    |  |   3    |       |    |
|  | |        |  |        |  |        |       |    |
|  | | 3,7,12 |  | 5,8,14 |  | 1,9,11 |       |    |
|  | | 15,18  |  | 16,19  |  | 13,17  |       |    |
|  | |        |  |        |  |        |       |    |
|  | |[Active]|  |[Pending]| |[Active]|       |    |
|  | +--------+  +--------+  +--------+       |    |
|  |                                          |    |
|  +------------------------------------------+    |
|                                                  |
+--------------------------------------------------+
```

**DaisyUI Components:**
- `navbar` - Top navigation
- `stat` - Balance and week info cards
- `card` - Individual board display
- `badge` - Board status (Active, Pending, Won)
- `btn btn-primary` - Purchase board action

**Board Card Details:**
- Light shadow for skeuomorphic effect
- Status badge color-coded:
  - `badge-warning` - Pending
  - `badge-success` - Active
  - `badge-info` - Won

---

## 3. Admin Dashboard

Overview for administrators with quick access to management tasks.

```
+--------------------------------------------------+
| [Logo]  Players  Boards  Games  Transactions     |
+--------------------------------------------------+
|                                                  |
|  Admin Dashboard                                 |
|                                                  |
|  +------------+ +------------+ +---------------+ |
|  | Players    | | Pending    | | Current Week  | |
|  |            | | Txns       | |               | |
|  |    24      | |     7      | |   Week 12     | |
|  |  [Manage]  | |  [Review]  | | [End Week]    | |
|  +------------+ +------------+ +---------------+ |
|                                                  |
|  Recent Activity                                 |
|  +------------------------------------------+    |
|  | Time     | Action      | Player  | Status|    |
|  |----------|-------------|---------|-------|    |
|  | 10:32    | Purchase    | Erik S. |Pending|    |
|  | 10:28    | Approved    | Lisa M. |Done   |    |
|  | 10:15    | Purchase    | Hans P. |Pending|    |
|  | 09:45    | Rejected    | Ole K.  |Done   |    |
|  +------------------------------------------+    |
|                                                  |
|  Quick Actions                                   |
|  [+ Add Player]  [+ Create Board]  [View Games]  |
|                                                  |
+--------------------------------------------------+
```

**DaisyUI Components:**
- `navbar` - Admin navigation
- `stat` - Summary statistics
- `table` - Recent activity log
- `btn btn-outline` - Quick action buttons
- `badge` - Status indicators

**Behavior:**
- Stats link to detailed management views
- End Week requires confirmation modal
- Activity table auto-refreshes

---

## 4. Board Purchase Page

Player flow for purchasing a new board with number selection.

```
+--------------------------------------------------+
| [Logo]    Boards    History    [User] [Logout]   |
+--------------------------------------------------+
|                                                  |
|  Purchase New Board                              |
|                                                  |
|  Select 5 numbers:                               |
|  +------------------------------------------+    |
|  |                                          |    |
|  | [ 1] [ 2] [ 3] [ 4] [ 5] [ 6] [ 7] [ 8] |    |
|  | [ 9] [10] [11] [12] [13] [14] [15] [16] |    |
|  | [17] [18] [19] [20] [21] [22] [23] [24] |    |
|  |                                          |    |
|  +------------------------------------------+    |
|                                                  |
|  Selected: 3, 7, 12, 15, 18                      |
|                                                  |
|  +------------------------------------------+    |
|  | Board Price:           DKK 20.00         |    |
|  | Your Balance:          DKK 450.00        |    |
|  | After Purchase:        DKK 430.00        |    |
|  +------------------------------------------+    |
|                                                  |
|  [Cancel]              [Confirm Purchase]        |
|                                                  |
|  Note: Purchase requires admin approval before   |
|  board becomes active.                           |
|                                                  |
+--------------------------------------------------+
```

**DaisyUI Components:**
- `btn btn-sm` - Number selection buttons
- `btn-active` - Selected numbers highlighted
- `card` - Price summary
- `btn btn-primary` - Confirm purchase
- `btn btn-ghost` - Cancel action

**Behavior:**
- Numbers toggle on click
- Confirm disabled until 5 selected
- Shows balance impact before confirmation
- Success creates pending transaction

---

## 5. Transaction Management (Admin)

Admin view for reviewing and approving player transactions.

```
+--------------------------------------------------+
| [Logo]  Players  Boards  Games  Transactions     |
+--------------------------------------------------+
|                                                  |
|  Transaction Management                          |
|                                                  |
|  [All] [Pending] [Approved] [Rejected]   [Search]|
|                                                  |
|  +------------------------------------------+    |
|  | [ ] | Player   | Type     | Amount | Date    ||
|  |-----|----------|----------|--------|---------|
|  | [ ] | Erik S.  | Purchase | 20.00  | Nov 21  ||
|  |     |          | Board #45|        | 10:32   ||
|  |     |          |          |[Approve][Reject] ||
|  |-----|----------|----------|--------|---------|
|  | [ ] | Hans P.  | Purchase | 40.00  | Nov 21  ||
|  |     |          | Boards   |        | 10:15   ||
|  |     |          | #46, #47 |[Approve][Reject] ||
|  |-----|----------|----------|--------|---------|
|  | [ ] | Lisa M.  | Deposit  | 100.00 | Nov 20  ||
|  |     |          | MobilePay|        | 14:22   ||
|  |     |          |          |[Approve][Reject] ||
|  +------------------------------------------+    |
|                                                  |
|  Selected: 2    [Bulk Approve]  [Bulk Reject]    |
|                                                  |
|  Showing 1-10 of 24        [<] [1] [2] [3] [>]   |
|                                                  |
+--------------------------------------------------+
```

**DaisyUI Components:**
- `tabs` - Filter by status
- `table` - Transaction list
- `checkbox` - Bulk selection
- `btn btn-success btn-sm` - Approve
- `btn btn-error btn-sm` - Reject
- `pagination` - Page navigation

**Behavior:**
- Approve/Reject require confirmation
- Bulk actions for efficiency
- Filters persist in URL
- Real-time status badge updates

---

## 6. Game History

View of completed game weeks with results.

```
+--------------------------------------------------+
| [Logo]    Boards    History    [User] [Logout]   |
+--------------------------------------------------+
|                                                  |
|  Game History                                    |
|                                                  |
|  +------------------------------------------+    |
|  | [Week 11] [Week 10] [Week 9] [Week 8]    |    |
|  +------------------------------------------+    |
|                                                  |
|  Week 11 Results                                 |
|  +------------------------------------------+    |
|  | Winning Numbers: 3, 8, 12, 17, 21        |    |
|  | Total Pot: DKK 480.00                    |    |
|  | Winners: 2                               |    |
|  +------------------------------------------+    |
|                                                  |
|  Your Boards                                     |
|  +------------------------------------------+    |
|  | +--------+  +--------+                   |    |
|  | | Board  |  | Board  |                   |    |
|  | |   38   |  |   39   |                   |    |
|  | |        |  |        |                   |    |
|  | | 3,7,12 |  | 3,8,12 |                   |    |
|  | | 15,18  |  | 17,21  |                   |    |
|  | |        |  |        |                   |    |
|  | |2 match |  |[WINNER]|                   |    |
|  | +--------+  +--------+                   |    |
|  |                                          |    |
|  | Prize Won: DKK 240.00                    |    |
|  +------------------------------------------+    |
|                                                  |
+--------------------------------------------------+
```

**DaisyUI Components:**
- `tabs` - Week selection
- `stat` - Week summary (numbers, pot, winners)
- `card` - Board results
- `badge badge-success` - Winner indicator
- `badge badge-ghost` - Match count

**Behavior:**
- Tabs navigate between weeks
- Winning numbers highlighted on boards
- Prize amount prominently displayed for winners
- Admin view shows all players' results

---

## Responsive Considerations

All wireframes adapt for mobile:

| Viewport | Layout Adjustment |
|----------|-------------------|
| Desktop  | Multi-column, full tables |
| Tablet   | Two-column, scrollable tables |
| Mobile   | Single column, cards stack vertically |

- Navigation collapses to hamburger menu
- Tables become card lists on mobile
- Number grid adjusts to viewport width
- Touch targets minimum 44x44px

---

## Component Mapping

| Wireframe Element | DaisyUI Component | Custom Styling |
|-------------------|-------------------|----------------|
| Navigation        | `navbar`          | - |
| Board display     | `card`            | Shadow, rounded corners |
| Status indicators | `badge`           | Color per state |
| Data tables       | `table`           | Zebra striping |
| Action buttons    | `btn`             | Size variants |
| Forms             | `input`, `select` | Vertical layout |
| Alerts            | `alert`           | Contextual colors |
| Week selection    | `tabs`            | - |
| Modals            | `modal`           | Confirmation dialogs |

---

---

## Global Layout

Root layout wrapping all authenticated pages.

```
+--------------------------------------------------+
| [Logo] Dead Pigeons                               |
|                                                  |
| [Nav Items based on role]         [User] [Logout]|
+--------------------------------------------------+
|                                                  |
|  <Page Content>                                  |
|                                                  |
|                                                  |
+--------------------------------------------------+
| © 2025 Dead Pigeons - Jerne IF                   |
+--------------------------------------------------+
```

**Mobile Navbar (collapsed):**
```
+--------------------------------------------------+
| [☰]  Dead Pigeons              [User]            |
+--------------------------------------------------+
```

**Toast Notifications (bottom-right):**
```
                          +----------------------+
                          | ✓ Board purchased    |
                          | DKK 20.00 deducted   |
                          +----------------------+
```

---

## Route Map

| Route | Page | Role | Description |
|-------|------|------|-------------|
| `/login` | Login | Public | Authentication |
| `/dashboard` | Dashboard | Player/Admin | Role-specific home |
| `/boards` | My Boards | Player | View owned boards |
| `/boards/purchase` | Purchase | Player | Buy new board |
| `/history` | Game History | Player | Past results |
| `/admin/players` | Players | Admin | Manage players |
| `/admin/transactions` | Transactions | Admin | Approve/reject |
| `/admin/games` | Games | Admin | Create/complete |

---

## API Endpoint Mapping

| Page | Endpoints | Method |
|------|-----------|--------|
| Login | `/api/auth/login` | POST |
| Player Dashboard | `/api/players/{id}/balance`, `/api/boards/player/{id}`, `/api/games/active` | GET |
| Admin Dashboard | `/api/players`, `/api/transactions/pending`, `/api/games/active` | GET |
| Board Purchase | `/api/boards`, `/api/players/{id}/balance` | POST, GET |
| Transaction Mgmt | `/api/transactions/pending`, `/api/transactions/{id}/approve` | GET, POST |
| Game History | `/api/games`, `/api/boards/game/{id}` | GET |
| Player Mgmt | `/api/players`, `/api/players/{id}` | GET, POST, PUT, DELETE |
| Game Completion | `/api/games/{id}/complete` | POST |

---

## Access Control Notes

### Login Page
- **Access:** Anonymous only
- **Redirect:** Authenticated users → `/dashboard`

### Player Dashboard
- **Access:** Player role only
- **Data:** Own balance, own boards, active game
- **Restrictions:** Cannot see other players' data

### Admin Dashboard
- **Access:** Admin role only
- **Data:** All players, all pending transactions, game management
- **Sensitive Actions:** End week requires confirmation

### Board Purchase
- **Access:** Player role only
- **Validation:** Balance check, cutoff time (Saturday 5 PM)
- **Business Rule:** Creates pending transaction for admin approval

### Transaction Management
- **Access:** Admin role only
- **Data:** All player transactions
- **Sensitive Actions:** Approve/reject affects player balances

### Game History
- **Access:** Authenticated (Player sees own, Admin sees all)
- **Player View:** Own boards only
- **Admin View:** All boards, all winners

---

## Error States

### Empty States

```
+------------------------------------------+
|                                          |
|            [Empty inbox icon]            |
|                                          |
|        No boards purchased yet           |
|                                          |
|     [+ Purchase Your First Board]        |
|                                          |
+------------------------------------------+
```

### API Error State

```
+------------------------------------------+
|  ⚠️ alert alert-error                    |
|                                          |
|  Unable to load data                     |
|  Please check your connection and try    |
|  again.                                  |
|                                          |
|  [Retry]                                 |
+------------------------------------------+
```

### Validation Error

```
+------------------------------------------+
|  Email                                   |
|  +----------------------------------+    |
|  | invalid-email                    |    |
|  +----------------------------------+    |
|  ❌ Please enter a valid email address   |
+------------------------------------------+
```

### Business Rule Error

```
+------------------------------------------+
|  ⚠️ alert alert-warning                  |
|                                          |
|  Purchase Unavailable                    |
|                                          |
|  Board purchases are closed after        |
|  Saturday 5 PM. Current week ends in     |
|  the draw tomorrow.                      |
|                                          |
+------------------------------------------+
```

### Insufficient Balance

```
+------------------------------------------+
|  ⚠️ alert alert-warning                  |
|                                          |
|  Insufficient Balance                    |
|                                          |
|  Required: DKK 20.00                     |
|  Available: DKK 15.00                    |
|                                          |
|  Please deposit funds before purchasing. |
|                                          |
+------------------------------------------+
```

---

## Component Hierarchy

```
src/
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── LoginForm.tsx
│   │   ├── AuthContext.tsx
│   │   └── useAuth.ts
│   ├── boards/
│   │   ├── BoardsPage.tsx
│   │   ├── BoardCard.tsx
│   │   ├── NumberGrid.tsx
│   │   ├── PurchaseForm.tsx
│   │   └── useBoardPurchase.ts
│   ├── dashboard/
│   │   ├── PlayerDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── StatCard.tsx
│   ├── games/
│   │   ├── GamesPage.tsx
│   │   ├── GameResultCard.tsx
│   │   └── CompleteGameForm.tsx
│   ├── players/
│   │   ├── PlayersPage.tsx
│   │   ├── PlayerTable.tsx
│   │   └── PlayerForm.tsx
│   └── transactions/
│       ├── TransactionsPage.tsx
│       ├── TransactionTable.tsx
│       ├── TransactionCard.tsx (mobile)
│       └── ApproveModal.tsx
├── shared/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── EmptyState.tsx
│   │   └── Toast.tsx
│   ├── hooks/
│   │   ├── useApi.ts
│   │   └── useToast.ts
│   └── utils/
│       ├── formatters.ts
│       └── validators.ts
├── api/
│   └── generated/
│       └── api-client.ts
└── routes/
    └── router.tsx
```

---

## State Management Strategy

### Authentication State
- **Provider:** `AuthContext` wrapping app
- **Storage:** JWT in memory, refresh token in httpOnly cookie
- **Contents:** User ID, role, token expiry

### Server State (API Data)
- **Library:** React Query (`@tanstack/react-query`)
- **Benefits:** Caching, refetching, optimistic updates
- **Example:**
  ```tsx
  const { data: boards, isLoading } = useQuery({
    queryKey: ['boards', playerId],
    queryFn: () => api.getPlayerBoards(playerId)
  })
  ```

### Form State
- **Library:** React Hook Form
- **Benefits:** Performance, validation integration

### UI State
- **Approach:** Local component state (`useState`)
- **Examples:** Modal open/closed, selected items

---

## Mobile Transaction Layout

Desktop tables → Mobile cards for better UX:

```
+------------------------------------------+
| Transaction #45                          |
| +--------------------------------------+ |
| | Player: Erik S.                      | |
| | Type: Purchase (Board #45)           | |
| | Amount: DKK 20.00                    | |
| | Date: Nov 21, 10:32                  | |
| |                                      | |
| | [Approve]            [Reject]        | |
| +--------------------------------------+ |
+------------------------------------------+
|                                          |
| Transaction #46                          |
| +--------------------------------------+ |
| | Player: Hans P.                      | |
| ...
```

---

## Cross-References

- [UX Rationale](./ux-rationale.md) - Design system and interaction patterns
- [ADR-0013](../adr/0013-client-package-by-feature.md) - Package-by-feature architecture
- [Sprint 4 Epic](../agile/sprint-04-epic.md) - Implementation tasks
- [API Reference](../reference/api.md) - Endpoint specifications
