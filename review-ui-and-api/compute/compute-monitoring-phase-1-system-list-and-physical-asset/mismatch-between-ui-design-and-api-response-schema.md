

@tyl @VincentLin 

# Q-001

## Summary
Mismatch between UI design and API response schema

## Frontend review finding

Compute System list Pod Level UI requires:

- motherboard type
- serial number
- update time
- domain name 
- node name

Could you confirm the source of these fields?

## Impact:
UI cannot be fully implemented as per design until data contract is clarified.

## Status: Open Question - pending backend confirmation

## Reference:   
- API: /compute-service/v1/systems
- UI:   
![image](/uploads/f32e942374c33a032f2afe43f30665d5/image.png){width=900 height=284}