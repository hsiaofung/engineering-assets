@tyl @VincentLin 

# Q-007

## Status
Pending backend commit / API update 

## Summary
Potential typo / inconsistent naming for chassis fields in API response (chass* vs chassis*)

## Frontend review finding
Current API uses prefix `chass*`:

- chassType
- chassPartNumber
- chassSerialNumber

Expected convention (based on domain naming):

- chassisType
- chassisPartNumber
- chassisSerialNumber

## Impact
- Potential confusion for frontend developers
- Increased risk of incorrect field usage / mapping errors
- Inconsistent API naming convention within system

## Review result
BE confirmed that the field names will be updated to chassis*.

## Reference:   
- UI: FRU page
- API: /compute-service/v1/systems/{id}/Frus