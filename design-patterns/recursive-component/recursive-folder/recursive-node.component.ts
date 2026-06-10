import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recursive-node',
  templateUrl: './recursive-node.component.html',
  standalone: true,   // Angular 14+ 推薦使用 Standalone
})
export class RecursiveNodeComponent {
  
  @Input() node: any;           // 接收目前節點資料
  @Input() labelKey: string = 'name';   // 可自訂顯示的標籤欄位名稱
  @Input() childrenKey: string = 'children'; // 可自訂子節點欄位名稱
}