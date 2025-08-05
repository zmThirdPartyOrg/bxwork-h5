<template>
  <div
    class="pro-search"
    :class="{
      'is-suffer': !!$slots.suffer,
      'is-sticky': sticky,
      'is-mini-program': isMiniProgram && sticky,
    }"
  >
    <VanSearch
      class="pro-search-content"
      clearable
      clear-trigger="always"
      :placeholder="placeholder"
      :model-value="keyword"
      enterkeyhint="搜索"
      @update:model-value="handleInput"
      @search="handleSearch"
    >
      <template #right-icon v-if="actionText">
        <span class="pro-search-btn" @click="handleSearch">{{ actionText }}</span>
      </template>
    </VanSearch>
    <slot name="suffer"></slot>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { isMiniProgram, withLoading } from '@/utils'
  import { proSearchProps } from './types'

  // 如果定义属性 这里传 horSearchProps， 在 types 里完善类型
  const props = defineProps(proSearchProps)
  const keyword = ref(props.modelValue)
  const emit = defineEmits(['update:modelValue', 'search'])

  watch(
    () => props.modelValue,
    (v) => (keyword.value = v),
    { immediate: true },
  )

  const handleInput = (value: any) => {
    keyword.value = value
    emit('update:modelValue', value)

    if (!value) {
      // 没有数据的数据 默认触发一次搜索
      handleSearch()
    }
  }
  const handleSearch = () => {
    withLoading(async () => {
      emit('search', keyword.value)
    })()
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .pro-search {
    @extend %df;
    @extend %pr;
    @extend %aic;
    @extend %bwb;
    z-index: 2;
    padding: j(10) j(16);
    background-color: #fff;

    &.is-mini-program {
      top: 0 !important;
    }
    &.is-sticky {
      @extend %ps;
      top: var(--van-nav-bar-height);
    }
    &.is-suffer {
      padding-right: j(6);
    }
    :deep {
      .van-search__content {
        border-radius: j(8);
        background-color: #f2f2f2;
      }
    }
  }
  .pro-search-content {
    @extend %df1;
    background-color: transparent;
    padding: 0;
  }
  .pro-search-btn {
    color: $color-primary;
  }
</style>
