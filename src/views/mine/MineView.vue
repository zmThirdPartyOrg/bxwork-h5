<template>
  <HorView title="个人中心" class="mine-view" :left-arrow="false">
    <HeaderSection />

    <ProSchemaRender class="c-m10" :fields="fields">
      <template #role>
        <span>{{ userinfo?.content.roleName }}</span>
      </template>
    </ProSchemaRender>

    <div class="c-bar"></div>

    <van-button class="c-button" @click="handleLogout">退出登录</van-button>

    <HorActionSheet ref="horActionSheetInstance" />
  </HorView>
</template>

<script setup lang="ts">
  import { useProSchemaRender } from '@/components'
  import HeaderSection from './components/HeaderSection.vue'
  import { showConfirmDialog, showToast } from 'vant'
  import { useUserinfoStore } from '@/stores'
  import { useRoleActionSheet } from '@/hooks'

  const { logout } = useUserinfoStore()
  const [horActionSheetInstance, handleRole, userinfo] = useRoleActionSheet()

  const fields = useProSchemaRender([
    {
      is: 'HorCellGroup',
      children: [
        {
          is: 'HorCell',
          label: '个人资料',
          to: '/profile',
          icon: 'contact-o',
          class: 'status-1',
          arrow: true,
        },
        {
          is: 'HorCell',
          label: '当前角色',
          fn: handleRole,
          icon: 'description-o',
          class: 'status-2',
          // value: userinfo.value?.content.roleName,
          arrow: true,
          slots: {
            role: 'default',
          },
        },
        {
          is: 'HorCell',
          label: '修改密码',
          to: '/password-reset',
          icon: 'browsing-history-o',
          class: 'status-3',
          arrow: true,
        },
        {
          is: 'HorCell',
          label: '清除缓存',
          fn: async () => {
            // await clearCache()
            showToast('清除成功')
          },
          icon: 'guide-o',
          class: 'status-2',
          arrow: true,
        },
      ],
    },
  ])

  const handleLogout = async () => {
    await showConfirmDialog({
      title: '提示',
      message: '是否退出登录',
    })
    logout()
    showToast('退出登录成功')
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  :deep() {
    .van-nav-bar {
      &.van-hairline--bottom:after {
        border-color: $color-primary;
      }
    }
    .status-1 {
      .hor-cell-label {
        i {
          color: #7197f7;
        }
      }
    }
    .status-2 {
      .hor-cell-label {
        i {
          color: #5cc95a;
        }
      }
    }
    .status-3 {
      .hor-cell-label {
        i {
          color: #e36e68;
        }
      }
    }
  }
  .c-button {
    width: 100% !important;
  }
</style>
