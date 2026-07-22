`tokens layer` 可以理解成 **「設計系統的基礎變數層」**。

它不是 Angular 特有的東西，也不是 CSS 必須的功能，而是一種 **Design System 架構概念**。

簡單講：

> Token = 把設計規則抽象成可重複使用的變數。

例如：

不要每個地方直接寫：

```css
color: #1677ff;
padding: 16px;
border-radius: 8px;
```

而是集中管理：

```css
--color-primary: #1677ff;
--spacing-md: 16px;
--radius-md: 8px;
```

這些就是 **Design Tokens**。

---

## 1. 沒有 Token 的問題

假設你的系統有 100 個 Button：

```css
.button {
  background: #1677ff;
}
```

Table：

```css
.table-header {
  background: #1677ff;
}
```

Menu：

```css
.menu-active {
  background: #1677ff;
}
```

半年後產品說：

> 主色改成綠色。

你要搜尋：

```
#1677ff
```

改 100 次。

---

## 2. 有 Token

建立一個 tokens layer：

```css
@layer tokens {

  :root {
    --color-primary: #1677ff;
    --color-danger: #ff4d4f;

    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;

    --radius-sm: 4px;
    --radius-md: 8px;
  }

}
```

其他地方使用：

Button：

```css
@layer components {

.button {

  background: var(--color-primary);

  padding: var(--spacing-md);

  border-radius: var(--radius-md);

}

}
```

---

現在改品牌色：

只改：

```css
--color-primary: green;
```

全部 Button、Menu、Table 都跟著變。

---

# 3. 為什麼叫 Layer？

因為它通常是 CSS 的第一層。

例如：

```
CSS Architecture


┌────────────────────┐
│ Utilities          │  最強
├────────────────────┤
│ Components         │
├────────────────────┤
│ Third Party        │
│ (NG-ZORRO)         │
├────────────────────┤
│ Tokens             │  基礎
└────────────────────┘
```

Tokens 不應該直接控制 UI。

它只提供：

* 顏色
* 字體
* spacing
* shadow
* radius

---

# 4. 以你的 Angular + NG-ZORRO 來看

假設你的 SCC Web Platform：

目前可能很多地方：

```scss
.card {
  padding: 24px;
}

.table {
  padding: 24px;
}

.drawer {
  padding: 24px;
}
```

慢慢會變：

```
24px
24px
24px
20px
22px
```

最後沒有一致性。

---

建立 Token：

```css
@layer tokens {

:root {

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;

}

}
```

使用：

```scss
.card {
 padding: var(--space-4);
}
```

整個產品 spacing 就一致。

---

# 5. Token 不只 CSS

大型 Design System 通常有三層：

```
Design Token
      |
      v
Component
      |
      v
Application
```

例如：

## Token

```json
{
 "color.primary": "#1677ff",
 "spacing.medium": "16px"
}
```

↓

## Button Component

```typescript
ButtonComponent
```

↓

## Application

```html
<app-button>
 Save
</app-button>
```

---

# 6. 跟你的 Pattern Library 關係

你之前提：

> NG-ZORRO Pattern Library v1

其實很適合拆：

```
engineering-assets

design-system/

├── tokens
│
├── patterns
│   ├── table
│   ├── wizard
│   ├── form
│   └── modal
│
└── guidelines
```

---

例如 Wizard Pattern：

不要寫死：

```scss
.wizard {
 margin-bottom:24px;
}
```

改：

```scss
.wizard {
 margin-bottom:var(--spacing-lg);
}
```

未來：

* SCC
* DashWatch
* SaaS Starter Kit

都可以共用。

---

# 7. 用一句工程師容易理解的比喻

如果 Component 是「房子」：

```
Token = 建材規格

Component = 房屋模板

Application = 社區
```

你不會每棟房子自己決定：

* 水泥顏色
* 門尺寸
* 磚頭大小

而是先定義：

> 公司建築標準。

---

所以：

**tokens layer = Design System 的地基。**

對你目前想做的 **Angular SaaS Starter Kit + Pattern Library + engineering-assets**，這個概念比單純收集 UI Component 更重要。你其實已經在往 Design System 的方向走了。
