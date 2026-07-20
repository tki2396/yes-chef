# Technical Foundation Notes

This document captures early implementation decisions for the foundation ticket.

## Recipe Model Direction

- `recipes` represent the durable recipe concept.
- `recipe_versions` represent attempts, imports, edits, and variations.
- Ingredients and steps belong to a recipe version so each attempt can differ.
- Recipes should be private by default.
- Imports should become reviewable drafts before being saved as recipes.
- Approximate ingredient language should be valid input, not an error state.

## Current Slice

- Mock recipe primitives live in `src/types/recipe.ts`.
- Mock data lives in `src/data/mockRecipes.ts`.
- The library and detail pages are now wired to these primitives without backend persistence.

## Out Of Scope For This Slice

- Supabase schema/migrations.
- Auth.
- Mutations or saved form state.
- Real import parsing.
- Public recipe repo.
