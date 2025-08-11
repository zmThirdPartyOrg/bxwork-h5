<template>
  <HorView class="">
    <div class="c-bar"></div>
    <ProSchemaForm :metadata="fields"> </ProSchemaForm>

    <ProEndDivider />

    <HorFixedActions>
      <VanButton class="c-button" type="primary" @click="handleSubmit">提交</VanButton>
    </HorFixedActions>

    <HorDatePicker ref="datePickerInstance"></HorDatePicker>

    <HorDateTimePicker
      ref="dateTimePickerInstance"
      value-format="yyyy/MM/dd hh:mm"
      :columns-type="['year', 'month', 'day', 'hour', 'minute']"
    ></HorDateTimePicker>

    <ReceiverDialog ref="receiverDialogInstance" />
  </HorView>
</template>

<script setup lang="ts">
  import type { HorDatePickerInstance, HorDateTimePickerInstance } from '@daysnap/horn-ui'
  import banana from '@pkstar/banana'
  import { formatDate } from '@pkstar/utils'
  import { useKeepAlive, useQuery } from '@pkstar/vue-use'
  import { showSuccessToast } from 'vant'

  import { doApplyOvertime, reqLeaveInfo } from '@/api'
  import { useProSchemaForm } from '@/components'
  import { useUserinfoStore } from '@/stores'
  import { applyListTrap } from '@/utils'
  import ReceiverDialog from '@/views/apply/components/ReciverDialog.vue'

  useKeepAlive()

  const { userinfo } = useUserinfoStore()
  const { detail } = useQuery()
  const detailObj = detail ? JSON.parse(detail) : ''
  console.log(detailObj)

  const datePickerInstance = ref() as Ref<HorDatePickerInstance>
  const dateTimePickerInstance = ref() as Ref<HorDateTimePickerInstance>
  const receiverDialogInstance = ref() as Ref<InstanceType<typeof ReceiverDialog>>

  const fields = useProSchemaForm({
    location: {
      value: '',
      label: '加班地点',
      is: 'HorField',
      props: {
        placeholder: '请输入加班地点',
        maxlength: 50,
      },
      rules: [{ required: true, message: '请输入加班地点' }],
    },
    isAllDay: {
      value: 'N',
      label: '是否整天',
      is: 'HorRadio',
      options: [
        { label: '是', value: 'Y' },
        { label: '否', value: 'N' },
      ],
      props: {},
    },
    startDt: {
      value: '',
      label: '开始时间',
      is: 'HorCellPicker',
      props: {
        clearable: true,
        placeholder: '请选择开始时间',
      },
      async fn(item) {
        if (fields.isAllDay.value === 'Y') {
          ;({ value: item.value } = await datePickerInstance.value.show({
            modelValue: item.value,
          }))
        } else {
          console.log('222', `${formatDate(Date.now(), 'yyyy/MM/dd')} 08:15`)
          ;({ value: item.value } = await dateTimePickerInstance.value.show({
            modelValue: item.value || `${formatDate(Date.now(), 'yyyy/MM/dd ')} 08:15`,
          }))
        }

        // 开始时间大于结束时间
        if (
          fields.endDt.value &&
          new Date(fields.endDt.value).getTime() < new Date(item.value).getTime()
        ) {
          fields.endDt.value = ''
          throw '开始时间不能大于结束时间'
        }
      },
      rules: [{ required: true, message: '请选择开始时间' }],
      get(v) {
        return formatDate(v, 'yyyy-MM-dd hh:mm:ss')
      },
    },
    endDt: {
      value: '',
      label: '结束时间',
      is: 'HorCellPicker',
      props: {
        clearable: true,
        placeholder: '请选择结束时间',
      },
      async fn(item) {
        if (fields.isAllDay.value === 'Y') {
          ;({ value: item.value } = await datePickerInstance.value.show({
            modelValue: item.value,
            minDate: new Date(fields.startDt.value || '2015/01/01'),
          }))
        } else {
          ;({ value: item.value } = await dateTimePickerInstance.value.show({
            modelValue: item.value,
            minDate: new Date(fields.startDt.value || '2015/01/01 00:00'),
          }))
        }
      },
      rules: [{ required: true, message: '请选择结束时间' }],
      get(v) {
        return formatDate(v, 'yyyy-MM-dd hh:mm:ss')
      },
    },
    // leaveDays:
    days: {
      value: '',
      label: '加班天数',
      is: 'HorField',
      disabled: true,
      props: {
        placeholder: '天数',
      },
      hidden: () => fields.isAllDay.value === 'N',
    },
    hours: {
      value: '',
      label: '加班小时',
      is: 'HorField',
      disabled: true,
      props: {
        placeholder: '小时',
      },
      hidden: () => fields.isAllDay.value === 'Y',
    },
    reason: {
      value: '',
      label: '加班事由',
      is: 'HorTextarea',
      props: {
        maxlength: 150,
        placeholder: '请输入',
      },
      rules: [{ required: true, message: '请输入请假说明' }],
    },
  })

  watch(
    () => fields.isAllDay.value,
    (val) => {
      console.log('watch-val=>', val)
      fields.endDt.value = ''
      fields.startDt.value = ''
    },
  )
  watchEffect(() => {
    if (fields.startDt.value && fields.endDt.value) {
      console.log('fields.startDt.value=>', fields.startDt.value)
      console.log('fields.endDt.value=>', fields.endDt.value)
      const start = new Date(fields.startDt.value).getTime()
      const end = new Date(fields.endDt.value).getTime()
      if (fields.isAllDay.value === 'Y') {
        const diff = end - start
        const days = diff / (1000 * 60 * 60 * 24)
        console.log('days=>', days)
        fields.days.value = days + 1
      } else {
        const diff = end - start
        const hours = diff / (1000 * 60 * 60)
        console.log('hours=>', hours)
        fields.hours.value = Math.ceil(hours)
      }
    } else {
      fields.days.value = ''
    }
  })

  const router = useRouter()
  const handleSubmit = async () => {
    const options = await banana.validate(fields)
    console.log('options=>', options)
    // 审批人参数
    const { days, hours, isAllDay } = options
    const receiverObj = await receiverDialogInstance.value.show({
      days,
      hours,
      type: 'overtime',
    })

    console.log('receiver', receiverObj, isAllDay)
    await doApplyOvertime({
      ...options,
      ...receiverObj,
      userId: userinfo?.content.userId,
      approvalId: detailObj.approvalId,
      isProject: 'N',
      days: isAllDay === 'Y' ? days : 0,
    })
    showSuccessToast('申请成功')
    applyListTrap.trigger()
    router.go(-1)
  }

  onBeforeMount(async () => {
    const res = await reqLeaveInfo()
    console.log('value=>', res)
    if (detailObj) {
      const { endDt, startDt, typeName, type, isAllDay, ...res } = detailObj
      console.log('onBeforeMount=>', res)
      const dateFormat = isAllDay === 'Y' ? 'yyyy/MM/dd' : 'yyyy/MM/dd hh:mm:ss'
      banana.assignment(
        {
          startDt: formatDate(startDt, dateFormat),
          endDt: formatDate(endDt, dateFormat),
          type: {
            longName: typeName,
            shortCode: type,
          },
          ...res,
        },
        fields,
      )
    }
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
