# Draft: Plate Selling

Source ticket: `Plate selling`
Source board: `The what why`
Status: Draft for review; not yet copied into the Kanban ticket.

## Product Thesis

Plate selling can turn cooking activity into lightweight commerce: a cook makes a limited batch, lists available plates, and nearby buyers reserve or buy them. This is high-potential but operationally and legally heavier than the first two items because it touches payments, food safety, local cottage food rules, pickup/delivery logistics, refunds, and trust.

This should probably start as a controlled/manual marketplace experiment before full platformization.

## Core User Stories

- As a cook, I can list a limited number of plates for a dish I am making.
- As a buyer, I can see what is available nearby and reserve a plate.
- As a cook, I can set price, quantity, pickup window, allergens, and dietary tags.
- As a buyer, I can pay or reserve depending on the transaction model.
- As a cook, I can mark plates as sold out, fulfilled, or cancelled.
- As a buyer, I can see seller trust signals before ordering.

## MVP Scope

Start with preorder/reservation, not full marketplace payments, unless payment is a core near-term goal.

- Seller creates a plate listing with dish name, photos, description, price, quantity, pickup window, general location, allergens, dietary tags, and cancellation policy.
- Buyer can reserve a quantity.
- Seller can accept or decline reservation.
- Buyer and seller receive status updates.
- Manual payment instructions or external payment link for early validation.
- Listing expires automatically after pickup window.

## Later Scope

- In-app payments and payouts.
- Delivery coordination.
- Seller onboarding and verification.
- Ratings/reviews.
- Repeat seller storefronts.
- Batch cooking planner.
- Inventory and ingredient cost estimation.
- Compliance flows by city/state.
- Tax reporting and platform fees.

## Legal/Operational Risk Notes

- Home-cooked food sales are regulated differently by location.
- Some jurisdictions allow cottage foods but restrict perishable prepared meals.
- Allergen disclosure must be explicit.
- The app should avoid implying safety guarantees it cannot enforce.
- If payments are handled in-app, refunds, chargebacks, seller payouts, tax, and KYC become required concerns.

## Data Model Notes

- `PlateListing`: seller, optional recipe version, title, description, photos, price, quantity, pickup window, location label, location visibility, allergens, dietary tags, status.
- `PlateReservation`: listing, buyer, quantity, status, buyer note, seller note.
- `SellerProfile`: display name, service area, verification status, policy acknowledgements.

## Acceptance Criteria

- A seller can create a plate listing with price, quantity, pickup window, and allergen notes.
- A buyer can reserve one or more plates.
- Quantity decreases or becomes unavailable when reservations are accepted.
- Seller can accept, decline, cancel, or mark fulfilled.
- Expired listings no longer appear as available.
- The UI clearly shows that local laws and allergen responsibility matter.

## Open Questions

- Is this intended for home cooks, professional chefs, restaurants, or all of the above?
- Should payments be in-app at MVP, or should MVP validate demand with reservations only?
- What geography matters first: one city, campus, neighborhood, or general local radius?
- What trust/safety bar is required before strangers can transact?
- Are sellers expected to use recipes from Yes, Chef, or can they list any dish?

## Suggested Ticket Breakdown

- Define plate listing and reservation schema.
- Build seller listing creation flow.
- Build buyer browse/detail/reserve flow.
- Add seller reservation management.
- Add listing expiration and sold-out states.
- Add allergen and policy disclosure UI.
- Decide payment approach before implementation.

