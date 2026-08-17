# Title

Implement Compute Tree node selection

# Purpose

URL 改變時，同步 Tree Selected Node。

例如：
```json
User paste URL

↓

Router

↓

Tree Expand

↓

Highlight Current Node
```

# 處理：

- selected node state
- node click
- selected node → parent page
- selected node metadata

例如：

```ts
selectedKey
nodeClick
``

最後讓 Compute page 可以知道：

```ts
User clicks System
        ↓
ComputeTreeComponent
        ↓
selectedKey
        ↓
Compute page
        ↓
Navigate / display details
```

# Acceptance Criteria
- Browser Refresh 後 Tree 正確展開
- Browser Back/Forward Tree 正確同步