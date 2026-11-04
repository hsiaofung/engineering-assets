import { Directive, ElementRef, Renderer2, inject, OnInit } from '@angular/core'

@Directive({
  selector: '[appRequired]',
  standalone: true,
})
export class RequiredDirective implements OnInit {
  private readonly el = inject(ElementRef)
  private readonly renderer = inject(Renderer2)

  ngOnInit(): void {
    const span = this.renderer.createElement('span')
    this.renderer.addClass(span, 'required')
    this.renderer.setProperty(span, 'textContent', '*')
    this.renderer.setStyle(span, 'color', '#f24f7c')
    this.renderer.setStyle(span, 'padding-left', '4px')
    this.renderer.appendChild(this.el.nativeElement, span)
  }
}