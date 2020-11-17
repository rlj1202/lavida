import { AppProps } from 'next/app'

import '../styles/globals.css'
import 'highlight.js/styles/github.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component className="top" {...pageProps} />
}

export default MyApp
