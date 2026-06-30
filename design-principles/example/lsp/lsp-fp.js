/*
* 在函數式編程（FP）中，因為沒有 extends 或類別，LSP 的違反通常發生在 「函數簽名（Type Signature）一樣，但內部的副作用或行為預期卻不一樣」。
* 當你遇到「某個函數需要特殊處理」時，解決方案通常是 「利用 HOF 將特殊性外推」 或者 「使用聯集型別（Union Types）強制處理」。
*/

/*
* 1. FP 的 LSP 災難範例
* 假設你有一個資料處理流水線，所有的轉換函數（Transformer）都必須符合 (data: string) => string。
*/
type Transformer = (data: string) => string;

// 高層邏輯：執行所有轉換
const runPipeline = (data: string, transformers: Transformer[]) => {
  return transformers.reduce((acc, fn) => fn(acc), data);
};

// 正常的 Transformer
const toUpper: Transformer = s => s.toUpperCase();

// 特殊的傢伙：它需要先「連線」才能轉換，否則會報錯
const translate: Transformer = s => {
  if (!globalConnection) throw new Error("Not connected!"); 
  return translateApi(s);
};

/*
* 如果你直接把 translate 丟進 runPipeline，程式會崩潰。
* 這就是違反 LSP： translate 雖然型別符合，但它隱含了「必須連線」的前置條件，導致它無法安全地替換其他的 Transformer。
*/

/*
* 2. FP 的解決方案
* A. 提升抽象層次（將特殊行為一般化）
* 這與 OOP 的方案一類似。我們重新定義「合約」，讓它包含可能需要的非同步準備動作。
*/
// 重新定義合約：現在所有的轉換都允許是同步或非同步的
type AsyncTransformer = (data: string) => Promise<string>;

const runAsyncPipeline = async (data: string, transformers: AsyncTransformer[]) => {
  let result = data;
  for (const fn of transformers) {
    result = await fn(result); // 載入器現在知道要等待
  }
  return result;
};

// 特殊傢伙現在符合合約了，它把「連線」包在自己的行為裡
const translate: AsyncTransformer = async (s) => {
  await ensureConnection(); 
  return translateApi(s);
};

/*
* B. 利用閉包與高階函數進行「預處理」（最推薦）
* 與其讓 runPipeline 去關心誰要登入，不如在傳入之前，就把該處理的特殊事處理掉。這稱為 「依賴預注入」。    
*/
// 1. 寫一個裝飾器，把「需要連線」這件事封裝起來
const withConnection = (fn: Transformer): Transformer => (data) => {
  if (!globalConnection) {
    console.log("Auto-connecting...");
    // 處理特殊邏輯...
  }
  return fn(data);
};

// 2. 傳入時，它已經被包裝成一個「正常人」了
const safeTranslate = withConnection(translate);

runPipeline("hello", [toUpper, safeTranslate]); // 載入器依然保持簡單

/*
* C. 使用標記聯集（Tagged Union / Pattern Matching）
* 如果你真的必須在主流程處理不同的類別，FP 的做法是用型別系統強迫你處理所有情況，這通常出現在資料結構的設計中。    
*/
type Action = 
  | { type: 'NORMAL', fn: Transformer }
  | { type: 'REQUIRES_AUTH', fn: Transformer, authKey: string };

const runActions = (data: string, actions: Action[]) => {
  return actions.reduce((acc, action) => {
    switch (action.type) {
      case 'NORMAL': 
        return action.fn(acc);
      case 'REQUIRES_AUTH': 
        // 在這裡處理特殊邏輯，但這是被型別系統「明確要求」的
        checkAuth(action.authKey);
        return action.fn(acc);
    }
  }, data);
};  

/*
* 3. 總結
* 在 FP 中遇到「特殊的傢伙」，你的思考路徑應該是：
* 包裝它（Wrapper/Decorator）：在函數外面套一層，讓它看起來跟別人一樣。
* 升級合約（Context/Monad）：如果大家都有非同步或錯誤處理需求，就把回傳值改成 Promise 或 Either。
* 顯式處理（Union Types）：如果真的沒辦法一般化，就用 type 標示清楚，讓編譯器強迫你寫出處理邏輯。
*
* LSP 在 FP 中的意義就是：
* 不要讓呼叫者（如 reduce 或 map）感到驚訝。如果你傳入一個函數，它就應該像那個型別宣告的一樣乖乖運作，而不是在裡面藏著需要外部配合的暗號。
*/