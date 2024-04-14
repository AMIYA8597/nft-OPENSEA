import { MetaMaskInpageProvider } from "@metamask/providers"
import { promises } from "dns"
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


const NETWORK_ID = 5777

export const loadContract = async (provider : BrowserProvider, name:String): Promise<Contract> => {

    const res = await fetch(`contracts/${name}.json`);
    // const res = await fetch(../../build/contracts/SimpleStorage.json);
    const Artifacts = await res.json();
    if(Artifacts.networks[NETWORK_ID]){

        const contract = new ethers.Contract(Artifacts.networks[NETWORK_ID].address,
            Artifacts.abi, provider)
            console.log("this is inside loadContract", contract);
            
            return contract
    } else {
        return Promise.reject(`contract ${name} cannot be loaded`);
    }

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