<template>
  <div class="pro-schema-filter-popup">
    <HorPopup :show="visible" @close="hide()" title="筛选">
      <div class="c-br"></div>

      <!-- 表单 -->
      <ProSchemaForm
        class="pro-schema-filter-form"
        :metadata="computedProps.metadata"
        @field-change="$emit('field-change', $event)"
      />

      <!-- 重置 确认 -->
      <HorFixedActions>
        <VanButton class="c-button" @click="handleReset">重置</VanButton>
        <VanButton class="c-button" type="primary" @click="handleSubmit">确认</VanButton>
      </HorFixedActions>

      <!-- seat -->
      <div class="c-ios-seat"></div>
    </HorPopup>

    <!-- 外部弹窗 -->
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { useVisible } from '@pkstar/vue-use'
  import { banana } from '@pkstar/banana'
  import { proSchemaFilterPopupProps, type ProSchemaFilterPopupProps } from './types'
  import { filterEmptyValue } from '@pkstar/utils'

  defineEmits(['field-change'])

  const props = defineProps(proSchemaFilterPopupProps)
  const dynamicProps = ref<Partial<ProSchemaFilterPopupProps>>({})
  const computedProps = computed<ProSchemaFilterPopupProps>(() =>
    Object.assign({}, props, dynamicProps.value),
  )

  const { visible, show, hide, confirm } = useVisible<
    Partial<ProSchemaFilterPopupProps>,
    Record<string, any>
  >({
    showCallback: async (options = {}) => {
      dynamicProps.value = options
    },
  })

  // 提交
  const handleSubmit = () => {
    const options = banana.validate(computedProps.value.metadata)
    const value = filterEmptyValue(options, true)
    confirm(value)
  }

  // 重置
  const handleReset = async () => {
    const metadata = await computedProps.value.reset?.()
    if (metadata) {
      dynamicProps.value.metadata = metadata
    }
  }

  defineExpose({
    show,
    hide,
    confirm,
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .pro-schema-filter-popup {
    :deep {
      .hor-view {
        background-color: #f2f3f4;
      }
    }
  }
  .pro-schema-filter-form {
    :deep {
      .hor-cell-label {
        @extend %fwb;
        font-size: j(15);
      }
    }
  }
  .c-ios-seat {
    height: j(100);
  }
</style>
