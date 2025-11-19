<template>
  <HorView
    use-tab-scroll
    :left-arrow="isTabbar !== '1' && $route.path !== '/todo'"
    :use-left-event="false"
    @left="goBack"
  >
    <template v-if="[0, 1].includes(active)" #right>
      <VanButton
        size="small"
        class="batch-btn"
        icon="completed-o"
        type="primary"
        round
        @click="handleBatchApproval"
        >批量审批({{ tabContentRefs[active]?.selected.length }})</VanButton
      >
    </template>
    <VanTabs @change="tabChange" v-model:active="active" sticky>
      <VanTab :title="item.name" v-for="(item, index) in tabs" :key="index">
        <ApplyWaitTabContent
          :ref="(el: any) => (tabContentRefs[index] = el)"
          :title="item.name"
          :waitStatus="item.waitStatus"
          :apply-type="item.applyType"
        ></ApplyWaitTabContent>
      </VanTab>
    </VanTabs>

    <BatchApprovalDialog ref="batchApprovalDialogInstance" />
  </HorView>
</template>

<script lang="ts" setup>
  import { useKeepAlive, useKeepPosition, useQuery } from '@pkstar/vue-use'

  import { onBeforeMountOrActivated } from '@/hooks'
  import { applyListTrap, goBack } from '@/utils'

  import ApplyWaitTabContent from './components/ApplyWaitTabContent.vue'
  import BatchApprovalDialog from './components/BatchApprovalDialog.vue'

  const batchApprovalDialogInstance = ref() as Ref<InstanceType<typeof BatchApprovalDialog>>

  const { isTabbar } = useQuery()
  const active = ref(0)
  const tabs = [
    {
      name: '待我审批(加班)',
      is: 'ApplyWaitMeTabContent',
      waitStatus: 'me',
      applyType: 'overtime',
    },
    {
      name: '待我审批(请假)',
      is: 'ApplyWaitMeTabContent',
      waitStatus: 'me',
      applyType: 'leave',
    },
    // {
    //   name: '等待他人审批',
    //   is: 'ApplyWaitOtherTabContent',
    //   type: 'other',
    // },
  ]

  useKeepAlive()
  useKeepPosition({
    getTarget: () => document.querySelector(`.tab-content-${tabs[active.value].applyType}`)!,
  })
  // 获取实例
  const tabContentRefs = ref<any[]>([])
  const triggerTabContentRefresh = () => {
    const ref = tabContentRefs.value[active.value]
    nextTick(() => {
      // if (typeof data !== 'string') {
      //   // // 更新字段
      //   // const pagingData: any[] = ref?.pagingData
      //   // const item = pagingData.find((item) => item.id === data.id)
      //   // Object.assign(item, omit(data, ['id', 'type']))
      // } else {
      // }
      // 刷新列表
      ref?.pagingRefresh(true)
    })
  }
  const tabChange = () => {
    // triggerTabContentRefresh()
  }

  onBeforeMountOrActivated(() => {
    applyListTrap.create(triggerTabContentRefresh)
  })

  // 批量审批
  const handleBatchApproval = async () => {
    const ref = tabContentRefs.value[active.value]
    const selected = ref?.selected
    // 检查是否有选中项
    if (!selected?.length) {
      throw '请选择要审批的项'
    }
    await batchApprovalDialogInstance.value?.show({
      selected,
    })
    // 清空已选
    ref?.clearSelected()
    triggerTabContentRefresh()
  }

  defineExpose({
    tabs,
    active,
    tabContentRefs,
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
