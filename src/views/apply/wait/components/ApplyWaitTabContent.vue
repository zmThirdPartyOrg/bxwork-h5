<template>
  <ProSearch :model-value="keyword" @search="handleSearch" />

  <!-- 刷新 下拉加载 -->
  <HorScroll
    ref="containerRef"
    :class="['tab-content-' + type]"
    :list-disabled="pagingStatus.pagingTotal <= 0"
    :pull-disabled="pagingStatus.pagingTotal <= 0"
    :finished="pagingFinished"
    @refresh="pagingRefresh"
    @load="pagingLoad"
  >
    <!-- 骨架屏 -->
    <ProSkeleton
      v-if="pagingStatus.pagingTotal <= 0"
      v-model:error="pagingStatus.pagingError"
      :loading="pagingStatus.pagingLoading"
      @refresh="pagingRefresh"
    />
    <ApplyCell
      class="c-m10"
      v-for="item in pagingData"
      :item="item"
      :key="item.approveId"
      :checked="!!hasSelectedMap[item.approveId]"
      @select="handleSelect(item)"
      applyType="wait"
      :with-checkbox="['overtime', 'leave'].includes(props.applyType)"
    />
  </HorScroll>
</template>

<script setup lang="ts">
  import { usePaging } from '@pkstar/vue-use'

  import { reqApplyList } from '@/api'
  import { useProSearch } from '@/components'
  import ApplyCell from '@/components/ApplyCell.vue'
  import type { ApplyItem } from '@/types'
  import { withLoading } from '@/utils'

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
    },
    applyType: {
      type: String,
      default: '',
    },
  })

  const [keyword, handleSearch] = useProSearch(() => pagingRefresh(true))
  // 分页 hooks
  const { pagingData, pagingRefresh, pagingLoad, pagingFinished, pagingStatus } = usePaging(
    async ([pageindex, pagesize], { loading }) => {
      const content = await withLoading(reqApplyList)(
        {
          pageindex,
          pagesize,
          applyType: 'wait',
          waitStatus: props.type,
          title: keyword.value,
          type: props.applyType,
        },
        loading,
      )
      return [content, 99]
    },
    {
      immediate: true,
      scrollSelector: `.tab-content-${props.type}`,
    },
  )

  // 选择
  const selected = ref<ApplyItem[]>([])
  const hasSelectedMap = computed(() => {
    return selected.value.reduce<Record<string, boolean>>((res, item) => {
      res[item.approveId] = true
      return res
    }, {})
  })
  const limitImportNum = 20
  const handleSelect = (item: ApplyItem) => {
    const { approveId } = item
    const index = selected.value.findIndex((item) => item.approveId === approveId)
    if (index > -1) {
      selected.value.splice(index, 1)
    } else {
      if (selected.value.length >= limitImportNum) {
        throw `单次最多可审批${limitImportNum}人`
      }
      selected.value.push(item)
    }
  }

  defineExpose({
    pagingRefresh,
    selected,
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;

  .batch-btn {
    position: fixed;
    right: 10px;
    bottom: 100px;
  }
</style>
