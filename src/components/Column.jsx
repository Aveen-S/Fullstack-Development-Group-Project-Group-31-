import { useState } from 'react';

import {
  EllipsisHorizontalIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import TaskCard from './TaskCard';

const columnConfig = {
  todo: {
    title: 'To do',
    dot: 'bg-todo',
    tint: 'bg-todo/5',
  },

  doing: {
    title: 'In progress',
    dot: 'bg-doing',
    tint: 'bg-doing/5',
  },

  done: {
    title: 'Done',
    dot: 'bg-done',
    tint: 'bg-done/5',
  },
};

function Column({
  status,
  tasks,
  onMoveTask,
  onCreateTask,
}) {
  const [isDragOver, setIsDragOver] =
    useState(false);

  const config = columnConfig[status];

  /* ========================================
     Drop task
  ======================================== */

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragOver(false);

    const taskId =
      event.dataTransfer.getData(
        'text/plain'
      );

    if (taskId) {
      onMoveTask(taskId, status);
    }
  };

  return (
    <section
      onDragOver={(event) => {
        event.preventDefault();

        event.dataTransfer.dropEffect =
          'move';

        setIsDragOver(true);
      }}

      onDragLeave={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget
          )
        ) {
          setIsDragOver(false);
        }
      }}

      onDrop={handleDrop}

      className={`flex min-h-[560px] flex-col rounded-2xl border p-3 transition sm:p-4 ${
        isDragOver
          ? 'border-primary/40 bg-primary/5 ring-4 ring-primary/5'
          : 'border-line bg-surface-soft'
      }`}
    >

      {/* =====================================
          COLUMN HEADER
      ====================================== */}

      <div className="mb-3 flex items-center gap-2 px-1">

        <span
          className={`h-2.5 w-2.5 rounded-full ${config.dot}`}
        />

        <h2 className="text-[13px] font-bold text-ink">
          {config.title}
        </h2>

        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-muted ${config.tint}`}
        >
          {tasks.length}
        </span>

        <div className="ml-auto flex items-center gap-1">

          {/* Add */}
          <button
            onClick={() =>
              onCreateTask(status)
            }
            className="focus-ring flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-ink hover:shadow-sm"
            aria-label={`Add task to ${config.title}`}
          >
            <PlusIcon
              className="h-4 w-4"
              strokeWidth={2.2}
            />
          </button>

          {/* Options */}
          <button
            className="focus-ring flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-ink hover:shadow-sm"
            aria-label={`${config.title} options`}
          >
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </button>

        </div>

      </div>

      {/* =====================================
          TASK LIST
      ====================================== */}

      <div className="space-y-3">

        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))
        ) : (
          <button
            onClick={() =>
              onCreateTask(status)
            }
            className="focus-ring flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface/60 px-4 py-12 text-center transition hover:border-primary/30 hover:bg-primary/5"
          >

            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-canvas text-muted">
              <PlusIcon className="h-4 w-4" />
            </span>

            <span className="mt-3 text-xs font-semibold text-ink-soft">
              Add the first task
            </span>

            <span className="mt-1 text-[11px] text-muted">
              Or drag a task here
            </span>

          </button>
        )}

      </div>

      {/* =====================================
          BOTTOM ADD BUTTON
      ====================================== */}

      <button
        onClick={() =>
          onCreateTask(status)
        }
        className="focus-ring mt-3 flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold text-muted transition hover:bg-surface hover:text-ink"
      >
        <PlusIcon className="h-4 w-4" />

        Add task
      </button>

    </section>
  );
}

export default Column;