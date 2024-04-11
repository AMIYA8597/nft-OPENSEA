//  import Web3 from "web3"

import { FunctionComponent, createContext, useContext, useState } from "react";

const web3Context = createContext<any>(null)

const web3Provider : FunctionComponent<any> = ({children}) => {
 const [web3Api , setwebApi] = useState({test: "Hello Provider"})
    return (
        <>
            <web3Context.Provider>
                {children}
            </web3Context.Provider>
        </>
    )
}

export function useweb3() {
    return useContext(web3Context);
}

export default web3Provider