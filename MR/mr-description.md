# Title

`#102 Compute：resource routing、樹選取同步與 Pod/Pool/Row/Rack 系統列表`

---

# Description

## Summary
完成 Compute #90–#102：將路由改為 4.0 resource-based routing，串接 ancestor API 與 canonical route，樹與 URL 選取同步，並提供 Pod / Virtual Pool / Physical Pool / Row / Rack 的系統列表頁。

進入 Compute 後停在：

`/compute/pod/physical-assets`

本段 **不含** drawer / system 專頁。

---

## Tickets

| Ticket | 內容 |
|--------|------|
| #90 | 遷移 `cloudComputeV1Routes` 至 SCC 4.0 resource-based routing |
| #91 | `computeResourceResolveGuard` |
| #92 | Compute ancestor API |
| #93 | Canonical route builder |
| #94 | Navigation 改走 resource routing |
| #95 | Resource routing tests |
| #96 | Tree data model |
| #97 | Tree data adapter |
| #98 | Tree navigation |
| #99 | Tree selection 與 URL 同步 |
| #100 | Tree UX / 結構 |
| #101 | Tree navigation testing |
| #102 | Pod / Pool / Row / Rack resource list page |

---

## How to test

### Automated

```bash
npx ng test --include='src/app/**/compute/**/*.spec.ts'
npx playwright test e2e/compute --project=chromium
```

- **Unit**：routing / guard、tree model / adapter / navigation / selection、systems list 相關 spec。
- **E2E**：`e2e/compute`（含貼 URL 還原樹選取等）。

### Manual

- [ ] 開啟 `/compute` → 導向 `/compute/pod/physical-assets`，顯示系統列表。
- [ ] 樹可展開 Pod → Virtual Pool / Physical Pool → Row → Rack；點節點只換到對應列表，query 正確。
- [ ] 直接開啟 virtual-pool / physical-pool / row / rack URL，樹上對應節點為選中。
- [ ] `/compute/resource/:id` 可經 guard 進資源；無效或缺失 id 時回到 compute。
- [ ] 離開後再進 `/compute`，列表不會沿用上次的 row/rack filter。

---

## Out of scope
- Drawer / System 專頁與該層列表
- #102 之後的項目