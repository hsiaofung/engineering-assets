import { Task } from '../task-execution-order-step/task.model'

export interface TaskTableData extends Task {
  executionOrder: number
}

export interface CreateWorkflowRequest {
  name: string
  description: string
  task_ids: number[]
  scheduleType: 'now' | 'future' | null
  scheduleTime: string | null
  cron: string | null
  state: string
}
