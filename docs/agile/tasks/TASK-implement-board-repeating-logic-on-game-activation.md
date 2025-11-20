# Task: Implement board repeating logic on game activation

## Description
Implement the core logic that copies boards marked as `isRepeating` from the ended game week to the newly activated one.

## Steps to Complete
1.  In the service responsible for ending a game, after activating the next game week, fetch all boards from the ended week that have `isRepeating = true`.
2.  For each of these boards, create a new board entity for the new game week.
3.  The new board should have the same numbers and belong to the same player.
4.  Deduct the cost of each new board from the respective player's balance.
5.  If a player has insufficient funds, the board should not be copied, and this event should be logged.
6.  Ensure this entire process is part of the parent database transaction.

## Definition of Done
- [ ] Repeating boards are correctly copied to the new game week.
- [ ] Player balances are correctly updated.
- [ ] Insufficient balance cases are handled gracefully.
- [ ] CI passes.

## Related User Stories
- US12 — System repeats boards to future games
