<template>
  <HorView class="" :use-left-event="false" @left="goBack">
    <ProSearch :model-value="keyword" @search="handleSearch" />

    <!-- 批量操作按钮 -->
    <template #right>
      <VanButton
        size="small"
        class="batch-btn"
        icon="completed-o"
        type="primary"
        round
        @click="handleBatchApproval"
        >批量操作({{ selected.length }})</VanButton
      >
    </template>

    <!-- 刷新 下拉加载 -->
    <HorScroll
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
        :checked="isSelected(item)"
        @select="handleSelect(item)"
        :with-checkbox="true"
        v-for="(item, index) in pagingData"
        :key="index"
      />
    </HorScroll>
    <HorFixedActions>
      <!-- <VanButton class="c-button" v-if="userinfo?.content.userId === 764" @click="handleTest">
        <input type="text" v-model="_localHost" />
        {{ userinfo?.content.userId }}
      </VanButton> -->
      <VanButton class="c-button" type="primary" @click="$router.push('/assign/overtime/form')"
        >新增指派加班</VanButton
      >
    </HorFixedActions>

    <BatchApprovalDialog ref="batchApprovalDialogInstance" />
  </HorView>
</template>

<script setup lang="ts">
  import { useKeepAlive, useKeepPosition, usePaging } from '@pkstar/vue-use'
  import { ref } from 'vue'

  import { reqAssignOvertimeList } from '@/api'
  import { useProSearch } from '@/components'
  import { onBeforeMountOrActivated } from '@/hooks'
  import { useUserinfoStore } from '@/stores'
  import type { AssignOvertimeItem } from '@/types'
  import { applyListTrap, goBack } from '@/utils'

  import AssignApplyCell from './components/AssignApplyCell.vue'
  import BatchApprovalDialog from './components/BatchApprovalDialog.vue'

  const batchApprovalDialogInstance = ref<InstanceType<typeof BatchApprovalDialog> | null>(null)

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

      return [content, content.length < pagesize ? 1 : 999]
    },
    {
      immediate: true,
    },
  )

  const _localHost = ref('http://10.50.105.179:10086/')
  const handleTest = () => {
    window.location.href = `${_localHost.value}#/work`
    console.log('handleTest')
  }
  onBeforeMountOrActivated(() => {
    applyListTrap.create(pagingRefresh.bind(this, true))
  })

  // 选择功能
  const selected = ref<AssignOvertimeItem[]>([])

  const isSelected = (item: AssignOvertimeItem) => {
    return selected.value.some((selectedItem) => selectedItem.approvalId === item.approvalId)
  }

  const handleSelect = (item: AssignOvertimeItem) => {
    const index = selected.value.findIndex(
      (selectedItem) => selectedItem.approvalId === item.approvalId,
    )
    if (index > -1) {
      // 如果已选中，则取消选择
      selected.value.splice(index, 1)
    } else {
      // 如果未选中，则添加到选择列表
      // 限制最多选择20个
      if (selected.value.length >= 20) {
        throw '单次最多可审批20人'
      }
      selected.value.push(item)
    }
  }

  // 清空选择
  const clearSelected = () => {
    selected.value = []
  }

  // 批量审批
  const handleBatchApproval = async () => {
    // 检查是否有选中项
    if (!selected.value.length) {
      throw '请选择要审批的项'
    }

    try {
      await batchApprovalDialogInstance.value?.show({
        selected: selected.value,
      })

      // 清空已选
      clearSelected()

      // 刷新列表
      pagingRefresh(true)
    } catch (error) {
      console.error('批量审批失败:', error)
    }
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
