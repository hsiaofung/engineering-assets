你這個問題問得非常重要，因為目前 Spec 最大的問題之一就是：

**寫了 `computeResourceResolveGuard`，但是沒有清楚定義它的責任邊界。**

如果沒有定義，FE implement 時很容易變成：

* Guard 做太多事
* Component 做 routing 判斷
* API 呼叫散落
* 舊 route migration 又混在一起

---

## 先講簡單版

`computeResourceResolveGuard` 是一個 **Route Resolver Guard**。

它的目的：

> 當使用者只有提供 resourceId（例如 SYS-001），不知道它目前在哪個位置時，由 Guard 負責解析正確的 Compute context，並 redirect 到 canonical URL。

也就是：

輸入：

```
/compute/pod/SYS-001
```

Guard 負責變成：

```
/compute/pod/physical-pool/appliance/SYS-001
```

或：

```
/compute/pod/virtual-pool/appliance/SYS-001
```

---

## 它解決什麼問題？

舊架構：

```
/compute/{pod}/{group}/{rack}/{drawer}/{system}/physical-assets
```

Frontend 必須知道：

```
pod
group
rack
drawer
system
```

所以 Compute List API 必須提供 hierarchy。

---

新架構：

Frontend 只知道：

```
SYS-001
```

例如：

```ts
this.router.navigate(['/compute/pod', system.id])
```

這時 Angular route 收到：

```
resourceId = SYS-001
```

但是不知道：

* 是 virtual pool？
* physical pool？
* drawer 在哪？
* rack 在哪？

所以交給：

```
computeResourceResolveGuard
```

---

## 它的流程應該定義成：

```
User click Location
        |
        v
router.navigate(['/compute/pod', 'SYS-001'])
        |
        v
computeResourceResolveGuard
        |
        |
        +-- resolve resource kind
        |
        +-- call ancestor API
        |
        +-- check scope
              |
              +-- unassigned=true
              |       |
              |       v
              |  virtual-pool
              |
              +-- unassigned=false
                      |
                      v
                 physical-pool
        |
        v
redirect canonical URL
```

---

## 所以它需要做的事情

### 1. Parse resource kind

例如：

```
SYS-001
```

判斷：

```ts
kind = system
```

因為：

```
SYS- => system
RCK- => rack
DRW- => drawer
```

---

### 2. 呼叫 ancestor API

例如：

```http
GET /rackconfig-service/v1/device-info/systems/SYS-001/redirection
```

取得：

```json
{
 "unassigned": false,
 "rowId": "ROW-001",
 "rackId": "RCK-001",
 "drawerId": "DRW-001"
}
```

---

### 3. 決定 URL

如果：

```json
unassigned:false
```

代表 physical：

產生：

```
/compute/pod/physical-pool/appliance/SYS-001
```

如果：

```json
unassigned:true
```

代表 virtual：

產生：

```
/compute/pod/virtual-pool/appliance/SYS-001
```

---

### 4. 保留原本 leaf suffix

例如：

Dashboard 點 GPU：

```
/compute/pod/SYS-001/overview/adapter/gpu
```

Guard redirect：

```
/compute/pod/physical-pool/appliance/SYS-001/overview/adapter/gpu
```

---

# 它不應該做什麼？

這很重要。

## ❌ 不負責 Page privilege

不是它：

```
有沒有權限看 physical-assets
```

這是：

```
computePagePrivilegeGuard
```

---

## ❌ 不負責 UI render

不是它：

```
load System component
```

Component router 做。

---

## ❌ 不負責 tree navigation

不是它：

```
展開 Pod tree
```

Tree sync 是 Phase 2。

---

## ❌ 不應該知道 API response 細節

所以 Spec 裡寫：

> Compute-specific contract differences are absorbed by adapter

意思是：

Guard 不直接依賴：

```ts
rowId
rackId
drawerId
```

而是：

```
computeResourceResolveGuard
          |
          v
ComputeAncestorAdapter
          |
          v
/rackconfig-service API
```

---

# 我覺得 Spec 應該補一段

你可以在 GitLab 提 comment：

```md
## Question: computeResourceResolveGuard responsibility

The current spec defines computeResourceResolveGuard,
but the responsibility boundary is not clear.

Please clarify:

1. Does computeResourceResolveGuard only:
   - resolve resourceId scope (virtual/physical)
   - call ancestor API
   - redirect to canonical URL

2. Should API contract mapping be handled by a Compute-specific adapter?

3. Should leaf suffix be preserved during redirect?

Example:

Input:

/compute/pod/SYS-001/overview/adapter/gpu

Expected:

/compute/pod/physical-pool/appliance/SYS-001/overview/adapter/gpu
```

---

我認為你現在抓到的是 **真正 implementation 前需要釐清的 architecture issue**。

因為目前 Spec 已經描述「要有 guard」，但沒有描述「guard 是 routing orchestration 還是 business logic」。這會直接影響 `cloudComputeV1Routes` 怎麼重構。

---

# 實作

可以。先說明：下面是**依照 Clover 提出的 SCC 4.0 Spec 的概念範例**，不是完整 production code。重點是看 `computeResourceResolveGuard` 的責任。

它應該是一個 **route guard + resolver + redirect orchestrator**，不是 component。

---

## 1. Route 定義

新的 route 大概會變成：

```ts
{
  path: ':resourceId',
  canActivate: [computeResourceResolveGuard],
}
```

例如：

使用者進入：

```
/compute/pod/SYS-001
```

Angular match：

```ts
resourceId = SYS-001
```

然後執行 guard。

---

## 2. Guard 範例

Angular functional guard：

```ts
export const computeResourceResolveGuard: CanActivateFn = (
  route,
  state
) => {

  const router = inject(Router);
  const ancestorApi = inject(ComputeAncestorApi);

  const resourceId = route.paramMap.get('resourceId');

  if (!resourceId) {
    return router.createUrlTree(['/compute/pod']);
  }


  return ancestorApi.resolve(resourceId).pipe(

    map(resource => {

      const targetUrl = buildContextUrl(resource, state.url);

      return router.parseUrl(targetUrl);

    }),

    catchError(error => {

      console.error(
        'Compute resource resolve failed',
        error
      );

      return of(
        router.parseUrl('/compute/pod')
      );

    })
  );
};
```

---

## 3. Ancestor API Adapter

Guard 不直接 call HTTP。

中間放 adapter。

例如：

```ts
@Injectable({
 providedIn: 'root'
})
export class ComputeAncestorApi {


  private http = inject(HttpClient);


  resolve(id:string): Observable<ComputeResourceContext> {

    if(id.startsWith('SYS-')) {

      return this.http
        .get<SystemRedirectResponse>(
          `/rackconfig-service/v1/device-info/systems/${id}/redirection`
        )
        .pipe(
          map(response => ({
            id,
            kind:'system',
            scope: response.unassigned
              ? 'virtual'
              : 'physical',
            ancestor: response
          }))
        );
    }


    throw new Error(
      `Unsupported resource ${id}`
    );
  }
}
```

---

## 4. Context URL Builder

這部分就是 Spec 裡：

> context entry URL builder strategy

例如：

```ts
function buildContextUrl(
  context: ComputeResourceContext,
  currentUrl:string
) {


  const suffix =
    extractLeafSuffix(currentUrl);


  if(context.scope === 'virtual') {

    return [
      '/compute',
      'pod',
      'virtual-pool',
      'appliance',
      context.id,
      suffix
    ]
    .filter(Boolean)
    .join('/');

  }


  return [
    '/compute',
    'pod',
    'physical-pool',
    'appliance',
    context.id,
    suffix
  ]
  .filter(Boolean)
  .join('/');

}
```

---

## 5. 實際流程

### Case 1：Physical System

使用者：

```
/compute/pod/SYS-001
```

Guard:

呼叫：

```
GET /systems/SYS-001/redirection
```

Response:

```json
{
 "unassigned": false,
 "drawerId":"DRW-001"
}
```

產生：

```
/compute/pod/physical-pool/appliance/SYS-001
```

接著 default page guard：

```
/physical-assets
```

最後：

```
/compute/pod/physical-pool/appliance/SYS-001/physical-assets
```

---

### Case 2：Virtual System

輸入：

```
/compute/pod/SYS-002
```

API:

```json
{
 "unassigned": true
}
```

redirect:

```
/compute/pod/virtual-pool/appliance/SYS-002
```

最後：

```
/compute/pod/virtual-pool/appliance/SYS-002/physical-assets
```

---

### Case 3：Dashboard 指定頁面

輸入：

```
/compute/pod/SYS-001/overview/adapter/gpu
```

Guard 保留 suffix：

redirect:

```
/compute/pod/physical-pool/appliance/SYS-001/overview/adapter/gpu
```

---

# 但你現在的 `cloudComputeV1Routes` 有一個大問題

舊 route：

```ts
{
 path: ':podId/:grpId/:rackId/:drawerId/:systemId'
}
```

它根本沒有：

```ts
path: ':resourceId'
```

所以新的 guard 沒地方掛。

Migration 應該變成類似：

```ts
{
 path:'',
 component: CloudComputeComponent,
 children:[

   {
     path:'pod/:resourceId',
     canActivate:[
       computeResourceResolveGuard
     ]
   },


   {
     path:'pod/physical-pool',
     children:[
       ...
     ]
   }

 ]
}
```

---

所以你前面問：

> 我是不是要改 cloudComputeV1Routes?

答案是：**對。**

因為現在不是補 API，而是 routing model 已經換了。

你現在看到的 `computeResourceResolveGuard` 其實就是新 routing 架構的核心。沒有它，`/compute/pod/SYS-001` 這個 neutral URL 根本沒有辦法工作。

