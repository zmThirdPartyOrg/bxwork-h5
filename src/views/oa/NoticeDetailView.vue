<template>
  <HorView class="notice-detail">
    <div class="notice-header">
      <div class="title">{{ computedItem.title }}</div>
      <div class="time">{{ computedItem.publishDt }}</div>
    </div>
    <div class="notice-content" @click.prevent.stop="() => {}" v-html="computedItem.content"></div>
  </HorView>
</template>

<script setup lang="ts">
  import type { NoticeItem } from '@/types'
  import { useQuery } from '@pkstar/vue-use'

  const { item } = useQuery()

  const computedItem = computed<NoticeItem>(() => {
    return JSON.parse(item)
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .notice-detail {
    padding: j(10) j(15);
    font-size: j(13);
    .title {
      font-weight: bold;
    }
    .time {
      color: #999;
      margin-top: j(10);
    }
    .notice-content {
      margin-top: j(15);
      font-size: j(12);
    }
  }
</style>
