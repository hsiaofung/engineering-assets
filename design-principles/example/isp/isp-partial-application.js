
/*
* FP 中的「局部應用」(Partial Application) 才是終極招式
* 如果你覺得傳入一個「物件」還是感覺怪怪的（因為還是有結構依賴），
* FP 工程師通常會連物件都不要，直接把屬性拆開，或者使用 **Currying (柯里化)**。
*
* 這才是 FP 風格的 ISP 實踐：
*/


// 完全不依賴任何物件結構，只依賴原始型別
const getFullName = (firstName: string) => (lastName: string) => 
  `${firstName} ${lastName}`;

// 使用時
const nameWithJohn = getFullName('John');
console.log(nameWithJohn('Doe'));