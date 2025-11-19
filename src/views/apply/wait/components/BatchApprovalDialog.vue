<template>
  <VanDialog
    title="批量审批"
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
            <h3>{{ i.title }}</h3>
            <span class="c-item-status">{{
              applyStatusLabelMap(i?.submitStatus!, i?.status!)
            }}</span>
          </div>
          <ul class="c-item-content">
            <li class="c-item-cell">
              <span>申请时间：</span>
              <span>{{ i.modifyDt }}</span>
            </li>
          </ul>
        </div>
        <!-- <dl v-for="(tag, index) in item.value" :key="index">
          <dt></dt>
          <dd>{{ tag.title }}-{{ tag.modifyDt }}</dd>
        </dl> -->
        <!-- <VanSpace>
          <VanTag type="primary" plain v-for="(tag, index) in item.value" :key="index"
            >{{ tag.title }}-{{ tag.modifyDt }}</VanTag
          >
        </VanSpace> -->
      </template>
    </ProSchemaForm>
    <template #footer>
      <div class="btn-bar">
        <VanButton type="danger" size="small" @click="handleRefuse">拒绝</VanButton>
        <VanButton type="primary" size="small" @click="handleAgree">同意</VanButton>
      </div>
    </template>
  </VanDialog>
</template>

<script setup lang="ts">
  import banana from '@pkstar/banana'
  import { sleep } from '@pkstar/utils'
  import { useVisible } from '@pkstar/vue-use'
  import { showSuccessToast } from 'vant'

  import { doApplyAgree, doApplyRefuse } from '@/api'
  import { useProSchemaForm } from '@/components'
  import { useUserinfoStore } from '@/stores'
  import type { ApplyItem } from '@/types'
  import { applyStatusLabelMap } from '@/utils'

  const { userinfo } = useUserinfoStore()

  const props = defineProps({
    title: {
      type: String,
      default: '批量审批',
    },
    selected: {
      type: Array as PropType<ApplyItem[]>,
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
    comment: {
      value: '',
      is: 'HorTextarea',
      props: {
        maxlength: 150,
        placeholder: '请输入内容',
      },
      // hidden: true,
    },
  })

  const { visible, show, hide, confirm } = useVisible<Partial<typeof props & { selected: any[] }>>({
    showCallback: async (options) => {
      formFileds.comment.value = ''
      formFileds.selected.label = `共计${options?.selected?.length}条申请`
      formFileds.selected.value = options?.selected || []
    },
    confirmCallback() {},
  })
  // 拒绝
  const handleRefuse = async () => {
    const { selected, comment } = banana.validate(formFileds)
    await doApplyRefuse({
      approveId: selected.map((item: any) => item.approveId),
      approveUserId: userinfo?.content?.userId ?? '',
      comment,
      status: 'deny',
    })
    showSuccessToast('已拒绝')
    await sleep(1000)
    confirm()
  }
  // 同意
  const handleAgree = async () => {
    const { selected, comment } = banana.validate(formFileds)
    await doApplyAgree({
      approveId: selected.map((item: any) => item.approveId),
      approveUserId: userinfo?.content.userId ?? '',
      comment,
      status: 'pass',
    })
    showSuccessToast('已同意')
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
