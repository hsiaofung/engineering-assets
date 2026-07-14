## 建立選取項目（Making Selections）重點整理

### 1. Select（下拉選單）的用途

* 適合讓使用者從**多個選項（通常超過 6 個）**中進行選擇。
* 可支援：

  * 單選（Single Select）
  * 多選（Multiple Select）
* 由 HTML 的：

  * `<select>`
  * `<option>`
    所組成。
* 可以放在 `<form>` 中，也可以獨立使用。

---

### 2. 為什麼要自訂 Select 樣式？

瀏覽器對 `<select>` 的預設樣式差異很大：

* Chrome、Firefox、Safari 外觀不同
* Windows 與 macOS 顯示不同
* 預設箭頭樣式無法統一

因此，實務上常會：

* 隱藏瀏覽器預設箭頭
* 自行加入自訂圖示（例如 Font Awesome）
* 讓所有瀏覽器保持一致的外觀

---

### 3. 自訂 Select 的實作流程

#### Step 1：修改 HTML

在每個 `<select>` 後面加入 Font Awesome 向下箭頭。

例如：

```html
<select>
  ...
</select>
<i class="fa-solid fa-chevron-down"></i>
```

本課範例共有三個 Select：

* Adults
* Children
* Cabin Class

都需要加入自訂箭頭。

---

#### Step 2：隱藏瀏覽器預設箭頭

利用 CSS 移除各瀏覽器的預設下拉箭頭。

重點：

* Chrome、Edge、Safari 使用 `appearance`
* Firefox 需要額外設定

完成後，只剩下自己加入的 Font Awesome 圖示。

---

#### Step 3：定位自訂箭頭

利用 **CSS 相鄰兄弟選擇器（Adjacent Sibling Combinator）**：

```css
select + i
```

選取 `<select>` 後面緊接著的 Font Awesome 圖示。

搭配：

* `position: absolute`
* `right`
* `bottom`

即可將箭頭定位到 Select 的右側。

---

#### Step 4：避免圖示阻擋點擊

加入：

```css
pointer-events: none;
```

好處：

* 點擊箭頭仍然會觸發 Select
* 不會因為圖示覆蓋而失去互動功能

這是自訂圖示時非常重要的一個設定。

---

### 4. CSS 重點技巧

本課使用了幾個重要技巧：

* 隱藏瀏覽器預設 Select 箭頭
* Firefox 相容性處理
* `position: absolute` 精準定位
* `right`、`bottom` 微調位置
* `line-height` 讓圖示置中
* `pointer-events: none` 保持可點擊性
* 自訂圖示顏色與大小

---

### 5. 使用到的重要 CSS 知識

| 技術                     | 用途                |
| ---------------------- | ----------------- |
| `appearance: none`     | 移除瀏覽器預設 Select 樣式 |
| `position: absolute`   | 精準定位箭頭            |
| `pointer-events: none` | 避免圖示攔截滑鼠事件        |
| Adjacent Sibling (`+`) | 選取 Select 後面的圖示   |
| Font Awesome           | 自訂下拉箭頭圖示          |

---

## 本課重點總結

* `<select>` 適合用於大量選項的選擇（通常超過 6 個）。
* 不同瀏覽器對 Select 的預設樣式差異很大，因此實務上常會進行自訂。
* 自訂 Select 的核心流程包括：

  1. 在 `<select>` 後加入 Font Awesome 箭頭。
  2. 使用 `appearance: none` 隱藏瀏覽器預設箭頭。
  3. 利用 **相鄰兄弟選擇器 (`+`)** 與 `position: absolute` 定位自訂圖示。
  4. 使用 `pointer-events: none`，避免圖示影響 Select 的點擊操作。
* 透過這些技巧，可以讓下拉選單在各大瀏覽器中擁有一致、美觀且易於維護的使用者介面。
