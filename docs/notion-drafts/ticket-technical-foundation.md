# Technical Foundation

## Goal

Create the app foundation before building feature-heavy recipe workflows. This ticket should establish the responsive shell, routing, project structure, design primitives, and initial data model decisions that later tickets can build on.

## Product Direction

Yes, Chef should start as a mobile-first responsive web app for capturing, importing, organizing, and iterating on recipes. Mobile should be the default design constraint, while desktop should add density, comparison, and side-by-side workflows.

## Initial Scope

- Remove starter/demo UI from the current app.
- Add a real Yes, Chef app shell.
- Add mobile bottom navigation.
- Add desktop sidebar navigation.
- Add responsive main content layout.
- Add initial route structure:
  - `/`
  - `/recipes`
  - `/recipes/new`
  - `/recipes/:id`
  - `/import`
  - `/drafts/:id`
  - `/profile`
- Add reusable layout primitives:
  - `AppShell`
  - `MobileNav`
  - `DesktopSidebar`
  - `PageHeader`
  - `EmptyState`
  - `Section`
- Establish design tokens for spacing, typography, surfaces, buttons, and form density.
- Define initial frontend folder structure.
- Add placeholder pages for core routes.

## Data Foundation

Document the initial recipe data model, even if persistence is not implemented in this ticket:

- `profiles`
- `recipes`
- `recipe_versions`
- `recipe_ingredients`
- `recipe_steps`
- `recipe_media`
- `recipe_imports`
- `recipe_tags`
- `recipe_version_tags`

Key decisions:

- `recipes` represent the durable recipe concept.
- `recipe_versions` represent attempts, variations, imports, and edited versions.
- Ingredients and steps belong to a version.
- Imports should create editable drafts before becoming saved recipes.
- Recipes should be private by default.

## Acceptance Criteria

- App opens to a real Yes, Chef interface, not the starter template.
- Mobile and desktop navigation both exist and are intentionally different.
- Core routes exist, even if some pages are placeholders.
- App layout is usable at phone width and desktop width.
- Placeholder recipe library, create recipe, import, and profile pages exist.
- Shared layout components are created and used by the routes.
- Initial data model notes are documented in the repo or a project planning doc.

## Out of Scope

- Full recipe create/log implementation.
- Recipe import parsing.
- Supabase integration.
- Auth.
- Public recipe repo.
- Recipe genealogy.
- Social/local features.
- Plate selling.

## Notes

This ticket is intentionally foundation-first. It should make the app feel like the beginning of Yes, Chef without locking in every future feature.

