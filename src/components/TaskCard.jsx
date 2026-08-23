import {
  CalendarDaysIcon,
  ChatBubbleLeftIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';

/* ========================================
   Priority colors
======================================== */

const priorityStyle = {
  High:
    'bg-high/10 text-high ring-high/15',

  Medium:
    'bg-medium/10 text-medium ring-medium/15',

  Low:
    'bg-low/10 text-low ring-low/15',
};

/* ========================================
   Avatar colors
======================================== */

const avatarStyle = {
  'John Doe':
    'bg-[#E9E7FF] text-[#594FE3]',

  'Jane Smith':
    'bg-[#E5F5FF] text-[#2B77A4]',

  'Alice Johnson':
    'bg-[#FFF0E5] text-[#A45E22]',

  Unassigned:
    'bg-canvas text-muted',
};

/* ========================================
   Get initials
======================================== */

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/* ========================================
   Format date
======================================== */

function formatDueDate(dateValue) {
  if (!dateValue) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat(
    'en',
    {
      month: 'short',
      day: 'numeric',
    }
  ).format(
    new Date(`${dateValue}T00:00:00`)
  );
}

function TaskCard({ task }) {
  const avatarClass =
    avatarStyle[task.assignee] ??
    'bg-primary-soft text-primary';

  /* ========================================
     Drag
  ======================================== */

  const handleDragStart = (event) => {
    event.dataTransfer.setData(
      'text/plain',
      String(task.id)
    );

    event.dataTransfer.effectAllowed =
      'move';
  };

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      className="group cursor-grab rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(16,24,40,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_10px_28px_rgba(16,24,40,0.08)] active:cursor-grabbing"
    >

      {/* =====================================
          ID + PRIORITY
      ====================================== */}

      <div className="mb-3 flex items-center justify-between gap-3">

        <span className="text-[11px] font-semibold tracking-[0.02em] text-muted">
          {task.key}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ring-1 ring-inset ${priorityStyle[task.priority]}`}
        >
          {task.priority}
        </span>

      </div>

      {/* =====================================
          TASK INFORMATION
      ====================================== */}

      <h3 className="text-[14px] font-semibold leading-5 text-ink transition group-hover:text-primary">
        {task.title}
      </h3>

      <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.65] text-muted">
        {task.description}
      </p>

      {/* =====================================
          TAGS
      ====================================== */}

      {task.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">

          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-canvas px-2 py-1 text-[10px] font-semibold text-ink-soft ring-1 ring-inset ring-line"
            >
              {tag}
            </span>
          ))}

        </div>
      )}

      {/* =====================================
          CARD FOOTER
      ====================================== */}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">

        {/* Assignee */}
        <div className="flex min-w-0 items-center gap-2">

          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarClass}`}
            title={task.assignee}
          >
            {getInitials(task.assignee) || '—'}
          </span>

          <span className="hidden max-w-24 truncate text-[11px] font-medium text-muted 2xl:block">
            {task.assignee}
          </span>

        </div>

        {/* Meta */}
        <div className="flex items-center gap-2.5 text-muted">

          {/* Due Date */}
          <span className="flex items-center gap-1 text-[11px] font-medium">

            <CalendarDaysIcon className="h-3.5 w-3.5" />

            {formatDueDate(
              task.dueDate
            )}

          </span>

          {/* Attachment placeholder */}
          <span
            className="hidden items-center gap-1 text-[11px] xl:flex"
            aria-label="Attachments"
          >
            <PaperClipIcon className="h-3.5 w-3.5" />
            0
          </span>

          {/* Comment placeholder */}
          <span
            className="hidden items-center gap-1 text-[11px] xl:flex"
            aria-label="Comments"
          >
            <ChatBubbleLeftIcon className="h-3.5 w-3.5" />
            0
          </span>

        </div>

      </div>

    </article>
  );
}

export default TaskCard;