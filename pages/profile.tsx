import cookie from "cookie";
import jwt from "jsonwebtoken";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from "react";
import InputMask from "react-input-mask";
import prisma from "../lib/prisma";
import {
  FullScreenLoader,
  ProfileImage,
} from "../src/components/Layout/PageParts";
import { resizeImage } from "../src/utils";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
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
      userId: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    let entity = null;
    if (user.role === "COMPANY") {
      entity = await prisma.company.findUnique({
        where: {
          id: user.companyId,
        },
        include: {
          address: true,
        },
      });
    } else {
      entity = await prisma.partner.findUnique({
        where: {
          id: user.partnerId,
        },
        include: {
          address: true,
        },
      });
    }

    if (!user || !entity) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    return {
      props: {
        user,
        entity: JSON.parse(JSON.stringify(entity)),
        company: JSON.parse(JSON.stringify(entity)),
        partner: JSON.parse(JSON.stringify(entity)),
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

const ProfileEdit = ({ entity, user }) => {
  const [name, setName] = useState(entity.name);
  const [email, setEmail] = useState(entity.email);
  const [phone, setPhone] = useState(entity.phone);
  const isCompanyAdmin = user.role === "COMPANY";
  const [addressLine1, setAddressLine1] = useState(entity.address.addressLine1);
  const [addressLine2, setAddressLine2] = useState(entity.address.addressLine2);
  const [profileImage, setProfileImage] = useState(
    entity.profileImage ?? entity.logo ?? ""
  );
  const [city, setCity] = useState(entity.address.city);
  const [state, setState] = useState(entity.address.state);
  const [zip, setZip] = useState(entity.address.zip);
  const [slug, setSlug] = useState(entity.slug);
  const [primaryColor, setPrimaryColor] = useState(entity.primaryColor);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [includeImage, setIncludeImage] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, 100, 100, (resizedBase64) => {
        setProfileImage(resizedBase64);
      });
    }
    setIncludeImage(true);
  };

  const handleSubmit = async (e) => {
    const url = isCompanyAdmin
      ? `/api/companies/${entity.id}`
      : `/api/partners/${entity.id}`;
    const payload = isCompanyAdmin
      ? {
          ...(includeImage && { logo: profileImage }),
          slug,
          primaryColor,
          url,
        }
      : { profileImage };
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          phone,
          name,
          email,
          address: {
            id: entity.address.id,
            addressLine1,
            addressLine2,
            city,
            state,
            zip,
          },
        }),
      });
      if (res.ok) {
        setMessage("Profile updated successfully.");
        window.location.reload();
      } else {
        const { message } = await res.json();
        console.log("message", message);
        setError("Failed to update profile. Try again later.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <div>
      {loading && <FullScreenLoader />}
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-md mx-auto space-y-4 bg-white shadow-md rounded"
      >
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
        <div className="flex items-center justify-between gap-4">
          {!includeImage && <ProfileImage src={profileImage} />}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-[#e74949] text-white rounded"
        >
          {loading ? "Loading..." : "Update Profile"}
        </button>
        {message && (
          <div className="bg-green-100 text-green-800 p-4 mb-4 rounded">
            {message}
          </div>
        )}
      </form>
      {error && (
        <div className="bg-red-100 text-red-800 p-4 mt-4 rounded">{error}</div>
      )}
    </div>
  );
};

export default ProfileEdit;
