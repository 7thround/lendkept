import ArrowLeftCircleIcon from "@heroicons/react/20/solid/ArrowLeftCircleIcon";
import Layout from "../src/components/Layout/Layout";
import "../src/styles/globals.css";

function App({ Component, pageProps, router }) {
  const isApplicationPage =
    router.route.includes("/apply") || router.route.includes("/register");
  const showBackButton =
    router.route.includes("/register") ||
    router.route.includes("/apply") ||
    router.route.includes("/new-loan") ||
    router.route.includes("loans");
  const { company } = pageProps;
  if (isApplicationPage && company) {
    const WhiteLabelHeader = (
      <header className="bg-black text-white p-0 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between gap-4 mx-auto py-4 px-4 sm:px-4 lg:px-8">
          <a href="/" className="flex items-center gap-2">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-32" />
            ) : (
              <h1 className="text-2xl">{company.name}</h1>
            )}
          </a>
          {showBackButton && (
            <button
              onClick={() => window.history.back()}
              className="text-white mr-2 text-sm"
            >
              <ArrowLeftCircleIcon />
              Back
            </button>
          )}
        </div>
      </header>
    );
    return (
      <Layout hideNav showBackButton={showBackButton}>
        <Component {...pageProps} />
      </Layout>
    );
  }
  return (
    <Layout {...pageProps} showBackButton={showBackButton}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
