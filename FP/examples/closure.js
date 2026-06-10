const createPrinter = () => {
  const myFavoriteNumber = 42;

  return () => console.log(`My favorite number is ${myFavoriteNumber}`);
}

const printer = createPrinter();
printer();
// console.log(myFavoriteNumber);

const Person = ({ name, age, job }) => {
  let personName = name;
  let personAge = age;
  let personJob = job;

  return {
    getName: () => personName,
    getAge: () => personAge,
    incrementAge: () => personAge += 1,
  };
}

const person = Person({ name: 'Shaun', age: 123, job: 'Developer' });
console.log(person.getAge());
person.incrementAge();
console.log(person.getAge());