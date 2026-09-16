# Resource Detail Card（SCSS）

共用 **欄位卡** 樣式：白底、標題、兩欄 `dl`。Drawer／System 的 Physical Assets 卡都用這份。  
**不含** Face、subtitle、carousel。

路徑（以實際為準）：

`src/app/core-modules-scc4/compute/shared/resource-detail-card.scss`

---

## 何時用

- 資源詳情右下「欄位清單」
- 標籤／值成對、兩欄對齊
- 需要 Location + tooltip 時用既有 modifier

不要拿來排機箱圖或表格。

---

## 在元件裡引入

只在 **該頁／該塊的 scss** `@use`，不要寫進 `styles.scss`（避免 class 污染全站）。

```scss
@use '../../shared/resource-detail-card';
```

路徑依檔案深度調整。不必再複製 `.resource-detail-card { ... }`。

---

## HTML 結構

```html
<section class="resource-detail-card">
  <div class="resource-detail-card__title">Physical Assets</div>

  <div class="resource-detail-card__fields">
    <dl>
      <div>
        <dt>
          <span class="resource-detail-card__location-label">
            Location
            <app-info-tooltip [content]="'…'" />
          </span>
        </dt>
        <dd>{{ displayValue(detail.location) }}</dd>
      </div>
      <div>
        <dt>IPv4</dt>
        <dd>{{ displayValue(detail.ipv4) }}</dd>
      </div>
      <!-- 左欄其餘欄位 -->
    </dl>

    <dl>
      <div>
        <dt>Power</dt>
        <dd>{{ displayValue(detail.powerState) }}</dd>
      </div>
      <!-- 右欄 -->
    </dl>
  </div>
</section>
```

| class | 用途 |
|--------|------|
| `resource-detail-card` | 卡片容器（padding、圓角、陰影） |
| `__title` | 標題 |
| `__fields` | 外層兩欄 grid（≥900px 兩欄，以下一欄） |
| `__fields` 內兩個 `dl` | 左欄／右欄 |
| `dl > div` | 一列：左 `dt`、右 `dd` |
| `__location-label` | Location 文字 + `app-info-tooltip` 橫排 |

空值用頁面的 `displayValue` → `-`，scss 不管文案。

---

## 版面

```
┌ title ─────────────────────┐
│  dt    dd    │  dt    dd   │
│  dt    dd    │  dt    dd   │
└──────────────┴─────────────┘
```

- `__fields`：`1fr 1fr`
- 每個 `dl > div`：標籤 | 值 再切兩欄  
- `≤900px`：兩個 `dl` 上下疊

欄位不均時仍兩個 `dl`，不要三欄硬塞。

---

## 原則

- **只改這份 scss** 就能同步 Drawer／System 卡片外觀。
- Face／page grid 留在各頁自己的 scss。
- 不要在 template 加 inline 寬度去「對齊」dt／dd。
- 新頁要同一種卡：`@use` + 同一套 class，不要再複製一份 card scss。

---

## 檢查

- [ ] `@use` 路徑正確，class 生效（有白底與陰影）
- [ ] 兩個 `dl` 在寬螢幕左右並列
- [ ] Location tooltip 與文字同一列
- [ ] 空值顯示 `-`
- [ ] 窄螢幕欄位改為單欄