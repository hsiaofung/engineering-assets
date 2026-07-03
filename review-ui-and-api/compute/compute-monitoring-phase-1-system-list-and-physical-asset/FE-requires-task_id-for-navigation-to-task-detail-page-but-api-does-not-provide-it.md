@tyl @VincentLin 

# Q-002

## Summary
Frontend requires a stable `task_id` for navigation to Task detail page, but current API response does not provide an explicit task identifier.

## Frontend Finding
Compute System List (Pod Level UI) requires a link to Task page.

However, API `/compute-service/v1/systems` returns:

```json
"task": {
  "name": "string",
  "executionId": 0,
  "runId": 0
}
```
## Backend Clarification

Backend confirmed that frontend should use:

executionId
runId

to retrieve task execution information via:

/task-service/v1/executions/{execution_id}/runs/{run_id}

No additional task_id field is required in Compute Service API.


## Impact   
Frontend needs to navigate through Task Service using executionId and runId.

## Status    
Resolved

## Reference
- API: GET /compute-service/v1/systems   
![image](/uploads/6558176b76a845b794ac4f4271f8dd1d/image.png){width=900 height=114}     

- UI:    
![image](/uploads/1e03a5033200b1551f8b79347192cc6f/image.png){width=572 height=265}