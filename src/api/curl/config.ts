import type { CreateAxiosDefaults } from 'axios'
import { __DEV__ } from '@/utils'

export const baseURL = __DEV__ ? 'top' : 'https://bianxiukaoqing.top'

export const DEFAULT_CONFIG: CreateAxiosDefaults = {
  baseURL,
  timeout: 60 * 1000,
  responseType: 'json',
  headers: {},
}
