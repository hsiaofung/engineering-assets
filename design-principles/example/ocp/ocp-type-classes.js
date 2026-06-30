/*
* 使用「型別類別」的概念 (Type Classes / Protocols)
* 在像 TypeScript 或 Haskell 這樣的環境中，我們可以利用「結構化分派」來達成 OCP。這類似於物件導向的 Interface，但在 FP 中更強調資料與行為的分離。
* 定義行為的規範（類似 Interface）
*/
const calculateTotal = (calculator, items) => {
  return items.reduce((total, item) => total + calculator(item), 0);
};

// 不同的行為實作
const priceCalculator = (item) => item.price;
const weightCalculator = (item) => item.weight;

// 擴展時只需定義新的 calculator 函數，不必動到 calculateTotal
calculateTotal(priceCalculator, products);


/*
* 場景 B：當邏輯具有「領域意義」
* 如果你在處理複雜的業務（例如：支付系統、不同類型的儀表板元件），用tyep classes傳入符合規範的實體 會更清晰：
*/
interface PaymentProvider {
  authorize: () => boolean;
  capture: () => void;
}

// 雖然這也是 HOF，但它是在處理「一組行為」的契約
const checkout = (provider: PaymentProvider) => {
  if (provider.authorize()) {
    provider.capture();
  }
};

/*
* 假設你有一個儀表板元件，需要渲染不同的資料：
*/
// 1. 定義行為規範 (像介面，但我們關注的是行為)
interface Renderable {
  render: (data: any) => string;
}

// 2. 核心邏輯 (OCP: 修改封閉)
// 它只認行為，不認特定的資料類別
const displayOnDashboard = (renderer: Renderable, data: any) => {
  console.log("--- Dashboard Item ---");
  console.log(renderer.render(data));
};

// 3. 擴展 (OCP: 擴增開放)
// 針對「折線圖資料」定義一種渲染方式
const LineChartRenderer: Renderable = {
  render: (data) => `Drawing lines for ${data.points}`
};

// 針對「圓餅圖資料」定義另一種渲染方式
const PieChartRenderer: Renderable = {
  render: (data) => `Drawing slices for ${data.labels}`
};

// 使用時，根據需求組合不同的行為
displayOnDashboard(LineChartRenderer, { points: [10, 20] });
displayOnDashboard(PieChartRenderer, { labels: ['A', 'B'] });