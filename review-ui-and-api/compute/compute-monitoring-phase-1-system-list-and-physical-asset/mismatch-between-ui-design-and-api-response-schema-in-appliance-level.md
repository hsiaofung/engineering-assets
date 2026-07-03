

@tyl @VincentLin 

# Q-005

## Summary
Mismatch between UI design and API response schema in appliance level.

## Frontend review finding

Compute System list Drawer Level UI requires:

- FQDN
- Task

Could you confirm the source of these fields?

## Impact:
UI cannot be fully implemented as per design until data contract is clarified.

## Status: 
Open Question - pending backend confirmation

## Reference:   
- API: /compute-service/v1/systems/{id}
- UI: Appliance Level / Physical Asset