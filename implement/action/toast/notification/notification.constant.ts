import type { NotificationPresetConfig } from './notification.interface'

export const NOTIFICATION_CONFIG_MAPPING: Record<string, NotificationPresetConfig> = {
  dump: {
    messageType: 'dump',
    message: 'Dump File Ready',
    subMessage: 'Please click the icon button to download the file.',
    duration: 0,
    bgColor: '#33B0E0',
    icon: 'dump',
  },
  accountSuccess: {
    messageType: 'success',
    message: 'Account Activated Successfully',
    icon: 'success',
  },
  accountFailed: {
    messageType: 'error',
    message: 'Account Activation Failed',
    duration: 2000,
    icon: 'failed',
  },
  forgotPwdSuccess: {
    messageType: 'success',
    message: 'Reset password email had been sent to account registered email address.',
    duration: 4500,
    icon: 'success',
  },
  forgotPwdFailed: {
    messageType: 'error',
    message: 'API Failed.',
    duration: 4500,
    icon: 'failed',
  },
  resetPwdSuccess: {
    messageType: 'success',
    message: 'Password reset successfully',
    duration: 4500,
    icon: 'success',
  },
  resetPwdFailed: {
    messageType: 'error',
    message: 'Password cannot reset now. Try again later.',
    duration: 4500,
    icon: 'failed',
  },
  sendSuccessfully: {
    messageType: 'success',
    message: 'Send Successfully',
    icon: 'success',
    hideCloseIcon: true,
  },
  sendFailed: {
    messageType: 'error',
    message: 'Send Failed',
    icon: 'failed',
    duration: 0,
  },
  /**
   * The trial key is nearly up (#144).
   *
   * `message` is a placeholder: the caller always overrides it with the real day count, which is
   * the only part that varies. It is spelled out rather than left empty so that the preset reads
   * as the toast it produces.
   *
   * `duration` restates the component's default 3000ms on purpose — three seconds is what the
   * issue asks for here, not a default this toast happens to inherit. No close button: it dismisses
   * itself before anyone could reach for one.
   */
  trialKeyExpiring: {
    messageType: 'warning',
    message: 'Your trial key expires in 30 days',
    subMessage: 'Please purchase license keys.',
    duration: 3000,
    bgColor: '#1C7BCF',
    hideCloseIcon: true,
    routeLink: '/admin/license-management',
  },
}

export const ICON_NAME_MAPPING: Record<string, string> = {
  warning: 'expired',
  success: 'success',
  error: 'failed',
  externalRedirection: 'taskSuccess',
  refresh: 'reload',
}

// `REDIREC_MSG_TYPE` stood here (#144): an allowlist of the `messageType`s whose `routeLink` was
// honoured. It answered "is this toast clickable?" with the type of its message, which is not
// something a type can know — a `warning` carrying a route was inert, and `moveSuccess` was in this
// list but not in the component's near-identical second one, so it rendered as clickable and did
// nothing when clicked. `NotificationComponent` now reads the payload: a `routeLink` navigates and
// an `onClick` is called, whatever the type.
