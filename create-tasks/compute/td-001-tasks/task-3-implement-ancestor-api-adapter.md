# Title

Implement Compute ancestor API integration

# Purpose

提供 routing resolver 使用的 API abstraction。

不要讓 guard 直接 call HTTP。

架構：

```json
Guard

 |

ComputeAncestorService

 |

HTTP API
```

# Scope

建立：
```ts
ComputeAncestorService
```
例如：
```ts
getResourceContext(id: string)
```
Response mapping:
```ts
{
 unassigned: boolean;
 rowId?: string;
 rackId?: string;
 drawerId?: string;
}
```
# Acceptance Criteria
 - API mapping completed
 - Error handling implemented
 - API contract isolated from routing logic