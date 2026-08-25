# 檔案架構

| 檔案                                | 責任                                         |
| ----------------------------------- | -------------------------------------------- |
| `compute-resource-resolve.guard.ts` | `/resource/:resourceId` → resolve + redirect |
| `compute-ancestor.service.ts`       | 呼叫 Ancestor API                            |
| `compute-route.builder.ts`          | Context → canonical URL                      |
| `compute-resource-context.model.ts` | 定義 resolve 後的 context                    |

# 流程

```text
                    /compute/resource/SYS-001
                              │
                              ▼
                 computeResourceResolveGuard
                              │
                              ▼
              GET .../systems/SYS-001/redirection
                              │
                              ▼
                    ComputeResourceContext
                              │
                              ▼
                    ComputeRouteBuilder
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
          unassigned=true          unassigned=false
                 │                         │
                 ▼                         ▼
       /virtual-pool/...          /physical-pool/...
```

---

# Usage

如果你現在已經確定採用 **Resource-based Entry Point**：

```text
/compute/resource/:resourceId
        ↓
Guard
        ↓
Ancestor API
        ↓
Canonical URL
```

那 `ipAddress` 欄位的 click 行為應該非常單純。

**Component 不應該自己查 Ancestor API，也不應該自己判斷 physical / virtual。**

### Component

假設 table row 裡有 `systemId`：

```ts
onIpAddressClick(systemId: string): void {
  this.router.navigate(['/compute/resource', systemId]);
}
```

需要：

```ts
import { Router } from '@angular/router';

private readonly router = inject(Router);
```

Template：

```html
<a (click)="onIpAddressClick(row.systemId)" (keydown.enter)="onIpAddressClick(row.systemId)" tabindex="0">
  {{ row.ipAddress }}
</a>
```

如果你使用 NG-ZORRO，也可以依你現在 table 的寫法套到 `<a>`。

### Route 設定
```ts
export const COMPUTE_ROUTES: Routes = [
  {
    path: 'resource/:resourceId',
    component: ComputeResourceEntryComponent, //需要設定一個空元件，避免canActivate需要元件的bug 
    canActivate: [computeResourceResolveGuard],
  },
]  
```
---

### 整個 flow

例如 User 點：

```text
192.168.1.100
```

FE 只知道：

```text
systemId = SYS-001
```

所以：

```text
IP Address click
      ↓
router.navigate()
      ↓
/compute/resource/SYS-001
      ↓
computeResourceResolveGuard
      ↓
GET /rackconfig-service/v1/device-info/systems/SYS-001/redirection
      ↓
unassigned = false
      ↓
ComputeRouteBuilder
      ↓
/compute/Pod/physical-pool/appliance/SYS-001
```

這樣 **IP Address click 的責任非常乾淨**：

> **只負責把 Resource ID 送進 Resource Entry Point。**

---

### 我會特別避免這種寫法

不要：

```ts
async onIpAddressClick(systemId: string) {
  const context = await this.api.getAncestor(systemId);

  if (context.unassigned) {
    this.router.navigate([
      '/compute/Pod/virtual-pool/appliance',
      systemId,
    ]);
  } else {
    this.router.navigate([
      '/compute/Pod/physical-pool/appliance',
      systemId,
    ]);
  }
}
```

因為這樣你的 **Resource List Component 又開始知道 routing resolution 規則**。

最後會變成：

```text
List Component
 ├── Ancestor API
 ├── physical / virtual 判斷
 └── URL construction
```

而我們現在的設計就是要避免這件事。

所以你這個欄位的 technical behavior 可以寫成一句：

> **Clicking the IP address navigates to `/compute/resource/{systemId}`, where the resource resolve guard resolves the resource context and redirects to the canonical Compute route.**

這個描述我覺得很適合直接放進你的 **Compute Resource List technical design**。
