import {
  Component,
  output
} from '@angular/core';

@Component({
  selector: 'app-step-two',
  standalone: true,
  template: `
    <h2>Step 2</h2>

    <button (click)="nextStep()">
      Next
    </button>
  `
})
export class StepTwoComponent {

  next = output<any>();

  nextStep(): void {
    this.next.emit({
      age: 40
    });
  }

}