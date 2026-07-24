@tyl @VincentLin 

# Q-002

## Status    
Resolved

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


## Reference
- API: GET /compute-service/v1/systems   
![image](/uploads/6558176b76a845b794ac4f4271f8dd1d/image.png){width=900 height=114}     

- UI:    
![image](/uploads/1e03a5033200b1551f8b79347192cc6f/image.png){width=572 height=265}

---

You can use the `/task-service/v1/executions/{execution_id}` endpoint to retrieve the task ID:

![螢幕擷取畫面_2026-06-25_133007](/uploads/1b4d777d3e8d5abb40167067471780c9/螢幕擷取畫面_2026-06-25_133007.png){width=900 height=547}

---

> Could you confirm which field should be used as the unique identifier for Task navigation?
> * executionId ?
> * runId ?
> * or should a new task_id be introduced in API?

You can use both the execution ID and run ID to retrieve the running task (execution run) information via the API endpoint `/task-service/v1/executions/{execution_id}/runs/{run_id}`.

---

Got it, thanks for the clarification.

Frontend will use executionId and runId to retrieve task execution information via:

/task-service/v1/executions/{execution_id}/runs/{run_id}

