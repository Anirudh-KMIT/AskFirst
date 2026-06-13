'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],
      activeFilter: 'all',

      addTask: (title, priority) =>
        set((state) => ({
          tasks: [
            {
              id:
                typeof crypto !== 'undefined' && crypto.randomUUID
                  ? crypto.randomUUID()
                  : Date.now().toString(36) + Math.random().toString(36).slice(2),
              title: title.trim(),
              priority: priority || 'medium',
              status: 'pending',
              createdAt: Date.now(),
            },
            ...state.tasks,
          ],
        })),

      toggleDone: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
              : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      setFilter: (filter) => set({ activeFilter: filter }),

      clearCompleted: () =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.status !== 'done'),
        })),
    }),
    {
      name: 'task-manager-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)

export default useTaskStore
