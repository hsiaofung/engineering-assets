import { componentWrapperDecorator, type Meta, type StoryObj } from '@storybook/angular'
import { InfoTooltipComponent } from './info-tooltip.component'

export default {
  title: 'Design System/Global Component/B035 -Tooltip/Info Tooltip',
  id: 'a020351',
  component: InfoTooltipComponent,
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="padding:60px; display:flex; gap:24px; align-items:center;">${story}</div>`,
    ),
  ],
  argTypes: {
    dsTooltipTitle: { type: 'string', description: 'Tooltip content text or TemplateRef.' },
    dsTooltipPlacement: {
      options: [
        'topLeft',
        'top',
        'topRight',
        'leftTop',
        'left',
        'leftBottom',
        'rightTop',
        'right',
        'rightBottom',
        'bottomLeft',
        'bottom',
        'bottomRight',
      ],
      control: { type: 'select' },
      description: 'Position of the tooltip overlay.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'An info icon with a tooltip overlay powered by Ng-Zorro Tooltip. Hover to display contextual information.',
      },
    },
  },
} as Meta<InfoTooltipComponent>

type Story = StoryObj<InfoTooltipComponent>

export const Default: Story = {
  args: {
    dsTooltipTitle: 'This is a tooltip message',
    dsTooltipPlacement: 'top',
  },
}

export const BottomPlacement: Story = {
  args: {
    dsTooltipTitle: 'Tooltip at bottom',
    dsTooltipPlacement: 'bottom',
  },
}

export const RightPlacement: Story = {
  args: {
    dsTooltipTitle: 'Tooltip at right',
    dsTooltipPlacement: 'right',
  },
}

export const LongText: Story = {
  args: {
    dsTooltipTitle:
      'This is a longer tooltip message that demonstrates how the component handles more text content in the tooltip overlay.',
    dsTooltipPlacement: 'top',
  },
}
