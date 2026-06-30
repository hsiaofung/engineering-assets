/*
* 1. OOP 中的經典範例：正方形與長方形
* 這是解釋 LSP 最著名的案例。在幾何學上，正方形是長方形的一種；但在軟體設計中，讓正方形繼承長方形通常會違反 LSP。
*
* ❌ 違反 LSP 的設計：
* 為什麼違反 LSP？
* 因為 resize 函數預期「修改高度不應影響寬度」（這是 Rectangle 的契約），但 Square 破壞了這個預期。子類別 Square 無法完美替換父類別 Rectangle。
*
*/
class Rectangle {
  width: number = 0;
  height: number = 0;

  setWidth(w: number) { this.width = w; }
  setHeight(h: number) { this.height = h; }
  getArea() { return this.width * this.height; }
}

class Square extends Rectangle {
  // 正方形的寬高必須連動
  override setWidth(w: number) {
    this.width = w;
    this.height = w; 
  }
  override setHeight(h: number) {
    this.width = h;
    this.height = h;
  }
}

// 測試函數：這個函數「以為」進來的是長方形，所以寬高可以獨立設定
function resize(rect: Rectangle) {
  rect.setWidth(10);
  rect.setHeight(5);
  // 預期面積應該是 50
  console.log(rect.getArea()); 
}

const mySquare = new Square();
resize(mySquare); // 結果得到 25 (因為 setHeight 把 width 也改成 5 了)

/*
* 2. FP 中的範例：函數簽名與行為預期
* 在 FP 中，LSP 通常體現於 「高階函數對傳入函數的預期」。
* 
* 假設你有一個處理使用者名稱的系統：
*
* ❌ 違反 LSP 的 FP 設計：
*
*/
// 定義一個契約：傳入 string，回傳 string
type NameFormatter = (name: string) => string;

const welcomeUser = (formatter: NameFormatter, name: string) => {
  console.log(`Hello, ${formatter(name).toUpperCase()}`);
};

// 正確的實作
const toAdmin: NameFormatter = (n) => `Admin ${n}`;

// 錯誤的實作（違反 LSP）
const riskyFormatter: NameFormatter = (n) => {
  if (n === "") throw new Error("Empty name!"); // 破壞了「回傳字串」的預期，拋出了異常
  return n;
};

welcomeUser(toAdmin, "Gemini"); // 沒問題
welcomeUser(riskyFormatter, ""); // 崩潰！