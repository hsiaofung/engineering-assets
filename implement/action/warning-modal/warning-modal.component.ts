import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { SCCButtonComponent } from '../button/button/button.component'
import { SCCModalComponent } from '../modal/modal.component'
import { SCCWarningModalIcon } from './warning-modal.interface'

/**
 *
 */
@Component({
  selector: 'scc-warning-modal',
  imports: [SCCModalComponent, SCCButtonComponent, SvgIconComponent],
  templateUrl: './warning-modal.component.html',
  styleUrl: './warning-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SCCWarningModalComponent {
  scIcon = input<SCCWarningModalIcon>({
    src: 'assets/design-system/icons/warning.svg',
    color: 'var(--status-dark-yellow-1)',
  })
  scTitle = input<string>('Title')
  scDescription = input<string>('Description')
  scButtonLabel = input<string>('OK')
  scOnCancel = output<void>()
}
