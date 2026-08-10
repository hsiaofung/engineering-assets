# Q-011

## Status

Pending - Backend will add ipAddress field.

## Summary

Frontend needs ipAddress for UI display, but current response only provides systemId.

## Resolution
 
- BE confirmed that ipAddress will be added to the response for the following operations:
  - Delete
  - Unassing
  - Assign 
- BE cannot provide ipAddress in the single-delete response.
- BE will provide ipAddress in the bulk-delete response.
- Therefore, FE will use bulk-delete API for both single and bulk delete operations.
- FE will use the ipAddress from the API response for UI display.

## Next Step

FE will verify after API contract update.