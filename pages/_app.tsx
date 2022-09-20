import 'mdb-react-ui-kit/dist/css/mdb.min.css'
// import '../styles/globals.css';
// import { createTheme, NextUIProvider } from '@nextui-org/react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  // const theme = createTheme({
  //   type: "light",
  //   theme: {
  //     colors: {
  //       primary: "#009f86",        
  //       primaryLightContrast: "#FFFFFF",
  //       primaryHover: "#35ceb6",
  //       primaryLightHover: "#35ceb6",
  //       primarySolidHover: "#35ceb6",
  //       primaryLight: "#009f86"
  //     }
  //   }
  // });
  
  return (
    // <NextUIProvider theme={theme}>
      <Component {...pageProps} />
    // </NextUIProvider>
  )
}

export default MyApp
