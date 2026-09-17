@AGENTS.md

# Claude Code Workflow

These instructions replace the `Codex workflow` section of `AGENTS.md` when working in Claude Code.

- Do not require the user to clone the repository, run commands, start a development server, or test through a local network address.
- Complete one focused, reviewable task on a feature branch.
- For UI changes, run the app and inspect the affected flow with browser tools when they are available. Include useful screenshots in the session or pull request so a mobile reviewer can assess the result.
- If browser tools are unavailable, say so clearly and rely on the automated checks instead of asking the user to configure a local environment.
- Run the required tests, TypeScript check, and production build before handoff.
- When the checks pass, commit the changes, push the branch, and open or update a pull request automatically.
- Never push directly to `main`.
- Give the user a plain-language summary, useful screenshots when available, the pull-request link, verification results, and anything that still requires human judgment.
- Do not merge the pull request until the user explicitly confirms the merge in the current conversation. The original task request is not merge approval.
- After explicit confirmation, wait for required checks to pass, merge the pull request through GitHub, and report the result in the conversation. If permissions or branch protection prevent the merge, explain the blocker without asking the user to use GitHub manually.
