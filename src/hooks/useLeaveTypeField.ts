import type { ProSchemaFormField } from '@/components'
import { selectLeaveTrap } from '@/utils'
import { onBeforeMountOrActivated } from './onBeforeMountOrActivated'
import { isBoolean } from '@pkstar/utils'
import type { SysConfigDict } from '@/types'

export function useLeaveTypeField(options: boolean | Partial<ProSchemaFormField> = false) {
  if (isBoolean(options)) {
    options = options ? { rules: [{ required: true, message: '请选择请假类型' }] } : {}
  }
  const { props = {}, ...rest } = options

  console.log('propspropspropsprops', props)
  const filed = reactive<ProSchemaFormField>({
    label: '请假类型',
    value: '',
    defaultValue: () => '',
    is: 'HorCellPicker',
    to: '/leave/lift',
    props: {
      placeholder: '请选择请假类型',
      alignItemCenter: true,
      style: 'text-align: center',
      formatter: (value: SysConfigDict) => {
        console.log('formatter', value)
        return value?.longName
      },
      ...props,
    },
    get: (v: SysConfigDict) => {
      console.log('useLeaveTypeField', v)
      return {
        type: v.shortCode,
      }
    },
    ...rest,
  })

  onBeforeMountOrActivated(() => {
    selectLeaveTrap.create((data) => {
      filed.value = data
    })
  })

  return filed
}
