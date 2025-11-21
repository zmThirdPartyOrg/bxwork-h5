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
    <ApplyCell applyType="wait" :item="item" v-for="item in pagingData" :key="item.approveId" />
  </HorScroll>
</template>

<script setup lang="ts">
  import { usePaging } from '@pkstar/vue-use'

  import { reqApplyList } from '@/api'
  import { useProSearch } from '@/components'
  import ApplyCell from '@/components/ApplyCell.vue'

  const [keyword, handleSearch] = useProSearch(() => pagingRefresh(true))
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
    },
  })

  // 分页 hooks
  const { pagingData, pagingRefresh, pagingLoad, pagingFinished, pagingStatus } = usePaging(
    async ([pageindex, pagesize], { loading }) => {
      const content = await reqApplyList({
        pageindex,
        pagesize,
        applyType: 'wait',
        waitStatus: props.type,
        title: keyword.value,
      })
      return [content, content.length < pagesize ? 1 : 999]
    },
    {
      immediate: true,
      scrollSelector: `.tab-content-${props.type}`,
      initialStatus: {
        pagingSize: 20,
      },
    },
  )

  defineExpose({
    pagingRefresh,
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
