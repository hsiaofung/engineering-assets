const add = (x, y) => x + y;
const subtract = (x, y) => x - y;

const combine4and5 = (func) => func(4, 5);

console.log(combine4and5(add));
console.log(combine4and5(subtract));
console.log(combine4and5(Math.min));
console.log(combine4and5(Math.max));

const combineNames = (func) => func('Shaun', 'Wassell');

const simple = (first, last) => first + ' ' + last;
const govtForm = (first, last) => `${last.toUpperCase()}, ${first.toUpperCase()}`;
const initials = (first, last) => first[0] + last[0];

console.log(combineNames(simple));
console.log(combineNames(govtForm));
console.log(combineNames(initials));