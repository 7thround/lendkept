import { useRouter } from "next/router";
import cookie from "js-cookie";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    cookie.remove("token");
    router.push("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
