<template>
  <HorView class="lift-view">
    <template #right>
      <span @click="handleClear">清空</span>
    </template>
    <ProSearch placeholder="请输入姓名" :model-value="keyword" @search="handleSearch" />

    <HorScroll
      class="lift-scroll"
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
        :key="item.userId"
        :title="item.realName"
        clickable
        @click="handleSelect(item)"
      >
        <template #right-icon>
          <HorIcon name="success" v-if="isSelected(item)" />
        </template>
      </VanCell>
    </HorScroll>

    <HorFixedActions>
      <VanButton class="c-button" type="primary" @click="handleConfirm"
        >确定({{ selectedUsers.length }})</VanButton
      >
    </HorFixedActions>
  </HorView>
</template>

<script setup lang="ts">
  import { usePaging, useQuery } from '@pkstar/vue-use'

  import { reqAssignUsers } from '@/api'
  import { useProSearch } from '@/components'
  import type { AssignOvertimeUser } from '@/types'
  import { selectUserTrap, withLoading } from '@/utils'

  // 定义 props
  const props = defineProps({
    // 最大选择数量
    max: {
      type: Number,
      default: Infinity,
    },
  })

  const query = useQuery()
  const router = useRouter()

  const [keyword, handleSearch] = useProSearch(() => {
    pagingRefresh(true)
  })

  // 分页 hooks
  const { pagingData, pagingRefresh, pagingLoad, pagingFinished, pagingStatus } =
    usePaging<AssignOvertimeUser>(
      async ([], { loading }) => {
        const content = await withLoading(reqAssignUsers, loading)(keyword.value)
        return [content, content.length]
      },
      {
        immediate: true,
        scrollSelector: `.lift-scroll`,
      },
    )

  // 初始化选中的用户
  const initSelectedUsers = () => {
    const selected = query.selected
    if (selected) {
      try {
        const parsed = JSON.parse(decodeURIComponent(selected as string))
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        console.error('解析选中用户失败:', e)
        return []
      }
    }
    return []
  }

  const selectedUsers = ref<AssignOvertimeUser[]>(initSelectedUsers())

  // 检查用户是否被选中
  const isSelected = (item: AssignOvertimeUser) => {
    return selectedUsers.value.some((user) => user.userId === item.userId)
  }

  // 处理用户选择
  const handleSelect = (item: AssignOvertimeUser) => {
    const index = selectedUsers.value.findIndex((user) => user.userId === item.userId)
    if (index > -1) {
      // 如果已选中，则取消选择
      selectedUsers.value.splice(index, 1)
    } else {
      // 如果未选中，检查是否超过最大选择数量
      if (selectedUsers.value.length >= props.max) {
        throw `最多只能选择${props.max}个用户`
      }
      // 添加到选择列表
      selectedUsers.value.push(item)
    }
  }

  const handleClear = () => {
    selectedUsers.value = []
  }

  const handleConfirm = () => {
    selectUserTrap.trigger(selectedUsers.value)
    router.back()
    return
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
