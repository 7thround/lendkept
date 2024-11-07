import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { Company, Partner } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { User } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import InputMask from "react-input-mask";
import prisma from "../../lib/prisma";
import { FullScreenLoader } from "../../src/components/Layout/PageParts";
import { resizeImage, sendEmail } from "../../src/utils";

export const getServerSideProps = async ({ params, query }) => {
  const { company: companySlug } = params;
  const referralCode = query.referralCode || "";

  const referringPartner = await prisma.partner.findFirst({
    where: { referralCode },
    include: { company: true },
  });

  const company = referringPartner
    ? referringPartner.company
    : await prisma.company.findFirst({
        where: { slug: companySlug },
      });

  return {
    props: {
      referringPartner: JSON.parse(JSON.stringify(referringPartner)),
      company: JSON.parse(JSON.stringify(company)),
    },
  };
};

function RegisterPage({
  referringPartner,
  company,
}: {
  referringPartner?: Partner;
  company: Company;
}) {
  const referralCode = referringPartner?.referralCode;
  const companyId = company.id;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, 100, 100, (resizedBase64) => {
        setProfileImage(resizedBase64);
      });
    }
  };

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
      profileImage,
    };
    try {
      setLoading(true);
      const res: AxiosResponse<User> = await axios.post("/api/partners", data);
      if (res.status === 201) {
        await sendEmail({
          to: res.data.email as string,
          subject: "Welcome to your Lender Referral team!",
          template: "WelcomePartner",
          payload: { partner: res.data },
        });
        await sendEmail({
          to: company.email as string,
          subject: `${name}, has joined as a Lender Partner!`,
          template: "NewPartner",
          payload: { partner: res.data },
        });
        if (referringPartner) {
          await sendEmail({
            to: referringPartner.email,
            subject: `${name}, has joined as your new affiliate!`,
            template: "NewPartner",
            payload: { partner: res.data },
          });
        }
        alert("Registration Complete! We will redirect you to the dashboard.");
        router.push("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message ?? "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-lg mx-auto space-y-4 bg-white shadow-md rounded border-t-4"
        style={{ borderColor: company.primaryColor as string }}
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
              style={{ color: company.primaryColor as string }}
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
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          style={{ backgroundColor: company.primaryColor as string }}
          className="w-full p-2 bg-[#e74949] text-white rounded"
        >
          {loading ? "Loading..." : "Register"}
        </button>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {referringPartner && (
          <div className="text-center text-gray-600 mt-6">
            Referred By:{" "}
            <span className="font-bold text-black">
              {referringPartner.name}
            </span>
          </div>
        )}
      </form>
    </>
  );
}

export default RegisterPage;
