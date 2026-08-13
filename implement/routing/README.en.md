**File Architecture**

| File                                | Responsibility                               |
| ----------------------------------- | -------------------------------------------- |
| `compute-resource-resolve.guard.ts` | `/resource/:resourceId` → resolve + redirect |
| `compute-ancestor.service.ts`       | Calls the Ancestor API                       |
| `compute-route.builder.ts`          | Context → canonical URL                      |
| `compute-resource-context.model.ts` | Defines the context after resolution         |

**Flow**

```text
                    /compute/resource/SYS-001
                              │
                              ▼
                 computeResourceResolveGuard
                              │
                              ▼
              GET .../systems/SYS-001/redirection
                              │
                              ▼
                    ComputeResourceContext
                              │
                              ▼
                    ComputeRouteBuilder
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
          unassigned=true          unassigned=false
                 │                         │
                 ▼                         ▼
       /virtual-pool/...          /physical-pool/...
```

---

**Usage**

If you have already decided to adopt the **Resource-based Entry Point**:

```text
/compute/resource/:resourceId
        ↓
Guard
        ↓
Ancestor API
        ↓
Canonical URL
```

Then the click behavior of the `ipAddress` field should be very simple.

**The Component should not call the Ancestor API itself, nor should it decide between physical / virtual.**

### Component

Assuming the table row contains a `systemId`:

```ts
onIpAddressClick(systemId: string): void {
  this.router.navigate(['/compute/resource', systemId]);
}
```

Required:

```ts
import { Router } from '@angular/router';

private readonly router = inject(Router);
```

Template:

```html
<a (click)="onIpAddressClick(row.systemId)" (keydown.enter)="onIpAddressClick(row.systemId)" tabindex="0">
  {{ row.ipAddress }}
</a>
```

If you are using NG-ZORRO, you can also adapt this to the `<a>` element according to your current table implementation.

---

### Overall Flow

For example, when the user clicks:

```text
192.168.1.100
```

The frontend only knows:

```text
systemId = SYS-001
```

So:

```text
IP Address click
      ↓
router.navigate()
      ↓
/compute/resource/SYS-001
      ↓
computeResourceResolveGuard
      ↓
GET /rackconfig-service/v1/device-info/systems/SYS-001/redirection
      ↓
unassigned = false
      ↓
ComputeRouteBuilder
      ↓
/compute/Pod/physical-pool/appliance/SYS-001
```

This way, the responsibility of the **IP Address click is very clean**:

> **It is only responsible for sending the Resource ID into the Resource Entry Point.**

---

### I Would Especially Avoid This Approach

Do not:

```ts
async onIpAddressClick(systemId: string) {
  const context = await this.api.getAncestor(systemId);

  if (context.unassigned) {
    this.router.navigate([
      '/compute/Pod/virtual-pool/appliance',
      systemId,
    ]);
  } else {
    this.router.navigate([
      '/compute/Pod/physical-pool/appliance',
      systemId,
    ]);
  }
}
```

Because this would cause your **Resource List Component to start knowing the routing resolution rules again**.

It would eventually become:

```text
List Component
 ├── Ancestor API
 ├── physical / virtual decision
 └── URL construction
```

And the current design is precisely intended to avoid this.

Therefore, the technical behavior of this field can be summarized in one sentence:

> **Clicking the IP address navigates to `/compute/resource/{systemId}`, where the resource resolve guard resolves the resource context and redirects to the canonical Compute route.**

I think this description is very suitable to be placed directly into your **Compute Resource List technical design**.
