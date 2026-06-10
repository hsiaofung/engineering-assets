// layout-wrapper.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-wrapper',
  standalone: true,
  template: `
    <div class="section">
      <div class="center-line">
        <div class="highlight">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .section { /* 樣式 */ }
    .center-line { /* 樣式 */ }
    .highlight { /* 樣式 */ }
  `]
})
export class LayoutWrapperComponent { }