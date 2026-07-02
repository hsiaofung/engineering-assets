其實這 11 項不是 11 個獨立的規則，而是可以壓縮成一個**設計思考流程**。這樣比死背容易得多。

我會整理成 **3 大原則 + 11 個檢查點**。

---

# 一、開始之前：先想好結構（Structure）

先決定表單長什麼樣。

① 不要直接複製紙本表單

② 表單放在獨立容器

③ 採用單欄布局（必要時短欄位可並排）

④ 按照邏輯順序排列、分組

可以想成：

> **先設計結構，再放欄位。**

---

# 二、讓填寫變得容易（Easy to Fill）

這是整個課程最重要的一部分。

⑤ 移除不必要欄位

⑥ 減少滑鼠操作

⑦ 欄位長度符合輸入內容

⑧ Label 位置一致（最好在上方）

⑨ Placeholder 不要取代 Label

可以想成：

> **讓使用者填得最快、最不用思考。**

---

# 三、避免犯錯（Prevent Errors）

最後才是完成體驗。

⑩ 移除 Reset Button

⑪ 規劃 Validation 與 Error Message

可以想成：

> **避免使用者按錯，也幫助他修正錯誤。**

---

## 我自己的記憶法（推薦）

我會把它變成一句流程：

> **先排好 → 好填寫 → 不犯錯**

展開就是：

```
先排好
├─ 不抄紙本
├─ Container
├─ Single Column
└─ Logical Order

好填寫
├─ 少欄位
├─ 少滑鼠
├─ 欄位大小正確
├─ Label一致
└─ Placeholder≠Label

不犯錯
├─ Remove Reset
└─ Validation
```

你會發現，11 項其實只是在回答三個問題：

1. **版面怎麼安排？**（Structure）
2. **怎麼讓人填得快？**（Efficiency）
3. **怎麼避免出錯？**（Error Handling）

---

## 如果是 Code Review，我會用這份 Checklist

| 檢查項目           | 問自己                                                    |
| -------------- | ------------------------------------------------------ |
| Structure      | 有沒有單欄、分組、邏輯順序、獨立容器？                                    |
| Efficiency     | 有沒有多餘欄位？滑鼠操作是否過多？Label 是否一致？欄位大小是否合理？Placeholder 是否誤用？ |
| Error Handling | 有沒有即時驗證？錯誤訊息是否清楚？是否移除 Reset？                           |

---

### 依你的學習方式，我建議不要把這 11 項當成「需要背誦的知識」，而是把它們當成 **Form Design Checklist**。

你正在建立自己的前端知識庫，我甚至會把這份內容放在：

```text
frontend/
└── ui-design/
    └── form-design/
        ├── form-layout-principles.md
        ├── form-validation.md
        ├── input-controls.md
        └── form-checklist.md
```

其中 `form-layout-principles.md` 說明原理，而 `form-checklist.md` 則濃縮成這 11 個檢查點。實際開發或做 UI Review 時，通常看 Checklist 的頻率會比重新閱讀原理高得多。
