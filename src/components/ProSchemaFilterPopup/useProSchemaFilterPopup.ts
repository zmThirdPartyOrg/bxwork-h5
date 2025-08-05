import banana from '@pkstar/banana'
import { type ProSchemaFilterPopupInstance } from '.'
import { type ProSchemaFormMetadata } from '../ProSchemaForm'

export interface UseProSchemaFilterPopupGenerator {
  (action: 'reset' | 'initial'): ProSchemaFormMetadata | Promise<ProSchemaFormMetadata>
}

export interface UseProSchemaFilterPopupOptions {
  initialQuery?: () => Record<string, any>
}

export function useProSchemaFilterPopup(
  generator: UseProSchemaFilterPopupGenerator,
  task: (...args: any[]) => Promise<any>,
  options?: UseProSchemaFilterPopupOptions,
) {
  const instance = ref() as Ref<ProSchemaFilterPopupInstance>

  const metadata = ref<ProSchemaFormMetadata>()

  const query = ref<Record<string, any>>(options?.initialQuery?.() ?? {})

  const trigger = async () => {
    metadata.value = await generator('initial')

    if (Object.keys(query.value).length) {
      banana.assignment(query.value, metadata.value as any)
    }

    query.value = await instance.value.show({
      metadata: metadata.value,
      reset: async () => {
        metadata.value = await generator('reset')
        return metadata.value
      },
    })

    return task(query.value, metadata)
  }

  return [instance, trigger, query, metadata] as const
}
