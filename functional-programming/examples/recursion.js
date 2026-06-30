const countDown = x => {
  if (x === 0) { // Stopping point
    console.log('Blastoff!');
  } else {
    console.log(x);
    countDown(x - 1); // Change!
  }
}

// 1 1 2 3 5 8 13 21 ...

const fib = n => {
  if (n <= 1) {
    return 1;
  } else {
    return fib(n - 1) + fib(n - 2);
  }
}

console.log(fib(100))