# Draft: Eat or Cook With Friends/Local

Source ticket: `Eat or cook with friends/local`
Source board: `The what why`
Status: Draft for review; not yet copied into the Kanban ticket.

## Product Thesis

Food is more useful and more motivating when it becomes social. Yes, Chef can move beyond "what should I cook?" into "who can I cook or eat this with?" by helping users coordinate low-friction local meals around shared recipes, dietary preferences, availability, and trust boundaries.

The core challenge is not just discovery. It is safety, intent matching, and logistics.

## Core User Stories

- As a user, I can create a meal plan/event so friends know what I am cooking and when.
- As a user, I can invite selected friends to cook or eat with me.
- As a user, I can discover local food plans that match my preferences if they are public or friend-visible.
- As a user, I can specify dietary restrictions, allergies, cuisine interests, and comfort level.
- As a host, I can manage RSVPs, headcount, and contribution requests.
- As a guest, I can see what to bring, where to go, and what dietary info matters.

## MVP Scope

Start friend-first rather than public-local.

- Create a meal event from scratch or from a recipe.
- Event fields: title, recipe/menu, date/time, location text or TBD, invite list, max guests, dietary notes, contribution request.
- RSVP states: going, maybe, declined.
- Event visibility: private invite only, or friends can request.
- Simple event detail page with recipe/menu, participants, notes, and updates.

## Later Scope

- Public local events.
- Nearby discovery with distance controls.
- Trust graph: friends, friends-of-friends, verified hosts.
- Host/guest ratings or lightweight post-event feedback.
- Group grocery list and cost split.
- Cook together remotely mode.
- Integration with recipe genealogy so attendees can create their own branch after the meal.
- Calendar integration.

## Safety/Trust Considerations

- Public-local discovery should not be first unless there is a clear moderation and trust model.
- Locations should default to hidden until accepted/invited.
- Users need block/report controls before any public matching.
- Dietary and allergy data is sensitive and should have visibility controls.

## Data Model Notes

- `MealEvent`: host, title, optional recipe version, menu description, start time, location label, location visibility, max guests, visibility, dietary notes, contribution request.
- `MealInvite`: event, user, RSVP status, message.
- `MealPreference`: dietary restrictions, allergies, cuisines, social comfort.

## Acceptance Criteria

- A user can create a private meal event.
- A user can attach a recipe or write a freeform menu.
- A user can invite at least one other user.
- Invitees can RSVP.
- Event detail shows attendees, menu/recipe, date/time, dietary notes, and contribution request.
- Location can remain hidden or vague until the host chooses to share it.

## Open Questions

- Is the intended audience real-life friends, local strangers, or both?
- Should this be framed as events, cook sessions, dinner plans, or tables?
- Does Yes, Chef need identity verification before local public matching?
- Should guests be able to bring dishes, ingredients, money, or all three?
- How tightly should this connect to recipes versus being a general meal coordination feature?

## Suggested Ticket Breakdown

- Define meal event and invite schema.
- Build event creation form.
- Add recipe/menu attachment.
- Build invite and RSVP flow.
- Build event detail page.
- Add visibility/location privacy controls.
- Add dietary notes display.

