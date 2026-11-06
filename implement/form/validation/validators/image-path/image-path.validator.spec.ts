import { FormControl } from '@angular/forms'
import { imagePathValidator } from './image-path.validator'

describe('imagePathValidator', () => {
  const validator = imagePathValidator()

  const valid = (value: string) => {
    expect(validator(new FormControl(value))).toBeNull()
  }

  const notStartWithSlash = (value: string) => {
    expect(validator(new FormControl(value))).toEqual({ notStartWithSlash: true })
  }

  const invalid = (value: string) => {
    expect(validator(new FormControl(value))).toEqual({ invalid: true })
  }

  describe('valid', () => {
    it.each([
      '/m/{token}/ubuntu-24.04.4-live-server-amd64.iso',
      '/os-image-tmp/Win11.iso',
      '/share/disk.ima',
      '/share/disk.img',
      '/share/os.bin',
      '/MySharedPoint/MyFolder/Image.iso',
    ])('%s', valid)
  })

  describe('not start with /', () => {
    it.each(['m/token/a.iso', '*foo.iso', '\\share\\a.iso'])('%s', notStartWithSlash)
  })

  describe('invalid', () => {
    it.each(['/foo//bar.iso', '/foo bar.iso', '/foo?token=1/a.iso'])('%s', invalid)
  })

  it('returns null for empty', () => {
    expect(validator(new FormControl(''))).toBeNull()
    expect(validator(new FormControl(null))).toBeNull()
  })
})
