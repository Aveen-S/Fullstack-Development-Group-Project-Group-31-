import { useMemo, useState } from 'react';

import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Squares2X2Icon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

import AddTaskModal from '../components/AddTaskModal';
import Board from '../components/Board';
import useTaskStore from '../store/taskStore';

function Dashboard() {
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const moveTask = useTaskStore((state) => state.moveTask);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');

  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState('All');

  /* ========================================
     Search + filtering
  ======================================== */

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLowerCase();

    return tasks.filter((task) => {
      const matchesQuery =
        !normalizedQuery ||
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.description.toLowerCase().includes(normalizedQuery) ||
        task.assignee.toLowerCase().includes(normalizedQuery) ||
        task.tags?.some((tag) =>
          tag.toLowerCase().includes(normalizedQuery)
        );

      const matchesPriority =
        priority === 'All' ||
        task.priority === priority;

      return matchesQuery && matchesPriority;
    });
  }, [tasks, query, priority]);

  /* ========================================
     Statistics
  ======================================== */

  const counts = useMemo(
    () => ({
      todo: tasks.filter(
        (task) => task.status === 'todo'
      ).length,

      doing: tasks.filter(
        (task) => task.status === 'doing'
      ).length,

      done: tasks.filter(
        (task) => task.status === 'done'
      ).length,
    }),
    [tasks]
  );

  const completion = tasks.length
    ? Math.round((counts.done / tasks.length) * 100)
    : 0;

  /* ========================================
     Modal
  ======================================== */

  const openNewTask = (status = 'todo') => {
    setNewTaskStatus(status);
    setIsModalOpen(true);
  };

  /* ========================================
     Statistics cards
  ======================================== */

  const stats = [
    {
      label: 'To do',
      value: counts.todo,
      icon: ClockIcon,
      iconClass: 'text-todo bg-todo/10',
    },
    {
      label: 'In progress',
      value: counts.doing,
      icon: ArrowPathIcon,
      iconClass: 'text-doing bg-doing/10',
    },
    {
      label: 'Completed',
      value: counts.done,
      icon: CheckCircleIcon,
      iconClass: 'text-done bg-done/10',
    },
  ];

  return (
    <main className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

      {/* =====================================
          PROJECT HEADER
      ====================================== */}

      <section className="mb-6 rounded-[24px] border border-line bg-surface px-5 py-5 shadow-[0_1px_2px_rgba(16,24,40,0.02)] sm:px-6 lg:px-7">

        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          {/* Left */}
          <div className="min-w-0">

            {/* Breadcrumb */}
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-muted">
              <span>Boards</span>
              <span>/</span>
              <span className="text-ink-soft">
                Product launch
              </span>
            </div>

            {/* Title */}
            <div className="flex flex-wrap items-center gap-3">

              <h1 className="font-display text-[26px] font-extrabold tracking-[-0.035em] text-ink sm:text-[30px]">
                Product launch
              </h1>

              <span className="rounded-full bg-done/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-done">
                On track
              </span>

            </div>

            <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-muted">
              Plan the launch, keep ownership clear,
              and move work through each stage without
              losing context.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center gap-2.5">

            {/* Team avatars */}
            <div
              className="mr-1 flex -space-x-2"
              aria-label="Project members"
            >
              {['JD', 'JS', 'AJ'].map(
                (initials, index) => (
                  <span
                    key={initials}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface text-[10px] font-bold ${
                      index === 0
                        ? 'bg-[#E9E7FF] text-[#594FE3]'
                        : index === 1
                          ? 'bg-[#E5F5FF] text-[#2B77A4]'
                          : 'bg-[#FFF0E5] text-[#A45E22]'
                    }`}
                  >
                    {initials}
                  </span>
                )
              )}
            </div>

            {/* Invite */}
            <button className="focus-ring flex items-center gap-2 rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-[12px] font-semibold text-ink-soft transition hover:bg-canvas">
              <UserPlusIcon className="h-4 w-4" />

              Invite
            </button>

            {/* New Task */}
            <button
              onClick={() => openNewTask('todo')}
              className="focus-ring flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(99,91,255,0.22)] transition hover:bg-primary-hover"
            >
              <PlusIcon
                className="h-4 w-4"
                strokeWidth={2.4}
              />

              New task
            </button>

          </div>
        </div>

        {/* =====================================
            STATISTICS
        ====================================== */}

        <div className="mt-6 grid gap-3 border-t border-line pt-5 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.4fr]">

          {stats.map(
            ({
              label,
              value,
              icon: Icon,
              iconClass,
            }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl bg-canvas/70 px-3.5 py-3"
              >

                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted">
                    {label}
                  </p>

                  <p className="mt-0.5 font-display text-lg font-bold text-ink">
                    {value}
                  </p>
                </div>

              </div>
            )
          )}

          {/* Overall progress */}
          <div className="rounded-2xl bg-canvas/70 px-4 py-3">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted">
                  Overall progress
                </p>

                <p className="mt-0.5 font-display text-lg font-bold text-ink">
                  {completion}%
                </p>
              </div>

              <span className="text-[11px] font-semibold text-muted">
                {counts.done}/{tasks.length} done
              </span>

            </div>

            {/* Progress bar */}
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line">

              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${completion}%`,
                }}
              />

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          BOARD
      ====================================== */}

      <section>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.02)] lg:flex-row lg:items-center lg:justify-between">

          {/* View selection */}
          <div className="flex items-center gap-1 rounded-xl bg-canvas p-1">

            <button className="focus-ring flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-[12px] font-semibold text-ink shadow-sm ring-1 ring-line">
              <Squares2X2Icon className="h-4 w-4" />

              Board
            </button>

            <button className="focus-ring rounded-lg px-3 py-2 text-[12px] font-semibold text-muted transition hover:text-ink">
              List
            </button>

          </div>

          {/* Tools */}
          <div className="flex flex-1 flex-col gap-2 sm:flex-row lg:max-w-[760px] lg:justify-end">

            {/* Search */}
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 transition focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 lg:max-w-xs">

              <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-muted" />

              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                className="w-full bg-transparent text-[12px] text-ink outline-none placeholder:text-muted"
                placeholder="Search tasks..."
              />

            </label>

            {/* Priority filter */}
            <label className="relative">

              <span className="sr-only">
                Filter by priority
              </span>

              <FunnelIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
                }
                className="focus-ring h-full min-h-10 appearance-none rounded-xl border border-line bg-surface py-2.5 pl-9 pr-8 text-[12px] font-semibold text-ink-soft outline-none transition hover:bg-canvas"
              >
                <option value="All">
                  All priorities
                </option>

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>
              </select>

              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />

            </label>

            {/* Display */}
            <button className="focus-ring flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-[12px] font-semibold text-ink-soft transition hover:bg-canvas">

              <AdjustmentsHorizontalIcon className="h-4 w-4 text-muted" />

              Display
            </button>

          </div>

        </div>

        {/* Kanban */}
        <Board
          tasks={filteredTasks}
          onMoveTask={moveTask}
          onCreateTask={openNewTask}
        />

        {/* Empty search */}
        {filteredTasks.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-line-strong bg-surface py-10 text-center">

            <p className="text-sm font-semibold text-ink">
              No tasks match your filters
            </p>

            <p className="mt-1 text-xs text-muted">
              Try another search term or priority.
            </p>

          </div>
        )}

      </section>

      {/* =====================================
          ADD TASK MODAL
      ====================================== */}

      <AddTaskModal
        isOpen={isModalOpen}
        initialStatus={newTaskStatus}
        onClose={() =>
          setIsModalOpen(false)
        }
        onAdd={addTask}
      />

    </main>
  );
}

export default Dashboard;