const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const sum = numbers.reduce((result, x) => {
  console.log(`Result is: ${result}, x is ${x}`);
  return result + x;
});

console.log(sum);