import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('overdue indicator', () => {
    const pastDate = '2020-01-01';
    const futureDate = '2099-12-31';

    // T003: US1 — badge appears on incomplete todo with past due date
    it('shows Overdue badge for incomplete todo with past due date', () => {
      const todo = { ...mockTodo, dueDate: pastDate, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });

    // T004: US1 — badge disappears when todo is re-rendered as completed
    it('does not show Overdue badge after todo is re-rendered as completed', () => {
      const incompleteTodo = { ...mockTodo, dueDate: pastDate, completed: 0 };
      const { rerender } = render(<TodoCard todo={incompleteTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText('Overdue')).toBeInTheDocument();

      const completedTodo = { ...mockTodo, dueDate: pastDate, completed: 1 };
      rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    // T006: US2 — no badge for completed todo with past due date
    it('does NOT show Overdue badge for completed todo with past due date', () => {
      const todo = { ...mockTodo, dueDate: pastDate, completed: 1 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    // T007: US2 — no badge for incomplete todo with no due date
    it('does NOT show Overdue badge for incomplete todo with no due date', () => {
      const todo = { ...mockTodo, dueDate: null, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    // T009: US3 — no badge when dueDate equals today's local date
    it('does NOT show Overdue badge when dueDate equals today local date', () => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const todo = { ...mockTodo, dueDate: todayStr, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    // T010: US3 — badge present for reliably past date (confirms page-load evaluation)
    it('shows Overdue badge for reliably past date confirming page-load evaluation', () => {
      const todo = { ...mockTodo, dueDate: pastDate, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });

    // T009 complement — no badge for future date
    it('does NOT show Overdue badge for a future due date', () => {
      const todo = { ...mockTodo, dueDate: futureDate, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });
  });

  describe('edit form', () => {
    it('exits edit mode when Cancel is clicked', () => {
      render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
      fireEvent.click(screen.getByLabelText(/Edit/));
      expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByDisplayValue('Test Todo')).not.toBeInTheDocument();
    });

    it('shows validation error when title is empty', () => {
      render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
      fireEvent.click(screen.getByLabelText(/Edit/));
      fireEvent.change(screen.getByDisplayValue('Test Todo'), { target: { value: '' } });
      fireEvent.click(screen.getByText('Save'));
      expect(screen.getByText('Title cannot be empty')).toBeInTheDocument();
    });

    it('shows validation error when title exceeds 255 characters', () => {
      render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
      fireEvent.click(screen.getByLabelText(/Edit/));
      fireEvent.change(screen.getByDisplayValue('Test Todo'), { target: { value: 'a'.repeat(256) } });
      fireEvent.click(screen.getByText('Save'));
      expect(screen.getByText('Title cannot exceed 255 characters')).toBeInTheDocument();
    });

    it('calls onEdit with current values on Save', async () => {
      render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
      fireEvent.click(screen.getByLabelText(/Edit/));
      fireEvent.click(screen.getByText('Save'));
      await waitFor(() => {
        expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTodo.id, 'Test Todo', '2025-12-25');
      });
    });

    it('shows error message when save fails', async () => {
      mockHandlers.onEdit.mockRejectedValue(new Error('Save failed'));
      render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
      fireEvent.click(screen.getByLabelText(/Edit/));
      fireEvent.click(screen.getByText('Save'));
      await waitFor(() => {
        expect(screen.getByText('Save failed')).toBeInTheDocument();
      });
    });
  });
});
