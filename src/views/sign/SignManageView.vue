<template>
  <HorView class="" :use-left-event="false" @left="goBack">
    <template #right>
      <FilterIconButton class="filter-btn" path="/attend/manage/filter" :query-params="queryParams">
      </FilterIconButton>
    </template>

    <ProSearch placeholder="请输入姓名" :model-value="keyword" @search="handleSearch" />

    <!-- 使用日期快捷筛选组件 -->
    <DateQuickFilter v-model="selectedDateRange" @dateChange="handleDateRangeChange" />

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
      <SignManageCell
        applyType="assign"
        :item="item"
        v-for="(item, index) in pagingData"
        :key="index"
        @del="handleDel(index, item)"
      />
    </HorScroll>
    <HorFixedActions v-if="isLeader">
      <VanButton class="c-button" type="primary" @click="$router.push('/sign/manage/form')"
        >新增签到</VanButton
      >
    </HorFixedActions>
  </HorView>
</template>

<script setup lang="ts">
  import { sleep } from '@pkstar/utils'
  import { useKeepAlive, useKeepPosition, usePaging } from '@pkstar/vue-use'
  import { showConfirmDialog, showToast } from 'vant'

  import { doAssignDelAttend, reqSignManageList } from '@/api'
  import { useProSearch } from '@/components'
  import { onBeforeMountOrActivated, useQueryParamsRefresh } from '@/hooks'
  import { useUserinfoStore } from '@/stores'
  import type { AttendManageItem } from '@/types'
  import { goBack, refreshTrap } from '@/utils'

  import SignManageCell from './components/SignManageCell.vue'

  useKeepAlive()
  useKeepPosition({
    getTarget: () => document.querySelector(`.attend-manage-scroll`)!,
  })

  const { userinfo } = useUserinfoStore()
  const isLeader = computed(() => userinfo?.content.isLeader === 'Y')

  // 日期筛选相关
  const selectedDateRange = ref<string>('')
  const startDate = ref<string>('')
  const endDate = ref<string>('')

  // 处理日期范围变化
  const handleDateRangeChange = (start: string, end: string) => {
    startDate.value = start
    endDate.value = end
    pagingRefresh(true)
  }

  const [keyword, handleSearch] = useProSearch(() => {
    pagingRefresh(true)
  })
  // 筛选
  const queryParams = useQueryParamsRefresh((loading) => {
    // 优先取手选日期
    if (queryParams.value.fromDate) {
      selectedDateRange.value = ''
      startDate.value = ''
      endDate.value = ''
    }
    pagingRefresh(loading)
  })

  // 分页 hooks
  const { pagingData, pagingRefresh, pagingLoad, pagingFinished, pagingStatus } = usePaging(
    async ([pageindex, pagesize], {}) => {
      const content = await reqSignManageList({
        pageindex,
        pagesize,
        userName: keyword.value,
        ...queryParams.value,
        // 只在有值时传递日期参数
        ...(startDate.value ? { fromDate: startDate.value } : {}),
        ...(endDate.value ? { toDate: endDate.value } : {}),
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
      message: `确认删除【<strong class="c-text-primary">${item.createBy} ${item.attendTime}签到</strong>】吗？`,
      allowHtml: true,
    })
    await doAssignDelAttend({ attendId: item.attendId })
    sleep(1000)
    pagingData.value.splice(index, 1)
    showToast('删除成功')
  }

  onBeforeMountOrActivated(() => {
    refreshTrap.create(pagingRefresh)
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
