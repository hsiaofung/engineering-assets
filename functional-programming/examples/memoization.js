let memo = {};

const fib = n => {
  if (memo[n]) {
    return memo[n];
  }

  if (n <= 1) {
    const result = 1;
    memo[n] = result;
    return result;
  } else {
    const result = fib(n - 1) + fib(n - 2);
    memo[n] = result;
    return result;
  }
}

console.log(fib(100));