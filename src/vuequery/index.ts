import { createElLoading } from '@/components/loading'
import { createMessageDialog } from '@/components/message'
import {
  QueryClient,
  useQuery,
  type DefaultError,
  type QueryKey,
  type UseQueryDefinedReturnType,
  type UseQueryOptions,
  type UseQueryReturnType
} from '@tanstack/vue-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      throwOnError: (error, query) => {
        console.log(error)
        // Return true to throw error, false otherwise
        createMessageDialog(error as unknown as string)
        return true
      },
      staleTime: Infinity
      // staleTime: 1000 * 60 * 5
    },
    mutations: {
      onError: error => {
        createMessageDialog(error as unknown as string)
      }
    }
  }
})

export function useLoadingQuery<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
  queryClient?: QueryClient
): UseQueryReturnType<TData, TError> | UseQueryDefinedReturnType<TData, TError> {
  const query = useQuery(options)
  let loading: any
  watch(
    [query.isFetching, query.isError],
    () => {
      if (query.isFetching.value) {
        loading = createElLoading()
      } else {
        loading && loading.close()
      }
      if (query.error.value) {
        loading && loading.close()
      }
    },
    { immediate: true }
  )

  return query
}

export default queryClient
