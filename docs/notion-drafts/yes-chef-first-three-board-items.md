# Yes, Chef: First Three Board Items Draft

Source board: Notion "Yes, Chef" -> "The what why"
Draft date: 2026-07-15
Status: review notes only; no Notion tickets updated yet.

## 1. Recipe Genealogy

### Raw Idea

Users should be able to save a recipe, adapt it, comment on what changed, optionally publish their version, and preserve a visible relationship back to the original. This is partly a personal recipe iteration tool and partly a public inspiration network.

### Product Thesis

Most recipe products treat recipes as static artifacts. Real cooking is iterative: substitutions, ingredient availability, dietary constraints, equipment differences, taste adjustments, and repeated attempts all matter. Recipe genealogy turns each adapted version into a branch with context, making "what changed and why" as important as the recipe itself.

This can also reduce reliance on scraped or paywalled recipe copies by encouraging users to store personal notes, diffs, summaries, substitutions, and attribution rather than wholesale reposts of protected content.

### Core User Stories

- As a cook, I can save a recipe to my personal library so I can make notes without publishing anything.
- As a cook, I can create an iteration of a saved recipe so I can track what I changed from the original.
- As a cook, I can document substitutions and outcomes so future me knows whether the change worked.
- As a cook, I can optionally publish my iteration so others can learn from it.
- As a cook, I can view a recipe's lineage so I can discover variations that solve a constraint I have right now.

### MVP Scope

- Save/import recipe shell with title, source URL, ingredients, steps, and private notes.
- "Create variation" action from an existing recipe.
- Variation fields:
  - changed ingredients
  - changed steps
  - reason for change
  - result/rating
  - notes for next time
- Parent-child relationship between original and variation.
- Basic lineage view:
  - original recipe
  - direct variations
  - user-created version highlighted
- Publish/private toggle for each variation.

### Later Scope

- Diff view between two recipe versions.
- Search/filter variations by ingredient substitution, cuisine, dietary need, rating, or equipment.
- "I am missing X" substitution discovery across public branches.
- Attribution model for original source and derived work.
- Version graph visualization.
- Comments on public variations.
- Fork/branch counts as social proof.

### Data Model Notes

- Recipe
  - id
  - title
  - source_url
  - source_author
  - original_import_type
  - owner_id
  - visibility
  - created_at
  - updated_at
- RecipeVersion
  - id
  - recipe_id
  - parent_version_id nullable
  - title
  - ingredients
  - steps
  - change_summary
  - substitution_notes
  - outcome_notes
  - rating
  - visibility
- RecipeAttribution
  - version_id
  - source_url
  - source_title
  - source_author
  - source_accessed_at

### Acceptance Criteria

- A user can create a private recipe from a source URL or manual entry.
- A user can create a variation from that recipe without overwriting the original.
- A variation records at least one change note and one outcome note.
- The app displays the original and its variations together.
- Published variations are visible to other users; private variations are not.
- The UI makes attribution/source visible when a recipe has an external origin.

### Open Questions

- Is this primarily a personal version history feature, a social feature, or both from day one?
- Should importing copy the full recipe text, or should it store structured notes plus a source link to reduce copyright risk?
- What is the minimum useful lineage UI: list, tree, or visual graph?
- Should users be able to branch from another user's public branch?
- How much moderation is needed if public recipe variations are enabled?

### Suggested Ticket Breakdown

- Define recipe and recipe version schema.
- Build private recipe create/save flow.
- Add "create variation" flow.
- Add variation notes fields.
- Render parent recipe plus direct variations.
- Add private/public visibility toggle.
- Add basic attribution/source display.

## 2. Eat or Cook With Friends/Local

### Raw Idea

This board item had no existing notes. I am interpreting it as a local/social food coordination feature: users can find people nearby to cook with, eat with, host, attend, or coordinate informal meals.

### Product Thesis

Food is more useful and more motivating when it becomes social. Yes, Chef can move beyond "what should I cook?" into "who can I cook/eat this with?" by helping users coordinate low-friction local meals around shared recipes, dietary preferences, availability, and trust boundaries.

The core challenge is not just discovery. It is safety, intent matching, and logistics.

### Core User Stories

- As a user, I can create a meal plan/event so friends know what I am cooking and when.
- As a user, I can invite selected friends to cook or eat with me.
- As a user, I can discover local food plans that match my preferences if they are public or friend-visible.
- As a user, I can specify dietary restrictions, allergies, cuisine interests, and comfort level.
- As a host, I can manage RSVPs, headcount, and contribution requests.
- As a guest, I can see what to bring, where to go, and what dietary info matters.

### MVP Scope

Start friend-first rather than public-local.

- Create a meal event from scratch or from a recipe.
- Event fields:
  - title
  - recipe or menu
  - date/time
  - location text or "TBD"
  - invite list
  - max guests
  - dietary notes
  - contribution request
- RSVP states:
  - going
  - maybe
  - declined
- Event visibility:
  - private invite only
  - friends can request
- Simple event detail page with recipe/menu, participants, notes, and updates.

### Later Scope

- Public local events.
- Nearby discovery with distance controls.
- Trust graph: friends, friends-of-friends, verified hosts.
- Host/guest ratings or lightweight post-event feedback.
- Group grocery list and cost split.
- "Cook together remotely" mode.
- Integration with recipe genealogy: attendees can create their own branch after the meal.
- Calendar integration.

### Safety/Trust Considerations

- Public-local discovery should not be first unless there is a clear moderation and trust model.
- Locations should default to hidden until accepted/invited.
- Users need block/report controls before any public matching.
- Dietary and allergy data is sensitive and should have visibility controls.

### Data Model Notes

- MealEvent
  - id
  - host_id
  - title
  - recipe_version_id nullable
  - menu_description
  - starts_at
  - location_label
  - location_visibility
  - max_guests
  - visibility
  - dietary_notes
  - contribution_request
- MealInvite
  - event_id
  - user_id
  - status
  - message
- MealPreference
  - user_id
  - dietary_restrictions
  - allergies
  - cuisines
  - social_comfort

### Acceptance Criteria

- A user can create a private meal event.
- A user can attach a recipe or write a freeform menu.
- A user can invite at least one other user.
- Invitees can RSVP.
- Event detail shows attendees, menu/recipe, date/time, dietary notes, and contribution request.
- Location can remain hidden or vague until the host chooses to share it.

### Open Questions

- Is the intended audience real-life friends, local strangers, or both?
- Should this be framed as "events", "cook sessions", "dinner plans", or "tables"?
- Does Yes, Chef need identity verification before local public matching?
- Should guests be able to bring dishes, ingredients, money, or all three?
- How tightly should this connect to recipes versus being a general meal coordination feature?

### Suggested Ticket Breakdown

- Define meal event and invite schema.
- Build event creation form.
- Add recipe/menu attachment.
- Build invite and RSVP flow.
- Build event detail page.
- Add visibility/location privacy controls.
- Add dietary notes display.

## 3. Plate Selling

### Raw Idea

This board item had no existing notes. I am interpreting it as a way for users to sell individual prepared plates/meals, likely from home cooks or small local sellers.

### Product Thesis

Plate selling can turn cooking activity into lightweight commerce: a cook makes a limited batch, lists available plates, and nearby buyers reserve or buy them. This is high-potential but operationally and legally heavier than the first two items because it touches payments, food safety, local cottage food rules, pickup/delivery logistics, refunds, and trust.

This should probably start as a controlled/manual marketplace experiment before full platformization.

### Core User Stories

- As a cook, I can list a limited number of plates for a dish I am making.
- As a buyer, I can see what is available nearby and reserve a plate.
- As a cook, I can set price, quantity, pickup window, allergens, and dietary tags.
- As a buyer, I can pay or reserve depending on the transaction model.
- As a cook, I can mark plates as sold out, fulfilled, or cancelled.
- As a buyer, I can see seller trust signals before ordering.

### MVP Scope

Start with preorder/reservation, not full marketplace payments, unless payment is a core near-term goal.

- Seller creates a plate listing:
  - dish name
  - photos
  - description
  - price
  - quantity available
  - pickup window
  - general location
  - allergens
  - dietary tags
  - cancellation policy
- Buyer can reserve a quantity.
- Seller can accept/decline reservation.
- Buyer and seller receive status updates.
- Manual payment instructions or external payment link for early validation.
- Listing expires automatically after pickup window.

### Later Scope

- In-app payments and payouts.
- Delivery coordination.
- Seller onboarding and verification.
- Ratings/reviews.
- Repeat seller storefronts.
- Batch cooking planner.
- Inventory and ingredient cost estimation.
- Compliance flows by city/state.
- Tax reporting and platform fees.

### Legal/Operational Risk Notes

- Home-cooked food sales are regulated differently by location.
- Some jurisdictions allow cottage foods but restrict perishable prepared meals.
- Allergen disclosure must be explicit.
- The app should avoid implying safety guarantees it cannot enforce.
- If payments are handled in-app, refunds, chargebacks, seller payouts, tax, and KYC become required concerns.

### Data Model Notes

- PlateListing
  - id
  - seller_id
  - recipe_version_id nullable
  - title
  - description
  - photos
  - price_cents
  - currency
  - quantity_available
  - pickup_starts_at
  - pickup_ends_at
  - location_label
  - location_visibility
  - allergens
  - dietary_tags
  - status
- PlateReservation
  - id
  - listing_id
  - buyer_id
  - quantity
  - status
  - buyer_note
  - seller_note
- SellerProfile
  - user_id
  - display_name
  - service_area
  - verification_status
  - policy_acknowledgements

### Acceptance Criteria

- A seller can create a plate listing with price, quantity, pickup window, and allergen notes.
- A buyer can reserve one or more plates.
- Quantity decreases or becomes unavailable when reservations are accepted.
- Seller can accept, decline, cancel, or mark fulfilled.
- Expired listings no longer appear as available.
- The UI clearly shows that local laws and allergen responsibility matter.

### Open Questions

- Is this intended for home cooks, professional chefs, restaurants, or all of the above?
- Should payments be in-app at MVP, or should MVP validate demand with reservations only?
- What geography matters first: one city, campus, neighborhood, or general local radius?
- What trust/safety bar is required before strangers can transact?
- Are sellers expected to use recipes from Yes, Chef, or can they list any dish?

### Suggested Ticket Breakdown

- Define plate listing and reservation schema.
- Build seller listing creation flow.
- Build buyer browse/detail/reserve flow.
- Add seller reservation management.
- Add listing expiration and sold-out states.
- Add allergen and policy disclosure UI.
- Decide payment approach before implementation.

## Cross-Feature Notes

- Recipe genealogy is the best foundational feature of the three. It strengthens the core recipe graph and can support both social meals and plate listings later.
- Eat/cook with friends should start friend-first. Public local discovery needs trust and safety work.
- Plate selling has the highest business upside but also the highest legal and operational load. A reservation-only MVP is the safest validation step.
- A possible product arc:
  - save/adapt recipes
  - cook them with people
  - eventually sell limited plates from trusted cooks

