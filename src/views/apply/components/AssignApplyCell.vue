<template>
  <div class="c-col-item van-hairline--bottom" @click="handleClick">
    <img class="icon" :src="applyTypeValueMap.overtime?.icon" alt="" srcset="" />
    <div class="c-col-item-content">
      <div class="c-col-item-title">
        <span class="title">{{ `${item.assignCreateBy}指派${item.createBy}加班` }}</span>
        <span class="sub-text">{{ item.createDt }}</span>
      </div>
      <div class="c-col-item-text">
        <!-- <span class="c-text-primary">{{
          applyStatusLabelMap(item?.submitStatus!, item?.status!)
        }}</span> -->
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
    // router.push({
    //   path: `/apply/${props.item?.approveId}`,
    //   query: {
    //     title: props.item?.title,
    //     applyType: props.applyType,
    //   },
    // })
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
