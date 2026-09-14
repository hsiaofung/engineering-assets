import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { WizardConfig, WizardStep } from './workflow-wizard.model'

/**
 * Service for managing wizard configuration, forms, and data.
 */
@Injectable({
  providedIn: 'root',
})
export class WizardService<T = unknown> {
  private config!: WizardConfig<T>
  private forms = new Map<string, FormGroup>()
  private data: Partial<T> = {}
  private http = inject(HttpClient)
  /**
   * Initializes the wizard with the provided configuration and creates form instances for each step.
   * @param {WizardConfig<T>} config The wizard configuration
   * @returns {void}
   */
  init(config: WizardConfig<T>): void {
    this.config = config

    // clear old forms
    this.forms.clear()

    // recreate forms
    config.steps.forEach((step) => {
      this.forms.set(step.id, step.formFactory())
    })

    // clear data
    this.data = {}
  }

  /**
   * Resets the wizard to its initial state.
   */
  reset(): void {
    this.init(this.config)
  }

  /**
   * Retrieves the FormGroup instance for a specific step.
   * @param {string} stepId The step identifier
   * @returns {FormGroup} The FormGroup associated with the step
   */
  getForm(stepId: string): FormGroup {
    return this.forms.get(stepId)!
  }

  /**
   * Updates the wizard data with the values from the specified step's form.
   * @param {string} stepId The step identifier
   */
  updateData(stepId: string): void {
    this.data = {
      ...this.data,
      ...this.getForm(stepId).value,
    }
  }

  /**
   * Retrieves the current wizard data.
   * @returns {T} The aggregated wizard data
   */
  getData(): T {
    return this.data as T
  }

  /**
   * Retrieves the wizard steps configuration.
   * @returns {WizardStep<T>[]} Array of wizard steps
   */
  getSteps() {
    return this.config.steps as WizardStep<T>[]
  }

  /**
   * Returns the values of all wizard forms.
   * @returns {T} Aggregated wizard data
   */
  getAllFormData(): T {
    const result: Record<string, unknown> = {}

    this.forms.forEach((form, stepId) => {
      result[stepId] = form.getRawValue()
    })

    return result as T
  }
}
