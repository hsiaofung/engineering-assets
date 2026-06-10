// success-button.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-button',
  template: `<app-button [text]="text || 'Success!!!!!'" size="large" color="green"></app-button>`
})
export class SuccessButtonComponent {
  @Input() text?: string;
  @Input() size: 'small' | 'large' = 'large';
}