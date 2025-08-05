<template>
  <div class="message-detail-item">
    <ProImg
      class="icon"
      :src="item?.fromUserImg || bisTypeValueMap['system']?.icon"
      alt=""
      srcset=""
    />
    <div class="inner">
      <div class="time">{{ item?.msgDate }}</div>
      <div class="content">
        <div class="type-title" v-if="item?.bisSubType">
          {{ applyTypeValueMap[item?.bisSubType!].label }}
        </div>
        <div class="title">{{ item?.title }}</div>
        <div class="desc">{{ item?.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { MessageItem } from '@/types'
  import { bisTypeValueMap, applyTypeValueMap } from '@/utils'

  defineProps({
    item: {
      type: Object as PropType<MessageItem>,
    },
    type: {
      type: String,
      default: 'system',
    },
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;

  .message-detail-item {
    padding: j(10) j(15);
    font-size: j(13);
    @extend %df;
    .icon {
      width: j(40);
      height: j(40);
      margin-right: j(10);
      border-radius: 50%;
    }
  }
  .inner {
    @extend %df;
    @extend %fdc;
    flex: 1;
    .time {
      font-size: j(12);
      color: #999;
      margin-bottom: j(5);
    }
  }
  .content {
    padding: j(10) j(10);
    background-color: #fff;
    border-radius: j(8);
    .title {
      margin-bottom: j(6);
      color: #999;
    }
    .type-title {
      margin-bottom: j(6);
      color: #999;
    }
  }
</style>
