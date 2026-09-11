# Table Interaction Layer

## Purpose
建立 Table Interaction Layer，集中管理 data-table-v1 event 與 query parameter mapping，避免每個 page 重複實作。

## Responsibilities

### data-loader: loading lifecycle

保持單純：

負責:
- trigger data loading
- call API
- expose data
- loading state
- error state

不負責:
- pagination
- sorting
- searching
- table state
- column display

### TableInteractionService: transformation logic

另外一層： Table Interaction Layer

負責:
- Pagination event
- Sort event
- Search event
- Reload event
- Transform data-table-v1 events into updated table parameters.
- Provide reusable pagination/sort/search/display handling logic.

### Page Component: state owner
- Own page-specific table parameters.
- Trigger DataLoader refresh after parameter updates.

### 目前責任區塊

```json
Page
 ├── tableParams
 ├── getDataFn
 └── loader.refresh()

TableInteraction
 └── params transformation

DataLoader
 └── loading execution
```

# 流程:

```json
User Action
    ↓
data-table-v1 event 
    |
    |  sort/pageChange/search
    ↓
TableInteractionService
    ↓
Update query state
    ↓
Trigger data-loader refresh
    ↓
API request
```

# Table interaction state 要不要跟 data-loader 綁在一起？要不要抽成 reusable object/service？
Design Decision:
- data-loader 保持單純
- table interaction 獨立