export interface Task {
  id: number
  name: string
  description: string | null
  jobTemplateId: string
  state: string
}

export interface TaskResponse {
  totalCount: number
  totalPages: number
  page: number
  perPage: number
  items: Task[]
}
