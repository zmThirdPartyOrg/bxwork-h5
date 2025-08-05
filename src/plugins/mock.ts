import { __DEV__, isApp } from '@/utils'

// api mock
if (__DEV__ || !__DEV__) {
  import('@/mocks/api')
}

// jssdk mock
if (!isApp) {
  //
}
