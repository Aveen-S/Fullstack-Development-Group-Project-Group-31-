import { create } from 'zustand';

import {
  createJSONStorage,
  persist,
} from 'zustand/middleware';

import mockTasks from '../data/mockTasks';

/* ========================================
   Generate unique ID
======================================== */

const createTaskId = () => {
  if (
    typeof crypto !== 'undefined' &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
};

/* ========================================
   Zustand store
======================================== */

const useTaskStore = create(
  persist(
    (set, get) => ({

      /* Initial tasks */
      tasks: mockTasks,

      /* ==================================
         Add new task
      ================================== */

      addTask: (task) => {
        const taskNumber =
          get().tasks.length + 101;

        const newTask = {
          ...task,

          id: createTaskId(),

          key: `CB-${taskNumber}`,

          title:
            task.title.trim(),

          description:
            task.description?.trim() ??
            '',

          assignee:
            task.assignee?.trim() ||
            'Unassigned',

          tags:
            task.tags ?? [],
        };

        set((state) => ({
          tasks: [
            ...state.tasks,
            newTask,
          ],
        }));
      },

      /* ==================================
         Move task
      ================================== */

      moveTask: (
        id,
        status
      ) => {
        set((state) => ({
          tasks:
            state.tasks.map(
              (task) =>
                String(task.id) ===
                String(id)
                  ? {
                      ...task,
                      status,
                    }
                  : task
            ),
        }));
      },

      /* ==================================
         Reset mock tasks
      ================================== */

      resetTasks: () =>
        set({
          tasks: mockTasks,
        }),

    }),

    /* ====================================
       localStorage persistence
    ==================================== */

    {
      name:
        'collabboard-tasks',

      storage:
        createJSONStorage(
          () => localStorage
        ),
    }
  )
);

export default useTaskStore;