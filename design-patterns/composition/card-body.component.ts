import { Component } from '@angular/core';

@Component({
  selector: 'app-card-body',
  standalone: true,
  template: `
    <div class="card-body">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card-body {
      color: #374151;
      margin-bottom: 12px;
    }
  `]
})
export class CardBodyComponent {}