<template>
  <div class="pro-upload-image">
    <HorCell v-bind="cellProps">
      <template #label>
        <span>{{ label }}</span>
        <slot name="prefix"></slot>
      </template>
      <ul class="img-warp">
        <template v-if="modelValue.length">
          <li v-for="(item, index) in modelValue" :key="index">
            <ProImg
              class="upload-img"
              :src="item.url"
              :preview="props.modelValue.map((item) => item.url)"
              :preview-index="index"
            />
            <HorIcon
              v-if="!disabled"
              class="del-icon"
              name="van-delete-o"
              size="12"
              @click.stop="handleDel(index)"
            ></HorIcon>
          </li>
        </template>
        <li v-if="!modelValue.length && emptyImg" class="default-img">
          <img class="custom-img" :src="emptyImg" alt="empty image" />
        </li>
        <li
          v-if="!disabled && modelValue.length < maxCount"
          class="default-img"
          @click="handleUpload()"
        >
          <HorIcon v-if="!defaultImg" class="camera-icon" name="van-photograph" size="30" />
          <img v-else class="custom-img" :src="defaultImg" alt="def img" />
        </li>
      </ul>
    </HorCell>
  </div>
</template>

<script setup lang="ts">
  import { showConfirmDialog } from 'vant'
  import { proUploaderProps, omitHorCellPropsInUploader } from './types'
  import { pick, formatDate, isIOS } from '@pkstar/utils'
  import { extKeys } from '@daysnap/horn-ui/src/utils'
  import { showChooseSourceType, isApp, withLoading, __DEV__ } from '@/utils'
  import { chooseImage, cropImage, fileToBase64, waterMark } from '@pkstar/horn-jssdk'
  import { doFileUploadWithSdk, doFileUpload, doFileUploadWithBase64 } from '@/api'
  import { ProImg } from '../ProImg'

  const props = defineProps(proUploaderProps)
  const cellProps = computed(() => pick({ ...props }, extKeys(omitHorCellPropsInUploader)))
  const emits = defineEmits(['update:modelValue', 'upload', 'beforeUpload'])

  // 上传
  const handleUpload = async () => {
    if (props.beforeUpload) {
      props?.beforeUpload()
      emits('beforeUpload')
    }
    let res: Array<string> = []
    // 修改数据
    const callback = (res: any) => {
      const value = [...props.modelValue, ...res]
      emits('update:modelValue', value)
    }
    console.log(window.navigator.userAgent, window.navigator.userAgent.includes('HornApp'))
    // 原生容器app
    if (isApp && isIOS()) {
      //&& !__DEV__
      const sourceType = await showChooseSourceType(props.sourceType)
      //拍照或相机
      const chooseImageRes = await chooseImage({
        //不裁剪 且 配置多选 才可以多选
        count: !props.crop && props.multiple ? props.maxCount - props.modelValue.length : 1,
        sourceType: [sourceType.value],
        sizeType: [props.sizeType],
      })
      res = chooseImageRes.tempFilePaths
      if (Array.isArray(props.crop)) {
        // 裁剪
        const [widthRatio, heightRatio] = props.crop
        const cropRes = await cropImage({
          widthRatio,
          heightRatio,
          filePath: res[0],
        })
        res = [cropRes.filePath ?? cropRes]
      }
      // 是否加水印
      if (props.waterMark) {
        const waterMarkRes = await doWaterMark(res)
        res = waterMarkRes.map((item) => {
          return item.filePath
        })
      }
      //自定义上传接口
      if (props.upload instanceof Function) {
        props.upload?.(res, callback)
        emits('upload', res, callback)
      } else {
        // 默认上传
        const data = await doFileToBase64(res)

        const upRes = await withLoading(() =>
          Promise.all(
            data.map((item) => doFileUploadWithBase64({ data: item.base64 }, props.source)),
          ),
        )()
        console.log(upRes)
        callback(upRes)
      }
    } else {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = props.multiple
      input.className = 'pro-uploader__input'
      const max = props.maxCount - props.modelValue.length || 1
      input.maxLength = max
      document.body.appendChild(input)

      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement
        let files = [...(target.files ?? [])]
        files = files.slice(0, max)
        const upRes = await inputUpload(files)
        document.body.removeChild(input)
        callback(upRes)
      }
      input.click()
    }
  }

  const customUpload = async (fileList: string[]) =>
    Promise.all(
      fileList.map((filePath) => {
        return doFileUploadWithSdk(filePath)
      }),
    )

  // h5 input上传
  const inputUpload = withLoading(
    async (fileList: File[]) =>
      Promise.all(
        fileList.map((file) => {
          return doFileUpload({ file }, props.source)
        }),
      ),
    true,
  )

  // 批量文件转base64
  const doFileToBase64 = (list: string[]) =>
    Promise.all(list.map((filePath) => fileToBase64({ filePath })))

  // 批量加水印
  const doWaterMark = (list: string[]) => {
    const promiseList = list.map((filePath) => {
      return waterMark({
        filePath,
        text: formatDate(new Date()),
        padding: 30,
        fontSize: 30,
      })
    })
    return Promise.all(promiseList)
  }

  // 删除
  const handleDel = async (i: number) => {
    await showConfirmDialog({ message: '确定删除图片?' })
    let value = [...props.modelValue]
    value.splice(i, 1)
    emits('update:modelValue', value)
  }
</script>

<style lang="scss" scoped>
  @import 'src/assets/scss/define';
  .img-warp {
    @extend %df;
    @extend %fww;
    width: 100%;
    li {
      // width: 22%;
      // height: 22%;
      width: j(75);
      height: j(75);
      aspect-ratio: 1;
      background-color: #eee;
      margin-bottom: 3%;
      @extend %pr;

      &:not(:nth-child(4n)) {
        margin-right: 3%;
      }

      img {
        @extend %ofc;
        @extend %db;
        width: 100%;
        height: 100%;
      }
      .del-icon {
        @extend %pa;
        @extend %cfff;
        border-radius: 0 0 0 j(4);
        line-height: 1;
        padding: j(4);
        right: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.4);
      }
    }
  }
  .default-img {
    @extend %df;
    @extend %aic;
    @extend %jcc;
    .camera-icon {
      margin: auto;
      color: #fff;
    }
    .custom-img {
      @extend %w100;
      @extend %h100;
    }
  }
  :deep {
    .hor-cell-label {
      @extend %fww;
    }
  }
</style>
