export interface TaskOption {
  value: string
  label: string
  jobTemplate: string
  description: string
  state: string
}

export const TASK_OPTIONS: TaskOption[] = [
  {
    value: 'task112',
    label: 'Task 112',
    jobTemplate: 'Boot From',
    description: 'Boot from network',
    state: 'Enabled',
  },
  {
    value: 'task113',
    label: 'Task 113',
    jobTemplate: 'Set Identify LED',
    description: 'Set server LED',
    state: 'Enabled',
  },
  {
    value: 'task114',
    label: 'Task 114',
    jobTemplate: 'Configure RAID',
    description: 'Configure RAID settings',
    state: 'Disabled',
  },
]
