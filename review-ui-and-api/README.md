# Review UI/API
- 透過流程，流程管理讓不負責的人現形，讓不負責的人去負責。
- 不要用口頭承諾關閉 Review，要用可驗證結果關閉 Review。

# 主流程   
1. UX 發訊息要求review。
2. FE check Figma and Swagger，並將task 狀態變為review。 
3. 在gitLab task 發comment，寫出要釐清的問題
4. BE 回復結束   

# 子流程-1(若BE一直沒有回覆問題)-Decision by Jeffrey
3-1. 2-3天後，透過teams 發訊息給他。     
3-2. 若還是沒回覆，立即反應給Jeffrey。


# 子流程-2(若BE沒有提供所需要的欄位)-Decision by Jeffrey   
4-1. 更新Q-xxx的內容。   
4-2. 點擊reply to comment，通知UX釐清問題。   

# 子流程-3(若BE口頭承諾所需要的欄位)-Decision by Jeffrey   
4-3. API review 完成 = Swagger/API contract 更新 + FE 驗證。 

# 子流程-4 還沒有開始實作或決定方案(Pending issue)-Decision by Jeffrey   
4-3. API review 完成 = 有解決方案 + Swagger/API contract 更新 + FE 驗證。

# 子流程-5 正式的 Swagger（arch review 後）還沒完成，但先提供一份可供 FE 開發的 API Spec。
4-3. API review 完成 ?
- Temporary API Spec ≠ API Review Completed
- API Review completion 中的 Swagger/API contract update，是否需要是已完成 review / merge 的正式 contract？還是 temporary spec 也算？
- API Review completion 應以團隊共同使用的 API contract 為準，而非 temporary spec。
- 原因：
  如果 temporary spec 也算完成，可能發生：
    - FE 驗證 temporary spec。
    - Arch review 後 API 修改。
    - FE 又需要重新調整。
    - Review record 已經顯示完成。
  這會降低 review 的價值。 


# Review 的產出是「已確認的規格」，不是「未來會有的規格」。

UX                 
 ↓                   
UI Spec + Figma                 
 ↓                         
FE Review                   
 ↓                           
API / Behavior clarification                      
 ↓                          
Specification confirmed                            
 ↓                                  
Development                           

有3個問題
1. 所以應該在review 前要提供UI spec ?
2. 所以review 的狀態要一直等到swagger 更新?
3. 這個flow 是否要成為團隊的共識?
   - 我整理了一份 UI/API Review flow，想確認 FE 團隊內是否先採用一致方式，避免每個人遇到問題時處理方式不同。
   - 首先FE 必須有一致的做法，才好去對外說明。不然方法每個人都不同，是否要外界對FE的每一個人都有不同的對應做法?

# 成為團隊共識的流程
- Step 1             
FE 內部整理 Review Flow                           
        ↓                             
Step 2                              
FE TL / Team 確認哪些是 FE standard                          
        ↓                              
Step 3                               
與 UX / BE sync                             
確認跨團隊協作部分                              
        ↓                           
Step 4                                 
形成 UI/API Review Guideline              

# 未來改善
- 你跟 Jeffrey 確認的是「Review Completion 的定義」，不是「流程一定要這麼慢」。

- 也就是說： 
  - 完成條件可以很嚴謹。
  - 流程效率仍然可以改善。

  這兩件事不衝突。

- 目前我遵守團隊已確認的流程。
- 如果之後你發現這個流程真的經常造成：
  - Sprint 延誤
  - UX 等待
  - FE 閒置
  - BE 反覆修改

  那就有充分的事實可以在 retrospective 或流程討論時提出：   
 「我們目前的 Review completion 定義沒有問題，但整體 lead time 偏長，是否有機會優化前面的協作流程？」   

- 這樣討論的是改善流程，而不是否定主管當初訂的標準。

- 我覺得這樣會比較有建設性，也比較容易被團隊接受。

- 例如未來團隊可以討論：
  - API Review 是否應該有預期完成時間？
  - UX 是否可以先完成部分 UI Spec？
  - API 是否應該在 FE review 前就先完成大部分確認？
  - Pending issue 是否應該有 owner 和 ETA？

這些都是改善效率的方法，但不需要改變「完成」的定義。

