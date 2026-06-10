import { Component } from '@angular/core';
import { CardComponent } from './card/card.component';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardBodyComponent } from './card-body/card-body.component';
import { CardFooterComponent } from './card-footer/card-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent { }