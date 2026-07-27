# 處理：如何找到resource? (URL怎麼產生?)
  - Pod level
  - Group level
  - Rack level
  - Drawer level
  - Appliance level

---

# 目標是：

把 Compute 從 hierarchy-based routing 改成 resource-based routing。

---

# Decisions:
- Decision 1: 從 Hierarchy-based Routing 改成 Resource-based Routing
- Decision 2: Ancestor API Responsibility 放在 Routing Resolver，不放在 Component
- Decision 3: 使用 Canonical URL
- Decision 4: URL 不包含 Ancestor Information
- Decision 5: Neutral Entry Point
- Decision 6: Routing Resolver 負責 Scope 判斷
- Decision 7: Route Migration Strategy

## Compute Routing Design Decisions

1. Resource-based routing replaces hierarchy-based routing

2. Ancestor resolution moves from component layer to routing layer

3. URL stores resource identity, not physical hierarchy

4. Resolver generates canonical URL

5. All navigation entry points use neutral resource URL

6. Scope determination is handled by resolver using ancestor API


---

  例如：
  - 舊：
    /compute/{pod}/{group}/{rack}/{drawer}/{system}/physical-assets

  - 新：
    /compute/pod/{resourceId}

  - 流程:
    Location Click             
      |      
      v       
    Resource ID      
      |             
      v                           
    computeResourceResolveGuard                          
      |                            
      v                           
    Ancestor API                      
      |                        
      v                                        
    Canonical Route   