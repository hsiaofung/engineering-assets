import { NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, TemplateRef, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NotificationComponent } from './notification.component'
import type { NotificationConfig } from './notification.interface'
import { NotificationService } from './notification.service'

/**
 * Renders the toast template that `NzNotificationService` would normally host.
 *
 * The service is mocked, so the template is captured rather than rendered and nothing inside it
 * ever runs — which is exactly where #126 lived: the `@if` around the progress bar named a
 * different condition from the one that started the timer, and no test could see it. A
 * `TemplateRef` stays bound to the component that declared it wherever it is rendered, so putting
 * it here exercises the real markup against the real component state.
 */
@Component({
  selector: 'scc-test-toast-host',
  imports: [NgTemplateOutlet],
  template: `<ng-container *ngTemplateOutlet="template(); context: { data: data() }"></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ToastHostComponent {
  readonly template = signal<TemplateRef<unknown> | null>(null)
  readonly data = signal<NotificationConfig | null>(null)
}

describe('NotificationComponent', () => {
  let component: NotificationComponent
  let fixture: ComponentFixture<NotificationComponent>
  let notificationService: NotificationService
  let nzNotification: { template: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    nzNotification = {
      template: vi.fn(),
    }

    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [
        provideRouter([]),
        {
          provide: NzNotificationService,
          useValue: nzNotification,
        },
        NotificationService,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(NotificationComponent)
    component = fixture.componentInstance
    notificationService = TestBed.inject(NotificationService)
    fixture.detectChanges()
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should show a notification from NotificationService', async () => {
    notificationService.show({
      message: 'Saved successfully',
      messageType: 'success',
      timeStamp: Date.now(),
    })

    fixture.detectChanges()
    await fixture.whenStable()

    expect(nzNotification.template).toHaveBeenCalled()
  })

  describe('the progress bar', () => {
    let host: ComponentFixture<ToastHostComponent>

    /**
     * Shows a toast and renders the template the mocked service captured.
     * @param {Partial<NotificationConfig>} config Fields to send, merged over a minimal toast.
     * @returns {Promise<HTMLElement | null>} The rendered bar's thumb, or `null` when no bar drew.
     */
    const showAndRender = async (config: Partial<NotificationConfig>): Promise<HTMLElement | null> => {
      notificationService.show({
        message: 'Processing request',
        messageType: 'success',
        timeStamp: Date.now(),
        ...config,
      })
      fixture.detectChanges()
      await fixture.whenStable()

      const [template, options] = nzNotification.template.mock.calls.at(-1) as [
        TemplateRef<unknown>,
        { nzData: NotificationConfig },
      ]
      host.componentInstance.template.set(template)
      host.componentInstance.data.set(options.nzData)
      host.detectChanges()
      await host.whenStable()

      return (host.nativeElement as HTMLElement).querySelector<HTMLElement>('.progress-bar-thumb')
    }

    beforeEach(() => {
      host = TestBed.createComponent(ToastHostComponent)
    })

    it('should draw for showProgressBar, which nothing could do before', async () => {
      const thumb = await showAndRender({ showProgressBar: true, duration: 4500 })

      // The defect: the timer started for `showProgressBar` while the template asked for a
      // messageType nobody sent, so the flag every caller reaches for drew nothing.
      expect(thumb).not.toBeNull()
    })

    it('should time the fill from the toast it belongs to', async () => {
      const thumb = await showAndRender({ showProgressBar: true, duration: 4500 })

      // Not a fixed five seconds. The old stepped timer advanced 20% per second regardless, so a
      // 4500ms toast vanished with the bar four-fifths full.
      expect(thumb?.style.animationDuration).toBe('4500ms')
    })

    it('should draw nothing without the flag', async () => {
      const thumb = await showAndRender({ duration: 4500 })

      expect(thumb).toBeNull()
    })

    it('should draw nothing for a toast that never dismisses', async () => {
      const thumb = await showAndRender({ showProgressBar: true, duration: 0 })

      // `duration: 0` keeps the toast until it is closed, so there is no deadline to count down
      // to and the bar would fill against nothing. Two presets are configured this way.
      expect(thumb).toBeNull()
    })
  })

  describe('clicking the icon block', () => {
    let host: ComponentFixture<ToastHostComponent>
    let router: { navigateByUrl: ReturnType<typeof vi.fn> }

    /**
     * Shows a toast and renders the captured template.
     * @param {Partial<NotificationConfig>} config Fields to send, merged over a minimal toast.
     * @returns {Promise<HTMLElement>} The icon block, which is the toast's click target.
     */
    const showAndRender = async (config: Partial<NotificationConfig>): Promise<HTMLElement> => {
      notificationService.show({
        message: 'Something happened',
        messageType: 'success',
        timeStamp: Date.now(),
        ...config,
      })
      fixture.detectChanges()
      await fixture.whenStable()

      const [template, options] = nzNotification.template.mock.calls.at(-1) as [
        TemplateRef<unknown>,
        { nzData: NotificationConfig },
      ]
      host.componentInstance.template.set(template)
      host.componentInstance.data.set(options.nzData)
      host.detectChanges()
      await host.whenStable()

      return (host.nativeElement as HTMLElement).querySelector<HTMLElement>('.img-container') as HTMLElement
    }

    beforeEach(() => {
      host = TestBed.createComponent(ToastHostComponent)
      router = TestBed.inject(Router) as unknown as { navigateByUrl: ReturnType<typeof vi.fn> }
      router.navigateByUrl = vi.fn()
    })

    it('should follow a routeLink whatever the messageType carrying it (#144)', async () => {
      // The trial-key toast is a `warning`, which the allowlist this replaced did not include: it
      // rendered inert with a route in hand.
      const icon = await showAndRender({ messageType: 'warning', routeLink: '/admin/license-management' })

      expect(icon.getAttribute('role')).toBe('button')
      icon.click()

      expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/license-management')
    })

    it('should follow the routeLink of a moveSuccess toast, which used to do nothing', async () => {
      // It sat on the list that draws the pointer and the focus ring, but not on the one that
      // navigates — so it advertised an action it did not have.
      const icon = await showAndRender({ messageType: 'moveSuccess', routeLink: '/task' })
      icon.click()

      expect(router.navigateByUrl).toHaveBeenCalledWith('/task')
    })

    it('should keep following the routeLink of the redirect toasts already in use', async () => {
      const icon = await showAndRender({ messageType: 'externalRedirection', routeLink: '/task-detail/7' })
      icon.click()

      expect(router.navigateByUrl).toHaveBeenCalledWith('/task-detail/7')
    })

    it('should still run the dump toast callback', async () => {
      const onClick = vi.fn()
      const icon = await showAndRender({ messageType: 'dump', onClick })
      icon.click()

      expect(onClick).toHaveBeenCalledOnce()
      expect(router.navigateByUrl).not.toHaveBeenCalled()
    })

    it('should leave a toast that leads nowhere unclickable', async () => {
      const icon = await showAndRender({ messageType: 'success' })

      // Not merely inert: `pointer-events: none` means the click never arrives, so the pointer and
      // the focus ring have to agree with that or they promise something that cannot happen.
      expect(icon.getAttribute('role')).toBeNull()
      expect(icon.getAttribute('tabindex')).toBe('-1')

      icon.click()
      expect(router.navigateByUrl).not.toHaveBeenCalled()
    })
  })
})
