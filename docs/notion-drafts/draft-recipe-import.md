# Draft: Recipe Import

Source ticket: `Recipe import`
Source board: `The what why`
Status: Draft for review; not yet copied into the Kanban ticket.

## Existing Ticket Notes

Sources to consider and accommodate:

- YouTube
- PDF
- Reddit
- Photos
- Notes app
- Handwritten notes
- Verbal directions

## Product Thesis

Recipe import should let users bring cooking knowledge into Yes, Chef from wherever it already lives: YouTube, PDFs, Reddit, photos, notes apps, handwritten notes, and verbal directions. The feature should normalize messy input into the same flexible recipe structure used by Recipe Log/Create.

The value is reducing friction. Users should not need to manually rewrite recipes before Yes, Chef becomes useful.

## Core User Stories

- As a cook, I can import a recipe from a URL, PDF, image, text note, or pasted content.
- As a cook, I can import from informal sources like Reddit comments, notes app text, handwritten notes, or verbal directions.
- As a cook, I can review and correct the parsed recipe before saving.
- As a cook, I can preserve the original source for attribution and later reference.
- As a cook, I can save imperfect imports and clean them up later.

## MVP Scope

- Import entry points:
  - paste URL
  - paste text
  - upload photo
  - upload PDF
  - manual transcription/verbal note text
- Parse imported content into:
  - title
  - ingredients
  - instructions
  - time
  - servings
  - notes
  - source
- Review screen before saving.
- Confidence/needs-review state for uncertain fields.
- Save into the same recipe model as Recipe Log/Create.

## Later Scope

- YouTube transcript extraction and recipe structuring.
- Handwriting OCR improvements.
- Multi-image import for cookbook pages or handwritten cards.
- Browser/share extension.
- Import from Notes app or clipboard.
- Duplicate detection.
- Paywall/copyright-safe import modes that store attribution and personal notes without copying protected text wholesale.

## UX Notes

- Imports should be editable before save.
- The parser should show uncertainty rather than silently making bad assumptions.
- Users should be able to keep the original source attached.
- The import path should be forgiving: capture now, clean later.

## Acceptance Criteria

- A user can paste a recipe URL and receive a structured draft recipe.
- A user can paste plain text and receive a structured draft recipe.
- A user can upload a photo or PDF and receive a structured draft recipe where possible.
- A user can edit parsed fields before saving.
- The saved recipe includes source attribution when available.
- Failed or partial imports still allow the user to save raw notes.

## Open Questions

- Which source should be supported first: URL, text paste, photo, PDF, YouTube, or handwritten notes?
- Should YouTube import depend on transcript availability?
- What should happen when imported content is copyrighted or paywalled?
- Should the app store original source files/images?
- What level of parse accuracy is acceptable for MVP?

## Suggested Ticket Breakdown

- Define import pipeline and normalized recipe draft format.
- Build paste text import.
- Build URL import.
- Build review/edit screen.
- Add source attribution fields.
- Add photo/PDF upload path.
- Add partial import fallback.
- Connect imports to recipe create/save flow.
