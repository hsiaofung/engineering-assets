import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-recursive-node",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./recursive-node.component.html",
  styleUrls: ["./recursive-node.component.css"],
})
export class RecursiveNodeComponent {
  @Input() data: any;
  @Input() key: string = ""; // 目前層級的 key 名稱

  isObject(value: any): boolean {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  getEntries(obj: any): { key: string; value: any }[] {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }
}
