# 處理：如何找到resource? (URL怎麼產生?)
  ## Router 如何找到正確頁面。
    - Pod level
    - Group level
    - Rack level
    - Drawer level
    - Appliance level

---

# 目標是：

- 把 Compute 從 hierarchy-based routing 改成 resource-based routing。

---

# Decisions:
- Decision 1: 從 Hierarchy-based Routing 改成 Resource-based Routing
- Decision 2: Ancestor API Responsibility 放在 Routing Resolver，不放在 Component
- Decision 3: 使用 Canonical URL
- Decision 4: URL 不包含 Ancestor Information
- Decision 5: Neutral Entry Point
- Decision 6: Routing Resolver 負責 Scope 判斷
- Decision 7: Route Migration Strategy

## Compute Routing Design Decisions (整體架構怎麼設計?)

- 採用 Resource-based Routing
- 使用 computeResourceResolveGuard
- Component 不直接呼叫 Ancestor API
- API 透過 ComputeAncestorService 抽象
- Canonical URL 統一由 Route Builder 產生

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