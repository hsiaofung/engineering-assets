// app.component.ts
import { Component } from '@angular/core';
import { DataLoaderComponent } from './data-loader.component';
import { UserViewComponent } from './user-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DataLoaderComponent, UserViewComponent],
  template: `
    <div style="padding: 20px;">
      <h1>Angular Template Context 範例</h1>
      
      <app-data-loader url="/api/users/123" #myLoader="dataLoader">
        
        @if (myLoader.isLoading()) {
          <div class="spinner">正在努力加載中，請稍候...</div>
        } @else if (myLoader.error()) {
          <div class="error">{{ myLoader.error() }}</div>
        } @else if (myLoader.data()) {
          
          <app-user-view [user]="myLoader.data()"></app-user-view>
          
        }
        
      </app-data-loader>
    </div>
  `,
  styles: [`
    .spinner { color: #007bff; font-weight: bold; }
    .error { color: red; }
  `]
})
export class AppComponent {}