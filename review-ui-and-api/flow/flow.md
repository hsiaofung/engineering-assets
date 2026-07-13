### UI / API Review 與釐清流程

- 適用情境：Frontend 依據 UI 設計與 Swagger/API 文件進行開發前檢查，發現欄位、命名、資料來源或 API 支援上的疑問。
- 這份流程的重點是：先確認是否真的是 API gap，再用固定的 follow-up 與 escalation 節奏處理。
- 不要用口頭承諾關閉 Review，要用可驗證結果關閉 Review。

### 流程總覽

* Review：Frontend 對照 UI 設計與 API 文件，確認所需欄位、型別、命名與資料來源。

* Verify：再次檢查 Swagger、實際 API response 與相關 endpoint，避免因漏看而誤判。

* Record：若仍有疑問，建立 Q-xxx review item，記錄 Summary、Finding、Impact、Status 與 Reference。

* Confirm：在 issue/comment 中 @Backend 相關同仁，明確提出需要確認的問題。

* Follow up：依時間節點追蹤，若超過合理時間未回覆，進入 escalation。

* Close：Backend 確認後，更新狀態為 Resolved、Needs backend fix、或 Invalid，並補上結論。

* UI / API review 流程的結束條件? API review 完成 = Swagger/API contract 更新 + FE 驗證

* 如果有pending issue 流程的結束條件? API review 完成 = 有解決方案 + Swagger/API contract 更新 + FE 驗證。


### Issue 分類

| 類型                   | 說明                                                 | Status 建議                              |
| -------------------- | -------------------------------------------------- | -------------------------------------- |
| API not found        | 目前找不到對應 API，需要確認是否已存在或尚未實作。                        | Open - pending backend confirmation    |
| Missing field        | UI 所需欄位未在 API response 中找到。                        | Open - pending backend confirmation    |
| Naming inconsistency | API 欄位命名與 domain naming 不一致，例如 chass* vs chassis*。 | Open - requires backend confirmation   |
| Field exists         | 原本誤判缺少，但後來確認 API 已提供欄位。                            | Resolved - field exists in API         |
| Confirmed gap        | Backend 確認目前 API 未提供，且需要後續開發。                      | Open - backend implementation required |

### Q-xxx issue template

### 已確認有欄位時的結案格式

### 命名不一致問題的寫法

### Follow-up 與 escalation 流程

| 時間          | 處理方式                                         |
| ----------- | -------------------------------------------- |
| 提出問題當天      | 建立 Q-xxx issue/comment，附上 UI 需求、API 觀察與明確問題。 |
| 2–3 個工作天未回覆 | 在原 comment 禮貌 follow up，確認 backend 是否已看到問題。  |
| 約 1 週未回覆    | 在 FE Weekly Sync 提出，說明此問題是否影響開發或 Sprint。     |
| 超過 2 週仍未回覆  | 視為流程問題，請 FE TL、BE TL 或 PM 協助協調。              |
| 需要長時間處理     | 請 Backend 提供 ETA，Frontend 依 ETA 調整開發順序。      |

### FE Weekly Sync 可提出的流程問題

* 當 API clarification 超過一段時間沒有回覆時，團隊希望的 follow-up 流程是什麼？

* 是否有建議的回覆 SLA，例如 2–3 個工作天先確認收到問題？

* 每個 API service 是否有明確的 API Owner 或聯絡窗口？

* 如果 Frontend 不確定 API Owner，應該由誰協助分派問題？

* 當問題影響 Sprint 或開發時程時，何時需要 TL 或 PM 介入協調？

### API Owner 的確認方式

在會議中可以這樣詢問：

我想確認一下，目前各個 API service 是否有明確的 API Owner 或主要聯絡窗口？如果 Frontend 對 API schema、欄位來源或 contract 有問題，應該優先聯繫哪位同仁或哪個 team？

這樣的問法聚焦在 建立溝通窗口，而不是追究個人責任。

### 整體原則

* 先驗證再提問：避免像 Q-004 一樣因為漏看 API 欄位而誤判。

* Resolved 的 issue 不應保留疑問句：應改成結論型描述，例如「field exists in API」。

* 命名問題要以 contract consistency 角度提出：不是單純指出 typo，而是說明可能造成維護與 mapping 風險。

* 長時間未回覆要轉成流程討論：避免 Frontend 一直等待而沒有明確下一步。

* 建立 API Owner 概念：讓 Frontend 知道 API 問題應該優先找誰確認。

### 目前案例對應

| 案例                          | 建議狀態                                 | 處理重點                                                                    |
| --------------------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| Q-004 Drawer chassis fields | Resolved - field exists in API       | 改成結論型描述，不再保留「Could you confirm」語句。                                      |
| Q-007 chass* naming         | Open - requires backend confirmation | 以 API naming consistency 角度提出，請 backend 確認是否為 intentional abbreviation。 |
| Local Storage page API      | Open - pending backend confirmation  | 先確認是否已有 API，若沒有則再確認是否需要 backend implementation。                         |

這份流程可以作為你們 FE team 後續 review UI and API 的共用標準，也可以在 FE Weekly Sync 中作為討論流程改善的基礎。
