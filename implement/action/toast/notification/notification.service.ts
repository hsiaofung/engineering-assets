import { Injectable, signal } from '@angular/core'
import { EMPTY_NOTIFICATION, type NotificationInput } from './notification.interface'

/**
 * App-wide toast notification bus.
 *
 * Prefer this over MainLayout NgRx store for 4.0 / zoneless code:
 * - lightweight signal state (no store boilerplate)
 * - easy to inject from any feature
 * - keeps notification concerns out of layout state
 *
 * Usage:
 * ```ts
 * private readonly notificationService = inject(NotificationService)
 *
 * this.notificationService.show({
 *   message: 'Saved successfully',
 *   messageType: 'success',
 * })
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationState = signal<NotificationInput>(EMPTY_NOTIFICATION)

  /** Latest notification payload for the host component. */
  readonly notification = this.notificationState.asReadonly()

  /**
   * Shows a toast. `timeStamp` is auto-filled when omitted so repeated
   * identical messages still trigger a new notification.
   * @param {NotificationInput} config Notification payload, or a `{ type }` preset reference.
   */
  show(config: NotificationInput): void {
    this.notificationState.set({
      ...config,
      timeStamp: config.timeStamp ?? Date.now(),
    })
  }

  /**
   * Clears the current notification payload.
   */
  clear(): void {
    this.notificationState.set(EMPTY_NOTIFICATION)
  }
}
