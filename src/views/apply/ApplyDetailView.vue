<template>
  <HorView :title="query.title ?? '详情'">
    <ProSkeleton v-if="!data" :loading="loading" :error="error" @refresh="handleRefresh" />
    <template v-else>
      <div class="c-user-info">
        <div class="user">
          <UserAvatar class="c-avatar" :src="computedApplyDetail?.iconPath" />
          <div class="user-info-content">
            <span class="name">{{ computedApplyDetail?.username }}</span>
            <span class="c-text-primary">{{
              applyStatusLabelMap(computedApplyDetail?.submitStatus!, computedApplyDetail?.status!)
            }}</span>
          </div>
        </div>
      </div>

      <div class="c-bar"></div>
      <ProSchemaRender
        v-if="computedIsOvertime"
        :fields="overtimeFields"
        :source="computedApplyDetail"
      />
      <ProSchemaRender v-else :fields="leaveFields" :source="computedApplyDetail" />

      <div class="c-bar"></div>
      <VanSteps
        v-if="data.logs && data.logs.length"
        direction="vertical"
        :active="computedIsActive"
        active-color="#1890FF"
      >
        <VanStep v-for="(item, index) in data.logs" :key="index">
          <div class="c-col-item">
            <UserAvatar class="c-avatar" :src="item.iconPath" />
            <div class="c-col-item-content">
              <div class="c-col-item-title">
                <span class="title">{{ item?.username }}</span>
                <span class="sub-text">{{ item?.activityDt }}</span>
              </div>
              <div class="c-col-item-text">
                <span class="c-text-primary">{{ item.description }}</span>
              </div>
            </div>
          </div>
        </VanStep>
      </VanSteps>

      <ProEndDivider />

      <HorFixedActions v-if="computedApplyDetail" check-empty>
        <!-- 我发起的 -->
        <template v-if="computedApplyDetail.applyUserId === userinfo?.content.userId">
          <VanButton
            v-if="
              ['init', 'part'].includes(computedApplyDetail.status) &&
              ['submit'].includes(computedApplyDetail.submitStatus)
            "
            class="c-button"
            type="danger"
            @click="handleRemind"
            >催促</VanButton
          >

          <VanButton
            v-if="
              ['init'].includes(computedApplyDetail.status) &&
              ['submit'].includes(computedApplyDetail.submitStatus)
            "
            class="c-button"
            type="warning"
            @click="handleWithdraw"
            >撤回</VanButton
          >

          <VanButton
            v-if="
              !['submit'].includes(computedApplyDetail.submitStatus) ||
              ['deny'].includes(computedApplyDetail.status)
            "
            class="c-button"
            type="primary"
            @click="handleEdit"
            >编辑</VanButton
          >
        </template>

        <!-- 待我审批的 -->
        <template v-if="data.approveSign === 1">
          <VanButton class="c-button" type="danger" @click="handleRefuse">拒绝</VanButton>
          <VanButton class="c-button" type="success" @click="handleAgree">同意</VanButton>
        </template>
      </HorFixedActions>
    </template>
    <ResonDialog ref="resonDialogInstance" />
  </HorView>
</template>

<script setup lang="ts">
  import { sleep } from '@pkstar/utils'
  import { useAsyncTask, useParams } from '@pkstar/vue-use'
  import { useQuery } from '@pkstar/vue-use'
  import { showSuccessToast } from 'vant'

  import {
    doApplyAgree,
    doApplyRefuse,
    doApplyRemind,
    doApplyWithdraw,
    reqApplyDetail,
  } from '@/api'
  import { useUserinfoStore } from '@/stores'
  import { applyListTrap, applyStatusLabelMap } from '@/utils'

  import ResonDialog from './components/ResonDialog.vue'
  import { useApplyDetailHooks } from './useApplyDetailHooks'

  const { id } = useParams()
  const query = useQuery()
  const { userinfo } = useUserinfoStore()
  const resonDialogInstance = ref() as Ref<InstanceType<typeof ResonDialog>>

  const {
    data,
    error,
    loading,
    trigger: handleRefresh,
  } = useAsyncTask(() => reqApplyDetail({ approveId: +id }), {
    immediate: true,
  })

  const { leaveFields, overtimeFields } = useApplyDetailHooks()

  const computedApplyDetail = computed(() => {
    return data?.value?.content?.overtime ?? data.value?.content.leave
  })
  const computedIsOvertime = computed(() => {
    return !!data?.value?.content?.overtime
  })
  const computedIsActive = computed(() => {
    // 检查 data 和 logs 是否存在
    if (!data.value || !data.value.logs || data.value.logs.length === 0) {
      return 0
    }
    // 查找 activityDt 为空的元素索引
    const index = data.value.logs.findIndex((item) => !item.activityDt)
    // 若找到则返回该索引，否则返回最后一个元素的索引
    return index !== -1 ? index : data.value.logs.length - 1
  })

  const router = useRouter()
  // 催促
  const handleRemind = async () => {
    await doApplyRemind({
      approveId: +id,
    })
    showSuccessToast('催促成功')
    router.go(-1)
  }
  // 撤回
  const handleWithdraw = async () => {
    await doApplyWithdraw({
      approvalId: +id,
    })
    showSuccessToast('已撤回')
    await sleep(1000)
    handleRefresh()
    applyListTrap.trigger()
  }
  // 编辑
  const handleEdit = () => {
    router.replace({
      path: computedIsOvertime.value ? '/apply/overtime' : '/apply/leave',
      query: {
        detail: JSON.stringify(computedApplyDetail.value),
      },
    })
  }
  // 拒绝
  const handleRefuse = async () => {
    const res = await resonDialogInstance.value?.show({
      title: '拒绝审批',
    })

    await doApplyRefuse({
      approveId: [+id],
      approveUserId: userinfo?.content?.userId ?? '',
      comment: res.comment,
      status: 'deny',
    })
    showSuccessToast('已拒绝')
    await sleep(1000)
    applyListTrap.trigger()
    router.go(-1)
  }
  // 同意
  const handleAgree = async () => {
    const res = await resonDialogInstance.value?.show({
      title: '同意审批',
    })
    await doApplyAgree({
      approveId: [+id],
      approveUserId: userinfo?.content.userId ?? '',
      comment: res.comment,
      status: 'pass',
    })
    showSuccessToast('已同意')
    await sleep(1000)
    applyListTrap.trigger()
    router.go(-1)
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/define.scss';
  .header-section {
    @extend %df;
    padding: j(12) j(16);
    background-color: #fff;
    img {
      @extend %br50;
      width: j(80);
      height: j(80);
      margin-right: j(16);
      background-color: #f2f2f2;
    }
    i {
      @extend %cc;
    }
  }
  .header-info {
    @extend %df1;
    @extend %c3;
    h2 {
      @extend %fwb;
      font-size: j(20);
    }
    p {
      margin-top: j(4);
      font-size: j(14);
    }
    ul {
      font-size: j(14);
      margin-top: j(3);
    }
    li {
      display: inline;
      padding: 0 j(8);
      line-height: 1.2;
      border-left: 1px solid #666;
      &:first-child {
        padding-left: 0;
        border-left: none;
      }
    }
  }

  :deep() {
    .hor-fixed-actions {
      z-index: 99;
    }
  }
</style>
