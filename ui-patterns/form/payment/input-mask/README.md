這堂課的主題是 「Input Mask（輸入遮罩）」，重點在於：用 JavaScript + 正規表示式（Regex）即時格式化電話號碼，並搭配正確的 `input type` 提升手機輸入體驗。

我幫你整理成「目的 → HTML 設計 → Regex → JavaScript 流程 → UX 重點 → Angular 實務」六個部分。

### Input Mask（輸入遮罩）重點整理

### 1. 為什麼需要 Input Mask？

### 原本的問題

![8 Common Checkout Usability Mistakes and How to Avoid Them - Xola](https://images.openai.com/static-rsc-4/cBlFkU5jp7rnp-ncX-ygZ0CX89b0we-N4tPzX7QEE0knieUukTdLZI2ySTyShLbDDHeU1t6M-M1zGyRcF8sr_9GwXYTMX9fLaTFjQzEkt2_8FwZKF4sECIQSwbPtTj8Exdz4cKhxdKYlHCGKrOKH0Ww9KqXzDc9JZKINVHAwGVtQ9N1fSYTvbWixvAuje4zh?purpose=fullsize)

* 沒有格式

* 可輸入任意長度

* 可輸入英文字母或符號

* 使用者不知道正確格式

例如：

```
1234567890123
abc123
123-4567-890
```

### 目標格式（美國電話）

(123) 456-7890

規則：

* 3 位區碼

* 空格

* 3 位數字

* `-`

* 4 位數字

* 總共 10 位數字

### 2. HTML 設計重點

### 使用正確的 input type

HTML

```
<input
  type="tel"
  id="phone"
  placeholder="(555) 123-4567"
/>
```

### 為什麼是 `type="tel"`？

### 手機會自動顯示數字鍵盤

![Smartphone keypad with white numbers on black background, close up](https://images.openai.com/static-rsc-4/wge32T_xwfEJddXypVCMZFJ-YXSzKjfihaVrS1Cyw27WVpGp6-V4J78q3flIwN-mg8FZ0zOfIy7pAEpCxMZwJivy0eGrLqAgdApPTaZsaO7pQr5xc9DF740BZ07uxBbDLrX7Tbvml5k8-OfcSNxyG4VwRFpvsrHZ6SkroPTgqlfgqDMJNNJi7Xd1Woi3RgD2?purpose=fullsize)

這比一般文字鍵盤好很多：

| input type | 手機鍵盤    |
| ---------- | ------- |
| text       | 一般鍵盤    |
| email      | 含 @ 與 . |
| tel        | 數字鍵盤    |

### `id="phone"` 的用途

這是 JavaScript 的 hook（鉤子）：

JavaScript

```
document.getElementById('phone')
```

### 3. 什麼是 Input Mask？

Input Mask = 一組限制輸入格式的規則

它會在使用者輸入時：

* 限制可輸入的字元

* 自動加入括號、空格、橫線

* 限制最大長度

* 讓資料保持一致格式

### UX 觀念

### ❌ 把格式責任丟給使用者

```
請輸入電話號碼（格式：(123) 456-7890）
```

使用者還要自己打括號和橫線。

### ✅ 系統自動幫忙

使用者只要輸入：

```
1234567890
```

系統自動變成：

```
(123) 456-7890
```

這就是：

Don’t make me think. — Steve Krug

### 4. JavaScript 實作流程

### 取得元素

JavaScript

```
const phone = document.getElementById('phone');
```

### 監聽 input 事件

JavaScript

```
phone.addEventListener('input', function (e) {
  // 每次輸入都會執行
});
```

### 為什麼用 `input`？

因為它會在：

* 鍵盤輸入

* 貼上文字

* 刪除字元

* 自動填入

時都觸發。

### 5. 第一步：移除非數字字元

JavaScript

```
let x = e.target.value.replace(/\D/g, '');
```

### Regex：`/\D/g`

### `\D`

代表：

任何非數字字元

包含：

* 英文字母

* 空格

* 括號

* 橫線

* 特殊符號

### `g`（global）

代表：

全域搜尋，替換所有符合項目

### 效果

| 輸入             | 結果         |
| -------------- | ---------- |
| 123abc         | 123        |
| (123) 456-7890 | 1234567890 |
| 12-34          | 1234       |

### 6. 第二步：切成 3-3-4

JavaScript

```
const parts = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
```

### Regex 拆解

```
(\d{0,3})  -> 第 1 組：0~3 位
(\d{0,3})  -> 第 2 組：0~3 位
(\d{0,4})  -> 第 3 組：0~4 位
```

### 輸入 `1234567`

`match()` 會回傳：

JavaScript

```
[
  '1234567',
  '123',
  '456',
  '7'
]
```

所以：

* `parts[1] = "123"`

* `parts[2] = "456"`

* `parts[3] = "7"`

### 7. 第三步：組合格式

### 使用三元運算子

JavaScript

```
e.target.value = parts[2]
  ? `(${parts[1]}) ${parts[2]}${parts[3] ? '-' + parts[3] : ''}`
  : parts[1]
    ? `(${parts[1]}`
    : '';
```

### 輸入過程示意

| 使用者輸入      | 畫面顯示           |
| ---------- | -------------- |
| 1          | (1             |
| 12         | (12            |
| 123        | (123           |
| 1234       | (123) 4        |
| 123456     | (123) 456      |
| 1234567    | (123) 456-7    |
| 1234567890 | (123) 456-7890 |

### 8. 完整程式碼（課堂版）

JavaScript

```
const phone = document.getElementById('phone');

phone.addEventListener('input', function (e) {
  // 只保留數字
  let x = e.target.value.replace(/\D/g, '');

  // 限制最多 10 位
  x = x.substring(0, 10);

  // 拆成 3-3-4
  const parts = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

  // 套用格式
  e.target.value = parts[2]
    ? `(${parts[1]}) ${parts[2]}${parts[3] ? '-' + parts[3] : ''}`
    : parts[1]
      ? `(${parts[1]}`
      : '';
});
```

### 9. 重要的 JavaScript 內建方法

### `replace()`

JavaScript

```
'123-456'.replace('-', '')
```

結果：

```
123456
```

用途：搜尋並取代

### `match()`

JavaScript

```
'1234567890'.match(/(\d{3})(\d{3})(\d{4})/)
```

結果：

JavaScript

```
[
  '1234567890',
  '123',
  '456',
  '7890'
]
```

用途：模式比對並擷取群組

### 10. 行動裝置 UX 提升

![8 Common Checkout Usability Mistakes and How to Avoid Them - Xola](https://images.openai.com/static-rsc-4/cBlFkU5jp7rnp-ncX-ygZ0CX89b0we-N4tPzX7QEE0knieUukTdLZI2ySTyShLbDDHeU1t6M-M1zGyRcF8sr_9GwXYTMX9fLaTFjQzEkt2_8FwZKF4sECIQSwbPtTj8Exdz4cKhxdKYlHCGKrOKH0Ww9KqXzDc9JZKINVHAwGVtQ9N1fSYTvbWixvAuje4zh?purpose=fullsize)

### 電話欄位

* 顯示數字鍵盤

* 不需切換鍵盤

* 更快輸入

### Email 欄位

* 自動提供 `@`

* 自動提供 `.`

* 減少按鍵次數

### 州別 / 姓名欄位

* 顯示一般文字鍵盤

這些都是：

使用正確 input type 的直接好處

### 11. Regex 快速記憶表

| 寫法    | 意思      |
| ----- | ------- |
| \d    | 數字      |
| \D    | 非數字     |
| \w    | 英數字與底線  |
| \s    | 空白字元    |
| {3}   | 剛好 3 次  |
| {0,3} | 0 到 3 次 |
| g     | 全域搜尋    |

### 12. Angular 實務建議（你會這樣做）

### 不建議直接操作 DOM

課堂：

JavaScript

```
document.getElementById('phone')
```

Angular 中應避免。

### 建議做法：Reactive Forms

TypeScript

```
this.form = this.fb.group({
  phone: ['']
});

this.form.get('phone')!.valueChanges.subscribe(value => {
  const digits = value.replace(/\D/g, '').substring(0, 10);
  const formatted = this.formatPhone(digits);

  this.form.get('phone')!.setValue(formatted, {
    emitEvent: false
  });
});
```

### 或使用現成套件

* `ngx-mask`

* `imaskjs`

* `cleave.js`

例如：

HTML

```
<input
  formControlName="phone"
  mask="(000) 000-0000"
/>
```

這會比手寫更可靠。

### 13. 這堂課真正的核心觀念

Input Mask 的目的不是限制使用者，而是幫助使用者更輕鬆地輸入正確格式的資料。

### 設計原則

* 減少思考：不用記格式

* 減少錯誤：避免非數字輸入

* 減少操作：自動加括號與橫線

* 提升手機體驗：顯示正確鍵盤

* 提升資料品質：格式一致

### 一句話總結

這堂課示範如何使用 `type="tel"` 提升手機輸入體驗，並透過 JavaScript 監聽 `input` 事件，搭配正規表示式 `\D` 過濾非數字、`match()` 拆分 3-3-4 數字段落，再利用 `replace()` 與三元運算子即時套用 `(123) 456-7890` 的電話格式，實作一個輕量且實用的 Input Mask，大幅提升表單的易用性與資料一致性。
