import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideMockStore } from '@ngrx/store/testing'
import { TranslateModule } from '@ngx-translate/core'

import { ActionsErrorModalComponent } from './actions-error-modal.component'

describe('ActionsErrorModalComponent', () => {
  let component: ActionsErrorModalComponent
  let fixture: ComponentFixture<ActionsErrorModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsErrorModalComponent, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: {
            MainLayoutReducer: {
              error: { message: '' },
            },
          },
        }),
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsErrorModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
