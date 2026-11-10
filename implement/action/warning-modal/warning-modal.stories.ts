import { componentWrapperDecorator, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular'
import { fn } from 'storybook/test'
import { SCCButtonComponent } from '../button/button/button.component'
import { SCCWarningModalComponent } from './warning-modal.component'
import type { SCCWarningModalIcon } from './warning-modal.interface'

// Story metadata
export default {
  title: 'Design System/Global Component/Warning Modal',
  component: SCCWarningModalComponent,
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
    scOnCancel: {
      action: 'clicked',
    },
  },
  args: {
    scOnCancel: fn(function () {
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
} as Meta<SCCWarningModalComponent>

// Stories
type Story = StoryObj<SCCWarningModalComponent>

const basicUsageCode = `
<scc-button (scClick)="isOpenModal = true" scLabel="Open Modal"></scc-button>
@if (isOpenModal) {
  <scc-warning-modal (scOnCancel)="isOpenModal = false"></scc-warning-modal>
}`

const customWordingCode = `
<scc-button (scClick)="isOpenModal = true" scLabel="Open Modal"></scc-button>
@if (isOpenModal) {
  <scc-warning-modal
    scTitle="Select Outlet"
    scDescription="Please select outlet by checkbox to perform the action."
    (scOnCancel)="isOpenModal = false"
  ></scc-warning-modal>
}`

const customIcon: SCCWarningModalIcon = {
  src: 'assets/design-system/icons/fail.svg',
  color: 'var(--status-dark-red-1)',
}

const customIconCode = `
<scc-button (scClick)="isOpenModal = true" scLabel="Open Modal"></scc-button>
@if (isOpenModal) {
  <scc-warning-modal
    [scIcon]="{
      src: 'assets/design-system/icons/critical.svg',
      color: 'var(--status-dark-red-1)'
    }"
    scTitle="Critical Warning"
    scDescription="Please review the critical status before continuing."
    (scOnCancel)="isOpenModal = false"
  ></scc-warning-modal>
}`

export const BasicUsage: Story = {
  parameters: {
    docs: {
      source: { code: basicUsageCode, language: 'html', type: 'auto' },
    },
  },
}

export const CustomWording: Story = {
  args: {
    scTitle: 'Select Outlet',
    scDescription: 'Please select outlet by checkbox to perform the action.',
  },
  parameters: {
    docs: {
      source: { code: customWordingCode, language: 'html', type: 'auto' },
    },
  },
}

export const CustomIcon: Story = {
  args: {
    scIcon: customIcon,
    scTitle: 'Critical Warning',
    scDescription: 'Please review the critical status before continuing.',
  },
  parameters: {
    docs: {
      source: { code: customIconCode, language: 'html', type: 'auto' },
    },
  },
}
