import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useState } from "react";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }),
      });

      if (res.ok) {
        setMessage(
          "Password reset successfully. You can now login with your new password."
        );
        router.push("/");
      } else {
        const { message } = await res.json();
        setError(message);
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 mt-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md space-y-4 w-96"
      >
        <h2 className="text-2xl font-bold mb-8 text-center">Reset Password</h2>
        <div>
          <label className="block mb-2">New Password</label>
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
          className="w-full p-2 bg-[#e74949] text-white rounded hover:bg-[#e74949]"
        >
          {loading ? "Loading..." : "Reset Password"}
        </button>
        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
