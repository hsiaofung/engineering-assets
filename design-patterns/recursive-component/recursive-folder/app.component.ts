import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RecursiveNodeComponent],
  template: `
    <h2>巢狀資料展示</h2>
    <app-recursive-node 
      [node]="treeData" 
      labelKey="name" 
      childrenKey="children">
    </app-recursive-node>
  `
})
export class AppComponent {
  treeData = {
    name: '根目錄',
    children: [
      {
        name: '資料夾 A',
        children: [
          { name: '檔案 A1' },
          { 
            name: '資料夾 A2', 
            children: [{ name: '檔案 A2-1' }] 
          }
        ]
      },
      {
        name: '資料夾 B',
        children: [
          { name: '檔案 B1' }
        ]
      }
    ]
  };
}