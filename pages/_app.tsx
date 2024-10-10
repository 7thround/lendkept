import Layout from "../src/components/PartnerPortal/Layout";
import "../src/styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
