import Layout from "../src/components/Layout/Layout";
import "../src/styles/globals.css";

function App({ Component, pageProps, router }) {
  const showBackButton =
    router.route.includes("/register") ||
    router.route.includes("/new-loan") ||
    (router.route.includes("loans") && !router.route.includes("read_only"));
  return (
    <Layout {...pageProps} showBackButton={showBackButton}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
