function myFunction(arg1, arg2) {
  // function body
  return arg1 + arg2;
}

const myFunction2 = function(arg1, arg2) {
  return arg1 + arg2;
}

// const add = (arg1, arg2) => {
//   const sum = arg1 + arg2;
//   return sum;
// }

const add = (arg1, arg2) => arg1 + arg2;

const double = number => number * 2;

const twoPlusThree = () => 2 + 3;

const createPersonData = () => ({
  name: 'Jane Doe',
  age: 35,
  job: 'Programmer',
});