# Resource Detail Card Status

共用狀態標籤樣式。搭配 `statusClass(prefix, value, knownValues)` 使用。

## Import

```scss
@use './resource-detail-card-status.scss';
```

或在 component style 直接 import 這份檔案。

## Helper

```ts
statusClass(prefix: string, value: string | null | undefined, knownValues: readonly string[]): string
```

回傳：

```text
{prefix} {prefix}--{normalizedValue}
```

未知值會變成：

```text
{prefix} {prefix}--other-terms
```

`value` 會先 `trim()` 並轉小寫，所以 API 回 `On` / `ON` 都能對上 `--on`。

## Usage

Component 先公開 helper 和常數：

```ts
readonly statusClass = statusClass
readonly POWER_STATE_VALUES = ['on', 'off'] as const
readonly MANAGED_STATE_VALUES = ['managed', 'initializing', 'stale', 'unauthorized', 'unknown'] as const
readonly HEALTH_VALUES = ['ok', 'good', 'warning', 'critical'] as const
readonly BOOT_SOURCE_OVERRIDE_VALUES = ['enabled', 'disabled'] as const
```

Template：

```html
<span [class]="statusClass('system-power', page.detail.powerState, POWER_STATE_VALUES)">
  {{ displayValue(page.detail.powerState) }}
</span>

<span [class]="statusClass('managedState', page.detail.managedState, MANAGED_STATE_VALUES)">
  {{ displayValue(page.detail.managedState) }}
</span>

<span [class]="statusClass('health', page.detail.health, HEALTH_VALUES)">
  {{ displayValue(page.detail.health) }}
</span>

<span [class]="statusClass('bootSourceOverrideEnabled', page.detail.bootSourceOverrideEnabled, BOOT_SOURCE_OVERRIDE_VALUES)">
  {{ displayValue(page.detail.bootSourceOverrideEnabled) }}
</span>
```

## Class Map

### Power State — `system-power`

| API value | Class | Color |
| --- | --- | --- |
| `on` | `system-power system-power--on` | green |
| `off` | `system-power system-power--off` | gray |
| other | `system-power system-power--other-terms` | blue |

### Managed State — `managedState`

| API value | Class | Color |
| --- | --- | --- |
| `managed` | `managedState managedState--managed` | green |
| `initializing` | `managedState managedState--initializing` | cyan |
| `stale` / `unauthorized` / `unknown` | `managedState managedState--stale` 等 | yellow |
| other | `managedState managedState--other-terms` | blue |

### Health — `health`

| API value | Class | Color |
| --- | --- | --- |
| `ok` / `good` | `health health--ok` / `health--good` | green |
| `warning` | `health health--warning` | yellow |
| `critical` | `health health--critical` | pink |
| other | `health health--other-terms` | blue |

### Boot Source Override — `bootSourceOverrideEnabled`

| API value | Class | Color |
| --- | --- | --- |
| `enabled` | `bootSourceOverrideEnabled bootSourceOverrideEnabled--enabled` | green |
| `disabled` | `bootSourceOverrideEnabled bootSourceOverrideEnabled--disabled` | gray |
| other | `bootSourceOverrideEnabled bootSourceOverrideEnabled--other-terms` | blue |

## Add a new status

1. 在這份 SCSS 加一個 prefix block，例如 `.provisioningState`
2. 為每個已知值加 `&--{value}`
3. 一定要有 `&--other-terms`
4. Template 呼叫：

```html
<span [class]="statusClass('provisioningState', value, ['ready', 'pending'])">
  {{ displayValue(value) }}
</span>
```

TS `knownValues` 必須和 CSS modifier 同名，例如 `'on'` 對 `&--on`。