# Research: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-highlight`  
**Phase**: 0 — all NEEDS CLARIFICATION resolved before this file was written (see spec Clarifications section)

---

## R-001: How is `dueDate` stored and compared?

**Decision**: The existing `<input type="date">` elements in `TodoForm.js` and `TodoCard.js` (edit
mode) produce values in ISO 8601 `YYYY-MM-DD` format. This format compares correctly as a plain
string: `"2026-03-22" < "2026-03-23"` evaluates to `true` in JavaScript. No date-parsing library
is required.

**Rationale**: String comparison of ISO 8601 dates is lexicographically equivalent to chronological
order, making it the simplest correct approach (KISS principle). A `Date` object comparison would
also work but introduces timezone edge cases when calling `new Date('YYYY-MM-DD')` (interpreted as
UTC midnight, which can shift the calendar date in timezones west of UTC).

**Implementation**:
```javascript
// Safe ISO string for today in local timezone (avoids UTC offset issue)
const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const isOverdue = !todo.completed && todo.dueDate && todo.dueDate < todayStr;
```

**Alternatives considered**:
- `new Date(todo.dueDate) < new Date()` — rejected: `new Date('2026-03-22')` is UTC-midnight,
  which is prior-day in UTC-offset-negative timezones, causing off-by-one errors.
- `Date.parse()` — same timezone issue.
- External library (date-fns, dayjs) — rejected: KISS / no new dependencies.

---

## R-002: Where should the overdue badge be rendered in `TodoCard`?

**Decision**: Inside the existing `todo-content` div, immediately after the `todo-due-date`
paragraph, conditionally rendered when `isOverdue` is true.

**Rationale**: The badge is semantically associated with the due date. Placing it adjacent to the
due date makes the visual relationship clear and requires no layout restructuring. The existing
`todo-actions` and `todo-checkbox` sections are unaffected.

**Markup**:
```jsx
{isOverdue && (
  <span className="overdue-badge" aria-label="Overdue">Overdue</span>
)}
```

**Alternatives considered**:
- Badge inside the due-date `<p>` tag — rejected: mixes display text and status badge in one
  element, complicating test selectors and CSS.
- Badge on the card root (`todo-card` div) as a pseudo-element — rejected: harder to query in
  tests, not accessible as text.

---

## R-003: What CSS rule is needed for the badge?

**Decision**: A single rule using the existing `--danger-color` and `--space-xs` tokens.

```css
.overdue-badge {
  display: inline-block;
  padding: 2px var(--space-xs);   /* 2px top/bottom, 8px left/right */
  background-color: var(--danger-color);
  color: #ffffff;
  font-size: 12px;                /* caption size per design system */
  font-weight: 600;               /* semi-bold per button typography */
  border-radius: var(--radius-sm); /* 4px */
  margin-top: 4px;
}
```

**Rationale**: Uses only design-system tokens. The danger colour automatically adapts to dark mode
because `--danger-color` resolves to `#ef5350` under `[data-theme="dark"]`. White text on both
danger colours (`#c62828` and `#ef5350`) meets WCAG AA contrast ratio.

**Alternatives considered**:
- Applying `color: var(--danger-color)` to the due-date text — rejected: text-only colour change
  is insufficient for accessibility (fails the non-colour-cue requirement).
- Border accent on the card — rejected: not selected in clarification Q1 (Option B chosen).

---

## R-004: How are overdue indicators handled in tests?

**Decision**: Query by text using `screen.getByText('Overdue')` and `screen.queryByText('Overdue')`.

**Rationale**: Text queries are the most resilient selector type with `@testing-library/react` —
they remain stable through CSS and class name changes. The badge text "Overdue" is the primary
non-colour accessibility cue, so testing it by text validates both behaviour and accessibility.

**Test data convention**: Use `dueDate: '2020-01-01'` for a reliably past date (year 2020 is
always in the past relative to any plausible test execution date). Use `new Date()` pattern or
`dueDate: '2099-12-31'` for a reliably future date.

---

## Summary: Decisions Table

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| `dueDate` comparison method | ISO string (`dueDate < todayStr`) | Correct, simple, zero dependencies |
| Today's date source | Local timezone via `getFullYear/Month/Date` | Avoids UTC offset off-by-one |
| Badge placement | After `todo-due-date` in `todo-content` | Semantically associated; no layout change |
| Badge markup | `<span className="overdue-badge">Overdue</span>` | Accessible text, easy to test |
| Badge CSS | `--danger-color` + `--space-xs` + `--radius-sm` tokens | Design system compliant, dark mode free |
| Test selector | `getByText('Overdue')` | Resilient, aligns with non-colour cue requirement |
</content>
</invoke>