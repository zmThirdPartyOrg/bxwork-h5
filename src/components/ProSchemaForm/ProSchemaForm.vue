<template>
  <div class="pro-schema-form">
    <HorCellGroup>
      <component
        v-for="(item, key) in computeForm"
        :key="key"
        :is="item.is"
        :label="item.label"
        :value="item.value"
        :options="item.options"
        :disabled="!!item.disabled"
        v-bind="item.props"
        v-model="item.value"
        @click="handleTransfer(item)"
        @change="$emit('field-change', { key, item })"
        @focus="$emit('field-focus', { key, item })"
        @blur="$emit('field-blur', { key, item })"
      >
        <template v-for="(slot, key) in item.slots" #[slot] :key="slot">
          <slot :name="key" :item="item" />
        </template>
      </component>
    </HorCellGroup>
  </div>
</template>

<script lang="ts">
  import '@daysnap/horn-ui/src/hor-cell/style'
  import '@daysnap/horn-ui/src/hor-cell-picker/style'
  import '@daysnap/horn-ui/src/hor-field/style'
  import '@daysnap/horn-ui/src/hor-checkbox/style'
  import '@daysnap/horn-ui/src/hor-radio/style'
  import '@daysnap/horn-ui/src/hor-date-picker/style'
  import '@daysnap/horn-ui/src/hor-license-plate/style'
  import '@daysnap/horn-ui/src/hor-textarea/style'
  import '@daysnap/horn-ui/src/hor-checkbox-button/style'
  import '@daysnap/horn-ui/src/hor-radio-button/style'
  import '@daysnap/horn-ui/src/hor-date-range-picker/style'
  import '@daysnap/horn-ui/src/hor-select-popup/style'
  import '@daysnap/horn-ui/src/hor-tree-select-popup/style'
  import '@daysnap/horn-ui/src/hor-select-picker/style'
  import '@daysnap/horn-ui/src/hor-uploader/style'

  import { ProUploader } from '../ProUploader'
  import type { MetaDataObject } from '@pkstar/banana'
  import {
    HorCell,
    HorCellGroup,
    HorCellPicker,
    HorCheckbox,
    HorCheckboxButton,
    HorDatePicker,
    HorDateRangePicker,
    HorField,
    HorLicensePlate,
    HorRadio,
    HorRadioButton,
    HorSelectPicker,
    HorSelectPopup,
    HorTextarea,
    HorTreeSelectPopup,
    HorUploader,
  } from '@daysnap/horn-ui'
  import { isFunction } from '@daysnap/utils'
  import { useTransfer } from '@pkstar/vue-use'
  import { type PropType } from 'vue'

  import type { ProSchemaFormMetadata } from './types'

  export default defineComponent({
    name: 'ProSchemaForm',
    emits: ['field-change', 'field-focus', 'field-blur'],
    props: {
      metadata: {
        type: Object as PropType<ProSchemaFormMetadata>,
        default: () => ({}),
      },
    },
    setup(props) {
      const handleTransfer = useTransfer()

      const loop = (data: any) =>
        Object.keys(data).reduce<MetaDataObject>((res, key) => {
          const item = data[key]
          let hidden = item.hidden
          if (isFunction(hidden)) {
            hidden = hidden(item.value, item, props.metadata)
          }
          if (!hidden) {
            res[key] = item
          }

          item.props = Object.assign(item.props || {}, {
            required: !!item?.rules?.find((item: any) => item.required),
          })
          return res
        }, {})

      const computeForm = computed(() => {
        return loop(props.metadata)
      })

      return {
        computeForm,
        handleTransfer,
      }
    },
    components: {
      HorField,
      HorCheckbox,
      HorRadio,
      HorDatePicker,
      HorCell,
      HorLicensePlate,
      HorTextarea,
      HorCellPicker,
      HorCheckboxButton,
      HorRadioButton,
      HorDateRangePicker,
      HorSelectPopup,
      HorTreeSelectPopup,
      HorSelectPicker,
      HorCellGroup,
      HorUploader,
      ProUploader,
    },
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .pro-schema-form {
    @extend %w100;
  }
</style>
