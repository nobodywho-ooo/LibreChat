import { useQuery } from '@tanstack/react-query';
import { QueryKeys, dataService } from 'librechat-data-provider';
import type { TAdminUsersParams, TAdminUsersResponse } from 'librechat-data-provider';
import type { QueryObserverResult, UseQueryOptions } from '@tanstack/react-query';

export const useAdminUsersQuery = (
  params: TAdminUsersParams,
  config?: UseQueryOptions<TAdminUsersResponse>,
): QueryObserverResult<TAdminUsersResponse> =>
  useQuery<TAdminUsersResponse>(
    [QueryKeys.adminUsers, params],
    () => dataService.getAdminUsers(params),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      ...config,
    },
  );
