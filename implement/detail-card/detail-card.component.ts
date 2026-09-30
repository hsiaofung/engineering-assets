import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'

/**
 *
 */
@Component({
  selector: 'app-detail-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail-card.component.html',
  styleUrl: './detail-card.component.scss',
})
export class DetailCardComponent {
  readonly title = input.required<string>()
  readonly editing = input(false)
  readonly saving = input(false)
  readonly model = input<Record<string, string | null>>({})
  readonly valueChange = output<{ key: string; value: string }>()

  /**
   * Returns the current field value for the given key.
   * @param {string} key - The field key to read from the model.
   * @returns {string | null} The field value, or `null` when it is missing.
   */
  valueOf(key: string): string | null {
    return this.model()[key] ?? null
  }

  /**
   * Emits a field value change to the parent component.
   * @param {string} key - The field key that changed.
   * @param {string} value - The new field value.
   */
  emitValue(key: string, value: string): void {
    this.valueChange.emit({ key, value })
  }
}
