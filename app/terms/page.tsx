"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function TermsPage() {
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
                <p className="text-sm text-slate-600 dark:text-slate-400">เงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/userregistration"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
              >
                ← กลับ
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="prose dark:prose-invert max-w-none">
            <h2>เงื่อนไขการใช้งาน</h2>
            <p>กรุณาอ่านเงื่อนไขการใช้งานเหล่านี้อย่างละเอียดก่อนใช้บริการของเรา</p>

            <h3>1. การยอมรับเงื่อนไข</h3>
            <p>โดยการเข้าถึงและใช้บริการของโรงพยาบาลแพร่ คุณตกลงที่จะผูกพันตามเงื่อนไขการใช้งานเหล่านี้ หากคุณไม่เห็นด้วยกับเงื่อนไขใดๆ โปรดหยุดใช้บริการของเรา</p>

            <h3>2. การใช้บริการ</h3>
            <p>บริการนี้มีไว้สำหรับบุคลากรของโรงพยาบาลแพร่ในการลงทะเบียนและจัดการข้อมูลทางการแพทย์ การใช้บริการในทางที่ผิดหรือไม่เหมาะสมจะถือเป็นการละเมิดเงื่อนไข</p>

            <h3>3. ความเป็นส่วนตัวของข้อมูล</h3>
            <p>เรามุ่งมั่นในการปกป้องข้อมูลส่วนบุคคลของคุณ ข้อมูลทั้งหมดจะถูกเก็บรักษาและใช้ตามนโยบายความเป็นส่วนตัวของโรงพยาบาลแพร่</p>

            <h3>4. ความปลอดภัย</h3>
            <p>คุณมีหน้าที่รักษาความปลอดภัยของบัญชีและรหัสผ่านของคุณ หากพบการใช้งานที่ผิดปกติ โปรดแจ้งให้เราทราบทันที</p>

            <h3>5. การเปลี่ยนแปลงเงื่อนไข</h3>
            <p>โรงพยาบาลแพร่ขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขการใช้งานเหล่านี้ได้ตลอดเวลา การเปลี่ยนแปลงจะมีผลทันทีหลังจากประกาศ</p>

            <h2>นโยบายความเป็นส่วนตัว</h2>
            <p>นโยบายความเป็นส่วนตัวนี้อธิบายวิธีที่เราเก็บรวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณ</p>

            <h3>ข้อมูลที่เราเก็บรวบรวม</h3>
            <ul>
              <li>ข้อมูลส่วนบุคคล: ชื่อ นามสกุล วันเกิด เลขบัตรประชาชน</li>
              <li>ข้อมูลการใช้งาน: ประวัติการเข้าสู่ระบบและการใช้งานระบบ</li>
              <li>ข้อมูลอุปกรณ์: ที่อยู่ IP และข้อมูลเบราว์เซอร์</li>
            </ul>

            <h3>วัตถุประสงค์ในการใช้ข้อมูล</h3>
            <ul>
              <li>เพื่อให้บริการทางการแพทย์และจัดการข้อมูลผู้ป่วย</li>
              <li>เพื่อปรับปรุงและพัฒนาระบบให้ดียิ่งขึ้น</li>
              <li>เพื่อปฏิบัติตามกฎหมายและข้อบังคับที่เกี่ยวข้อง</li>
            </ul>

            <h3>การแบ่งปันข้อมูล</h3>
            <p>ข้อมูลของคุณจะไม่ถูกขายหรือแบ่งปันกับบุคคลที่สาม ยกเว้นในกรณีที่จำเป็นตามกฎหมายหรือเพื่อวัตถุประสงค์ทางการแพทย์</p>

            <h3>สิทธิ์ของคุณ</h3>
            <p>คุณมีสิทธิ์ในการเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณ หากต้องการดำเนินการเหล่านี้ โปรดติดต่อแผนก IT ของโรงพยาบาล</p>

            <h3>การรักษาความปลอดภัย</h3>
            <p>เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลของคุณจากการเข้าถึง การเปลี่ยนแปลง หรือการเปิดเผยโดยไม่ได้รับอนุญาต</p>

            <h3>ติดต่อเรา</h3>
            <p>หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ โปรดติดต่อ:</p>
            <p>ศูนย์คอมพิวเตอร์ โรงพยาบาลแพร่<br />
            ชั้น M อาคารผู้ป่วยนอก<br />
            โทร: 8888</p>
          </div>
        </section>
      </div>
    </div>
  );
}