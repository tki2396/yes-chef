# Draft: Recipe Genealogy

Source ticket: `recipe genealogy`
Source board: `The what why`
Status: Draft for review; not yet copied into the Kanban ticket.

## Product Thesis

Most recipe products treat recipes as static artifacts. Real cooking is iterative: substitutions, ingredient availability, dietary constraints, equipment differences, taste adjustments, and repeated attempts all matter. Recipe genealogy turns each adapted version into a branch with context, making "what changed and why" as important as the recipe itself.

This can also reduce reliance on scraped or paywalled recipe copies by encouraging users to store personal notes, diffs, summaries, substitutions, and attribution rather than wholesale reposts of protected content.

## Core User Stories

- As a cook, I can save a recipe to my personal library so I can make notes without publishing anything.
- As a cook, I can create an iteration of a saved recipe so I can track what I changed from the original.
- As a cook, I can document substitutions and outcomes so future me knows whether the change worked.
- As a cook, I can optionally publish my iteration so others can learn from it.
- As a cook, I can view a recipe lineage so I can discover variations that solve a constraint I have right now.

## MVP Scope

- Save/import recipe shell with title, source URL, ingredients, steps, and private notes.
- Add a "create variation" action from an existing recipe.
- Capture changed ingredients, changed steps, reason for change, result/rating, and notes for next time.
- Preserve a parent-child relationship between original and variation.
- Show a basic lineage view with the original recipe and direct variations.
- Add a publish/private toggle for each variation.

## Later Scope

- Diff view between two recipe versions.
- Search/filter variations by ingredient substitution, cuisine, dietary need, rating, or equipment.
- "I am missing X" substitution discovery across public branches.
- Attribution model for original source and derived work.
- Version graph visualization.
- Comments on public variations.
- Fork/branch counts as social proof.

## Data Model Notes

- `Recipe`: title, source URL, source author, owner, visibility, timestamps.
- `RecipeVersion`: parent version, ingredients, steps, change summary, substitution notes, outcome notes, rating, visibility.
- `RecipeAttribution`: source URL, source title, source author, accessed date.

## Acceptance Criteria

- A user can create a private recipe from a source URL or manual entry.
- A user can create a variation from that recipe without overwriting the original.
- A variation records at least one change note and one outcome note.
- The app displays the original and its variations together.
- Published variations are visible to other users; private variations are not.
- The UI makes attribution/source visible when a recipe has an external origin.

## Open Questions

- Is this primarily a personal version history feature, a social feature, or both from day one?
- Should importing copy the full recipe text, or should it store structured notes plus a source link to reduce copyright risk?
- What is the minimum useful lineage UI: list, tree, or visual graph?
- Should users be able to branch from another user's public branch?
- How much moderation is needed if public recipe variations are enabled?

## Suggested Ticket Breakdown

- Define recipe and recipe version schema.
- Build private recipe create/save flow.
- Add create variation flow.
- Add variation notes fields.
- Render parent recipe plus direct variations.
- Add private/public visibility toggle.
- Add basic attribution/source display.

