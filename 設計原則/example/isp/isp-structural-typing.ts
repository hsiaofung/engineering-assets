/*
* 精進的做法：結構化分派 (Structural Typing)
* 為了兼顧「常用（傳入 user）」與「設計原則 (ISP)」，在 TypeScript 中我們通常會這樣寫：
*/
// 定義一個最小需求的介面
interface NameInfo {
  firstName: string;
  lastName: string;
}

// 函數只依賴於最小需求
const getFullName = (person: NameInfo) => `${person.firstName} ${person.lastName}`;

// 實戰中依然可以直接傳入 user，因為 user 滿足了 NameInfo 的條件
const user = await api.getUser(); // 拿到完整的 User 物件
const fullName = getFullName(user); // 沒問題！TypeScript 會自動檢查

/*
* 這樣做的好處是：
* 對你來說沒變：你依然是 getFullName(user)，寫法一模一樣。
* 對架構來說變了：getFullName 脫離了對 User 大物件的依賴。
* 現在它也能處理 Partner、Customer 或是任何長得像名片的東西。這就是 ISP (介面隔離) 的威力：「只看你需要的那部分。」
*/

/*
* 總結你的點子
* 你說的「常用方法」其實跟 ISP 並不衝突，關鍵在於函數的宣告方式：
* 傳統思維：我拿什麼物件，我就傳什麼物件。（函數與資料來源綁死）
* ISP/SOLID 思維：我需要什麼欄位，我就宣告什麼介面。（函數與需求綁定）
*/