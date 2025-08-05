<template>
  <div class="form-field">
    <div class="form-field-label">
      <span> {{ label }} </span>
      <slot name="label-suffix"></slot>
    </div>
    <label class="form-field-value">
      <input
        :type="type"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInput"
        @compositionstart="handleCompositionstart"
        @compositionend="handleCompositionend"
      />
      <VanIcon v-show="modelValue" name="clear" @click="$emit('update:model-value', '')" />
      <slot name="value-suffix"></slot>
    </label>
  </div>
</template>

<script setup lang="ts">
  import { useComposition } from '@pkstar/vue-use'

  const emits = defineEmits(['update:model-value'])
  defineProps({
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    maxlength: {
      type: [String, Number],
      default: 99999,
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
    modelValue: {
      type: String,
      default: '',
    },
  })

  const { handleCompositionend, handleCompositionstart } = useComposition()
  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    if ((target as any).composing) {
      return
    }
    emits('update:model-value', target.value)
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;

  .form-field {
    @extend %bsb;
    @extend %df;
    @extend %fdc;
    @extend %c3;
    margin-top: j(18);
    width: j(300);
    border: px(1) solid #ccc;
    border-radius: j(7);
  }
  .form-field-label {
    @extend %df;
    @extend %jcs;
    padding: j(12) j(12) 0;
    font-size: j(14);
    line-height: j(14);
  }
  .form-field-value {
    @extend %df;
    @extend %aic;
    height: j(26);
    input {
      @extend %df1;
      @extend %h100;
      @extend %bsb;
      min-width: auto;
      padding: 0 j(12);
      font-size: j(14);
      border: none;
      height: j(26);
      width: 0;
      background-color: transparent;
    }
    i {
      @extend %c9;
      @extend %df;
      @extend %aic;
      @extend %jcc;
      width: j(40);
      height: j(40);
    }
  }
</style>
