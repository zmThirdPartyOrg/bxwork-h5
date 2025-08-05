import type { ProSchemaFormField } from '@/components'
import { selectDepTrap } from '@/utils'
import { onBeforeMountOrActivated } from './onBeforeMountOrActivated'
import { isBoolean } from '@pkstar/utils'

export function useDepField(options: boolean | Partial<ProSchemaFormField> = false) {
  if (isBoolean(options)) {
    options = options ? { rules: [{ required: true, message: '请选择部门' }] } : {}
  }
  const { props = {}, ...rest } = options

  const filed = reactive<ProSchemaFormField>({
    label: '部门',
    value: '',
    defaultValue: () => '',
    is: 'HorCellPicker',
    to: '/dep/lift',
    props: {
      placeholder: '请选择部门',
      alignItemCenter: true,
      style: 'text-align: center',
      ...props,
    },
    ...rest,
  })

  onBeforeMountOrActivated(() => {
    selectDepTrap.create((data) => {
      filed.value = data.depName
    })
  })

  return filed
}
