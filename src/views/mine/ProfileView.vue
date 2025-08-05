<template>
  <HorView class="profile-view" @click="$router.push('/profile-edit')">
    <template #right>
      <span>编辑</span>
    </template>
    <ProSchemaRender :fields="fields" :source="userinfo?.content" shwoEmptyField> </ProSchemaRender>
    <ProEndDivider />
  </HorView>
</template>

<script setup lang="ts">
  import { useProSchemaRender } from '@/components'
  import { useUserinfoStore } from '@/stores'
  import type { UserinfoContent } from '@/types'
  import { noticeMethodValueMap } from '@/utils'
  const { userinfo } = useUserinfoStore()

  const fields = useProSchemaRender((data: UserinfoContent) => {
    console.log('data', data)
    const { noticeMethod } = data
    const noticeMethodStr = noticeMethod
      .split(',')
      .map((item) => noticeMethodValueMap[item].label)
      .join(' ')
    return [
      {
        is: 'HorCellGroup',
        children: [
          {
            is: 'HorCell',
            label: '姓名',
            key: 'realName',
          },
          {
            is: 'HorCell',
            label: '性别',
            key: 'gender',
          },
          {
            is: 'HorCell',
            label: '电话',
            key: 'phone',
          },
          {
            is: 'HorCell',
            label: '手机',
            key: 'mobile',
          },
          {
            is: 'HorCell',
            label: '地址',
            key: 'address',
          },
          {
            is: 'HorCell',
            label: '审批通知',
            value: noticeMethodStr,
          },
        ],
      },
      {
        is: 'HorCellGroup',
        children: [
          {
            is: 'HorCell',
            label: '邮箱',
            key: 'email',
          },
          {
            is: 'HorCell',
            label: '部门',
            key: 'depName',
          },
          {
            is: 'HorCell',
            label: '职位',
            key: 'jobTitle',
          },
        ],
      },
      {
        is: 'HorCellGroup',
        children: [
          {
            is: 'HorCell',
            label: 'JD信息',
            value: '请在后台维护',
          },
          {
            is: 'HorCell',
            label: 'CV信息',
            value: '请在后台维护',
          },
          {
            is: 'HorCell',
            label: '经验表格',
            value: '请在后台维护',
          },
        ],
      },
    ]
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
