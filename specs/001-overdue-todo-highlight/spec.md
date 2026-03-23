# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-highlight`  
**Created**: 2026-03-23  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items — users need a clear, visual way to identify which todos have not been completed by their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Overdue Indicator (Priority: P1)

A user opens the todo list and can immediately tell, at a glance, which incomplete tasks are past their due date. Each overdue item is visually distinguished — through colour and/or a label — so the user does not need to read or compare dates manually.

**Why this priority**: This is the core value of the feature. Without this visual signal, the entire feature does not exist. It is the minimum deliverable that provides immediate user benefit.

**Independent Test**: Can be fully tested by creating an incomplete todo with a due date in the past, then viewing the list — the item must show an overdue indicator. No other user stories are required to verify this.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date of yesterday, **When** the user views the todo list, **Then** the todo displays a clear overdue indicator (visual styling and/or label).
2. **Given** an incomplete todo with a due date of today, **When** the user views the todo list, **Then** the todo does NOT display an overdue indicator.
3. **Given** an incomplete todo with a due date one month in the future, **When** the user views the todo list, **Then** the todo does NOT display an overdue indicator.
4. **Given** an overdue todo, **When** the user marks it as complete, **Then** the overdue indicator disappears immediately.

---

### User Story 2 - No False Overdue on Completed or Dateless Items (Priority: P2)

A user who has completed tasks or tasks without due dates does not see confusing overdue indicators on those items. Completed todos are never flagged as overdue, and todos with no due date are never flagged as overdue.

**Why this priority**: Showing false overdue signals on completed or undated items would undermine trust in the feature and create confusion. This correctness guarantee must ship with or immediately after P1.

**Independent Test**: Can be fully tested by creating (a) a completed todo with a past due date and (b) an incomplete todo with no due date, then verifying neither shows an overdue indicator. Delivers the value of "accurate overdue status with no false positives."

**Acceptance Scenarios**:

1. **Given** a completed todo with a due date in the past, **When** the user views the todo list, **Then** the todo does NOT display an overdue indicator.
2. **Given** an incomplete todo with no due date, **When** the user views the todo list, **Then** the todo does NOT display an overdue indicator.
3. **Given** an overdue todo, **When** the user updates its due date to a future date, **Then** the overdue indicator disappears immediately.

---

### User Story 3 - Overdue Status Reflects Current Date on Each Visit (Priority: P3)

A user who returns to the application on a later day sees that items which were not previously overdue (but whose due dates have now passed and are still incomplete) are correctly displayed as overdue, without requiring any manual refresh or re-save.

**Why this priority**: The overdue calculation must always be relative to the current date. Without this, the feature degrades silently over time. This story confirms temporal accuracy and is independently testable by simulating a date change.

**Independent Test**: Can be fully tested by loading the todo list on a day after a todo's due date has passed — the item must show the overdue indicator even if it did not on a prior session.

**Acceptance Scenarios**:

1. **Given** an incomplete todo whose due date was tomorrow during the previous session but is now yesterday, **When** the user loads the todo list, **Then** the todo displays the overdue indicator.
2. **Given** the user has the todo list open and a todo's due date passes at midnight, **When** the user refreshes the page, **Then** the overdue indicator appears on the now-overdue item.

---

### Edge Cases

- **Due date is today**: A todo with a due date matching today's date is NOT considered overdue. Overdue means strictly before today.
- **Due date just updated**: If a user edits an overdue item's due date to a future date, the overdue indicator must disappear without requiring a full page reload.
- **Item completed inline**: Marking an overdue item as complete must remove the overdue indicator immediately in the same interaction.
- **No due date set**: Items without a due date are never overdue, regardless of when they were created.
- **All items overdue**: If every item in the list is overdue, all items should be consistently marked — there is no "relative" overdue; each item is evaluated independently.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display an overdue indicator on any incomplete todo item whose due date is strictly before the current date.
- **FR-002**: The system MUST NOT display an overdue indicator on any completed todo item, regardless of its due date.
- **FR-003**: The system MUST NOT display an overdue indicator on any todo item that has no due date.
- **FR-004**: The overdue indicator MUST use the Danger colour from the design system and MUST include a non-colour cue (text label, icon, or both) so the indicator is accessible to colour-blind users.
- **FR-005**: The overdue indicator MUST appear in both light and dark display modes, using the appropriate Danger colour token for each mode.
- **FR-006**: The overdue status MUST be evaluated relative to the current date at page-load time — a todo that becomes overdue between sessions MUST appear overdue on the next page load.
- **FR-007**: When a user marks an overdue item as complete, the overdue indicator MUST disappear immediately without requiring a page reload.
- **FR-008**: When a user updates the due date of an overdue item to a future date, the overdue indicator MUST disappear immediately without requiring a page reload.
- **FR-009**: Overdue items MUST remain in their existing creation-date order within the list — no separate sorting, grouping, or filtering by overdue status is required.

### Key Entities

- **Todo Item**: Existing entity representing a task. Gains an implicit, computed **overdue** state: `dueDate is set AND dueDate < today AND isCompleted = false`. This state is derived; it is not a stored field.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can identify all overdue incomplete todos within 5 seconds of viewing the todo list, without reading or comparing individual date values.
- **SC-002**: Zero incomplete todos with a past due date are displayed without an overdue indicator; zero completed or dateless todos are displayed with an overdue indicator (100 % accuracy, no false positives or false negatives).
- **SC-003**: The overdue indicator is visually distinct in both light and dark modes and is discernible without relying on colour alone (passes basic accessibility check using a text label or icon).
- **SC-004**: When an overdue item is marked complete or its due date is updated to the future, the overdue indicator disappears in the same user interaction — no additional navigation or reload required.

## Assumptions

- "Today" is the calendar date in the user's local timezone as reported by the browser.
- Overdue is defined as `dueDate < today` (exclusive — a todo due today is not yet overdue).
- No server-side overdue flag is stored; the state is computed client-side at render time using the existing `dueDate` field.
- The existing `TodoCard` component is the correct place to apply the overdue visual treatment.
- No notifications, alerts, or emails are in scope — only in-list visual distinction.

