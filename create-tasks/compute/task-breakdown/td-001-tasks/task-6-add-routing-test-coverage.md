# Title

Add Compute resource routing tests

# Test cases
## System
```json
- SYS-001
- unassigned=false

→ physical route
```
## Virtual System
```json
SYS-002
unassigned=true

→ virtual route
```
## Invalid resource
```json
XXX-001

→ fallback
```
## API Failure
```json
404 / timeout

→ compute top
```