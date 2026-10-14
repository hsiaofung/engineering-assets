import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { TranslatePipe } from '@ngx-translate/core'
import { ActionsErrorModalModule } from './actions-error-modal.interface'

const DEFAULT_MODAL_WIDTH = 363
const COOLING_TOWER_MODAL_WIDTH = 440
const DEFAULT_OK_TEXT = 'global.ok'

/**
 * Displays an error modal driven by the `content` input.
 *
 * It also read `MainLayoutReducer.error` until #131, preferring `content` and falling back to the
 * store. Nothing had dispatched `SetErrorModel` since 3.x, so that branch could only ever produce
 * an empty message — and every page using this component passes `content` anyway. The shell also
 * rendered one instance with no `content`, which was the store branch's only reason to exist;
 * it went with the selector.
 *
 * Zone-less: uses signal inputs, computed state, and OnPush change detection.
 */
@Component({
  selector: 'app-actions-error-modal',
  templateUrl: './actions-error-modal.component.html',
  styleUrl: './actions-error-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzModalModule, NzButtonComponent, TranslatePipe],
})
export class ActionsErrorModalComponent {
  readonly content = input<string>('')
  readonly switchConfig = input<string>('')
  readonly rsvdVlans = input<boolean>(false)
  readonly okText = input<string>('')
  readonly module = input<ActionsErrorModalModule>('')
  readonly modalWidth = input<number>(DEFAULT_MODAL_WIDTH)

  readonly modalState = output<boolean>()

  protected readonly modalTitle = 'Error'

  protected readonly okTextLabel = computed(() => this.okText() || DEFAULT_OK_TEXT)

  protected readonly modalWidthValue = computed(() => {
    switch (this.module()) {
      case 'cooling-tower':
        return COOLING_TOWER_MODAL_WIDTH
      default:
        return this.modalWidth()
    }
  })

  protected readonly displayMessage = computed(() => this.content())

  protected readonly isVisible = computed(() => !!this.displayMessage())

  /**
   * Closes the modal.
   *
   * The owner clears its own `content` in response; the modal does not hold a dismissed message of
   * its own, which it needed only while the store could push one in without an owner.
   */
  protected closeModal(): void {
    this.modalState.emit(false)
  }
}
