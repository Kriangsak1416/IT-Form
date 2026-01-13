"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import md5 from "md5";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const hashedPassword = md5(password);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: hashedPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        addToast(data.error || "Login failed", "error");
        return;
      }

      // บันทึก user ลง localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      addToast("เข้าสู่ระบบสำเร็จ", "success");

      // Redirect กลับหน้าแรก
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      const errorMsg = "An error occurred. Please try again.";
      setError(errorMsg);
      addToast(errorMsg, "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <Image
            src="/logo.jpg"
            alt="โรงพยาบาลแพร่"
            width={80}
            height={80}
            className="mx-auto"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            แบบฟอร์มศูนย์คอมพิวเตอร์
          </h1>
          <h1 className="text-2xl font-bold text-gray-900">
            โรงพยาบาลแพร่
          </h1>
          <p className="text-sm text-gray-600">
            แบบฟอร์มออนไลน์ศูนย์คอมพิวเตอร์
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              ชื่อผู้ใช้
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            กลับหน้าเว็บไซต์
          </Link>
        </div>
      </div>
    </div>
  );
}