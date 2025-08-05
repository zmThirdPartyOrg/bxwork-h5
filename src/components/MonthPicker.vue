<template>
  <div class="month-select c-select" @click="show">
    <span class="c-select-text">{{ modelValue }}</span>
    <HorIcon name="arrow-down" size="20" />
  </div>
  <van-popup round @close="hide()" :show="visible" position="bottom">
    <van-date-picker
      v-if="visible"
      title="选择月份"
      v-model="currentMonth"
      :columns-type="['year', 'month']"
      :min-date="new Date(1900, 0, 1)"
      :max-date="new Date()"
      @cancel="hide()"
      @confirm="confirm"
    />
  </van-popup>
</template>

<script setup lang="ts">
  import { useVisible } from '@pkstar/vue-use'

  const currentMonth = ref(['2021', '01'])

  const { visible, show, hide, confirm } = useVisible({
    showCallback() {
      currentMonth.value = props.modelValue.split('-')
    },
    confirmCallback(res) {
      console.log(res)
      emits('update:modelValue', res.selectedValues.join('-'))
    },
  })

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })

  const emits = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
