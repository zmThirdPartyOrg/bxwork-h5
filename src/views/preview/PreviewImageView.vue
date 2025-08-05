<template>
  <HorView class="is-fullscreen" :use-nav-bar="false"> </HorView>
</template>

<script setup lang="ts">
  import { usePreviewImageStore } from '@/stores'
  import { showImagePreview } from 'vant'

  const router = useRouter()
  const { previewImage } = usePreviewImageStore()

  let instance: any = null
  let flag = true

  onMounted(() => {
    instance = showImagePreview(
      Object.assign(
        {
          images: [],
          startPosition: 0,
          closeable: true,
          closeOnPopstate: false,
          onClose() {
            if (flag) {
              router.back()
            }
          },
        },
        previewImage,
      ),
    )
  })

  onBeforeUnmount(() => {
    flag = false
    instance?.close()
  })
</script>
