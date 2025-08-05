<template>
  <div class="c-col-item van-hairline--bottom">
    <img class="icon" src="@/assets/img/icon/approval_leave.png" alt="" srcset="" />
    <div class="c-col-item-content">
      <div class="c-col-item-title">
        <span class="title">{{ item?.title }}</span>
        <span class="sub-text">{{ item?.modifyDt }}</span>
      </div>
      <div class="c-col-item-text">
        <span>{{ item?.submitStatus }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ApplyItem } from '@/types'

  defineProps({
    item: {
      type: Object as PropType<ApplyItem>,
    },
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
