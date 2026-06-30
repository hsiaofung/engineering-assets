//❌ 違反 DIP（依賴具體實作）：
const saveUser = (user) => {
  // 直接依賴具體的 API 呼叫
  const response = Http.post('/api/user', user); 
  return response;
};

/*
* ✅ 符合 DIP（依賴抽象/行為）：
* saveUser 不再依賴 Http，而是依賴「一個能存東西的函數」
* 這裡的 saverFn 就是那個「抽象」，它定義了行為的規格，而不涉及具體實作。   
* 在 FP 中，我們不常談論「介面繼承」，但 DIP 的精神無處不在。其實就是「把依賴當作參數傳進去」。
*/
const saveUser = (saverFn, user) => {
  return saverFn(user);
};

// 在外部決定要注入什麼實作
const httpSaver = (user) => Http.post('/api/user', user);
saveUser(httpSaver, userData);