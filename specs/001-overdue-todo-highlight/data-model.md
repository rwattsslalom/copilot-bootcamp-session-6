# Data Model: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-highlight`  
**Phase**: 1

---

## Existing Entity: TodoItem

The `TodoItem` entity is unchanged. No new fields are added to the database or API response.

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| `id` | integer | yes | auto-increment PK | Existing |
| `title` | string | yes | max 255 chars | Existing |
| `dueDate` | string (ISO 8601) | no | `YYYY-MM-DD` or null | Existing; basis for overdue computation |
| `completed` | integer (0/1) | yes | 0 = incomplete, 1 = complete | Existing |
| `createdAt` | string (ISO 8601) | yes | set on creation | Existing |

---

## Derived State: `isOverdue`

`isOverdue` is a **computed, client-side, non-stored** boolean. It is derived on every render of
`TodoCard` from existing props. It does not appear in the database, API responses, or network
requests.

**Definition**:

```
isOverdue = (completed === 0 OR completed === false)
          AND dueDate IS NOT NULL
          AND dueDate < today   (string comparison, YYYY-MM-DD)
```

Where `today` is the current date in the user's local timezone formatted as `YYYY-MM-DD`.

**Truth table**:

| `completed` | `dueDate` | `dueDate < today` | `isOverdue` |
|-------------|-----------|-------------------|-------------|
| false/0 | null | — | **false** |
| false/0 | future date | false | **false** |
| false/0 | today | false (strictly less than) | **false** |
| false/0 | past date | true | **true** |
| true/1 | past date | true | **false** (completed items are never overdue) |
| true/1 | null | — | **false** |

---

## State Transitions

The overdue state changes reactively whenever the parent component re-renders with updated props:

```
[incomplete + past dueDate]  →  mark complete            →  [NOT overdue]
[incomplete + past dueDate]  →  update dueDate to future →  [NOT overdue]
[incomplete + future dueDate]  →  (time passes)          →  [overdue on next page load]
```

No explicit state transition logic is required — `isOverdue` is re-derived from current props on
every render, so any prop change (toggle, edit) immediately reflects in the overdue status.

---

## No Schema Changes

- The backend Express.js API and its `todoService.js` are **not modified**.
- No new fields added to the in-memory store or any persistence layer.
- The GET `/todos` response shape is unchanged.
