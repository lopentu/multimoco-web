import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />        
        <meta name="author" content="GIL NTU" />
        <link rel="shortcut icon" href="./favicon.png" />

        <meta name="description" content="Multimodal corpus" />
        <meta name="keywords" content="multimoco,corpus,linguistics,multimodal" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="css/fontawesome.min.css" rel="stylesheet" />
        <link href="css/regular.min.css" rel="stylesheet" />
        <link href="css/solid.min.css" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/earlyaccess/cwtexyen.css"
          rel="stylesheet" />
        <link rel="stylesheet" href="css/style.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}