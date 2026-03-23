# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-highlight` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-overdue-todo-highlight/spec.md`

## Summary

Add a visual "Overdue" text badge to the `TodoCard` component that appears on any incomplete todo
item whose `dueDate` (ISO 8601 `YYYY-MM-DD`) is strictly before today's date. The badge uses the
existing `--danger-color` CSS variable (light and dark mode tokens already defined). Overdue state
is a pure, reactive derived value computed on every render — no new state, no backend changes, no
new dependencies.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React (existing project version)  
**Primary Dependencies**: React (existing), `@testing-library/react` (existing)  
**Storage**: N/A — overdue state is computed client-side; `dueDate` is an existing ISO 8601 string field on the TodoItem  
**Testing**: Jest + `@testing-library/react` (existing toolchain)  
**Target Platform**: Web browser (React SPA served by Create React App dev server)  
**Project Type**: Web application (React SPA + Express.js API, monorepo)  
**Performance Goals**: Negligible — badge rendering is a single boolean expression per list item  
**Constraints**: Must use `--danger-color` CSS variable only (no hardcoded colours); must work in both light and dark themes  
**Scale/Scope**: Single-component change — `TodoCard.js`, `TodoCard.test.js`, one CSS rule in `App.css`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design — result unchanged.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Code | ✅ PASS | Minimal change to one component; derived boolean is named descriptively (`isOverdue`); no duplication |
| II. Test-Driven Quality | ✅ PASS | New test cases required in `TodoCard.test.js`; no coverage regression |
| III. Component-Driven Architecture | ✅ PASS | Badge stays inside `TodoCard`; no business logic leaks into the component — `isOverdue` is derived from props inline |
| IV. Design System Compliance | ✅ PASS | Uses `--danger-color` token already defined for both light (`#c62828`) and dark (`#ef5350`) modes |
| V. Functional Scope & Persistence | ✅ PASS | Read-only UI enhancement; no mutations, no new API calls; not on out-of-scope list |

**No violations. Complexity Tracking table omitted.**

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-highlight/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (no API changes — see contracts/README.md)
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (affected files only)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js                    # MODIFY — add isOverdue derivation + badge JSX
│   │   └── __tests__/
│   │       └── TodoCard.test.js           # MODIFY — add overdue indicator test cases
│   └── App.css                            # MODIFY — add .overdue-badge CSS rule
└── (no other files touched)

packages/backend/                          # NO CHANGES — purely client-side feature
```

**Structure Decision**: Web application layout (`packages/frontend` / `packages/backend`).
Only the frontend package is affected. The backend package and the monorepo root are untouched.
