<template>
  <HorView class="profile-view" @right="handleSubmit">
    <template #right>
      <span>确定</span>
    </template>
    <ProSchemaForm :metadata="metadata"> </ProSchemaForm>
  </HorView>
</template>

<script setup lang="ts">
  import { doUserInfoUpdate } from '@/api'
  import { useProSchemaForm } from '@/components'
  import { useDepField } from '@/hooks'
  import { useUserinfoStore } from '@/stores'
  import { NOTICE_METHOD, withLoading } from '@/utils'
  import banana from '@pkstar/banana'
  import { isEmail } from '@pkstar/utils'
  import { useKeepAlive } from '@pkstar/vue-use'
  import { showSuccessToast } from 'vant'

  const { userinfo, setUserinfo } = useUserinfoStore()
  useKeepAlive()

  const depName = useDepField({})
  const metadata = useProSchemaForm({
    realName: {
      value: '',
      label: '姓名',
      is: 'HorField',
      props: {
        maxlength: 11,
        placeholder: '请输入',
      },
      rules: [{ required: false, message: '请输入姓名' }],
    },
    gender: {
      value: '',
      label: '性别',
      is: 'HorRadio',
      options: [
        { label: '男', value: '男' },
        { label: '女', value: '女' },
      ],
      props: {},
      rules: [{ required: false, message: '请选择性别' }],
    },
    phone: {
      value: '',
      label: '电话',
      is: 'HorField',
      props: {
        maxlength: 8,
        placeholder: '请输入',
      },
      rules: [{ required: false, message: '请输入电话号码' }],
    },
    mobile: {
      value: '',
      label: '手机',
      is: 'HorField',
      props: {
        maxlength: 11,
        placeholder: '请输入',
      },
      rules: [{ required: false, message: '请输入手机号' }],
    },
    address: {
      value: '',
      label: '地址',
      is: 'HorField',
      props: {
        maxlength: 30,
        placeholder: '请输入',
      },
      rules: [{ required: false, message: '请输入地址' }],
    },
    noticeMethod: {
      value: [],
      label: '审批通知',
      is: 'HorCheckbox',
      options: NOTICE_METHOD,
      props: {
        checkedColor: '',
      },
      set: (s, f) => {
        const { noticeMethod } = s
        const res: any[] = []
        NOTICE_METHOD.forEach((item) => {
          console.log(noticeMethod, item.value)
          if (noticeMethod.includes(item.value)) {
            res.push(item.value)
          }
        })
        console.log(res)
        f.value = res
      },
      get: (s) => {
        return s.join(',')
      },
      rules: [{ required: false, message: '请选择性别' }],
    },
    email: {
      value: '',
      label: '邮箱',
      is: 'HorField',
      props: {
        maxlength: 30,
        placeholder: '请输入',
      },
      rules: [
        {
          validator: (val) => {
            return !!isEmail(val)
          },
          message: '请输入正确的邮箱',
        },
      ],
    },
    depName,
    jobTitle: {
      value: '',
      label: '职位',
      is: 'HorField',
      props: {
        maxlength: 20,
        placeholder: '请输入',
      },
      rules: [{ required: false, message: '请输入职位' }],
    },
  })

  banana.assignment(userinfo?.content!, metadata)

  const router = useRouter()
  const handleSubmit = async () => {
    const options = await banana.validate(metadata)
    console.log('options', options)
    await withLoading(doUserInfoUpdate)(options)
    await showSuccessToast(`修改成功`)
    setUserinfo({
      ...userinfo,
      content: {
        ...userinfo?.content,
        ...options,
      },
    } as any)
    router.back()
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
