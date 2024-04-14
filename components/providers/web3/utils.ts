import { MetaMaskInpageProvider } from "@metamask/providers"
import { BrowserProvider, Contract, ethers,Provider } from "ethers"

declare global {
    interface Window{
        ethereum : MetaMaskInpageProvider
    }
}

export type Web3Params ={
    ethereum : MetaMaskInpageProvider | null,
    provider : BrowserProvider | null,
    contract : Contract | null
}

export type Web3State = {
    isLoading : boolean
} & Web3Params

export const createDefaultState = () =>{
    return {
        ethereum : null,
        provider : null,
        contract : null,
        isLoading : true
    }
}




export const loadContract = async (provider : BrowserProvider) => {

    const res = await fetch(contracts/SimpleStorage.json);
    // const res = await fetch(../../build/contracts/SimpleStorage.json);
    const Artifacts = await res.json();
    const contract = new ethers.Contract(Artifacts.networks[5777].address,
        Artifacts.abi, provider)

        return contract
}











// import { MetaMaskInpageProvider } from "@metamask/providers"
// import { BrowserProvider, Contract } from "ethers"

// decleare global {
//     interface Window{
//         ethereum: MetaMaskInpageProvider
//     }
// }

// export type web3Params = {
//     ethereum: MetaMaskInpageProvider,
//     provider : BrowserProvider | null,
//     contract : Contract |null,
// }

// export type Web3State = {
//     isLoading : boolean,
// }& web3Params

// export const createDefaultState = () => {
//     return {
//         ethereum : null,
//         provider : null,
//         contract : null,
//         isLoading : true,
//     }
// }