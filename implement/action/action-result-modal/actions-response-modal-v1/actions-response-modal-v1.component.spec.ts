import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { By } from '@angular/platform-browser'
import { SvgIconRegistryService, SvgLoader } from 'angular-svg-icon'
import { of } from 'rxjs'

import type { SimpleTableColumn } from '../data-table-v1'
import { SCCModalComponent } from '../modal/modal.component'
import { ACTION_RESULT_STATUS_MAP, ActionsResponseModalV1Component } from './actions-response-modal-v1.component'

interface ResultRow {
  name: string
  result: string
  reason: string
}

const COLUMNS: SimpleTableColumn<ResultRow>[] = [
  { key: 'name', label: 'Name' },
  { key: 'result', label: 'Result', cellType: 'statusTag', statusMap: ACTION_RESULT_STATUS_MAP },
  { key: 'reason', label: 'Reason' },
]

const ROWS: ResultRow[] = [
  { name: 'node-01', result: 'Success', reason: '-' },
  { name: 'node-02', result: 'Failed', reason: 'Connection timed out' },
]

describe('ActionsResponseModalV1Component', () => {
  let fixture: ComponentFixture<ActionsResponseModalV1Component<ResultRow>>

  /**
   * nz-modal renders into the CDK overlay, outside the fixture, so read the whole document.
   * @returns {string} The document's text.
   */
  const overlayText = (): string => document.body.textContent ?? ''

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsResponseModalV1Component],
      providers: [
        provideNoopAnimations(),
        // The modal's close icon renders through angular-svg-icon.
        SvgIconRegistryService,
        { provide: SvgLoader, useValue: { getSvg: () => of('<svg></svg>') } },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ActionsResponseModalV1Component<ResultRow>)
    fixture.componentRef.setInput('title', 'Execution Result of Power On')
    fixture.componentRef.setInput('columns', COLUMNS)
    fixture.componentRef.setInput('data', ROWS)
  })

  it('renders the title and one row per item when visible', async () => {
    fixture.componentRef.setInput('visible', true)
    await fixture.whenStable()

    const text = overlayText()
    expect(text).toContain('Execution Result of Power On')
    expect(text).toContain('node-01')
    expect(text).toContain('Connection timed out')
    expect(text).toContain('Failed')
  })

  it('renders nothing while hidden', async () => {
    await fixture.whenStable()

    expect(overlayText()).not.toContain('Execution Result of Power On')
  })

  it('emits closed when the modal is dismissed', async () => {
    fixture.componentRef.setInput('visible', true)
    await fixture.whenStable()
    const closed = vi.fn()
    fixture.componentInstance.closed.subscribe(closed)

    fixture.debugElement.query(By.directive(SCCModalComponent)).componentInstance.scOnCancel.emit()

    expect(closed).toHaveBeenCalledTimes(1)
  })
})
