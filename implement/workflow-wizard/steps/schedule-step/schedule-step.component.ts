import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { getErrorMessageFromControl, isInvalidControl } from '@app/core-modules-scc4/task/work-flow/utils/form-utils'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { NzSelectModule } from 'ng-zorro-antd/select'

export interface ScheduleFormModel {
  scheduleType: 'now' | 'future'
  state: string | null
  scheduleTime: Date | null
}
/**
 * Component for the schedule step in the workflow wizard.
 */
@Component({
  selector: 'app-schedule-step',
  imports: [FormsModule, ReactiveFormsModule, NzRadioModule, NzSelectModule, NzDatePickerModule],
  styleUrls: ['./schedule-step.component.scss'],
  template: `
    <form [formGroup]="form()">
      <!-- Schedule Type -->
      <div class="form-row mt-20">
        <div class="form-item">
          <label class="title">Schedule Type</label>
          <nz-radio-group formControlName="scheduleType">
            <label nz-radio nzValue="now">Now</label>
            <label nz-radio nzValue="future">Future</label>
          </nz-radio-group>
        </div>
      </div>

      <div class="form-row">
        <!-- State Select -->
        <div class="form-item">
          <label>State</label>
          <nz-select
            formControlName="state"
            nzPlaceHolder="Select state"
            [nzDisabled]="form().get('scheduleType')?.value === 'now'"
          >
            @for (state of states; track state) {
              <nz-option [nzValue]="state.value" [nzLabel]="state.label"></nz-option>
            }
          </nz-select>
        </div>
        <!-- Schedule Time -->
        @if (form().get('scheduleType')?.value === 'future') {
          <div class="form-item">
            <label>Schedule Time</label>
            <div>
              <nz-date-picker formControlName="scheduleTime" nzShowTime nzFormat="yyyy-MM-dd HH:mm:ss"></nz-date-picker>
              <img src="assets/icons/task/schedule.svg" alt="schedule" class="schedule-icon" />
            </div>
            @if (isInvalid('scheduleTime')) {
              <div class="errorShower">
                {{ getErrorMessage('scheduleTime') }}
              </div>
            }
          </div>
        }
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleStepComponent implements OnInit {
  /**
   * Form validation error messages map
   */
  private readonly VALIDATION_MESSAGES: Record<string, Record<string, string>> = {
    scheduleTime: {
      required: 'The field is required.',
    },
  }

  readonly form = input.required<FormGroup>()
  private readonly destroyRef = inject(DestroyRef)
  readonly states = [
    { value: 'enabled', label: 'Enable' },
    { value: 'disabled', label: 'Disable' },
  ]

  /**
   * Checks whether a form control is invalid and touched.
   * @param {string} name - The display name of the form control for error message mapping
   * @returns {boolean} True if invalid and should show error
   */
  isInvalid(name: string): boolean {
    return isInvalidControl(this.form().get(name))
  }

  /**
   * Returns the first validation error message for a control.
   * @param {string} name - The display name of the form control for error message mapping
   * @returns {string} Error message or empty string
   */
  getErrorMessage(name: string): string {
    return getErrorMessageFromControl(this.form().get(name), this.VALIDATION_MESSAGES[name])
  }
  /**
   * Initializes the component. Sets up conditional validation for schedule time based on the selected schedule type.
   * If 'future' is selected, schedule time becomes required. If 'now' is selected, schedule time validation is cleared.
   * Also triggers validation update on initialization to handle default values.
   * @returns {void}
   */
  ngOnInit(): void {
    this.setupConditionalValidation()
  }

  /**
   * Sets up conditional validation for the schedule step.
   */
  private setupConditionalValidation() {
    const scheduleTypeCtrl = this.form().get('scheduleType')!
    const scheduleTimeCtrl = this.form().get('scheduleTime')!

    // Listen for changes to scheduleType. The form outlives this component — `WizardService`
    // owns it — so without `takeUntilDestroyed` the handler would survive every reopen of the
    // wizard and re-apply the validators once per past instance.
    scheduleTypeCtrl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((type) => {
      if (type === 'future') {
        scheduleTimeCtrl.setValidators([Validators.required])
      } else {
        scheduleTimeCtrl.clearValidators()
      }
      scheduleTimeCtrl.updateValueAndValidity() // Important! Trigger validation update immediately
    })

    // Also run once for the initial state (in case default is 'now')
    if (scheduleTypeCtrl.value === 'future') {
      scheduleTimeCtrl.setValidators([Validators.required])
      scheduleTimeCtrl.updateValueAndValidity()
    }
  }
}
