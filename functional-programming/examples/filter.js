const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// const evens = [];

// for (const x of numbers) {
//   if (x % 2 === 0) {
//     evens.push(x);
//   }
// }

// console.log(evens);

const isEven = x => x % 2 === 0; // Predicate

const evens = numbers.filter(isEven);