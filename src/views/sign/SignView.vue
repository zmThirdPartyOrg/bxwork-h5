<template>
  <HorView class="attend-view" @right="handleRight">
    <template #right>
      <HorIcon name="bar-chart-o" size="20" />
    </template>

    <div id="bmap-warp"></div>
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
    <button class="sign-btn" :disabled="!locationInfo.longitude" @click="handleSign">
      <HorIcon name="location" size="30" />签到
    </button>

    <!-- 签到弹框 -->
    <SignPopup ref="signPopupRef" />
  </HorView>
</template>

<script setup lang="ts">
  import { doSign, reqFaceCheck } from '@/api'
  import { useUserinfoStore } from '@/stores'
  import { __DEV__, appendBmap, isApp } from '@/utils'
  import { formatDate, isIOS } from '@pkstar/utils'
  import { useKeepAlive } from '@pkstar/vue-use'
  import SignPopup from '@/components/SignPopup.vue'
  import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
  import { getLocationByBMap, type GetLocationByBMapResult } from '@pkstar/horn-jssdk'

  const { userinfo } = useUserinfoStore()
  const router = useRouter()
  useKeepAlive()

  const signPopupRef = ref<InstanceType<typeof SignPopup>>()
  const now = new Date()
  const nowStr = formatDate(now, 'yyyy年MM月dd日 hh:mm:ss')
  const week = now.getDay()
  const weekStr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][week]
  const time = now.getHours() + ':' + now.getMinutes()
  let locationInfo = reactive<Partial<GetLocationByBMapResult>>({})
  const computedAddress = computed(() => {
    return locationInfo?.poi || locationInfo?.address
  })

  const handleRight = () => {
    router.push('/sign-list')
  }
  const handleSign = async () => {
    if (isApp && !__DEV__) {
      const res = await reqFaceCheck({
        dataId: `${isIOS() ? 'ios' : 'android'}${Date.now()}`,
        username: userinfo?.content.mobile!,
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
      locationInfo!.poi = locationName
      await doSign({
        longitude: locationInfo?.longitude!,
        latitude: locationInfo?.latitude!,
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
    const locationRes = await getLocationByBMap()
    if (!locationRes?.address) {
      showConfirmDialog({
        message: '获取定位失败，请开启定位权限和位置信息！',
        showCancelButton: false,
      })
      return
    }
    locationInfo = locationRes

    await appendBmap()
    const longitude = locationRes.longitude
    const latitude = locationRes.latitude
    // 百度地图API功能
    const map = new BMap.Map('bmap-warp') //,{minZoom:18.5,maxZoom:18.5}
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17) // 初始化地图,设置中心点坐标和地图级别
    map.disableDragging() // 禁用地图拖拽
    map.disableDoubleClickZoom() // 取消地图双击缩放
    map.disablePinchToZoom() // 禁用双指缩放地图
    map.clearOverlays()

    const bpt = new BMap.Point(longitude, latitude)
    const marker = new BMap.Marker(bpt) // 创建标注
    map.addOverlay(marker)
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  #bmap-warp {
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
