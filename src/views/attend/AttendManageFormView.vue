<template>
  <HorView :title="id ? '编辑打卡' : '新增打卡'">
    <div class="c-bar"></div>
    <ProSchemaForm :metadata="fields"> </ProSchemaForm>

    <ProEndDivider />

    <HorFixedActions>
      <VanButton class="c-button" type="primary" @click="handleSubmit">提交</VanButton>
    </HorFixedActions>

    <HorPicker ref="horPickerInstance" />

    <HorDateTimePicker
      ref="dateTimePickerInstance"
      value-format="yyyy/MM/dd hh:mm"
      :columns-type="['year', 'month', 'day', 'hour', 'minute']"
    ></HorDateTimePicker>
  </HorView>
</template>

<script setup lang="ts">
  import type { HorDateTimePickerInstance, HorPickerInstance } from '@daysnap/horn-ui'
  import banana from '@pkstar/banana'
  import { formatDate } from '@pkstar/utils'
  import { useKeepAlive, useParams, useQuery } from '@pkstar/vue-use'

  import { reqAssignUsers, reqLeaveInfo } from '@/api'
  import { useProSchemaForm } from '@/components'
  import { refreshTrap } from '@/utils'

  useKeepAlive()

  const { id } = useParams()
  const { detail } = useQuery()
  const detailObj = detail ? JSON.parse(detail) : ''
  console.log(detailObj)

  const horPickerInstance = ref<HorPickerInstance>()
  const dateTimePickerInstance = ref() as Ref<HorDateTimePickerInstance>

  const fields = useProSchemaForm({
    userId: {
      value: [],
      label: '人员',
      is: 'HorCheckboxButton',
      disabled: true,
      // fn: async (item) => {
      //   console.log('item.options', item.options)
      //   const res = await horPickerInstance.value?.show({
      //     value: item.value,
      //     columns: item.options,
      //   })
      //   item.value = res
      // },
      options: [{ label: '无打卡人员', value: '' }],
      props: {
        direction: 'column',
        span: '3',
      },
      rules: [
        { required: true, message: '请选择人员' },
        { validator: (v) => v.length > 0, message: '请选择人员' },
      ],
      get(v, f) {
        console.log('userId', v, f)
        const { options } = f
        const res = v.map((o: string) => {
          const item = options.find((item: any) => item.value === o)
          return item
        })
        return {
          userId: res.map((item: any) => item.value).join(','),
          createBy: res.map((item: any) => item.realName).join(','),
        }
      },
    },
    type: {
      value: '1',
      label: '打卡类型',
      is: 'HorRadio',
      options: [
        { label: '上班', value: '1' },
        { label: '下班', value: '2' },
      ],
      props: {},
      rules: [{ required: true, message: '请选择打卡类型' }],
    },
    location: {
      value: '',
      label: '地点',
      is: 'HorField',
      props: {
        placeholder: '请输入地点',
        maxlength: 50,
      },
      rules: [{ required: true, message: '请输入地点' }],
    },
    startDt: {
      value: '',
      label: '时间',
      is: 'HorCellPicker',
      props: {
        clearable: true,
        placeholder: '请选择时间',
      },
      async fn(item) {
        ;({ value: item.value } = await dateTimePickerInstance.value.show({
          modelValue: item.value || `${formatDate(Date.now(), 'yyyy/MM/dd ')} 08:15`,
        }))
      },
      rules: [{ required: true, message: '请选择时间' }],
      get(v) {
        return formatDate(v, 'yyyy-MM-dd hh:mm:ss')
      },
    },

    remark: {
      value: '',
      label: '备注',
      is: 'HorTextarea',
      props: {
        maxlength: 150,
        placeholder: '请输入',
      },
      rules: [{ required: true, message: '请输入备注' }],
    },
  })

  const router = useRouter()
  const handleSubmit = async () => {
    const options = await banana.validate(fields)
    console.log('options=>', options)
    refreshTrap.trigger()
  }

  onBeforeMount(async () => {
    const res = await reqLeaveInfo()
    console.log('value=>', res)
    if (detailObj) {
      const { startDt, typeName, type, ...res } = detailObj
      console.log('onBeforeMount=>', res)
      const dateFormat = 'yyyy/MM/dd hh:mm:ss'
      banana.assignment(
        {
          startDt: formatDate(startDt, dateFormat),
          type: {
            longName: typeName,
            shortCode: type,
          },
          ...res,
        },
        fields,
      )
    }

    // 获取人员数据
    const assignUsers = await reqAssignUsers()
    if (assignUsers.length) {
      fields.userId.options = [...assignUsers].map((item) => ({
        ...item,
        label: `${item.realName}(${item.hours}/${item.totalHours})`,
        name: `${item.realName}(${item.hours}/${item.totalHours})`,
        value: item.userId,
      }))
      fields.userId.disabled = false
    }
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
