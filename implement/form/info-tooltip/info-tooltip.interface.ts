import { NzTSType } from 'ng-zorro-antd/core/types'

export interface DSTooltip {
  dsTooltipTitle: NzTSType
  dsTooltipPlacement: string
}

export type DsTooltipPlacement =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'leftTop'
  | 'left'
  | 'leftBottom'
  | 'rightTop'
  | 'right'
  | 'rightBottom'
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight'
