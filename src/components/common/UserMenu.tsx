import { User } from "@prisma/client";
import { useState } from "react";
import { ProfileImage } from "../Layout/PageParts";
import LogoutButton from "../LogoutButton";

const UserMenu = ({ user }: { user: User }) => {
  const profileImage = user.profileImage;
  const firstNameInitial = user.name
    ? user.name.split("")[0].toUpperCase()
    : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div className="relative">
      <button onClick={toggleMenu} className="flex items-center gap-2">
        {profileImage ? (
          <ProfileImage src={profileImage} />
        ) : (
          <div className="w-8 h-8 bg-gray-700 text-white flex items-center justify-center rounded-full">
            {firstNameInitial}
          </div>
        )}
      </button>
      {menuOpen && (
        <>
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20 overflow-hidden">
            {!(user.role === "LOAN_ADMIN") && (
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
  );
};

export default UserMenu;
