import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-regular-list',
  templateUrl: './regular-list.component.html',
})
export class RegularListComponent {
  @Input() items: any[] = [];

  @Input() itemTemplate!: TemplateRef<any>;
}