//❌ 違反 OCP 的做法（邏輯寫死）：
//如果你想過濾不同的條件，必須一直修改 filterData。
const filterData = (list, type) => {
  if (type === 'even') return list.filter(x => x % 2 === 0);
  if (type === 'positive') return list.filter(x => x > 0); // 必須修改原始碼
};


//✅ 符合 OCP 的做法（行為參數化）：
//原函數 filter 只負責「遍歷與過濾」的流程，具體的「判斷邏輯」由外部傳入。
// 擴增開放：你可以傳入任何判斷式 (Predicate)
const filter = (predicate, list) => list.filter(predicate);

// 修改封閉：filter 函數本身永遠不需要改動
const isEven = x => x % 2 === 0;
const isPositive = x => x > 0;

filter(isEven, [1, 2, 3, 4]);
filter(isPositive, [-1, 0, 1]);