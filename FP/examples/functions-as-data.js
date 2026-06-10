const sayHello = name => console.log('Hello, ' + name + '!');

sayHello('Shaun');

const sayHello2 = sayHello;

sayHello2('Shaun');

const shouldAdd = true;

const fn = shouldAdd
  ? (x, y) => x + y
  : (x, y) => x * y;

console.log(fn(10, 20));

const fetchDataReal = () => {
  console.log('Loading data from the network...');
  return {};
}

const fetchDataFake = () => ({
  name: 'Jane Doe',
  age: 35,
  job: 'Programmer',
});

const IS_TESTING = true;

const fetchData = IS_TESTING
  ? fetchDataFake
  : fetchDataReal;