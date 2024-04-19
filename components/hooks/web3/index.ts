import { useHooks } from "@providers/web3"


export const useAccount = () => {
  const hooks = useHooks();
  const swrRes = hooks.useAccount();

  return {
    account: swrRes
  }
}

export const useNetworks =() => {
  const hook = useHooks();
  const swrRes = hooks.useNetworks();

  return {
    network: swrRes
  }
}