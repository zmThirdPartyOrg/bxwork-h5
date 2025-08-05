<template>
  <HorView class="apply-home-view">
    <ul class="apply-menu">
      <li
        class="apply-menu-item"
        v-for="(item, index) in applyMenu"
        :key="index"
        @click="$router.push(item.path)"
      >
        <img class="img" :src="item.icon" />
        <span>{{ item.title }}</span>
      </li>
    </ul>

    <div class="c-bar"></div>

    <ul class="oa-meun">
      <li
        class="oa-menu-item"
        v-for="(item, index) in oaMenu"
        :key="index"
        @click="$router.push(item.path)"
      >
        <img class="img" :src="item.icon" />
        <span>{{ item.title }}</span>
      </li>
    </ul>
  </HorView>
</template>

<script setup lang="ts">
  const applyMenu = ref([
    {
      title: '待我审批',
      icon: new URL('@/assets/img/icon/approval_myapproval.png', import.meta.url).href,
      path: '/apply/wait',
    },
    {
      title: '我发起的',
      icon: new URL('@/assets/img/icon/approval_myinitiated.png', import.meta.url).href,
      path: '/apply/my',
    },
    {
      title: '我审批的',
      icon: new URL('@/assets/img/icon/approval_copymy.png', import.meta.url).href,
      path: '/apply/done',
    },
    {
      title: '抄送给我',
      icon: new URL('@/assets/img/icon/approval_cc_tv.png', import.meta.url).href,
      path: '/apply/notice',
    },
  ])

  const oaMenu = ref([
    {
      title: '请假',
      icon: new URL('@/assets/img/icon/approval_leave.png', import.meta.url).href,
      path: '/apply/leave',
    },
    {
      title: '加班',
      icon: new URL('@/assets/img/icon/approval_overtime.png', import.meta.url).href,
      path: '/apply/overtime',
    },
  ])
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .apply-menu {
    padding: j(20) j(15) j(10);
    background-color: #fff;
    @extend %df;
    @extend %fww;
  }
  .apply-menu-item {
    color: #fff;
    background-color: $color-primary;
    border-radius: j(10);
    height: j(60);
    padding-left: j(15);
    width: j(165);
    margin-bottom: j(10);
    font-size: j(14);
    @extend %bsb;
    @extend %df;
    @extend %aic;
    &:nth-child(2n) {
      margin-left: auto;
    }

    .img {
      margin-right: j(10);
      width: j(30);
      height: j(30);
      background-color: #fff;
      border-radius: j(15);
      text-align: center;
      line-height: j(30);
      color: $color-primary;
    }
  }

  .oa-meun {
    @extend %df;
    @extend %fww;
    padding: j(15) j(15) j(5);
    background-color: #fff;
    font-size: j(14);
    .oa-menu-item {
      @extend %df;
      @extend %aic;
      @extend %fdc;

      width: 20%;
      line-height: j(30);
      color: $color-primary;
    }
  }
</style>
