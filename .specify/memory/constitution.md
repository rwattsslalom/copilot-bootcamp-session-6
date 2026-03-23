<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0 (initial ratification)
Modified principles: N/A — first populated version
Added sections: Core Principles (I–V), Technology & Architecture Constraints, Development Workflow, Governance
Removed sections: N/A
Templates requiring updates:
  ✅ .specify/memory/constitution.md — this file
  ⚠ .specify/templates/tasks-template.md — "Tests are OPTIONAL" note conflicts with Principle III
     (Test-Driven Quality mandates tests; tasks template should treat tests as required by default)
  ✅ .specify/templates/plan-template.md — "Constitution Check" section is generic and compatible
  ✅ .specify/templates/spec-template.md — no conflicting constitution references
Follow-up TODOs: None. All fields resolved from repo docs.
-->

# Todo App Constitution

## Core Principles

### I. Clean Code Standards

All code MUST follow the formatting and naming conventions defined in `docs/coding-guidelines.md`:

- **Indentation**: 2 spaces; LF line endings; lines ≤ 100 characters; no trailing whitespace.
- **Naming**: `camelCase` for variables/functions, `PascalCase` for React components and classes,
  `UPPER_SNAKE_CASE` for constants. Names MUST be descriptive — single-letter names are forbidden
  outside loop indices and destructuring.
- **DRY**: Duplicated logic MUST be extracted into shared utilities or reusable components.
- **KISS**: The simplest correct solution MUST be preferred. Premature optimisation is prohibited.
- **Single Responsibility**: Every module, component, and function MUST have exactly one reason
  to change. God-objects and multi-purpose utilities are not permitted.
- **ESLint**: All code MUST pass ESLint checks. No unused variables, undefined variables, or
  suppressed warnings may be merged. Pre-commit hooks enforce this gate.

*Rationale*: Consistent style reduces cognitive load during code review and pair programming,
directly supporting the bootcamp learning environment.

### II. Test-Driven Quality

Testing is non-negotiable and MUST be practised as follows:

- **Coverage**: All packages MUST maintain ≥ 80 % line/branch coverage, verified by Jest coverage
  reports.
- **Test types required**: Unit tests for every component and service function; integration tests
  for component interactions and frontend ↔ backend API communication.
- **Isolation**: Each test MUST be independent. Shared state between tests is forbidden. External
  dependencies (API calls, timers) MUST be mocked.
- **Naming**: Test files MUST be named `{filename}.test.js` and collocated in a `__tests__/`
  directory next to the source file.
- **Behaviour focus**: Tests MUST verify observable behaviour, not implementation details.
  Brittle tests that break on safe refactoring are a defect.

*Rationale*: The testing guidelines (`docs/testing-guidelines.md`) establish 80 %+ coverage and
isolation as the quality bar; this principle makes compliance a hard project gate.

### III. Component-Driven Architecture

The frontend MUST be structured around focused, reusable React components:

- Each component MUST have a single, well-defined visual or logical responsibility.
- Components MUST be placed under `packages/frontend/src/components/` with PascalCase filenames
  matching the component name.
- Shared business logic MUST live in `services/` modules, not inside components.
- Import order MUST follow: external libraries → internal modules → styles, with blank-line
  separation between groups.
- Circular dependencies are forbidden.

*Rationale*: The monorepo separates frontend and backend concerns; a component-driven model
keeps the React layer maintainable as features are added during bootcamp sessions.

### IV. Design System Compliance

All UI work MUST conform to the design system defined in `docs/ui-guidelines.md`:

- **Colours**: Use only the defined light-mode and dark-mode palette tokens (Halloween orange
  primary, deep blue/purple secondary, success green, danger red). Custom one-off colours are
  forbidden.
- **Typography**: Use the system font stack; respect the defined size/weight scale
  (28 px heading → 12 px caption).
- **Spacing**: All spacing MUST align to the 8 px grid (xs = 8 px, sm = 16 px, md = 24 px,
  lg = 32 px, xl = 48 px).
- **Dark mode**: Every UI change MUST support both light and dark modes.
- **Max width**: Content MUST not exceed 600 px on large screens.

*Rationale*: A consistent design system prevents visual inconsistency across bootcamp sessions
and teaches contributors to work within design constraints.

### V. Functional Scope & Persistence

The application scope is strictly bounded by `docs/functional-requirements.md`:

- The app MUST support full CRUD on todo items (create, read, update, delete).
- Every mutating action MUST persist to the Express.js backend immediately — optimistic-only
  updates without a backend write are not permitted.
- Destructive actions (delete) MUST show a confirmation dialog before execution.
- Out-of-scope features (authentication, multi-user, search, filtering, bulk operations,
  recurring todos, undo/redo) MUST NOT be added without a constitution amendment.
- The backend API MUST be the single source of truth for todo state.

*Rationale*: Tight scoping keeps the bootcamp project focused and prevents scope creep that
would obscure the session learning objectives.

## Technology & Architecture Constraints

- **Monorepo**: npm workspaces manage `packages/frontend` (React) and `packages/backend`
  (Node.js / Express.js). Package boundaries MUST be respected — cross-package imports are
  forbidden.
- **Language**: JavaScript (ES2020+). TypeScript is out of scope unless a future amendment
  introduces it.
- **Testing framework**: Jest for both packages; `@testing-library/react` for frontend component
  tests.
- **Node.js**: v16 or higher required.
- **No database migrations**: Storage changes MUST stay within the existing backend persistence
  mechanism. External databases or schema-migration tools require an amendment.
- **Security**: No user-supplied input may be rendered as raw HTML. All API inputs MUST be
  validated server-side. Dependencies MUST be kept up to date to avoid known CVEs.

## Development Workflow

- Run `npm install` at the repository root before any work session.
- Use `npm run start` (root) to start both frontend and backend concurrently.
- Use `npm test` (root) to execute the full test suite across all packages.
- All code changes MUST pass ESLint and the full test suite before a pull request is opened.
- PRs MUST include tests that cover the new or changed behaviour. PRs that reduce overall
  coverage below 80 % MUST NOT be merged.
- Branch names MUST follow the pattern `###-short-description` (e.g., `001-add-due-date`).

## Governance

This constitution supersedes all other project practices. In cases of conflict, the constitution
takes precedence over individual README instructions, PR descriptions, or verbal agreements.

**Amendment procedure**:
1. Propose the change by opening a PR that updates this file.
2. Increment the version according to semantic rules:
   - PATCH — clarifications, wording, typo fixes.
   - MINOR — new principle or section added.
   - MAJOR — principle removed, renamed, or fundamentally redefined.
3. Document the change in the Sync Impact Report comment at the top of this file.
4. Update any templates or docs that reference the changed principle before merging.

**Compliance**: All PRs and code reviews MUST verify compliance with the five core principles.
Complexity that cannot be justified against a principle MUST be simplified.

**Version**: 1.0.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-03-23
