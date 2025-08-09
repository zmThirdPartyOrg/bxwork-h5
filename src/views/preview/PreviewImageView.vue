<template>
  <HorView class="is-fullscreen" :use-nav-bar="false"> </HorView>
</template>

<script setup lang="ts">
  import { showImagePreview } from 'vant'

  import { usePreviewImageStore } from '@/stores'

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
