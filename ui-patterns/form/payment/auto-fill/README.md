# 課程重點整理：自動填入城市與州別（Auto-fill City & State）

## 1. 核心概念：減少使用者輸入，提升表單體驗

傳統地址表單通常要求使用者輸入：

* 城市（City）
* 州別（State）
* 郵遞區號（ZIP Code）

但實際上：

> 郵遞區號已經包含地理資訊，可以反推出城市與州別。

因此：

**使用者只需要輸入 ZIP Code → 系統自動填入 City / State**

好處：

* 減少使用者輸入量
* 降低輸入錯誤
* 加快表單完成速度
* 提升 UX

這是一種典型的：

> Progressive Enhancement（漸進式增強）

透過額外智慧功能改善體驗，而不是增加使用者負擔。

---

# 2. UX 設計原則：讓使用者輸入最少必要資訊

設計思考：

❌ 傳統流程：

```
User:
輸入 ZIP
輸入 City
輸入 State
```

問題：

* 重複輸入資訊
* 可能不一致

例如：

```
ZIP: 90210
City: Los Angles
State: California
```

拼錯或填錯。

---

✅ 智慧流程：

```
User:
輸入 ZIP

System:
查詢 ZIP

↓

自動填入：

City: Beverly Hills
State: California
```

系統負責推理。

---

# 3. 使用 Ziptastic API

課程使用：

Ziptastic

功能：

輸入：

```
ZIP Code
```

回傳：

```json
{
  "city": "Beverly Hills",
  "state": "CA"
}
```

然後填入表單。

---

## API 使用方式

流程：

```
User Input ZIP
        |
        ↓
keyup event
        |
        ↓
Validate ZIP
        |
        ↓
AJAX Request
        |
        ↓
Ziptastic API
        |
        ↓
Receive JSON
        |
        ↓
Update City / State fields
```

---

# 4. JavaScript 實作重點

## (1) 建立 ZIP 驗證函式

```javascript
function is_int(value){
   return !isNaN(value);
}
```

目的：

確認輸入是否為數字。

原因：

雖然 HTML5 可以設定：

```html
<input type="number">
```

但：

* 舊瀏覽器可能不支援
* JavaScript 仍需要防呆

---

# 5. 監聽 ZIP 欄位輸入事件

使用：

```javascript
keyup
```

監控：

```html
<input id="zip">
```

流程：

每次按鍵：

```
使用者輸入
      |
      ↓
檢查 ZIP 是否有效
      |
      ↓
如果完成五位數
      |
      ↓
呼叫 API
```

---

# 6. AJAX 查詢 API

當 ZIP 符合：

```
12345
```

格式後：

發送 AJAX：

```javascript
$.ajax({
   url: API_URL,
   data:{
      zip: zipCode
   }
})
```

取得 JSON：

```javascript
success:function(data){

   $('#city').val(data.city);

   $('#state').val(data.state);

}
```

結果：

自動更新欄位。

---

# 7. Cache（快取）概念

程式加入變數保存查詢結果。

原因：

避免：

* 重複呼叫 API
* 浪費 request
* 超過免費 API 限制

例如：

第一次：

```
90210
↓
API Request
↓
Cache
```

第二次：

```
90210
↓
直接使用 Cache
```

---

# 8. 錯誤處理（Error Handling）

如果 ZIP 不存在：

例如：

```
99999
```

API 回傳錯誤。

處理方式：

顯示：

```
not a real zip code
```

流程：

```
Invalid ZIP
      |
      ↓
Show error message
      |
      ↓
fadeIn()
      |
      ↓
fadeOut()
```

---

# 9. HTML 表單強化

加入：

## pattern

限制只能輸入數字：

```html
pattern="[0-9]"
```

---

## maxlength

限制長度：

```html
maxlength="5"
```

避免：

```
123456
```

這種錯誤輸入。

---

## Error Message 元素

加入：

```html
<span class="zip-error">
not a real zip code
</span>
```

預設隱藏。

---

# 10. CSS 排版技巧

錯誤訊息不要破壞 Layout。

使用：

## 父元素：

```css
label{
 position:relative;
}
```

---

## Error message：

```css
.zip-error{
 position:absolute;
 color:red;
 display:none;
}
```

效果：

```
ZIP Code

[12345]

      ↑
      not a real zip code
```

不會推動其他元素。

---

# 11. 這堂課背後的工程思想

## ① 不要要求使用者提供系統已知資訊

核心：

> Let the computer do the work.

如果資料可以推導：

不要讓使用者輸入。

例如：

* ZIP → City / State
* Country Code → Country
* Credit Card Number → Card Type
* Email → Avatar / Account info

---

## ② 小功能帶來巨大 UX 改善

這種功能：

程式量：

可能只有 30 行 JavaScript。

但價值：

非常高。

因為它：

* 減少操作步驟
* 減少錯誤
* 提升完成率

---

## ③ 表單設計從「收集資料」轉變成「協助完成」

舊思維：

```
Form = 收資料
```

新思維：

```
Form = 協助使用者完成任務
```

好的表單會：

* 預測需求
* 自動補全
* 即時驗證
* 提供錯誤提示

---

# 12. 與現代 Frontend 的連結

這個概念在現代 Angular / React 常見：

## Reactive Form + Async Validator

例如 Angular：

```
ZIP input
    |
valueChanges
    |
debounceTime()
    |
switchMap()
    |
API lookup
    |
patchValue()
```

類似：

```typescript
zipControl.valueChanges
.pipe(
 debounceTime(300),
 switchMap(zip => lookupZip(zip))
)
.subscribe(result => {

 form.patchValue({
   city: result.city,
   state: result.state
 });

});
```

---

# 最終總結

這堂課的核心不是 Ziptastic，而是：

> **利用系統能力減少使用者輸入，讓表單從被動收集資料，變成主動協助使用者完成任務。**

關鍵技術：

| 技術             | 目的        |
| -------------- | --------- |
| ZIP Lookup API | 推導城市州別    |
| keyup event    | 即時監控輸入    |
| AJAX           | 非同步取得資料   |
| JSON response  | 更新表單      |
| Cache          | 降低 API 呼叫 |
| Validation     | 防止錯誤輸入    |
| CSS absolute   | 優雅顯示錯誤訊息  |

這也是現代 UX 表單設計的重要方向：

**「少輸入、多協助；少錯誤、多自動化。」**
