@tyl @VincentLin 

# Q-008

## Status

Open - API hierarchy parameters need clarification.

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

## Open Questions

Please confirm:

1. Is `group` still a valid backend concept in SCC 4.0?
2. If `group` is still required, what is the mapping between Row and Group?
3. If the hierarchy model has changed, should the API parameters be updated to align with the new resource hierarchy?

## Impact

FE needs the final hierarchy definition to correctly implement:
- Compute System List navigation
- Tree View integration
- API query parameter mapping

## Reference

- SCC 4.0 Compute Tree View Design
- GET /compute-service/v1/systems API