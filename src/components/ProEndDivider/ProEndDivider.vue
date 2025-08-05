<template>
  <VanDivider class="pro-end-divider" :class="{ 'is-safe-area': safeArea }" dashed>
    到底了哦
  </VanDivider>
</template>

<script setup lang="ts">
  defineProps({
    safeArea: {
      type: Boolean,
      default: true,
    },
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .pro-end-divider {
    border-color: #ddd;
    padding: 0 j(16);
    &.is-safe-area {
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
</style>
