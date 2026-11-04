# Notification Operators

根據 Observable 結果顯示 toast 的 RxJS operators。

## `notifyResult`

當 Observable 完成或發生錯誤時，顯示成功或失敗的 toast。

### 簽章

```ts
function notifyResult<T>(
  notificationService: NotificationService,
  successMessage?: string,
): OperatorFunction<T, T>
```

### 行為

| 結果 | Toast |
|------|-------|
| `next` | `sendSuccessfully` preset，訊息為 `successMessage`（預設：`"Submit Successfully"`） |
| `error` | `sendFailed` preset，訊息為`"Submit failed"`，子訊息為 `err.error.error.message`  |

Operator 會重新拋出錯誤，下游的 `subscribe({ error })` 仍可接收到。

### 使用方式

```ts
import { inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NotificationService } from './notification.service'
import { notifyResult } from './notification.operators'

@Component({ /* ... */ })
export class DeployOsComponent {
  private readonly http = inject(HttpClient)
  private readonly notificationService = inject(NotificationService)

  submit(): void {
    this.http
      .post('/compute-service/v1/systems/actions/deploy-os', body)
      .pipe(notifyResult(this.notificationService))
      .subscribe({
        next: () => this.closeModal(),
        error: (err) => console.error(err),
      })
  }
}
```
### 注意事項

- 需要在 `notification.constant.ts` 裡有 `sendSuccessfully` 和 `sendFailed` preset。
- 錯誤 toast 的顏色來自 `sendFailed` preset 的 `bgColor`（或 component 預設值）。
- 不會吞掉錯誤；呼叫端仍可在 `subscribe` 裡處理。