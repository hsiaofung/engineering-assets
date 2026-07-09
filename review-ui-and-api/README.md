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
4-3.  ?

 


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

