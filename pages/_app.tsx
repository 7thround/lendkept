import Layout from "../src/components/Layout/Layout";
import "../src/styles/globals.css";

function App({ Component, pageProps, router }) {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
