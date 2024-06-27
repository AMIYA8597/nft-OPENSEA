import { FunctionComponent } from "react";
import NftItem from "../items";
import { NftMeta } from "../../../../types/nft";

// interface NftListProps 
//     { 
//         item: 
//         { description: string;
//              image: string;
//               name: string; 
//               attributes:   { trait_type: string; value: string; }[]; }[];
//     }

 interface NftListProps {
    item : NftMeta[]
 }

// interface NftListPops {
//     item : any[] 
// }

  

    const NftList: FunctionComponent <NftListProps> = ({item}) => {
        return (
            <>
    {item.map( (nft) => (
         <div key = {nft.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                {/* <NftItem  item = {nft}/> */}
                <NftItem item={{
                tokenId: 0,
                name: "",
                description: "",
                creator: "",
                price: 0,
                isListed: false,
                meta: {
                    name: "",
                    description: "",
                    image: "",
                    attributes: []
                },
                attributes: [],
                image: ""
            }} buyNft={function (token: number, value: number): Promise<void> {
                throw new Error("Function not implemented.");
            } } />
        </div>
    ))}
               
            </>
        );
    };

export default NftList;