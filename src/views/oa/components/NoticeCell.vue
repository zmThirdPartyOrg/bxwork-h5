<template>
  <div class="notice-cell" @click="$router.push('/oa/notice-deatil?item=' + JSON.stringify(item))">
    <img class="icon" src="@/assets/img/icon/notice.jpg" alt="notice" />
    <div class="notice-cell-content">
      <div class="notice-cell-title">{{ item.title }}</div>
      <!-- <div class="notice-cell-desc">公告描述</div> -->
      <div class="notice-cell-time">{{ item.publishDt }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { NoticeItem } from '@/types'

  defineProps({
    item: {
      type: Object as PropType<NoticeItem>,
      default: () => {},
    },
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;

  .notice-cell {
    background-color: #fff;
    border-bottom: px(1) solid #f5f5f5;
    padding: j(10) j(15);
    @extend %df;
    .icon {
      width: j(30);
      height: j(30);
      margin-right: j(10);
    }
  }
  .notice-cell-title {
    font-size: j(13);
    font-weight: bold;
    margin-bottom: j(10);
  }
  .notice-cell-time {
    color: #999;
    font-size: j(12);
  }
</style>
