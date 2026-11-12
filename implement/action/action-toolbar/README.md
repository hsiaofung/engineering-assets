# Action Toolbar

Renders a group of icon buttons (and optional dropdowns) from an `ActionButtonConfig[]`.

It only displays the buttons and forwards the clicked key. It does not know about selection, disabled rules, or any action service.

## Usage

```html
<app-action-toolbar
  [actions]="actions()"
  (actionClick)="actionService.run($event)"
/>
```

## Inputs

| Input | Type | Description |
|-------|------|-------------|
| `actions` | `ActionButtonConfig[]` | Buttons to render. Required. |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `actionClick` | `ActionKey` | Emitted when a button or dropdown item is clicked. |

## ActionButtonConfig

```ts
interface ActionButtonConfig {
  key: string
  icon: string
  type?: 'button' | 'dropdown'
  tooltip?: string
  disabled?: boolean
  menuItems?: ActionMenuItemConfig[]
}
```

- `type: 'button'` (default): plain icon button
- `type: 'dropdown'`: icon button with dropdown menu (`menuItems`)

## Notes

- Place it inside the `right` slot of `app-page-header-v1` when used in a page header.
- The parent is responsible for computing `actions` and handling the `actionClick` event.
- Nested dropdown items are supported via `children`.
