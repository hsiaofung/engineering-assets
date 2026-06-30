/*
* 特例：物件字面量的「嚴格檢查」
* 這裡有個小細節（這也是很多人會被搞混的地方）：TypeScript 只有在「賦值給變數」或「傳遞現有物件」時會寬容。
* 如果你直接在參數位置寫「物件字面量」，它會啟動額外的過剩屬性檢查。
*/
interface NameInfo {
  firstName: string;
  lastName: string;
}

// ❌ 直接傳入字面量會報錯（它怕你打錯字）
getFullName({ 
  firstName: 'John', 
  lastName: 'Doe', 
  age: 30 // 報錯：NameInfo 沒有 age 屬性
});

// ✅ 先賦值給一個變數，再傳進去就沒問題
const user = { firstName: 'John', lastName: 'Doe', age: 30 };
getFullName(user); // 通過！

/*
* 這跟 ISP 有什麼關係？
* 這就是為什麼我說這樣寫符合 ISP (介面隔離)：
* 函數端的保護：getFullName 宣告了 NameInfo，它就像是一道防火牆，保證這個函數內部只能存取 firstName 和 lastName。
* 即使你傳入整個 User，你在函數內輸入 person.email 會報錯。
* 呼叫端的彈性：因為 TypeScript 的結構型別特性，你不需要為了符合介面而手動去「轉型」或「重新包裝」你的 User 物件。
*/