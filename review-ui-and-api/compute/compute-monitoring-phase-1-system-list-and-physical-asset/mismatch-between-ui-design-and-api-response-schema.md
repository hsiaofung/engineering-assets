

@tyl @VincentLin 

# Q-001

## Status

Review completed. Pending backend implementation.

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

Confirmed with UX and BE:

- motherboard type → use `boardModel`
- serial number → currently available in `/systems/{id}`; BE will add it to the `/systems` list API
- update time → BE will provide
- domain name → BE will implement
- node name → BE will implement

## Impact:
No UI change is required.
Backend API update is required to support the current UI design.

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

---

@Ethan         

1. Mother board type : 使用boardModel欄位
2. Serial Number在Systems/{id}中有  不過我們可以把它做進Systems list裡面
3. 後端另外實作
4. 後端另外實作

---

@RayYang    

Thanks Ethan for checking and confirming. Below is the record for reference.

![image](/uploads/513ff24dab12097e96fabf6b1f8e980e/image.png){width=339 height=600}

---
