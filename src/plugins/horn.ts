import jssdk from '@pkstar/horn-jssdk'
import type { HornApi } from '@pkstar/horn-jssdk'

const mock: typeof HornApi = (success: any) => {
  success({ code: 0, message: '成功', data: '' })
}

jssdk.defineConfig({
  mock: jssdk.canIUse() ? undefined : (mock as any),
})
