// info-tooltip.directive.ts
import { Directive, effect, ElementRef, inject, input, Renderer2, ViewContainerRef } from '@angular/core'
import { InfoTooltipComponent } from '../tooltip/info-tooltip/info-tooltip.component'

/**
 *
 */
@Directive({
  selector: '[appInfo]',
  standalone: true,
})
export class InfoTooltipDirective {
  private readonly el = inject(ElementRef)
  private readonly renderer = inject(Renderer2)
  private readonly vcr = inject(ViewContainerRef)

  readonly appInfo = input.required<string>()

  /**
   *
   */
  constructor() {
    effect(() => {
      this.vcr.clear()
      const ref = this.vcr.createComponent(InfoTooltipComponent)
      ref.setInput('dsTooltipTitle', this.appInfo())
      ref.setInput('dsTooltipPlacement', 'top')

      const host = ref.location.nativeElement
      this.renderer.setStyle(host, 'display', 'inline-flex')
      this.renderer.setStyle(host, 'vertical-align', 'middle')
      this.renderer.setStyle(host, 'margin-left', '4px')

      this.renderer.appendChild(this.el.nativeElement, host)
    })
  }
}
