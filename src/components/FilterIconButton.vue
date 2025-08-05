<template>
  <VanFloatingBubble v-if="isMiniProgram" icon="filter-o" @click="handleFilter" />
  <VanIcon
    v-else
    class="filter-icon-button"
    :class="{ 'is-active': isActive }"
    size="24"
    name="filter-o"
    @click="handleFilter"
  />
</template>

<script setup lang="ts">
  import { isEmptyObject } from '@pkstar/utils'
  import { isMiniProgram } from '@/utils'

  const props = defineProps({
    path: {
      type: String,
      default: '',
    },
    queryParams: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  })

  const router = useRouter()
  const handleFilter = () => {
    const { path, queryParams } = props
    router.push({ path, query: { queryParams: JSON.stringify(queryParams) } })
  }

  const isActive = computed(() => {
    return !isEmptyObject(props.queryParams)
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .filter-icon-button {
    @extend %c9;
    &.is-active {
      color: $color-primary;
    }
  }
</style>
