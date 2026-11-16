import { ValidatorFn } from '@angular/forms'

export const windowsHostnamePrefixValidator: ValidatorFn = (control) => {
  const value = (control.value ?? '').trim()
  if (!value) return { required: true }
  if (value.length > 10) return { maxLength: true }
  if (!/^[A-Za-z0-9-]+$/.test(value)) return { pattern: true }
  if (/^\d+$/.test(value)) return { allDigits: true }
  if (value.startsWith('-') || value.endsWith('-')) return { dashPosition: true }
  return null
}
