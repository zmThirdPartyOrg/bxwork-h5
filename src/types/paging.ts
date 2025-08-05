export type PagingParams<T = unknown> = {
  pageindex: number
  pagesize: number
} & T

export interface PagingResult<T = any> {
  total: number
  dataList: T[]
}
