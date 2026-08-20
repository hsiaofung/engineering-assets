1. Mapper

這個最沒有問題。

例如：
```text
API Response
     ↓
   Mapper
     ↓
Domain Model
     ↓
UI
```
Mapper 的責任就是：

把外部資料模型轉換成 application/domain 使用的模型。

這就是很典型的 Mapping Pattern。

例如你的 Compute Tree：
```text
mapTreeNode(response): ComputeTreeNode
```
就是 Mapper。