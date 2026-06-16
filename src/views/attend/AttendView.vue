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
    <div id="mapContainer" class="map-warp"></div>
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
  import { showConfirmDialog, showSuccessToast } from 'vant'

  import { doAttend, getLocationNameByTmapPoint, reqAttendInit, reqFaceCheck } from '@/api'
  import SignPopup from '@/components/SignPopup.vue'
  import { useSysConfigStore, useUserinfoStore } from '@/stores'
  import type { GetLocationNameByTmapPointResult } from '@/types'
  import {
    __DEV__,
    appendTmap,
    getLocationByNavigator,
    goBack,
    isApp,
    takePhoto,
    takePhotoByBrowser,
  } from '@/utils'

  useKeepAlive()

  const router = useRouter()
  const { userinfo } = useUserinfoStore()
  const { sysConfig } = useSysConfigStore()
  const starttime = sysConfig?.para.find((item) => item.paraCode === 'oa.work.starttime')?.paraValue
  const endtime = sysConfig?.para.find((item) => item.paraCode === 'oa.work.endtime')?.paraValue

  const now = new Date()
  const nowStr = formatDate(now, 'yyyy年MM月dd日 hh:mm:ss')
  // const week = now.getDay()
  // const weekStr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][week]
  const time = formatDate(now, 'hh:mm')
  const locationInfo = reactive<Partial<GetLocationNameByTmapPointResult>>({})

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
    const image = await takePhoto()
    console.log('image=>>>>>>>', image)
    const res = await reqFaceCheck({
      dataId: `${isIOS() ? 'ios' : 'android'}${Date.now()}`,
      username: userinfo?.content.mobile!,
      image: 'base64',
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
    await nextTick()
    await appendTmap()

    const map = new T.Map('mapContainer')
    map.disableDoubleClickZoom()
    map.disableScrollWheelZoom()
    map.disableInertia()
    try {
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

      Object.assign(locationInfo, locationRes)
      const p = await getLocationNameByTmapPoint(locationRes.longitude!, locationRes.latitude!)
      Object.assign(locationInfo, p)
      const point = new T.LngLat(locationRes.longitude, locationRes.latitude)
      map.centerAndZoom(point, 17)
      map.clearOverLays()
      map.addOverLay(new T.Marker(point))
    } catch (err) {
      console.error(err)
      await showConfirmDialog({
        message: '获取定位失败，请开启定位权限和位置信息！',
        showCancelButton: false,
      })
      if (isApp) {
        openAppAuthorizeSetting()
      }
    }
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
  .map-warp {
    flex: 1;
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
