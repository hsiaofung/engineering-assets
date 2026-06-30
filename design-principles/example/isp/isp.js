/*
* FP： 不要傳入不需要的參數（或是過大的物件）。
*/
// ❌ 差的：函數依賴了整個巨大的 User 物件
const getFullName = (user: User) => `${user.firstName} ${user.lastName}`;

// ✅ 好的：只依賴需要的屬性（解構或局部應用）
const getFullName = ({ firstName, lastName }: NameInfo) => `${firstName} ${lastName}`;