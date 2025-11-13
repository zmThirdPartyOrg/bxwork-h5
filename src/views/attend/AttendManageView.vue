<template>
  <HorView class="">
    <template #right>
      <FilterIconButton path="/attend/manage/filter" :query-params="queryParams" />
    </template>

    <ProSearch placeholder="请输入姓名" :model-value="userName" @search="handleSearch" />

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
        @del="handleDel(index, item)"
      />
    </HorScroll>
    <HorFixedActions>
      <VanButton class="c-button" type="primary" @click="$router.push('/attend/manage/form')"
        >新增打卡</VanButton
      >
    </HorFixedActions>
  </HorView>
</template>

<script setup lang="ts">
  import { sleep } from '@pkstar/utils'
  import { useKeepAlive, useKeepPosition, usePaging } from '@pkstar/vue-use'
  import { showConfirmDialog, showToast } from 'vant'

  import { doAssignDelAttend, reqAttendManageList } from '@/api'
  import { useProSearch } from '@/components'
  import { onBeforeMountOrActivated, useQueryParamsRefresh } from '@/hooks'
  import type { AttendManageItem } from '@/types'
  import { refreshTrap, withLoading } from '@/utils'

  import AttendManageCell from './components/AttendManageCell.vue'

  useKeepAlive()
  useKeepPosition({
    getTarget: () => document.querySelector(`.attend-manage-scroll`)!,
  })

  const [userName, handleSearch] = useProSearch(() => pagingRefresh(true))
  // 筛选
  const queryParams = useQueryParamsRefresh((loading) => pagingRefresh(loading))

  // 分页 hooks
  const { pagingData, pagingRefresh, pagingLoad, pagingFinished, pagingStatus } = usePaging(
    async ([pageindex, pagesize], {}) => {
      const content = await reqAttendManageList({
        pageindex,
        pagesize,
        userName: userName.value,
        ...queryParams.value,
      })
      return [content, 9999]
    },
    {
      immediate: false,
    },
  )

  // 删除
  const handleDel = async (index: number, item: AttendManageItem) => {
    console.log(index, item)
    await showConfirmDialog({
      message: `确认删除${item.username} ${item.date} ${item.time}的${item.type}打卡吗？`,
    })

    await withLoading(doAssignDelAttend)({ attendId: item.id })
    sleep(1000)
    pagingData.value.splice(index, 1)
    showToast('删除成功' + index)
  }

  onBeforeMountOrActivated(() => {
    refreshTrap.create(pagingRefresh)
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
