
import { setupHooks, Web3Hooks } from "@hooks/web3/setupHooks";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Web3Dependencies } from "../../../types/hooks";
import { Contract, ethers, Provider } from "ethers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
}

export type Web3State = {
  isLoading: boolean; // true while loading web3State
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>


export const createDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks({isLoading: true} as any)
  }
}

export const createWeb3State = ({
  ethereum, provider, contract, isLoading
}: Web3Dependencies) => {
  return {
    ethereum,
    provider,
    contract,
    isLoading,
    hooks: setupHooks({ethereum, provider, contract, isLoading})
  }
}

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
  name: string,  // NftMarket
  provider: providers.Web3Provider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new ethers.Contract(
      Artifact.networks[NETWORK_ID].address,
      Artifact.abi,
      provider
    )

    return contract;
  } else {
    return Promise.reject(`Contract: [${name}] cannot be loaded!`);
  }
}











// import { MetaMaskInpageProvider } from "@metamask/providers"
// import { promises } from "dns"
// import { BrowserProvider, Contract, ethers,Provider } from "ethers"

// declare global {
//     interface Window{
//         ethereum : MetaMaskInpageProvider
//     }
// }

// export type Web3Params ={
//     ethereum : MetaMaskInpageProvider | null,
//     provider : BrowserProvider | null,
//     contract : Contract | null
// }

// export type Web3State = {
//     isLoading : boolean
// } & Web3Params

// export const createDefaultState = () =>{
//     return {
//         ethereum : null,
//         provider : null,
//         contract : null,
//         isLoading : true
//     }
// }


// const NETWORK_ID = 5777

// export const loadContract = async (provider : BrowserProvider, name:String): Promise<Contract> => {

//     const res = await fetch(`contracts/${name}.json`);
//     // const res = await fetch(../../build/contracts/SimpleStorage.json);
//     const Artifacts = await res.json();
//     if(Artifacts.networks[NETWORK_ID]){

//         const contract = new ethers.Contract(Artifacts.networks[NETWORK_ID].address,
//             Artifacts.abi, provider)
//             console.log("this is inside loadContract", contract);
            
//             return contract
//     } else {
//         return Promise.reject(`contract ${name} cannot be loaded`);
//     }

// }











// // import { MetaMaskInpageProvider } from "@metamask/providers"
// // import { BrowserProvider, Contract } from "ethers"

// // decleare global {
// //     interface Window{
// //         ethereum: MetaMaskInpageProvider
// //     }
// // }

// // export type web3Params = {
// //     ethereum: MetaMaskInpageProvider,
// //     provider : BrowserProvider | null,
// //     contract : Contract |null,
// // }

// // export type Web3State = {
// //     isLoading : boolean,
// // }& web3Params

// // export const createDefaultState = () => {
// //     return {
// //         ethereum : null,
// //         provider : null,
// //         contract : null,
// //         isLoading : true,
// //     }
// // }