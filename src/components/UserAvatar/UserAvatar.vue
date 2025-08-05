<template>
  <ProImg class="avatar" loading="lazy" :def-src="defSrc" :src="src" alt="avatar" />
</template>

<script setup lang="ts">
  import defSrc from '@/assets/img/default_user.png'

  defineProps({
    src: {
      type: String,
      default: '',
    },
  })
</script>
<style scoped lang="scss">
  .avatar {
    object-position: center;
    object-fit: cover;
    background-color: #fff;
  }
</style>
