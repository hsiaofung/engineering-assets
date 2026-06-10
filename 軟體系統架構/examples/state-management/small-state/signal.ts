import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <h2>{{ count() }}</h2>

    <button (click)="increment()">
      +1
    </button>
  `
})
export class CounterComponent {
  // local state
  count = signal(0);

  increment(): void {
    this.count.update(value => value + 1);
  }
}