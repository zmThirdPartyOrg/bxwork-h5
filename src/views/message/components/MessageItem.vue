<template>
  <div class="c-col-item van-hairline--bottom">
    <VanBadge class="icon" :content="count" :max="99">
      <img :src="bisTypeValueMap[item?.bisType!]?.icon" alt="" srcset="" />
    </VanBadge>
    <div class="c-col-item-content">
      <div class="c-col-item-title">
        <span class="title">{{ bisTypeValueMap[item?.bisType!]?.label }}</span>
        <span class="sub-text">{{ item?.msgDate }}</span>
      </div>
      <div class="c-col-item-text">
        <span class="color-999">{{ item?.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { MessageItem } from '@/types'
  import { bisTypeValueMap } from '@/utils'

  const props = defineProps({
    item: {
      type: Object as PropType<MessageItem>,
    },
    type: {
      type: String,
      default: 'messages',
    },
    count: {
      type: Number,
      default: 0,
    },
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
