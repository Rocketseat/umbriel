import { useState, useCallback, useMemo } from 'react';
import { AxiosRequestConfig } from 'axios';
import useRequest, { Return } from './useRequest';

export interface PaginatedRequest<Data, Error> extends Return<Data, Error> {
  loadPrevious: () => void;
  loadNext: () => void;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export default function usePaginatedRequest<Data = unknown, Error = unknown>(
  request: AxiosRequestConfig,
): PaginatedRequest<Data, Error> {
  const [page, setPage] = useState(1);

  const { response, requestKey, ...rest } = useRequest<Data, Error>({
    ...request,
    params: { page, ...request.params },
  });

  const hasPreviousPage = useMemo(() => page > 1, [page]);
  const hasNextPage = useMemo(() => page < response?.headers['x-total-page'], [
    page,
    response,
  ]);

  const loadPrevious = useCallback(() => {
    setPage(current => (hasPreviousPage ? current - 1 : current));
  }, [hasPreviousPage]);

  const loadNext = useCallback(() => {
    setPage(current => (hasNextPage ? current + 1 : current));
  }, [hasNextPage]);

  return {
    ...rest,
    requestKey,
    response,
    loadNext,
    loadPrevious,
    hasPreviousPage,
    hasNextPage,
  };
}
