import { InternalTransaction, Transaction } from "./blocks";

export type CurrentState = {
  [key: string]: any;
};

export interface ContractFunction {
  name: string;
  type: "function";
  inputs: FunctionInput[];
  outputs: FunctionOutput[];
  stateMutability: "pure" | "view" | "non_payable";
  visibility: "public" | "private" | "internal";
  overrideModifiers: string[];
  fromParent: boolean;
}

export interface FunctionInput {
  name: string;
  type: string;
}

export interface FunctionOutput {
  name?: string;
  type: string;
}

export interface ContractConstructor {
  type: "constructor";
  inputs: FunctionInput[];
  stateMutability: "non_payable";
  visibility: null;
  overrideModifiers: string[];
  fromParent: boolean;
}

export type ContractABI = Array<ContractFunction | ContractConstructor>;

export interface ContractArtifact {
  name: string;
  source_code: string;
  init_code_hash: string;
  abi: ContractABI;
}

export type SourceCode = {
  code: string;
  language: string;
};

export interface Contract {
  transaction_hash: string;
  current_type: string;
  current_init_code_hash: string;
  abi: ContractABI;
  call_receipts: InternalTransaction[];
  address: `0x${string}`;
  current_state: CurrentState;
  source_code: SourceCode[];
  deployment_transaction?: Transaction;
}

export interface NFTCollectionState {
  WETH: string;
  name: string;
  owner: string;
  paused: boolean;
  perMintFee?: string;
  feeTo?: string;
  symbol: string;
  baseURI: string;
  _ownerOf: { [tokenId: string]: string };
  maxSupply: string;
  _balanceOf: { [address: string]: string };
  maxPerMint: string;
  getApproved: { [tokenId: string]: string };
  totalSupply: string;
  upgradeAdmin: string;
  publicMintEnd: string;
  publicMintPrice: string;
  publicMintStart: string;
  allowListMintEnd: string;
  isApprovedForAll: {
    [ownerAddress: string]: {
      [operatorAddress: string]: boolean;
    };
  };
  metadataRenderer: string;
  _tokenIdToReceiver: { [tokenId: string]: string };
  allowListMintPrice: string;
  allowListMintStart: string;
  publicNumberMinted: { [address: string]: string };
  allowListMerkleRoot: string;
  publicMaxPerAddress: string;
  _defaultFeeNumerator: string;
  allowListNumberMinted: { [address: string]: string };
  _tokenIdToFeeNumerator: { [tokenId: string]: string };
  allowListMaxPerAddress: string;
  _defaultRoyaltyReceiver: string;
  contract_type: string;
}
