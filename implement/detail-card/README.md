# detail-card / detail-item

用於 compute 總覽頁面（FRU、DMI，以及之後的頁面）的展示型欄位卡片。

卡片負責標題、編輯／儲存／錯誤的外觀，以及目前的欄位對應。每個 item 渲染一列 label／value，並把變更寫回卡片。API payload 的對應與 PATCH 發送仍留在頁面層。

## 位置

`compute/components/detail-card/`

## 職責

| 元件 | 負責 | 不負責 |
| --- | --- | --- |
| app-detail-card | 標題、編輯、儲存、錯誤覆蓋層、model、valueChange | HTTP、PATCH body、欄位清單 |
| app-detail-item | 單列：文字、選單、日期、標籤、唯讀 | 知道自己在哪個頁面 |

item 必須投影在 card 內部。它透過 `inject(DetailCardComponent)` 讀取 model。

## 頁面契約

```html
<app-detail-card
  title="Chassis"
  [editing]="editing()"
  [saving]="saving()"
  [error]="!!dataLoader.error()"
  [model]="sectionModel('chassis', dataLoader.data())"
  (valueChange)="onFieldChange('chassis', $event.key, $event.value)"
>
  <app-detail-item key="serialNumber" label="Serial Number" />
  <app-detail-item key="type" label="Type" [options]="chassisType" />
</app-detail-card>
```

`model` 是僅屬於該卡片的 `Record<string, string | null>`。`valueChange` 發出 `{ key, value }`。

## Item 輸入

| 輸入 | 效果 |
| --- | --- |
| key | model 中的欄位鍵 |
| label | 列標籤 |
| readonly | 一律唯讀，即使頁面處於編輯狀態 |
| options | 以 nz-select 編輯。檢視時顯示 option 的 label。鍵為實際儲存的值。 |
| editor="date" | 以 scc-date-time-picker 編輯（單一、精確到分鐘）。檢視仍為文字。 |
| variant="tag" | 非空的檢視值使用綠色標籤。空值仍顯示 -。 |

控制項優先順序：`options` 優先於 `editor`。否則 `editor="date"` 使用日期選擇器，預設為文字輸入。

## 版面

- 檢視：label 與 value 同一列。
- 編輯可寫欄位：label 在控制項上方。
- 編輯唯讀欄位：維持單列。

## 空值與錯誤

- `null` 或 `''` 顯示為 `-`。
- `[error]="true"` 只覆蓋卡片內容區。標題保持可見。
- 給卡片設定 min-height，避免錯誤狀態時高度塌陷。

## 不要做

- 不要把 `app-detail-item` 放在 `app-detail-card` 外面。
- 不要在 item 內編碼 PATCH 鍵或 chassis-type 對照表。
- 不要用卡片載入資料。GET 留在 data-loader；Save 留在頁面。