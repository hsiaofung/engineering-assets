有！而且這條 Skill 很有意思，因為它不是負責寫程式，而是負責**指揮其他 Skill 怎麼合作**。

這種設計可以稱為 Orchestrator Skill（協調器／調度器 Skill）。

你可以把它想像成一個前端開發主管：

- List Skill 是負責清單的工程師。
- Tree Skill 是負責樹狀導覽的工程師。
- Actions Skill 是負責操作功能的工程師。
- Orchestrator Skill 是負責分析需求、分配工作、安排順序及整合成果的主管。

不過要注意：Orchestrator 本身不會憑空獲得呼叫其他 Skill 的能力。它需要你使用的 AI 開發環境支援 Skill 發現、載入及工具調用。不同平台的實作方式不完全相同。

## **一、Orchestrator Skill 大概長什麼樣子？**

例如你建立一條：

`angular-page-orchestrator`

它的工作規則可以是：

**Angular Page Orchestrator**

**任務：** 根據使用者需求，安排前端頁面開發工作。

1. 分析需求，拆解頁面功能。
2. 判斷需要哪些專業 Skill。
3. 檢查各 Skill 的適用範圍。
4. 規劃執行順序及相依關係。
5. 分階段執行各項工作。
6. 檢查各功能整合是否正確。
7. 執行必要的測試。
8. 回報完成內容、問題及待確認事項。

**重要規則：**

- 不要重複實作其他 Skill 已經定義的專業規則。
- 不確定需求時先詢問。
- 不要擅自修改既有共用元件。
- 每個階段完成後檢查成果。

這條 Skill 就像一個工作總指揮。

## **二、訓練方法是什麼？**

其實跟你現在訓練 Actions Skill 的方法很像，只是訓練目標不同。

我會分成五個步驟。

1. **定義工作角色**

   告訴 AI：

   「你不是前端程式碼的實作者，你是負責規劃與協調 Angular 頁面開發的技術主管。」

   先讓它知道自己的責任邊界。
2. **教它如何分析需求**

   給它一個真實需求，例如：

   「建立 Compute System 頁面，包含系統清單、階層導覽及批次操作。」

   看它能不能正確拆成 List、Tree、Actions 三項工作。
3. **教它如何選擇 Skill**

   告訴它：
   - 涉及資料表格就使用 List Skill。
   - 涉及階層節點就使用 Tree Skill。
   - 涉及批次操作就使用 Actions Skill。

   如果任務不需要某項功能，就不要載入該 Skill。
4. **教它如何安排工作**

   例如：
   - 先檢查現有架構。
   - 再建立 Tree 和 List。
   - 接著整合 Actions。
   - 最後進行整合測試。

   如果兩項工作互相依賴，就必須先完成前置工作。
5. **反覆測試與修正**

   這是最重要的。

   你故意給它不同情境：
   - 只有 List 的頁面。
   - List + Actions 的頁面。
   - Tree + List + Actions 的頁面。
   - 原有頁面修改，而不是重新開發。

   觀察它是否正確選擇 Skill、安排順序。

   出錯就修正規則，再重新測試。

這裡有一個重要觀念：不要只用一個案例驗證 Skill。最好準備幾個成功案例和容易出錯的案例，當作測試題庫。

這種做法也符合目前 Agent Skill 的設計方向：模組化、按需載入，以及用可重複的測試確認品質。

[image](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn+2



## **三、三種 Skill 的差別**

| 類型         | 負責什麼     | 例子                       |
| ---------- | -------- | ------------------------ |
| 專業 Skill   | 怎麼完成工作   | Actions                  |
| 協調 Skill   | 如何安排工作   | Orchestrator             |
| 共用規範 Skill | 必須遵守什麼標準 | Angular Coding Standards |

我特別建議你把共用規範獨立出來。

例如 Angular 19、NG-ZORRO 19、專案 API 規範、命名規則，不必在 Actions、List、Tree 裡面重複寫三次。

這樣未來 Angular 版本升級，只需要修改共用規範。

## **四、我建議你的實作順序**

不要現在就急著訓練 Orchestrator。

我會這樣安排：

## **你的 AI 前端開發能力庫**

1. 目前進行中

   **Actions Skill**

   把目前的操作功能規範修正到穩定。
2. **List Skill**

   用真實 Data Table 開發案例訓練。
3. **Tree / Navigation Skill**

   用 Compute Pod 或 System 階層導覽訓練。
4. **Angular Common Standards**

   整理共用的專案規範。
5. 進階階段

   **Angular Page Orchestrator**

   讓 AI 學會分析需求、選擇 Skill、安排工作及整合成果。

## **五、我想先確認一件技術上的事**

你目前使用哪一種環境建立 Skill？

Claude / Claude Code

GitHub Copilot

Cursor

ChatGPT

其他 AI 開發工具

確認

因為不同環境對 Skill 的載入、相互調用和工具執行方式不同。

我想帶你做一個真正能運作的 Orchestrator，而不是只寫一份看起來很厲害的 SKILL.md。

**你現在學習的重點，已經從如何叫 AI 寫程式，進展到如何設計一套讓 AI 有組織地完成軟體開發工作的系統。**

# 所以是訓練AI如何安排工作skill

沒錯！你抓到重點了。

**Orchestrator Skill 就是訓練 AI 如何安排工作、分配任務、調用其他 Skill，以及整合成果。**

不過我幫你區分一下：

- Actions Skill：教 AI 怎麼做 Actions。
- List Skill：教 AI 怎麼做 List。
- Tree Skill：教 AI 怎麼做 Tree。
- Orchestrator Skill：教 AI 什麼時候使用哪一條 Skill，以及如何安排它們合作。

這裡有一個很有趣的變化：

以前你教 AI 一項技能，讓它成為一個專業工程師。

現在你教 AI 如何安排多項技能，讓它成為一個專案管理者。

**你從訓練 AI 做事，進一步走向訓練 AI 組織工作。**

而且我建議你先把 Actions、List、Tree 三條 Skill 做成熟，再來訓練 Orchestrator。

這樣它才有真正可以調度的專業能力。