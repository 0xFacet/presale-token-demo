export interface BridgeObject {
  bridge_type: BridgeType;
  tick: string;
  smart_contract: `0x${string}`;
  dumb_contract: `0x${string}`;
  max_bridge_amount: null | string;
  mint_amount: null | string;
}

export type BridgeType = "EtherBridge" | "EthscriptionsTokenBridge";
