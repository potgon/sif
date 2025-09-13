import apiClient from '../client';

export interface Asset {
  id: number;
  name: string;
  isin?: string;
  symbol?: string;
  assetType: 'INDEX_FUND' | 'ETC' | 'CRYPTO' | 'STOCK' | 'BOND' | 'ETF' | 'OTHER';
  currency: string;
  createdAt: string;
  updatedAt: string;
  totalInvested: number;
  currentValue: number;
  currentPrice?: number;
  netProfit: number;
  profitability: number;
  totalShares: number;
  averagePrice: number;
  lastValueDate?: string;
}

export interface Investment {
  id: number;
  assetId: number;
  assetName: string;
  transactionType: 'BUY' | 'SELL' | 'DIVIDEND' | 'SPLIT';
  transactionDate: string;
  amountInvested: number;
  sharesQuantity?: number;
  pricePerShare?: number;
  currency: string;
  exchangeRate?: number;
  fees?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetValue {
  id: number;
  assetId: number;
  assetName: string;
  currentPrice?: number;
  currentValue: number;
  valueDate: string;
  source: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentSummary {
  totalInvested: number;
  totalCurrentValue: number;
  totalNetProfit: number;
  totalProfitability: number;
  assets: Asset[];
}

export interface CreateAssetRequest {
  name: string;
  isin?: string;
  symbol?: string;
  assetType: Asset['assetType'];
  currency: string;
}

export interface CreateInvestmentRequest {
  assetId: number;
  transactionType: Investment['transactionType'];
  transactionDate: string;
  amountInvested: number;
  sharesQuantity?: number;
  pricePerShare?: number;
  currency: string;
  exchangeRate?: number;
  fees?: number;
  notes?: string;
}

export interface CreateAssetValueRequest {
  assetId: number;
  currentValue: number;
  currentPrice?: number;
  valueDate: string;
  source?: string;
  notes?: string;
}

// Asset API functions
export const createAsset = async (data: CreateAssetRequest): Promise<Asset> => {
  const response = await apiClient.post('/investments/assets', data);
  return response.data;
};

export const getAssets = async (): Promise<Asset[]> => {
  const response = await apiClient.get('/investments/assets');
  return response.data;
};

export const getAssetById = async (id: number): Promise<Asset> => {
  const response = await apiClient.get(`/investments/assets/${id}`);
  return response.data;
};

export const updateAsset = async (id: number, data: CreateAssetRequest): Promise<Asset> => {
  const response = await apiClient.put(`/investments/assets/${id}`, data);
  return response.data;
};

export const deleteAsset = async (id: number): Promise<void> => {
  await apiClient.delete(`/investments/assets/${id}`);
};

// Investment API functions
export const createInvestment = async (data: CreateInvestmentRequest): Promise<Investment> => {
  const response = await apiClient.post('/investments/transactions', data);
  return response.data;
};

export const getInvestmentsByAsset = async (assetId: number): Promise<Investment[]> => {
  const response = await apiClient.get(`/investments/assets/${assetId}/transactions`);
  return response.data;
};

export const getAllInvestments = async (): Promise<Investment[]> => {
  const response = await apiClient.get('/investments/transactions');
  return response.data;
};

export const updateInvestment = async (id: number, data: CreateInvestmentRequest): Promise<Investment> => {
  const response = await apiClient.put(`/investments/transactions/${id}`, data);
  return response.data;
};

export const deleteInvestment = async (id: number): Promise<void> => {
  await apiClient.delete(`/investments/transactions/${id}`);
};

// Asset Value API functions
export const updateAssetValue = async (assetId: number, data: CreateAssetValueRequest): Promise<AssetValue> => {
  const response = await apiClient.post(`/investments/assets/${assetId}/value`, data);
  return response.data;
};

export const getAssetValueHistory = async (assetId: number): Promise<AssetValue[]> => {
  const response = await apiClient.get(`/investments/assets/${assetId}/value/history`);
  return response.data;
};

export const getCurrentAssetValue = async (assetId: number): Promise<AssetValue> => {
  const response = await apiClient.get(`/investments/assets/${assetId}/value/current`);
  return response.data;
};

// Summary API functions
export const getInvestmentSummary = async (): Promise<InvestmentSummary> => {
  const response = await apiClient.get('/investments/summary');
  return response.data;
};
