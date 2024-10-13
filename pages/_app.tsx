import Layout from "../src/components/Layout";
import "../src/styles/globals.css";

function App({ Component, pageProps, router }) {
  const isApplicationPage = router.route.includes("/apply");
  const { company } = pageProps;
  if (isApplicationPage && company) {
    const header = (
      <header className="bg-white text-white p-0 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between gap-4 mx-auto py-4 px-4 sm:px-4 lg:px-8">
          <a href="/" className="flex items-center gap-2">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-40" />
            ) : (
              <h1 className="text-2xl">{company.name}</h1>
            )}
          </a>
        </div>
      </header>
    );
    return (
      <Layout header={header}>
        <Component {...pageProps} />
      </Layout>
    );
  }
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
