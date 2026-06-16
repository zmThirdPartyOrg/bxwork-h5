<template>
  <HorView class="attend-view" @right="handleRight" @left="goBack">
    <template #right>
      <HorIcon name="bar-chart-o" size="20" />
    </template>

    <div id="mapContainer" class="map-warp"></div>
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
  import { showConfirmDialog, showSuccessToast } from 'vant'

  import { doSign, getLocationNameByTmapPoint, reqFaceCheck } from '@/api'
  import SignPopup from '@/components/SignPopup.vue'
  import { useUserinfoStore } from '@/stores'
  import type { GetLocationNameByTmapPointResult } from '@/types'
  import { __DEV__, appendTmap, getLocationByNavigator, goBack, isApp } from '@/utils'

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
  const computedAddress = computed(() => {
    return locationInfo.formatted_address || locationInfo.addressComponent?.address
  })

  const handleRight = () => {
    router.push('/sign-list')
  }
  const handleSign = async () => {
    if (isApp && !__DEV__) {
      const res = await reqFaceCheck({
        dataId: `${isIOS() ? 'ios' : 'android'}${Date.now()}`,
        username: userinfo?.content.mobile ?? '',
        image: 'base64',
      })
      if (res !== '0') {
        router.back()
        throw '非本人签到，系统不允许'
      }
    }

    const res = await signPopupRef.value?.show({ ...toRaw(locationInfo) })
    if (res) {
      const { locationName, remark, fileIds } = res
      locationInfo!.formatted_address = locationName
      await doSign({
        longitude: locationInfo?.location?.lon!,
        latitude: locationInfo?.location?.lat!,
        type: 'sign',
        locationName,
        remark,
        fileIds,
      })
      showSuccessToast('签到成功')
      router.back()
    }
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
      console.log('locationRes', locationRes)
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
  .map-warp {
    flex: 1;
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
