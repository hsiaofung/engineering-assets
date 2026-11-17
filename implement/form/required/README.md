# Required Directive

Adds a red asterisk `*` after a label to indicate a required field.

## Usage

```html
<div class="label" appRequired>URL</div>
```

## Import

```ts
import { RequiredDirective } from '@app/shared/design-system/global-component/required/required.directive'

@Component({
  imports: [RequiredDirective],
})
export class YourComponent {}
```

## Behavior

- `appRequired` (attribute only) → appends a `*` with class `app-required`

## Styles

Defined in `required.directive.scss` and imported in `styles.scss`.

```scss
.app-required {
  color: var(--error-color, #f24f7c);
  padding-left: 4px;
}
```
