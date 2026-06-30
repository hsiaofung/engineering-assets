// 傳統：邏輯寫死在內部
const processList = (list) => {
  return list.map(item => item * 2); // 控制權在內部
};

// IoC：將控制權反轉給調用者
const processListIoC = (list, transformFn) => {
  return list.map(transformFn); // 控制權在外部傳入的 transformFn
};



