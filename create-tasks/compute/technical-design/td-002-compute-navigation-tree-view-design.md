# 處理: Tree 如何mapping route (Tree 點擊後怎麼進入URL?)

- Pod
- Group
- Rack
- Drawer
- System
- Physical Pool
- Virtual Pool

---

# Decisions
- Decision 1: Tree Node 使用 Resource Identity，不使用 UI Hierarchy Identity
- Decision 2: Tree 負責展示，不負責 Routing Resolution
- Decision 3: Tree Node Kind 與 Route Kind 分離
- Decision 4: Physical Pool 與 Virtual Pool 分開呈現
- Decision 5: Tree Node Click 使用 Neutral Navigation
- Decision 6: Tree 不維護 Route State
- Decision 7: Tree API 與 Navigation API 分離

## Compute Tree Navigation Decisions

1. Tree nodes represent resources, not hierarchy URLs.

2. Tree only provides resourceId to router.
   It does not resolve ancestor relationship.

3. Routing resolution is centralized in Compute routing resolver.

4. Tree node model is separated from route segment naming.

5. Physical Pool and Virtual Pool are different navigation contexts.

6. Router is the source of truth for current navigation state.

7. Tree data loading and routing resolution use separate responsibilities.


## 例如:
Compute Tree

Pod                                                            
 |                                        
 +-- Physical Pool                                      
 |      |                                            
 |      +-- Row                                                    
 |      |                    
 |      +-- Rack                                         
 |             |                             
 |             +-- Drawer                                          
 |                    |                
 |                    +-- System                                   
 |
 +-- Virtual Pool                     
        |                        
        +-- System                                              

定義：          
- node type         
- node id        
- click behavior         
- route mapping               


# Decision 2: Tree 負責展示，不負責 Routing Resolution

Tree click 只提供 resourceId：
```ts
onNodeClick(node) {
  router.navigate([
    '/compute/pod',
    node.id
  ]);
}
```
流程:
```ts
Tree View
    |
    |
resourceId
    |
    v
Routing Resolver
    |
    |
Ancestor API
    |
    |
Canonical Route
```

# Decision 4: Physical Pool 與 Virtual Pool 分開呈現
Context

System 有兩種狀態：

Physical:
```json
{
 "unassigned": false
}
```
Virtual:
```json
{
 "unassigned": true
}
```

### Decision
- Tree structure:   

```json
Compute
|
+-- Physical Pool
|      |
|      +-- Row
|             |
|             +-- Rack
|                    |
|                    +-- Drawer
|                           |
|                           +-- System
|
+-- Virtual Pool
       |
       +-- System
```       
理由：

使用者理解：

已配置設備在哪裡
未配置設備在哪裡