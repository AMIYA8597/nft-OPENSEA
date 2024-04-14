import useSWR from "swr"
import {CryptoHookFactory} from "@types/hooks"

const hookFactory = CryptoHookFactory = (params) =>{
    const SwrRes = useSWR("useWeb3", ()=>{
        console.log(params);
        return "test User"
    })

    return SwrRes;
}