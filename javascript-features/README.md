# JavaScript Features Knowledge Base

這是個人追蹤與研究 JavaScript / ECMAScript 新特性的知識庫。

## 目的

- 系統化記錄 TC39 提案與 ECMAScript 新特性
- 方便快速查詢語法、範例、支援度與使用心得
- 長期追蹤語言演進，幫助實際專案應用新功能
- 作為學習筆記與參考文件

**最後更新**：2026-06-29

## 目錄結構
javascript-features/       
├── README.md                  ← 本文件（總覽）     
├── 2025/                      ← 已正式納入 ES2025 的特性     
├── 2026/                      ← ES2026 相關    
├── upcoming/                  ← Stage 3+ 但尚未正式發佈的提案    
├── templates/                 ← Markdown 模板   
├── examples/                  ← 共用程式碼範例   
├── resources/                 ← 重要連結與文件   
└── index.md                   ← 可選：特性總覽表格   


## 如何使用本知識庫

1. **新增特性**：複製 `templates/feature-template.md` 到對應年份資料夾
2. **填寫模板**：
   - 描述、語法範例
   - 支援狀態（MDN / caniuse）
   - 個人實驗筆記
3. **更新支援度**：定期檢查瀏覽器與 runtime 更新
4. **搜尋**：使用 Obsidian / VS Code 搜尋，或 GitHub search
5. **不要只研究 API**: 真正 Frontend R&D 的研究方式應該是：
   新功能 -> 解決什麼痛點 -> 以前怎麼做 -> 現在怎麼做 -> Browser Support -> Performance -> 是否值得團隊使用 

## 推薦研究流程

- 先看 TC39 proposal README 了解動機
- 閱讀 MDN 文件與範例
- 在瀏覽器 console / Node.js 實際測試
- 記錄相容性、edge cases 與心得
- 定期檢查 TC39 meeting notes

## 重要資源

### 官方
- [TC39 Proposals](https://github.com/tc39/proposals)
- [ECMAScript 規範](https://tc39.es/ecma262/)
- [TC39 Process](https://tc39.es/process-document/)
- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### 追蹤更新
- JavaScript Weekly：https://javascriptweekly.com/
- Can I Use：https://caniuse.com/
- TC39 Agendas：https://github.com/tc39/agendas

### 社群
- Reddit r/javascript
- 掘金（中文討論）

## 特性總覽（範例）

| 年份 | 特性                  | Stage | 主要用途          | 支援度 |
|------|-----------------------|-------|-------------------|--------|
| 2025 | Set Methods           | 4     | 集合運算          | 高     |
| 2025 | Iterator Helpers      | 4     | Lazy 處理         | 高     |
| 2025 | Import Attributes     | 4     | 安全 import JSON  | 高     |
| 2026 | Temporal              | 4     | 現代日期時間 API  | 中     |
| 2026 | Array.fromAsync       | 4     | Async iterable    | 中     |



## 貢獻 / 維護提示

- 每 TC39 會議後（約每 2 個月）檢查 `finished-proposals.md`
- 新特性 Stage 4 後立即建立筆記
- 使用 Git commit 清楚記錄「更新日期」與「支援變化」
- 可搭配 Obsidian 插件（Dataview、Kanban）做更進階管理

---



