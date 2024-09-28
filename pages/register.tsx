// src/pages/register.tsx
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARTNER");
  const [companyId, setCompanyId] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", {
        email,
        password,
        role,
        companyId,
      });
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="ADMIN">Admin</option>
        <option value="COMPANY">Company</option>
        <option value="PARTNER">Partner</option>
      </select>
      <input
        type="number"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
        placeholder="Company ID (if applicable)"
      />
      <button type="submit">Register</button>
    </form>
  );
}
