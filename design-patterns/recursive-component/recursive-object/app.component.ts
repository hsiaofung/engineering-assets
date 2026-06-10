import { Component } from '@angular/core';
import { RecursiveNodeComponent } from './recursive-node/recursive-node.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RecursiveNodeComponent],
  template: `
    <h2>巢狀物件展示（Angular 遞迴元件）</h2>
    <ul class="root-list">
      <app-recursive-node [data]="nestedObject"></app-recursive-node>
    </ul>
  `
})
export class AppComponent {
  nestedObject = {
    a: 1,
    b: {
      b1: 4,
      b2: {
        b23: 'Hello',
      },
      b3: {
        b31: {
          message: 'Hi',
        },
        b32: {
          message: 'Hi',
        }
      }
    },
    c: {
      c1: 2,
      c2: 3,
    }
  };
}