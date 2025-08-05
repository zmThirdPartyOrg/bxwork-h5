<template>
  <HorView class="attend-view" @right="handleRight">
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
      <div class="card-item"><span>上班时间：</span>{{ endtime }}</div>
      <div class="card-item">
        <span>下班时间：</span>
        {{ computedEndwork?.attendDt ? formatDate(computedEndwork?.attendDt, 'hh:mm') : '--:--' }}
      </div>
    </div>
    <div id="bmap-warp"></div>
    <button class="attend-btn" :disabled="!locationInfo" @click="handleAttend">
      <span>{{ time }}</span>
      {{ computedStartwork?.attendDt ? '下班打卡' : '上班打卡' }}
    </button>
    <!-- 打卡弹框 -->
    <SignPopup ref="signPopupRef" />
  </HorView>
</template>

<script setup lang="ts">
  import { doAttend, reqAttendInit, reqFaceCheck } from '@/api'
  import { useSysConfigStore, useUserinfoStore } from '@/stores'
  import { __DEV__, appendBmap, isApp } from '@/utils'
  import { formatDate, isIOS } from '@pkstar/utils'
  import { showConfirmDialog, showSuccessToast } from 'vant'
  import SignPopup from '@/components/SignPopup.vue'
  import { useAsyncTask, useKeepAlive } from '@pkstar/vue-use'
  import {
    getLocationByBMap,
    openAppAuthorizeSetting,
    type GetLocationByBMapResult,
  } from '@pkstar/horn-jssdk'

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
  const locationInfo = ref<GetLocationByBMapResult>()

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
    if (isApp && !__DEV__) {
      const res = await reqFaceCheck({
        dataId: `${isIOS() ? 'ios' : 'android'}${Date.now()}`,
        username: userinfo?.content.mobile!,
        image: 'base64',
      })
      if (res !== '0') {
        router.back()
        throw '非本人打卡，系统不允许'
      }
    }

    const remarkData = await signPopupRef.value?.show({ ...toRaw(locationInfo.value) })
    await doAttend({
      longitude: locationInfo.value?.longitude!,
      latitude: locationInfo.value?.latitude!,
      type: 'attend',
      attendType: computedStartwork.value?.attendDt ? 'endwork' : 'startwork',
      ...remarkData!,
    })
    showSuccessToast('打卡成功')
    trigger()
  }

  onMounted(async () => {
    const locationRes = await getLocationByBMap()
    if (!locationRes.address) {
      await showConfirmDialog({
        message: '获取定位失败，请开启定位权限和位置信息！',
        showCancelButton: false,
      })
      openAppAuthorizeSetting()
      return
    }

    locationInfo.value = locationRes
    await appendBmap()
    // const longitude = 116.404
    // const latitude = 39.915
    // 百度地图API功能
    const map = new BMap.Map('bmap-warp') //,{minZoom:18.5,maxZoom:18.5}
    const point = new BMap.Point(locationRes.longitude, locationRes.latitude)
    map.centerAndZoom(point, 17) // 初始化地图,设置中心点坐标和地图级别
    map.disableDragging() // 禁用地图拖拽
    map.disableDoubleClickZoom() // 取消地图双击缩放
    map.disablePinchToZoom() // 禁用双指缩放地图

    map.clearOverlays()
    const bpt = new BMap.Point(locationRes.longitude, locationRes.latitude)
    const marker = new BMap.Marker(bpt) // 创建标注
    map.addOverlay(marker)
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
  #bmap-warp {
    flex: 1;
  }

  .attend-btn {
    position: fixed;
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
