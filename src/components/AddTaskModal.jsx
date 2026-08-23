import {
  useEffect,
  useState,
} from 'react';

import {
  CalendarDaysIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

/* ========================================
   Empty form
======================================== */

const emptyForm = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'todo',
  assignee: '',
  dueDate: '',
  tags: '',
};

function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
  initialStatus = 'todo',
}) {
  const [form, setForm] = useState({
    ...emptyForm,
    status: initialStatus,
  });

  /* ========================================
     Reset form when modal opens
  ======================================== */

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...emptyForm,
        status: initialStatus,
      });
    }
  }, [
    isOpen,
    initialStatus,
  ]);

  /* ========================================
     Close with ESC
  ======================================== */

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === 'Escape'
      ) {
        onClose();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
  }, [
    isOpen,
    onClose,
  ]);

  if (!isOpen) {
    return null;
  }

  /* ========================================
     Submit
  ======================================== */

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    onAdd({
      ...form,

      tags: form.tags
        .split(',')
        .map((tag) =>
          tag.trim()
        )
        .filter(Boolean),
    });

    onClose();
  };

  /* ========================================
     Update field
  ======================================== */

  const updateForm = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ========================================
     Reusable input classes
  ======================================== */

  const inputClass =
    'w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-[13px] text-ink outline-none transition placeholder:text-muted/75 focus:border-primary/55 focus:ring-4 focus:ring-primary/10';

  const labelClass =
    'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-muted';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-task-title"

      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      {/* Modal */}
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[22px] border border-white/70 bg-surface shadow-[0_28px_80px_rgba(20,24,35,0.22)]">

        {/* ===================================
            HEADER
        ==================================== */}

        <div className="flex items-start justify-between border-b border-line px-5 py-4 sm:px-6">

          <div>

            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
              CollabBoard
            </p>

            <h2
              id="new-task-title"
              className="mt-1 font-display text-xl font-bold tracking-[-0.02em] text-ink"
            >
              Create a new task
            </h2>

            <p className="mt-1 text-xs text-muted">
              Add the essential details now.
              You can expand the task later.
            </p>

          </div>

          <button
            onClick={onClose}
            className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-canvas hover:text-ink"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

        </div>

        {/* ===================================
            FORM
        ==================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-5 py-5 sm:px-6 sm:py-6"
        >

          {/* Task title */}
          <div>

            <label
              htmlFor="task-title"
              className={labelClass}
            >
              Task title
            </label>

            <input
              id="task-title"
              type="text"
              required
              autoFocus
              maxLength={90}

              placeholder="e.g. Polish responsive dashboard"

              value={form.title}

              onChange={(event) =>
                updateForm(
                  'title',
                  event.target.value
                )
              }

              className={inputClass}
            />

          </div>

          {/* Description */}
          <div>

            <label
              htmlFor="task-description"
              className={labelClass}
            >
              Description
            </label>

            <textarea
              id="task-description"
              rows={4}

              placeholder="Add context, acceptance criteria, or a short note..."

              value={
                form.description
              }

              onChange={(event) =>
                updateForm(
                  'description',
                  event.target.value
                )
              }

              className={`${inputClass} resize-none leading-6`}
            />

          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Status */}
            <div>

              <label
                htmlFor="task-status"
                className={labelClass}
              >
                Status
              </label>

              <select
                id="task-status"

                value={form.status}

                onChange={(event) =>
                  updateForm(
                    'status',
                    event.target.value
                  )
                }

                className={inputClass}
              >
                <option value="todo">
                  To do
                </option>

                <option value="doing">
                  In progress
                </option>

                <option value="done">
                  Done
                </option>
              </select>

            </div>

            {/* Priority */}
            <div>

              <label
                htmlFor="task-priority"
                className={labelClass}
              >
                Priority
              </label>

              <select
                id="task-priority"

                value={form.priority}

                onChange={(event) =>
                  updateForm(
                    'priority',
                    event.target.value
                  )
                }

                className={inputClass}
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>

            </div>

          </div>

          {/* Assignee + Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Assignee */}
            <div>

              <label
                htmlFor="task-assignee"
                className={labelClass}
              >
                Assignee
              </label>

              <input
                id="task-assignee"
                type="text"

                placeholder="e.g. Jane Smith"

                value={
                  form.assignee
                }

                onChange={(event) =>
                  updateForm(
                    'assignee',
                    event.target.value
                  )
                }

                className={inputClass}
              />

            </div>

            {/* Due Date */}
            <div>

              <label
                htmlFor="task-due-date"
                className={labelClass}
              >
                Due date
              </label>

              <div className="relative">

                <CalendarDaysIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                <input
                  id="task-due-date"
                  type="date"

                  value={
                    form.dueDate
                  }

                  onChange={(event) =>
                    updateForm(
                      'dueDate',
                      event.target.value
                    )
                  }

                  className={`${inputClass} pl-10`}
                />

              </div>

            </div>

          </div>

          {/* Tags */}
          <div>

            <label
              htmlFor="task-tags"
              className={labelClass}
            >
              Tags
            </label>

            <input
              id="task-tags"
              type="text"

              placeholder="Frontend, UI, Documentation"

              value={form.tags}

              onChange={(event) =>
                updateForm(
                  'tags',
                  event.target.value
                )
              }

              className={inputClass}
            />

            <p className="mt-1.5 text-[11px] text-muted">
              Separate multiple tags with commas.
            </p>

          </div>

          {/* ===================================
              ACTION BUTTONS
          ==================================== */}

          <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="focus-ring rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-[13px] font-semibold text-ink-soft transition hover:bg-canvas"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="focus-ring rounded-xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(99,91,255,0.22)] transition hover:bg-primary-hover"
            >
              Create task
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddTaskModal;
