<template>
  <HorView class="attend-view" @right="handleRight" @left="goBack">
    <template #right>
      <HorIcon name="bar-chart-o" size="20" />
    </template>

    <div class="map-container">
      <div id="mapContainer" class="map-warp"></div>
      <button
        class="relocate-btn"
        type="button"
        aria-label="重新定位"
        :disabled="!mapReady || locating"
        @click.stop="handleRelocate"
      >
        <HorIcon name="van-aim" size="24" />
      </button>
    </div>
    <ul class="sign-info">
      <li>
        <HorIcon class="icon" name="location-o" size="30" />
        <span>{{ computedAddress }}</span>
      </li>
      <li>
        <HorIcon class="icon" name="clock-o" size="26" />
        <span>{{ nowStr }}</span>
      </li>
    </ul>
    <button class="sign-btn" :disabled="!locationInfo.addressComponent" @click="handleSign">
      <HorIcon name="location" size="30" />签到
    </button>

    <!-- 签到弹框 -->
    <SignPopup ref="signPopupRef" />
  </HorView>
</template>

<script setup lang="ts">
  import { getLocation, type GetLocationResult, openAppAuthorizeSetting } from '@pkstar/horn-jssdk'
  import { formatDate, isIOS } from '@pkstar/utils'
  import { useKeepAlive } from '@pkstar/vue-use'
  import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'

  import { doSign, getLocationNameByTmapPoint, reqFaceCheck } from '@/api'
  import SignPopup from '@/components/SignPopup.vue'
  import { useUserinfoStore } from '@/stores'
  import type { GetLocationNameByTmapPointResult } from '@/types'
  import {
    appendTmap,
    getLocationByNavigator,
    goBack,
    isApp,
    takePhoto,
    withLoading,
  } from '@/utils'

  const { userinfo } = useUserinfoStore()
  const router = useRouter()
  useKeepAlive()

  const signPopupRef = ref<InstanceType<typeof SignPopup>>()
  const now = new Date()
  const nowStr = formatDate(now, 'yyyy年MM月dd日 hh:mm:ss')
  // const week = now.getDay()
  // const weekStr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][week]
  // const time = now.getHours() + ':' + now.getMinutes()
  const locationInfo = reactive<Partial<GetLocationNameByTmapPointResult>>({})
  const mapReady = ref(false)
  const locating = ref(false)
  let map: any
  let locationRequestId = 0
  const computedAddress = computed(() => {
    return locationInfo.formatted_address || locationInfo.addressComponent?.address
  })

  const selectLocation = async (
    longitude: number,
    latitude: number,
    centerMap = false,
    requestId = ++locationRequestId,
  ) => {
    const point = new T.LngLat(longitude, latitude)
    locationInfo.formatted_address = ''
    locationInfo.addressComponent = undefined
    locationInfo.location = { lon: longitude, lat: latitude }
    map.clearOverLays()
    map.addOverLay(new T.Marker(point))
    if (centerMap) {
      map.centerAndZoom(point, 17)
    }

    const location = await getLocationNameByTmapPoint(longitude, latitude)
    if (requestId === locationRequestId) {
      Object.assign(locationInfo, location)
    }
  }

  const locateCurrentPosition = async () => {
    const requestId = ++locationRequestId
    let locationRes = null as GetLocationResult | null
    if (isApp) {
      locationRes = await getLocation()
    }
    if (!locationRes) {
      locationRes = await getLocationByNavigator()
    }
    if (!locationRes) {
      throw new Error('获取定位失败')
    }
    if (requestId !== locationRequestId) return

    await selectLocation(locationRes.longitude!, locationRes.latitude!, true, requestId)
  }

  const handleLocationError = async (err: unknown) => {
    console.error(err)
    await showConfirmDialog({
      message: '获取定位失败，请开启定位权限和位置信息！',
      showCancelButton: false,
    })
    if (isApp) {
      openAppAuthorizeSetting()
    }
  }

  const handleRelocate = async () => {
    if (locating.value) return

    locating.value = true
    try {
      await withLoading(locateCurrentPosition)()
    } catch (err) {
      await handleLocationError(err)
    } finally {
      locating.value = false
    }
  }

  const handleMapClick = async (event: { lnglat: { lng: number; lat: number } }) => {
    const { lng, lat } = event.lnglat
    try {
      await withLoading(() => selectLocation(lng, lat))()
    } catch (err) {
      console.error(err)
      showFailToast('获取所选位置地址失败，请重试')
    }
  }

  const handleRight = () => {
    router.push('/sign-list')
  }
  const handleSign = async () => {
    const { base64 } = await takePhoto({
      capture: 'user',
      withMask: 1,
    })

    const res = await reqFaceCheck({
      dataId: `${isIOS() ? 'ios' : 'android'}${Date.now()}`,
      username: userinfo?.content.mobile ?? '',
      image: base64,
    })
    if (res !== '0') {
      router.back()
      throw '非本人签到，系统不允许'
    }

    const remarkData = await signPopupRef.value?.show({
      ...toRaw(locationInfo),
      source: 'timeover',
    })
    if (remarkData) {
      const { locationName, remark, fileIds } = remarkData
      locationInfo!.formatted_address = locationName
      await doSign({
        longitude: locationInfo?.location?.lon!,
        latitude: locationInfo?.location?.lat!,
        type: 'sign',
        locationName: locationInfo.formatted_address || '',
        remark,
        fileIds,
      })
      showSuccessToast('签到成功')
      router.back()
    }
  }
  onMounted(async () => {
    await appendTmap()

    map = new T.Map('mapContainer')
    map.disableDoubleClickZoom()
    map.disableScrollWheelZoom()
    map.disableInertia()
    // map.disableDrag()
    map.addEventListener('click', handleMapClick)
    mapReady.value = true

    try {
      locating.value = true
      await withLoading(locateCurrentPosition)()
    } catch (err) {
      await handleLocationError(err)
    } finally {
      locating.value = false
    }
  })

  onBeforeUnmount(() => {
    map?.removeEventListener('click', handleMapClick)
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .map-container {
    flex: 1;
    min-height: 0;
    position: relative;
  }
  .map-warp {
    width: 100%;
    height: 100%;
    touch-action: none;
    -webkit-user-drag: none;
    user-drag: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
  .relocate-btn {
    position: absolute;
    right: j(15);
    bottom: j(15);
    z-index: 1000;
    width: j(42);
    height: j(42);
    padding: 0;
    border: none;
    border-radius: 50%;
    color: $color-primary;
    background-color: #fff;
    box-shadow: 0 px(2) px(8) rgb(0 0 0 / 18%);
    @extend %df;
    @extend %aic;
    @extend %jcc;
    &:disabled {
      opacity: 0.6;
    }
  }
  .sign-info {
    padding: 0 j(15);
    background-color: #fff;
    font-size: j(14);
    color: #666;
    li {
      padding: j(10) 0;
      @extend %df;
      @extend %aic;
      &:not(:last-child) {
        border-bottom: px(1) solid #f5f5f5;
      }
    }
  }
  .icon {
    margin-right: j(8);
    color: #3aadeb;
  }
  .sign-btn {
    width: j(100);
    height: j(100);
    background-color: $color-primary;
    color: #fff;
    border-radius: j(50);
    font-size: j(14);
    margin: j(20) auto j(50);
    border: none;
    &:disabled {
      opacity: 0.6;
    }
    span {
      font-size: j(20);
      margin-top: j(5);
    }
    @extend %df;
    @extend %fdc;
    @extend %aic;
    @extend %jcc;
  }
</style>
