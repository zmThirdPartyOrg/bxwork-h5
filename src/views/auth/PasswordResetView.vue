<template>
  <HorView class="is-pt">
    <ProSchemaForm :metadata="objForm" />

    <VanButton class="c-button is-mt" type="primary" @click="handleSubmit">确认</VanButton>
  </HorView>
</template>

<script setup lang="ts">
  import { doUserPasswordReset } from '@/api'
  import { useProSchemaForm } from '@/components'
  import { useSuperRouter } from '@/hooks'
  import { withLoading } from '@/utils'
  import banana from '@pkstar/banana'
  import md5 from 'md5'
  import { showSuccessToast } from 'vant'

  const objForm = useProSchemaForm({
    oldPassword: {
      value: '',
      is: 'HorField',
      label: '原密码',
      get: (v) => md5(v),
      props: {
        type: 'password',
        placeholder: '请输入原密码',
      },
      rules: [{ required: true, message: '请输入原密码' }],
    },
    password: {
      value: '',
      is: 'HorField',
      label: '新密码',
      get: (v) => md5(v),
      props: {
        type: 'password',
        placeholder: '请输入新密码',
      },
      rules: [{ required: true, message: '请输入新密码' }],
    },
    confirmPassword: {
      value: '',
      is: 'HorField',
      label: '确认密码',
      props: {
        type: 'password',
        placeholder: '请再次输入新密码',
      },
      rules: [
        { required: true, message: '请再次输入新密码' },
        {
          validator: (v, _, m) => {
            return m.password.value === v
          },
          message: '两次密码输入不一致',
        },
      ],
    },
  })

  const router = useSuperRouter()
  const handleSubmit = async () => {
    const options = banana.validate(objForm)
    await withLoading(doUserPasswordReset)(options)
    await showSuccessToast(`密码重置成功`)
    router.back(1000)
  }
</script>
