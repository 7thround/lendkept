// components/Layout.js
import React from "react";
import LogoutButton from "./LogoutButton";

const Header = () => (
  <header className="bg-blue-600 text-white p-0">
    <div className="flex items-center justify-between gap-4 mx-auto py-4 px-4 sm:px-4 lg:px-8">
      <a href="/" className="flex items-center gap-2">
        <h1 className="text-2xl">
          Lend<span className="font-bold">KEPT</span>
        </h1>
      </a>
      <LogoutButton />
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-700 text-white p-4 text-center">
    <p className="text-sm text-center">Powered by LendKEPT &copy; 2024</p>
  </footer>
);

const Layout = ({
  children,
  header,
  showLogout = true,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  showLogout?: boolean;
}) => (
  <div className="flex flex-col min-h-screen">
    {header || <Header />}
    <main className="flex-grow bg-gray-100 p-6">{children}</main>
    <Footer />
  </div>
);

export default Layout;
