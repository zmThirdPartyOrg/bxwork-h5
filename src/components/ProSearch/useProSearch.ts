import { useQuery } from '@pkstar/vue-use'

export interface UseProSearchCallback {
  (keyword: string): void
}

export function useProSearch(callback: UseProSearchCallback) {
  const query = useQuery()
  const keyword = ref(query.keyword ?? '')

  const trigger = (value: string) => {
    keyword.value = value
    callback(value)
  }

  return [keyword, trigger] as const
}
