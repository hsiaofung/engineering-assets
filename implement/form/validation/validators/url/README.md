# imageServerUrlValidator

Validates the image server host. Accepts scheme-less input; worker prepends `http://` when missing.

## Rules

| Rule | Description |
|------|-------------|
| Trailing `/` | Reject |
| Path, `?query`, `#fragment` | Reject |
| `user:pass@` | Reject |
| Host chars | Only `[A-Za-z0-9.-]`; IPv6 in `[]` |
| Scheme | Optional. `http://`, `https://`, `smb://` allowed |
| Empty | Pass (use `required` separately) |

## Valid

```
http://10.188.157.5
https://192.188.8.8:443
http://media.example.com
media.example.com
10.188.157.5
192.188.8.8:443
[2001:db8::1]
smb://media.example.com
```

## Invalid

```
192.188.8.8:443/
https://192.188.8.8:443/
http://media.example.com/path
http://media.example.com?query=1
http://user:pass@media.example.com
media_example.com
[2001:db8::1
```

## Usage

```ts
imageServerUrl: ['', [Validators.required, imageServerUrlValidator()]]
```

```ts
imageServerUrl: {
  required: 'The field is required.',
  invalid: 'The format is invalid.',
}
```

## Notes

- `smb://` is for SAA mount on BMC; worker ISO download requires `http(s)`.
- UNC `\\host\share` belongs here, not in `imagePath`.
```

---