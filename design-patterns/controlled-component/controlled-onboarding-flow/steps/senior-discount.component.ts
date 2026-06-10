import {
  Component,
  output
} from '@angular/core';

@Component({
  selector: 'app-senior-discount',
  standalone: true,
  template: `
    <h2>
      Congratulations!
      You qualify for senior discount.
    </h2>

    <button (click)="next.emit({})">
      Next
    </button>
  `
})
export class SeniorDiscountComponent {

  next = output<any>();

}