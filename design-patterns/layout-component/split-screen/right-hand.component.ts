// right-hand.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-right-hand-component',
  standalone: true,
  template: `
    <div class="right-content">
      <h2>Right Pane</h2>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [` .right-content { padding: 20px; background: #fff0f8; height: 100%; } `]
})
export class RightHandComponent {
  @Input() message = 'Right Default';
}