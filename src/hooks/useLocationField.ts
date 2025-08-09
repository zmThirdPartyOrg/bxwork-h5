import { isBoolean } from '@pkstar/utils'

import type { ProSchemaFormField } from '@/components'
import { locationNameTrap } from '@/utils'

import { onBeforeMountOrActivated } from './onBeforeMountOrActivated'

export function useLocationField(options: boolean | Partial<ProSchemaFormField> = false) {
  if (isBoolean(options)) {
    options = options ? { rules: [{ required: true, message: '请选择当前位置' }] } : {}
  }
  const { props = {}, ...rest } = options

  const filed = reactive<ProSchemaFormField>({
    value: '',
    defaultValue: () => '',
    is: 'HorCellPicker',
    to: '/location/lift',
    props: {
      placeholder: '请选择位置',
      alignItemCenter: true,
      style: 'text-align: center',
      ...props,
    },
    ...rest,
  })

  onBeforeMountOrActivated(() => {
    locationNameTrap.create((data) => {
      filed.value = data.title
    })
  })

  return filed
}
