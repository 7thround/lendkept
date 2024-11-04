import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage(
          "If the email exists, you will receive a password reset link."
        );
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
        <h2 className="text-2xl font-bold mb-8 text-center">Forgot Password</h2>
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

export default ForgotPassword;
