const numbers = [1, 2, 4, 6, 8, 10];

// let result = false;

// for (const x of numbers) {
//   if (x % 2 !== 0) {
//     result = true;
//     break;
//   }
// }

// console.log(result);

const isOdd = x => x % 2 !== 0;

console.log(numbers.every(isOdd));
console.log(numbers.some(isOdd));

if (numbers.some(isOdd)) {
  console.log('There is at least one odd number in the array!')
}