import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-header',
  standalone: true,
  template: `
    <h3 class="card-header">{{ title }}</h3>
  `,
  styles: [`
    .card-header {
      margin: 0 0 12px 0;
      font-size: 20px;
      font-weight: bold;
      color: #1f2937;
    }
  `]
})
export class CardHeaderComponent {
  @Input() title: string = '';
}