import type { ExtractPropTypes, PropType } from 'vue'
import type { ProSchemaFormMetadata } from '../ProSchemaForm'

export const proSchemaFilterPopupProps = {
  metadata: {
    type: Object as PropType<ProSchemaFormMetadata>,
    default: () => ({}),
  },
  reset: {
    type: Function as PropType<() => ProSchemaFormMetadata | Promise<ProSchemaFormMetadata>>,
  },
}

export type ProSchemaFilterPopupProps = ExtractPropTypes<typeof proSchemaFilterPopupProps>
