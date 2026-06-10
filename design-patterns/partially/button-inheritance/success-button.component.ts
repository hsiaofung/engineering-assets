// success-button.component.ts
import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-success-button',
  template: `<app-button [text]="text" [size]="size" [color]="color"></app-button>`,
})
export class SuccessButtonComponent extends ButtonComponent {
  override size: 'small' | 'large' = 'small';
  override color: 'red' | 'green' = 'green';
  override text: string = 'Success!!!!!';
}