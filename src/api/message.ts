import type { MessageItem, PagingParams, PagingResult } from '@/types'
import { withLoading } from '@/utils'

import { curl } from './curl'

// // 消息列表
// export const reqMessageList = withLoading(
//   (data: PagingParams) => curl<PagingResult<MessageItem>>(`/user/messages.json`, data),
//   false,
// )
