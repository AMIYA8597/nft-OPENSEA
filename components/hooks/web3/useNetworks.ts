import { CryptoHookFactory } from "@/types/hooks";

import useSWR from "swr";

type useNetworkResponse = {
    isLoading: boolean;
}

type NetworkHookFactory = CryptoHookFactory<string, useNetworkResponse>

export type useNetworkHooks = ReturnType<NetworkHookFactory>

export const hookFactory:NetworkHookFactory = ( {provider, isLoading}) => () => {
    const {data, isValidating , ...swr}= useSWR(
        provider ? "web3/useNetworks" : null,
        async() => {
            return "Testing Networks";

        }, {
            revalidateOnFocus : false
        }
    )

    return {
        ...swr,
        data,
        isValidating,
        isLoading: isLoading || isValidating
    };
}