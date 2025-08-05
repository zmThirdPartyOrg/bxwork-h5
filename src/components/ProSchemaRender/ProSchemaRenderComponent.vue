<template>
  <Component
    v-for="(item, index) in metadata"
    v-bind="omit(item, ['children', 'is', 'fn', 'to'])"
    v-model="item.value"
    :disabled="!!item.disabled"
    :is="item.is"
    :key="index"
    @click.stop="handleTransfer(item)"
  >
    <ProSchemaRenderComponent v-if="item.children?.length" :metadata="item.children">
      <template v-for="key in Object.keys($slots)" :key="key" #[key]="data: any">
        <slot :name="key" v-bind="data" />
      </template>
    </ProSchemaRenderComponent>
    <template v-for="(slot, key) in item.slots" #[slot] :key="slot">
      <slot :name="key" :item="item" />
    </template>
  </Component>
</template>

<script lang="ts">
  import '@daysnap/horn-ui/src/hor-cell/style'
  import '@daysnap/horn-ui/src/hor-cell-group/style'

  import { HorCell, HorCellGroup } from '@daysnap/horn-ui'
  import { omit } from '@pkstar/utils'
  import { useTransfer } from '@pkstar/vue-use'
  import ProUploader from '../ProUploader/ProUploader.vue'

  import type { ProSchemaRenderField } from './types'

  type FormatRenderMetadataFiled = Omit<ProSchemaRenderField, 'children'> & {
    children: FormatRenderMetadataFiled[]
  }

  export default defineComponent({
    name: 'ProSchemaRenderComponent',
    props: {
      metadata: {
        type: Array as PropType<FormatRenderMetadataFiled[]>,
        default: () => [],
      },
    },
    setup() {
      const handleTransfer = useTransfer()

      return {
        omit,
        handleTransfer,
      }
    },
    components: {
      HorCell,
      HorCellGroup,
      ProUploader,
    },
  })
</script>
