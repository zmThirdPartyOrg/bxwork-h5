<template>
  <ProSearch :model-value="keyword" @search="handleSearch" />
  <!-- 刷新 下拉加载 -->
  <HorScroll
    ref="containerRef"
    :class="['tab-content-' + type]"
    :list-disabled="pagingStatus.pagingTotal <= 0"
    :pull-disabled="pagingStatus.pagingTotal <= 0"
    :finished="pagingFinished"
    @refresh="pagingRefresh"
    @load="pagingLoad"
  >
    <!-- 骨架屏 -->
    <ProSkeleton
      v-if="pagingStatus.pagingTotal <= 0"
      v-model:error="pagingStatus.pagingError"
      :loading="pagingStatus.pagingLoading"
      @refresh="pagingRefresh"
    />
    <ApplyCell applyType="done" :item="item" v-for="item in pagingData" :key="item.approveId" />
  </HorScroll>
</template>

<script setup lang="ts">
  import { reqApplyList } from '@/api'
  import { usePaging } from '@pkstar/vue-use'
  import ApplyCell from '@/components/ApplyCell.vue'
  import { useProSearch } from '@/components'

  const [keyword, handleSearch] = useProSearch(() => pagingRefresh(true))

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  })

  // 分页 hooks
  const { pagingData, pagingRefresh, pagingLoad, pagingFinished, pagingStatus } =
    // eslint-disable-next-line vue/no-setup-props-destructure
    usePaging(
      async ([pageindex, pagesize], { loading }) => {
        const content = await reqApplyList({
          pageindex,
          pagesize,
          applyType: 'done',
          auditStatus: props.type,
          title: keyword.value,
        })
        return [content, 99]
      },
      {
        immediate: true,
        scrollSelector: `.tab-content-${props.type}`,
      },
    )

  defineExpose({
    pagingRefresh,
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
