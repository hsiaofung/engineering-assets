import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
import { DSInputStatus } from '@app/shared/design-system/global-component/input-box/input/input.interface'
import { SvgIconComponent } from 'angular-svg-icon'
import { NzInputDirective, NzInputSuffixDirective, NzInputWrapperComponent } from 'ng-zorro-antd/input'
import { map } from 'rxjs/operators'
import { DSInputPassword } from './input-password.interface'

/**
 * Password input with show/hide toggle.
 * Integrates with Angular Forms via `ControlValueAccessor`.
 */
@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputPasswordComponent),
    },
  ],
  imports: [ReactiveFormsModule, NzInputWrapperComponent, NzInputDirective, NzInputSuffixDirective, SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPasswordComponent implements ControlValueAccessor, DSInputPassword {
  private readonly destroyRef = inject(DestroyRef)

  readonly maxlength = input('9999')
  readonly placeholder = input('')
  /**
   * Browser autocomplete token. Default is unset so no attribute is emitted;
   * callers opt in per form (`new-password`, `current-password`, …).
   */
  readonly autocomplete = input<string | undefined>(undefined)
  readonly dsStatus = input<keyof typeof DSInputStatus>('default')
  readonly dsBlur = output<void>()

  protected readonly showPassword = signal(false)
  protected readonly inputType = computed(() => (this.showPassword() ? 'text' : 'password'))
  // 18px is the size the only design using this component specifies (#143). Blue while the raw
  // value is showing, grey while it is masked — the state is the colour, not a second glyph.
  protected readonly eyeIconStyle = computed(() => ({
    color: this.showPassword() ? 'var(--primary-color-1)' : 'var(--shades-color-4)',
    'width.px': 18,
    'height.px': 18,
  }))

  protected readonly form = new FormGroup({
    value: new FormControl('', { nonNullable: true }),
  })

  private onTouchedCallback: () => void = () => undefined

  /**
   * @param {string | null} value
   */
  writeValue(value: string | null): void {
    this.form.setValue({ value: value ?? '' }, { emitEvent: false })
  }

  /**
   * @param {(value: string) => void} fn
   */
  registerOnChange(fn: (value: string) => void): void {
    this.form.valueChanges
      .pipe(
        map((formValue) => formValue.value ?? ''),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(fn)
  }

  /**
   * @param {() => void} fn
   */
  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn
  }

  /**
   * @param {boolean} isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false })
      return
    }
    this.form.enable({ emitEvent: false })
  }

  /** Marks the control as touched and emits blur. */
  protected handleBlur(): void {
    this.dsBlur.emit()
    this.onTouchedCallback()
  }

  /** Toggles password visibility. */
  protected togglePasswordVisibility(): void {
    if (this.form.disabled) {
      return
    }
    this.showPassword.update((visible) => !visible)
  }
}
