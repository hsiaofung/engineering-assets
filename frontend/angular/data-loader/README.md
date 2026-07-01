# 📦 DataLoader Component

A reusable **execution-only data loading container component** for Angular applications using Signals.

---

# 🎯 Problem

In many Angular applications, we repeatedly implement:

* API data fetching
* loading state management
* error handling
* async state exposure to templates
* subscription lifecycle handling

These patterns are duplicated across components and are hard to maintain consistently.

---

# 💡 Solution

`DataLoaderComponent` abstracts **data fetching lifecycle management** into a reusable container component.

It separates concerns:

* **DataLoader → execution + state management**
* **UI Components → rendering only**

It supports both:

* URL-based fetching (HttpClient GET)
* Custom fetch function (`Observable` / `Promise`)

---

# 🧱 API Contract

## Inputs

```ts
@Input() url?: string
@Input() getFn?: () => Observable<T> | Promise<T>
```

---

## Outputs (Signals)

```ts
data()       // T | null
isLoading()  // boolean
error()      // string | null
```

---

## Methods

```ts
refresh(): void
```

Manually re-triggers the data fetching lifecycle.

---

# 🧭 Responsibility Boundary

## ✔ DataLoader IS responsible for:

* Executing async data fetching
* Managing loading state
* Managing error state
* Exposing reactive signals

---

## ❌ DataLoader is NOT responsible for:

* Caching strategy
* Retry policy
* Business logic
* Data transformation
* API orchestration

---

# 🔄 Lifecycle Behavior

* Executes fetch on input change (`url` or `getFn`)
* Automatically converts `Promise → Observable`
* Updates `data / loading / error` signals accordingly
* Supports manual re-fetch via `refresh()`

---

# 📌 When to use

Use `DataLoaderComponent` when:

* A UI block requires async data
* You want consistent loading/error handling
* You want to avoid repeated subscription logic
* You want template-level reactive access to data state

---

# 🚫 When NOT to use

Do NOT use when:

* You need caching layer logic
* You need global state management (NgRx / Signal Store)
* You need complex API orchestration workflows
* You need domain/business logic inside data flow

---

# 🧪 Example Usage

## URL-based fetching

```html
<app-data-loader url="/api/users" #loader="dataLoader">

  <div *ngIf="loader.isLoading()">Loading...</div>

  <div *ngIf="loader.error() as err">
    Error: {{ err }}
  </div>

  <ul *ngIf="loader.data() as users">
    <li *ngFor="let user of users">
      {{ user.name }}
    </li>
  </ul>

</app-data-loader>
```

---

## Custom fetch function

```html
<app-data-loader [getFn]="fetchUsers" #loader="dataLoader">
```

```ts
fetchUsers = () => {
  return this.http.get<User[]>('/api/users');
};
```

---

## Manual refresh

```html
<button (click)="loader.refresh()">Reload</button>
```

---

# 🧠 Design Notes

This component follows these principles:

* **Execution-only principle** → no business logic inside
* **Inversion of control** → data source injected via `getFn`
* **State centralization** → loading/error/data unified
* **UI decoupling** → template is purely rendering logic

---

# 📦 Asset Status

```text
DataLoader v1.1
- Stable execution asset
- Manual refresh capability added
- No change in execution model or boundary
```

---

# ⚠️ Anti-patterns

Do NOT:

* Add retry logic inside DataLoader
* Add caching logic inside component
* Mutate external state inside `getFn`
* Add business rules into data execution layer

---

# 🧭 Summary

> DataLoader is an **execution-only data lifecycle manager**, not a data orchestration or business logic component.

---


