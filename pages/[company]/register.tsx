import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { Partner } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import InputMask from "react-input-mask";
import prisma from "../../lib/prisma";
import { sendEmail } from "../../src/utils";

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { company: companySlug } = params;
  const referralCode = context.query.referralCode || ("" as string);
  try {
    const company = await prisma.company.findUnique({
      where: { slug: companySlug },
    });

    if (!company) {
      return {
        notFound: true,
      };
    }

    const partner: Partner = await prisma.partner.findFirst({
      where: {
        referralCode,
        companyId: company.id,
      },
    });

    return {
      props: { company, partner },
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

function RegisterPage({ partner, company }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const referralCode = partner?.referralCode;
  const companyId = company.id;
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [success, setSuccess] = useState(false);

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
      const res = await axios.post("/api/partners", data);
      if (res.status === 201) {
        await sendEmail({
          to: res.data.email,
          subject: "Welcome to the team!",
          template: "WelcomePartner",
          payload: { partner: res.data },
        });
        console.log(`Email sent to ${res.data.email}`);
        await sendEmail({
          to: company.email,
          subject: `${name}, has joined LendKept!`,
          template: "NewPartner",
          payload: { partner },
        });
        console.log(`Email sent to ${company.email}`);
        await sendEmail({
          to: partner.email,
          subject: `You have a new referral!`,
          template: "NewPartner",
          payload: { partner },
        });
        console.log(`Email sent to ${partner.email}`);
        alert("Registration successful. Please login.");
        router.push("/");
      } else {
        alert("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md mx-auto space-y-4 bg-white shadow-md rounded border-t-4"
      style={{ borderColor: company.primaryColor }}
    >
      <div>
        <h2 className="text-2xl text-center font-bold">{company.name}</h2>
        <h3 className="text-center font-semibold text-black">
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
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        required
        className="w-full p-2 border rounded"
      />
      <InputMask
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
        required
        className="w-full p-2 border rounded"
        mask="(999) 999-9999"
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
      <div className="border-b my-4"></div>
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
      <button
        type="submit"
        style={{ backgroundColor: company.primaryColor }}
        className="w-full p-2 bg-[#e74949] text-white rounded"
      >
        Register
      </button>
      {partner && (
        <div className="text-center text-gray-600 mt-6">
          Referred By:{" "}
          <span className="font-bold text-black">{partner.name}</span>
        </div>
      )}
    </form>
  );
}

export default RegisterPage;
