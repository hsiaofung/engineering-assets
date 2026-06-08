## Core API

### Inputs

- `url?: string`
- `getFn?: () => Observable<T> | Promise<T>`

### State

- `data()`
- `isLoading()`
- `error()`

---

## Usage Example

```html
<app-data-loader [getFn]="getFilterDataFn" #loader="dataLoader">
  <app-data-table
    [data]="loader.data()?.list"
    [loading]="loader.isLoading()"
  />
</app-data-loader>





