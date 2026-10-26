import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_document(output_path):
    doc = Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Palette
    C_NAVY = RGBColor(15, 23, 42)      # #0F172A
    C_EMERALD = RGBColor(16, 185, 129)  # #10B981
    C_DARK_EMERALD = RGBColor(5, 150, 105)
    C_SLATE = RGBColor(71, 85, 105)     # #475569
    C_WHITE = RGBColor(255, 255, 255)
    C_RED = RGBColor(225, 29, 72)

    # 1. Header Banner
    header_para = doc.add_paragraph()
    header_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run_badge = header_para.add_run("CONFIDENTIAL • TIER-1 CREDENTIAL MASTER SHEET")
    run_badge.font.size = Pt(8.5)
    run_badge.font.bold = True
    run_badge.font.color.rgb = C_RED

    # Title
    title_para = doc.add_paragraph()
    run_title = title_para.add_run("SATHI MOBILITY PLATFORM")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(24)
    run_title.font.bold = True
    run_title.font.color.rgb = C_NAVY

    tagline_para = doc.add_paragraph()
    run_tagline = tagline_para.add_run("Aapki Gaadi, Aapka Sathi • System Access & Credentials Master Document")
    run_tagline.font.name = "Arial"
    run_tagline.font.size = Pt(11)
    run_tagline.font.italic = True
    run_tagline.font.color.rgb = C_DARK_EMERALD

    # Metadata note box
    doc.add_paragraph()
    meta_table = doc.add_table(rows=1, cols=1)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = meta_table.cell(0, 0)
    set_cell_background(c, "F1F5F9")
    set_cell_margins(c, 140, 140, 180, 180)
    p_meta = c.paragraphs[0]
    r_m = p_meta.add_run(
        "Notice: This document contains all live administrative, customer, chauffeur partner, and database credentials for the Sathi on-demand chauffeur platform. Keep this file strictly confidential and store in an encrypted vault."
    )
    r_m.font.size = Pt(9)
    r_m.font.color.rgb = C_SLATE

    doc.add_paragraph()

    # Helper function for section headings
    def add_section_heading(text, icon="✦"):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(f"{icon}  {text}")
        r.font.name = "Arial"
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = C_NAVY

    # Helper for tables
    def style_table(table, col_widths, headers, data):
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        # Header Row
        hdr_row = table.rows[0]
        for idx, text in enumerate(headers):
            cell = hdr_row.cells[idx]
            cell.text = text
            set_cell_background(cell, "0F172A")
            set_cell_margins(cell, 120, 120, 140, 140)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.bold = True
                run.font.size = Pt(9.5)
                run.font.color.rgb = C_WHITE

        # Data Rows
        for r_idx, row_data in enumerate(data):
            row = table.add_row()
            bg_color = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
            for c_idx, val in enumerate(row_data):
                cell = row.cells[c_idx]
                cell.text = val
                set_cell_background(cell, bg_color)
                set_cell_margins(cell, 100, 100, 140, 140)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for run in p.runs:
                    run.font.size = Pt(9)
                    run.font.color.rgb = C_NAVY

        # Column widths
        for row in table.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = Inches(width)

    # =========================================================================
    # SECTION 1: ADMIN COMMAND CENTER
    # =========================================================================
    add_section_heading("1. Admin Command Center Portals & Role Credentials", "🛡️")

    p_url = doc.add_paragraph()
    r_url = p_url.add_run("Login URL: http://localhost:3000/login  |  Local Network: http://192.168.29.200:3000/login")
    r_url.font.bold = True
    r_url.font.size = Pt(9.5)
    r_url.font.color.rgb = C_DARK_EMERALD

    admin_headers = ["Role", "Login Email ID", "Password", "Permissions & Access Level"]
    admin_data = [
        ["Super Admin (HQ)", "admin@sathi.in", "DriveAdmin@2026", "Full master platform access, pricing, payouts, audits"],
        ["Dispatch Desk", "dispatch@sathi.in", "DispatchDesk@2026", "Manual chauffeur override, spatial dispatch radar, driver chat"],
        ["KYC Auditor", "kyc@sathi.in", "KycAuditor@2026", "MoRTH Sarathi verification, DL approvals, police NOC"],
        ["Safety 112 Desk", "safety@sathi.in", "SafetyDesk@2026", "Emergency SOS live incidents, telematics crash alerts"],
        ["Super Admin Alias", "harsh@sathi.in", "DriveAdmin@2026", "Founder & Lead Operations HQ profile"],
        ["Vidisha Ops Manager", "ankit.mp40@sathi.in", "VidishaOps@2026", "Vidisha district geofence, driver payouts & roster"],
        ["Bhopal Support Desk", "sunita.support@sathi.in", "BhopalSupport@2026", "Customer dispute resolutions, customer wallet refunds"],
    ]
    t1 = doc.add_table(rows=1, cols=4)
    style_table(t1, [1.5, 1.8, 1.6, 2.3], admin_headers, admin_data)

    doc.add_paragraph()

    # =========================================================================
    # SECTION 2: CUSTOMER WEB APP
    # =========================================================================
    add_section_heading("2. Customer App (Car Owner / Chauffeur Booking)", "🚗")

    p_cust_url = doc.add_paragraph()
    r_curl = p_cust_url.add_run("App URL: http://localhost:3000/book  |  Mobile Network: http://192.168.29.200:3000/book")
    r_curl.font.bold = True
    r_curl.font.size = Pt(9.5)
    r_curl.font.color.rgb = C_DARK_EMERALD

    cust_headers = ["Customer Profile", "Mobile Number", "Login OTP", "Registered Vehicle in Garage"]
    cust_data = [
        ["Harshvardhan (Primary)", "+91 98450 12345", "729401", "Toyota Fortuner 4x4 (MP-40-CA-4921)"],
        ["Priya Sharma", "+91 99801 77332", "729401", "Hyundai Creta SX Automatic (MP-04-AB-1290)"],
        ["Rajesh Chouhan (VIP)", "+91 97412 88901", "729401", "Mahindra Scorpio-N 4x4 (MP-40-MB-7788)"],
    ]
    t2 = doc.add_table(rows=1, cols=4)
    style_table(t2, [1.8, 1.6, 1.2, 2.6], cust_headers, cust_data)

    doc.add_paragraph()

    # =========================================================================
    # SECTION 3: DRIVER PARTNER COCKPIT
    # =========================================================================
    add_section_heading("3. Driver Partner Cockpit (Chauffeur Duty & Earnings)", "📱")

    p_drv_url = doc.add_paragraph()
    r_durl = p_drv_url.add_run("App URL: http://localhost:3000/driver  |  Mobile Network: http://192.168.29.200:3000/driver")
    r_durl.font.bold = True
    r_durl.font.size = Pt(9.5)
    r_durl.font.color.rgb = C_DARK_EMERALD

    drv_headers = ["Chauffeur Name", "Mobile Number", "Login OTP", "Handover Start OTP", "RTO & Vehicle Qualification"]
    drv_data = [
        ["Rajesh Sharma (Lead)", "+91 98765 43211", "729401", "8492 (or trip OTP)", "MP-40 Vidisha (Manual & Automatic Cleared)"],
        ["Mukesh Patel", "+91 98451 22340", "729401", "3910 (or trip OTP)", "MP-04 Bhopal (Manual & Automatic Cleared)"],
        ["Dharmendra Lodhi", "+91 97412 55441", "729401", "6612 (or trip OTP)", "MP-40 Highway / Sanchi Outstation Specialist"],
    ]
    t3 = doc.add_table(rows=1, cols=5)
    style_table(t3, [1.7, 1.5, 1.0, 1.3, 1.7], drv_headers, drv_data)

    doc.add_paragraph()

    # =========================================================================
    # SECTION 4: REAL-TIME RADAR & TRACKING
    # =========================================================================
    add_section_heading("4. Live Ride Tracking, Radar & Concierge URLs", "📡")

    track_headers = ["Service Portal", "Direct URL Link", "Purpose / Usage"]
    track_data = [
        ["Live Tracking Radar", "http://localhost:3000/track", "Real-time street map tracking of active trips"],
        ["Customer Live Share", "http://localhost:3000/track/ST-849102", "Public link shared via WhatsApp with family"],
        ["Dispatch Simulator", "http://localhost:3000/simulator", "End-to-end sandbox simulator (Customer + Driver)"],
        ["Mobile App Install Hub", "http://localhost:3000/install", "QR code page to install Customer & Partner PWAs"],
        ["Chauffeur Settlements", "http://localhost:3000/payouts", "Instant 1-click UPI and IMPS driver payout approvals"],
        ["GST Invoices & Reports", "http://localhost:3000/reports", "Export GST SAC 9966 invoices and driver telematics"],
    ]
    t4 = doc.add_table(rows=1, cols=3)
    style_table(t4, [2.0, 2.7, 2.5], track_headers, track_data)

    doc.add_paragraph()

    # =========================================================================
    # SECTION 5: BACKEND INFRASTRUCTURE & DATABASE CREDENTIALS
    # =========================================================================
    add_section_heading("5. Backend Infrastructure & Database Master Log", "⚙️")

    infra_headers = ["Infrastructure Service", "Port", "User / Access Key", "Password / Secret", "Database / Bucket"]
    infra_data = [
        ["Next.js Production Portal", "3000", "Host: 0.0.0.0", "N/A", "sathi-platform (v14.2)"],
        ["Go API Microservices Gateway", "8080", "REST / JSON API", "RS256 JWT Token", "services/api-gateway"],
        ["PostgreSQL (Core Relational)", "5432", "driver_app", "postgres_secret_2026", "driver_db"],
        ["Redis (Redlock & Driver H3)", "6379", "default", "No auth (Local VPC)", "DB 0 (Cache & Redlocks)"],
        ["MinIO S3 Object Storage", "9000/9001", "minioadmin", "minioadmin_secret_2026", "driver-inspections, kyc-docs"],
        ["ClickHouse (Telematics & GPS)", "8123/9000", "default", "clickhouse_secret_2026", "telematics_db"],
        ["RabbitMQ Message Broker", "5672/15672", "guest", "guest", "vhost: / (Telematics queues)"],
    ]
    t5 = doc.add_table(rows=1, cols=5)
    style_table(t5, [2.0, 1.0, 1.4, 1.5, 1.3], infra_headers, infra_data)

    doc.add_paragraph()

    # =========================================================================
    # SECTION 6: SECURITY & PRODUCTION COMPLIANCE
    # =========================================================================
    add_section_heading("6. Operational Security Protocol", "🔒")

    p_sec = doc.add_paragraph()
    p_sec.paragraph_format.line_spacing = Pt(14)
    r_s1 = p_sec.add_run("1. Master Key Rotation: ")
    r_s1.bold = True
    p_sec.add_run("Before deploying to a public domain, update default passwords in ")
    r_env = p_sec.add_run(".env.production")
    r_env.font.name = "Courier New"
    p_sec.add_run(" and Docker Compose environments.\n")

    r_s2 = p_sec.add_run("2. SMS Gateway Activation: ")
    r_s2.bold = True
    p_sec.add_run("The current demo uses the universal test OTP (729401). For live commercial customer verification, configure Fast2SMS, MSG91, or Twilio in ")
    r_auth = p_sec.add_run("services/auth-service/cmd/server/main.go")
    r_auth.font.name = "Courier New"
    p_sec.add_run(".\n")

    r_s3 = p_sec.add_run("3. 2FA Protection: ")
    r_s3.bold = True
    p_sec.add_run("Super Admin logins are protected by multi-factor authentication tokens. Store backups of recovery keys offline.\n")

    # Footer note
    doc.add_paragraph()
    footer_p = doc.add_paragraph()
    footer_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_foot = footer_p.add_run("— Sathi Mobility Technologies Ltd. • Vidisha & Bhopal Hubs (M.P.) —")
    r_foot.font.size = Pt(8.5)
    r_foot.font.color.rgb = C_SLATE

    # Save
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    out_file = r"d:\Harsh\Harsh Projecat\Driver\Sathi_Credentials_and_Access_Guide.docx"
    create_document(out_file)
