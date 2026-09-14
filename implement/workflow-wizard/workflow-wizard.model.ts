import { Type } from '@angular/core'
import { FormGroup } from '@angular/forms'

export interface WizardStep<T = unknown> {
  id: string
  title: string
  component: Type<unknown>
  formFactory: () => FormGroup
  isOptional?: boolean
  hidden?: (data: T) => boolean
}

export interface WizardConfig<T = unknown> {
  id: string
  steps: WizardStep<T>[]
}
