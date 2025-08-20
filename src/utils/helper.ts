// 计算跨天加班小时数，每天最多8小时
export function calculateLeaveHours(start: number, end: number): number {
  let totalHours = 0
  const currentDate = new Date(start)

  while (currentDate.getTime() < end) {
    // 设置当天结束时间为23:59:59
    const endOfDay = new Date(currentDate)
    endOfDay.setHours(23, 59, 59, 999)

    // 确定当天的实际结束时间（取当天结束或加班结束的较早者）
    const dayEnd = Math.min(endOfDay.getTime(), new Date(end).getTime())
    const dayStart = currentDate.getTime()

    // 计算当天加班小时数
    const dayDiff = dayEnd - dayStart
    const dayHours = dayDiff / (1000 * 60 * 60)

    // 每天最多8小时，向上取整后与8比较
    totalHours += Math.min(Math.ceil(dayHours), 8)

    // 移动到下一天的开始
    currentDate.setDate(currentDate.getDate() + 1)
    currentDate.setHours(0, 0, 0, 0)
  }

  return totalHours
}
