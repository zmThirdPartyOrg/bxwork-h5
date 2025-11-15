<template>
  <dl class="attend-manage-cell c-item">
    <div class="c-item-header">
      <h3>{{ item.createBy }}</h3>
      <span
        class="c-item-status"
        :class="item.attendType === 'startwork' ? 'is-info' : 'is-success'"
        >{{ item.attendType === 'startwork' ? '上班' : '下班' }}
        <HorIcon name="i-filter" size="22" />
      </span>
    </div>
    <ul class="c-item-content">
      <div class="c-item-cell">
        <span>打卡时间：</span>
        <span>{{ item.attendTime }} </span>
      </div>
      <li class="c-item-cell is-fixed-label">
        <span>打卡地点：</span>
        <span>{{ item.location || '-' }}</span>
      </li>
      <li class="c-item-cell">
        <span>备注：</span>
        <span>{{ item.remark || '-' }}</span>
      </li>
    </ul>
    <div class="c-item-footer" v-if="isLeader">
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
  const isLeader = computed(() => userinfo?.content.isLeader === 'N')
  const props = defineProps({
    item: {
      type: Object as PropType<AttendManageItem>,
      default: () => ({}),
    },
  })
  const router = useRouter()
  const emit = defineEmits(['edit', 'del'])

  const handleEdit = () => {
    console.log('点击了修改', props.item)
    router.push({
      path: `/attend/manage/form/${props.item.attendId}`,
      query: {
        detail: JSON.stringify(omit(props.item, ['sysUser'])),
      },
    })
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
