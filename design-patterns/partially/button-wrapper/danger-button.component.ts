// danger-button.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-danger-button',
  template: `<app-button text="{{text}}" size="large" color="red"></app-button>`
})
export class DangerButtonComponent {
  @Input() text: string = '';
}