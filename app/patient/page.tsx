"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PatientPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [idCard, setIdCard] = useState("");
  const [programs, setPrograms] = useState<Array<{ regist_name: string; regist_list: number }>>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [programsError, setProgramsError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [department, setDepartment] = useState("");
  const [workGroup, setWorkGroup] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [sendApproval, setSendApproval] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        setProgramsLoading(true);
        setProgramsError(null);
        const res = await fetch('/api/register-list');
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || 'Failed to load options');
        }
        // Expect data as array of {regist_name, regist_list} already ordered
        setPrograms(json.data || []);
      } catch (err: any) {
        setProgramsError(err?.message || 'Unexpected error');
      } finally {
        setProgramsLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { type: "patient", name, dob, idCard, department, workGroup, mobilePhone, officePhone, programs: selectedPrograms, registrationStatus, sendApproval, acceptTerms };
    console.log("Submit", payload);
    alert("ส่งข้อมูลผู้ป่วยเรียบร้อย");
    setName("");
    setDob("");
    setIdCard("");
    setSelectedPrograms([]);
    setDepartment("");
    setWorkGroup("");
    setMobilePhone("");
    setOfficePhone("");
    setRegistrationStatus("");
    setSendApproval("");
    setAcceptTerms(false);
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
                <p className="text-sm text-slate-600 dark:text-slate-400">ใบลงทะเบียนผู้ใช้งานระบบโปรแกรมคอมพิวเตอร์</p>
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300"> ตำแหน่งงาน 
                  <span className="text-red-500">*</span> </label>
                <input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="กรุณากรอกตำแหน่งงาน"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  เลือกโปรแกรมที่ต้องการใช้งาน (เลือกได้หลายตัวเลือก)
                </label>
                <div className="space-y-2">
                  {programsLoading && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">กำลังโหลดตัวเลือก...</div>
                  )}
                  {programsError && (
                    <div className="text-sm text-red-600">{programsError}</div>
                  )}
                  {!programsLoading && !programsError && (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-left flex items-center justify-between"
                      >
                        <span className="truncate">
                          {selectedPrograms.length === 0 ? 'กรุณาเลือกโปรแกรม...' : selectedPrograms.join(', ')}
                        </span>
                        <svg className="h-5 w-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isDropdownOpen && (
                        <div
                          className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                        {programs.map((p, idx) => (
                          <label
                            key={`${p.regist_name}-${idx}`}
                            className="flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPrograms.includes(p.regist_name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPrograms([...selectedPrograms, p.regist_name]);
                                } else {
                                  setSelectedPrograms(selectedPrograms.filter(name => name !== p.regist_name));
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                            />
                            <span className="ml-3 text-sm text-slate-900 dark:text-slate-100">{p.regist_name}</span>
                          </label>
                        ))}
                        </div>
                      )}
                    </div>
                  )}
                  {selectedPrograms.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedPrograms.map((prog, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {prog}
                          <button
                            type="button"
                            onClick={() => setSelectedPrograms(selectedPrograms.filter(p => p !== prog))}
                            className="hover:text-blue-600 dark:hover:text-blue-100"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  เลขที่วิชาชีพ
                </label>
                <input
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  วันที่เริ่มเข้าทำงาน <span className="text-red-500">*</span>
                </label>
                <input
                  // value={dob}
                  // onChange={(e) => setDob(e.target.value)}
                  type="date"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  เบอร์มือถือ <span className="text-red-500">*</span>
                </label>
                <input
                  value={mobilePhone}
                  onChange={(e) => setMobilePhone(e.target.value)}
                  placeholder="กรุณากรอกเบอร์มือถือ"
                  type="tel"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  maxLength={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  โทรศัพท์หน่วยงาน
                </label>
                <input
                  value={officePhone}
                  onChange={(e) => setOfficePhone(e.target.value)}
                  placeholder="กรุณากรอกโทรศัพท์หน่วยงาน"
                  type="tel"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

            </div>

            <div className="space-y-2">
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">สถานะการลงทะเบียน</legend>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="registrationStatus"
                      value="registered"
                      checked={registrationStatus === "registered"}
                      onChange={(e) => setRegistrationStatus(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">เคยลงทะเบียนแล้ว</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="registrationStatus"
                      value="not-registered"
                      checked={registrationStatus === "not-registered"}
                      onChange={(e) => setRegistrationStatus(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ยังไม่เคยลงทะเบียน</span>
                  </label>
                </div>
              </fieldset>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                ส่งอนุมัติ <span className="text-red-500">*</span>
              </label>
              <input
                value={sendApproval}
                onChange={(e) => setSendApproval(e.target.value)}
                placeholder="กรุณากรอกชื่อผู้ส่งอนุมัติ"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  ยอมรับ{" "}
                  <Link href="/terms" target="_blank" className="text-blue-600 hover:text-blue-700 underline">
                    เงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว <span className="text-red-500">*</span>
                  </Link>
                </span>
              </label>
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
                onClick={() => { setName(""); setDob(""); setIdCard(""); setSelectedPrograms([]); setDepartment(""); setWorkGroup(""); setMobilePhone(""); setOfficePhone(""); setRegistrationStatus(""); setSendApproval(false); setAcceptTerms(false); }}
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