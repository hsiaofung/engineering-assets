// app.component.ts
import { Component } from '@angular/core';
import { DataLoaderComponent } from './data-loader.component';
import { UserInfoComponent } from './user-info.component';
import { getMockUser } from './user-api'; // 匯入剛剛寫的模擬函數

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DataLoaderComponent, UserInfoComponent],
  template: `
    <div style="padding: 20px;">
      <h2>進化版：函數驅動 Data Loader</h2>

      <app-data-loader [getDataFn]="myFetchFn" #loader="dataLoader">
        
        @if (loader.isLoading()) {
          <p>⏳ 正在讀取非同步函數結果...</p>
        } @else if (loader.data()) {
          
          <app-user-info [user]="loader.data()"></app-user-info>
          
        }
        
      </app-data-loader>
    </div>
  `
})
export class AppComponent {
  // 建立你要傳進去的函數
  myFetchFn = getMockUser('345'); 
}