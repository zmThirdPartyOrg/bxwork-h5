<template>
  <div class="c-col-item van-hairline--bottom c-m10" @click="handleClick">
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
  import type { AssignOvertimeItem } from '@/types'
  import { applyStatusLabelMap, applyTypeValueMap } from '@/utils'

  const props = defineProps({
    item: {
      type: Object as PropType<AssignOvertimeItem>,
      default: () => ({}),
    },
    applyType: {
      type: String,
      default: '',
    },
  })

  const router = useRouter()
  const handleClick = () => {
    console.log(props.item)
    const item = props.item
    router.push({
      path: `/apply/${item?.approvalId}`,
      query: {
        title: `指派${item.createBy ?? '--'}加班`,
        applyType: props.applyType,
      },
    })
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
