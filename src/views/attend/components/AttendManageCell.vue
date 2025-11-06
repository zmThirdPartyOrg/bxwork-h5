<template>
  <dl class="attend-manage-cell c-item">
    <div class="c-item-header">
      <h3>{{ item.depName }}-{{ item.username }}</h3>
      <span class="c-item-status" :class="item.type === '上班' ? 'is-info' : 'is-success'"
        >{{ item.type }}
        <HorIcon name="i-filter" size="22" />
      </span>
    </div>
    <ul class="c-item-content">
      <div class="c-item-cell">
        <span>打卡时间：</span>
        <span>{{ item.date }} {{ item.time }}</span>
      </div>
      <li class="c-item-cell is-fixed-label">
        <span>打卡地点：</span>
        <span>{{ item.address }}{{ item.address }}{{ item.address }}{{ item.address }}</span>
      </li>
      <li class="c-item-cell">
        <span>备注：</span>
        <span></span>
      </li>
    </ul>
    <div class="c-item-footer">
      <button @click="handleClick">修改</button>
      <button>删除</button>
    </div>
  </dl>
</template>

<script setup lang="ts">
  import type { AttendManageItem } from '@/types'

  const props = defineProps({
    item: {
      type: Object as PropType<AttendManageItem>,
      default: () => ({}),
    },
  })
  const router = useRouter()

  const handleClick = () => {
    router.push({
      path: '/attend/attend-manage/attend-manage-edit',
      query: {
        id: props.item.id,
      },
    })
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
