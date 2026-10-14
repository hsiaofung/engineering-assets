import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { NzNotificationComponent, NzNotificationService } from 'ng-zorro-antd/notification'
import { ICON_NAME_MAPPING, NOTIFICATION_CONFIG_MAPPING } from './notification.constant'
import type { NotificationConfig, NotificationInput } from './notification.interface'
import { NotificationService } from './notification.service'

const DEFAULT_DURATION = 3000
const DEFAULT_PLACEMENT = 'bottomRight'
const DEFAULT_BG_COLOR = '#38bca4'

type NotificationTemplateContext = {
  $implicit: NzNotificationComponent
  data: NotificationConfig
}

/**
 * Global toast host for the design system.
 *
 * Zone-less: signal state, computed values, OnPush, and no NgZone usage.
 * Driven by {@link NotificationService} instead of MainLayout NgRx store.
 */
@Component({
  selector: 'scc-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  private readonly nzNotification = inject(NzNotificationService)
  private readonly notificationService = inject(NotificationService)
  private readonly router = inject(Router)
  private readonly destroyRef = inject(DestroyRef)

  private readonly notificationTemp = viewChild<TemplateRef<NotificationTemplateContext>>('notification')
  private readonly iconTpl = viewChild<TemplateRef<void>>('iconTpl')

  protected readonly notificationConfig = signal<NotificationConfig | null>(null)
  /**
   * Whether the icon block does anything when clicked.
   *
   * Decided by what the payload carries, not by its `messageType` (#144). The two allowlists this
   * replaced disagreed with each other — `moveSuccess` was on the one that draws the pointer and
   * the focus ring, but not on the one that navigates, so it advertised an action it did not have —
   * and no allowlist can answer the question anyway: whether a toast leads somewhere is a property
   * of the toast, and `warning` needing a route was all it took to expose that.
   *
   * `refresh` is the exception that stays type-driven: it reloads the page and so carries neither
   * field, which would leave it inert under this rule.
   */
  protected readonly isIconClickable = computed(() => {
    const config = this.notificationConfig()
    if (!config) {
      return false
    }

    const { messageType, routeLink = '', onClick } = config
    return !!onClick || routeLink !== '' || messageType === 'refresh'
  })
  protected readonly containerStyle = computed(() => {
    const config = this.notificationConfig()
    return {
      'background-color': config?.bgColor ?? DEFAULT_BG_COLOR,
      'pointer-events': this.isIconClickable() ? 'auto' : 'none',
    }
  })
  /**
   * Whether to draw the bar counting down to this toast's dismissal.
   *
   * A `duration` of `0` means the toast stays until it is closed, so there is no deadline to
   * count down to and the bar would fill against nothing. `NOTIFICATION_CONFIG_MAPPING` has two
   * such presets, and a caller can set it directly, so this is an ordinary state rather than a
   * misconfiguration.
   */
  protected readonly showProgressBar = computed(() => {
    const config = this.notificationConfig()
    return !!config?.showProgressBar && (config.duration ?? 0) > 0
  })

  /**
   * Ties the bar's fill to the toast's own lifetime.
   *
   * The animation is declared in the stylesheet with no duration of its own, so this is what
   * starts it — and re-reading `duration` per toast is the whole point: the previous
   * implementation stepped a signal by a fixed 20% per second, which filled in five seconds
   * regardless, while every preset that dismisses does so at 4500ms or 2000ms. The bar was
   * therefore guaranteed to disagree with the toast it belonged to.
   */
  protected readonly progressStyle = computed(() => ({
    'animation-duration': `${this.notificationConfig()?.duration ?? DEFAULT_DURATION}ms`,
  }))

  private lastHandledTimeStamp = 0

  /**
   * Subscribes to notification service updates and cleans up timers on destroy.
   */
  constructor() {
    effect(() => {
      const incoming = this.notificationService.notification()
      // Re-run when templates become available after first CD cycle.
      const templateReady = !!this.notificationTemp() && !!this.iconTpl()
      if (!templateReady) {
        return
      }
      untracked(() => this.handleIncomingNotification(incoming))
    })

    this.destroyRef.onDestroy(() => this.notificationService.clear())
  }

  /**
   * Handles a click on the toast's icon block.
   *
   * Mirrors {@link NotificationComponent.isIconClickable} exactly, which is the point: the two used
   * to consult different allowlists, so a toast could be clickable and do nothing. Anything this
   * method refuses to act on must also read as unclickable, or the pointer is a lie.
   * @param {NotificationConfig} notificationConfig Active toast payload.
   */
  protected onClick(notificationConfig: NotificationConfig): void {
    const { messageType, routeLink = '', onClick } = notificationConfig

    if (routeLink !== '') {
      void this.router.navigateByUrl(routeLink)
    } else if (onClick) {
      onClick()
    }

    if (messageType === 'refresh') {
      window.location.reload()
    }
  }

  /**
   * Resolves preset config and opens an NZ notification template.
   * @param {NotificationInput} result Incoming payload, or a `{ type }` preset reference whose
   * preset supplies the mandatory fields.
   */
  private handleIncomingNotification(result: NotificationInput): void {
    const preset = result?.type ? NOTIFICATION_CONFIG_MAPPING[result.type] : undefined
    // The merge is what completes a preset reference: the preset always carries `messageType`
    // and `message`, and the caller's own fields win over it.
    let config: NotificationConfig | null = preset
      ? {
          ...preset,
          ...result,
          onClick: result.onClick,
          subMessage: result.subMessage || preset.subMessage,
        }
      : (result as NotificationConfig)

    config = config ?? (result as NotificationConfig)

    const {
      messageType,
      message,
      duration = DEFAULT_DURATION,
      placement = DEFAULT_PLACEMENT,
      timeStamp = Date.now(),
      hideCloseIcon = false,
      showProgressBar = false,
      bgColor = DEFAULT_BG_COLOR,
      icon,
    } = config ?? {}

    if (!message || !messageType || !timeStamp || timeStamp === this.lastHandledTimeStamp) {
      return
    }

    const template = this.notificationTemp()
    const closeIcon = this.iconTpl()
    if (!template || !closeIcon) {
      return
    }

    this.lastHandledTimeStamp = timeStamp

    const resolvedConfig: NotificationConfig = {
      ...config,
      messageType,
      message,
      duration,
      placement,
      timeStamp,
      hideCloseIcon,
      showProgressBar,
      bgColor: bgColor ?? DEFAULT_BG_COLOR,
      icon: `assets/icons/toast/${icon ?? ICON_NAME_MAPPING[messageType] ?? messageType}.svg`,
    }

    this.notificationConfig.set(resolvedConfig)

    this.nzNotification.template(template, {
      nzData: resolvedConfig,
      nzPlacement: placement,
      nzClass: hideCloseIcon ? 'hide-icon' : '',
      nzDuration: duration,
      nzCloseIcon: closeIcon,
    })

    queueMicrotask(() => this.initImgContainerHeight())
  }

  /**
   * Matches toast icon container height to the rendered notice height.
   */
  private initImgContainerHeight(): void {
    const noticeEl = document.querySelector('.ant-notification-notice-with-icon')
    if (!(noticeEl instanceof HTMLElement)) {
      return
    }

    const imgContainer = noticeEl.querySelector<HTMLElement>('.img-container')
    if (!imgContainer) {
      return
    }

    imgContainer.style.height = `${noticeEl.clientHeight}px`
  }
}
