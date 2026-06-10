/*
* LSP 的存在，其實不是為了限制子類別，而是為了保護「呼叫者」（也就是高層邏輯）。
* 它的終極目標是：讓你寫好的程式碼，不需要為了適應不同的子類別而寫一堆 if-else。 
*
*/

/*
* 1. LSP 的真正目的：實現「可預測性」
* 想像你正在開發 Angular Dashboard。你有一個載入器，負責把畫面上所有的 Widget 都啟動：
*
*/ 
// 這是高層邏輯：載入器
function initAllWidgets(widgets: BaseWidget[]) {
  widgets.forEach(w => {
    w.init(); // 載入器「預期」所有的 Widget 呼叫 init() 都能正常啟動
  });
}

/*
* 如果沒有 LSP（不可預測）：
* 某個新來的同事寫了一個 SpecialChartWidget，繼承了 BaseWidget，但他改寫了行為：
* 他規定這個 Widget 必須先呼叫 login() 才能呼叫 init()，否則會崩潰。
* 這下慘了，你的載入器會壞掉。為了修好它，你被迫寫出這種代碼：
*
*/ 

function initAllWidgets(widgets: BaseWidget[]) {
  widgets.forEach(w => {
    if (w instanceof SpecialChartWidget) {
      w.login(); // 為了這個特殊的傢伙，你得寫死邏輯
    }
    w.init();
  });
}

/*
* 如果你違反了 LSP，你的 OCP（開放封閉原則）也就跟著崩潰了。 
* 因為每增加一個不聽話的子類別，你就得回來改一次載入器的程式碼。
* 
*/

/*
* LSP 在做什麼？它在維護「合約」
* 你可以把 LSP 想像成一場「合約精神」：
* 父類別（合約制定者）： 承諾「只要呼叫 init()，我就會準備好資料」。
* 子類別（合約執行者）： 你可以換一種方式準備資料（用 API 抓、用 LocalStorage 抓），但你不能改變合約的結果（必須準備好資料，且不能報錯）。
*
* 當你遵守 LSP 時，你會得到：
* 真正的多型 (Polymorphism)： 你可以放心地把任何子類別丟給高層邏輯跑。
* 降低耦合： 高層邏輯完全不需要知道具體是哪個子類別在動。
* 程式碼強健性： 減少了因為「意外行為」導致的 Runtime Error。
*/ 