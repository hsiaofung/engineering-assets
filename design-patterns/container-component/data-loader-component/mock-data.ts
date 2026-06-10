// 模擬一個回傳 Promise 的函數
export function getMockUser(userId: string) {
  return () => new Promise(resolve => {
    setTimeout(() => {
      resolve({ id: userId, name: '五月天阿信', role: '主唱' });
    }, 1000);
  });
}