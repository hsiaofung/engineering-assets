import { componentWrapperDecorator, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular'
import { fn } from 'storybook/test'
import { SCCButtonComponent } from '../button/button/button.component'
import { SCCButtonType } from '../button/button/button.interface'
import { SCCMessageType } from '../message/message.interface'
import { SCModalSizeEnum } from '../modal/modal.interface'
import { SCCConfirmModalComponent } from './confirm-modal.component'

// Story metadata
export default {
  title: 'Design System/Global Component/Confirm Modal',
  component: SCCConfirmModalComponent,
  decorators: [
    moduleMetadata({
      imports: [SCCButtonComponent],
    }),
    componentWrapperDecorator(
      (story) => `
      <scc-button (scClick)="isOpenModal = true" scLabel="Open Modal"></scc-button>
      @if (isOpenModal) {
        ${story}
      }
      `,
    ),
  ],
  argTypes: {
    isOpenModal: {
      table: {
        disable: true,
      },
      type: 'boolean',
      defaultValue: false,
    },
    scModalSize: {
      type: 'string',
      options: Object.values(SCModalSizeEnum).filter((x) => typeof x === 'string'),
      mapping: SCModalSizeEnum,
      control: {
        type: 'select',
      },
    },
    scOnCancel: {
      action: 'clicked',
    },
    scOnSubmit: {
      action: 'clicked',
    },
  },
  args: {
    scOnCancel: fn(function () {
      this.isOpenModal = false
    }),
    scOnSubmit: fn(function () {
      this.isOpenModal = false
    }),
  },
  parameters: {
    docs: {
      description: {
        component: 'A dialog component used for confirming deletion operations.',
      },
    },
  },
} as Meta<SCCConfirmModalComponent>

// Stories
type Story = StoryObj<SCCConfirmModalComponent>

export const BasicUsage: Story = {
  args: {
    scData: ['Item 1', 'Item 2', 'Item 3'],
  },
}

export const ShortMessage: Story = {
  args: {
    scTitle: 'Confirm Deletion',
    scLabel: 'Are you sure you want to delete?',
    scData: ['Server A'],
  },
}

export const WithCautionMessage: Story = {
  args: {
    scTitle: 'Confirm Deletion',
    scLabel: 'The following objects will be deleted:',
    scMessageConfig: {
      message: 'You are about to delete multiple items. This action cannot be undone!',
      type: SCCMessageType.caution,
    },
    scData: ['File 1', 'File 2'],
  },
}

export const LargeDialogSize: Story = {
  args: {
    scTitle: 'Confirm Batch Deletion',
    scLabel: 'Items to be deleted:',
    scData: ['Server A', 'Server B', 'Server C', 'Server D', 'Server E'],
    scModalSize: SCModalSizeEnum.small,
  },
}

export const LongScrollableList: Story = {
  args: {
    scTitle: 'Delete User',
    scLabel: 'Would you like to delete the selected item(s)?',
    scMessageConfig: {
      message:
        'External accounts may be re-created automatically on next login. To permanently block access, use Disable instead of Delete.',
      type: SCCMessageType.reminder,
    },
    scData: Array.from({ length: 40 }, (_, index) => `account-user-${index + 1}`),
    scButtonConfig: {
      label: 'Delete',
      type: SCCButtonType.critical,
    },
  },
}
