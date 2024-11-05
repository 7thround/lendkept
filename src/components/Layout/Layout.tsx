// components/Layout.js
import { User } from "@prisma/client";
import React from "react";
import UserMenu from "../common/UserMenu";

const Header = ({ user }: { user: User }) => (
  <header className="bg-gray-900 text-white p-0">
    <div className="flex items-center justify-between gap-4 mx-auto py-4 px-4 sm:px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <a href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
            />
          </svg>
          <h1 className="text-2xl">
            Lend<span className="font-bold">KEPT</span>
          </h1>
        </a>
      </div>
      {user && <UserMenu user={user} />}
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white p-4 text-center">
    <p className="text-sm text-center">Powered by LendKEPT &copy; 2024</p>
  </footer>
);

const Layout = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: any;
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      <div className="flex-grow bg-gray-100 p-4">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
