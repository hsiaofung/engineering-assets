// windows-hostname-prefix.validator.spec.ts
import { FormControl } from '@angular/forms'
import { windowsHostnamePrefixValidator } from './windows-hostname-prefix.validator'

describe('windowsHostnamePrefixValidator', () => {
  const validate = (value: string) => windowsHostnamePrefixValidator(new FormControl(value))

  it('returns required for empty', () => {
    expect(validate('')).toEqual({ required: true })
    expect(validate('   ')).toEqual({ required: true })
  })

  it('returns maxLength over 10', () => {
    expect(validate('abcdefghijk')).toEqual({ maxLength: true })
  })

  it('returns pattern for invalid characters', () => {
    expect(validate('abc_def')).toEqual({ pattern: true })
    expect(validate('abc def')).toEqual({ pattern: true })
  })

  it('returns allDigits for all numbers', () => {
    expect(validate('12345')).toEqual({ allDigits: true })
  })

  it('returns dashPosition for leading or trailing hyphen', () => {
    expect(validate('-abc')).toEqual({ dashPosition: true })
    expect(validate('abc-')).toEqual({ dashPosition: true })
  })

  it('allows consecutive hyphens and mixed content', () => {
    expect(validate('ab--cd')).toBeNull()
    expect(validate('a1-b2')).toBeNull()
    expect(validate('abc')).toBeNull()
  })
})
