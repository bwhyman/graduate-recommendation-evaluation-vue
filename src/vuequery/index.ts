import { createMessageDialog } from '@/components/message'
import { QueryClient } from '@tanstack/vue-query'

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
        console.log(typeof error)
        createMessageDialog(error as unknown as string)
      }
    }
  }
})

export default queryClient
