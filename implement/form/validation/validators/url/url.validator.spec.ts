// url.validator.spec.ts
import { FormControl } from '@angular/forms'
import { imageServerUrlValidator } from './url.validator'

describe('imageServerUrlValidator', () => {
  const validator = imageServerUrlValidator()

  const valid = (value: string) => {
    const control = new FormControl(value)
    expect(validator(control)).toBeNull()
  }

  const invalid = (value: string) => {
    const control = new FormControl(value)
    expect(validator(control)).toEqual({ invalid: true })
  }

  describe('valid', () => {
    it.each([
      'http://10.188.157.5',
      'https://192.188.8.8:443',
      'http://media.example.com',
      'media.example.com',
      '10.188.157.5',
      '192.188.8.8:443',
      '[2001:db8::1]',
      'smb://media.example.com',
    ])('%s', valid)
  })

  describe('invalid', () => {
    it.each([
      '192.188.8.8:443/',
      'https://192.188.8.8:443/',
      'http://media.example.com/path',
      'http://media.example.com?query=1',
      'http://media.example.com#frag',
      'http://user:pass@media.example.com',
      'media_example.com',
      'media example.com',
      '中文.com',
      '[2001:db8::1',
    ])('%s', invalid)
  })

  it('returns null for empty', () => {
    expect(validator(new FormControl(''))).toBeNull()
    expect(validator(new FormControl(null))).toBeNull()
  })
})
