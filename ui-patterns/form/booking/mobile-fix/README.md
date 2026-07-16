## 修正行動版預訂表單（Booking Form Fix for Mobile）重點整理

### 1. 不要只依賴瀏覽器的手機模擬

* Chrome DevTools 的 Device Toolbar 僅供參考。
* 模擬器可能無法呈現真實手機上的瀏覽器行為。
* **務必在真實裝置（Real Device）與不同瀏覽器上測試**。

> **最佳實務：**
> Responsive Design 完成後，至少使用 Android 與 iPhone 實機驗證一次。

---

## 2. 真實手機常見的 UI 問題

### Date Picker（日期選擇器）

常見問題包括：

* 瀏覽器套用預設樣式（灰色漸層）
* 自訂日曆圖示位置錯誤
* 點擊圖示沒有反應
* 日期文字與 Label 重疊

**原因：**

* 行動瀏覽器對 `<input type="date">` 有自己的原生樣式（Native UI）。

---

### Passenger Stepper

問題：

* 加減按鈕位置偏移
* Input 與按鈕沒有對齊

需要重新調整：

* Button 位置
* Input 位置
* Wrapper 寬度

---

### Travel Class

問題：

* Select 欄位太窄
* 長文字與下拉箭頭重疊

需要重新調整：

* Select 寬度
* Margin

---

## 3. 這次只修改 CSS

本次修正：

* ✅ HTML 完全不用改
* ✅ 全部透過 CSS 解決

這也是 Responsive Design 很常見的做法。

---

## 4. Stepper 元件調整

主要修改：

* 調整加號 (+) 按鈕位置
* 調整減號 (-) 按鈕位置
* 將 `input.stepper-control` 設為：

```css
position: absolute;
```

讓 Input 能更精準地定位。

---

## 5. 覆寫（Override）原有 CSS

重新設定：

```css
.stepper-wrapper {
    width: ...
}
```

因為：

> **後面的 CSS 會覆蓋前面的 CSS。**

講師建議：

不要立即刪除舊設定，而是先註解。

```css
/* width:50%; */
width:40%;
```

方便之後 Media Query 再使用。

---

## 6. 修正 Date Picker 的原生樣式

手機瀏覽器通常會替日期欄位加入：

* Appearance
* Gradient
* Native UI

需要利用 CSS：

* 移除預設樣式
* 使用自己的設計

另外要提高 Selector 的 Specificity（權重），才能成功覆蓋原本規則。

---

## 7. 避免雙重 Border

修正：

* Stepper
* Form Control

避免：

```
Input Border
    +
Outer Border
```

造成兩層框線。

---

## 8. 統一 Focus 狀態

加入：

```css
:focus
```

讓所有控制項：

* 點擊後樣式一致
* 保持良好的互動回饋（Feedback）

---

## 9. 使用 Media Query 修正不同尺寸

新增：

```css
@media (min-width:430px)
```

再搭配：

```css
@media (min-width:600px)
```

依不同裝置尺寸調整：

* Date Picker
* Travel Class
* Details Grid
* Spacing

避免手機 CSS 影響桌機版。

---

## 10. 避免背景高度不足

新增：

```css
body{
    height:100vh;
}
```

避免：

* 背景圖片高度不足
* 底部露出白色空白

這是全螢幕背景常見的修正方式。

---

## 11. 修正 Grid 排版

重新調整：

```css
grid-template-columns
```

以及：

```css
grid-column-gap
```

讓：

* Details 區塊
* Passenger 區塊

在桌機與手機都有良好的排列效果。

---

## 12. 最終測試流程

完成修改後，應依序驗證：

* ✅ 手機直向（Portrait）
* ✅ 手機橫向（Landscape）
* ✅ 平板
* ✅ 桌機
* ✅ 不同瀏覽器

確認：

* 日期選擇器正常
* Stepper 對齊正常
* Select 顯示正常
* Grid 排版正常

---

# 本章核心觀念

### 真實裝置測試比模擬器更重要

* 瀏覽器模擬器無法完全模擬真實手機。
* 原生表單控制項（Date Picker、Select 等）在不同瀏覽器可能有不同外觀與行為。

### 善用 CSS Override

* 不需修改 HTML，也能透過覆寫 CSS 修正版面。
* 建議保留舊設定（先註解），方便後續調整。

### 使用 Media Query 建立真正的響應式設計

* 不同螢幕尺寸應使用不同的 CSS 規則，而不是一套樣式套用所有裝置。

### 響應式設計的完整驗證流程

Responsive Design 不只是「縮放版面」，還要確認：

* 視覺排版是否正常
* 原生控制項是否正常運作
* 不同方向（直向／橫向）是否可用
* 桌機版是否未受影響

> **一句話總結：**
> 響應式設計（Responsive Design）不應只依賴瀏覽器模擬器，而應透過 **CSS Override + Media Query + 真實裝置測試**，修正原生控制項與版面差異，確保網站在各種裝置與瀏覽器上都能提供一致且良好的使用體驗。
