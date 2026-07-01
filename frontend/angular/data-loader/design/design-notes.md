
---

# Design Notes（設計說明）

## Concept（概念）

這是一種 **「資料編排型容器元件（Data Orchestration Container Component）」**。

它的核心目標是將以下三件事拆開：

* 資料取得（data fetching）
* 狀態管理（state management）
* UI 呈現（UI rendering）

---

## Key Idea（核心概念）

傳統寫法通常是：

```text
Component = UI + API + state
```

這會導致邏輯混雜、難以重用。

因此我們將責任拆分為：

* DataLoader → 負責狀態 + 資料取得
* UI Component → 只負責畫面呈現

---

## Why Signals（為什麼使用 Signals）

選擇 Angular Signals 的原因：

* 減少訂閱（subscription）管理的複雜度
* 更適合 template 直接使用
* 降低 RxJS 心智負擔
* 提升狀態流的可讀性

---

## Alternatives Considered（替代方案比較）

### 1. Service-based approach（使用 Service）

被放棄的原因：

* 需要手動管理 subscription
* template 層整合較不直覺
* 容易導致 state 分散在不同 service

---

### 2. 只使用 RxJS pipe

被放棄的原因：

* UI state（loading / error）難以一致管理
* 邏輯分散在 pipe chain 中
* 可讀性較低，不利於重用

---

## Summary（總結）

這個設計的核心目標是：

> 將「資料取得與狀態管理」從 UI 中抽離，使元件專注於畫面呈現，提升可重用性與一致性。

---


