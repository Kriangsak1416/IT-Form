import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hn, labname, unit_name, appointment_issue_date, appointment_date, user_report } = body;

    console.log("📥 API received:", { hn, labname, unit_name, appointment_issue_date, appointment_date, user_report });

    // Insert into database
    const [result] = await pool.execute(
      `INSERT INTO phos_risk_report_form 
       (hn, labname, unit_name, appointment_issue_date, appointment_date, user_report, user_report_date) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        hn || null,
        labname || null,
        unit_name || null,
        appointment_issue_date || null,
        appointment_date || null,
        user_report || null,
      ]
    );

    console.log("✅ Insert result:", result);

    return NextResponse.json(
      {
        success: true,
        message: "บันทึกรายงานความเสี่ยงเรียบร้อย",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error saving risk report:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sql: error.sql,
    });
    return NextResponse.json(
      {
        success: false,
        error: "ไม่สามารถบันทึกข้อมูลได้",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM phos_risk_report_form ORDER BY user_report_date DESC`
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("Error fetching risk reports:", error);
    return NextResponse.json(
      {
        success: false,
        error: "ไม่สามารถดึงข้อมูลได้",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
