
import { Web3Dependencies } from "@_types/hooks";
import { hookFactory as createAccountHook, UseAccountHook } from "./useAccount";
import { hookFactory as createNetworkHook, useNetworkHook } from "./useNetworks"

export type Web3Hook = {
  useAccount: UseAccountHook;
  useNetwork: useNetworkHook
}

export type SetupHook = {
  (d: Web3Dependencies): Web3Hooks
}

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps)
  }
}