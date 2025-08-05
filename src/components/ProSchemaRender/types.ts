export interface ProSchemaRenderField<T = any> {
  is?: any
  value?: any
  defValue?: any
  props?: any
  label?: string
  get?: (v: any, s: T) => any
  formatter?: (v: any, s: T) => any
  hidden?: boolean | ((v: any, s: T) => boolean)
  key?: string
  unit?: string
  children?: ProSchemaRenderMetadata<T>
  direction?: 'column' | 'row'
  [key: string]: any
}

export interface ProSchemaRenderFnFiled<T = any> {
  (s: T): ProSchemaRenderMetadata<T>
}

export type ProSchemaRenderMetadata<T = any> = (
  | ProSchemaRenderField<T>
  | ProSchemaRenderFnFiled<T>
)[]
