queryFactory.create(
  async () => {
    return JSON.parse(
      localStorage.getItem('user')!
    );
  }
);