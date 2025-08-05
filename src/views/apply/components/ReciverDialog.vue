<template>
  <VanDialog
    title="审批人"
    v-model:show="visible"
    ref="vanDialogInstance"
    show-cancel-button
    @cancel="hide"
    @confirm="confirm"
  >
    <!-- 表单 -->
    <ProSchemaForm :metadata="formFileds" />
  </VanDialog>

  <HorActionSheet ref="horActionSheetInstance" />
</template>

<script setup lang="ts">
  import { reqReciveRoleList } from '@/api'
  import { useProSchemaForm } from '@/components'
  import { useReceiveActionSheet } from '@/hooks'
  import type { ApplyLeaveDto, ApplyLeaveVoItem } from '@/types'
  import banana from '@pkstar/banana'
  import { useVisible } from '@pkstar/vue-use'

  const [horActionSheetInstance, handle] = useReceiveActionSheet()

  const reciveRoleList = ref<ApplyLeaveVoItem[]>()
  const formFileds = ref({})

  const { visible, show, hide, confirm } = useVisible<Partial<ApplyLeaveDto>>({
    showCallback: async (options) => {
      const { days, hours = 0, type = 'leave' } = options!
      const leaveDays = days || +(hours / 8).toFixed(2)

      const res = await reqReciveRoleList({
        leaveDays: Math.max(leaveDays, 8),
        type,
      })
      reciveRoleList.value = res
      // 初始化表单字段
      if (reciveRoleList.value) {
        const form = reciveRoleList.value?.reduce((pre, cur, index) => {
          const { approvalType, roleId, roleName } = cur
          cur.userList = cur.userList.map((item) => ({
            ...item,
            approvalType,
            roleId,
            roleName,
          }))
          pre[index] = {
            value: cur.userList[0] ?? '',
            label: `${cur.roleName}${approvalType === 'notice' ? '(抄送)' : ''}`,
            is: 'HorCellPicker',
            fn: async (item: any) => {
              const res = await handle(cur.userList)
              console.log(res)
              console.log('item=>', item)
              item.value = res
            },
            props: {
              formatter: (v: any) => {
                console.log('v', v)
                return v.username
              },
            },
            rules: [{ required: true, message: '请选择审批人' }],
          }
          // console.log('pre', pre)
          return pre
        }, {} as any)
        // console.log('form', form)
        formFileds.value = useProSchemaForm(form)
      }
      // console.log('res', res)
    },
    confirmCallback() {
      console.log('formFileds.value', formFileds.value)
      return banana.validate(formFileds.value)
    },
  })
  // const fields = computed(() => {
  // const form = reciveRoleList.value?.reduce((pre, cur, index) => {
  //   const { approvalType, roleId, roleName } = cur
  //   cur.userList = cur.userList.map((item) => ({
  //     ...item,
  //     approvalType,
  //     roleId,
  //     roleName,
  //   }))
  //   pre[index] = {
  //     value: cur.userList[0] ?? '',
  //     label: cur.roleName,
  //     is: 'HorCellPicker',
  //     fn: async (item: any) => {
  //       const res = await handle(cur.userList)
  //       console.log(res)
  //       console.log('item=>', item)
  //       item.value = res
  //     },
  //     props: {
  //       formatter: (v: any) => {
  //         console.log('v', v)
  //         return v.username
  //       },
  //     },
  //     rules: [{ required: true, message: '请选择请假审批人' }],
  //   }
  //   // console.log('pre', pre)
  //   return pre
  // }, {} as any)
  // // console.log('form', form)
  // return useProSchemaForm(form)
  // })

  defineExpose({
    show,
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
