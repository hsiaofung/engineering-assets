# Title

Implement computeResourceResolveGuard

# Purpose

建立 resource-based routing 的核心 resolver。

# Flow:
```json

/compute/pod/SYS-001

        |
        v

computeResourceResolveGuard

        |
        v

Ancestor API

        |
        v

Canonical Route
```
# Scope
- Parse resource ID
- Determine resource kind
- Resolve context
- Redirect to canonical URL

# Acceptance Criteria

Example:

Input:
```json
/compute/pod/SYS-001
```
Output:
```json
/compute/pod/physical-pool/appliance/SYS-001
```
or
```json
/compute/pod/virtual-pool/appliance/SYS-001
```