---
description: "Task list for 001-overdue-todo-highlight"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-highlight/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Tests are REQUIRED by the project constitution (Principle II — Test-Driven Quality).
Every user story includes test tasks. Write tests first, verify they FAIL, then implement.

**Organization**: Tasks are grouped by user story to enable independent verification of each story.
All three user stories share the same implementation in `TodoCard.js` — US2 and US3 are validated
exclusively through tests; no additional implementation code is needed beyond US1.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (no dependency on an incomplete sibling task)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Verify the baseline test suite is green before any changes are made.

- [ ] T001 Run existing frontend tests and confirm they all pass: `cd packages/frontend && npm test -- --watchAll=false`

**Checkpoint**: All existing tests pass. Safe to begin implementation.

---

## Phase 2: Foundational (CSS Token — Blocking Prerequisite)

**Purpose**: Add the `.overdue-badge` CSS rule that all three user stories depend on.
This must be done before the badge JSX is rendered in any user story.

⚠️ **CRITICAL**: No user story work can begin until T002 is complete.

- [ ] T002 Add `.overdue-badge` CSS rule using design-system tokens to `packages/frontend/src/App.css`

  ```css
  .overdue-badge {
    display: inline-block;
    padding: 2px var(--space-xs);
    background-color: var(--danger-color);
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    border-radius: var(--radius-sm);
    margin-top: 4px;
  }
  ```

**Checkpoint**: Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 — Visual Overdue Indicator (Priority: P1) 🎯 MVP

**Goal**: An incomplete todo with a past due date shows an "Overdue" text badge near the due date.

**Independent Test**: Create a todo with `dueDate = '2020-01-01'` and `completed = 0`, render
`TodoCard`, and assert `screen.getByText('Overdue')` is in the document.

### Tests for User Story 1 ⚠️ Write FIRST — verify they FAIL before T005

- [ ] T003 [US1] Write test "shows Overdue badge for incomplete todo with past due date" in `packages/frontend/src/components/__tests__/TodoCard.test.js` inside a new `describe('overdue indicator', ...)` block
- [ ] T004 [US1] Write test "shows Overdue badge that disappears after todo is re-rendered as completed" in `packages/frontend/src/components/__tests__/TodoCard.test.js` (render once with `completed: 0`, re-render with `completed: 1`, assert badge absent)

### Implementation for User Story 1

- [ ] T005 [US1] Add `isOverdue` derived boolean and `<span className="overdue-badge">` JSX to `packages/frontend/src/components/TodoCard.js` (depends on T003, T004 failing first)

  Place before the `return` of the normal (non-editing) render path:
  ```javascript
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isOverdue = !todo.completed && todo.dueDate && todo.dueDate < todayStr;
  ```

  Inside `todo-content` div, after the `todo-due-date` paragraph:
  ```jsx
  {isOverdue && (
    <span className="overdue-badge" aria-label="Overdue">Overdue</span>
  )}
  ```

**Checkpoint**: US1 is fully functional and independently testable. T003 and T004 must now pass.

---

## Phase 4: User Story 2 — No False Overdue on Completed or Dateless Items (Priority: P2)

**Goal**: Verify the `isOverdue` expression correctly produces `false` for all non-overdue cases.
No additional implementation code is required — the expression from T005 already handles these.

**Independent Test**: Render `TodoCard` with (a) `completed: 1, dueDate: '2020-01-01'` and (b)
`completed: 0, dueDate: null`, and assert `screen.queryByText('Overdue')` returns null in both cases.

### Tests for User Story 2 ⚠️ Write FIRST — verify they FAIL (if T005 not yet implemented), then pass after T005

- [ ] T006 [P] [US2] Write test "does NOT show badge for completed todo with past due date" in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T007 [P] [US2] Write test "does NOT show badge for incomplete todo with no due date" in `packages/frontend/src/components/__tests__/TodoCard.test.js`

### Verification for User Story 2

- [ ] T008 [US2] Confirm T006 and T007 pass with the `isOverdue` expression from T005 in `packages/frontend/src/components/TodoCard.js`. If any test fails, adjust the `isOverdue` expression to satisfy the truth table in `data-model.md`.

**Checkpoint**: US2 passes. Zero false positives on completed or dateless items confirmed.

---

## Phase 5: User Story 3 — Overdue Status Reflects Current Date on Each Visit (Priority: P3)

**Goal**: Verify that `isOverdue` uses the local-timezone date (not UTC) and that a todo due today
is NOT overdue (strict less-than comparison).

**Independent Test**: Render `TodoCard` with `dueDate` set to today's ISO string and assert the
badge is absent. Render with `dueDate = '2020-01-01'` (always past) and assert badge is present.

### Tests for User Story 3 ⚠️ Write FIRST — verify they FAIL, then pass after T005

- [ ] T009 [P] [US3] Write test "does NOT show badge when dueDate equals today's local date" in `packages/frontend/src/components/__tests__/TodoCard.test.js` (compute `todayStr` in the test using the same local-timezone logic, then assert `queryByText('Overdue')` is null)
- [ ] T010 [P] [US3] Write test "shows badge for incomplete todo with reliably future past date 2020-01-01 (confirms page-load evaluation)" in `packages/frontend/src/components/__tests__/TodoCard.test.js`

### Verification for User Story 3

- [ ] T011 [US3] Confirm T009 and T010 pass. Verify `todayStr` in `TodoCard.js` uses `getFullYear/getMonth/getDate` (local timezone) not `toISOString()` (UTC) in `packages/frontend/src/components/TodoCard.js`. No code change expected; update if test T009 fails.

**Checkpoint**: US3 passes. Temporal accuracy and strict less-than comparison confirmed.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T012 Run full frontend test suite with coverage and confirm ≥ 80% and all tests green: `cd packages/frontend && npm test -- --watchAll=false --coverage`
- [ ] T013 [P] Manually verify badge displays in both light and dark modes by toggling the theme toggle in the running app (`npm run start`) and confirming the badge colour matches `--danger-color` per `packages/frontend/src/styles/theme.css`

---

## Dependencies (Story Completion Order)

```
T001 (baseline) → T002 (CSS foundation)
                       ↓
              T003 → T004 → T005 (US1 MVP ✅)
                               ↓
              T006 [P] ──→ T008 (US2 ✅)
              T007 [P] ──↗
                               ↓
              T009 [P] ──→ T011 (US3 ✅)
              T010 [P] ──↗
                               ↓
                    T012 → T013 [P] (Done ✅)
```

## Parallel Execution Examples

**US2 tests** (T006, T007): Write both test cases simultaneously — they are independent test
functions in the same file and have no ordering dependency on each other.

**US3 tests** (T009, T010): Same — independent test functions that can be written in parallel.

**Polish** (T012, T013): T013 manual check can be done while T012 coverage run is in progress.

---

## Implementation Strategy

1. **MVP first** — Complete US1 (T001–T005) for a shippable increment: badge appears on overdue items.
2. **Correctness** — Complete US2 (T006–T008) to eliminate false positives: no badge on completed/dateless items.
3. **Temporal accuracy** — Complete US3 (T009–T011) to confirm date boundary edge cases.
4. **Done** — Run full suite (T012) and manual visual check (T013).

All implementation lives in a single expression (`isOverdue`) and a single JSX block. US1 implementation inherently satisfies US2 and US3 if the expression is correct — the later phases exist purely to verify correctness through tests.

---

## Task Summary

| Phase | Story | Tasks | Parallelizable |
|-------|-------|-------|---------------|
| 1 — Setup | — | T001 | No |
| 2 — Foundation | — | T002 | No |
| 3 — MVP | US1 | T003, T004, T005 | No (sequential TDD) |
| 4 — Correctness | US2 | T006, T007, T008 | T006‖T007 |
| 5 — Temporal | US3 | T009, T010, T011 | T009‖T010 |
| 6 — Polish | — | T012, T013 | T013 during T012 |
| **Total** | | **13 tasks** | **4 parallel pairs** |
