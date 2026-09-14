import { NgClass } from '@angular/common'
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { getErrorMessageFromControl, isInvalidControl } from '@app/core-modules-scc4/task/work-flow/utils/form-utils'
import { NzInputDirective } from 'ng-zorro-antd/input'

/**
 *
 */
@Component({
  selector: 'app-general-step',
  imports: [FormsModule, ReactiveFormsModule, NzInputDirective, NgClass],
  providers: [NgClass],
  styleUrls: ['./general-step.component.scss'],
  template: `
    <div class="title">General</div>
    <form [formGroup]="form()">
      <div class="form-row">
        <div class="form-item">
          <label>Workflow Name<span style="color: red;"> *</span></label>
          <input
            nz-input
            formControlName="workflowName"
            type="text"
            placeholder="Workflow Name"
            [ngClass]="{ 'error-border': isInvalid('workflowName') }"
          />
          @if (isInvalid('workflowName')) {
            <div class="errorShower">
              {{ getErrorMessage('workflowName') }}
            </div>
          }
        </div>
      </div>
      <div class="form-row">
        <div class="form-item">
          <label>Description</label>
          <textarea
            rows="4"
            nz-input
            formControlName="description"
            placeholder="Description"
            maxlength="256"
          ></textarea>
          @if (isInvalid('description')) {
            <div class="errorShower">
              {{ getErrorMessage('description') }}
            </div>
          }
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralStepComponent {
  readonly form = input.required<FormGroup>()

  /**
   * Form validation error messages map
   */
  private readonly VALIDATION_MESSAGES: Record<string, Record<string, string>> = {
    workflowName: {
      required: 'The field is required.',
      maxlength: 'Length must be less than 64 characters',
      pattern: 'Only capital case, small case, numeric, hyphen and dot are allowed.',
    },
    description: {
      maxlength: 'Length must be less than 256 characters',
      pattern: 'Description contains invalid characters.',
    },
  }

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
}
