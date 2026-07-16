# Draft: Crowd Sourced Repo

Source ticket: `Crowd sourced repo`
Source board: `The what why`
Status: Draft for review; not yet copied into the Kanban ticket.

## Existing Ticket Notes

To get around paywalls and potential copyright issues, Yes, Chef should build a massive repository of recipes from individual users.

Core question from the ticket: how do we incentivize recipe upload?

## Product Thesis

Yes, Chef can build a large recipe repository by encouraging individual users to contribute their own recipes, adaptations, notes, and cooking outcomes. This helps reduce dependence on scraped, paywalled, or copyrighted recipe sources while creating a living collection grounded in real user experience.

The key product question is incentive design: why would users upload recipes, improve them, and make them public?

## Core User Stories

- As a user, I can publish one of my recipes or recipe versions to the shared repo.
- As a user, I can keep recipes private unless I explicitly choose to publish.
- As a user, I can get credit for recipes and useful variations I contribute.
- As a user, I can discover recipes from other real cooks.
- As a user, I can see signals that help me trust a recipe: ratings, make count, comments, photos, and successful substitutions.
- As a user, I can fork/adapt public recipes into my own private or public version.

## MVP Scope

- Public/private recipe visibility.
- Public recipe detail pages.
- Contributor attribution.
- Basic discovery/search over public recipes.
- Lightweight contribution signals:
  - saves
  - ratings
  - cooked/made count
  - photos
  - comments or notes
- Fork/save-to-my-library action.

## Incentive Ideas

- Personal utility first: users upload because it improves their own recipe library.
- Social credit: contributor profile, recipe attribution, public version history.
- Feedback loop: users get comments, saves, ratings, and successful substitution reports.
- Progression: badges or stats for recipes published, cooked by others, improved, or forked.
- Practical payoff: public uploads make it easier to share with friends or reuse in meal events.

## Later Scope

- Reputation system for contributors.
- Featured community recipes.
- Moderation queue and reporting.
- Recipe collections/playlists.
- Community challenges.
- Revenue share or tipping if the product later supports commerce.
- Import-to-public flow with stronger attribution and copyright checks.

## Copyright/Policy Notes

- Encourage original recipes, personal adaptations, notes, and summaries.
- Preserve source attribution when a recipe is inspired by an external source.
- Avoid positioning the repo as a way to republish paywalled recipes.
- Consider requiring enough original commentary or adaptation before publishing imported recipes.

## Acceptance Criteria

- A user can publish a recipe from their library.
- A user can keep recipes private by default.
- Public recipes show contributor attribution.
- Other users can save/fork a public recipe into their own library.
- Public recipes can be searched or browsed.
- Public recipes include at least one trust signal such as rating, save count, or made count.

## Open Questions

- What is the strongest initial incentive for uploading: personal organization, social credit, sharing, or gamification?
- Should all public recipes require review/moderation?
- How should the app distinguish original recipes from adaptations?
- Should users be allowed to publish imported recipes?
- What contribution metrics actually matter for trust?

## Suggested Ticket Breakdown

- Add recipe visibility model.
- Build publish/unpublish flow.
- Build public recipe detail page.
- Add contributor attribution.
- Add public recipe search/browse.
- Add save/fork action.
- Add basic trust signals.
- Define publishing policy for imported/adapted recipes.
