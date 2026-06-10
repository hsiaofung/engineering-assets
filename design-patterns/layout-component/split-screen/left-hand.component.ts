// left-hand.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-left-hand-component',
  standalone: true,
  template: `
    <div class="left-content">
      <h2>Left Pane</h2>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [` .left-content { padding: 20px; background: #f0f8ff; height: 100%; } `]
})
export class LeftHandComponent {
  @Input() message = 'Left Default';
}