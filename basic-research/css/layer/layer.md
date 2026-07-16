`@layer` 是 **CSS Cascade Layers（CSS 層疊層）**，是 CSS 原生提供的一種**管理樣式優先權（specificity / cascade order）的方法**。

簡單說：

> `@layer` 讓你可以明確定義「哪一類 CSS 比較強」，避免一直增加 selector 複雜度來打贏其他樣式。

---

## 1. 為什麼需要 @layer？

傳統 CSS 的問題：

假設有一個 Button：

```css
.button {
  color: blue;
}
```

後來第三方套件：

```css
.nz-button {
  color: red;
}
```

結果不如預期。

工程師通常會開始提高 specificity：

```css
.dashboard .toolbar .button.primary {
  color: blue;
}
```

最後變成：

```
specificity war
```

越來越難維護。

---

# 2. 沒有 @layer 時

CSS 優先權主要看：

```
!important
    >
inline style
    >
ID
    >
class
    >
element
```

例如：

```css
.button {
  color: blue;
}

.container .button {
  color: red;
}
```

第二個贏，因為 selector 比較強。

---

# 3. @layer 解決什麼？

你可以定義：

```css
@layer reset;
@layer framework;
@layer components;
@layer utilities;
```

例如：

```css
@layer framework {

  .button {
    color:red;
  }

}


@layer components {

  .button {
    color:blue;
  }

}
```

結果：

```
components
    ↑
framework
```

所以：

```css
color: blue;
```

勝出。

---

# 4. Layer 的優先順序

假設：

```css
@layer reset;
@layer vendor;
@layer components;
@layer utilities;
```

權重：

```
弱
 |
 v

reset

vendor

components

utilities

強

```

後面的 layer 優先。

---

# 5. Enterprise Frontend 常見用法

例如 Angular 專案：

```
src/styles/

├── reset.css
├── tokens.css
├── vendor.css
├── components.css
└── utilities.css
```

可以：

```css
@layer reset;
@layer tokens;
@layer vendor;
@layer components;
@layer utilities;
```

---

## 6. Angular + NG-ZORRO 的場景

你的環境：

```
Angular 19
+
NG-ZORRO
```

常遇到：

> 我要改 NG-ZORRO component style，但是又不想一直寫 ::ng-deep

以前可能：

```scss
.dashboard 
.ant-table 
.ant-table-header {
 background:red;
}
```

selector 越寫越長。

使用 layer：

```css
@layer ng-zorro {

  .ant-table-header {
    background:red;
  }

}


@layer app {

  .ant-table-header {
    background:blue;
  }

}
```

app layer 自然覆蓋。

---

# 7. @layer + Design Token

這跟你現在建立 Pattern Library 很相關。

推薦架構：

```
styles/

├── tokens.css
├── components.css
├── utilities.css
```

---

## tokens

最低優先：

```css
@layer tokens {

:root {
  --primary-color:#1677ff;
  --spacing-md:16px;
}

}
```

---

## components

使用 token：

```css
@layer components {

.button {
  color:var(--primary-color);
  padding:var(--spacing-md);
}

}
```

---

## utilities

最高優先：

```css
@layer utilities {

.text-center {
 text-align:center;
}

}
```

---

# 8. 跟 Tailwind 的關係

Tailwind 其實大量使用 layer：

```css
@layer base;
@layer components;
@layer utilities;
```

例如：

```
base
 |
components
 |
utilities
```

所以 Tailwind 使用者其實已經在使用 Cascade Layer。

---

# 9. 對你的 Pattern Library 的建議

以你目前：

```
engineering-assets

patterns/
 ├── button
 ├── table
 ├── wizard
 └── form
```

可以考慮：

```
design-system/

styles/

├── 01-tokens
│     colors.css
│     spacing.css
│
├── 02-components
│     button.css
│     table.css
│
├── 03-overrides
│     ng-zorro.css
│
└── 04-utilities
```

對應：

```css
@layer tokens;
@layer components;
@layer overrides;
@layer utilities;
```

---

## 一句話總結

> **CSS @layer 就像給 CSS 加上「模組優先級管理」，讓 Design System、第三方 UI Library、自訂 Component 可以和平共存，而不用靠提高 selector 複雜度打架。**

以你的 Angular + NG-ZORRO + Pattern Library 方向，`@layer` 是值得納入架構規範的一個 CSS 技術。
