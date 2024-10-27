import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import InputMask from "react-input-mask";

export const getServerSideProps = async (context) => {
  try {

    return {
      props: {},
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

function RegisterPage() {
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
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
      role: "PARTNER",
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
    };

    try {
      const res = await axios.post("/api/partners", data);
      if (res.status === 201) {
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
      // style={{ borderColor: company.primaryColor }}
    >
      <div>
        <h2 className="text-2xl text-center font-bold">LendKept</h2>
        <h3 className="text-center font-semibold text-black">
          Partner Registration
        </h3>
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <a
            href={`/login`}
            // style={{ color: company.primaryColor }}
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
        // style={{ backgroundColor: company.primaryColor }}
        className="w-full p-2 bg-[#e74949] text-white rounded"
      >
        Register
      </button>
      <p className="text-center text-gray-600">
        By registering, you agree to receive SMS and Email notifications from LendKept.
      </p>
    </form>
  );
}

export default RegisterPage;
