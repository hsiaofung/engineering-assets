// danger-button.component.ts
import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-danger-button',
  template: `<app-button [text]="text" [size]="size" [color]="color"></app-button>`,
})
export class DangerButtonComponent extends ButtonComponent {
  override size: 'small' | 'large' = 'large';
  override color: 'red' | 'green' = 'red';
}