<template>
  <VanDialog
    :title="computedProps.title"
    v-model:show="visible"
    show-cancel-button
    @cancel="hide"
    @confirm="confirm"
  >
    <!-- 表单 -->
    <ProSchemaForm :metadata="formFileds" />
  </VanDialog>
</template>

<script setup lang="ts">
  import { useProSchemaForm } from '@/components'
  import banana from '@pkstar/banana'
  import { useVisible } from '@pkstar/vue-use'

  const props = defineProps({
    title: {
      type: String,
      default: '标题',
    },
    a: {
      type: Number,
      default: 1,
    },
  })

  const dynamicProps = ref<Partial<typeof props>>()
  const computedProps = computed(() => Object.assign({}, props, dynamicProps.value))

  const formFileds = useProSchemaForm({
    comment: {
      value: '',
      is: 'HorTextarea',
      props: {
        maxlength: 150,
        placeholder: '请输入内容',
      },
    },
  })

  const { visible, show, hide, confirm } = useVisible<Partial<typeof props>>({
    showCallback: async (options) => {
      dynamicProps.value = options
    },
    confirmCallback() {
      const options = banana.validate(formFileds)
      console.log('formFileds.value', formFileds, options)
      return options
    },
  })

  defineExpose({
    show,
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
