import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { SCCButtonComponent } from '../button/button/button.component'
import { SCCButtonType } from '../button/button/button.interface'
import { SCCCardTitleComponent } from '../card-title/card-title.component'
import { LoadingAnimationV1Component } from '../loading-animation-v1/loading-animation-v1.component'
import { SCCMessageComponent } from '../message/message.component'
import { SCCMessageType } from '../message/message.interface'
import { SCCModalComponent } from '../modal/modal.component'
import { SCModalSizeEnum } from '../modal/modal.interface'
import { SCCConfirmModalButtonConfig, SCCConfirmModalMessageConfig } from './confirm-modal.interface'

/**
 * Confirmation modal with confirm and cancel actions.
 */
@Component({
  selector: 'scc-confirm-modal',
  imports: [
    SCCCardTitleComponent,
    SCCModalComponent,
    SCCMessageComponent,
    SCCButtonComponent,
    LoadingAnimationV1Component,
  ],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SCCConfirmModalComponent {
  readonly scModalSize = input<keyof typeof SCModalSizeEnum>(SCModalSizeEnum['extra-small'])
  readonly scOnCancel = output<void>()
  readonly scOnSubmit = output<void>()
  readonly scTitle = input<string>('Confirm to Delete')
  readonly scMessageConfig = input<SCCConfirmModalMessageConfig>({
    message: '',
    type: SCCMessageType.reminder,
  })
  readonly scButtonConfig = input<SCCConfirmModalButtonConfig>({
    label: 'Yes',
    type: SCCButtonType.primary,
  })
  readonly scLabel = input<string>('delete?')
  readonly scData = input<unknown[]>([])
  /**
   * When true, shows a loading overlay inside the modal body.
   * Must live in projected modal content — nz-modal uses a CDK overlay, so a sibling
   * loader outside this component cannot stack above the dialog.
   */
  readonly scLoading = input(false)
}
