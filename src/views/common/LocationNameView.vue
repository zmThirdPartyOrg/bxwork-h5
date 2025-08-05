<template>
  <HorView class="">
    <ProSkeleton
      v-if="locationList && !locationList.length"
      :loading="loading"
      :error="error"
      empty-btn-text=""
      @refresh="trigger"
    />
    <VanCell
      v-else
      v-for="item in locationList"
      :key="item.uid"
      :title="item.title"
      @click="handleSelect(item)"
    ></VanCell>
  </HorView>
</template>

<script setup lang="ts">
  import { getLocationNameByPoint, locationNameTrap, withLoading } from '@/utils'
  import { getLocationByBMap } from '@pkstar/horn-jssdk'
  import { useAsyncTask } from '@pkstar/vue-use'

  const {
    data: locationList,
    loading,
    error,
    trigger,
  } = useAsyncTask(
    withLoading(async () => {
      const { longitude, latitude } = await getLocationByBMap()
      const res = await getLocationNameByPoint(+longitude, +latitude)
      return res
    }),
    {
      immediate: true,
    },
  )

  const router = useRouter()
  const handleSelect = (item: any) => {
    console.log('handleSelect', item)
    locationNameTrap.trigger(item)
    router.back()
    return
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
