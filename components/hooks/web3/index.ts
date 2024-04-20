import { useHooks } from "@providers/web3"


export const useAccount = () => {
  const hooks = useHooks();
  const swrRes = hooks.useAccount();

  return {
    account: swrRes
  }
}

export const useNetwork =() => {
  const hook = useHooks();
  const swrRes = hook.useNetwork();

  return {
    network: swrRes
  }
}