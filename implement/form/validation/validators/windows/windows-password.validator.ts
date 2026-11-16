import { ValidatorFn } from '@angular/forms'

export const windowsPasswordValidator: ValidatorFn = (control) => {
  const value = control.value ?? ''
  if (!value) return { required: true }
  if (value.length > 127) return { maxLength: true }
  return null
}
