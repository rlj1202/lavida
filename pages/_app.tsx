import { AppProps } from 'next/app'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component className="top" {...pageProps} />
}

export default MyApp
