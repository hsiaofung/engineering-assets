import { Directive, effect, inject, input } from '@angular/core'
import { DataLoaderComponent } from '../data-loader/data-loader.component'

/**
 *
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'app-data-loader[polling]',
})
export class DataLoaderPollDirective {
  private readonly dataLoader = inject(DataLoaderComponent)

  readonly polling = input<number>(0)

  private readonly pollEffect = effect((onCleanup) => {
    const intervalMs = this.polling()
    if (intervalMs <= 0) {
      return
    }

    const timerId = window.setInterval(() => {
      if (!this.dataLoader.isLoading()) {
        this.dataLoader.refresh()
      }
    }, intervalMs)

    onCleanup(() => window.clearInterval(timerId))
  })
}
