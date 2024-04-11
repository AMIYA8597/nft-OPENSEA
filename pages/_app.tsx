import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/ui/navbar';
// import { Navbar } from '@/components';

export default function App({ Component, pageProps }: AppProps) {
  return ( 
    <>
    <web3Provider>

    <Navbar />
  <Component {...pageProps} />
  
    </web3Provider>
    </>
   )
}
