"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PatientPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [idCard, setIdCard] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { type: "patient", name, dob, idCard };
    console.log("Submit", payload);
    alert("ส่งข้อมูลผู้ป่วยเรียบร้อย");
    setName("");
    setDob("");
    setIdCard("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="h-16 w-16 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <Image
                  src="/logo.jpg"
                  alt="โรงพยาบาลแพร่"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">แบบฟอร์มศูนย์คอมพิวเตอร์ โรงพยาบาลแพร่</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">แบบฟอร์มศูนย์คอมพิวเตอร์</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                ← กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </header>

        {/* Form Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">ใบลงทะเบียนผู้ใช้งานระบบโปรแกรมคอมพิวเตอร์ โรงพยาบาลแพร่</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">กรุณากรอกข้อมูลให้ครบถ้วน</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  ชื่อ-นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="กรุณากรอกชื่อ-นามสกุล"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  วันเกิด <span className="text-red-500">*</span>
                </label>
                <input
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  type="date"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  เลขบัตรประชาชน <span className="text-red-500">*</span>
                </label>
                <input
                  value={idCard}
                  onChange={(e) => setIdCard(e.target.value)}
                  placeholder="กรุณากรอกเลขบัตรประชาชน 13 หลัก"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  maxLength={13}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                ส่งข้อมูล
              </button>
              <button
                type="button"
                onClick={() => { setName(""); setDob(""); setIdCard(""); }}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                ล้างข้อมูล
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}