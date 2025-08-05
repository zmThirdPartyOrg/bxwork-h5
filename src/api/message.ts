import { withLoading } from '@/utils'
import { curl } from './curl'
import type { PagingParams, PagingResult, MessageItem } from '@/types'

// // 消息列表
// export const reqMessageList = withLoading(
//   (data: PagingParams) => curl<PagingResult<MessageItem>>(`/user/messages.json`, data),
//   false,
// )
