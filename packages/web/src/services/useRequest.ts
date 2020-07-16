import useSWR, { ConfigInterface, responseInterface } from 'swr';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import axios from './axios';

export type GetRequest = AxiosRequestConfig;

export interface Return<Data, Error>
  extends Pick<
    responseInterface<AxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'revalidate' | 'error'
  > {
  data: Data | undefined;
  response: AxiosResponse<Data> | undefined;
  requestKey: string;
}

export interface Config<Data = unknown, Error = unknown>
  extends Omit<
    ConfigInterface<AxiosResponse<Data>, AxiosError<Error>>,
    'initialData'
  > {
  initialData?: Data;
}

export default function useRequest<Data = unknown, Error = unknown>(
  request: GetRequest,
  { initialData, ...config }: Config<Data, Error> = {},
): Return<Data, Error> {
  const requestKey = request && JSON.stringify(request);

  const { data: response, error, isValidating, revalidate } = useSWR<
    AxiosResponse<Data>,
    AxiosError<Error>
  >(requestKey, () => axios(request), {
    ...config,
    initialData: initialData && {
      status: 200,
      statusText: 'InitialData',
      config: request,
      headers: {},
      data: initialData,
    },
  });

  return {
    data: response?.data,
    requestKey,
    response,
    error,
    isValidating,
    revalidate,
  };
}
