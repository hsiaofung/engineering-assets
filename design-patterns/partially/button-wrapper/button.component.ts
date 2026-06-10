// button.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button [ngClass]="['btn', 'btn-' + color, 'btn-' + size]">
      {{ text }}
    </button>
  `,
  styles: [`
    .btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-large { font-size: 18px; }
    .btn-small { font-size: 14px; }
    .btn-red { background-color: #dc3545; color: white; }
    .btn-green { background-color: #28a745; color: white; }
  `]
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() size: 'small' | 'large' = 'large';
  @Input() color: 'red' | 'green' = 'green';
}