"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ApprovalPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }
    setIsLoggedIn(true);
    setIsLoading(false);

    // Load submissions from localStorage (in real app, fetch from API)
    const savedSubmissions = localStorage.getItem("submissions");
    if (savedSubmissions) {
      try {
        setSubmissions(JSON.parse(savedSubmissions));
      } catch (e) {
        setSubmissions([]);
      }
    }
  }, [router]);

  const handleApprove = (index: number) => {
    const updated = [...submissions];
    updated[index].status = "approved";
    updated[index].approvedAt = new Date().toISOString();
    setSubmissions(updated);
    localStorage.setItem("submissions", JSON.stringify(updated));
    alert("อนุมัติแบบฟอร์มเรียบร้อย");
  };

  const handleReject = (index: number) => {
    const updated = [...submissions];
    updated[index].status = "rejected";
    updated[index].rejectedAt = new Date().toISOString();
    setSubmissions(updated);
    localStorage.setItem("submissions", JSON.stringify(updated));
    alert("ปฏิเสธแบบฟอร์มเรียบร้อย");
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === "pending") return sub.status === "pending" || !sub.status;
    if (filter === "approved") return sub.status === "approved";
    if (filter === "rejected") return sub.status === "rejected";
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">กำลังโหลด...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
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
                <p className="text-sm text-slate-600 dark:text-slate-400">หน้าอนุมัติแบบฟอร์ม</p>
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

        {/* Approval Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">อนุมัติแบบฟอร์ม</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">ตรวจสอบและอนุมัติแบบฟอร์มที่ขอใช้บริการ</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 mb-6 border-b border-slate-200 dark:border-slate-700">
            {["pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  filter === tab
                    ? "border-orange-500 text-orange-600 dark:text-orange-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {tab === "pending" ? "รอการอนุมัติ" : tab === "approved" ? "อนุมัติแล้ว" : "ปฏิเสธแล้ว"}
              </button>
            ))}
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600 dark:text-slate-400">ไม่พบแบบฟอร์มในหมวดหมู่นี้</p>
              </div>
            ) : (
              filteredSubmissions.map((submission, idx) => (
                <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">ประเภท</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{submission.type === "appointment" ? "ขอใช้บริการ" : "รายงานความเสี่ยง"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">หัวเรื่อง</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{submission.subject || submission.hn || "ไม่มีข้อมูล"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">วันที่ส่ง</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString("th-TH") : "-"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">ผู้ส่ง</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{submission.staffName || submission.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">หน่วยงาน</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{submission.department || submission.workUnit || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">สถานะ</p>
                      <p className={`text-sm font-medium ${
                        submission.status === "approved" ? "text-green-600 dark:text-green-400" :
                        submission.status === "rejected" ? "text-red-600 dark:text-red-400" :
                        "text-yellow-600 dark:text-yellow-400"
                      }`}>
                        {submission.status === "approved" ? "อนุมัติแล้ว" : submission.status === "rejected" ? "ปฏิเสธแล้ว" : "รอการอนุมัติ"}
                      </p>
                    </div>
                  </div>

                  {(submission.status === "pending" || !submission.status) && (
                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => handleApprove(submissions.indexOf(submission))}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                      >
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => handleReject(submissions.indexOf(submission))}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                      >
                        ปฏิเสธ
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
