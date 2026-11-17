# ValidationDirective

Shows an error message and invalid border for a form control.

## Usage

```html
<input
  formControlName="name"
  [appValidation]="{ required: 'Name is required', maxlength: 'Too long' }"
/>
```

## Inputs

| Input | Type | Description |
|-------|------|-------------|
| `appValidation` | `Record<string, string>` | Map of validator key to error message |

## Behavior

- Shows error when the control is invalid and dirty or touched.
- Error message is the first matching key in `appValidation`.
- Adds `.app-validation--invalid` class to the input when invalid.
- Appends `.app-validation__error` element after the input.

## Styles

Defined in `validation.directive.scss` and imported in `styles.scss`.

```scss
.app-validation--invalid {
  border: 1px solid var(--error-color, #f24f7c);
  height: var(--input-height, 38px);
}

.app-validation__error {
  color: var(--error-color, #f24f7c);
  font-size: 12px;
  margin-top: 4px;
}
