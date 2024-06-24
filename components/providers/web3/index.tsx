import { createContext, FunctionComponent, ReactNode, useContext, useEffect, useState } from "react";
import { createDefaultState, createWeb3State, loadContract, Web3State } from "./utils";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { NftMarketContract } from "../../../types/nftMarketContract";

const pageReload = () => { window.location.reload(); }

const handleAccount = (ethereum: MetaMaskInpageProvider) => async () => {
  const isLocked =  !(await ethereum._metamask.isUnlocked());
  if (isLocked) { pageReload(); }
}

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on("chainChanged", pageReload);
  ethereum.on("accountsChanged", handleAccount(ethereum));
}

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum?.removeListener("chainChanged", pageReload);
  ethereum?.removeListener("accountsChanged", handleAccount(ethereum));
}

const Web3Context = createContext<Web3State>(createDefaultState());

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FunctionComponent<Web3ProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  useEffect(() => {
    async function initWeb3() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const contract =  await loadContract("NftMarket", provider);

        const signer = provider.getSigner();
        const signedContract = contract.connect(signer);

        setTimeout(() => setGlobalListeners(window.ethereum), 500);
        setWeb3Api(createWeb3State({
          ethereum: window.ethereum,
          provider,
          contract: signedContract as unknown as NftMarketContract,
          isLoading: false
        }))
      } catch(e: any) {
        console.error("Please, install web3 wallet");
        setWeb3Api((api: Web3State) => createWeb3State({
          ...api,
          ethereum: null,
          provider: null,
          contract: null,
          isLoading: false,
        }))
      }
    }

    initWeb3();
    return () => removeGlobalListeners(window.ethereum);
  }, [])

  return (
    <Web3Context.Provider value={web3Api}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks() {
  const { hooks } = useWeb3();
  return hooks;
}

export default Web3Provider;






























// import { createContext, FunctionComponent, ReactNode, useContext, useEffect, useState } from "react"
// import { createDefaultState, createWeb3State, loadContract, Web3State } from "./utils";
// import { ethers } from "ethers";
// import { MetaMaskInpageProvider } from "@metamask/providers";
// import { NftMarketContract } from "../../../types/nftMarketContract";

// const pageReload = () => { window.location.reload(); }

// const handleAccount = (ethereum: MetaMaskInpageProvider) => async () => {
//   const isLocked =  !(await ethereum._metamask.isUnlocked());
//   if (isLocked) { pageReload(); }
// }

// const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
//   ethereum.on("chainChanged", pageReload);
//   ethereum.on("accountsChanged", handleAccount(ethereum));
// }

// const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
//   ethereum?.removeListener("chainChanged", pageReload);
//   ethereum?.removeListener("accountsChanged", handleAccount(ethereum));
// }

// const Web3Context = createContext<Web3State>(createDefaultState());

// interface Web3ProviderProps {
//   children: ReactNode;
// }

// const Web3Provider: FunctionComponent<Web3ProviderProps> = ({ children }) => {
//   const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

//   useEffect(() => {
//     async function initWeb3() {
//       try {
//         const provider = new ethers.providers.Web3Provider(window.ethereum as any);
//         const contract =  await loadContract("NftMarket", provider);

//         const signer = provider.getSigner();
//         const signedContract = contract.connect(signer);

//         setTimeout(() => setGlobalListeners(window.ethereum), 500);
//         setWeb3Api(createWeb3State({
//           ethereum: window.ethereum,
//           provider,
//           contract: signedContract as unknown as NftMarketContract,
//           isLoading: false
//         }))
//       } catch(e: any) {
//         console.error("Please, install web3 wallet");
//         setWeb3Api((api: Web3State) => createWeb3State({
//           ...api as any,
//           isLoading: false,
//         }))
//       }
//     }

//     initWeb3();
//     return () => removeGlobalListeners(window.ethereum);
//   }, [])

//   return (
//     <Web3Context.Provider value={web3Api}>
//       {children}
//     </Web3Context.Provider>
//   )
// }

// export function useWeb3() {
//   return useContext(Web3Context);
// }

// export function useHooks() {
//   const { hooks } = useWeb3();
//   return hooks;
// }

// export default Web3Provider;



































// import { createContext, FunctionComponent, useContext, useEffect, useState } from "react"
// import { createDefaultState, createWeb3State, loadContract, Web3State } from "./utils";
// import { ethers } from "ethers";
// import { MetaMaskInpageProvider } from "@metamask/providers";
// import { NftMarketContract } from "../../../types/nftMarketContract";

// const pageReload = () => { window.location.reload(); }

// const handleAccount = (ethereum: MetaMaskInpageProvider) => async () => {
//   const isLocked =  !(await ethereum._metamask.isUnlocked());
//   if (isLocked) { pageReload(); }
// }

// const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
//   ethereum.on("chainChanged", pageReload);
//   ethereum.on("accountsChanged", handleAccount(ethereum));
// }

// const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
//   ethereum?.removeListener("chainChanged", pageReload);
//   ethereum?.removeListener("accountsChanged", handleAccount);
// }

// const Web3Context = createContext<Web3State>(createDefaultState());

// const Web3Provider: FunctionComponent = ({children}) => {
//   const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

//   useEffect(() => {
//     async function initWeb3() {
//       try {
//         const provider = new ethers.providers.Web3Provider(window.ethereum as any);
//         const contract =  await loadContract("NftMarket", provider);

//         const signer = provider.getSigner();
//         const signedContract = contract.connect(signer);

//         setTimeout(() => setGlobalListeners(window.ethereum), 500);
//         setWeb3Api(createWeb3State({
//           ethereum: window.ethereum,
//           provider,
//           contract: signedContract as unknown as NftMarketContract,
//           isLoading: false
//         }))
//       } catch(e: any) {
//         console.error("Please, install web3 wallet");
//         setWeb3Api((api) => createWeb3State({
//           ...api as any,
//           isLoading: false,
//         }))
//       }
//     }

//     initWeb3();
//     return () => removeGlobalListeners(window.ethereum);
//   }, [])

//   return (
//     <Web3Context.Provider value={web3Api}>
//       {children}
//     </Web3Context.Provider>
//   )
// }

// export function useWeb3() {
//   return useContext(Web3Context);
// }

// export function useHooks() {
//   const { hooks } = useWeb3();
//   return hooks;
// }

// export default Web3Provider;





































// import { createContext, FunctionComponent, useContext, useEffect, useState } from "react"
// import { createDefaultState, createWeb3State, loadContract, Web3State } from "./utils";
// import { ethers } from "ethers";
// import { MetaMaskInpageProvider } from "@metamask/providers";

// const pageReload = () => { window.location.reload(); }

// const handleAccount = (ethereum: MetaMaskInpageProvider) => async () => {
//   const isLocked =  !(await ethereum._metamask.isUnlocked());
//   if (isLocked) { pageReload(); }
// }

// const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
//   ethereum.on("chainChanged", pageReload);
//   ethereum.on("accountsChanged", handleAccount(ethereum));
// }

// const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
//   ethereum?.removeListener("chainChanged", pageReload);
//   ethereum?.removeListener("accountsChanged", handleAccount);
// }

// const Web3Context = createContext<Web3State>(createDefaultState());

// const Web3Provider: FunctionComponent = ({children}) => {
//   const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

//   useEffect(() => {
//     async function initWeb3() {
//       try {
//         const provider = new ethers.providers.Web3Provider(window.ethereum as any);
//         const contract =  await loadContract("NftMarket", provider);

//         setGlobalListeners(window.ethereum);
//         setWeb3Api(createWeb3State({
//           ethereum: window.ethereum,
//           provider,
//           contract,
//           isLoading: false
//         }))
//       } catch(e: any) {
//         console.error("Please, install web3 wallet");
//         setWeb3Api((api) => createWeb3State({
//           ...api as any,
//           isLoading: false,
//         }))
//       }
//     }

//     initWeb3();
//     return () => removeGlobalListeners(window.ethereum);
//   }, [])

//   return (
//     <Web3Context.Provider value={web3Api}>
//       {children}
//     </Web3Context.Provider>
//   )
// }

// export function useWeb3() {
//   return useContext(Web3Context);
// }

// export function useHooks() {
//   const { hooks } = useWeb3();
//   return hooks;
// }

// export default Web3Provider;













































// import { FunctionComponent, createContext, useContext, useEffect, useState } from "react";
// import {createDefaultState, loadContract, Web3State } from "./utils"
// import { BrowserProvider, parseUnits, ethers } from "ethers";
// import { MetaMaskInpageProvider } from "@metamask/providers";

// const Web3Context = createContext<Web3State> ( createDefaultState() );

// const  Web3Provider : FunctionComponent<any> = ({children}) => {

//  const [web3Api , setwebApi] = useState<Web3State>(createDefaultState())

//  const ethereum = typeof window !== "undefined" ?  window.ethereum : null;

//  const provider = ethereum ? new ethers.BrowserProvider(window.ethereum) :null

//  // Checking if MetaMask is installed

//  useEffect(()=>{ 
//    async function initWeb3() {
//         console.log("Init web3")

//         const contract = await loadContract(provider!, "SimpleStorage")
//         setwebApi({
//             ethereum:ethereum,
//             provider :provider,
//             contract : contract,
//             isLoading : false,
//         })
//     }

//     initWeb3()
//  } , [])

// //  if (!web3Api && ethereum) {
// //    const provider = new ethers.providers.Web3Provider(ethereum);
// //    try{
// //      const accounts = await provider.send("eth_requestAccounts", []);
// //      let networkId = await provider.getNetwork()
// //      networkId = networkId.chainId;
     
// //      console.log('Connected to Network ' + networkId)
// //      const signer = provider.getSigner();
// //      const account = accounts[0];
// //      const web3 = new Web3(signer.provider as any)
// //      setwebApi({...createDefaultState(), web3: web3, account:account,networkID:networkId, signer:signer })
   
// //    }catch{
// //      console.log('Not able to connect to Metamask')
// //    }
// // }
//     return (
//         <>
//             <Web3Context.Provider value = {web3Api}>
//                 {children}
//             </Web3Context.Provider>
//         </>
//     )
// }

// export function useweb3() {
//     return useContext(Web3Context);
// }

// export default Web3Provider























// // import { FunctionComponent, createContext, useContext, useEffect, useState } from "react";
// // import { MetaMaskInpageProvider } from "@metamask/providers";
// // import { Web3State, createDefaultState } from "./utils";
// // import { ethers } from "ethers";

// // const Web3Context = createContext<Web3State>(createDefaultState())

// // const Web3Provider : FunctionComponent<any> =({children}) =>{
// //     const [web3Api, setweb3Api] = useState<Web3State>(createDefaultState())
// //     const ethereum = typeof window !== 'undefined' ? window.ethereum : null;

// //     const provider = ethereum ? new ethers.BrowserProvider(ethereum) : null;


// //     useEffect(() => {
// //       function initWeb3(){
// //         setweb3Api({
// //             ethereum : window.ethereum,
// //             provider : provider,
// //             contract : null,
// //             isLoading : false
// //         })
// //       }
// //       initWeb3()
// //     }, [])
    
// //     return (

// //         <Web3Context.Provider value={web3Api}>
// //             {children}
// //         </Web3Context.Provider>
// //     )
// // }

// // export function useweb3(){
// //     return useContext(Web3Context)
// // }

// // export default Web3Provider




























