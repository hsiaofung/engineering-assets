import type { NzNotificationPlacement } from 'ng-zorro-antd/notification'

/**
 * Payload used to show a toast notification.
 */
export interface NotificationConfig {
  type?: string
  messageType: string
  message: string
  subMessage?: string
  timeStamp?: number
  duration?: number
  hideCloseIcon?: boolean
  /**
   * Draws a bar counting down to this toast's dismissal.
   *
   * Ignored when `duration` is `0`: that toast stays until it is closed, so there is no deadline
   * for a bar to count down to. The bar's fill is timed from `duration`, so the two cannot drift
   * apart (#126).
   */
  showProgressBar?: boolean
  bgColor?: string
  icon?: string
  routeLink?: string
  placement?: NzNotificationPlacement
  onClick?: () => void
}

/**
 * Partial preset config stored in notification constants mapping.
 */
export type NotificationPresetConfig = Partial<NotificationConfig> & {
  messageType: string
  message: string
}

/**
 * A payload that names a preset from `NOTIFICATION_CONFIG_MAPPING` instead of spelling the
 * notification out.
 *
 * `messageType` and `message` are mandatory on {@link NotificationConfig} but come from the preset
 * here, so a caller that only wants "show the dump toast, and call me back when it is clicked"
 * would otherwise have to restate constants it does not own. The host component merges
 * `{ ...preset, ...payload }` before rendering, which is what makes the required fields present at
 * runtime.
 */
export type NotificationPresetRef = Partial<Omit<NotificationConfig, 'type'>> & { type: string }

/** Everything `NotificationService.show()` accepts. */
export type NotificationInput = NotificationConfig | NotificationPresetRef

/**
 * Empty notification used to clear active toast state.
 */
export const EMPTY_NOTIFICATION: NotificationConfig = {
  message: '',
  messageType: '',
  timeStamp: 0,
}
