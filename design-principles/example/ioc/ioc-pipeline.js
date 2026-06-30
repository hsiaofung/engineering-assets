/*
* FP-style 的進階版：Pipeline
* 在函數式編程中，我們通常不會只用 forEach 跑迴圈（因為 forEach 通常是為了執行副作用）。我們會用 pipe 或 compose 把這串函數陣列結合成一個「超級函數」。
*/
// 這就是你說的「函數陣列」
const processors = [
  validateData,
  formatCurrency,
  addTax,
  generateLabel
];

// FP 的實現方式：這是一個把陣列變成「一條流水線」的工具
const pipeline = processors.reduce((a, b) => (arg) => b(a(arg)));

// 使用
const result = pipeline(rawData);


/*
* 圖像化理解：控制流的反轉
* FP-style 的 IoC：從「命令」轉向「聲明」
* 在函數式編程中，我們實現 IoC 的方式通常是將「控制結構」與「業務邏輯」分離。
* Pipeline / Composition: 
* 你定義的陣列 [fun1, fun2] 在 FP 中通常會演變成一個 組合 (Composition)。
* runFlow 就像一個微型框架，它掌握了「如何遍歷函數」的控制權。
* 你身為開發者，只需要「聲明」你要執行的函數清單。
*/ 
// 1. 業務邏輯 (專注 How to)
const validate = (data) => ({ ...data, valid: true });
const save = (data) => { console.log("Saved", data); return data; };

// 2. 控制結構 (IoC)
// 這是一個通用的「執行流」，它決定了函數該怎麼被串聯 (例如 Pipe)
const runFlow = (...fns) => (initialData) => fns.reduce((val, fn) => fn(val), initialData);

// 3. 實踐 IoC
// 開發者只需要定義「清單」，而不必寫迴圈的細節
const myApp = runFlow(validate, save);

myApp({ id: 1 });