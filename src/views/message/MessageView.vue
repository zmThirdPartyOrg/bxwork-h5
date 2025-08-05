<template>
  <HorView title="消息列表" :left-arrow="false">
    <HorScroll class="home-scroll" :list-disabled="false" finished @refresh="handleRefresh">
      <div class="c-br"></div>
      <ProSkeleton
        v-if="!hasMessage"
        :loading="loading"
        :error="error"
        @refresh="handleRefresh"
        empty-description="暂无消息"
      />
      <template v-else v-for="(group, key) in data" :key="key">
        <MessageItem
          v-for="item in group.slice(-1)"
          :key="item.approvalId"
          :item="item"
          :count="group.length"
          @click="handleClick(group)"
        />
      </template>
    </HorScroll>
  </HorView>
</template>

<script setup lang="ts">
  import { useAsyncTask, useQuery } from '@pkstar/vue-use'
  import MessageItem from './components/MessageItem.vue'
  import { reqConfig, reqCustomerContact, reqMessageList, reqVersionVerify } from '@/api'
  import { onBeforeMountOrActivated } from '@/hooks'
  import { useSysConfigStore } from '@/stores'

  const {
    data,
    error,
    loading,
    trigger: handleRefresh,
  } = useAsyncTask(async (cb: any) => {
    const res = await reqMessageList()
    const contact = await reqCustomerContact()
    cb && cb()
    return res
  }, {})

  // 系统配置数据
  const getSysConfig = async () => {
    const res = await reqConfig()
    const { setSysConfig } = useSysConfigStore()
    setSysConfig(res)
  }

  onBeforeMountOrActivated(async () => {
    await handleRefresh(false)
    getSysConfig()
    reqVersionVerify()
  })

  const hasMessage = computed(() =>
    Object.keys(data.value || {}).reduce((pre, cur: any) => {
      console.log('hasMessage=>', cur)
      pre += data.value![cur as 'messages'].length
      return pre
    }, 0),
  )

  const router = useRouter()
  const handleClick = (group: any) => {
    router.push({
      path: '/message/detail',
      query: { dataList: JSON.stringify(group) },
    })
  }
</script>
