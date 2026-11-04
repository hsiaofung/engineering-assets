import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { NzTSType } from 'ng-zorro-antd/core/types'
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip'
import { DSTooltip } from './info-tooltip.interface'

/**
 * Info icon with tooltip content shown on hover.
 */
@Component({
  selector: 'app-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss'],
  imports: [NzTooltipDirective, SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * jsdoc v.1.0.1
 * @description
 * some description
 * @figma
 * https://www.figma.com/file/RtNXFNLK0oG19jWiVmni9n/SM-Design-System?node-id=1078%3A7185&mode=dev
 * @figmaProperties
State=Normal, Tooltip=False, Tooltip Location=Middle, Project=SCC
 * @ngZorroAntd
 * https://ng.ant.design/components/tooltip/en#nz-tooltip
 * @example
 * <app-info-tooltip
 *  [dsTooltipTitle]="'info-tooltip'"
 *  [dsTooltipPlacement]="'top'"
 * ></app-info-tooltip>
 * @param {string} nzTooltipPlacement - placement of the tooltip
 * @param {string} nzTooltipOverlayClassName - class name of the
 * @dependencies
 * @TODO
 * [ ] implement the @description content in jsdoc
 * [x] implement the @figma content in jsdoc
 * [x] implement the @property content in jsdoc
 * [x] implement the @ngZorroAntd content in jsdoc
 * [x] implement angular template
 * [x] implement angular component
 * [x] implement angular css
 * [ ] implement more args for ng-zorro
 * [ ] all component's args have 'ds' prefix
 * [x] implement the interface
 * [x] implement the general config if needed
 * [x] implement the @example content in jsdoc
 * [ ] implement the tests
 * [ ] implement a example at design-system component
 */
export class InfoTooltipComponent implements DSTooltip {
  /**
   */
  constructor() {}
  @Input() dsTooltipTitle: NzTSType
  @Input() dsTooltipPlacement: string
}
