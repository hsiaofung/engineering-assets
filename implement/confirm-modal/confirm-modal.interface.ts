import { TemplateRef } from '@angular/core'
import { SCCButtonType } from '../button/button/button.interface'
import { SCCMessageType } from '../message/message.interface'

export interface SCCConfirmModalButtonConfig {
  label: string
  type: keyof typeof SCCButtonType
}

export interface SCCConfirmModalMessageConfig {
  message: string | TemplateRef<unknown>
  type: keyof typeof SCCMessageType
}
