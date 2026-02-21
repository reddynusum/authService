"use client";

export default function Test() {
  const signup = async () => {
    await fetch("/api/auth/signup", {
      method: "POST",
      credentials: "include", // ⭐ REQUIRED
    });
  };

  return <button onClick={signup}>Signup</button>;
}
