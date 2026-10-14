import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular'
import { fn } from 'storybook/test'
import { SCCButtonComponent } from '../button/button/button.component'
import type { SimpleTableColumn, StatusDef } from '../data-table-v1'
import { SCModalSizeEnum } from '../modal/modal.interface'
import { ACTION_RESULT_STATUS_MAP, ActionsResponseModalV1Component } from './actions-response-modal-v1.component'

interface ResultRow {
  name: string
  ipv4?: string
  roles?: string[]
  result: string
  reason: string
}

/** The usual shape: what the item is, whether it worked, and why not. */
const COLUMNS: SimpleTableColumn<ResultRow>[] = [
  { key: 'name', label: 'Name', width: 160 },
  { key: 'ipv4', label: 'IP Address', width: 140 },
  { key: 'result', label: 'Result', width: 110, cellType: 'statusTag', statusMap: ACTION_RESULT_STATUS_MAP },
  { key: 'reason', label: 'Reason', width: 200 },
]

const MIXED_ROWS: ResultRow[] = [
  { name: 'node-01', ipv4: '10.0.0.11', result: 'Success', reason: '-' },
  { name: 'node-02', ipv4: '10.0.0.12', result: 'Failed', reason: 'Connection timed out' },
  { name: 'node-03', ipv4: '10.0.0.13', result: 'Success', reason: '-' },
]

const MANY_ROWS: ResultRow[] = Array.from({ length: 20 }, (_, i) => ({
  name: `node-${String(i + 1).padStart(2, '0')}`,
  ipv4: `10.0.0.${i + 11}`,
  result: i % 4 === 3 ? 'Failed' : 'Success',
  reason: i % 4 === 3 ? 'Invalid credentials' : '-',
}))

/** Tag colours for the Role column. Without a `statusMap` a `tagList` renders uncoloured text. */
const ROLE_STATUS_MAP: Record<string, StatusDef> = {
  Admin: { label: 'Admin', colorType: 'info' },
  Viewer: { label: 'Viewer', colorType: 'brown' },
  Operator: { label: 'Operator', colorType: 'orange' },
  ...Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [`Customer${i + 1}`, { label: `Customer${i + 1}`, colorType: 'orange' }]),
  ),
}

/** A result that carries several values per item, e.g. the roles given to each new user. */
const ROLE_COLUMNS: SimpleTableColumn<ResultRow>[] = [
  { key: 'name', label: 'User Name', width: 120 },
  { key: 'roles', label: 'Role', width: 200, cellType: 'tagList', statusMap: ROLE_STATUS_MAP },
  { key: 'result', label: 'Result', width: 100, cellType: 'statusTag', statusMap: ACTION_RESULT_STATUS_MAP },
  { key: 'reason', label: 'Reason', width: 200 },
]

const ROLE_ROWS: ResultRow[] = [
  { name: 'alice', roles: ['Admin'], result: 'Success', reason: '-' },
  {
    name: 'bob',
    roles: ['Viewer', 'Operator', 'Customer1', 'Customer2', 'Customer3', 'Customer4', 'Customer5', 'Customer6'],
    result: 'Success',
    reason: '-',
  },
  { name: 'carol', roles: ['Operator', 'Customer4'], result: 'Failed', reason: 'User name already exists' },
]

type StoryArgs = ActionsResponseModalV1Component<ResultRow> & { closed: () => void }

export default {
  title: 'Design System/Global Component/Actions Response Modal V1',
  component: ActionsResponseModalV1Component,
  decorators: [moduleMetadata({ imports: [SCCButtonComponent] })],
  argTypes: {
    size: {
      options: Object.values(SCModalSizeEnum),
      control: { type: 'select' },
    },
    visible: { table: { disable: true } },
  },
  args: {
    title: 'Execution Result of Power On',
    columns: COLUMNS,
    size: 'small',
    closed: fn(),
  },
  // The caller owns `visible`: open it from a button, close it on `closed`.
  render: (args) => ({
    props: { ...args, open: false },
    template: `
      <scc-button scLabel="Open Modal" (scClick)="open = true"></scc-button>
      <app-actions-response-modal-v1
        [title]="title"
        [columns]="columns"
        [data]="data"
        [size]="size"
        [visible]="open"
        (closed)="open = false; closed()"
      />
    `,
  }),
  parameters: {
    docs: {
      description: {
        component: [
          'Reports the per-item result of an action — "Execution Result of …". A title and a read-only',
          '`app-simple-table`; no toolbar, filter or paging.',
          '',
          'The component knows no module. The caller passes the columns (`SimpleTableColumn[]`) and the rows,',
          'owns `visible`, and sets it back to `false` on `closed`. For the usual Result column use',
          '`ACTION_RESULT_STATUS_MAP` (`Success` green, `Failed` red); pass your own `statusMap` if the API',
          'answers with other words.',
          '',
          '```html',
          '<app-actions-response-modal-v1',
          '  title="Execution Result of Power On"',
          '  [columns]="resultColumns"',
          '  [data]="results()"',
          '  [visible]="showResult()"',
          '  (closed)="showResult.set(false)"',
          '/>',
          '```',
        ].join('\n'),
      },
    },
  },
} as Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

/** Some items succeeded and some failed — the common case. */
export const MixedResults: Story = {
  args: { data: MIXED_ROWS },
}

/** A long batch: the table grows and the modal scrolls. */
export const ManyItems: Story = {
  args: { data: MANY_ROWS, title: 'Execution Result of Update Firmware' },
}

/** A `tagList` column: tags that do not fit collapse into "+N More"; hover it to see the rest. */
export const WithTagList: Story = {
  args: { columns: ROLE_COLUMNS, data: ROLE_ROWS, title: 'Execution Result of Add User' },
}
