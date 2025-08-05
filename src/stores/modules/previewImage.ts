import { defineStore } from 'pinia'
import { createNamespace, isIOS } from '@/utils'
import { useState } from '@pkstar/vue-use'
import { withOut } from '../withOut'
import { withToRefs } from '../withToRefs'
import { previewImage as previewImageNavtive } from '@pkstar/horn-jssdk'

interface UsePreviewImageStoreState {
  images: string[]
  startPosition: number
}

export const usePreviewImageStore = withToRefs(
  withOut(
    defineStore(
      createNamespace('PREVIEW_IMAGE'),
      () => {
        const [previewImage, setPreviewImage] = useState<UsePreviewImageStoreState>({
          images: [],
          startPosition: 0,
        })

        const router = useRouter()
        const showPreviewImage = async (options: UsePreviewImageStoreState) => {
          if (isIOS) {
            const { images, startPosition } = options
            await previewImageNavtive({
              current: images[startPosition],
              urls: images,
            })
            return
          }
          setPreviewImage(options)
          router.push('/preview/image')
        }

        return { previewImage, setPreviewImage, showPreviewImage }
      },
      {
        persist: true,
      },
    ),
  ),
)
