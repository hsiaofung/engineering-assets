//在 FP 中，我們透過組合多個小函數來構建複雜行為。如果你想增加新功能（例如 Log 記錄或權限檢查），你不是去改原有的函數，而是「包裝」它。
//範例：增加功能而不修改原邏輯

const multiply = (a, b) => a * b;

// 擴增開放：定義一個裝飾器函數來增加 Log 功能
const withLogger = (fn) => (...args) => {
  console.log(`Calling with args: ${args}`);
  return fn(...args);
};

// 不需要修改 multiply 的原始碼
const loggedMultiply = withLogger(multiply);