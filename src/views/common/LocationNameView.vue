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
      v-for="(item, index) in locationList"
      :key="index"
      :title="item.name"
      @click="handleSelect(item)"
    ></VanCell>
  </HorView>
</template>

<script setup lang="ts">
  import { getLocation, type GetLocationResult } from '@pkstar/horn-jssdk'
  import { useAsyncTask } from '@pkstar/vue-use'

  import { getPoiByTmapPoint } from '@/api'
  import { getLocationByNavigator, isApp, locationNameTrap, withLoading } from '@/utils'

  const {
    data: locationList,
    loading,
    error,
    trigger,
  } = useAsyncTask(
    withLoading(async () => {
      let locationRes = null as GetLocationResult | null
      if (isApp) {
        locationRes = await getLocation()
      }
      if (!locationRes) {
        locationRes = await getLocationByNavigator()
        console.log('locationRes', locationRes)
      }
      const res = await getPoiByTmapPoint(locationRes.longitude!, locationRes.latitude!, '电')
      console.log('res=>>>>>>>', res)
      return res ?? []
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
