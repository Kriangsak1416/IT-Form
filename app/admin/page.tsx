"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("submissions");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    position: "",
    admin: false,
  });
  const [creatingUser, setCreatingUser] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const isAdminUser = user.isAdmin === true;
      
      if (!isAdminUser) {
        router.push("/");
        return;
      }

      setIsAdmin(true);

      // Load submissions from localStorage
      const savedSubmissions = localStorage.getItem("submissions");
      if (savedSubmissions) {
        try {
          setSubmissions(JSON.parse(savedSubmissions));
        } catch (e) {
          setSubmissions([]);
        }
      }

      // Load users from API
      fetchUsers();
    } catch (e) {
      router.push("/login");
    }
    setIsLoading(false);
  }, [router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditFormData({
      admin: user.admin === 'admin',
      position: user.position || "",
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser.id,
          admin: editFormData.admin,
          position: editFormData.position,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("อัปเดตสิทธิ์ผู้ใช้สำเร็จ");
        setEditingUser(null);
        fetchUsers();
      } else {
        alert("เกิดข้อผิดพลาด: " + data.error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    }
  };

  const handleCreateUser = async () => {
    if (creatingUser) return;
    setCreateError("");

    if (!newUser.username || !newUser.password || !newUser.firstname || !newUser.lastname) {
      setCreateError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setCreatingUser(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setCreateError(data.error || "สร้างผู้ใช้ไม่สำเร็จ");
        return;
      }

      alert("สร้างผู้ใช้สำเร็จ");
      setNewUser({ username: "", password: "", firstname: "", lastname: "", position: "", admin: false });
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      setCreateError("เกิดข้อผิดพลาดในการสร้างผู้ใช้");
    } finally {
      setCreatingUser(false);
    }
  };

  const totalPages = Math.ceil(submissions.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData = submissions.slice(startIdx, startIdx + rowsPerPage);

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      alert("ไม่มีข้อมูลที่จะส่งออก");
      return;
    }

    // Create CSV header
    const headers = ["ประเภท", "หัวเรื่อง", "ผู้ส่ง", "หน่วยงาน", "สถานะ", "วันที่ส่ง", "ระดับความเร่งด่วน", "HN"];
    
    // Create CSV rows
    const rows = submissions.map(sub => [
      sub.type === "appointment" ? "ขอใช้บริการ" : "รายงานความเสี่ยง",
      sub.subject || sub.hn || "-",
      sub.staffName || sub.name || "-",
      sub.department || sub.workUnit || "-",
      sub.status === "approved" ? "อนุมัติแล้ว" : sub.status === "rejected" ? "ปฏิเสธแล้ว" : "รอการอนุมัติ",
      sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString("th-TH") : "-",
      sub.priority || "-",
      sub.hn || "-"
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (submissions.length === 0) {
      alert("ไม่มีข้อมูลที่จะส่งออก");
      return;
    }

    const dataStr = JSON.stringify(submissions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">กำลังโหลด...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          {/* Logo Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="โรงพยาบาลแพร่"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Admin Panel</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">ศูนย์คอมพิวเตอร์</p>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => {
                setActiveTab("submissions");
                setCurrentPage(1);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "submissions"
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>แบบฟอร์มที่ส่ง</span>
              {submissions.length > 0 && (
                <span className="ml-auto text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                  {submissions.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("users");
                setCurrentPage(1);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "users"
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>จัดการผู้ใช้</span>
              {users.length > 0 && (
                <span className="ml-auto text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">
                  {users.length}
                </span>
              )}
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>กลับหน้าหลัก</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8 max-w-7xl">
            {/* Content Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {activeTab === "submissions" ? "แบบฟอร์มที่ส่ง" : "จัดการผู้ใช้"}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {activeTab === "submissions" ? `ทั้งหมด ${submissions.length} รายการ` : `ทั้งหมด ${users.length} คน`}
              </p>
            </div>

            {/* Content Section */}
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              {/* Edit User Modal */}
              {editingUser && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-md w-full p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  แก้ไขสิทธิ์ผู้ใช้
                </h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {editingUser.firstname} {editingUser.lastname}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {editingUser.username}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={editFormData.position}
                      onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="adminCheck"
                      checked={editFormData.admin}
                      onChange={(e) => setEditFormData({ ...editFormData, admin: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <label htmlFor="adminCheck" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                      เป็น Admin
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleUpdateUser}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
            )}

            {activeTab === "submissions" && (
              <div>
                {/* Controls */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex gap-3">
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      ส่งออก CSV
                    </button>
                    <button
                      onClick={handleExportJSON}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      ส่งออก JSON
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">แถวต่อหน้า:</label>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                      className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  {submissions.length === 0 ? (
                    <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                    ไม่พบข้อมูล
                  </div>
                ) : (
                    <>
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">#</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">ประเภท</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">หัวเรื่อง</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">ผู้ส่ง</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">หน่วยงาน</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">ระดับความเร่งด่วน</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">สถานะ</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">วันที่ส่ง</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedData.map((sub, idx) => (
                            <tr key={startIdx + idx} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{startIdx + idx + 1}</td>
                              <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-medium">
                                {sub.type === "appointment" ? "ขอใช้บริการ" : "รายงานความเสี่ยง"}
                              </td>
                              <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{sub.subject || sub.hn || "-"}</td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{sub.staffName || sub.name || "-"}</td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{sub.department || sub.workUnit || "-"}</td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{sub.priority || "-"}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  sub.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                  sub.status === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                }`}>
                                  {sub.status === "approved" ? "อนุมัติแล้ว" : sub.status === "rejected" ? "ปฏิเสธแล้ว" : "รอการอนุมัติ"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString("th-TH") : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination */}
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          แสดง {startIdx + 1} ถึง {Math.min(startIdx + rowsPerPage, submissions.length)} จากทั้งหมด {submissions.length} รายการ
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            ← ก่อนหน้า
                          </button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded-lg transition-colors ${
                                  currentPage === page
                                    ? "bg-red-600 text-white"
                                    : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            ถัดไป →
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">เพิ่มผู้ใช้ใหม่</h3>
                    {createError && (
                      <span className="text-sm text-red-500">{createError}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input
                      placeholder="ชื่อ"
                      value={newUser.firstname}
                      onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
                      className="px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      placeholder="นามสกุล"
                      value={newUser.lastname}
                      onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
                      className="px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      placeholder="ชื่อผู้ใช้"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      className="px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      placeholder="รหัสผ่าน"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      placeholder="ตำแหน่ง"
                      value={newUser.position}
                      onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                      className="px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={newUser.admin}
                        onChange={(e) => setNewUser({ ...newUser, admin: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      ตั้งเป็น Admin
                    </label>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleCreateUser}
                      disabled={creatingUser}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                    >
                      {creatingUser ? "กำลังบันทึก..." : "เพิ่มผู้ใช้"}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                      ไม่พบผู้ใช้
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">ชื่อ</th>
                          <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">ชื่อผู้ใช้</th>
                          <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">Position</th>
                          <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">Admin</th>
                          <th className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">การดำเนินการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, idx) => (
                          <tr key={user.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-medium">
                              {user.firstname} {user.lastname}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.username}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.position || "-"}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                user.admin === 'admin' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                              }`}>
                                {user.admin === 'admin' ? "ใช่" : "ไม่"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                              >
                                แก้ไข
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
