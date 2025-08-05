<template>
  <HorView use-tab-scroll :left-arrow="$route.path === '/apply/wait'">
    <VanTabs @change="tabChange" v-model:active="active" sticky>
      <VanTab :title="item.name" v-for="(item, index) in tabs" :key="index">
        <ApplyWaitTabContent
          :ref="(el: any) => (tabContentRefs[index] = el)"
          :title="item.name"
          :type="item.type"
        ></ApplyWaitTabContent>
      </VanTab>
    </VanTabs>
  </HorView>
</template>

<script lang="ts" setup>
  import { onBeforeMountOrActivated } from '@/hooks'
  import { applyListTrap } from '@/utils'
  import { useKeepAlive, useKeepPosition } from '@pkstar/vue-use'
  import ApplyWaitTabContent from './components/ApplyWaitTabContent.vue'
  import { nextTick, ref } from 'vue'

  const active = ref(0)
  const tabs = [
    {
      name: '待我审批',
      is: 'ApplyWaitMeTabContent',
      type: 'me',
    },
    {
      name: '等待他人审批',
      is: 'ApplyWaitOtherTabContent',
      type: 'other',
    },
  ]

  useKeepAlive()
  useKeepPosition({
    getTarget: () => document.querySelector(`.tab-content-${tabs[active.value].type}`)!,
  })
  // 获取实例
  const tabContentRefs = ref<any[]>([])
  const triggerTabContentRefresh = (data: string | Record<string, any> | undefined) => {
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
  const tabChange = (name: string | number, title: string) => {
    console.log(name, title)
    triggerTabContentRefresh(undefined)
  }

  onBeforeMountOrActivated(() => {
    applyListTrap.create(triggerTabContentRefresh)
  })

  defineExpose({
    tabs,
    active,
    tabContentRefs,
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
