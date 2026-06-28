<template>
  <HorView class="attend-view" @right="handleRight" @left="goBack">
    <template #right>
      <HorIcon name="bar-chart-o" size="20" />
    </template>
    <p class="title">{{ nowStr }}</p>
    <div class="attend-card">
      <div class="card-item"><span>上班时间：</span>{{ starttime }}</div>
      <div class="card-item">
        <span>上班时间：</span>
        {{
          computedStartwork?.attendDt ? formatDate(computedStartwork?.attendDt, 'hh:mm') : '--:--'
        }}
      </div>
      <div class="card-item"><span>下班时间：</span>{{ endtime }}</div>
      <div class="card-item">
        <span>下班时间：</span>
        {{ computedEndwork?.attendDt ? formatDate(computedEndwork?.attendDt, 'hh:mm') : '--:--' }}
      </div>
    </div>
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
    <button class="attend-btn" :disabled="!locationInfo.addressComponent" @click="handleAttend">
      <span>{{ time }}</span>
      {{ computedStartwork?.attendDt ? '下班打卡' : '上班打卡' }}
    </button>
    <!-- 打卡弹框 -->
    <SignPopup ref="signPopupRef" />
  </HorView>
</template>

<script setup lang="ts">
  import { getLocation, type GetLocationResult, openAppAuthorizeSetting } from '@pkstar/horn-jssdk'
  import { formatDate, isIOS } from '@pkstar/utils'
  import { useAsyncTask, useKeepAlive } from '@pkstar/vue-use'
  import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'

  import { doAttend, getLocationNameByTmapPoint, reqAttendInit, reqFaceCheck } from '@/api'
  import SignPopup from '@/components/SignPopup.vue'
  import { useSysConfigStore, useUserinfoStore } from '@/stores'
  import type { GetLocationNameByTmapPointResult } from '@/types'
  import {
    appendTmap,
    getLocationByNavigator,
    goBack,
    isApp,
    takePhoto,
    withLoading,
  } from '@/utils'

  useKeepAlive()

  const router = useRouter()
  const { userinfo } = useUserinfoStore()
  const { sysConfig } = useSysConfigStore(true)
  const starttime = computed(
    () => sysConfig?.value?.para.find((item) => item.paraCode === 'oa.work.starttime')?.paraValue,
  )
  const endtime = computed(
    () => sysConfig?.value?.para.find((item) => item.paraCode === 'oa.work.endtime')?.paraValue,
  )

  const now = new Date()
  const nowStr = formatDate(now, 'yyyy年MM月dd日 hh:mm:ss')
  // const week = now.getDay()
  // const weekStr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][week]
  const time = formatDate(now, 'hh:mm')
  const locationInfo = reactive<Partial<GetLocationNameByTmapPointResult>>({})
  const mapReady = ref(false)
  const locating = ref(false)
  let map: any
  let locationRequestId = 0

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

  const { data: attendData, trigger } = useAsyncTask(reqAttendInit, {
    immediate: true,
    initialValue: [],
  })
  const computedStartwork = computed(() => {
    return [...attendData.value].reverse().find((item) => item.attendType === 'startwork')
  })
  const computedEndwork = computed(() => {
    return attendData.value.find((item) => item.attendType === 'endwork')
  })

  const signPopupRef = ref<InstanceType<typeof SignPopup>>()

  const handleRight = () => {
    router.push('/attend/attend-list')
  }
  const handleAttend = async () => {
    const { base64 } = await takePhoto({
      capture: 'user',
      withMask: 1,
    })
    const res = await reqFaceCheck({
      dataId: `${isIOS() ? 'ios' : 'android'}${Date.now()}`,
      username: userinfo?.content.mobile!,
      image: base64,
    })
    if (res !== '0') {
      router.back()
      throw '非本人打卡，系统不允许'
    }

    const remarkData = await signPopupRef.value?.show({ ...toRaw(locationInfo) })
    await doAttend({
      longitude: locationInfo?.location?.lon!,
      latitude: locationInfo?.location?.lat!,
      type: 'attend',
      attendType: computedStartwork.value?.attendDt ? 'endwork' : 'startwork',
      ...remarkData!,
    })
    showSuccessToast('打卡成功')
    trigger()
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
  .title {
    line-height: j(40);
    color: $color-primary;
    text-align: center;
    font-size: j(14);
  }
  .attend-card {
    @extend %df;
    @extend %fww;
    font-size: j(14);
    padding: j(10) j(15) j(0);
    background-color: #fff;
    .card-item {
      width: 50%;
      line-height: j(20);
      margin-bottom: j(10);
      span {
        color: #999;
      }
    }
  }
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

  .attend-btn {
    position: fixed;
    z-index: 1000;
    bottom: j(60);
    left: 50%;
    transform: translateX(-50%);
    width: j(100);
    height: j(100);
    background-color: $color-primary;
    color: #fff;
    border-radius: j(50);
    font-size: j(14);
    border: none;
    &:disabled {
      opacity: 0.6;
    }
    span {
      font-size: j(20);
    }
    @extend %df;
    @extend %fdc;
    @extend %aic;
    @extend %jcc;
  }
</style>
