export function onBeforeMountOrActivated(hook: () => any) {
  let mounted = false
  onBeforeMount(() => {
    console.log('onBeforeMount')
    hook()
    nextTick(() => (mounted = true))
  })
  onActivated(() => {
    console.log('onActivated')
    if (mounted) {
      hook()
    }
  })
}
