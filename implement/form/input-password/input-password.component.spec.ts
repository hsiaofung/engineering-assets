import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { SvgIconRegistryService, SvgLoader } from 'angular-svg-icon'
import { of } from 'rxjs'
import { InputPasswordComponent } from './input-password.component'

describe('InputPasswordComponent', () => {
  let component: InputPasswordComponent
  let fixture: ComponentFixture<InputPasswordComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPasswordComponent, ReactiveFormsModule],
      providers: [
        SvgIconRegistryService,
        {
          provide: SvgLoader,
          useValue: { getSvg: () => of('<svg></svg>') },
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPasswordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should write values through ControlValueAccessor', () => {
    component.writeValue('secret')
    fixture.detectChanges()
    expect(component['form'].controls.value.value).toBe('secret')
  })

  it('should emit value changes through registerOnChange', () => {
    const changes: string[] = []
    component.registerOnChange((value: string) => {
      changes.push(value)
    })

    component['form'].controls.value.setValue('updated')
    expect(changes).toEqual(['updated'])
  })

  it('should toggle password visibility', () => {
    expect(component['showPassword']()).toBe(false)
    expect(component['inputType']()).toBe('password')

    component['togglePasswordVisibility']()
    expect(component['showPassword']()).toBe(true)
    expect(component['inputType']()).toBe('text')
  })

  it('should not toggle visibility when disabled', () => {
    component.setDisabledState(true)
    component['togglePasswordVisibility']()
    expect(component['showPassword']()).toBe(false)
  })

  it('should emit dsBlur and call onTouched on blur', () => {
    let touchedCalls = 0
    let blurCalls = 0
    component.registerOnTouched(() => {
      touchedCalls += 1
    })
    component.dsBlur.subscribe(() => {
      blurCalls += 1
    })

    component['handleBlur']()

    expect(touchedCalls).toBe(1)
    expect(blurCalls).toBe(1)
  })

  it('should work with reactive FormControl values', () => {
    const control = new FormControl('initial')
    component.writeValue(control.value)
    expect(component['form'].controls.value.value).toBe('initial')
  })

  describe('dsStatus', () => {
    /**
     * The element ng-zorro draws the border on: with a suffix present, the wrapper host.
     * @returns {HTMLElement} The `nz-input-wrapper` element.
     */
    const wrapper = (): HTMLElement =>
      (fixture.nativeElement as HTMLElement).querySelector('nz-input-wrapper') as HTMLElement

    it('should mark the wrapper, not the input, when the field is in error', async () => {
      // The input inside an `ant-input-affix-wrapper` is borderless, so an `error` class placed on
      // it styles an edge that is never drawn — which is exactly how this shipped unnoticed until
      // #143 became the first caller.
      fixture.componentRef.setInput('dsStatus', 'error')
      await fixture.whenStable()

      expect(wrapper().classList).toContain('error')
      expect((fixture.nativeElement as HTMLElement).querySelector('input')?.classList).not.toContain('error')
    })

    it('should keep the wrapper an affix wrapper, which is what holds the border', async () => {
      fixture.componentRef.setInput('dsStatus', 'error')
      await fixture.whenStable()

      // The style rules are written as `.error.ant-input-affix-wrapper` to out-specify ng-zorro's
      // own hover and focus rules; if this class ever stopped appearing they would all miss.
      expect(wrapper().classList).toContain('ant-input-affix-wrapper')
    })

    it('should carry no status class by default', () => {
      expect(wrapper().classList).not.toContain('error')
    })
  })
})
