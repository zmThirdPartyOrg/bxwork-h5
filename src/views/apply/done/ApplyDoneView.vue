<template>
  <HorView use-tab-scroll>
    <VanTabs @change="tabChange" v-model:active="active" sticky>
      <VanTab :title="item.name" v-for="(item, index) in tabs" :key="index">
        <ApplyMyTabContent
          :ref="(el: any) => (tabContentRefs[index] = el)"
          :type="item.type"
        ></ApplyMyTabContent>
      </VanTab>
    </VanTabs>
  </HorView>
</template>

<script lang="ts" setup>
  import { onBeforeMountOrActivated } from '@/hooks'
  import { applyListTrap } from '@/utils'
  import { useKeepAlive, useKeepPosition } from '@pkstar/vue-use'
  import ApplyMyTabContent from './components/ApplyDoneTabContent.vue'
  import { nextTick, ref } from 'vue'

  const active = ref(0)
  const tabs = [
    {
      name: '进行中',
      type: 'part',
    },
    {
      name: '通过',
      type: 'pass',
    },
    {
      name: '拒绝',
      type: 'deny',
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
