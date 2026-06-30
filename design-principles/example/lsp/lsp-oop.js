/*
* 我懂了，那如果真正遇到 "w.login(); // 為了這個特殊的傢伙，你得寫死邏輯"，這種情況要怎麼處理?
*
*/

/*
* 1. 方案一：行為上推 (Push Behavior Up) —— 最推薦
* 如果這個「特殊行為」在邏輯上其實是合理的，只是目前只有少數人有，你可以考慮將這個行為定義到基類或介面中，但在基類給予一個「什麼都不做」的預設實作。
* 做法： 在 BaseWidget 增加 prepare() 方法。
* 優點： 載入器依然只管呼叫 prepare()，不需要知道裡面是 login 還是空的。*
*
*/

// 基類
class BaseWidget {
  prepare() { /* 預設什麼都不做 */ }
  abstract init(): void;
}

// 特殊傢伙
class SpecialChartWidget extends BaseWidget {
  override prepare() {
    this.login(); // 把特殊的邏輯藏在標準的介面後面
  }
  init() { /* ... */ }
}

// 載入器 (符合 LSP，完全不需要 if-else)
widgets.forEach(w => {
  w.prepare(); 
  w.init();
});

/*
* 2. 方案二：利用組合 (Composition) 分離職責
* 如果 login 真的太特殊，完全不屬於 Widget 的範疇，那就不應該透過繼承來解決。你可以使用裝飾器模式 (Decorator Pattern) 或簡單的組合。
* 做法： 讓需要登入的 Widget 外部包一層「處理器」。
* 優點： 保持了 Widget 介面的純潔。
*/
// 一個專門負責「登入後再初始化」的執行器
const withAuth = (widget: BaseWidget, authService: AuthService) => {
  return {
    init: () => {
      authService.login().then(() => widget.init());
    }
  };
};

// 載入器拿到的依然是符合 init 規範的東西
const protectedWidget = withAuth(new SpecialChartWidget(), auth);
initAllWidgets([protectedWidget]);

/*
* 3. 方案三：使用生命週期鉤子 (Lifecycle Hooks)
* 這在 Angular 或 Vue 等框架中非常常見。你定義一組完整的生命週期（如 onBeforeInit, onInit），讓特殊的傢伙自己去掛載邏輯。
*
* 做法： 所有的 Widget 都會跑一遍所有的生命週期。
*
* 效果： 對載入器來說，它只是按照順序呼叫 hook1, hook2，至於誰在 hook1 裡面做了 login，載入器完全不在乎。
*/

/*
* 4. 方案四：雙重分派 (Visitor Pattern) —— 進階技巧
* 如果你有大量不同的特殊行為，且不想弄亂基類，可以使用 訪客模式 (Visitor Pattern)。
* 
* 做法： 讓 Widget 接受一個「處理者」。
*
* 白話文： Widget 說：「我不決定怎麼處理，但我接受一個 Processor 來處理我。」
*/
interface WidgetVisitor {
  visitNormal(w: NormalWidget): void;
  visitSpecial(w: SpecialWidget): void; // 在這裡處理特殊的 login
}

/*
* 總結你的處理心法
* 遇到特殊邏輯時，請按照這個順序思考：
*
* 能不能「一般化」？ (方案一：把 login 變成 prepare)
*
* 能不能「包裝」它？ (方案二：在外面處理完特殊事，再把它當一般人傳進去)
*
* 能不能「標準化」？ (方案三：定義更多標準步驟，讓大家各取所需)
*
* 核心目標： 絕對不要讓你的 forEach 迴圈裡面出現任何一個特定類別的名字。只要迴圈裡只剩下 w.method()，你的 LSP 就修復了，你的系統也就變回「對擴展開放」的狀態了。
*/