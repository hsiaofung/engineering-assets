import { ValidatorFn } from '@angular/forms'

export const windowsUsernameValidator: ValidatorFn = (control) => {
  const value = (control.value ?? '').trim()
  if (!value) return { required: true }
  if (value.length > 20) return { maxLength: true }
  if (/\s/.test(value)) return { space: true }
  if (/["/\\[\]:;|=,+*?<>@]/.test(value)) return { forbiddenChars: true }
  if (/^\.+$/.test(value)) return { allDots: true }
  if (value.toUpperCase() === 'NONE') return { reserved: true }
  return null
}
