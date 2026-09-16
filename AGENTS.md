# Yes, Chef Agent Instructions

## Product tracker

- Treat the Today tab in `src/pages/HomePage.tsx` as the human-facing source of truth for project status and build order.
- Read the Today tab before choosing or planning the next piece of work.
- Update the Today tab in the same change whenever feature, foundation, or roadmap work changes what is done, current, next, or intentionally deferred.
- Keep tracker language understandable to someone who never reads the code. Describe user-visible capabilities and limitations, not implementation details alone.
- Keep the local-versus-deployed boundary accurate. GitHub Pages is a static preview and cannot run the local API or SQLite database.

## Product direction

- Build the private, local-first recipe core before cloud, public, marketplace, or social features.
- Recipes must support incomplete notes, approximate measurements, substitutions, and multiple versions.
- Keep recipes private by default.
- Imports must remain editable and reviewable before they become saved recipes.
- Photo and screenshot import comes before pasted-text import in the current plan.

## Shared working agreement

- Use one focused branch and pull request per reviewable piece of work.
- Stop after opening or updating the pull request and ask before starting the next planned task.
- Preserve unrelated local changes and never rewrite shared history.

## Codex workflow

- Do not commit until the maintainer has tested the change locally and explicitly approves it.
- After approval, commit, push, and open or update the pull request.
- Never merge a pull request automatically.
- The maintainer handles browser testing. Do not start or replace an existing development server unless asked.

## Technical baseline

- Use Bun for dependencies, scripts, tests, builds, and the application server.
- Use the existing React, TypeScript, Tailwind, Zod, and `bun:sqlite` patterns unless a task explicitly changes the architecture.
- Use `appPath()` for internal browser navigation so local and GitHub Pages base paths both work.
- Do not add cloud services, authentication, or hosted persistence without explicit approval.
- Before handing work over for review, run:
  - `bun test`
  - `bunx tsc --noEmit`
  - `bun run build`
