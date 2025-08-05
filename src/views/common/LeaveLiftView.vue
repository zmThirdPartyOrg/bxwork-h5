<template>
  <HorView class="dep-lift-view">
    <ProSkeleton v-if="!data" :loading="loading" :error="error" @refresh="trigger" />

    <HorScroll v-else class="home-scroll" :list-disabled="false" finished @refresh="trigger">
      <VanCell
        v-for="item in data"
        :key="item.dictId"
        :title="item.longName"
        :class="{ 'is-disabled': item.rest === 0 }"
        @click="handleSelect(item)"
      ></VanCell>
    </HorScroll>
  </HorView>
</template>

<script setup lang="ts">
  import { reqLeaveInfo } from '@/api'
  import { useSysConfigStore } from '@/stores'
  import type { LeaveInfoItem, SysConfigDict } from '@/types'
  import { selectLeaveTrap } from '@/utils'
  import { useAsyncTask } from '@pkstar/vue-use'

  const { sysConfig } = useSysConfigStore()

  const { data, error, loading, trigger } = useAsyncTask(
    async (cb: any) => {
      const res = await reqLeaveInfo()
      cb && cb()
      return res
    },
    {
      immediate: true,
    },
  )

  const router = useRouter()
  const handleSelect = (item: LeaveInfoItem) => {
    if (item.rest === 0) {
      return
    }
    console.log('handleSelect', item)
    selectLeaveTrap.trigger(item)
    router.back()
    return
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .is-disabled {
    color: #999;
  }
</style>
