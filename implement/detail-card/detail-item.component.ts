import { KeyValuePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SCCTimePickerComponent } from '@app/shared/design-system/global-component/picker/date-time-picker/date-time-picker.component'
import { DateTimePickerValue } from '@app/shared/design-system/global-component/picker/date-time-picker/date-time-picker.types'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { DetailCardComponent } from './detail-card.component'

/**
 *
 */
@Component({
  selector: 'app-detail-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KeyValuePipe, FormsModule, NzInputModule, NzSelectModule, SCCTimePickerComponent],
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

  readonly editor = input<'text' | 'date'>('text')
  protected readonly pickerValue = computed((): Date | null => {
    const raw = this.rawValue()
    if (!raw) {
      return null
    }
    const parsed = new Date(raw.includes('T') ? raw : raw.replace(/\//g, '-'))
    return Number.isNaN(parsed.getTime()) ? null : parsed
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

  /**
   * Forwards a date-time picker value to the parent card as a formatted minute string.
   * Clears the field when the picker value is empty.
   * @param {DateTimePickerValue} value - The selected date, date range, or empty picker value.
   */
  protected onDateChange(value: DateTimePickerValue): void {
    const date = value instanceof Date ? value : Array.isArray(value) ? value[0] : null
    this.card.emitValue(this.key(), date ? this.formatMinute(date) : '')
  }

  /**
   * Formats a date as `YYYY/MM/DD HH:mm`.
   * @param {Date} value - The date to format.
   * @returns {string} The formatted date and time, truncated to the minute.
   */
  private formatMinute(value: Date): string {
    const pad = (part: number) => String(part).padStart(2, '0')
    return `${value.getFullYear()}/${pad(value.getMonth() + 1)}/${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}`
  }
}
