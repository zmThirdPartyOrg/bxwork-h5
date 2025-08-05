import { type Field } from '@pkstar/banana'
import type { Loose } from '@daysnap/types'
import type { Raw } from 'vue'

type IS =
  | 'HorField'
  | 'HorCheckbox'
  | 'HorRadio'
  | 'HorDatePicker'
  | 'HorCell'
  | 'HorLicensePlate'
  | 'HorTextarea'
  | 'HorCellPicker'
  | 'HorCheckboxButton'
  | 'HorRadioButton'
  | 'HorDateRangePicker'
  | 'HorSelectPopup'
  | 'HorTreeSelectPopup'
  | 'HorSelectPicker'
  | 'HorCellGroup'
  | 'HorUploader'
  | 'HorTagSelect'
  | `Pro${string}`
  | `div`
  | Raw<object>

export interface ProSchemaFormField extends Field {
  is?: IS
  value?: any
  disabled?: boolean
  defaultValue?: any
  fn?: (item: ProSchemaFormField) => any
  hidden?: boolean | ((v: any, f: any, m: any) => boolean)
  props?: Loose<{
    label?: string
    direction?: 'column' | 'row'
    formatter?: (value: any) => any
  }>
  slots?: Record<string, string>
}

export type ProSchemaFormMetadata = Record<string, ProSchemaFormField>
