"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AppointmentPage() {
  const [subject, setSubject] = useState("");
  const [staffName, setStaffName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [workGroup, setWorkGroup] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [approverResults, setApproverResults] = useState<Array<{ phos_wg_id: number; title: string | null; name: string | null; lname: string | null; phos_wg_name_position: string | null; telephone: string | null }>>([]);
  const [approverLoading, setApproverLoading] = useState(false);
  const [approverError, setApproverError] = useState<string | null>(null);
  const [isApproverOpen, setIsApproverOpen] = useState(false);
  const [shouldSearchApprover, setShouldSearchApprover] = useState(false);
  const approverRef = useRef<HTMLDivElement>(null);
  const [sendApproval, setSendApproval] = useState("");
  const [requestType, setRequestType] = useState("");
  const [otherRequestDetails, setOtherRequestDetails] = useState("");
  const [details, setDetails] = useState("");
  const [purpose, setPurpose] = useState("");
  const [benefits, setBenefits] = useState("");
  const [priority, setPriority] = useState("ปกติ");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (approverRef.current && !approverRef.current.contains(event.target as Node)) {
        setIsApproverOpen(false);
        setShouldSearchApprover(false);
      }
    }

    if (isApproverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isApproverOpen]);

  useEffect(() => {
    const controller = new AbortController();
    const query = sendApproval.trim();

    if (!shouldSearchApprover) {
      return () => controller.abort();
    }

    if (!query) {
      setApproverResults([]);
      setApproverError(null);
      setApproverLoading(false);
      setIsApproverOpen(false);
      return () => controller.abort();
    }

    const debounce = setTimeout(async () => {
      try {
        setApproverLoading(true);
        setApproverError(null);
        const res = await fetch(`/api/workgroup?search=${encodeURIComponent(query)}`, { signal: controller.signal });
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || 'ไม่สามารถดึงข้อมูลผู้ส่งอนุมัติ');
        }

        setApproverResults(json.data || []);
        setIsApproverOpen(true);
      } catch (err: any) {
        if (controller.signal.aborted) return;
        setApproverError(err?.message || 'เกิดข้อผิดพลาด');
        setApproverResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setApproverLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [sendApproval, shouldSearchApprover]);

  function formatApproverName(item: { title: string | null; name: string | null; lname: string | null }) {
    return [item.title, item.name, item.lname].filter(Boolean).join(' ').trim();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { type: "appointment", subject, staffName, position, department, workGroup, officePhone, requestType, otherRequestDetails, details, purpose, benefits, priority, sendApproval, attachedFiles: attachedFiles.map(f => f.name) };
    console.log("Submit", payload);
    alert("บันทึกการนัดหมายเรียบร้อย");
    setSubject(""); setStaffName(""); setPosition(""); setDepartment(""); setWorkGroup(""); setOfficePhone(""); setRequestType(""); setOtherRequestDetails(""); setDetails(""); setPurpose(""); setBenefits(""); setPriority("ปกติ"); setSendApproval(""); setShouldSearchApprover(false); setAttachedFiles([]); if (fileInputRef.current) fileInputRef.current.value = '';
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
                <p className="text-sm text-slate-600 dark:text-slate-400">แบบฟอร์มขอใช้บริการ งานระบบโปรแกรมคอมพิวเตอร์</p>
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
            <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">แบบฟอร์มขอใช้บริการ งานระบบโปรแกรมคอมพิวเตอร์</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">กรุณากรอกข้อมูลการขอใช้บริการ</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  หัวเรื่อง <span className="text-red-500">*</span>
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="กรุณากรอกหัวเรื่อง"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  ประเภทการขอ <span className="text-red-500">*</span>
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">-- เลือกประเภทการขอ --</option>
                  <option value="ขอข้อมูล">ขอข้อมูล</option>
                  <option value="ขอแก้ไขข้อมูล">ขอแก้ไขข้อมูล</option>
                  <option value="ขอรายงาน">ขอรายงาน</option>
                  <option value="ขอโปรแกรม">ขอโปรแกรม</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              {requestType === "อื่นๆ" && (
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    กรุณาระบุรายละเอียด <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={otherRequestDetails}
                    onChange={(e) => setOtherRequestDetails(e.target.value)}
                    placeholder="กรุณากรอกรายละเอียดการขอ"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  ชื่อ-นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="กรุณากรอกชื่อ-นามสกุล"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  ตำแหน่ง <span className="text-red-500">*</span>
                </label>
                <input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="กรุณากรอกตำแหน่ง"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  หน่วยงาน <span className="text-red-500">*</span>
                </label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="กรุณากรอกหน่วยงาน"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  กลุ่มงาน <span className="text-red-500">*</span>
                </label>
                <input
                  value={workGroup}
                  onChange={(e) => setWorkGroup(e.target.value)}
                  placeholder="กรุณากรอกกลุ่มงาน"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  โทรศัพท์หน่วยงาน <span className="text-red-500">*</span>
                </label>
                <input
                  value={officePhone}
                  onChange={(e) => setOfficePhone(e.target.value)}
                  placeholder="กรุณากรอกโทรศัพท์หน่วยงาน"
                  type="tel"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  ระดับความเร่งด่วน
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  <option value="">-- เลือกระดับความเร่งด่วน --</option>
                  <option value="ด่วนมาก">ด่วนมาก</option>
                  <option value="ด่วน">ด่วน</option>
                  <option value="ปกติ">ปกติ</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                รายละเอียด
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="กรุณากรอกรายละเอียดเพิ่มเติม"
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                วัตถุประสงค์
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="กรุณากรอกวัตถุประสงค์เพิ่มเติม"
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                ประโยชน์ที่ได้รับ
              </label>
              <textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="กรุณากรอกประโยชน์ที่ได้รับเพิ่มเติม"
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                แนบไฟล์ (JPG, PDF)
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,image/jpeg,.pdf,application/pdf"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const validFiles = files.filter(file => {
                      const isJpg = file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');
                      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                      const isValid = isJpg || isPdf;
                      if (!isValid) alert(`ไฟล์ ${file.name} ต้องเป็น JPG หรือ PDF เท่านั้น`);
                      return isValid;
                    });
                    if (validFiles.length > 0) {
                      setAttachedFiles([...attachedFiles, ...validFiles]);
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  เลือกไฟล์
                </button>
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {attachedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-blue-700 dark:text-blue-300">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                ส่งอนุมัติ <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={approverRef}>
                <input
                  value={sendApproval}
                  onChange={(e) => {
                    setSendApproval(e.target.value);
                    setShouldSearchApprover(true);
                  }}
                  onFocus={() => {
                    setShouldSearchApprover(true);
                    if (sendApproval.trim()) setIsApproverOpen(true);
                  }}
                  placeholder="ค้นหาชื่อหรือนามสกุล"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
                {isApproverOpen && (
                  <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-700 max-h-60 overflow-y-auto">
                    {approverLoading && (
                      <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">กำลังค้นหา...</div>
                    )}
                    {approverError && (
                      <div className="px-4 py-3 text-sm text-red-600">{approverError}</div>
                    )}
                    {!approverLoading && !approverError && approverResults.length === 0 && sendApproval.trim().length > 0 && (
                      <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">ไม่พบข้อมูลผู้ส่งอนุมัติ</div>
                    )}
                    {approverResults.map((item) => (
                      <button
                        key={item.phos_wg_id}
                        type="button"
                        onClick={() => {
                          setSendApproval(formatApproverName(item));
                          setIsApproverOpen(false);
                          setShouldSearchApprover(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                      >
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{formatApproverName(item)}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-300">{item.phos_wg_name_position || '-'}{item.telephone ? ` • ${item.telephone}` : ''}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                บันทึกนัดหมาย
              </button>
              <button
                type="button"
                onClick={() => { setSubject(""); setStaffName(""); setPosition(""); setDepartment(""); setWorkGroup(""); setOfficePhone(""); setRequestType(""); setOtherRequestDetails(""); setDetails(""); setPurpose(""); setBenefits(""); setPriority("ปกติ"); setSendApproval(""); setShouldSearchApprover(false); setAttachedFiles([]); if (fileInputRef.current) fileInputRef.current.value = ''; }}
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