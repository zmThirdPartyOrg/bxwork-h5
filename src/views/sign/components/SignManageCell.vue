<template>
  <dl class="attend-manage-cell c-item">
    <div class="c-item-header">
      <h3>{{ item.depName }}-{{ item.username }}</h3>
    </div>
    <ul class="c-item-content">
      <div class="c-item-cell">
        <span>签到时间：</span>
        <span>{{ item.dt }}</span>
      </div>
      <li class="c-item-cell is-fixed-label">
        <span>签到地点：</span>
        <span>{{ item.locationDetail || '-' }}</span>
      </li>
      <li class="c-item-cell">
        <span>备注：</span>
        <span>{{ item.remark || '-' }}</span>
      </li>
    </ul>
    <div class="c-item-footer">
      <button @click="emit('edit')">修改</button>
      <button @click="emit('del')">删除</button>
    </div>
  </dl>
</template>

<script setup lang="ts">
  import type { SignManageItem } from '@/types'

  defineProps({
    item: {
      type: Object as PropType<SignManageItem>,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['edit', 'del'])
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
