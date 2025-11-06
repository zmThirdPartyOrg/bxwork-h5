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
      <button @click="handleEdit">修改</button>
      <button @click="handleDel">删除</button>
    </div>
  </dl>
</template>

<script setup lang="ts">
  import { sleep } from '@pkstar/utils'
  import { showConfirmDialog, showToast } from 'vant'

  import type { AttendManageItem } from '@/types'

  const props = defineProps({
    item: {
      type: Object as PropType<AttendManageItem>,
      default: () => ({}),
    },
  })
  const router = useRouter()

  const handleEdit = () => {
    console.log('点击了修改', props.item)
  }

  // 删除
  const handleDel = async () => {
    await showConfirmDialog({
      title: '确认删除吗？',
      // confirmButtonText: '确定',
      // cancelButtonText: '取消',
    })
    sleep(1000)
    showToast('删除成功')
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
