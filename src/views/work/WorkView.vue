<template>
  <HorView class="work-view" :left-arrow="false" title="我的工作">
    <div class="work-menu">
      <h4 class="work-menu-title">常用功能</h4>
      <ul class="work-menu-content">
        <template v-for="(item, index) in workMeuns" :key="index">
          <li class="work-meun-item" v-if="!item.hidden" @click="handleTransfer(item)">
            <img :src="item.icon" alt="" srcset="" />
            <span>{{ item.title }}</span>
          </li>
        </template>
      </ul>
    </div>
  </HorView>
</template>

<script setup lang="ts">
  import { __DEV__ } from '@/utils'
  import { useTransfer } from '@pkstar/vue-use'

  const handleTransfer = useTransfer()

  const workMeuns = [
    {
      title: '公告',
      icon: new URL('@/assets/img/icon/woke_announcement.png', import.meta.url).href,
      to: '/oa/notice',
    },
    {
      title: '打卡',
      icon: new URL('@/assets/img/icon/woke_punchcard.png', import.meta.url).href,
      to: '/attend',
    },
    {
      title: '签到',
      icon: new URL('@/assets/img/icon/woke_sign.png', import.meta.url).href,
      to: '/sign',
    },
    {
      title: '审批',
      icon: new URL('@/assets/img/icon/woke_approval.png', import.meta.url).href,
      to: '/apply',
    },
    {
      title: '刷新页面',
      icon: new URL('@/assets/img/icon/woke_approval.png', import.meta.url).href,
      fn: () => {
        window.location.reload()
      },
      hidden: !__DEV__,
    },
  ]
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .work-menu {
    font-size: j(14);
    background-color: #fff;
    padding: j(10) j(15);
    margin-top: j(15);
    .work-menu-title {
      font-weight: normal;
    }
  }
  .work-menu-content {
    margin-top: j(15);
    display: flex; // 使用 Flexbox 布局
    flex-wrap: wrap; // 允许换行
    justify-content: space-between; // 项目均匀分布
  }
  .work-meun-item {
    flex: 0 0 25%; // 每个菜单项占 25% 的宽度
    box-sizing: border-box; // 包含内边距和边框
    padding: j(5); // 添加内边距
    display: flex; // 内部元素垂直居中
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: j(5);
  }
  .work-meun-item img {
    width: j(20); // 设置图片宽度
    height: j(20); // 设置图片高度
    margin-bottom: j(5); // 图片与文字之间的间距
    object-fit: contain;
    object-position: center;
  }
</style>
