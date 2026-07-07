

@tyl @VincentLin 

# Q-005

## Summary
Mismatch between UI design and API response schema in appliance level.

## Frontend review finding

Compute System list Drawer Level UI requires:

- FQDN
- Task

## Review result

Confirmed with BE:

* FQDN: BE will not provide, pending confirmation (@RayYang)
* Task: BE will provide (@tyl )

## Impact:
UI cannot be fully implemented as per design until data contract is clarified.

## Next step: 
Need confirmation from requirement/UI side on how to handle missing fields.

## Reference:   
- API: /compute-service/v1/systems/{id}
- UI: Appliance Level / Physical Asset

---

@RayYang

BE confirmed that:

* FQDN: not provided by API

Could you please help confirm how FQDN should be handled in UI?

* Remove fields from UI if the data is not required
* Use another data source if available
* Adjust UI design if needed

Thanks.