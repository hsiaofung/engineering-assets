import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

/**
 * Validates an image path.
 * Requires a leading slash and rejects consecutive slashes or disallowed characters.
 * Returns `null` when the value is empty or valid.
 * @returns {ValidatorFn} An Angular validator that checks the image path format.
 */
export function imagePathValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.trim()
    if (!value) return null

    if (!value.startsWith('/')) {
      return { notStartWithSlash: true }
    }

    if (value.includes('//')) {
      return { invalid: true }
    }

    // Allowed: A-Za-z0-9 @ ^ / . _ - { }
    if (!/^\/[A-Za-z0-9@^/._\-{}]*$/.test(value)) {
      return { invalid: true }
    }

    return null
  }
}
