<template>
  <div class="filter-button" :class="{ 'is-active': isActive }" @click="handleFilter">
    <HorIcon class="icon" size="22" name="filter-o" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { isEmptyObject } from '@pkstar/utils'

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
  @import '@/assets/scss/define.scss';

  .filter-button {
    @extend %c9;
    @extend %df;
    @extend %fdc;
    @extend %aic;
    font-size: j(12);
    line-height: j(14);
    .icon {
      @extend %c9;
    }
    // &.is-active {
    //   color: $color-primary;
    //   .icon {
    //     color: $color-primary;
    //   }
    // }
  }
</style>
