import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core'

/**
 *
 */
@Directive({
  selector: '[appRequired]',
})
export class RequiredDirective implements OnInit {
  private readonly el = inject(ElementRef)
  private readonly renderer = inject(Renderer2)

  /**
   *
   */
  ngOnInit(): void {
    const span = this.renderer.createElement('span')
    this.renderer.addClass(span, 'app-required')
    this.renderer.setProperty(span, 'textContent', '*')
    this.renderer.appendChild(this.el.nativeElement, span)
  }
}
