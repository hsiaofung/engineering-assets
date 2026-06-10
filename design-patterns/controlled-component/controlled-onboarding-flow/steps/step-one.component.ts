import {
  Component,
  output
} from '@angular/core';

@Component({
  selector: 'app-step-one',
  standalone: true,
  template: `
    <h2>Step 1</h2>

    <button (click)="nextStep()">
      Next
    </button>
  `
})
export class StepOneComponent {

  next = output<any>();

  nextStep(): void {
    this.next.emit({
      name: 'Tim'
    });
  }

}