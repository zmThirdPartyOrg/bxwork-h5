<template>
  <dl class="attend-manage-cell c-item">
    <div class="c-item-header">
      <h3>{{ item.createBy }}</h3>
    </div>
    <ul class="c-item-content">
      <div class="c-item-cell">
        <span>签到时间：</span>
        <span>{{ item.attendTime }}</span>
      </div>
      <li class="c-item-cell is-fixed-label">
        <span>签到地点：</span>
        <span>{{ item.location || '-' }}</span>
      </li>
      <li class="c-item-cell">
        <span>备注：</span>
        <span>{{ item.remark || '-' }}</span>
      </li>
    </ul>
    <div class="c-item-footer" v-if="isLeader && item.userId !== userinfo?.content.userId">
      <button @click="handleEdit">修改</button>
      <button @click="emit('del')">删除</button>
    </div>
  </dl>
</template>

<script setup lang="ts">
  import { omit } from '@pkstar/utils'

  import { useUserinfoStore } from '@/stores'
  import type { AttendManageItem } from '@/types'

  const { userinfo } = useUserinfoStore()
  const isLeader = computed(() => userinfo?.content.isLeader === 'Y')

  const props = defineProps({
    item: {
      type: Object as PropType<AttendManageItem>,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['edit', 'del'])

  const router = useRouter()
  const handleEdit = () => {
    console.log('点击了修改', props.item)
    router.push({
      path: `/sign/manage/form/${props.item.attendId}`,
      query: {
        detail: JSON.stringify(omit(props.item, ['sysUser'])),
      },
    })
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
