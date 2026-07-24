# Vibe Coding Flow   

## 建立你的 PRD（Product Requirements Document，產品需求文件）   
- 將prd-generator.md 餵給 AI (Grok)
- AI 會跟你要mvp description -> 將mvp-description.md 餵給AI
- AI 會問你7個問題 -> 你要回答a, b, 或c 
- AI 會產生front-end PRD 
- Always review AI-generated documents before use it.

--- 

## 初始化專案
- 把front-end PRD 中的page, 分開來實作。
- 實作時要導入knowledge-base.md 限制AI不要亂做。要照行業規矩來。
- 把blank-slate.md 餵給AI，告訴AI從零開始打造專案。
- 把knowledge-base.md 餵給AI。

---

## Implementation - page by page
- 把PRD餵給AI。(AI 應該會根據knowledge-base 的限制，先做第一頁)
- 要求AI我要下載整個專案
- 調整風格: 將design-style.md 餵給AI。
- 將design-generator-prompt.md 餵給AI，AI會產生Design System Spec。
- 要求AI: 把這份內容也同步進專案的 knowledge base 設定
- 如果你要test or debug 你的UI，你要截圖並且跟AI講你要做什麼，例如: "I want the suggestions of the ingredients under my search bar"
- 若run test有bugs 可如下處理: npm run test -- --run > test-log.txt 2>&1 產生的test-log.txt 貼回去給UI。