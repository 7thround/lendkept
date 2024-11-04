import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { FullScreenLoader } from "../src/components/Layout/PageParts";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setError("");
    setLoading(true);
    e.preventDefault();
    try {
      await axios.post("/api/auth/login", { email, password });
      await router.push("/");
    } catch (error) {
      console.error(error);
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="flex items-center justify-center bg-gray-100 mt-24">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md space-y-4 w-96"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Login</h2>
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-[#e74949] text-white rounded hover:bg-[#e74949]"
          >
            Login
          </button>
          <a href="/forgot-password" className="block mt-2 text-center">
            Forgot your password?
          </a>
          {error && <p className="text-[#e74949] text-center">{error}</p>}
        </form>
      </div>
    </>
  );
}
