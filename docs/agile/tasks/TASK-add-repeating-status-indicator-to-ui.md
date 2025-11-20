# Task: Add repeating status indicator to UI

## Description
Update the client application to visually indicate which boards are marked for repetition.

## Steps to Complete
1.  Ensure the API response for a list of boards includes the `isRepeating` boolean flag for each board.
2.  In the React component that renders the list of boards, access this flag.
3.  Use conditional rendering to display a visual element (e.g., a repeating icon 🔁, a chip, or a badge) next to the boards where `isRepeating` is true.
4.  Add a tooltip to the indicator that says "This board will repeat next week".

## Definition of Done
- [ ] The UI clearly indicates which boards are repeating.
- [ ] The change is visually clean and intuitive.
- [ ] CI passes.

## Related User Stories
- US13 — Admin views repeating boards status
