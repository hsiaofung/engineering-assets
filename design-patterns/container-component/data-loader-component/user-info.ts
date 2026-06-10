// user-info.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-user-info',
  standalone: true,
  template: `
    <div class="user-info">
      <h3>🎤 歌手資訊</h3>
      <p>ID: {{ user().id }}</p>
      <p>姓名: {{ user().name }}</p>
      <p>職位: {{ user().role }}</p>
    </div>
  `,
  styles: ['.user-info { padding: 15px; border: 1px dashed #e0e0e0; }']
})
export class UserInfoComponent {
  user = input.required<any>();
}