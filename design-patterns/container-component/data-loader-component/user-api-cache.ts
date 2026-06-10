const getDataFn = () => {
  if (this.cacheService.has('user-345')) {
    return of(this.cacheService.get('user-345')); // 直接回傳快取
  }
  return this.http.get('/api/users/345'); // 沒快取才發請求
}