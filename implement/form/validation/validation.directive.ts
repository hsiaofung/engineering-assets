import { Directive, ElementRef, inject, input, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { NgControl } from '@angular/forms'
import { Subscription } from 'rxjs'

/**
 *
 */
@Directive({
  selector: '[appValidation]',
  standalone: true,
})
export class ValidationDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef)
  private readonly renderer = inject(Renderer2)
  private readonly ngControl = inject(NgControl, { optional: true })

  readonly appValidation = input.required<Record<string, string>>()

  private sub?: Subscription
  private errorEl?: HTMLElement

  /**
   *
   */
  ngOnInit(): void {
    const control = this.ngControl?.control
    if (!control) return

    // status / value change
    this.sub = control.statusChanges.subscribe(() => this.update())
    control.valueChanges.subscribe(() => this.update())

    // Update when blur
    this.renderer.listen(this.el.nativeElement, 'blur', () => {
      control.markAsTouched()
      this.update()
    })

    this.update()
  }

  /**
   *
   */
  ngOnDestroy(): void {
    this.sub?.unsubscribe()
    this.errorEl?.remove()
  }

  /**
   *
   */
  private update(): void {
    const control = this.ngControl?.control
    if (!control) return

    const invalid = control.invalid && (control.dirty || control.touched)
    const message = invalid ? this.getMessage(control.errors) : ''

    // border
    if (invalid) {
      this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid #f24f7c')
      this.renderer.setStyle(this.el.nativeElement, 'height', '38px')
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'border')
      this.renderer.removeStyle(this.el.nativeElement, 'height')
    }

    // message
    if (message) {
      if (!this.errorEl) {
        this.errorEl = this.renderer.createElement('div')
        this.renderer.setStyle(this.errorEl, 'color', '#f24f7c')
        this.renderer.setStyle(this.errorEl, 'font-size', '12px')
        this.renderer.setStyle(this.errorEl, 'margin-top', '4px')
        this.renderer.appendChild(this.el.nativeElement.parentElement, this.errorEl)
      }
      this.renderer.setProperty(this.errorEl, 'textContent', message)
    } else if (this.errorEl) {
      this.errorEl.remove()
      this.errorEl = undefined
    }
  }

  /**
   * Returns the first matching validation message for the current control errors.
   * Returns an empty string when there are no errors or no matching message.
   * @param {Record<string, unknown> | null} errors - The validation errors of the form control.
   * @returns {string} The matching validation message, or an empty string when none is found.
   */
  private getMessage(errors: Record<string, unknown> | null): string {
    if (!errors) return ''
    const messages = this.appValidation()
    for (const key of Object.keys(errors)) {
      if (messages[key]) return messages[key]
    }
    return ''
  }
}
