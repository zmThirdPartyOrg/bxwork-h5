<template>
  <HorView class="" :title="bisTypeValueMap[d.bisType].title">
    <MessageDetailItem
      v-for="(item, index) in sourceData"
      :key="index"
      :item="item"
      @click="handleClick(item)"
    />

    <ProEndDivider />
  </HorView>
</template>

<script setup lang="ts">
  import { useQuery } from '@pkstar/vue-use'
  import MessageDetailItem from './components/MessageDetailItem.vue'
  import { bisTypeValueMap } from '@/utils'
  import type { MessageItem } from '@/types'

  const { dataList } = useQuery()
  const sourceData: MessageItem[] = JSON.parse(dataList)

  const d = {
    backId: '110-177',
    isRead: 'N',
    bisType: 'system',
    title: '测试-07271633',
    userId: 963,
    toUserId: 963,
    content: '22233',
    toUserName: '刘广仓',
    msgDate: '2025-07-27 16:33:55',
  }
  const router = useRouter()
  const handleClick = (item: MessageItem) => {
    router.push({
      path: `/apply/${item?.approvalId}`,
      query: {
        title: item?.title,
        applyType: item.bisSubType,
      },
    })
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
