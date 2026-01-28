"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Helper functions สำหรับแปลงวันที่ระหว่าง ค.ศ. และ พ.ศ.
function convertCEtoBE(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  const beYear = parseInt(year) + 543;
  return `${beYear}-${month}-${day}`;
}

function convertBEtoCE(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  const ceYear = parseInt(year) - 543;
  return `${ceYear}-${month}-${day}`;
}

export default function RiskReportPage() {
  const [hn, setHn] = useState("");
  const [incompleteLab, setIncompleteLab] = useState("");
  const [workUnit, setWorkUnit] = useState("");
  const [appointmentIssueDate, setAppointmentIssueDate] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Get user_id from localStorage or cookie
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user = JSON.parse(userJson);
      setUserId(user.id);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send dates as YYYY-MM-DD format (DATE type, not DATETIME)
      const payload = {
        hn: hn || null,
        labname: incompleteLab || null,
        unit_name: workUnit || null,
        appointment_issue_date: appointmentIssueDate || null,
        appointment_date: appointmentDate || null,
        user_report: userId || null,
      };

      console.log("📤 Sending payload:", payload);

      const response = await fetch("/api/forms/riskreport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status);

      const result = await response.json();
      console.log("📥 Response data:", result);

      if (result.success) {
        alert("บันทึกรายงานความเสี่ยงเรียบร้อย");
        // Reset form
        setHn("");
        setIncompleteLab("");
        setWorkUnit("");
        setAppointmentIssueDate("");
        setAppointmentDate("");
      } else {
        alert(`เกิดข้อผิดพลาด: ${result.error}`);
      }
    } catch (error: any) {
      console.error("❌ Error submitting form:", error);
      alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
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
                  HN
                </label>
                <input
                  value={hn}
                  onChange={(e) => setHn(e.target.value)}
                  placeholder="กรุณากรอก HN"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Lab ที่ไม่ครบ
                </label>
                <input
                  value={incompleteLab}
                  onChange={(e) => setIncompleteLab(e.target.value)}
                  placeholder="กรุณากรอก Lab ที่ไม่ครบ"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  หน่วยงาน
                </label>
                <input
                  value={workUnit}
                  onChange={(e) => setWorkUnit(e.target.value)}
                  placeholder="กรุณากรอกหน่วยงาน"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  วันที่ออกใบนัด
                </label>
                <input
                  type="date"
                  value={appointmentIssueDate}
                  onChange={(e) => setAppointmentIssueDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  วันนัด
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => { setHn(""); setIncompleteLab(""); setWorkUnit(""); setAppointmentIssueDate(""); setAppointmentDate(""); }}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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