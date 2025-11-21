<template>
  <VanDialog
    title="批量操作"
    v-model:show="visible"
    show-cancel-button
    cancel-button-text="拒绝"
    confirm-button-text="同意"
    cancel-button-color="#f00"
    closeable
    close-on-click-overlay
  >
    <!-- 表单 -->
    <ProSchemaForm :metadata="formFileds">
      <template #selected="{ item }">
        <div class="c-item" v-for="(i, index) in item.value" :key="index" :item="i">
          <div class="c-item-header">
            <h3>{{ `指派${i.createBy ?? '--'}加班 ` }}</h3>
            <span class="c-item-status">{{
              applyStatusLabelMap(i?.submitStatus!, i?.auditStatus!)
            }}</span>
          </div>
          <ul class="c-item-content">
            <li class="c-item-cell">
              <span>申请时间：</span>
              <span>{{ i.modifyDt }}</span>
            </li>
          </ul>
        </div>
      </template>
    </ProSchemaForm>
    <template #footer>
      <div class="btn-bar">
        <VanButton type="warning" size="small" @click="handleRefuse">撤回</VanButton>
      </div>
    </template>
  </VanDialog>
</template>

<script setup lang="ts">
  import banana from '@pkstar/banana'
  import { sleep } from '@pkstar/utils'
  import { useVisible } from '@pkstar/vue-use'
  import { showSuccessToast } from 'vant'

  import { doApplyWithdraw } from '@/api'
  import { useProSchemaForm } from '@/components'
  import { useUserinfoStore } from '@/stores'
  import type { AssignOvertimeItem } from '@/types'
  import { applyStatusLabelMap } from '@/utils'

  const props = defineProps({
    title: {
      type: String,
      default: '批量操作',
    },
    selected: {
      type: Array as PropType<AssignOvertimeItem[]>,
      default: () => [],
    },
  })

  const dynamicProps = ref<Partial<typeof props>>()
  const computedProps = computed(() => Object.assign({}, props, dynamicProps.value))

  const formFileds = useProSchemaForm({
    selected: {
      value: [],
      label: '',
      is: 'HorCell',
      disabled: true,
      options: [],
      props: {
        direction: 'column',
        span: '3',
        labelKey: 'title',
        class: 'selected-cell',
      },
      slots: {
        selected: 'default',
      },
    },
  })

  const { visible, show, hide, confirm } = useVisible<Partial<typeof props & { selected: any[] }>>({
    showCallback: async (options) => {
      formFileds.selected.label = `共计${options?.selected?.length}条申请`
      formFileds.selected.value = options?.selected || []
    },
    confirmCallback() {},
  })
  // 拒绝
  const handleRefuse = async () => {
    const { selected } = banana.validate(formFileds)
    await doApplyWithdraw({
      approveId: selected.map((item: any) => item.approvalId),
    })
    showSuccessToast('已撤回')
    await sleep(1000)
    confirm()
  }

  defineExpose({
    show,
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  :deep() {
    .selected-cell {
      .hor-cell-value {
        display: flex;
        flex-direction: column;
        max-height: 260px;
        overflow: hidden auto;
      }
      .c-item-status {
        flex: 0 1 auto;
      }
    }
    .c-item-header h3 {
      font-size: 14px;
    }
    .c-item-cell {
      font-size: 12px;
    }
    .hor-textarea-content {
      min-height: 82px;
    }
  }
  .c-item {
    background-color: #f7f7f7;
    border-radius: #1989fa;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .btn-bar {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    button {
      width: 100px;
    }
  }
</style>
