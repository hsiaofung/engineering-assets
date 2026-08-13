import { HttpClient } from '@angular/common/http'
import { Component, Input, OnChanges, inject, signal } from '@angular/core'
import { Observable, from, isObservable } from 'rxjs'

/**
 * A reusable data loader component that handles fetching data with built-in
 * loading and error state management using Angular signals.
 *
 * Supports two input methods:
 * - `url`: Simple string URL (automatically uses HttpClient GET)
 * - `getFn`: Custom function that returns an Observable or Promise
 *
 * The component exposes `data`, `isLoading`, and `error` signals for use in templates
 * via content projection (`ng-content`).
 */
@Component({
  selector: 'app-data-loader',
  standalone: true,
  exportAs: 'dataLoader',
  template: `<ng-content></ng-content>`,
})
export class DataLoaderComponent<T> implements OnChanges {
  /** Input URL for automatic HTTP GET request */
  @Input() url?: string

  /** Custom fetch function that can return Observable or Promise */
  @Input() getFn?: () => Observable<T> | Promise<T>

  /** Signal holding the fetched data */
  readonly data = signal<T | null>(null)

  /** Signal indicating if data is currently being loaded */
  readonly isLoading = signal<boolean>(true)

  /** Signal holding error message if fetching failed */
  readonly error = signal<string | null>(null)

  private http = inject(HttpClient)

  /**
   * Lifecycle hook triggered when input properties change.
   * Re-fetches data whenever `url` or `getFn` changes.
   */
  ngOnChanges(): void {
    // Re-fetch data whenever url or getFn changes
    this.executeFetch()
  }

  /**
   * Executes the data fetching logic based on provided `url` or `getFn`.
   *
   * Automatically converts Promise results to Observables and handles
   * loading/error states via signals.
   * @private
   */
  private executeFetch(): void {
    let finalTargetFn: (() => Observable<T> | Promise<T>) | undefined = this.getFn

    // If only url is provided, automatically create a getFn using HttpClient
    if (this.url && !finalTargetFn) {
      finalTargetFn = () => this.http.get<T>(this.url!)
    }

    if (!finalTargetFn) {
      this.error.set('No valid url or getFn provided')
      this.isLoading.set(false)
      return
    }

    this.isLoading.set(true)
    this.error.set(null)

    try {
      const result = finalTargetFn()
      const observable$ = isObservable(result) ? result : from(result)

      observable$.subscribe({
        next: (res: T) => {
          this.data.set(res)
          this.isLoading.set(false)
        },
        error: (_err) => {
          this.error.set('Data loading failed')
          this.isLoading.set(false)
        },
      })
    } catch (_err) {
      this.error.set('Execution error')
      this.isLoading.set(false)
    }
  }

  /**
   *
   */
  public refresh(): void {
    this.executeFetch()
  }
}
