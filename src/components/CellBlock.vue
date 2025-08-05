<template>
  <div class="cell-block" v-if="value">
    <div class="cell-label" v-html="label"></div>
    <div class="cell-value" v-html="crlf ? filterCRLF(value) : value"></div>
  </div>
</template>

<script setup lang="ts">
  import { filterCRLF } from '@pkstar/utils'

  defineProps({
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    crlf: {
      type: Boolean,
      default: false,
    },
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .cell-block {
    padding: j(12) j(16);
    word-break: break-all;
  }
  .cell-label {
    @extend %fwb;
    font-size: j(17);
  }
  .cell-value {
    margin-top: j(6);
    color: #454556;
    font-size: j(16);
  }
</style>
