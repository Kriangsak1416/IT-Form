"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function StaffPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [ext, setExt] = useState("");
  const [department, setDepartment] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { type: "staff", name, role, ext, department };
    console.log("Submit", payload);
    alert("บันทึกบุคลากรเรียบร้อย");
    setName(""); setRole(""); setExt(""); setDepartment("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="h-16 w-16 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="โรงพยาบาลแพร่"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </Link>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">แบบฟอร์มศูนย์คอมพิวเตอร์ โรงพยาบาลแพร่</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">แบบฟอร์มรายงานความเสี่ยง</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Link
                href="/"
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
              >
                ← กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </header>

        {/* Form Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">แบบฟอร์มรายงานความเสี่ยง</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">กรุณากรอกข้อมูลความเสี่ยง</p>
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
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  ตำแหน่ง <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">เลือกตำแหน่ง</option>
                  <option value="doctor">แพทย์</option>
                  <option value="nurse">พยาบาล</option>
                  <option value="admin">เจ้าหน้าที่</option>
                  <option value="technician">นักเทคนิคการแพทย์</option>
                  <option value="pharmacist">เภสัชกร</option>
                  <option value="manager">ผู้จัดการ</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  เบอร์ต่อ
                </label>
                <input
                  value={ext}
                  onChange={(e) => setExt(e.target.value)}
                  placeholder="กรุณากรอกเบอร์ต่อ (ถ้ามี)"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  แผนก <span className="text-red-500">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">เลือกแผนก</option>
                  <option value="emergency">ฉุกเฉิน</option>
                  <option value="surgery">ศัลยกรรม</option>
                  <option value="internal">อายุรกรรม</option>
                  <option value="pediatric">กุมารเวช</option>
                  <option value="obstetrics">สูติ-นรีเวช</option>
                  <option value="radiology">รังสีวิทยา</option>
                  <option value="laboratory">ห้องปฏิบัติการ</option>
                  <option value="pharmacy">เภสัชกรรม</option>
                  <option value="administration">บริหาร</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                บันทึกข้อมูล
              </button>
              <button
                type="button"
                onClick={() => { setName(""); setRole(""); setExt(""); setDepartment(""); }}
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