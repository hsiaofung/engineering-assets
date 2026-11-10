import { ComponentFixture, TestBed } from '@angular/core/testing'

import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { SvgIconRegistryService, SvgLoader } from 'angular-svg-icon'
import { of } from 'rxjs'
import { SCCWarningModalComponent } from './warning-modal.component'

describe('WarningModalComponent', () => {
  let component: SCCWarningModalComponent
  let fixture: ComponentFixture<SCCWarningModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SCCWarningModalComponent],
      providers: [
        provideNoopAnimations(),
        SvgIconRegistryService,
        { provide: SvgLoader, useValue: { getSvg: () => of('<svg></svg>') } },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SCCWarningModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
