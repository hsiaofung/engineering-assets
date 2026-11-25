# 另外還有Figma 設計和BE API 的問題。這些都是手動輸入，一個是截圖，一個手動copy path, request, response

對，這裡你又發現一個值得改善的地方：**目前 AI 開發流程的瓶頸，不一定是寫程式，而是取得開發所需資訊的方式。**

你現在的流程大概是：

| 資訊來源        | 目前做法          | 問題           |
| ----------- | ------------- | ------------ |
| Figma 設計    | 截圖後交給 AI      | 手動截圖、資訊可能不完整 |
| BE API      | Copy API path | 手動複製         |
| BE Request  | Copy Request  | 容易漏掉欄位       |
| BE Response | Copy Response | 容易漏掉資料結構     |

其實這些也可以納入你的 AI 開發能力系統。

我會把它們視為另一個層次：**Context Acquisition（開發上下文取得）**。

也就是讓 AI 在開始寫程式之前，就能自己取得設計規格、API 規格及資料結構。

## **一、Figma：讓 AI 直接讀取設計稿**

[What is Figma? – Figma Learn - Help Center](https://images.openai.com/static-rsc-4/SYVO-jzz_ht1JO_uFgBoEBN62mbA5Ss7HMjSgc23y8jC6VKh4MOpLRTTqV5ONg8NzMBR3TexbYG6LITvqXIeDMs8IX-z5kT0myTlMDySNhywLtM6ObcGOpNF_6Ngsz99DB32esfjmpFIGByMKmpJR5SWOnyCpJrFBpGiP6avNwI?purpose=inline)

[help.figma.com](https://help.figma.com/hc/en-us/articles/14563969806359-What-is-Figma?utm_source=chatgpt.com)

理想流程是：

你只提供 Figma 的設計稿連結，AI 就能取得：

- Frame / Page 結構
- 元件及層級關係
- 寬度、高度、間距
- Color、Typography
- Component、Variant
- Auto Layout 設定

這裡可以研究 **Figma MCP Server**。

它的目的就是讓支援 MCP 的 AI 開發工具，透過標準化工具介面讀取 Figma 設計資訊。

這樣就不必每次截圖、再讓 AI 用圖片猜測尺寸。

但要注意：需要先有可用的 Figma MCP 連線、適當的檔案權限，以及支援 MCP 的 AI 環境。

## **二、BE API：讓 AI 直接取得 API 規格**

[Spring REST Docs 与 OpenAPI 的比较 - spring 中文网](https://images.openai.com/static-rsc-4/PNW-I3Owwn_VUtKR2l6UK3e0QQkHPOiYpXrLW4q2JFggBI9RCS5tuf2q4qAtWPv2bDdIVeh6vUF6qRVA8Sng82S1Y4UkQwkq-clcHsuJSX45wpyjyitX_QpW9iccqRHnIi4IcE8lH3gxNc0YdBKhlNEAoBL5xT2pjh2DFvLxVeM?purpose=inline)

[springdoc.cn](https://springdoc.cn/spring-rest-docs-vs-openapi/?utm_source=chatgpt.com)

你目前手動提供：

- API Path
- HTTP Method
- Request
- Response

其實可以改成從 API 文件取得。

例如 BE 如果有 Swagger / OpenAPI：

AI 就可以讀取：

- Endpoint
- GET / POST / PUT / DELETE
- Request Parameters
- Request Body
- Response Schema
- Data Types
- Required Fields

甚至可以進一步讀取 BE 的 API 文件或程式碼。

這樣 AI 就不必依賴你手動 Copy Request / Response。

## **三、我會把它們另外設計成兩條 Skill**

不要把 Figma 和 BE API 的讀取規則塞進 Actions、List、Tree。

我建議你的架構變成：

## **AI Frontend Development System**

**Angular Page Orchestrator**

負責協調整個開發流程

**Context Acquisition Skills**

**Figma Skill**

讀取設計稿、Layout、Style、Component

**BE API Skill**

讀取 Endpoint、Request、Response、Schema

**Implementation Skills**

List

Tree

Actions

## **四、未來理想的開發流程**

你只要交代：

「幫我開發 Compute System 頁面，這是 Figma 連結。」

AI 自動：

1. 透過 Figma 工具讀取設計規格。
2. 透過 BE API 工具取得 API 規格。
3. 分析需求及資料結構。
4. 選擇 List、Tree、Actions Skill。
5. 按照你的專案規範撰寫 Angular 程式碼。
6. 執行測試、比對設計。
7. 回報結果及尚未解決的問題。

這裡要特別注意：Skill 負責教 AI 怎麼取得及使用資訊，真正讀取 Figma 或 BE 資料的能力，仍然要靠 MCP、API 或其他工具連線。

另外，BE API 最好先讀取 OpenAPI 規格，不要一開始就讓 AI 直接呼叫正式環境 API；涉及資料異動時也應該保留人工確認。

## **五、我認為你現在可以開始規劃三個方向**

| 類別            | 要建立的能力               |
| ------------- | -------------------- |
| Context       | Figma、BE API 自動取得資料  |
| Development   | List、Tree、Actions 開發 |
| Orchestration | 分析、安排、整合、測試          |

**我想強調一件事：你現在發現的問題，已經不只是如何讓 AI 寫出更好的程式碼，而是如何減少人類在開發過程中扮演資料搬運工的工作。**

這是一個很值得改善的方向。

我想先問一個實際問題：你們公司的 BE API 文件目前是放在 Swagger / OpenAPI 網頁上，還是 GitLab 專案裡的程式碼或文件？這會決定我們下一步如何讓 Grok 自動取得 API 資訊。