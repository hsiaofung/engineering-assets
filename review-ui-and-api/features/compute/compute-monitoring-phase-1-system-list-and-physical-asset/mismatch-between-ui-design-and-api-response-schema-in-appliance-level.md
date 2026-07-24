

@tyl @VincentLin 

# Q-005

## Status

Review completed. Pending backend implementation.

## Summary
Mismatch between UI design and API response schema in appliance level.

## Frontend review finding

Compute System list Drawer Level UI requires:

- FQDN
- Task

## Review result

Confirmed with BE:

* FQDN: BE will implement
* Task: BE will implement

## Impact:
No UI change is required.
Backend API update is required to support the current UI design.

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

---

Hi @TimChou 

The FQDN field is exclusively applicable to Appliance-Level Physical Assets; it does not exist for Drawer-Level Physical Assets.

Below is the context regarding the FQDN field:

Based on our previous conclusion (https://gitlab.supermicro.com/scc/Web-Management-Platform/-/work_items/22518#note_2263802) and the 3.x issue (https://gitlab.supermicro.com/scc/Web-Management-Platform/-/work_items/21965), both PM and the backend team have confirmed multiple times that the FQDN here, as well as the Node Name and Domain Name fields in the System List, can be provided.

Therefore, if these are currently missing from the API, we will need the backend team to add them in a subsequent update.

![image](/uploads/5eb44e5c09a4c53318ea36ee7d52ae31/image.png){width=690 height=600}

@ethanc had already confirmed this in the discussion below.

![image](/uploads/33390f235d3ec76a49b9ec16039b4ac9/image.png){width=339 height=600}

---