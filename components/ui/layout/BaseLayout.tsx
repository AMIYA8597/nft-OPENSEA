import { FunctionComponent, ReactElement } from "react"
import  Navbar  from "../navbar";
interface childrenProps {
    children : ReactElement | ReactElement[]
}

const BaseLayout: FunctionComponent<childrenProps> = (children) => {
    return (
        <div>  
            
            <Navbar />  
            <div className="py-16 bg-grey-200 overflow-hidden">
                <div className="max-w-7xl px-8 5m:px-8 lg:px-8" >
                 {children}  
                </div>
            </div>

        </div>  
    )
} 

export default BaseLayout