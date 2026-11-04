# InfoTooltipDirective

在 label 後面加上 info icon，hover 顯示 tooltip。

## 用法

```html
<div class="label" appInfo="這是 OS image 的 URL">URL</div>
```

## Inputs

| Input | 類型 | 說明 |
|-------|------|------|
| `appInfo` | `string` | hover 時顯示的 tooltip 文字 |

## 行為

- 動態插入現有的 `InfoTooltipComponent` 到 host 元素後面。
- tooltip 顯示在 icon 正上方。
- icon 與 label 文字同一排。

## 範例

```html
<div class="label" appInfo="請輸入 OS image 的完整路徑">URL</div>
<div class="label">User Name</div>
```

## 注意

- 需要在同一個資料夾或 imports 中引入 `InfoTooltipComponent`。
- 不會修改原本的 component。
