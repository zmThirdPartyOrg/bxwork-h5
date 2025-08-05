<template>
  <div class="pro-skeleton" :style="{ minHeight }">
    <!-- loading -->
    <VanLoading v-if="loading" type="spinner" vertical>
      {{ loadingDescription }}
    </VanLoading>

    <!-- error -->
    <VanEmpty
      v-else-if="error"
      class="pro-skeleton-error"
      image="error"
      :description="formatMessage(error)"
    >
      <VanButton
        v-if="errorBtnText"
        round
        plain
        size="small"
        class="pro-skeleton-button"
        @click="($emit('refresh'), $emit('update:error', ''))"
      >
        {{ errorBtnText }}
      </VanButton>
    </VanEmpty>

    <!-- empty -->
    <VanEmpty v-else :description="emptyDescription">
      <VanButton
        v-if="emptyBtnText"
        round
        plain
        size="small"
        class="pro-skeleton-button"
        @click="$emit('refresh')"
      >
        {{ emptyBtnText }}
      </VanButton>
      <slot name="empty"></slot>
    </VanEmpty>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'
  import { formatMessage } from '@pkstar/utils'

  defineEmits(['refresh', 'update:loading', 'update:error'])

  defineProps({
    error: {
      type: [Object, String, Array, Number] as PropType<any>,
      default: '',
    },
    errorBtnText: {
      type: String,
      default: '刷新一下',
    },
    loading: {
      type: Boolean,
      default: true,
    },
    loadingDescription: {
      type: String,
      default: '加载中...',
    },
    emptyDescription: {
      type: String,
      default: '暂无数据',
    },
    emptyBtnText: {
      type: String,
      default: '刷新一下',
    },
    minHeight: {
      type: String,
      default: '70vh',
    },
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .pro-skeleton {
    @extend %df;
    @extend %fdc;
    @extend %aic;
    @extend %jcc;
  }
  .pro-skeleton-error {
    :deep {
      .van-empty__description {
        word-break: break-all;
        color: var(--van-danger-color);
      }
    }
  }

  .pro-skeleton-button {
    padding: j(6) j(32);
    color: var(--hor-text-color-2);
    background-color: transparent;
  }
</style>
