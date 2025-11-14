<template>
  <HorView class="" :use-left-event="false" @left="goBack">
    <ProSearch :model-value="keyword" @search="handleSearch" />
    <!-- 刷新 下拉加载 -->
    <HorScroll
      ref="containerRef"
      class="assign-overtime-scroll"
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
      <AssignApplyCell
        applyType="assign"
        :item="item"
        v-for="(item, index) in pagingData"
        :key="index"
      />
    </HorScroll>
    <HorFixedActions>
      <VanButton class="c-button" v-if="userinfo?.content.userId === 764" @click="handleTest">
        {{ userinfo?.content.userId }}
      </VanButton>
      <VanButton class="c-button" type="primary" @click="$router.push('/assign/overtime/form')"
        >新增指派加班</VanButton
      >
    </HorFixedActions>
  </HorView>
</template>

<script setup lang="ts">
  import { useKeepAlive, useKeepPosition, usePaging } from '@pkstar/vue-use'

  import { reqAssignOvertimeList } from '@/api'
  import { useProSearch } from '@/components'
  import { onBeforeMountOrActivated } from '@/hooks'
  import { useUserinfoStore } from '@/stores'
  import { applyListTrap, goBack } from '@/utils'

  import AssignApplyCell from '../components/AssignApplyCell.vue'

  useKeepAlive()
  useKeepPosition({
    getTarget: () => document.querySelector(`.assign-overtime-scroll`)!,
  })
  const { userinfo } = useUserinfoStore()

  const [keyword, handleSearch] = useProSearch(() => pagingRefresh(true))

  // 分页 hooks
  const { pagingData, pagingRefresh, pagingLoad, pagingFinished, pagingStatus } = usePaging(
    async ([pageindex, pagesize], {}) => {
      const content = await reqAssignOvertimeList({
        pageindex,
        pagesize,
        keyword: keyword.value,
        waitStatus: '',
      })
      return [content, 999]
    },
    {
      immediate: true,
    },
  )

  const handleTest = () => {
    window.location.href = 'http://10.50.105.92:10086/#/work'
    console.log('handleTest')
  }
  onBeforeMountOrActivated(() => {
    applyListTrap.create(pagingRefresh.bind(this, true))
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
