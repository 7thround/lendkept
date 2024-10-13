import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import prisma from "../../lib/prisma";
import { Company, Partner } from "@prisma/client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

export const getServerSideProps = async (context) => {
  const { query } = context;
  const { company: companySlug, referralCode } = query;

  try {
    const company = await prisma.company.findUnique({
      where: {
        slug: companySlug,
      },
    });

    if (!company) {
      return {
        notFound: true,
      };
    }

    const partner = await prisma.partner.findFirst({
      where: {
        companyId: company.id,
        referralCode: referralCode,
      },
    });

    if (!partner) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        company,
        partner,
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

function RegisterPage({
  partner,
  company,
}: {
  partner: Partner;
  company: Company;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState(partner.referralCode);
  const [companyId, setCompanyId] = useState(company.id);
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
      role: "PARTNER",
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

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md mx-auto space-y-4 bg-white shadow-md rounded border-t-4"
      style={{ borderColor: company.primaryColor }}
    >
      <div>
        <h2 className="text-2xl text-center text-bold">{company.name}</h2>
        <h3
          style={{ color: company.primaryColor }}
          className="text-lg text-center font-bold"
        >
          Partner Registration
        </h3>
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <a
            href={`/login`}
            style={{ color: company.primaryColor }}
            className="font-bold"
          >
            Login
          </a>
        </p>
      </div>
      <input
        autoComplete="new-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2 items-center">
        <input
          autoComplete="new-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />
        <button
          className="-ml-10"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeIcon className="h-4" />
          ) : (
            <EyeSlashIcon className="h-4" />
          )}
        </button>
      </div>
      <div className="border-b my-4"></div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={"Full Name"}
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
        placeholder="State"
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
        style={{ backgroundColor: company.primaryColor }}
        className="w-full p-2 bg-blue-600 text-white rounded"
      >
        Register
      </button>
      {/* Referral Code Section */}
      {partner && (
        <div className="text-center text-gray-600 mt-6">
          Referred By:{" "}
          <span style={{ color: company.primaryColor }} className="font-bold">
            {partner.name}
          </span>
        </div>
      )}
    </form>
  );
}

export default RegisterPage;
