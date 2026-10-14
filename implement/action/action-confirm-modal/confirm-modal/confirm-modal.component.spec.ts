import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { SpyObj, createSpyObj } from '@shared/testing/spy-obj'
import { SvgIconRegistryService } from 'angular-svg-icon'
import { of } from 'rxjs'
import { SCCConfirmModalComponent } from './confirm-modal.component'

describe('SCCConfirmModalComponent', () => {
  let component: SCCConfirmModalComponent
  let fixture: ComponentFixture<SCCConfirmModalComponent>
  let mockSvgIconRegistryService: SpyObj<SvgIconRegistryService>

  beforeEach(async () => {
    mockSvgIconRegistryService = createSpyObj('SvgIconRegistryService', ['registerIcon', 'loadSvg'])
    mockSvgIconRegistryService.loadSvg.mockReturnValue(of(null))
    await TestBed.configureTestingModule({
      providers: [provideAnimations(), { provide: SvgIconRegistryService, useValue: mockSvgIconRegistryService }],
      imports: [SCCConfirmModalComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SCCConfirmModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should keep the item list inside a dedicated scroll container', async () => {
    const manyItems = Array.from({ length: 40 }, (_, index) => `User ${index + 1}`)
    fixture.componentRef.setInput('scData', manyItems)
    fixture.componentRef.setInput('scLabel', 'Would you like to delete the selected item(s)?')
    fixture.detectChanges()
    await fixture.whenStable()

    const scroll = fixture.debugElement.query(By.css('.confirm-modal__scroll'))
    const footer = fixture.debugElement.query(By.css('.confirm-modal__footer'))
    const items = fixture.debugElement.queryAll(By.css('.confirm-modal__scroll .item'))

    expect(scroll).toBeTruthy()
    expect(footer).toBeTruthy()
    expect(items).toHaveLength(40)
    expect(getComputedStyle(scroll.nativeElement).overflowY).toBe('auto')
  })

  it('should show loading overlay inside the modal when scLoading is true', async () => {
    fixture.componentRef.setInput('scLoading', true)
    fixture.detectChanges()
    await fixture.whenStable()

    const loader = document.body.querySelector('app-loading-animation-v1')
    expect(loader).toBeTruthy()
  })
})
