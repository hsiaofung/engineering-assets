import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SvgIconRegistryService, SvgLoader } from 'angular-svg-icon'
import { of } from 'rxjs'

import { InfoTooltipComponent } from './info-tooltip.component'

describe('InfoTooltipComponent', () => {
  let component: InfoTooltipComponent
  let fixture: ComponentFixture<InfoTooltipComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoTooltipComponent],
      providers: [
        SvgIconRegistryService,
        {
          provide: SvgLoader,
          useValue: {
            getSvg: () => of('<svg></svg>'),
          },
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTooltipComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
