// windows-username.validator.spec.ts
import { FormControl } from '@angular/forms'
import { windowsUsernameValidator } from './windows-username.validator'

describe('windowsUsernameValidator', () => {
  const validate = (value: string) => windowsUsernameValidator(new FormControl(value))

  it('returns required for empty', () => {
    expect(validate('')).toEqual({ required: true })
  })

  it('returns maxLength over 20', () => {
    expect(validate('a'.repeat(21))).toEqual({ maxLength: true })
  })

  it('returns space when contains whitespace', () => {
    expect(validate('user name')).toEqual({ space: true })
  })

  it('returns forbiddenChars for disallowed characters', () => {
    expect(validate('user"name')).toEqual({ forbiddenChars: true })
    expect(validate('user/name')).toEqual({ forbiddenChars: true })
  })

  it('returns allDots for only dots', () => {
    expect(validate('.')).toEqual({ allDots: true })
    expect(validate('..')).toEqual({ allDots: true })
  })

  it('returns reserved for NONE in any case', () => {
    expect(validate('NONE')).toEqual({ reserved: true })
    expect(validate('none')).toEqual({ reserved: true })
    expect(validate('None')).toEqual({ reserved: true })
  })

  it('allows valid usernames', () => {
    expect(validate('user1')).toBeNull()
    expect(validate('admin.name')).toBeNull()
  })
})
