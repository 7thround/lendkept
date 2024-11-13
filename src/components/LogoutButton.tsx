import cookie from "js-cookie";
import { useRouter } from "next/router";

const LogoutButton = ({ closeModal }) => {
  const router = useRouter();

  const handleLogout = () => {
    cookie.remove("token");
    router.push("/login");
    closeModal();
  };

  return (
    <button
      className="w-full px-4 py-2 hover:bg-gray-100 text-left flex items-center gap-2"
      onClick={handleLogout}
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
          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
        />
      </svg>
      Logout
    </button>
  );
};

export default LogoutButton;
