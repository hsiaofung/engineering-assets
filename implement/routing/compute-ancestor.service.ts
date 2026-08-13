import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ComputeResourceContext } from './compute-resource-context.model'

/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class ComputeAncestorService {
  private readonly http = inject(HttpClient)

  private readonly baseUrl = '/rackconfig-service/v1/device-info/systems'

  /**
   * Retrieves the ancestor context of a compute resource by its ID.
   * Calls the redirection endpoint to get the hierarchical parent information.
   * @param {string} resourceId - The unique identifier of the compute resource.
   * @returns {Observable<ComputeResourceContext>} An observable that emits the compute resource context of the ancestor.
   */
  getAncestor(resourceId: string): Observable<ComputeResourceContext> {
    return this.http.get<ComputeResourceContext>(`${this.baseUrl}/${encodeURIComponent(resourceId)}/redirection`)
  }
}
