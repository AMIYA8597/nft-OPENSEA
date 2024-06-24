
// import { Web3Dependencies } from "@_types/hooks";

import { Web3Dependencies } from "@_types/hooks"
import { hookFactory as createAccountHook, UseAccountHook } from "./useAccount";
import { hookFactory as createNetworkHook, UseNetworkHook } from "./useNetworks";
import { hookFactory as createListedNftsHook, UseListedNftsHook } from "./useListedNfts";
import { hookFactory as createOwnedNftsHook, UseOwnedNftsHook } from "./useOwnedNfts";

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useListedNfts: UseListedNftsHook;
  useOwnedNfts: UseOwnedNftsHook;
}

export type SetupHooks = {
  (d: Web3Dependencies): Web3Hooks
}

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
    useListedNfts: createListedNftsHook(deps),
    useOwnedNfts: createOwnedNftsHook(deps),
  }
}























// import { Web3Dependencies } from "@_types/hooks";
// import { hookFactory as createAccountHook, UseAccountHook } from "./useAccount";
// import { hookFactory as createNetworkHook, useNetworkHook } from "./useNetworks"

// export type Web3Hook = {
//   useAccount: UseAccountHook;
//   useNetwork: useNetworkHook
// }

// export type SetupHook = {
//   (d: Web3Dependencies): Web3Hooks
// }

// export const setupHooks: SetupHooks = (deps) => {
//   return {
//     useAccount: createAccountHook(deps),
//     useNetwork: createNetworkHook(deps)
//   }
// }