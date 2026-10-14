# DataLoaderPollDirective 使用手冊

`DataLoaderPollDirective` 是掛在 `app-data-loader` 上的輪詢指令。當 `polling` 大於 `0` 時，會依指定毫秒週期自動呼叫 `DataLoaderComponent.refresh()`；若當下正在載入，則略過該次刷新，避免重疊請求。

---

## 1. 作用與限制

| 項目 | 說明 |
|------|------|
| 選擇器 | `app-data-loader[polling]`，必須寫在 `app-data-loader` 元素上，並帶 `polling` 屬性 |
| 依賴 | 以 `inject(DataLoaderComponent)` 取得**同一個宿主元件** |
| 預設 | `polling` 預設為 `0`，表示不輪詢 |
| 載入中行為 | `isLoading()` 為 `true` 時不呼叫 `refresh()` |
| 清理 | `effect` 的 `onCleanup` 會 `clearInterval`，避免記憶體洩漏 |
| 不負責 | 不決定要打哪個 API、不管理資料內容；只負責週期性觸發 loader 的 `refresh()` |

空 JSDoc（`/** */`）目前沒有額外說明，行為以原始碼為準。

---

## 2. 匯入與註冊

```ts
import { DataLoaderPollDirective } from './data-loader-poll.directive'
```

請把此 Directive 加到使用處的 `imports`（獨立元件）或對應 `NgModule`。宿主必須是 `DataLoaderComponent`（selector：`app-data-loader`）。

---

## 3. API

### 輸入 `polling`

```ts
readonly polling = input<number>(0)
```

| 值 | 行為 |
|----|------|
| `0` 或負數 | 不啟動計時器 |
| 正整數（毫秒） | 每 `polling` 毫秒檢查一次；未載入中則 `refresh()` |

`polling` 是 reactive `input()`。數值改變時，舊的 `setInterval` 會被清掉，再依新間隔重建。

---

## 4. 基本用法

```html
<app-data-loader [polling]="30000">
  <!-- 資料表格或其他內容 -->
</app-data-loader>
```

上例約每 30 秒刷新一次。

固定間隔也可寫死：

```html
<app-data-loader polling="10000">
```

注意：屬性綁定 `[polling]="10000"` 傳的是數字；靜態 `polling="10000"` 在部分情境會變成字串。此處 `input<number>` 預期數字，建議一律用屬性綁定。

---

## 5. 與元件狀態搭配

```ts
@Component({
  imports: [DataLoaderComponent, DataLoaderPollDirective],
  template: `
    <app-data-loader [polling]="pollIntervalMs()">
      <!-- ... -->
    </app-data-loader>
  `,
})
export class ExampleComponent {
  readonly pollIntervalMs = signal(15_000)
}
```

暫停輪詢：

```ts
this.pollIntervalMs.set(0)
```

恢復：

```ts
this.pollIntervalMs.set(15_000)
```

切換為 `<= 0` 時，effect 會先清掉既有 timer，再因條件不成立而不建立新 timer。

---

## 6. 執行流程

```
polling() 改變或首次執行
        │
        ├─ intervalMs <= 0  → 不設 timer，結束
        │
        └─ intervalMs > 0
              │
              └─ setInterval(intervalMs)
                    │
                    ├─ isLoading() === true  → 略過
                    └─ isLoading() === false → dataLoader.refresh()
```

重點：

1. 計時器依「牆上時鐘」固定間隔觸發，不是「上次 refresh 完成後再等 N 毫秒」。
2. 若單次載入時間長過輪詢間隔，中間的 tick 會被跳過，不會排隊疊加。
3. 載入結束後，下一個 tick 才會再 refresh。

舉例：間隔 5 秒，某次 `refresh()` 花了 12 秒，這 12 秒內的 tick 都會略過。

---

## 7. 建議間隔

| 場景 | 建議 |
|------|------|
| 儀表板、即時清單 | 10_000～30_000 |
| 後台管理、變動不頻繁 | 30_000～60_000 |
| 開發／除錯 | 可暫時用較短間隔，上線前改回合理值 |
| 使用者停在背景分頁 | 可視需求改為 `0`，減少無效請求 |

間隔過短容易造成伺服器壓力，且使用者體驗不一定更好。

---

## 8. 注意事項

1. **必須放在 `app-data-loader` 上**  
   選擇器是 `app-data-loader[polling]`。寫在子元素或別的元件上不會生效，也無法注入 `DataLoaderComponent`。

2. **同一個 loader 實例**  
   `inject(DataLoaderComponent)` 取的是宿主元件。不要把這個 directive 用在沒有 `DataLoaderComponent` 的節點。

3. **依賴 `isLoading()` 與 `refresh()`**  
   若 `DataLoaderComponent` 這兩個 API 行為變更（例如 `isLoading` 未涵蓋所有請求），輪詢結果會跟著變。

4. **頁面卸載會清理**  
   effect 銷毀時會 `clearInterval`，一般離開路由即可停止。

5. **多個 loader 各自輪詢**  
   頁面上有多個 `app-data-loader[polling]` 時，每個都有自己的 timer，互不共享。

6. **visibility 未處理**  
   原始碼沒有檢查分頁是否可見。使用者切到其他分頁時仍可能繼續打 API。若要省流量，需在外層把 `polling` 設為 `0`，或自行加上 `document.visibilityState` 判斷。

7. **ESLint selector 規則被關閉**  
   註解關閉了 `directive-selector`，因為選擇器刻意綁在既有元件標籤上，而不是 `appPoll` 這類屬性選擇器。

---

## 9. 與資料表格狀態一併使用

輪詢只負責「再跑一次 loader」。分頁、排序、篩選應仍由 `createDataTableState`（或同等狀態）提供；`refresh()` 應讀取當下那些 signal，而不是回到預設查詢。

```html
<app-data-loader [polling]="30_000" (load)="loadRows()">
  <app-data-table-v1
    [page]="table.page()"
    [pageSize]="table.pageSize()"
    [sortState]="table.sortState()"
    [filterState]="table.filterState()"
    (pageChange)="table.onPageChange($event)"
    (sortChange)="table.onSortChange($event)"
    (filterChange)="table.onFilterChange($event)"
  />
</app-data-loader>
```

`loadRows()` 內使用當前的 `table.page()` 等值即可。輪詢不會重設頁碼或篩選。

（`(load)`、內部綁定名稱請改成你們 `DataLoaderComponent` 實際 API。）

---

## 10. 最小行為對照

| 操作 | 預期 |
|------|------|
| 不寫 `polling` 或值為 `0` | 不輪詢 |
| `[polling]="5000"` | 每 5 秒嘗試 refresh |
| 載入進行中 | 該次 tick 不做任何事 |
| 把 `polling` 改成 `0` | 停止既有 timer |
| 把 `polling` 從 `5000` 改成 `15000` | 清掉舊 timer，改以 15 秒間隔重開 |

---

若需要，我可以再補一份「如何在隱藏分頁時自動暫停」的外層寫法，或依你們 `DataLoaderComponent` 的實際 Input／Output 改成可直接貼上的完整範例。