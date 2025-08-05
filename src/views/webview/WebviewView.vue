<template>
  <HorView class="is-fullscreen" :title="title" :use-nav-bar="query.noHeader !== '0'">
    <div
      :use-nav-bar="query.backBtn === '1'"
      class="back-btn"
      @click="$router.replace({ path: '/' })"
    >
      <img src="/assets/img/img-logo.png" alt="logo" class="logo" />
    </div>
    <iframe
      v-if="src"
      class="webview-inner"
      :src="src"
      frameborder="0"
      scrolling="auto"
      @loadstart="showLoading"
      @load="hideLoading"
      @abort="hideLoading"
      @error="hideLoading"
    />
  </HorView>
</template>

<script setup lang="ts">
  import { useQuery } from '@pkstar/vue-use'
  import { showLoadingToast, type ToastWrapperInstance } from 'vant'

  const query = useQuery()
  const src = computed(() => query.url)
  const title = computed(() => query.title || ' ')

  let toast: ToastWrapperInstance
  const showLoading = () => {
    toast = showLoadingToast({ duration: 0 })
  }
  const hideLoading = () => {
    toast?.close()
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .webview-inner {
    @extend %w100;
    @extend %h100;
  }
  .back-btn {
    @extend %pf;
    @extend %df;
    @extend %aic;
    @extend %jcc;
    @extend %br50;
    @extend %cfff;
    @extend %fwb;
    background-color: $color-primary;
    right: j(10);
    bottom: calc(var(--van-tabbar-height) + j(60));
    width: j(50);
    height: j(50);
    font-size: j(24);
    z-index: 99;
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
    img {
      width: j(50);
    }
  }
</style>
