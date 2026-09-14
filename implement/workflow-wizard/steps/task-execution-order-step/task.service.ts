import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { taskApiURL } from '@core-modules-scc4/task/task-api-url'
import { map, Observable, shareReplay } from 'rxjs'
import { Task, TaskResponse } from './task.model'
/**
 *
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient)
  //   private readonly baseUrl = 'https://10.147.34.227:28443/task-service/v1/tasks'
  private readonly baseUrl = taskApiURL.taskList
  private cache$?: Observable<Task[]>

  /**
   * Get task list from backend API
   * @param {number} page
   * @param {number} perPage
   * @returns {Observable<Task[]>} Observable emitting an array of Task objects
   */
  //   getTasks(page = 1, perPage = 10): Observable<Task[]> {
  //     const url = `${this.baseUrl}?perPage=${perPage}&page=${page}&sort=id&direction=asc`

  //     return this.http.get<TaskResponse>(url).pipe(map((res) => res.items))
  //   }

  /**
   * Returns the cached task list from the backend.
   * The API is called only once and shared across subscribers.
   * @returns {Observable<Task[]>} Cached observable of tasks.
   */
  getTasks(): Observable<Task[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<TaskResponse>(this.baseUrl).pipe(
        map((response) => response.items),
        shareReplay(1), // ⭐ cache here
      )
    }
    return this.cache$
  }

  /**
   * Clears the cached tasks and forces the next call to reload data.
   */
  clearCache(): void {
    this.cache$ = undefined
  }
}
