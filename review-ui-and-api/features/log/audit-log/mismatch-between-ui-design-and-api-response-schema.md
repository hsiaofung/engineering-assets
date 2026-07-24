@weichen_sun   

Summary: Mismatch between UI design and API response schema
 
Frontend Review Finding:

User list UI requires:

* avatar
* username
* role

Current API response only provides:

* username

Clarification needed:
1. Is "role" part of user model or available via another endpoint?
2. What is the source of avatar (URL field, separate service, or derived from profile)?

Impact:
UI cannot be fully implemented as per design until data contract is clarified.

Status:
Open Question - pending backend confirmation

Reference:      
API: /log-service/v1/audit_log   
![image](/uploads/3265ccfcde7644a125234d47478eda27/image.png){width=716 height=351}       

UI:    
![image](/uploads/c989625c34aa8eaea8ddf46a09e2a8d6/image.png){width=900 height=480}

---

Hello @TimChou,

I have discussed with @CloverH 

Currently we do not have `avatar` and `role`

And avatar is stored in auth-service if I remered correctly.

---

@weichen_sun

Thanks for the clarification.

So we’ll need to get avatar from auth-service and join it with audit_log on frontend.

Just to confirm — is this the expected approach, or will backend provide a combined API later?

Thanks!

---

@TimChou  :

Due to it has performance issue to display Avatar in the 4.0 (we need to trigger API to get Avatar one by one). So PM remove the design

---

@RebeccaHsieh 

PM has decided to remove Avatar and Role from the Audit Log UI due to performance concerns.

The current Figma still shows Avatar and Role. Could you help update the design to reflect this decision?

Thanks.

Reference:    
![image](/uploads/66b5bcacb4e8ae6eb7fe23ce3f28ef10/image.png){width=900 height=451}

---