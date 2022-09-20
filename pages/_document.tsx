import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
// import { CssBaseline } from "@nextui-org/react";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: React.Children.toArray([initialProps.styles])
    };
  }
  render() {
    return (
      <Html>
        <Head>
          {/* {CssBaseline.flush()} */}
          <meta charSet="utf-8" />
          <meta name="author" content="GIL NTU" />
          <link rel="shortcut icon" href="./favicon.png" />

          <meta name="description" content="Multimodal corpus" />
          <meta name="keywords" content="multimoco,corpus,linguistics,multimodal" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="css/fontawesome.min.css" rel="stylesheet" />
          {/* <link href="css/regular.min.css" rel="stylesheet" />
          <link href="css/solid.min.css" rel="stylesheet" /> */}
          <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          {/* <link
            href="https://fonts.googleapis.com/earlyaccess/cwtexyen.css"
            rel="stylesheet" /> */}
          {/* <link rel="stylesheet" href="css/style.css" /> */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument