import { useProSchemaRender } from '@/components'
import type { ApplyLeaveDeatil, ApplyOvertimeDeatil } from '@/types'
import { formatDate } from '@pkstar/utils'

export function useApplyDetailHooks() {
  const leaveFields = useProSchemaRender<ApplyLeaveDeatil>((s) => {
    // eslint-disable-next-line prefer-const
    let { startDt, endDt, isAllDay, pics } = s
    const dateFormat = isAllDay === 'Y' ? 'yyyy/MM/dd' : 'yyyy/MM/dd hh:mm'
    pics =
      pics?.map((item: string) => ({
        url: item,
      })) ?? []
    return [
      {
        is: 'HorCell',
        label: '用户部门',
        key: 'userdep',
      },
      {
        is: 'HorCell',
        label: '申请时间',
        key: 'createDt',
      },
      {
        is: 'HorCell',
        label: '请假类型',
        key: 'typeName',
      },
      {
        is: 'HorCell',
        label: '开始时间',
        value: formatDate(startDt, dateFormat),
      },
      {
        is: 'HorCell',
        label: '结束时间',
        value: formatDate(endDt, dateFormat),
      },
      {
        is: 'HorCell',
        label: '请假天数',
        key: 'days',
        hidden: () => isAllDay === 'N',
      },
      {
        is: 'HorCell',
        label: '请假小时',
        key: 'hours',
        hidden: () => isAllDay === 'Y',
      },
      {
        is: 'HorCell',
        label: '请假事由',
        key: 'reason',
      },
      {
        is: 'ProUploader',
        label: '',
        disabled: true,
        value: pics,
        hidden: () => pics.length <= 0,
      },
    ]
  })

  const overtimeFields = useProSchemaRender<ApplyOvertimeDeatil>((s) => {
    const { startDt, endDt, isAllDay } = s
    const dateFormat = isAllDay === 'Y' ? 'yyyy/MM/dd' : 'yyyy/MM/dd hh:mm'
    return [
      {
        is: 'HorCell',
        label: '用户部门',
        key: 'userdep',
      },
      {
        is: 'HorCell',
        label: '申请时间',
        key: 'createDt',
      },
      {
        is: 'HorCell',
        label: '加班地点',
        key: 'location',
      },
      {
        is: 'HorCell',
        label: '加班事由',
        key: 'reason',
      },
      {
        is: 'HorCell',
        label: '开始时间',
        value: formatDate(startDt, dateFormat),
      },
      {
        is: 'HorCell',
        label: '结束时间',
        value: formatDate(endDt, dateFormat),
      },
      {
        is: 'HorCell',
        label: '加班天数',
        key: 'days',
        hidden: () => isAllDay === 'N',
      },
      {
        is: 'HorCell',
        label: '加班小时',
        key: 'hours',
        hidden: () => isAllDay === 'Y',
      },
    ]
  })

  return {
    leaveFields,
    overtimeFields,
  }
}
