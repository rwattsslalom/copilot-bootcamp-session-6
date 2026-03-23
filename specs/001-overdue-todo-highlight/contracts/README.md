# Contracts: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-highlight`  
**Phase**: 1

---

## No API Contract Changes

This feature introduces no new endpoints and modifies no existing endpoints.

The overdue indicator is a **purely client-side, computed UI enhancement**. The backend Express.js
API contract is unchanged:

| Endpoint | Method | Request | Response | Change |
|----------|--------|---------|----------|--------|
| `/todos` | GET | — | `TodoItem[]` | None |
| `/todos` | POST | `{ title, dueDate }` | `TodoItem` | None |
| `/todos/:id` | PUT | `{ title, dueDate, completed }` | `TodoItem` | None |
| `/todos/:id` | DELETE | — | `204 No Content` | None |

The `dueDate` field in API responses is already `YYYY-MM-DD` string or `null`. No change to
the response shape is required.

---

## Frontend UI Contract (TodoCard component)

The `TodoCard` component's existing prop interface is unchanged. The new "Overdue" badge is
a purely internal rendering detail.

**Existing prop types (unchanged)**:

```javascript
TodoCard.propTypes = {
  todo: {
    id: number,           // required
    title: string,        // required
    dueDate: string|null, // YYYY-MM-DD or null
    completed: number,    // 0 or 1
    createdAt: string,    // ISO 8601
  },
  onToggle: function,     // (id) => Promise<void>
  onEdit: function,       // (id, title, dueDate) => Promise<void>
  onDelete: function,     // (id) => Promise<void>
  isLoading: boolean,
}
```

**New observable behaviour** (not a prop change; a rendering contract):
- When `todo.completed === 0` AND `todo.dueDate` is set AND `todo.dueDate < today`,
  an element with text "Overdue" is present in the rendered output.
- In all other cases, no element with text "Overdue" is rendered.
