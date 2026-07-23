我整理一下目前狀況。你的判斷方向基本正確：**現在 SCC 4.0 的 Compute routing 還是舊版架構，需要改 `cloudComputeV1Routes`，但不要直接照 Spec 寫，而是先釐清幾個關鍵問題。**

---

## 1. 目前 `cloudComputeV1Routes` 是舊版 routing

你貼的 route：

```ts
:podId/:grpId/:rackId/:drawerId/:systemId/physical-assets
```

代表：

```
Pod
 └ Group
    └ Rack
       └ Drawer
          └ System
             └ Page
```

URL 包含：

* podId
* grpId
* rackId
* drawerId
* systemId

這就是 SCC 3.x / 舊 SCC4 migration 的設計。

---

新的 Spec 是：

```
/compute/pod/physical-pool/drawer/:drawerId/appliance/:systemId/physical-assets
```

或：

```
/compute/pod/virtual-pool/appliance/:systemId/physical-assets
```

差異：

| 舊                          | 新                             |
| -------------------------- | ----------------------------- |
| URL 帶完整 hierarchy          | URL 只帶 resource id            |
| frontend 保存 parent context | backend ancestor API 查 parent |
| group_uiid 在 URL           | group 不存在                     |
| rack/drawer/system chain   | resource routing              |
| systemId 需要完整 path         | SYS id 即可                     |

---

# 2. "不用 group 了?" 是什麼意思？

你的理解：

> 以前不是有 group 現在不用 group 了?

對。

舊：

```
SYS
 ↑
drawer
 ↑
rack
 ↑
group
 ↑
pod
```

所以 frontend 必須知道：

```
group_uiid
rack_uiid
drawer_uiid
```

才能組 URL。

新：

frontend 只知道：

```
SYS-xxxx
```

例如：

```ts
this.router.navigate(['/compute/pod', system.id])
```

送：

```
/compute/pod/SYS-001
```

然後 guard：

```
SYS-001
 ↓
ancestor API
 ↓
查:
{
 rackId,
 drawerId,
 rowId,
 unassigned
}
 ↓
判斷:
physical or virtual
 ↓
redirect
```

---

# 3. ancestor API 是什麼？

是 **Backend API**。

不是 frontend 自己查 Compute List。

你的 Clover 給的：

```
/rackconfig-service/v1/device-info/systems/{id}/redirection
```

就是 ancestor API。

例如：

request:

```
GET /rackconfig-service/v1/device-info/systems/SYS-001/redirection
```

response:

```json
{
  "unassigned": true,
  "rowId": "ROW-xxx",
  "rackId": "RCK-xxx",
  "drawerId": "DRW-xxx"
}
```

Backend 告訴 frontend：

這台 system 在哪裡。

---

# 4. 那 Compute List API 的 location 怎麼辦？

你之前問：

> user 點 location，例如 test2:20-A1-1，不反查怎麼知道 SYS-001?

你的 Compute List response 已經有：

```json
{
  "location": "test2:20-A1-1",
  "id": "SYS-001",
  "drawerId": "...",
  "rack": "...",
  "drawer": "..."
}
```

所以不是反查。

流程：

```
Compute List API

{
 location:"test2:20-A1-1",
 id:"SYS-001"
}

       |
       |
click location

       |
       v

router.navigate(
 ['/compute/pod', 'SYS-001']
)

       |
       v

ancestor API
```

所以 location 只是 UI display。

真正 navigation key 是：

```
id
```

---

# 5. 你說：

> 如果按照路由架構，/compute/pod/{resourceId} 根本導不到physical-assets頁面?

這句需要修正。

`/compute/pod/{resourceId}`

本來就不是 final URL。

它是：

## Neutral Entry URL

意思：

「我只有 resource id，不知道它在哪。」

例如：

```
/compute/pod/SYS-001
```

routing:

```
/compute/pod/SYS-001

        |
        |
computeResourceResolveGuard

        |
        |
ancestor API

        |
        +---- unassigned=true

        |
        v

/compute/pod/virtual-pool/appliance/SYS-001

        |
        |
default page guard

        |
        v

/compute/pod/virtual-pool/appliance/SYS-001/physical-assets
```

所以會到 physical-assets。

只是中間經過 redirect。

---

# 6. 目前最大問題不是 API review，而是 Route migration scope

你的 Q-003 原本：

```
需要 BE 提供 redirect API
```

已經不適用了。

因為：

Clover 提供：

```
/rackconfig-service/v1/device-info/systems/{id}/redirection
```

而且新 routing 本來就是依靠 ancestor API。

所以 Q-003 應該改成：

---

## Q-003 更新版

```md
# Q-003

## Status

Resolved - Pending SCC 4.0 Compute Routing Migration Confirmation

## Summary

Frontend originally required full location hierarchy information
(pod/group/rack/drawer/system) to construct Compute navigation URL.

The existing SCC 3.x approach:

/compute/{pod}/{group}/{rack}/{drawer}/{system}/physical-assets

required frontend to obtain hierarchy information before navigation.

## New Routing Decision

According to SCC 4.0 Compute Routing Spec,
frontend navigation will use resource-based routing:

/compute/pod/{resourceId}

The routing guard will resolve the final context URL by calling ancestor API.

Example:

GET:

/rackconfig-service/v1/device-info/systems/{id}/redirection


Response provides:

- unassigned status
- rowId
- rackId
- drawerId


Frontend no longer needs to build hierarchy URL
or maintain group/rack/drawer relationship.

## Remaining Confirmation

Need alignment on:

1. SCC 4.0 Compute routing migration timeline.
2. Whether FE implementation should start after migration MR is merged.
3. Final API contract ownership between Compute and RackConfig.


Owner:
Clover / Vincent / Ty
```

---

# 7. 你現在 GitLab 要不要新增 commit？

我的建議：

**不用另外開新的 Q。**

原因：

Q-003 本來就是 API contract review。

現在只是：

* API 已確認
* routing architecture 改變
* 開發依賴 migration

所以直接 update Q-003。

不要再製造另一個 issue。

---

# 8. 你現在真正要問 Clover 的問題

不是：

> API 有沒有?

而是：

> Routing migration 什麼時候完成?

因為你的 FE 開發依賴：

```
cloudComputeV1Routes
       |
       |
改成新 routing
       |
       |
shared routing guard
       |
       |
ancestor adapter
```

所以你可以在 Teams 回：

> Based on the new Compute routing design, Q-003 no longer requires frontend to build the full hierarchy URL or request a separate redirect API.
> The remaining question is whether FE should start Compute routing implementation after the SCC4 routing migration MR is completed.

中文：

> 依照新的 Compute routing 設計，Q-003 原本需要 frontend 組完整 hierarchy URL 的需求已經不存在。現在主要需要確認 SCC4 routing migration 的時程，以及 FE Compute routing implementation 是否需要等 migration MR 完成後開始。

---

你的直覺是對的：**現在真正卡住的是 route architecture migration，不是 API 缺欄位。** Q-003 應該從「BE 提供 redirect API」改成「確認新 routing migration 時程與責任邊界」。
