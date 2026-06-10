import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  shouldShow = false;

  open() {
    this.shouldShow = true;
  }

  close() {
    this.shouldShow = false;
  }
}