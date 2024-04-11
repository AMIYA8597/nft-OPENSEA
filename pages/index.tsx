// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'

// export default function Home() {
//   return (
//     <div className={styles.container}>  Hello openRiver</div>
//   )
// }





/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next';
import { BaseLayout } from '../components/ui';
import NftList from '../components/ui/nfts/list';
import nfts from "../content/meta.json"
import { NftMeta } from '../types/nft';
import { useweb3 } from '@/components/providers/web3';

const Home: NextPage = () => {
  const {test} = useweb3
  return (

    // <BaseLayout>
    // {test}
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Amazing Creatures NFTs</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Mint a NFT to get unlimited ownership forever!
            </p>
          </div>
          
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">

          <NftList item = {nfts as unknown as NftMeta[]}/> 
  



          </div>
        </div>
      </div>
    // </BaseLayout>
    
    
    
    //  <>
    //      <h1>
    //       MINT A NFT to get unlimited ownership foreever
    //      </h1>
        
    //       <NftList item = {nfts as unknown as NftMeta[]}/>  
    // </>

  );
};

export default Home;







