import { OperatorFunction, tap } from 'rxjs'
import { NotificationService } from './notification.service'

/**
 * Shows a success or failure notification after an HTTP action completes.
 * @template T
 * @param {NotificationService} notificationService - The service used to display the notification.
 * @returns {OperatorFunction<T, T>} An RxJS operator that emits the original value and shows a notification.
 */
export function notifyResult<T>(notificationService: NotificationService): OperatorFunction<T, T> {
  return (source) =>
    source.pipe(
      tap({
        next: () => notificationService.show({ type: 'sendSuccessfully' }),
        error: (err) =>
          notificationService.show({
            type: 'sendFailed',
            subMessage: err?.error?.error?.message ?? '',
          }),
      }),
    )
}
