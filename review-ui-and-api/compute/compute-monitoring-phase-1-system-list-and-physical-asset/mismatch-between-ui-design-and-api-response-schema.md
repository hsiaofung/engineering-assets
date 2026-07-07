

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

## Review result

Confirmed with BE:

- motherboard type: pending confirmation (@RayYang)
- serial number: pending confirmation (@RayYang)
- update time: BE will provide (@tyl)
- domain name: BE will not provide, pending confirmation (@RayYang)
- node name: BE will not provide, pending confirmation (@RayYang)

## Impact:
UI cannot be fully implemented as per design until data contract is clarified.

## Next step

Need confirmation from requirement/UI side on how to handle missing fields:

remove fields from UI
use alternative data source
adjust UI design

## Reference:   
- API: /compute-service/v1/systems
- UI:   
![image](/uploads/f32e942374c33a032f2afe43f30665d5/image.png){width=900 height=284}

---

@RayYang

BE confirmed that:

* motherboard type: need to clarify whether the expected data is FRU or DIM
* serial number: need to clarify whether the expected data is FRU or DIM
* domain name: not provided by API
* node name: not provided by API

Could you please help confirm the expected UI behavior and data source for these fields?

* Confirm whether motherboard type and serial number should use FRU or DIM data
* Remove fields from UI if the data is not required
* Use another data source if available
* Adjust UI design if needed

Thanks.
