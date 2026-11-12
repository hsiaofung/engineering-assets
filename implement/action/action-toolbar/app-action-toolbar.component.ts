import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { ActionKey } from '@app/core-modules-scc4/compute/actions/compute-action.types'
import { SCCIconButtonGroupComponent } from '@app/shared/design-system/global-component/button/icon-button-group/icon-button-group.component'
import { SCCIconButtonComponent } from '@app/shared/design-system/global-component/button/icon-button/icon-button.component'
import {
  SCCIconButtonDropdownClickEvent,
  SCCIconButtonDropdownItem,
} from '@app/shared/design-system/global-component/button/icon-button/icon-button.interface'
import { ActionButtonConfig, ActionMenuItemConfig } from '@app/shared/design-system/global-component/data-table-v1'

/**
 *
 */
@Component({
  selector: 'app-action-toolbar',
  standalone: true,
  imports: [SCCIconButtonGroupComponent, SCCIconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <scc-icon-button-group>
      @for (a of actions(); track a.key) {
        @if (a.type === 'dropdown' && a.menuItems?.length) {
          <scc-icon-button
            [scSrc]="a.icon"
            [scDisabled]="a.disabled"
            [scTooltipTitle]="a.tooltip"
            [scDisabledTooltip]="a.disabledTooltip"
            [scDropdownConfig]="toDropdownConfig(a)"
            (scDropdownClick)="onDropdownClick($event)"
          />
        } @else {
          <scc-icon-button
            [scSrc]="a.icon"
            [scDisabled]="a.disabled"
            [scTooltipTitle]="a.tooltip"
            [scDisabledTooltip]="a.disabledTooltip"
            (click)="onActionClick(a.key)"
          />
        }
      }
    </scc-icon-button-group>
  `,
})
export class ActionToolbarComponent {
  readonly actions = input.required<ActionButtonConfig[]>()
  readonly actionClick = output<ActionKey>()

  /**
   * Converts an action button configuration into dropdown items.
   * @param {ActionButtonConfig} action - The action button configuration.
   * @returns {SCCIconButtonDropdownItem[]} The dropdown items for the action.
   */
  toDropdownConfig(action: ActionButtonConfig) {
    return action.menuItems?.map((item) => this.toDropdownItem(item)) ?? []
  }

  /**
   * Converts a menu item configuration into a dropdown item.
   * Recursively converts nested children.
   * @param {ActionMenuItemConfig} item - The menu item configuration.
   * @returns {SCCIconButtonDropdownItem} The dropdown item.
   */
  toDropdownItem(item: ActionMenuItemConfig): SCCIconButtonDropdownItem {
    return {
      label: item.label,
      value: item.value,
      disabled: item.disabled,
      disabledTooltip: item.disabledTooltip,
      children: item.children?.map((child) => this.toDropdownItem(child)),
    }
  }

  /**
   * Runs a toolbar action.
   * @param {string} key - The action key to run.
   */
  onActionClick(key: string): void {
    this.actionClick.emit(key as ActionKey)
  }

  /**
   * Runs the action selected from a dropdown.
   * @param {SCCIconButtonDropdownClickEvent} event - The dropdown click event.
   */
  onDropdownClick(event: SCCIconButtonDropdownClickEvent): void {
    this.actionClick.emit(event.value as ActionKey)
  }
}
