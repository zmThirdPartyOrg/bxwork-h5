<template>
  <HorView :title="id ? '编辑签到' : '新增签到'">
    <div class="c-bar"></div>
    <ProSchemaForm :metadata="fields"> </ProSchemaForm>

    <ProEndDivider />

    <HorFixedActions>
      <VanButton class="c-button" type="primary" @click="handleSubmit">提交</VanButton>
    </HorFixedActions>

    <HorPicker ref="horPickerInstance" />

    <HorDateTimePicker
      ref="dateTimePickerInstance"
      value-format="yyyy/MM/dd hh:mm:ss"
      :columns-type="['year', 'month', 'day', 'hour', 'minute', 'second']"
    ></HorDateTimePicker>
  </HorView>
</template>

<script setup lang="ts">
  import type { HorDateTimePickerInstance, HorPickerInstance } from '@daysnap/horn-ui'
  import banana from '@pkstar/banana'
  import { formatDate } from '@pkstar/utils'
  import { useKeepAlive, useParams, useQuery } from '@pkstar/vue-use'

  import { doAssignAttend, reqAssignUsers } from '@/api'
  import { useProSchemaForm } from '@/components'
  import { parseAddressLngLatByBMap, refreshTrap } from '@/utils'

  useKeepAlive()

  const { id } = useParams()
  const { detail } = useQuery()
  const detailObj = detail ? JSON.parse(detail) : ''
  console.log(detailObj)

  const horPickerInstance = ref<HorPickerInstance>()
  const dateTimePickerInstance = ref() as Ref<HorDateTimePickerInstance>

  const fields = useProSchemaForm({
    createBy: {
      value: '',
      label: '人员',
      is: 'HorCell',
      hidden: !id,
      get() {
        return {
          attendId: detailObj?.attendId,
          userId: detailObj?.userId,
          userName: detailObj?.createBy,
        }
      },
    },
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
      options: [{ label: '无可选人员', value: '' }],
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
          userName: res.map((item: any) => item.realName).join(','),
        }
      },
      hidden: !!id,
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
      get(v) {
        return {
          locationName: v,
          locationDetail: v,
        }
      },
    },
    attendTime: {
      value: '',
      label: '时间',
      is: 'HorCellPicker',
      props: {
        clearable: true,
        placeholder: '请选择时间',
      },
      async fn(item) {
        ;({ value: item.value } = await dateTimePickerInstance.value.show({
          modelValue: item.value || '', //`${formatDate(Date.now(), 'yyyy/MM/dd hh:mm:ss')}`,
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
    },
  })

  const router = useRouter()
  const handleSubmit = async () => {
    const options = await banana.validate(fields)
    console.log('options=>', options)
    const { lat, lng } = await parseAddressLngLatByBMap(options.locationDetail)
    await doAssignAttend({
      ...options,
      type: 'sign',
      latitude: lat || 0,
      longitude: lng || 0,
    })
    refreshTrap.trigger()
    router.go(-1)
  }

  onBeforeMount(async () => {
    if (detailObj) {
      banana.assignment(detailObj, fields)
    }

    // 获取人员数据
    const assignUsers = await reqAssignUsers()
    if (assignUsers.length) {
      fields.userId.options = [...assignUsers].map((item) => ({
        ...item,
        label: `${item.realName}`,
        name: `${item.realName}`,
        value: item.userId,
      }))
      fields.userId.disabled = false
    }
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
