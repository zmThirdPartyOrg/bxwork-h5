<template>
  <div class="c-col-item van-hairline--bottom c-m10" @click="handleClick">
    <VanCheckbox
      v-if="['init'].includes(item.auditStatus) && ['submit'].includes(item.submitStatus)"
      class="cell-checkbox"
      :model-value="checked"
      @click.stop="emit('select')"
      shape="square"
      icon-size="16"
    ></VanCheckbox>
    <img class="icon" :src="applyTypeValueMap.overtime?.icon" alt="" srcset="" />
    <div class="c-col-item-content">
      <div class="c-col-item-title">
        <span class="title">{{ `指派${item.createBy ?? '--'}加班 ` }}</span>
        <span class="sub-text">{{ item.modifyDt }}</span>
      </div>
      <div class="c-col-item-text">
        加班时长：{{ item.isAllDay === 'Y' ? item.days + '天' : item.hours + '小时' }}
      </div>
      <div class="c-col-item-text">
        <span class="c-text-primary">{{
          applyStatusLabelMap(item?.submitStatus!, item?.auditStatus!)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reqApplyDetail } from '@/api'
  import type { AssignOvertimeItem } from '@/types'
  import { applyStatusLabelMap, applyTypeValueMap, withLoading } from '@/utils'

  const props = defineProps({
    item: {
      type: Object as PropType<AssignOvertimeItem>,
      default: () => ({}),
    },
    applyType: {
      type: String,
      default: '',
    },
    checked: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['select'])

  const router = useRouter()
  const handleClick = async () => {
    await withLoading(async () => {
      console.log(props.item)
      const item = props.item
      await reqApplyDetail({ approveId: item?.approvalId })
      router.push({
        path: `/apply/${item?.approvalId}`,
        query: {
          title: `指派${item.createBy ?? '--'}加班`,
          applyType: props.applyType,
        },
      })
    })()
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;

  .cell-checkbox {
    margin-right: 10px;
  }
</style>
