import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { RequiredDirective } from './required.directive'

/**
 *
 */
@Component({  
  imports: [RequiredDirective],
  template: `<label appRequired>Name</label>`,
})
class HostComponent {}

describe('RequiredDirective', () => {
  let fixture: ComponentFixture<HostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
  })

  it('appends a required asterisk', () => {
    const span = fixture.debugElement.query(By.css('.app-required'))
    expect(span).toBeTruthy()
    expect(span.nativeElement.textContent).toBe('*')
  })
})
