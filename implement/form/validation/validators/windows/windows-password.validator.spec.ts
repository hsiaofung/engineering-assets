// windows-password.validator.spec.ts
import { FormControl } from '@angular/forms'
import { windowsPasswordValidator } from './windows-password.validator'

describe('windowsPasswordValidator', () => {
  const validate = (value: string) => windowsPasswordValidator(new FormControl(value))

  it('returns required for empty', () => {
    expect(validate('')).toEqual({ required: true })
  })

  it('returns maxLength over 127', () => {
    expect(validate('a'.repeat(128))).toEqual({ maxLength: true })
  })

  it('allows valid passwords', () => {
    expect(validate('pass')).toBeNull()
    expect(validate('a'.repeat(127))).toBeNull()
  })
})
