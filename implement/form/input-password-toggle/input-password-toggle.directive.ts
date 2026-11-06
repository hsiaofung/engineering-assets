import { afterNextRender, computed, Directive, ElementRef, inject, Renderer2, signal } from '@angular/core'

/**
 *
 */
@Directive({
  selector: 'input[appPasswordToggle]',
  standalone: true,
  host: {
    '[type]': 'inputType()',
  },
})
export class PasswordToggleDirective {
  private readonly el = inject(ElementRef<HTMLInputElement>)
  private readonly renderer = inject(Renderer2)

  private readonly show = signal(false)
  protected readonly inputType = computed(() => (this.show() ? 'text' : 'password'))

  private button: HTMLButtonElement | null = null

  /**
   *
   */
  constructor() {
    afterNextRender(() => this.createToggleButton())
  }

  /**
   *
   */
  private createToggleButton(): void {
    const input = this.el.nativeElement
    const wrapper = this.renderer.parentNode(input) as HTMLElement
    if (!wrapper) return

    this.renderer.setStyle(wrapper, 'position', 'relative')
    this.renderer.setStyle(input, 'padding-right', '36px')

    const button = this.renderer.createElement('button')
    this.renderer.setAttribute(button, 'type', 'button')
    this.renderer.addClass(button, 'password-toggle')
    this.renderer.setAttribute(button, 'aria-label', 'Show password')

    this.renderer.setStyle(button, 'position', 'absolute')
    this.renderer.setStyle(button, 'right', '8px')
    this.renderer.setStyle(button, 'border', 'none')
    this.renderer.setStyle(button, 'background', 'transparent')
    this.renderer.setStyle(button, 'cursor', 'pointer')
    this.renderer.setStyle(button, 'padding', '0')
    this.renderer.setStyle(button, 'display', 'flex')
    this.renderer.setStyle(button, 'align-items', 'center')
    this.renderer.setStyle(button, 'line-height', '1')

    this.renderer.listen(button, 'click', () => this.toggle())

    button.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`

    this.renderer.setStyle(button, 'color', 'var(--shades-color-4)')
    this.renderer.appendChild(wrapper, button)
    this.button = button

    // Reposition after the element has a height.
    const observer = new ResizeObserver(() => {
      if (input.offsetHeight > 0) {
        const top = input.offsetTop + input.offsetHeight / 2
        this.renderer.setStyle(button, 'top', `${top}px`)
        this.renderer.setStyle(button, 'transform', 'translateY(-50%)')
        observer.disconnect()
      }
    })
    observer.observe(input)
  }

  /**
   *
   */
  private toggle(): void {
    this.show.update((v) => !v)
    if (this.button) {
      const color = this.show() ? 'var(--primary-color-1)' : 'var(--shades-color-4)'
      this.renderer.setStyle(this.button, 'color', color)
      this.renderer.setAttribute(this.button, 'aria-label', this.show() ? 'Hide password' : 'Show password')
      this.renderer.setAttribute(this.button, 'aria-pressed', String(this.show()))
    }
  }
}
