import type { ExtractPropTypes } from 'vue'

export const proSearchProps = {
  placeholder: {
    type: String,
    default: '请输入搜索关键词',
  },
  modelValue: {
    type: String,
    default: '',
  },
  actionText: {
    type: String,
    default: '搜索',
  },
  sticky: {
    type: Boolean,
    default: false,
  },
}

export type ProSearchProps = ExtractPropTypes<typeof proSearchProps>
