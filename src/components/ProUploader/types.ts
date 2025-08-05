import { horCellProps } from '@daysnap/horn-ui/src/hor-cell/types'
import { omit } from '@pkstar/utils'
import type { PropType } from 'vue'

type ModelValue = Array<{
  filename: string
  id: number
  url: string
}>
type CropType = Array<number> | false
export const omitHorCellPropsInUploader = {
  ...omit(horCellProps, ['value', 'direction']),
  disabled: {
    type: Boolean,
    default: false,
  },
  direction: {
    type: String as PropType<'row' | 'column'>,
    default: 'column',
  },
  modelValue: {
    type: Array as PropType<ModelValue>,
    default: () => [],
  },
  maxCount: {
    type: Number,
    default: 1,
  },
  // 裁剪比例
  crop: {
    type: [Array, Boolean] as PropType<CropType>,
    default: false,
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false,
  },
  // 是否加水印
  waterMark: {
    type: Boolean,
    default: false,
  },
  upload: {
    type: [Boolean, Function] as PropType<false | Function>,
    default: false,
  },
  sizeType: {
    type: String as PropType<'original' | 'compressed'>,
    default: 'compressed',
  },
  // 选择图片来源
  sourceType: {
    type: String as PropType<'camera' | 'album' | 'all'>,
  },
  // 在点击时是否需要拦截操作
  beforeUpload: {
    type: Function,
    default: () => {},
  },
  defaultImg: {
    type: String,
    default: '',
  },
  // 数据为空时的兜底图
  emptyImg: {
    type: String,
    default: '',
  },
  // 业务来源
  source: {
    type: String as PropType<'leave' | 'timeover' | 'attend'>,
    default: '',
  },
}
export const proUploaderProps = {
  ...omitHorCellPropsInUploader,
}
