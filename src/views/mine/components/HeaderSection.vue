<template>
  <div class="header-section">
    <ProImg
      class="user-img"
      :def-src="defSrc"
      :src="userinfo?.content.smallImage"
      alt="user"
      @click="handleUserAvatar()"
    />
    <div class="info">
      <span>{{ userinfo?.content.depName }}</span>
      <span> {{ userinfo?.content.realName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUserinfoStore } from '@/stores'
  import { showChooseSourceType, withLoading } from '@/utils'
  import defSrc from '@/assets/img/default_user.png'
  import { chooseImage, fileToBase64 } from '@pkstar/horn-jssdk'
  import { doFileUploadWithBase64, doUserInfoUpdate } from '@/api'

  const { userinfo } = useUserinfoStore(true)

  const handleUserAvatar = async () => {
    const type = await showChooseSourceType()
    console.log(type)
    //拍照或相机
    const chooseImageRes = await chooseImage({
      //不裁剪 且 配置多选 才可以多选
      count: 1,
      sourceType: [type.value],
      sizeType: ['compressed'],
    })
    console.log('chooseImageRes', chooseImageRes)
    const tempFilePath = chooseImageRes.tempFilePaths[0]
    withLoading(async () => {
      const base64Res = await fileToBase64({
        filePath: tempFilePath,
      })
      const res = await doFileUploadWithBase64({ data: base64Res.base64 }, 'userinfo')
      console.log(res)
      await withLoading(doUserInfoUpdate)({
        smallImage: res.url,
        fileIds: res.id,
        // ...userinfo.value!.content,
      })
      userinfo.value!.content.smallImage = res.url
    })()
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .header-section {
    background-color: $color-primary;
    @extend %df;
    @extend %fdc;
    @extend %aic;
  }
  .user-img {
    width: j(60);
    height: j(60);
    border-radius: j(50);
    margin-top: j(10);
  }
  .info {
    text-align: center;
    color: #fff;
    font-size: j(14);
    font-weight: bold;
    margin: j(10) 0;
  }
</style>
