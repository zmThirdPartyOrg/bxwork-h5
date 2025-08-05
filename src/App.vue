<template>
  <RouterView v-slot="{ Component }">
    <Transition :name="transitionName">
      <KeepAlive max="10" :include="includes">
        <Component
          class="view-wrap"
          :class="{ 'hide-header': isMiniProgram }"
          :is="Component"
          :key="getKey($route)"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
  <!-- <DebugPanel v-if="__DEV__">
    <p>includes: {{ includes }}</p>
    <p>transitionName: {{ transitionName }}</p>
  </DebugPanel> -->
</template>

<script setup lang="ts">
  import { useTransitionName, useKeepAlive } from '@pkstar/vue-use'
  import { __DEV__, isMiniProgram } from '@/utils'
  import type { RouteLocationNormalizedLoaded } from 'vue-router'
  import jssdk from '@pkstar/horn-jssdk'

  const { includes, keepAliveList } = useKeepAlive(300)
  // 重置 keepAlive
  window.resetKeepAlive = () => {
    includes.value = []
    keepAliveList.value = []
  }

  const getKey = (route: RouteLocationNormalizedLoaded) => {
    const { path, fullPath } = route
    console.log('path', path)
    if (['', '/home', '/work', '/todo', '/mine'].includes(path)) {
      return
    }
    return fullPath
  }

  const transitionName = useTransitionName({
    enterClass: 'slide-plus-left',
    leaveClass: 'slide-plus-right',
  })

  onMounted(() => {
    jssdk.closeScreenAnimation()
  })

  const route = useRoute()
</script>

<style lang="scss">
  @import '@/assets/scss/global.scss';
  .view-wrap {
    @extend %pa;
    @extend %t0;
    @extend %l0;
    @extend %w100;
    @extend %h100;
    @extend %bsb;
    @extend %oya;
    background-color: #f5f5f5;
    &.is-white {
      background-color: #fff;
    }
    &.is-fullscreen {
      @extend %oh;
    }
    &.is-pt {
      padding-top: j(10);
    }
    &.is-pb {
      padding-bottom: j(96);
    }
    &.hide-header {
      .hor-header {
        @extend %dn;
      }
    }
  }
  .c-bar {
    height: j(10);
  }
</style>
