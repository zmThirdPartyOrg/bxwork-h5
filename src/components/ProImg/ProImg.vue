<template>
  <img
    :loading="loading"
    :src="computedUrl"
    :alt="alt"
    @error="handleError"
    @click.stop="handlePreview"
  />
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'
  import DEF_IMG from './def.png'
  import { isArray, isBoolean, isString } from '@pkstar/utils'
  import { usePreviewImageStore } from '@/stores'

  const props = defineProps({
    src: {
      type: String,
      default: '',
    },
    loading: {
      type: String as PropType<'eager' | 'lazy' | undefined>,
      default: 'auto',
    },
    alt: {
      type: String,
      default: 'img',
    },
    defSrc: { type: String, default: DEF_IMG },
    ratio: {
      type: [Number, String],
      default: '',
    },
    baseUrl: { type: String, default: '' },
    previewRatio: {
      type: [Number, String],
      default: '',
    },
    preview: {
      type: [String, Boolean, Array] as PropType<string | boolean | string[]>,
      default: false,
    },
    previewIndex: {
      type: [Number, String],
      default: 0,
    },
  })

  const getUrl = (props: Record<string, any>) => {
    let { src, ratio, defSrc, baseUrl } = props
    if (!src) {
      return defSrc
    }
    if (src.includes('localhost') || src.startsWith('http')) {
      return src
    }

    // 判断是否需要分辨率
    if (ratio) {
      const [x1, x2] = src.split('.')
      src = `${x1}*${ratio}.${x2}`
    }
    return `${baseUrl}${src}`
  }

  const computedUrl = computed(() => getUrl(props))

  // 预览
  const { showPreviewImage } = usePreviewImageStore()
  const handlePreview = async () => {
    const { preview, previewRatio, previewIndex = 0, src, ...options } = props
    if (preview === false) {
      return
    }
    let images: string[] = []
    if (!preview || isBoolean(preview)) {
      images = [src]
    } else if (isString(preview)) {
      images = [preview]
    } else if (isArray(preview)) {
      images = preview
    }
    images = images.map((src) => getUrl({ ...options, src, ratio: previewRatio }))

    showPreviewImage({
      images,
      startPosition: +previewIndex,
    })
  }

  // 错误
  const handleError = (event: Event) => {
    const target = event.target as HTMLImageElement
    const { src } = target
    let { defSrc } = props
    if (defSrc && src !== defSrc) {
      target.src = defSrc
    }
  }
</script>
