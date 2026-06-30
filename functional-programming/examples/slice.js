const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(numbers.slice());

// const reversedNumbers = numbers.slice().reverse();
const reversedNumbers = [...numbers].reverse();

console.log(reversedNumbers);