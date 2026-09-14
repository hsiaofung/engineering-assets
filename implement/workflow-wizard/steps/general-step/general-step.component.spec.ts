import { FormGroup } from '@angular/forms'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideNoopAnimations } from '@angular/platform-browser/animations'

import { WORK_FLOW_WIZARD_CONFIG } from '../../../../config/work-flow-wizard.config'
import { GeneralStepComponent } from './general-step.component'

describe('GeneralStepComponent', () => {
  let fixture: ComponentFixture<GeneralStepComponent>
  let component: GeneralStepComponent
  let form: FormGroup

  const createForm = () => {
    const factory = WORK_FLOW_WIZARD_CONFIG.steps[0]?.formFactory
    if (!factory) {
      throw new Error('WORK_FLOW_WIZARD_CONFIG general step formFactory is missing')
    }
    return factory()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralStepComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents()

    fixture = TestBed.createComponent(GeneralStepComponent)
    component = fixture.componentInstance
    form = createForm()
    fixture.componentRef.setInput('form', form)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should not introduce executable HTML from description textarea value', () => {
    const payload = '<img src=x onerror="window.__xssFromTextarea=1">'
    const description = form.get('description')!
    description.setValue(payload)
    description.markAsTouched()
    fixture.detectChanges()

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea')
    expect(textarea).toBeTruthy()
    expect(textarea.value).toBe(payload)

    const imgs = fixture.nativeElement.querySelectorAll('img')
    expect(imgs.length).toBe(0)
    expect(fixture.nativeElement.querySelector('script')).toBeNull()
    expect((window as unknown as { __xssFromTextarea?: number }).__xssFromTextarea).toBeUndefined()
  })

  it('should escape HTML injection in description error message interpolation', () => {
    const malicious = '<img src=x onerror="window.__xssFromErrorMessage=1">'
    const orig = GeneralStepComponent.prototype.getErrorMessage

    vi.spyOn(GeneralStepComponent.prototype, 'getErrorMessage').mockImplementation(function (
      this: GeneralStepComponent,
      name: string,
    ) {
      if (name === 'description') {
        return malicious
      }
      return orig.call(this, name)
    })

    const description = form.get('description')!
    description.setValue('a'.repeat(257))
    description.markAsTouched()
    fixture.detectChanges()

    const errorRows = fixture.nativeElement.querySelectorAll('.errorShower')
    expect(errorRows.length).toBe(1)
    const descriptionError = errorRows[0] as HTMLElement
    expect(descriptionError).toBeTruthy()
    expect(descriptionError.textContent).toContain('<img')
    expect(descriptionError.querySelector('img')).toBeNull()
    expect((window as unknown as { __xssFromErrorMessage?: number }).__xssFromErrorMessage).toBeUndefined()
  })
})
