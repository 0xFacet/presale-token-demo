import { Ethscription, EthscriptionTransfer } from "@/types/ethscriptions";
import { BridgeObject } from "@/types/bridges";

import { get, post } from "./api-client";

interface EthscriptionFilterOptions {
  transferred_in_tx?: string;
  token_tick?: string;
  token_protocol?: string;
  current_owner?: string[] | string;
  include_latest_transfer?: string;
  max_results?: string;
}

interface ValidateTokenOptions {
  protocol: string;
  tick: string;
  transaction_hashes: `0x${string}`[];
  max_results?: string;
}

interface PaginationParams {
  page_key: string;
  has_more: boolean;
}

export const fetchBridges = async (headers?: HeadersInit) => {
  return get<{
    result: BridgeObject[];
    pagination: PaginationParams;
  }>(`${process.env.NEXT_PUBLIC_BRIDGE_API_BASE_URL}/bridges`, {
    headers,
  }).catch(() => ({ result: [] as BridgeObject[], pagination: null }));
};

export const fetchEthscriptions = async (
  filterOptions: EthscriptionFilterOptions,
  headers?: HeadersInit
) => {
  return get<{
    result: Ethscription[];
    pagination: PaginationParams;
  }>(`${process.env.NEXT_PUBLIC_ETHSCRIPTIONS_API_BASE_URI}/ethscriptions`, {
    params: { ...filterOptions },
    headers,
  }).catch(() => ({ result: [] as Ethscription[], pagination: null }));
};

export const fetchEthscriptionHashes = async (
  filterOptions: EthscriptionFilterOptions,
  headers?: HeadersInit
) => {
  return get<{
    result: { id: string; transaction_hash: string }[];
    pagination: PaginationParams;
  }>(`${process.env.NEXT_PUBLIC_ETHSCRIPTIONS_API_BASE_URI}/ethscriptions`, {
    params: { ...filterOptions, transaction_hash_only: "true" },
    headers,
  }).catch(() => ({
    result: [] as { id: string; transaction_hash: string }[],
    pagination: null,
  }));
};

interface EthscriptionTransfersFilterOptions {
  transaction_hash?: string;
  from_address?: string[] | string;
  to_address?: string[] | string;
  to_or_from?: string[] | string;
  ethscription_token_tick?: string;
  ethscription_token_protocol?: string;
  max_results?: string;
  sort_order?: string;
}

export const fetchEthscriptionTransfers = async (
  filterOptions: EthscriptionTransfersFilterOptions,
  headers?: HeadersInit
) => {
  return get<{
    result: EthscriptionTransfer[];
    pagination: PaginationParams;
  }>(
    `${process.env.NEXT_PUBLIC_ETHSCRIPTIONS_API_BASE_URI}/ethscription_transfers`,
    {
      params: { ...filterOptions },
      headers,
    }
  ).catch(() => ({ result: [] as EthscriptionTransfer[], pagination: null }));
};

interface TokenBalanceFilterOptions {
  address: string;
  tick: string;
  protocol: string;
}

export const fetchTokenBalance = async (
  filterOptions: TokenBalanceFilterOptions,
  headers?: HeadersInit
) => {
  return get<{
    result: string;
  }>(
    `${process.env.NEXT_PUBLIC_ETHSCRIPTIONS_API_BASE_URI}/tokens/balance_of`,
    {
      params: { ...filterOptions },
      headers,
    }
  ).catch(() => ({ result: "0" }));
};

export const fetchValidateTokenItems = async (
  validateTokenOptions: ValidateTokenOptions,
  headers?: HeadersInit
) => {
  const { transaction_hashes, ...otherOptions } = validateTokenOptions;

  return post<{
    result: {
      valid: `0x${string}`[];
      invalid: `0x${string}`[];
      token_items_checksum: string;
    } | null;
    pagination: PaginationParams;
  }>(
    `${process.env.NEXT_PUBLIC_ETHSCRIPTIONS_API_BASE_URI}/tokens/validate_token_items`,
    {
      params: { ...otherOptions },
      body: { transaction_hashes },
      headers,
    }
  ).catch(() => ({ result: null, pagination: null }));
};

export const waitForEthscriptionTransfer = async (pendingTxnHash: string) => {
  let loops = 0;
  while (true) {
    const { result: ethscriptionHashes } = await fetchEthscriptionHashes({
      transferred_in_tx: pendingTxnHash,
      max_results: "1000",
    });
    if (ethscriptionHashes?.length) {
      return ethscriptionHashes;
    }
    if (loops === 50) {
      throw "Timeout";
    }
    loops++;
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }
};
