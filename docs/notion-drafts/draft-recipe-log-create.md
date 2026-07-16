# Draft: Recipe Log/Create

Source ticket: `Recipe Log/Create`
Source board: `The what why`
Status: Draft for review; not yet copied into the Kanban ticket.

## Existing Ticket Notes

- Include time:
  - active time
  - passive time
- Include ingredients:
  - explored replacements
  - option for rating/notes for each different version
  - ideas for other replacements
- Include serving yield.
- Include instructions:
  - long version vs short version
  - beginner/middle/hard instruction detail based on experience
  - AI-generated short version that focuses only on key differences for experienced cooks
  - feedback on instructions, baking time, temperature, etc.
- Include ratings:
  - scoring system
  - effort rating
- Include optional tagging.
- Include photos.
- Key differentiators:
  - clear and easy iteration tracking
  - cleaner interface
  - consistent format for creation and upload
  - must support polished recipes and informal verbal directions
  - must not require exact measurements
  - should support aggregation/tabular views to avoid scattered notes

## Product Thesis

Recipe logging should make it easy to capture what someone actually cooked, not just force them into a polished recipe format. The feature should handle professional recipes, informal notes, rough memory, substitutions, photos, and iterative feedback in one consistent structure.

The differentiator is a flexible recipe record that supports both creation and upload, while making repeated iteration easy enough that users actually keep using it.

## Core User Stories

- As a cook, I can log a recipe even if I do not know exact measurements.
- As a cook, I can capture active time, passive time, servings, ingredients, instructions, ratings, tags, and photos.
- As a cook, I can record substitutions I tried and rate or annotate each version.
- As a cook, I can see ideas for future substitutions.
- As a cook, I can switch between detailed instructions and a shorter experienced-cook version.
- As a cook, I can leave feedback on timing, temperature, effort, and results after making the recipe.

## MVP Scope

- Recipe create/log form with flexible structured fields:
  - title
  - active time
  - passive time
  - servings
  - ingredients
  - instructions
  - notes
  - rating
  - effort rating
  - tags
  - photos
- Support approximate quantities and informal entries.
- Add substitution tracking for ingredients.
- Add version notes so a user can compare multiple attempts.
- Add a short-instructions field or AI-generated summary mode for experienced cooks.
- Add post-cook feedback fields for time, temperature, and outcome.

## Later Scope

- Beginner/intermediate/advanced instruction modes.
- AI conversion from loose notes into structured recipe format.
- Tabular recipe library view for comparing recipes.
- Aggregated substitution suggestions based on user history.
- Recipe templates for baking, weeknight meals, sauces, meal prep, etc.
- Photo timeline across versions.

## UX Notes

- The form must not feel like bookkeeping.
- It should accept "a splash", "until it looks right", and other rough cooking language without fighting the user.
- Users should be able to save partial/incomplete recipes.
- The same structure should support both imported recipes and recipes created from memory.
- The interface should make iteration visible without making every recipe feel like a project management task.

## Acceptance Criteria

- A user can create a recipe with only a title and rough notes.
- A user can optionally add time, servings, ingredients, instructions, ratings, tags, and photos.
- A user can record at least one substitution and attach notes to it.
- A user can add feedback after cooking the recipe.
- A user can save a recipe even when measurements are incomplete or approximate.
- A user can view the recipe in a clean, consistent format after saving.

## Open Questions

- Should short instructions be manually written, AI-generated, or both?
- What is the minimum recipe structure required before a recipe can be saved?
- Should photos attach to the recipe globally or to a specific version/attempt?
- Should effort rating be separate from taste/result rating?
- How much should tags be manual versus inferred?

## Suggested Ticket Breakdown

- Define recipe log data model.
- Build flexible recipe create form.
- Add approximate ingredient support.
- Add substitution/version notes.
- Add ratings and effort scoring.
- Add photo attachment support.
- Add read-only recipe detail view.
- Add short instruction mode.
