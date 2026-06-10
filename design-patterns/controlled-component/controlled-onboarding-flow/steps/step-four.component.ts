import {
  Component,
  output
} from '@angular/core';

@Component({
  selector: 'app-step-four',
  standalone: true,
  template: `
    <h2>Step 4</h2>

    <button (click)="next.emit({})">
      Finish
    </button>
  `
})
export class StepFourComponent {

  next = output<any>();

}