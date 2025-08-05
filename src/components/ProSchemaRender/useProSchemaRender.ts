import type { ProSchemaRenderMetadata } from './types'

export function useProSchemaRender<T = any>(
  fields: ProSchemaRenderMetadata<T> | ((s: T) => ProSchemaRenderMetadata<T>),
) {
  return fields
}
