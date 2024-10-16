import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const getServerSideProps = async (context) => {
  try {
    const { req } = context;
    const cookies = req.headers.cookie;
    const parsedCookies = cookie.parse(cookies || "");
    const token = parsedCookies.token;

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: number;
      role: string;
    };

    if (decoded.role !== "ADMIN") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        userId: decoded.userId,
        role: decoded.role,
      },
    };
  } catch (error) {
    console.error("Error verifying the user:", error);

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

function UsersPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARTNER");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
      role,
      name,
      phone,
      referralCode,
      companyId,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
    };

    try {
      await axios.post("/api/auth/register", data);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto space-y-4">
      <input
        autoComplete="new-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full p-2 border rounded"
      />
      <input
        autoComplete="new-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full p-2 border rounded"
      />

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="PARTNER"
            checked={role === "PARTNER"}
            onChange={() => setRole("PARTNER")}
            className="mr-2"
          />
          Partner
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="COMPANY"
            checked={role === "COMPANY"}
            onChange={() => setRole("COMPANY")}
            className="mr-2"
          />
          Company
        </label>
      </div>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={role === "PARTNER" ? "Full Name" : "Company Name"}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
        required
        className="w-full p-2 border rounded"
      />

      {role === "PARTNER" && (
        <>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Referral Code"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            placeholder="Company ID"
            className="w-full p-2 border rounded"
          />
        </>
      )}

      {role === "COMPANY" && <>{/* company fields go here */}</>}

      <input
        type="text"
        value={addressLine1}
        onChange={(e) => setAddressLine1(e.target.value)}
        placeholder="Address Line 1"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={addressLine2}
        onChange={(e) => setAddressLine2(e.target.value)}
        placeholder="Address Line 2"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="State (e.g. CA)"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        placeholder="Zip"
        required
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full p-2 bg-[#e74949] text-white rounded"
      >
        Register
      </button>
    </form>
  );
}

export default UsersPage;
