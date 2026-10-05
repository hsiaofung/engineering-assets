# 設計 DMI 頁面

1. 元件：使用 `detail-card.component`,`detail-item.component`, `data-loader`
2. API path：`/compute-service/v1/systems/{id}/dmi`
3. API response：

   ```json
   {
      "systemManufacturer": "string",
      "systemProductName": "string",
      "systemSerialNumber": "string",
      "systemVersion": "string",
      "systemFamily": "string",
      "baseBoard": [
        {
          "manufacturer": "string",
          "productName": "string",
          "serialNumber": "string",
          "version": "string",
          "assetTag": "string"
        }
      ],
      "chassisManufacturer": "string",
      "chassisSerialNumber": "string",
      "chassisVersion": "string",
      "chassisTagNumber": "string",
      "oemString1": "string",
      "oemString2": "string",
      "actions": {
        "additionalProp1": {}
      }
   }
   ```

4. Layout：用 grid 分四個 card，由左至右 title 為 System(上)OEM(下)(同一欄)、Base Board、Chassis
   - Base board 支援multiple。
5. Chasis card 右上方有 edit 按鈕，reload 按鈕；點擊edit後所有card資訊欄位變成 input。
6. Edit save：
   1. Save 時顯示 confirm-dialog(用元件: scc-confirm-modal with reminder )。      
      - reminder:
        - The System will automatically reboot after changes have been made to DMI. 
        - It will take a while, please refresh page after changes become effective.

   2. 點擊confirm 按鈕， 發API。

   3. API path: POST `/compute-service/v1/systems/{id}/actions/dmi-update`

   4. API request body:
      ```json
         {
            "systemManufacturer": "string",
            "systemProductName": "string",   
            "systemSerialNumber": "string",  
            "systemVersion": "string",
            "systemFamily": "string",
            "baseBoard": [
              {
                "manufacturer": "string",
                "productName": "string",
                "serialNumber": "string",
                "version": "string",
                "assetTag": "string"
              }
            ],
            "chassisManufacturer": "string",
            "chassisSerialNumber": "string",
            "chassisVersion": "string",
            "chassisTagNumber": "string",
            "oemString1": "string",
            "oemString2": "string"
         }
      ```  

   5. HTTP 200 且成功：打 api 詢問 Task svc 確認創建成功與否, Task service 會提供 ”Task ID” + ”Execution ID” 資訊.

   6. 顯示notification(元件: scc-notification-story-host)， 點擊notification 中的icon 重導向到 ”Task/Execution History/Execution Detail” 頁面. 通過 ”Task ID” + ”Execution ID” 組合出對應 routing.   
   

   5. dmi update API response 範例：

      成功：

      ```json
      {
        "status": "Success",
        "result": {
          "systemId": "SYS-b5b68c4e-b34e-4b0e-beef-68221d0719c8",
          "message": "FRU information updated successfully."
        }
      }
      ```

      驗證失敗：

      ```json
      {
        "error": {
          "code": "BadRequest",
          "message": "Validation detail in here"
        }
      }
      ```
   
 7. Reload 按鈕
   1. 點擊Reload顯示confirm dialog (用元件: scc-confirm-modal with reminder )。      
      - reminder:
        - It will take a while, please refresh page after changes become effective.

   2. 點擊condirm dialog 的confirm 按鈕， 發API。
   3. API path:    /compute-service/v1/systems/{id}/actions/dmi-reload
   4. HTTP 200 且成功：打 api 詢問 Task svc 確認創建成功與否, Task service 會提供 ”Task ID” + ”Execution ID” 資訊.
   5. 顯示notification(元件: scc-notification-story-host)， 點擊notification 中的icon 重導向到 ”Task/Execution History/Execution Detail” 頁面. 通過 ”Task ID” + ”Execution ID” 組合出對應 routing.   
   
