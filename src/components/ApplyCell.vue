<template>
  <div class="c-col-item van-hairline--bottom" @click="handleClick">
    <img class="icon" :src="applyTypeValueMap[item?.type!]?.icon" alt="" srcset="" />
    <div class="c-col-item-content">
      <div class="c-col-item-title">
        <span class="title">{{ item?.title }}</span>
        <span class="sub-text">{{ item?.modifyDt }}</span>
      </div>
      <div class="c-col-item-text">
        <span class="c-text-primary">{{
          applyStatusLabelMap(item?.submitStatus!, item?.status!)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ApplyItem } from '@/types'
  import { applyTypeValueMap, applyStatusLabelMap } from '@/utils'

  const props = defineProps({
    item: {
      type: Object as PropType<ApplyItem>,
    },
    applyType: {
      type: String,
      default: '',
    },
  })

  const router = useRouter()
  const handleClick = () => {
    console.log(props.item)
    router.push({
      path: `/apply/${props.item?.approveId}`,
      query: {
        title: props.item?.title,
        applyType: props.applyType,
      },
    })
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
