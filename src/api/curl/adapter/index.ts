import { registerAdapter } from './adapters'
import { nativeAdapter } from './native'

export * from './adapters'

// 注册原生适配器
registerAdapter('native', nativeAdapter)
