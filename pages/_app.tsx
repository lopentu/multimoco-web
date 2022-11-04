import '../styles/globals.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
// import '../styles/globals.css';
// import { createTheme, NextUIProvider } from '@nextui-org/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            maxHeight: 50 * 4.5 + 50,
            padding: 0,
            minWidth: 100,
          }
        }
      }
    }
  })
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
    // <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    // {/* </ThemeProvider> */}
    // </NextUIProvider>
  )
}

export default MyApp
