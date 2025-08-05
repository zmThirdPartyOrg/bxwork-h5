<template>
  <VanDialog
    class="sign-popup"
    v-model:show="visible"
    title="请输入签到备注"
    show-cancel-button
    @confirm="confirm"
    @cancel="hide"
    width="94%"
  >
    <ProSchemaForm class="pro-schema-filter-form" :metadata="fields" />
  </VanDialog>
</template>

<script setup lang="ts">
  import { useVisible } from '@pkstar/vue-use'
  import { useProSchemaForm } from './ProSchemaForm'
  import { useLocationField } from '@/hooks'
  import banana from '@pkstar/banana'
  import type { GetLocationByBMapResult } from '@pkstar/horn-jssdk'

  const fields = useProSchemaForm({
    remark: {
      is: 'HorTextarea',
      value: '',
      defaultValue: () => '',
      props: {
        direction: 'column',
        placeholder: '请输入备注',
      },
    },
    locationName: useLocationField({}),
    fileIds: {
      value: [],
      defaultValue: () => [],
      is: 'ProUploader',
      props: {
        label: '图片附件',
        maxCount: 4,
        direction: 'column',
        source: 'attend',
      },
      get: (values: any) => {
        return values.map((item: any) => item.id).join(',')
      },
    },
  })

  const reset = () => {
    for (const key in fields) {
      const item = fields[key]
      item.value = item.defaultValue?.()
    }
  }

  const { visible, show, hide, confirm } = useVisible<
    any,
    { remark: string; locationName: string; fileIds: string }
  >({
    showCallback: async (options: GetLocationByBMapResult) => {
      console.log('optionsoptionsoptionsoptionsoptions=>', options)
      fields.locationName.value = options.poi || options.address
      fields.locationName.to = `/location/lift?longitude=${options.longitude}&latitude=${options.latitude}`
    },
    confirmCallback: () => {
      const options = banana.validate(fields)
      reset()
      return options
    },
  })

  defineExpose({
    show,
    hide,
    confirm,
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  :deep() {
    .hor-cell.is-row .hor-cell-value span {
      text-align: left;
    }
    // .van-dialog__content {
    //   height: j(350);
    //   overflow: auto;
    // }
  }
</style>
