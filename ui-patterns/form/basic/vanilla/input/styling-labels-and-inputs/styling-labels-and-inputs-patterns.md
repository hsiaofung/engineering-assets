
# Form Pattern｜樣式化標籤與輸入框（核心重點整理）

## 一、核心觀念（Why）

### 1. 標籤不是提示文字，是語意結構

* `<label>` 是用來「描述 input 的用途」
* 必須和 input 用 `for + id` 綁定
* 沒有 label = 無障礙問題（a11y issue）

👉 重點：

> Label = 結構，不是裝飾

---

### 2. 表單的 UX 來自「可掃描性」

* 使用者不是逐行閱讀，而是掃描
* 標籤必須：

  * 簡短
  * 明確
  * 一眼可理解

👉 建議：

> label 用 1~3 個詞，不要寫句子

---

## 二、HTML 結構原則（Structure Pattern）

### 3. 使用語意結構分組

* `<form>`：整體表單
* `<fieldset>`：邏輯區塊
* `<legend>`：區塊標題

👉 好處：

* 提升可讀性
* 提升 accessibility
* 結構可被 CSS 分層設計

---

### 4. label 與 input 關聯方式

```html
<label for="email">Email</label>
<input id="email" type="email" />
```

👉 核心：

* 必須一致（for = id）
* 不可依賴視覺排列

---

### 5. checkbox / radio 的特殊規則

👉 和一般 input 相反：

* 一般 input：

  * label 在前 → input 在後

* checkbox / radio：

  * input 在前 → label 在後

原因：

> 使用者視覺習慣是「先看到選擇框，再看到說明」

---

## 三、CSS UI Pattern（可重用）

## 6. fieldset + legend 樣式化（Form container pattern）

```css
fieldset {
  border-radius: 6px;
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
  min-width: 320px;
}

legend {
  font-weight: bold;
  padding: 0 8px;
}
```

👉 目的：

* 把表單「視覺容器化」
* 增加可掃描性

---

## 7. label block 化（Form readability pattern）

```css
label {
  display: block;
  margin-top: 12px;
}
```

👉 效果：

* label → input 垂直排列
* 增加掃描效率

⚠️ 例外：

* checkbox / radio 不適用

---

## 8. input 基本舒適化（Input usability pattern）

```css
input,
textarea {
  padding: 8px;
  border: 1px solid #ccc;
}
```

👉 重點：

* 增加 click target
* 提升 mobile usability

---

## 9. input width matching（Expectation alignment pattern）

```css
input[type="email"],
input[type="text"] {
  width: 300px;
}
```

👉 原則：

> 欄位長度 = 預期資料長度

例：

* CVV → 短
* Email → 中
* Address → 長

---

## 10. checkbox / radio layout（Selection pattern）

```css
.checks label {
  display: inline-block;
  margin: 0;
}

input[type="radio"] {
  margin-left: 8px;
}
```

👉 核心：

* 不使用 block layout
* 改成 inline selection UX

---

## 11. submit button styling（CTA pattern）

```css
input[type="submit"] {
  padding: 10px 16px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
}
```

👉 重點：

* 強化 primary action
* 明確區分 form input

---

## 12. responsive form width（Layout constraint pattern）

```css
fieldset {
  width: 40%;
  min-width: 320px;
  margin: 0 auto;
}
```

👉 核心 UX：

* 太寬 → 不好讀
* 太窄 → 不好填

---

## 四、整體設計哲學（最重要）

這堂課其實在講一件事：

> 表單不是「排版問題」，是「互動設計問題」

---

## 五、可以抽象成 4 個 UI Pattern

你可以直接放進 engineer-assets：

```text id="form-pattern-core"
Form UI Pattern

1. Structure
- fieldset / legend
- logical grouping

2. Readability
- label clarity
- scan-friendly layout

3. Input alignment
- size matches expectation
- consistent spacing

4. Interaction design
- checkbox/radio special handling
- submit CTA emphasis
- responsive constraints
```

---

