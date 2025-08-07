import { isFunction } from '@pkstar/utils'
import type { Ref } from 'vue'

import { usePreviewImageStore } from '@/stores'

export function usePreviewImageInArticle(refContent: Ref<any> | (() => HTMLElement)) {
  // 预览
  const { showPreviewImage } = usePreviewImageStore()
  const onPreviewImage = (e: Event) => {
    const target = e.target as HTMLElement
    if (target instanceof HTMLImageElement) {
      showPreviewImage({
        images: [target.src],
        startPosition: 0,
      })
    }
  }
  let dom: HTMLElement
  onUpdated(() => {
    if (isFunction(refContent)) {
      dom = refContent()
    } else {
      dom = refContent.value.$el
    }
    if (dom) dom.addEventListener('click', onPreviewImage)
  })

  onBeforeUnmount(() => {
    if (dom) dom.removeEventListener('click', onPreviewImage)
  })
}
