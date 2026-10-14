import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core'
import { provideRouter } from '@angular/router'
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular'

import { SCCButtonComponent } from '../button/button/button.component'
import { NotificationComponent } from './notification.component'
import type { NotificationConfig } from './notification.interface'
import { NotificationService } from './notification.service'

/**
 * A button and the toast host, because a toast has no props of its own.
 *
 * `NotificationComponent` is a singleton host driven by {@link NotificationService} rather than by
 * inputs — it renders whatever the service last published, through an ng-zorro overlay. So a story
 * cannot set its state directly; it has to ask for a toast the way a feature module would, which
 * is what this wrapper does. The controls below edit the payload that gets sent.
 */
@Component({
  selector: 'scc-notification-story-host',
  imports: [NotificationComponent, SCCButtonComponent],
  template: `
    <scc-button scSize="large" scLabel="Show toast" (scClick)="show()"></scc-button>
    <scc-notification />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class NotificationStoryHostComponent {
  private readonly notificationService = inject(NotificationService)

  readonly message = input('Processing Request')
  readonly subMessage = input('')
  readonly messageType = input('success')
  readonly duration = input(3000)
  readonly showProgressBar = input(false)

  /**
   * Publishes the configured toast, exactly as a feature module would.
   * @returns {void}
   */
  protected show(): void {
    this.notificationService.show({
      message: this.message(),
      subMessage: this.subMessage(),
      messageType: this.messageType(),
      duration: this.duration(),
      showProgressBar: this.showProgressBar(),
    } satisfies NotificationConfig)
  }
}

/**
 * The app-wide toast host. One instance lives in Main Layout; features publish through
 * `NotificationService.show()` and never render this themselves.
 *
 * **The toast is transient by design**, so these stories are interactive rather than static: press
 * the button to raise one. A visual-regression snapshot will usually catch the page *without* a
 * toast, which is the honest outcome — there is no state in which one is permanently on screen
 * except `duration: 0`, and that variant deliberately has no progress bar.
 */
export default {
  title: 'Design System/Global Component/Notification',
  component: NotificationStoryHostComponent,
  decorators: [applicationConfig({ providers: [provideRouter([])] })],
  argTypes: {
    message: { control: 'text', description: 'Headline.' },
    subMessage: { control: 'text', description: 'Second line. Omitted when empty.' },
    messageType: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info', 'dump', 'refresh', 'externalRedirection'],
      description: 'Chooses the icon, and whether the toast is clickable.',
    },
    duration: {
      control: { type: 'number', step: 500 },
      description: 'Milliseconds before the toast dismisses itself. `0` keeps it until closed.',
    },
    showProgressBar: {
      control: 'boolean',
      description: 'Draws a bar counting down to dismissal. Ignored when `duration` is `0`.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Publish a toast with `NotificationService.show()`. The host is mounted once in Main Layout — a feature never renders it. `messageType` selects the icon through `ICON_NAME_MAPPING` and decides whether clicking the body does anything.',
      },
    },
  },
} as Meta<NotificationStoryHostComponent>

type Story = StoryObj<NotificationStoryHostComponent>

/** An ordinary toast: icon, message, and it dismisses itself. */
export const Default: Story = {
  args: {
    message: 'Saved successfully',
    messageType: 'success',
    duration: 3000,
  },
}

/**
 * The bar's fill is timed from `duration`, so it empties exactly as the toast leaves. Change
 * `duration` in the controls and the animation follows it.
 */
export const WithProgressBar: Story = {
  args: {
    message: 'Processing Request',
    subMessage: 'This toast includes a progress bar.',
    messageType: 'success',
    duration: 3000,
    showProgressBar: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Until #126 this drew nothing at all: the timer started for `showProgressBar` while the template rendered the bar for a `messageType` no caller sent. The bar was also stepped by a fixed 20% per second, so it took five seconds regardless of the toast it belonged to. Both are now the same number.',
      },
    },
  },
}

/**
 * `duration: 0` keeps the toast until it is closed, so there is no deadline to count down to and
 * the bar is deliberately suppressed even though the flag is set.
 */
export const ProgressBarSuppressedWithoutADeadline: Story = {
  args: {
    message: 'Awaiting your response',
    subMessage: 'This toast stays until you close it, so it has no progress bar.',
    messageType: 'info',
    duration: 0,
    showProgressBar: true,
  },
}
