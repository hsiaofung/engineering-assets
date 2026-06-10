const numbers = [10, 4, 5, 2, 9, 7, 8, 1];

const numericalAscending = (a, b) => a - b;

const numericalDescending = (a, b) => b - a;

const sortedNumbers = numbers.slice().sort(numericalAscending);

console.log(sortedNumbers);