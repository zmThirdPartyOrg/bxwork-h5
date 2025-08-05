<template>
  <HorView
    class="signin-wrap c-navbar-no-placeholder"
    :use-nav-bar="false"
    :placeholder="false"
    title=" "
  >
    <img src="@/assets/img/logo.png" alt="logo" class="logo" />
    <img src="@/assets/img/icon_login_img.png" alt="/welcome" class="welcome" />
    <section class="form-section">
      <Component
        v-for="(item, key) in computedForm"
        v-bind="item.props"
        v-model="item.value"
        :key="key"
        :is="item.is"
      >
      </Component>

      <VanButton class="c-button" type="primary" @click="handleSubmit">登录</VanButton>
    </section>

    <div class="size-box"></div>
  </HorView>
</template>

<script setup lang="ts">
  import { useUserinfoStore } from '@/stores'
  import { doUserLoginByPassword } from '@/api'
  import { showSuccessToast } from 'vant'
  import md5 from 'md5'
  import banana, { type MetaDataObject } from '@pkstar/banana'
  import { withLoading, __DEV__ } from '@/utils'
  import FormField from './components/FormField.vue'

  // 登录方式 1 验证码登录  2 账号密码登录
  const type = ref(2)
  const objForm = reactive<MetaDataObject>({
    username: {
      value: __DEV__ ? '15821647520' : '',
      is: markRaw(FormField),
      use: [1, 2],
      props: {
        type: 'tel',
        maxlength: 11,
        label: '手机号码',
        placeholder: '请输入手机号码',
      },
      rules: [{ required: true, message: '请输入手机号码' }],
    },
    password: {
      value: __DEV__ ? '111111' : '',
      is: markRaw(FormField),
      use: [2],
      get: (v) => md5(v),
      props: {
        label: '登录密码',
        type: 'password',
        placeholder: '请输入登录密码',
      },
      rules: [{ required: true, message: '请输入登录密码' }],
    },
  })
  const computedForm = computed(() => {
    return Object.keys(objForm).reduce<MetaDataObject>((res, key) => {
      const item = objForm[key]
      if (item.use.includes(type.value)) {
        res[key] = item
      }
      return res
    }, {})
  })

  const router = useRouter()
  const { setUserinfo } = useUserinfoStore()
  const handleSubmit = withLoading(async () => {
    const options = banana.validate(computedForm.value)

    const userinfo = await doUserLoginByPassword(options)
    const { roleId } = userinfo.content
    const role = userinfo.userRoles.find((item) => item.roleId === roleId)
    userinfo.content.roleName = role?.roleName ?? ''
    setUserinfo(userinfo)

    if (window.history.state.back) {
      router.back() // 正常情况返回上一页
    } else {
      router.push('/')
    }

    setTimeout(() => showSuccessToast('登录成功'))
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .size-box {
    @extend %df1;
    min-height: j(50);
  }
  .signin-wrap {
    @extend %bsb;
    @extend %df;
    @extend %fdc;
    @extend %aic;
    padding-top: j(110);
    background-image: url('@/assets/img/icon_bg.png');
    background-position: top center;
    background-repeat: no-repeat;
    background-size: 100% auto;
    .c-button {
      margin-top: j(46);
    }
  }
  .logo {
    width: j(74);
    height: j(74);
    margin-bottom: j(36);
  }
  .welcome {
    height: j(24);
    width: j(133);
    margin-bottom: j(20);
  }
  .form-section {
    width: j(300);
    padding: j(20) j(20) j(100);
    background-color: #fff;
    border-radius: j(8);
  }
  .actions-section {
    @extend %df;
    @extend %aic;
    margin-top: j(16);
    font-size: j(13);
    width: j(312);
    span,
    a {
      @extend %c6;
      @extend %cp;
    }
    span {
      margin-left: auto;
    }
  }

  .signup-section {
    @extend %c9;
    margin-top: j(36);
    font-size: j(13);
    a {
      color: $color-primary;
    }
  }
  .mr-12 {
    margin-right: j(12);
  }
</style>
