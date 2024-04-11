import { FunctionComponent } from "react";
import NftItem from "../items";

const NftList: FunctionComponent = () => {
  return (
    <>
      <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
         <NftItem />
      </div>
    </>
  );
};

export default NftList;
