// src/components/withAuth.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        try {
          const response = await axios.get("/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            router.push("/login");
          }
        } catch (error) {
          router.push("/login");
        }
      };

      checkAuth();
    }, []);

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
