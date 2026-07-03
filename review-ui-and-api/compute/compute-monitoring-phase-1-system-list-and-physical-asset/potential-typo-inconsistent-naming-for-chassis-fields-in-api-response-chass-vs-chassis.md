@tyl @VincentLin 

# Q-007

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

## Status
Open - requires backend confirmation

## Suggestion
Please confirm whether `chass*` is intentional abbreviation.

If not intentional, recommend renaming to `chassis*` for consistency across API contract.

## Reference:   
- UI: FRU page
- API: /compute-service/v1/systems/{id}/Frus