import { InputSignal, OutputEmitterRef } from '@angular/core'
import { DSInputStatus } from '@app/shared/design-system/global-component/input-box/input/input.interface'

/** Public API contract for the design-system password input. */
export interface DSInputPassword {
  maxlength: InputSignal<string>
  placeholder: InputSignal<string>
  /** Browser autocomplete token; omit to emit no attribute. */
  autocomplete: InputSignal<string | undefined>
  dsStatus: InputSignal<keyof typeof DSInputStatus>
  dsBlur: OutputEmitterRef<void>
}
