對，**完全應該是各自獨立的 instance，不會互相影響。**

例如同一時間可能存在：

```text
ComputeSystemsPage
└── ComputeResourceList #1
    ├── page = 2
    ├── pageSize = 20
    ├── sort = location
    └── filter = xxx


ComputeDrawerPage
└── ComputeResourceList #2
    ├── page = 1
    ├── pageSize = 10
    ├── sort = location
    └── filter = yyy
```

兩個 `ComputeResourceList` 是**不同 component instance**，所以它們的：

* `page`
* `pageSize`
* `sort`
* `filter`
* `reload`
* `selection`

全部都是各自獨立的。

### Angular 的原因

如果這些 state 是放在：

```ts
@Component({...})
export class ComputeResourceListComponent {
  page = signal(1)
  pageSize = signal(10)
  // ...
}
```

那麼每建立一次：

```html
<app-compute-resource-list />
```

Angular 就會建立一個新的 component instance。

因此：

```text
System Page
    ↓
new ComputeResourceListComponent()
    ↓
自己的 state


Drawer Page
    ↓
new ComputeResourceListComponent()
    ↓
另一份自己的 state
```

**不會共享。**

---

### 真正需要注意的是：不要把這些 state 放進 Service

例如不要做成：

```ts
@Injectable({ providedIn: 'root' })
export class ComputeResourceListStateService {
  page = signal(1)
  sort = ...
}
```

如果兩個 page 共用同一個 root service，那才會發生：

```text
Systems List ──┐
               ├── Shared State Service
Drawer List ───┘
```

這樣 System page 改 page，Drawer page 可能就跟著變。

---

### 所以我們的 Design 應該明確寫成

> **`ComputeResourceList` 的 List state 屬於 component instance，不透過 shared service 共享。**

```text
ComputeResourceList
├── Instance State
│   ├── page
│   ├── pageSize
│   ├── sort
│   ├── filter
│   ├── reload
│   └── selection
│
└── 每個 instance 各自擁有一份
```

這點其實很重要，應該直接加進 technical design 的 **State Management**：

> **Each `ComputeResourceList` instance maintains its own independent list state. State is not shared between System Page and Drawer Page.**

這樣我們前面定的 Contract 就完整了。
