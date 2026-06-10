/*
* 依賴注入的函數化：柯里化 (Currying)
* FP 常用柯里化來模擬「配置階段」與「執行階段」，這其實就是一種手動的 DI。
*/
// 1. 定義一個需要「依賴」的函數（例如需要一個 Logger）
const createSaver = (logger) => (data) => {
  logger.log(`Saving: ${data}`);
  // 儲存邏輯...
};

// 2. 注入依賴（配置階段）
const saveWithConsole = createSaver(console);
const saveWithSentry = createSaver(sentryLogger);

// 3. 執行（控制權反轉，主邏輯不再關心 logger 是誰）
saveWithConsole("User Data");

/*
* 回呼與連續傳遞風格 (Continuation-Passing Style, CPS)
* 這在非同步處理中非常常見。你不是主動去「拿」結果，而是傳入一個「下一步要做什麼」的函數。
*/
const fetchData = (url, callback) => {
  // 抓取資料...
  callback(data); // 執行的時機由 fetchData 內部決定，但執行的內容由外部定義
};


