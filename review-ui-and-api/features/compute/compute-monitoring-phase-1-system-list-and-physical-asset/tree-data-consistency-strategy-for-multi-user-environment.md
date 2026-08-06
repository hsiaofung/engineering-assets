@VincentLin 

# Q-009: Tree Data Consistency Strategy for Multi-user Environment

## Question:
In a multi-user environment, do we need to support Tree data consistency
when another user modifies resource hierarchy/status?

## Scenario:
- User A is viewing Tree
- User B updates resource
- Should User A's Tree automatically reflect the latest state?

## Impact:
- FE refresh strategy
- Backend capability (if needed)

## Need confirmation:
What consistency level is expected?
- Manual refresh is acceptable
- Eventual consistency
- Real-time update