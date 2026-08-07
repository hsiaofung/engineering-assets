@ethanc @tyl @VincentLin 

# Q-008

## Status

Open - Solution confirmed, pending verification

## Summary

Frontend found a mismatch between the SCC 4.0 Compute Tree View hierarchy
and the current Compute System List API query parameters.

## Frontend Finding

According to the SCC 4.0 Tree View design, the resource hierarchy is:

Pod
- Virtual Pool
- Physical Pool
  - Row
    - Rack
      - Drawer
        - System

However, the current API:

GET /compute-service/v1/systems

still uses hierarchy parameters:

- group
- rack
- drawer

The `group` concept does not appear in the SCC 4.0 Compute Tree View.

## Resolution

Confirmed mapping:

- Virtual Pool:
  - Use `unassigned=true`  

- Physical Pool:
  - Use `unassigned=false`
  - Physical Pool represents systems with location.

- Row:
  - Compute-service will provide `row` field for filtering.

- Rack / Drawer:
  - Continue using existing fields.


## Impact

FE needs the final hierarchy definition to correctly implement:
- Compute System List navigation
- Tree View integration
- API query parameter mapping

## Reference

- SCC 4.0 Compute Tree View Design
- GET /compute-service/v1/systems API