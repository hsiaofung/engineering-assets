import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { ValidationDirective } from './validation.directive'

/**
 *
 */
@Component({  
  imports: [ReactiveFormsModule, ValidationDirective],
  template: `
    <form [formGroup]="form">
      <input formControlName="name" [appValidation]="messages" />
    </form>
  `,
})
class HostComponent {
  form = new FormGroup({ name: new FormControl('', Validators.required) })
  messages = { required: 'Required' }
}

describe('ValidationDirective', () => {
  let fixture: ComponentFixture<HostComponent>
  let input: HTMLInputElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
    input = fixture.debugElement.query(By.css('input')).nativeElement
  })

  it('shows error message when invalid and touched', () => {
    input.dispatchEvent(new Event('blur'))
    fixture.detectChanges()

    const error = fixture.debugElement.query(By.css('.app-validation__error'))
    expect(error).toBeTruthy()
    expect(error.nativeElement.textContent).toBe('Required')
  })

  it('hides error message when valid', () => {
    input.value = 'ok'
    input.dispatchEvent(new Event('input'))
    input.dispatchEvent(new Event('blur'))
    fixture.detectChanges()

    const error = fixture.debugElement.query(By.css('.app-validation__error'))
    expect(error).toBeNull()
  })
})
