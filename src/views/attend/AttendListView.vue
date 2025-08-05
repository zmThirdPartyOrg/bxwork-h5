<template>
  <HorView class="attend-list-view">
    <div class="c-bar"></div>
    <div class="c-user-info">
      <div class="user">
        <UserAvatar class="c-avatar" :src="userinfo?.content.smallImage" />
        <span>{{ userinfo?.content.realName }}</span>
      </div>
      <MonthSelect v-model="currentMonth" />
    </div>

    <ProSkeleton v-if="!data || error" :loading="loading" :error="error" @refresh="trigger" />
    <template v-else>
      <div class="c-bar"></div>
      <ul class="attend-info attend-info-1">
        <li class="info-item" v-for="(item, index) in attendSumms1" :key="index">
          <span>{{ item.label }}:</span> {{ data?.summ[item.key] }}次
        </li>
      </ul>
      <ul class="attend-info attend-info-2">
        <li class="info-item" v-for="(item, index) in attendSumms2" :key="index">
          <span>{{ item.label }}:</span>{{ data?.summ[item.key] }}小时
        </li>
      </ul>
      <div class="c-bar"></div>
      <dl class="sign-list">
        <dt class="sign-list-title">外勤记录</dt>
        <dd class="sign-list-item" v-for="(item, index) in data?.sign" :key="index">
          <HorIcon class="icon" name="location-o" size="30" />
          <!-- <img src="@/assets/img/icon/woke_sign.png" alt="" srcset="" /> -->
          <div class="sign-list-item-content">
            <span class="sign-list-item-content-date">{{ item.dt }}</span>
            <span class="sign-list-item-content-location">{{ item.location }}</span>
          </div>
        </dd>
      </dl>
      <ProEndDivider />
    </template>
    <div class="c-ios-seat"></div>
  </HorView>
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@pkstar/vue-use'
  import { reqAttendRecord } from '@/api'
  import { formatDate } from '@pkstar/utils'
  import MonthSelect from '@/components/MonthPicker.vue'
  import type { AttendSumm } from '@/types'
  import { useUserinfoStore } from '@/stores'

  const { userinfo } = useUserinfoStore()
  const currentMonth = ref(formatDate(new Date(), 'yyyy-MM'))

  watch(
    () => currentMonth.value,
    () => {
      trigger()
    },
  )

  const { data, error, loading, trigger } = useAsyncTask(
    () => reqAttendRecord({ requestMonth: currentMonth.value }),
    {
      immediate: true,
    },
  )

  type SummType = Array<{ label: string; key: keyof AttendSumm }>
  const attendSumms1: SummType = [
    {
      label: '出勤天数',
      key: 'attendDays',
    },
    {
      label: '正常打卡',
      key: 'normalAttend',
    },
    {
      label: '外勤天数',
      key: 'signDays',
    },
    {
      label: '早退',
      key: 'earlyNum',
    },
    {
      label: '缺卡',
      key: 'lackNum',
    },
    {
      label: '迟到',
      key: 'lateNum',
    },
    {
      label: '旷工',
      key: 'awayNum',
    },
  ]
  const attendSumms2: SummType = [
    {
      label: '出差',
      key: 'tripHour',
    },
    {
      label: '加班',
      key: 'overHour',
    },
    {
      label: '外出',
      key: 'outHour',
    },
    {
      label: '请假',
      key: 'leaveHour',
    },
  ]
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;

  .attend-info {
    background-color: #fff;
    padding: j(10) j(15);
    font-size: j(13);
    @extend %df;
    @extend %fww;
    .info-item {
      margin-bottom: j(10);
      width: 50%;
      padding-right: j(50);
      @extend %bsb;
      @extend %df;
      @extend %aic;
      @extend %jcs;
      span {
        color: #666;
      }
    }
    &.attend-info-2 {
      border-top: px(1) solid #f5f5f5;
      .info-item {
        margin-right: 50%;
      }
    }
  }
  .sign-list {
    font-size: j(12);
  }
  .sign-list-title {
    padding: j(10) j(15) j(5);
  }
  .sign-list-item {
    @extend %df;
    padding: j(10) j(15) j(5);
    background-color: #fff;
    &:not(:last-child) {
      border: px(1) solid #f5f5f5;
      // @extend %bw05;
      // @extend %bw05b;
    }
    .icon {
      margin-right: j(8);
      color: #3aadeb;
    }
    .sign-list-item-content {
      @extend %df;
      @extend %fdc;
      .sign-list-item-content-date {
        margin-bottom: j(8);
      }
      .sign-list-item-content-location {
        color: #666;
      }
    }
  }
</style>
