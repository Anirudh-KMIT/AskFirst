'use client'

import { useEffect, useState, useMemo } from 'react'
import useTaskStore from '@/store/useTaskStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import {
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  ListTodo,
  Sparkles,
  Flame,
  Zap,
  Leaf,
  Inbox,
} from 'lucide-react'

const priorityConfig = {
  high: {
    label: 'High',
    icon: Flame,
    badge: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100',
    dot: 'bg-rose-500',
  },
  medium: {
    label: 'Medium',
    icon: Zap,
    badge: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100',
    dot: 'bg-amber-500',
  },
  low: {
    label: 'Low',
    icon: Leaf,
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    dot: 'bg-emerald-500',
  },
}

function Stat({ label, value, accent }) {
  return (
    <div className="flex-1 rounded-xl border bg-white/60 backdrop-blur px-4 py-3 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent || 'text-slate-900'}`}>{value}</p>
    </div>
  )
}

function TaskItem({ task, onToggle, onDelete }) {
  const cfg = priorityConfig[task.priority] || priorityConfig.medium
  const Icon = cfg.icon
  const isDone = task.status === 'done'

  return (
    <Card
      className={`group transition-all duration-200 border ${
        isDone
          ? 'bg-slate-50/70 border-slate-200'
          : 'bg-white border-slate-200 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className="shrink-0 focus:outline-none"
          aria-label="Toggle complete"
        >
          {isDone ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          ) : (
            <Circle className="h-6 w-6 text-slate-300 group-hover:text-slate-500 transition" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm sm:text-base font-medium truncate ${
              isDone ? 'line-through text-slate-400' : 'text-slate-800'
            }`}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={`text-xs font-medium ${cfg.badge}`}>
              <Icon className="h-3 w-3 mr-1" />
              {cfg.label}
            </Badge>
            <span
              className={`text-xs font-medium ${
                isDone ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {isDone ? 'Done' : 'Pending'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={isDone ? 'outline' : 'default'}
            onClick={() => onToggle(task.id)}
            className="hidden sm:inline-flex"
          >
            {isDone ? 'Undo' : 'Done'}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(task.id)}
            className="text-slate-400 hover:text-rose-600"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function App() {
  const [mounted, setMounted] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')

  const tasks = useTaskStore((s) => s.tasks)
  const activeFilter = useTaskStore((s) => s.activeFilter)
  const addTask = useTaskStore((s) => s.addTask)
  const toggleDone = useTaskStore((s) => s.toggleDone)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const setFilter = useTaskStore((s) => s.setFilter)
  const clearCompleted = useTaskStore((s) => s.clearCompleted)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'pending') return tasks.filter((t) => t.status === 'pending')
    if (activeFilter === 'done') return tasks.filter((t) => t.status === 'done')
    return tasks
  }, [tasks, activeFilter])

  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.status === 'done').length
    const pending = total - done
    return { total, done, pending }
  }, [tasks])

  const handleAdd = (e) => {
    e?.preventDefault?.()
    const trimmed = title.trim()
    if (!trimmed) {
      toast.error('Task title is required')
      return
    }
    addTask(trimmed, priority)
    setTitle('')
    setPriority('medium')
    toast.success('Task added')
  }

  const filters = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'done', label: 'Done', count: stats.done },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-10 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-10 max-w-3xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-indigo-500/30">
              <ListTodo className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Taskly
              </h1>
              <p className="text-xs text-slate-500 -mt-0.5">
                A modern mini task manager
              </p>
            </div>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex bg-white/70">
            <Sparkles className="h-3 w-3 mr-1 text-indigo-500" />
            Zustand + Next.js
          </Badge>
        </header>

        {/* Stats */}
        <div className="flex gap-3 mb-6">
          <Stat label="Total" value={mounted ? stats.total : 0} />
          <Stat label="Pending" value={mounted ? stats.pending : 0} accent="text-amber-600" />
          <Stat label="Done" value={mounted ? stats.done : 0} accent="text-emerald-600" />
        </div>

        {/* Add Task */}
        <Card className="mb-6 border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 h-11 text-base"
                maxLength={200}
              />
              <div className="flex gap-3">
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-32 h-11">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low
                      </span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium
                      </span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" /> High
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="h-11 px-5 bg-slate-900 hover:bg-slate-800">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            {filters.map((f) => {
              const active = activeFilter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f.label}
                  <span
                    className={`ml-2 text-xs ${
                      active ? 'text-indigo-500' : 'text-slate-400'
                    }`}
                  >
                    {mounted ? f.count : 0}
                  </span>
                </button>
              )
            })}
          </div>

          {mounted && stats.done > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearCompleted()
                toast.success('Cleared completed tasks')
              }}
              className="text-slate-500 hover:text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear completed
            </Button>
          )}
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {!mounted ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading…</div>
          ) : filteredTasks.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-200 bg-white/60">
              <CardContent className="p-10 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 grid place-items-center mb-3">
                  <Inbox className="h-6 w-6 text-slate-400" />
                </div>
                <p className="font-medium text-slate-700">
                  {activeFilter === 'all'
                    ? 'No tasks yet'
                    : activeFilter === 'pending'
                    ? 'No pending tasks'
                    : 'No completed tasks'}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {activeFilter === 'all'
                    ? 'Add your first task above to get started.'
                    : 'Switch filter to see other tasks.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleDone}
                onDelete={(id) => {
                  deleteTask(id)
                  toast('Task deleted')
                }}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-slate-400">
          Built with Next.js · Zustand · Tailwind — Tasks saved to your browser
        </footer>
      </div>
    </div>
  )
}
