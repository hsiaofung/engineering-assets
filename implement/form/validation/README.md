# ValidationDirective

Displays the first validation error message under a form control.

## Usage

```html
<input
  nz-input
  formControlName="imageServerUrl"
  appValidation
  [appValidation]="VALIDATION_MESSAGES['imageServerUrl']"
/>
```

```ts
const VALIDATION_MESSAGES = {
  imageServerUrl: {
    required: 'The field is required.',
    invalid: 'The format is invalid.',
  },
  imagePath: {
    required: 'The field is required.',
    invalid: 'The format is invalid.',
    notStartWithSlash: "Only paths beginning with '/' are allowed.",
  },
}
```

## Behavior

- Reads the control's errors.
- Shows the first matching message from the map.
- Hides when the control is valid or untouched.
- Message key must match the validator's error key (`required`, `invalid`, `notStartWithSlash`, …).

## Notes

- This directive only displays messages. It does not validate.
- Validators live with their domain (`compute/validators/` for image rules).
- Message maps live with the form that uses them.


