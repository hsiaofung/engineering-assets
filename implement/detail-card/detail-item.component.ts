import { KeyValuePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { DetailCardComponent } from './detail-card.component'

/**
 *
 */
@Component({
  selector: 'app-detail-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KeyValuePipe, FormsModule, NzInputModule, NzSelectModule],
  templateUrl: './detail-item.component.html',
  styleUrl: './detail-item.component.scss',
  host: { class: 'detail-item', '[class.detail-item--stack]': 'editing()' },
})
export class DetailItemComponent {
  private readonly card = inject(DetailCardComponent)

  readonly key = input.required<string>()
  readonly label = input.required<string>()
  readonly readonly = input(false)
  readonly options = input<Record<string, string> | null>(null)
  readonly variant = input<'text' | 'tag'>('text')

  protected readonly rawValue = computed(() => this.card.valueOf(this.key()))
  protected readonly editing = computed(() => this.card.editing() && !this.readonly() && !this.card.saving())
  protected readonly display = computed(() => this.toDisplay(this.rawValue()))
  protected readonly viewClass = computed(() => {
    if (this.variant() !== 'tag' || this.display() === '-') {
      return ''
    }
    return 'detail-item__tag'
  })

  /**
   * Forwards the input or select value change to the parent card.
   * @param {Event} event - The input or change event from the field control.
   */
  protected onInput(event: Event): void {
    this.card.emitValue(this.key(), (event.target as HTMLInputElement | HTMLSelectElement).value)
  }

  /**
   * Formats a field value for read-only display.
   * Empty values become `-`. When options exist, the matching option label is used.
   * @param {string | null} value - The raw field value.
   * @returns {string} The display label, or `-` when the value is empty.
   */
  private toDisplay(value: string | null): string {
    if (value === null || value === undefined || value === '') {
      return '-'
    }
    const options = this.options()
    if (!options) {
      return value
    }
    const normalized = value.trim().replace(/^0x/i, '').toUpperCase().replace(/^0+/, '') || '0'
    return options[value] ?? options[normalized] ?? value
  }

  /**
   * Forwards a selected option value to the parent card.
   * @param {string} value - The selected option value.
   */
  protected onSelect(value: string): void {
    this.card.emitValue(this.key(), value)
  }
}
