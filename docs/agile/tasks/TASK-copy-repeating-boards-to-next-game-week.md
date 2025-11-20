# Task: Copy repeating boards to next game week

## Description
This task is a synonym for "Implement board repeating logic on game activation". It focuses on the core action of creating new board entries for the next game week based on the `isRepeating` flag.

## Steps to Complete
1.  This task is implemented as part of the game activation transaction.
2.  The logic identifies all boards from the concluding week marked with `isRepeating = true`.
3.  For each identified board, a new board record is created and associated with the player and the new, active game week.
4.  The cost for the new board is calculated and deducted from the player's balance.

## Definition of Done
- [ ] Logic is implemented within the game activation service method.
- [ ] CI passes with tests covering this logic.

## Related User Stories
- US12 — System repeats boards to future games
