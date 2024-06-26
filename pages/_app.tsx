import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/ui/navbar';
import { Web3Provider } from '@/components/providers';
// import { Navbar } from '@/components';

export default function App({ Component, pageProps }: AppProps) {
  return ( 
    <>
    <Web3Provider>

    <Navbar />

  <Component {...pageProps} />

    </Web3Provider>
    </>
   )
}
