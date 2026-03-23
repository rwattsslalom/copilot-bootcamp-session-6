# Quickstart: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-highlight`  
**Branch**: `001-overdue-todo-highlight`

This guide describes exactly what to implement and how to verify it. All work is confined to the
`packages/frontend` package.

---

## Prerequisites

```bash
cd /workspaces/copilot-bootcamp-session-6
npm install
```

---

## Step 1 — Add the overdue badge CSS

**File**: `packages/frontend/src/App.css`

Add the following rule (at the end of the file, or grouped with other `.todo-*` rules):

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

**Why**: The `--danger-color`, `--space-xs`, and `--radius-sm` tokens are already defined in
`src/styles/theme.css` for both light and dark modes. No new colours are introduced.

---

## Step 2 — Add the overdue indicator to `TodoCard`

**File**: `packages/frontend/src/components/TodoCard.js`

Inside the `return` block of the normal (non-editing) view, derive `isOverdue` and render the badge:

```javascript
// Add before the return statement (in the non-editing render path):
const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const isOverdue = !todo.completed && todo.dueDate && todo.dueDate < todayStr;
```

Inside the `todo-content` div, after the due date paragraph:

```jsx
<div className="todo-content">
  <h3 className="todo-title">{todo.title}</h3>
  {todo.dueDate && (
    <p className="todo-due-date">
      Due: {formatDate(todo.dueDate)}
    </p>
  )}
  {isOverdue && (
    <span className="overdue-badge" aria-label="Overdue">Overdue</span>
  )}
</div>
```

**Why**: `isOverdue` is a pure derived value from existing props — no new state, no effects.
Because it is computed on every render, changes to `todo.completed` or `todo.dueDate` (from
parent state updates) automatically remove the badge without any additional event wiring.

---

## Step 3 — Add tests to `TodoCard.test.js`

**File**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

Add the following `describe` block inside the existing `describe('TodoCard Component', ...)`:

```javascript
describe('overdue indicator', () => {
  const pastDate = '2020-01-01';
  const futureDate = '2099-12-31';

  it('shows "Overdue" badge for an incomplete todo with a past due date', () => {
    const todo = { ...mockTodo, dueDate: pastDate, completed: 0 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('does not show "Overdue" badge when due date is today or in the future', () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todo = { ...mockTodo, dueDate: todayStr, completed: 0 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not show "Overdue" badge for a future due date', () => {
    const todo = { ...mockTodo, dueDate: futureDate, completed: 0 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not show "Overdue" badge when todo is completed, even with past due date', () => {
    const todo = { ...mockTodo, dueDate: pastDate, completed: 1 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not show "Overdue" badge when todo has no due date', () => {
    const todo = { ...mockTodo, dueDate: null, completed: 0 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });
});
```

---

## Step 4 — Verify

```bash
# Run frontend tests (from repo root)
npm test --workspace=packages/frontend

# Or from the frontend package directly
cd packages/frontend && npm test
```

All 5 new test cases should pass. Existing tests should remain green.

---

## Acceptance criteria checklist

- [ ] Incomplete todo with `dueDate = '2020-01-01'` shows "Overdue" badge in the list
- [ ] Incomplete todo with `dueDate` = today does NOT show badge
- [ ] Incomplete todo with `dueDate` in the future does NOT show badge
- [ ] Completed todo with `dueDate = '2020-01-01'` does NOT show badge
- [ ] Todo with no `dueDate` does NOT show badge
- [ ] Badge is visible in both light and dark modes (manual check: toggle theme)
- [ ] All existing tests still pass
- [ ] Coverage remains ≥ 80 %
