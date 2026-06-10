// user-view.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-user-view',
  standalone: true,
  template: `
    <div class="user-profile">
      <h2>📇 用戶名片 (獨立組件)</h2>
      <hr>
      <p><strong>姓名：</strong> {{ user().name }}</p>
      <p><strong>信箱：</strong> {{ user().email }}</p>
      <p><strong>電話：</strong> {{ user().phone }}</p>
    </div>
  `,
  styles: [`
    .user-profile {
      border: 1px solid #ddd;
      padding: 20px;
      border-radius: 12px;
      background-color: #fafafa;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      max-width: 350px;
    }
  `]
})
export class UserViewComponent {
  // 使用 Angular 現代的 Signal Input
  user = input.required<any>();
}