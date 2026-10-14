import { HttpClient } from '@angular/common/http'
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core'
import { from, isObservable } from 'rxjs'
import type { DataLoaderFetchFn } from './data-loader.interface'

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
 * @template T
 */
@Component({
  selector: 'app-data-loader',
  standalone: true,
  exportAs: 'dataLoader',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataLoaderComponent<T> {
  /** Input URL for automatic HTTP GET request */
  readonly url = input<string>('')

  /** Custom fetch function that can return Observable or Promise */
  readonly getFn = input<DataLoaderFetchFn<T> | null>(null)

  /** Signal holding the fetched data */
  readonly data = signal<T | null>(null)

  /** Signal indicating if data is currently being loaded */
  readonly isLoading = signal<boolean>(true)

  /** Signal holding error message if fetching failed */
  readonly error = signal<string | null>(null)

  private readonly http = inject(HttpClient)
  private readonly refreshCount = signal<number>(0)
  private readonly fetchFn = computed<DataLoaderFetchFn<T> | null>(() => {
    const getFn = this.getFn()
    const url = this.url()

    if (getFn) {
      return getFn
    }

    if (url) {
      return () => this.http.get<T>(url)
    }

    return null
  })

  private readonly loadEffect = effect((onCleanup) => {
    this.refreshCount()
    const fetchFn = this.fetchFn()

    if (!fetchFn) {
      this.data.set(null)
      this.error.set('No valid url or getFn provided')
      this.isLoading.set(false)
      return
    }

    this.executeFetch(fetchFn, onCleanup)
  })

  /**
   * Executes the data fetching logic based on provided `url` or `getFn`.
   *
   * Automatically converts Promise results to Observables and handles
   * loading/error states via signals.
   * @param {DataLoaderFetchFn<T>} fetchFn Data fetch function to execute.
   * @param {(cleanupFn: () => void) => void} onCleanup Effect cleanup registration callback.
   * @private
   */
  private executeFetch(fetchFn: DataLoaderFetchFn<T>, onCleanup: (cleanupFn: () => void) => void): void {
    this.isLoading.set(true)
    this.error.set(null)

    try {
      const result = fetchFn()
      const observable$ = isObservable(result) ? result : from(result)

      const subscription = observable$.subscribe({
        next: (res: T) => {
          this.data.set(res)
          this.isLoading.set(false)
        },
        error: (_err) => {
          this.error.set('Data loading failed')
          this.isLoading.set(false)
        },
      })

      onCleanup(() => subscription.unsubscribe())
    } catch (_err) {
      this.error.set('Execution error')
      this.isLoading.set(false)
    }
  }

  /**
   * Public method to manually trigger a data refresh.
   */
  public refresh(): void {
    this.refreshCount.update((value) => value + 1)
  }
}
