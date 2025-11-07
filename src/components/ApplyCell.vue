<template>
  <div class="c-col-item van-hairline--bottom" @click="handleClick">
    <VanCheckbox
      v-if="withCheckbox"
      class="apply-cell-checkbox"
      :model-value="checked"
      @click.stop="emit('select')"
      shape="square"
      icon-size="16"
    ></VanCheckbox>
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
  import { applyStatusLabelMap, applyTypeValueMap } from '@/utils'

  const props = defineProps({
    item: {
      type: Object as PropType<ApplyItem>,
      default: () => {},
    },
    applyType: {
      type: String,
      default: '',
    },
    withCheckbox: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  })
  const emit = defineEmits(['select'])

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
  .apply-cell-checkbox {
    margin-right: 10px;
  }
</style>
