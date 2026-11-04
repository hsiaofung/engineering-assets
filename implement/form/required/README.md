# Required Directive

在 label 後面加上紅色星號（`*`），表示該欄位為必填。

## 用法

```html
<div class="label" appRequired>URL</div>
```

## Import

```ts
import { RequiredDirective } from '@app/shared/design-system/global-component/required/required.directive'

@Component({
  imports: [RequiredDirective],
})
export class YourComponent {}
```

## 行為

- `appRequired`（只寫 attribute）→ 顯示紅色 `*`

星號顏色與間距已在 directive 內定義，不需要額外寫 SCSS。
