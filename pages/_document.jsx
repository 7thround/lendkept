import {Head, Html, Main, NextScript} from 'next/document';

export default function Document () {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        <meta
          name="description"
          content="Apply for funding with ease. Fill out the loan application form and get started today."
        />
        <meta
          name="keywords"
          content="mortgage, loan application, home purchase"
        />
        <meta name="author" content="LendKEPT" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* <title>LendKEPT</title> */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
