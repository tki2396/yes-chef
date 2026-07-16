# Build Plan: Foundation

Status: Draft
Scope: App foundation before feature-heavy ticket implementation

## Product Direction

Yes, Chef should start as a mobile-first responsive web app for capturing, importing, organizing, and iterating on recipes. The early build should prioritize a strong foundation: information architecture, data model, responsive shell, recipe primitives, and import/review workflow scaffolding.

The goal is not to build every feature immediately. The goal is to create a stable product base that makes later features like recipe genealogy, public repo, cooking with friends, and plate selling easier to add without reworking the core.

## Tech Stack Direction

- Frontend: React + TypeScript
- Styling: Tailwind CSS
- UI primitives: shadcn/ui-style components already present in repo
- Icons: lucide-react
- Routing: TanStack Router or React Router
- Forms: react-hook-form + zod
- Server/data layer: Supabase
- Database: Postgres
- Auth: Supabase Auth
- File storage: Supabase Storage
- AI/import processing: server-side functions, not client-side
- Testing: Vitest + React Testing Library first; Playwright later for main flows

## Foundation Principles

- Mobile-first, not mobile-only.
- Desktop should add density, comparison, and side-by-side workflows.
- Recipes should allow incomplete, approximate, informal data.
- The recipe model should support imports, manual creation, versions, notes, media, and future public sharing.
- Private-by-default should be the baseline.
- AI should assist structure and cleanup, but users should always be able to review/edit before saving.
- Avoid hard-coding future marketplace/social assumptions into the earliest schema.

## Phase 0: Repo/App Baseline

### Goals

- Turn the current template into a real app shell.
- Establish project structure and routing.
- Set visual direction and reusable layout primitives.
- Make mobile and desktop navigation intentional from the start.

### Work

- Remove template/demo UI from the app entry.
- Add app shell with:
  - mobile bottom navigation
  - desktop sidebar navigation
  - responsive main content region
  - top-level loading/error/empty states
- Add route structure:
  - `/`
  - `/recipes`
  - `/recipes/new`
  - `/recipes/:id`
  - `/import`
  - `/drafts/:id`
  - `/profile`
- Add design tokens for spacing, typography, surfaces, buttons, and form density.
- Create layout components:
  - `AppShell`
  - `MobileNav`
  - `DesktopSidebar`
  - `PageHeader`
  - `EmptyState`
  - `Section`

### Acceptance Criteria

- App opens to a real Yes, Chef interface, not the starter template.
- Navigation works on mobile and desktop widths.
- Mobile layout does not rely on desktop sidebars.
- Desktop layout does not look like a stretched phone screen.
- Core routes exist even if some pages are placeholders.

## Phase 1: Core Data Model

### Goals

- Define recipe primitives before building feature-specific UI.
- Support manual recipes, imports, versions, media, tags, ratings, and notes.

### Initial Entities

- `profiles`
- `recipes`
- `recipe_versions`
- `recipe_ingredients`
- `recipe_steps`
- `recipe_media`
- `recipe_imports`
- `recipe_tags`
- `recipe_version_tags`

### Key Model Decisions

- `recipes` represent the durable concept.
- `recipe_versions` represent actual attempts, variations, or imported/created versions.
- Ingredients and steps should belong to a version, not only the parent recipe.
- Media should be attachable to either recipe or version.
- Imports should create editable drafts before they become saved recipes.
- Visibility should exist early, but default to private.

### Acceptance Criteria

- Schema supports a recipe with multiple versions.
- Schema supports approximate ingredient amounts.
- Schema supports manual creation and import drafts.
- Schema supports private/public visibility even if public UI is not built yet.
- Schema supports photos/files through storage references.

## Phase 2: Responsive Recipe Library

### Goals

- Build the main place users land after opening the app.
- Make it useful with mock/local data first if backend is not connected yet.

### Work

- Recipe library list view for mobile.
- Richer list/grid/table-friendly layout for desktop.
- Search input.
- Basic filters:
  - tags
  - recent
  - favorites/saved
  - needs review
- Recipe card/list item component.
- Empty state that points to create/import.

### Acceptance Criteria

- Mobile library is scannable as a vertical list.
- Desktop library can show more metadata without feeling crowded.
- Users can reach create/import from empty and non-empty states.
- The recipe item component has stable responsive behavior.

## Phase 3: Recipe Create/Log Foundation

### Goals

- Build the core manual capture workflow.
- Support messy, incomplete recipes from day one.

### Work

- New recipe form with:
  - title
  - rough notes
  - active time
  - passive time
  - servings
  - ingredients
  - instructions
  - photos
  - rating
  - effort rating
  - tags
- Allow incomplete saves.
- Support approximate ingredient language.
- Add substitution/variation notes as a first-class section.
- Add mobile-friendly sectioned form layout.
- Add desktop grouped-panel layout.

### Acceptance Criteria

- User can save a recipe with only title and notes.
- User can add structured ingredients/steps when available.
- User can capture approximate quantities without validation friction.
- Form is usable on phone width.
- Saved recipe displays in a clean detail view.

## Phase 4: Recipe Detail Foundation

### Goals

- Build the durable recipe reading/cooking surface.
- Prepare for versioning and future genealogy.

### Work

- Recipe detail page.
- Mobile single-column layout.
- Desktop split layout:
  - metadata/ingredients
  - instructions/notes/versions
- Version/attempt list section.
- Source attribution section.
- Photos/media section.
- Actions:
  - edit
  - add version
  - import/source link
  - favorite/save

### Acceptance Criteria

- A saved recipe can be opened and read comfortably on mobile.
- Ingredients and steps are easy to scan while cooking.
- Desktop layout uses available space for context.
- Version area exists even if full branching is not yet implemented.

## Phase 5: Import and Review Scaffold

### Goals

- Create the workflow shape for importing recipes before optimizing source-specific parsing.
- Keep review/edit as the centerpiece.

### Work

- Import page with input types:
  - paste text
  - paste URL
  - upload image
  - upload PDF
  - rough/verbal notes
- Create import draft object.
- Review screen:
  - original content/source
  - parsed recipe fields
  - needs-review indicators
  - save as recipe
- On mobile, stack original and parsed content.
- On desktop, use side-by-side review.

### Acceptance Criteria

- User can paste text and create a recipe draft.
- User can review/edit before saving.
- Source attribution is preserved.
- Failed/partial parsing can still be saved as notes.
- UI supports future AI parsing without depending on it for the first usable version.

## Phase 6: Backend Connection

### Goals

- Connect the app to real persistence once core UX is shaped.
- Avoid overbuilding backend before the model stabilizes.

### Work

- Add Supabase project/config.
- Add database migrations.
- Add auth session handling.
- Add typed data access layer.
- Add storage bucket for recipe media/import uploads.
- Add row-level security policies:
  - private recipes only visible to owner
  - public recipes readable by others
  - drafts private to owner
- Replace mock/local data with Supabase queries/mutations.

### Acceptance Criteria

- User can sign in.
- User can create, view, and update private recipes.
- User can upload and view recipe media.
- Data persists across sessions.
- RLS prevents cross-user private data access.

## Phase 7: Quality Bar

### Goals

- Keep the foundation stable as features grow.

### Work

- Add component tests for forms and recipe display.
- Add data validation with zod.
- Add loading/error/empty state coverage.
- Add responsive smoke checks for main routes.
- Add seed/mock data for development.
- Add basic accessibility checks:
  - labels
  - focus states
  - keyboard navigation
  - contrast

### Acceptance Criteria

- Main app routes render without crashes.
- Recipe create flow has validation coverage.
- Mobile and desktop screenshots are checked before major UI changes.
- Form fields are labeled and keyboard accessible.

## Not Yet

These should be designed later, after the foundation is usable:

- Public recipe repo
- Recipe genealogy graph
- Social comments/forks
- Cooking with friends/local events
- Plate selling
- In-app payments
- Reputation/gamification
- Moderation tooling

## First Implementation Milestone

The first useful milestone should be:

- Real responsive app shell
- Recipe library placeholder
- Manual recipe create/log flow
- Recipe detail page
- Local/mock persistence or early Supabase persistence

This gives Yes, Chef a usable center before adding import intelligence, public sharing, or social features.

