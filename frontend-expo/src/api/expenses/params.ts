import apiClient from '../client';

export interface ParamUpdateRequest {
  key: string;
  value: string;
}

export const updateParam = async (paramUpdate: ParamUpdateRequest) => {
  const response = await apiClient.post('/params/target', paramUpdate);
  return response.data;
};

export const updateAccumulatedParam = async (newValue: number) => {
  const paramUpdate: ParamUpdateRequest = {
    key: 'ACCUMULATED',
    value: newValue.toString()
  };
  return await updateParam(paramUpdate);
};
