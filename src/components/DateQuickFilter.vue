<template>
  <div class="date-filter-container">
    <div
      v-for="option in dateOptions"
      :key="option.value"
      :class="['date-filter-item', { active: modelValue === option.value }]"
      @click="handleSelect(option.value)"
    >
      {{ option.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatDate } from '@pkstar/utils'

  // 定义组件的 Props
  interface Props {
    modelValue?: string
    options?: Array<{ label: string; value: string }>
  }

  // 定义组件的 Emits
  interface Emits {
    (e: 'update:modelValue', value: string): void
    (e: 'change', value: string): void
    (e: 'dateChange', startDate: string, endDate: string): void
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    options: () => [
      { label: '当日', value: 'today' },
      { label: '近3日', value: '3days' },
      { label: '近7日', value: '7days' },
    ],
  })

  const emit = defineEmits<Emits>()

  // 日期选项
  const dateOptions = computed(() => props.options)

  // 处理选项选择
  const handleSelect = (value: string) => {
    // 如果点击已选中的选项，则取消选择
    const newValue = value === props.modelValue ? '' : value
    emit('update:modelValue', newValue)
    emit('change', newValue)

    // 计算并发送日期范围
    if (newValue) {
      const { startDate, endDate } = calculateDateRange(newValue)
      emit('dateChange', startDate, endDate)
    } else {
      emit('dateChange', '', '')
    }
  }

  // 根据选择的值计算日期范围
  const calculateDateRange = (range: string) => {
    const today = new Date()
    const endDate = new Date(today)
    const startDate = new Date(today)

    switch (range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case '3days':
        startDate.setDate(today.getDate() - 2)
        startDate.setHours(0, 0, 0, 0)
        break
      case '7days':
        startDate.setDate(today.getDate() - 6)
        startDate.setHours(0, 0, 0, 0)
        break
    }

    return {
      startDate: formatDate(startDate, 'yyyy-MM-dd'),
      endDate: formatDate(endDate, 'yyyy-MM-dd'),
    }
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;

  .date-filter-container {
    display: flex;
    gap: 12px;
    padding: 10px;
    background-color: #fff;
    margin-bottom: 4px;
  }

  .date-filter-item {
    flex: 1;
    text-align: center;
    padding: 4px 0;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    color: #666;
    font-size: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .date-filter-item.active {
    border-color: $color-primary;
    background-color: $color-primary;
    color: #fff;
  }

  .date-filter-item:active {
    opacity: 0.8;
  }
</style>
