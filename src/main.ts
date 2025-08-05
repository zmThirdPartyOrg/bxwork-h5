import { createApp } from 'vue'
import jssdk from '@pkstar/horn-jssdk'
import App from '@/App.vue'

const app = createApp(App)

// https://cn.vitejs.dev/guide/migration-from-v2.html#importmetaglob
// import plugins
;((s) => Object.values(s).forEach((it: any) => it.default && app.use(it.default)))(
  import.meta.glob('./plugins/*.ts', { eager: true }),
)

jssdk.bootstrap(() => {
  app.mount('#app')
})

type P<T> = T extends 'x' ? string : number
type A3 = P<'x' | 'y'> // string | number
const a = 1 as A3
console.log(a)
