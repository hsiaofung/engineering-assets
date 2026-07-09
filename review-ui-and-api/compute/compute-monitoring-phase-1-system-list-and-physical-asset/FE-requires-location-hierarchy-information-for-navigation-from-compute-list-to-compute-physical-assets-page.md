@tyl @VincentLin @CloverH 

# Q-003

## Status

Blocked - Pending architecture decision (Clover ↔ Vincent)

## Summary

Frontend requires location hierarchy information for navigation from Compute List to Compute Physical Assets page.

## Frontend Finding

According to the existing design, when a user clicks the Location link in Compute List, the UI should navigate to:

```text
/compute/${pod_name}/${group_uiid}/${rack_uiid}/${drawer_uiid}/${system_uiid}/physical-assets
```

The following fields are required:

* pod_name
* group_uiid
* rack_uiid
* drawer_uiid
* system_uiid

In SCC 3.X, frontend retrieves these values via:

```http
GET /web/cloud-monitoring-detail/overview/system/redirection?uuid={uuid}
```

Response:

```json
{
  "system_uiid": "...",
  "drawer_uiid": "...",
  "rack_uiid": "...",
  "group_uiid": "...",
  "pod_name": "..."
}
```

## Current Status

Discussed in FE Weekly Sync.

- Frontend routing is also under discussion.
- Owner: @CloverH 
- Action: Align frontend navigation approach with @VincentLin

## Impact

Frontend cannot implement location navigation from Compute List to Physical Assets page until the location hierarchy source is defined.

## Reference

* Existing SCC 3.X redirection API
* Compute List → Location link navigation

## Follow up
Clover，想確認一下 Q-003 目前跟 Vincent 討論後，location hierarchy 的取得方式是否已有初步方向？
https://gitlab.supermicro.com/scc/Web-Management-Platform/-/work_items/22518#note_2375411

Q-003 目前已跟 Clover 確認，location hierarchy 取得方式尚未定案。因 BE 目前優先處理 In-Rack CDU 250KW for 3.13，預計後續再確認方案。FE 這邊先持續追蹤，Compute Physical Assets 導頁會依賴此資訊。