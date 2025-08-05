import type { DepItem, SysConfigDict } from '@/types'
import { createTrapInstance } from '@pkstar/utils'

// 通用页面刷新 & 筛选
export const refreshTrap = createTrapInstance<Record<string, any>>('trap:view:refresh')

// 公告列表刷新
export const noticeListTrap = createTrapInstance('trap:notice-list:refresh')

// 审批列表刷新
export const applyListTrap = createTrapInstance('trap:apply-list:refresh')

// 我的位置地名选择
export const locationNameTrap = createTrapInstance('trap:notice-list:refresh')

// 选择部门
export const selectDepTrap = createTrapInstance<DepItem>('trap:select-department:refresh')

// 选择请假类型
export const selectLeaveTrap = createTrapInstance<SysConfigDict>('trap:select-leave:refresh')
