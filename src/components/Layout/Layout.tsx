// components/Layout.js
import { Company, Partner } from "@prisma/client";
import { Metadata } from "next/types";
import React, { useState } from "react";
import LogoutButton from "../LogoutButton";
import { ProfileImage } from "./PageParts";

export const metadata: Metadata = {
  title: "Flow",
  description: "AI-Powered Chat Application for Business & Life",
  keywords:
    "AI, Chat Application, Business, Personal, Generative Language Model, Communication, Collaboration, Productivity",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
  appleWebApp: {
    title: "Flow: AI-Powered Chat Application",
    statusBarStyle: "default",
  },
};

const Header = ({
  user,
  isLoanAdmin,
}: {
  user: Partner | Company;
  isLoanAdmin: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  // @ts-ignore
  const profileImage = user?.profileImage ?? user?.logo;
  const firstNameInitial = user?.name
    ? user.name.split("")[0].toUpperCase()
    : null;
  return (
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
        <div className="relative">
          {user && (
            <button onClick={toggleMenu} className="flex items-center gap-2">
              {profileImage ? (
                <ProfileImage src={profileImage} />
              ) : (
                <div className="w-8 h-8 bg-gray-700 text-white flex items-center justify-center rounded-full">
                  {firstNameInitial}
                </div>
              )}
            </button>
          )}
          {menuOpen && (
            <>
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20 overflow-hidden">
                {!isLoanAdmin && (
                  <>
                    <a
                      href="/profile"
                      className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                      Profile
                    </a>
                    <a
                      href="https://7throundclub.com"
                      className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                        />
                      </svg>
                      Classroom
                    </a>
                    <a
                      href="/help"
                      className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                        />
                      </svg>
                      Help
                    </a>
                  </>
                )}
                <LogoutButton closeModal={() => setMenuOpen(false)} />
              </div>
              <div
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-10"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-white p-4 text-center">
    <p className="text-sm text-center">Powered by LendKEPT &copy; 2024</p>
  </footer>
);

const Layout = ({
  children,
  user,
  partner,
  company,
}: {
  children: React.ReactNode;
  user?: any;
  partner?: any;
  company?: any;
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        user={user?.role === "PARTNER" ? partner : company}
        isLoanAdmin={user?.role === "LOAN_ADMIN"}
      />
      <div className="flex-grow bg-gray-100 p-4">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
