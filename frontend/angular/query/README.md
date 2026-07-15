# 目的:
- 這個query 的目錄，主要的目地和責任是在做query transformation layer。
- old query → new query
- 日後有新增的query要轉換，例如: action buttton, 就可以放到這下面，好擴充。
- 另一方面，如果日後API sort 參數變更，只要改sort-query.ts 即可。

# 注意
- 狀態: 設計階段，還未驗證。
- 這些程式碼的狀態還未經過驗證。只在設計階段。
- 可在之後的實作去驗證這些code。