# imagePathValidator

Validates the image file path. Must start with `/`.

## Rules

| Rule | Description |
|------|-------------|
| Start | Must begin with `/` |
| Consecutive `//` | Reject |
| Chars | Only `[A-Za-z0-9@^/._-{}]` |
| Space, `?`, `=` | Reject |
| Extension | Not checked |
| Empty | Pass (use `required` separately) |

## Valid

```
/m/{token}/ubuntu-24.04.4-live-server-amd64.iso
/os-image-tmp/Win11.iso
/share/disk.ima
/share/disk.img
/share/os.bin
/MySharedPoint/MyFolder/Image.iso
```

## Invalid

```
m/token/a.iso          → notStartWithSlash
*foo.iso               → notStartWithSlash
\share\a.iso           → notStartWithSlash
/foo//bar.iso          → invalid
/foo bar.iso           → invalid
/foo?token=1/a.iso     → invalid
```

## Usage

```ts
imagePath: ['', [Validators.required, imagePathValidator()]]
```

```ts
imagePath: {
  required: 'The field is required.',
  invalid: 'The format is invalid.',
  notStartWithSlash: "Only paths beginning with '/' are allowed.",
}
```

## Notes

- BMC firmware may still reject certain extensions at mount time; frontend does not block them.
- Do not put `?token=…` in path; BMC path charset does not include `?` or `=`.
