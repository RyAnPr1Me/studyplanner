import type { Priority, Task } from '../types/plan'

const numberOrDefault = (value: unknown, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return fallback
}

const stringOrDefault = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim().length > 0 ? value : fallback

const normalizePriority = (value: unknown): Priority => {
  if (value === 'low' || value === 'medium' || value === 'high') {
    return value
  }
  return 'medium'
}

export const mapOverdueTask = (task: Record<string, unknown>): Task => ({
  id: stringOrDefault(task.task_id, ''),
  subject: stringOrDefault(task.subject, 'General'),
  topic: stringOrDefault(task.topic, ''),
  duration_minutes: numberOrDefault(task.duration_minutes, 30),
  start_time: stringOrDefault(task.start_time, ''),
  due_date: stringOrDefault(task.due_date, ''),
  priority: normalizePriority(task.priority),
  resources: [],
  ai_notes: '',
})
