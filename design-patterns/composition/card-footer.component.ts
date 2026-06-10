import { Component } from '@angular/core';

@Component({
  selector: 'app-card-footer',
  standalone: true,
  template: `
    <div class="card-footer">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card-footer {
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
      margin-top: 12px;
      color: #6b7280;
      font-size: 0.95rem;
    }
  `]
})
export class CardFooterComponent {}