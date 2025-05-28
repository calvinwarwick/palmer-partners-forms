
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Optimized query hook with better defaults
export const useOptimizedQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Partial<UseQueryOptions<T>>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
};
