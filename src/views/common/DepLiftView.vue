<template>
  <HorView class="dep-lift-view">
    <HorScroll
      class="dep-lift-scroll"
      :list-disabled="pagingStatus.pagingTotal <= 0"
      :pull-disabled="pagingStatus.pagingTotal <= 0"
      :finished="pagingFinished"
      @refresh="pagingRefresh"
      @load="pagingLoad"
    >
      <ProSkeleton
        v-if="pagingStatus.pagingTotal <= 0"
        v-model:error="pagingStatus.pagingError"
        :loading="pagingStatus.pagingLoading"
        @refresh="pagingRefresh"
      />
      <VanCell
        v-for="item in pagingData"
        :key="item.depId"
        :title="item.depName"
        @click="handleSelect(item)"
      ></VanCell>
    </HorScroll>
  </HorView>
</template>

<script setup lang="ts">
  import { getDepList } from '@/api'
  import type { DepItem } from '@/types'
  import { selectDepTrap } from '@/utils'
  import { usePaging } from '@pkstar/vue-use'

  // 分页 hooks
  const { pagingData, pagingRefresh, pagingLoad, pagingFinished, pagingStatus } =
    // eslint-disable-next-line vue/no-setup-props-destructure
    usePaging<DepItem>(
      async ([pageindex, pagesize], { loading }) => {
        const content = await getDepList({ pageindex, pagesize })
        return [content, 99]
      },
      {
        immediate: true,
        scrollSelector: `.dep-lift-scroll`,
        initialStatus: {
          pagingSize: 99,
        },
      },
    )

  const router = useRouter()
  const handleSelect = (item: any) => {
    console.log('handleSelect', item)
    selectDepTrap.trigger(item)
    router.back()
    return
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
