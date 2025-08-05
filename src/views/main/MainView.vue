<template>
  <div class="main-wrap">
    <RouterView v-slot="{ Component }">
      <Transition :name="computedName" mode="out-in">
        <KeepAlive>
          <Component class="main-inner" :is="Component" />
        </KeepAlive>
      </Transition>
    </RouterView>

    <VanTabbar fixed route placeholder v-model="current">
      <VanTabbarItem
        v-for="(item, index) in computedTabbarRoutes"
        :key="item.path"
        replace
        :to="{ path: item.path, query: $route.query }"
        :icon="index === current ? (item.meta?.iconSelected ?? item.meta?.icon) : item.meta?.icon"
      >
        {{ item.meta?.title }}
      </VanTabbarItem>
    </VanTabbar>
  </div>
</template>

<script setup lang="ts">
  import { useKeepAlive } from '@pkstar/vue-use'

  const router = useRouter()
  const computedTabbarRoutes = computed(() => {
    const routes = router.getRoutes()
    const tabbarRoute = routes.find((item) => item.path === '/')
    return tabbarRoute?.children ?? []
  })

  // 支持 keep-alive
  useKeepAlive({
    name: 'MainView',
    relations: computedTabbarRoutes.value.map((item) => item.name) as string[],
  })

  const route = useRoute()
  const current = ref(computedTabbarRoutes.value.findIndex((item) => item.path === route.path))
  const computedName = computed(() => {
    const isContain = computedTabbarRoutes.value.find((item) => item.path === route.path)
    return isContain ? '' : 'fix'
  })
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/define.scss';
  .main-wrap {
    @extend %df;
    @extend %fdc;
    @extend %oh;
  }
  .main-inner {
    @extend %df1;

    &.is-fullscreen {
      @extend %oh;
    }
    &.is-pt {
      padding-top: j(10);
    }
    &.is-pb {
      padding-bottom: j(32);
    }
  }
</style>
