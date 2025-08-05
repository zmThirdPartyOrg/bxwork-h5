<template>
  <div class="pro-schema-render">
    <ProSchemaRenderComponent :metadata="computeMetadata">
      <template v-for="key in Object.keys($slots)" :key="key" #[key]="data">
        <slot :name="key" v-bind="data" />
      </template>
    </ProSchemaRenderComponent>
  </div>
</template>

<script setup lang="ts">
  import { isEmpty, isFunction } from '@pkstar/utils'
  import type { PropType } from 'vue'

  import ProSchemaRenderComponent from './ProSchemaRenderComponent.vue'
  import type { ProSchemaRenderField, ProSchemaRenderMetadata } from './types'

  type FormatRenderMetadataFiled = Omit<ProSchemaRenderField, 'children'> & {
    children: FormatRenderMetadataFiled[]
  }

  const props = defineProps({
    fields: {
      type: [Array, Function] as PropType<
        ProSchemaRenderMetadata | ((s: any) => ProSchemaRenderMetadata)
      >,
      default: () => [],
    },
    source: { type: Object, default: () => ({}) },
    shwoEmptyField: { type: Boolean, default: false },
  })

  const computeMetadata = computed(() => {
    const source = props.source
    const loop = (data: ProSchemaRenderMetadata) => {
      const result: FormatRenderMetadataFiled[] = []

      if (isFunction(data)) {
        data = data(source)
      }

      data.forEach((item) => {
        if (isFunction(item)) {
          result.push(...loop(item(source)))
          return
        }
        // eslint-disable-next-line prefer-const
        let { key = '', children, hidden, get, unit, defValue, value: initialVal } = item
        let value = source[key] ?? initialVal

        if (get) {
          value = get(value, source)
        }
        if (isFunction(hidden)) {
          item.hidden = hidden(value, source)
        }
        if (children) {
          item.children = loop(children)
        }
        if (unit) {
          value = `${value}${unit}`
        }
        if (isEmpty(value)) {
          value = defValue
        }
        if (isEmpty(value) && !item.children?.length && key && !props.shwoEmptyField) {
          item.hidden = true
        }
        if (!key && item.children && !item.children.length) {
          item.hidden = true
        }
        if (!item.hidden) {
          result.push((isEmpty(value) ? { ...item } : { ...item, value }) as any)
        }
      })

      return result
    }
    return loop(isFunction(props.fields) ? props.fields(source) : props.fields)
  })
</script>

<style lang="scss">
  @use '@/assets/scss/define.scss' as *;
  .pro-schema-render {
    // padding-top: j(10);
    .hor-cell-group {
      margin-bottom: j(10);
    }
  }
</style>
