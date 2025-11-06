<template>
  <HorView class="">
    <template #right>
      <FilterIconButton class="filter-btn" path="/attend/manage/filter" :query-params="queryParams">
      </FilterIconButton>
    </template>

    <ProSearch placeholder="请输入姓名" :model-value="keyword" @search="handleSearch" />

    <!-- 刷新 下拉加载 -->
    <HorScroll
      class="attend-manage-scroll"
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
      <AttendManageCell
        applyType="assign"
        :item="item"
        v-for="(item, index) in pagingData"
        :key="index"
      />
    </HorScroll>
  </HorView>
</template>

<script setup lang="ts">
  import { useKeepAlive, useKeepPosition, usePaging } from '@pkstar/vue-use'

  import { reqAttendManageList } from '@/api'
  import { useProSearch } from '@/components'
  import { useQueryParamsRefresh } from '@/hooks'

  import AttendManageCell from './components/AttendManageCell.vue'

  useKeepAlive()
  useKeepPosition({
    getTarget: () => document.querySelector(`.attend-manage-scroll`)!,
  })

  const [keyword, handleSearch] = useProSearch(() => pagingRefresh(true))
  // 筛选
  const queryParams = useQueryParamsRefresh(() => pagingRefresh(true))

  // 分页 hooks
  const { pagingData, pagingRefresh, pagingLoad, pagingFinished, pagingStatus } = usePaging(
    async ([pageindex, pagesize], {}) => {
      const content = await reqAttendManageList({
        pageindex,
        pagesize,
        keyword,
        ...queryParams.value,
      } as any)
      return [content, 9999]
    },
    {
      immediate: true,
    },
  )
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
