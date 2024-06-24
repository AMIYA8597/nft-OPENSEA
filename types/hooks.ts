import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers"
import { SWRResponse } from "swr";
import { NftMarketContract } from "./nftMarketContract";


export type Web3Dependencies = {
  provider: providers.Web3Provider;
  contract: NftMarketContract;
  ethereum: MetaMaskInpageProvider;
  isLoading: boolean;
}

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>
}

export type CryptoHandlerHook<D = any, R = any, P = any> = (params?: P) => CryptoSWRResponse<D, R>

export type CryptoSWRResponse<D = any, R = any> = SWRResponse<D> & R;


// export type CryptoHookFactory<D = any, P = any> = {
//   (d: Partial<Web3Dependencies>): (params: P) => SWRResponse<D>
// }




























// import { MetaMaskInpageProvider } from "@metamask/providers";
// import { Contract, providers } from "ethers"
// import { SWRResponse } from "swr";


// export type Web3Dependencies = {
//   provider: providers.Web3Provider;
//   contract: Contract;
//   ethereum: MetaMaskInpageProvider;
//   isLoading: boolean;
// }

// export type CryptoHookFactory<D = any, R = any, P = any> = {
//   (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>
// }

// export type CryptoHandlerHook<D = any, R = any, P = any> = (params?: P) => CryptoSWRResponse<D, R>

// export type CryptoSWRResponse<D = any, R = any> = SWRResponse<D> & R;


// // export type CryptoHookFactory<D = any, P = any> = {
// //   (d: Partial<Web3Dependencies>): (params: P) => SWRResponse<D>
// // }
















// // import { MetaMaskInpageProvider } from "@metamask/providers"
// // import { BrowserProvider, Contract } from "ethers"
// // import { SWRResponse } from "swr"


// // export type Web3Dependencies = {
// //     ethereum : MetaMaskInpageProvider,
// //     provider : BrowserProvider|null,
// //     contract : Contract,
// //     isLoading : boolean
// // }


// // export type CryptoHookFactory<D=any,R=any,P=any> = {
// //     (d:Partial<Web3Dependencies>) : CryptoHookHandler<D,R,P>
// // }
// // export type CryptoHookHandler<D=any,R=any,P=any> = (params?: P) => CryptoHandlerResponse<D,any> & R

// // export type CryptoHandlerResponse<D=any,R=any> = SWRResponse<D> &R




























// // // import { MetaMaskInpageProvider } from "@metamask/providers"
// // // import { BrowserProvider, Contract } from "ethers"
// // // import { SWRResponse } from "swr"

// // // export type Web3Dependencies = {
// // //     ethereum: MetaMaskInpageProvider,
// // //     provider: BrowserProvider,
// // //     contract: Contract
// // // }

// // // type CryptoHookFactory<D=any,R=any,p=any> = {
// // //     (d.Partial<web3Dependencies) : CryptoHandler<D, R, p>,
// // // }





