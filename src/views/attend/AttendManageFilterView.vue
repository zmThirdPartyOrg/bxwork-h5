<template>
  <HorView>
    <ProSkeleton v-if="!data" :loading="loading" :error="error" @refresh="trigger" />

    <template v-else>
      <ProSchemaForm :metadata="metadata" />

      <ProEndDivider />

      <div class="c-fixed-bottom is-write">
        <div class="is-button-group">
          <VanButton class="c-button is-w125 is-transparent" plain @click="handleReset">
            重置
          </VanButton>
          <VanButton class="c-button" type="primary" @click="handleConfirm"> 确定 </VanButton>
        </div>
      </div>
    </template>
  </HorView>
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@pkstar/vue-use'

  import { useQueryParamsWithFilter } from '@/hooks'

  const { loading, error, data, trigger } = useAsyncTask(
    async () => {
      return true
    },
    {
      immediate: true,
    },
  )

  const [metadata, handleConfirm, handleReset] = useQueryParamsWithFilter(() => {
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    const day = new Date().getDate()

    const minDate = new Date(year - 5, month, day)
    const maxDate = new Date(year + 1, month, day)

    return {
      dealTime: {
        is: 'HorDateRangePicker',
        label: '下单日期',
        value: [],
        minDate,
        maxDate,
        get: (v) => {
          const [orderDateStart = '', orderDateEnd = ''] = v
          return {
            orderDate: v,
            orderDateStart,
            orderDateEnd,
          }
        },
      },
      auctionTypeStr: {
        is: 'HorCheckboxButton',
        label: '拍卖类型',
        value: [],
        get: (v) => v.join(','),
        set: (s, f) => (f.value = s.auctionTypeStr ? s.auctionTypeStr.split(',') : []),
        props: {
          direction: 'column',
        },
      },
    }
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;

  .c-fixed-bottom {
    background-color: #fff;
  }
</style>
