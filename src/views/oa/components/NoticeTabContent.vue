<template>
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
    <NoticeCell :item="item" v-for="item in pagingData" :key="item.id" />
  </HorScroll>
</template>

<script setup lang="ts">
  import { reqNoticeList } from '@/api'
  import type { NoticeItem } from '@/types'
  import { usePaging } from '@pkstar/vue-use'
  import NoticeCell from './NoticeCell.vue'

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
  const { pagingData, pagingRefresh, pagingLoad, pagingFinished, pagingStatus } =
    // eslint-disable-next-line vue/no-setup-props-destructure
    usePaging<NoticeItem>(
      async ([pageindex, pagesize], { loading }) => {
        const content = await reqNoticeList(
          { pageindex, pagesize, isRead: props.type === 'read' ? 'Y' : 'N' },
          loading,
        )
        return [content, 999]
      },
      {
        immediate: true,
        scrollSelector: `.tab-content-${props.type}`,
        initialStatus: {
          pagingSize: 20,
        },
      },
    )
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
