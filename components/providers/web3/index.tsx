import { FunctionComponent, createContext, useContext, useEffect, useState } from "react";
import {createDefaultState, loadContract, Web3State } from "./utils"
import { BrowserProvider, parseUnits, ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";

const Web3Context = createContext<Web3State> ( createDefaultState() );

const  Web3Provider : FunctionComponent<any> = ({children}) => {

 const [web3Api , setwebApi] = useState<Web3State>(createDefaultState())

 const ethereum = typeof window !== "undefined" ?  window.ethereum : null;

 const provider = ethereum ? new ethers.BrowserProvider(window.ethereum) :null

 // Checking if MetaMask is installed

 useEffect(()=>{ 
   async function initWeb3() {
        console.log("Init web3")

        const contract = await loadContract(provider)
        setwebApi({
            ethereum:ethereum,
            provider :provider,
            contract : null,
            isLoading : false,
        })
    }

    initWeb3()
 } , [])

//  if (!web3Api && ethereum) {
//    const provider = new ethers.providers.Web3Provider(ethereum);
//    try{
//      const accounts = await provider.send("eth_requestAccounts", []);
//      let networkId = await provider.getNetwork()
//      networkId = networkId.chainId;
     
//      console.log('Connected to Network ' + networkId)
//      const signer = provider.getSigner();
//      const account = accounts[0];
//      const web3 = new Web3(signer.provider as any)
//      setwebApi({...createDefaultState(), web3: web3, account:account,networkID:networkId, signer:signer })
   
//    }catch{
//      console.log('Not able to connect to Metamask')
//    }
// }
    return (
        <>
            <Web3Context.Provider value = {web3Api}>
                {children}
            </Web3Context.Provider>
        </>
    )
}

export function useweb3() {
    return useContext(Web3Context);
}

export default Web3Provider























// import { FunctionComponent, createContext, useContext, useEffect, useState } from "react";
// import { MetaMaskInpageProvider } from "@metamask/providers";
// import { Web3State, createDefaultState } from "./utils";
// import { ethers } from "ethers";

// const Web3Context = createContext<Web3State>(createDefaultState())

// const Web3Provider : FunctionComponent<any> =({children}) =>{
//     const [web3Api, setweb3Api] = useState<Web3State>(createDefaultState())
//     const ethereum = typeof window !== 'undefined' ? window.ethereum : null;

//     const provider = ethereum ? new ethers.BrowserProvider(ethereum) : null;


//     useEffect(() => {
//       function initWeb3(){
//         setweb3Api({
//             ethereum : window.ethereum,
//             provider : provider,
//             contract : null,
//             isLoading : false
//         })
//       }
//       initWeb3()
//     }, [])
    
//     return (

//         <Web3Context.Provider value={web3Api}>
//             {children}
//         </Web3Context.Provider>
//     )
// }

// export function useweb3(){
//     return useContext(Web3Context)
// }

// export default Web3Provider




























