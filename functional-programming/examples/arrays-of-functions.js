const double = x => x * 2;
const minusOne = x => x - 1;
const square = x => x * x;

const myNumber = 42;

const functions = [
  square,
  double,
  minusOne,
  Math.sqrt,
]

let result = myNumber;

for (const fn of functions) {
  result = fn(result);
}

console.log('The answer is ' + result);