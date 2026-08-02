import os
import subprocess

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Quotation QTN-2026-0001 - ALUGRADE LANKA FAB & GLASS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 portrait;
            margin: 10mm 12mm 10mm 12mm;
        }
        * { box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            padding: 24px;
            color: #0F172A;
            background: #ffffff;
            font-size: 11px;
            line-height: 1.4;
            position: relative;
            width: 794px;
        }
        .watermark {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-20deg);
            width: 360px;
            opacity: 0.07;
            pointer-events: none;
            z-index: 0;
        }
        .content-wrapper { position: relative; z-index: 1; }
        .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #2563EB; padding-bottom: 14px; margin-bottom: 16px; }
        .logo-brand-wrap { display: flex; align-items: center; gap: 14px; }
        .logo-box { background: #ffffff; padding: 4px; border-radius: 8px; display: inline-block; }
        .logo-box img { height: 68px; width: auto; object-fit: contain; }
        .company-title { font-family: 'Montserrat', sans-serif; font-size: 17px; font-weight: 800; color: #0F172A; margin: 0; letter-spacing: -0.02em; }
        .company-subtitle { color: #2563EB; font-size: 10px; font-weight: 700; margin: 2px 0 3px 0; text-transform: uppercase; letter-spacing: 0.03em; }
        .company-contacts { color: #475569; font-size: 9.5px; margin: 0; font-weight: 500; }
        .header-info-box { text-align: right; }
        .doc-badge { background: #2563EB; color: #ffffff; font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 800; padding: 4px 14px; border-radius: 6px; display: inline-block; letter-spacing: 0.05em; margin-bottom: 6px; }
        .meta-line { margin: 2px 0; font-size: 10.5px; color: #334155; }
        .meta-line strong { color: #0F172A; }
        .info-grid { display: flex; gap: 14px; margin-bottom: 16px; }
        .info-card { flex: 1; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; background: #F8FAFC; }
        .info-card h4 { margin: 0 0 6px 0; color: #2563EB; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; }
        .info-card-text { font-size: 10.5px; color: #334155; line-height: 1.45; }
        .info-card-text strong { color: #0F172A; }
        table.spec-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        table.spec-table th { background: #0F172A; color: #ffffff; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 7px 8px; border: 1px solid #0F172A; text-align: left; }
        table.spec-table td { border: 1px solid #CBD5E1; padding: 7px 8px; font-size: 10px; color: #1E293B; vertical-align: top; }
        table.spec-table tr:nth-child(even) td { background: #F8FAFC; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .financial-wrapper { display: flex; gap: 14px; margin-bottom: 16px; }
        .terms-box { flex: 1; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; background: #F8FAFC; }
        .terms-box h4 { margin: 0 0 6px 0; color: #0F172A; font-size: 11px; font-weight: 700; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; }
        .terms-list { font-size: 9.5px; color: #475569; line-height: 1.4; margin: 0; padding-left: 14px; }
        .terms-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px; font-size: 9.5px; }
        .totals-box { width: 310px; border: 1px solid #CBD5E1; border-radius: 8px; overflow: hidden; background: #ffffff; }
        .totals-table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
        .totals-table td { padding: 5px 10px; border-bottom: 1px solid #F1F5F9; }
        .totals-table tr.grand-total-row td { background: #2563EB; color: #ffffff; font-weight: 800; font-size: 12.5px; padding: 7px 10px; }
        .totals-table tr.balance-row td { background: #FEF2F2; color: #991B1B; font-weight: 700; }
        .signature-area { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; padding-top: 10px; }
        .sig-block { text-align: center; width: 210px; }
        .sig-image-container { height: 55px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 4px; }
        .sig-image-container img { max-height: 52px; width: auto; object-fit: contain; }
        .sig-line-bar { border-top: 1.5px solid #0F172A; width: 100%; margin: 4px 0 4px 0; }
        .sig-person-name { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 11px; color: #0F172A; }
        .sig-person-title { font-size: 9.5px; color: #475569; font-weight: 600; }
        .sig-company-name { font-size: 8.5px; color: #64748B; }
        .stamp-box { border: 1.5px dashed #94A3B8; border-radius: 6px; padding: 8px; text-align: center; color: #94A3B8; font-size: 8.5px; font-weight: 600; width: 140px; height: 50px; display: flex; align-items: center; justify-content: center; }
        .document-footer { text-align: center; font-size: 8.5px; color: #94A3B8; margin-top: 20px; border-top: 1px solid #E2E8F0; padding-top: 6px; font-weight: 500; }
    </style>
</head>
<body>
    <img src="file:///C:/Users/user/.gemini/antigravity/scratch/alugrade-bms/assets/logo/logo.png" class="watermark" alt="Watermark" />
    <div class="content-wrapper">
        <div class="header-container">
            <div class="logo-brand-wrap">
                <div class="logo-box">
                    <img src="file:///C:/Users/user/.gemini/antigravity/scratch/alugrade-bms/assets/logo/logo.png" alt="ALUGRADE LANKA FAB & GLASS" />
                </div>
                <div>
                    <h1 class="company-title">ALUGRADE LANKA FAB & GLASS</h1>
                    <div class="company-subtitle">Architectural Aluminium & Structural Glass Solutions</div>
                    <p class="company-contacts">
                        📍 53/1/A Diyagama, Homagama &nbsp;|&nbsp; 📞 070 279 5702 &nbsp;|&nbsp; 💬 075 551 5862<br>
                        📧 info@alugrade.lk &nbsp;|&nbsp; 🌐 www.alugrade.lk
                    </p>
                </div>
            </div>
            <div class="header-info-box">
                <div class="doc-badge">QUOTATION</div>
                <div class="meta-line"><strong>QTN No:</strong> QTN-2026-0001</div>
                <div class="meta-line"><strong>Date:</strong> 2026-08-02</div>
                <div class="meta-line"><strong>Valid Until:</strong> 2026-09-01</div>
                <div class="meta-line"><strong>Sales Rep:</strong> Samantha Perera</div>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <h4>Client Information</h4>
                <div class="info-card-text">
                    <strong>Lanka Commercial Holdings (Pvt) Ltd</strong><br>
                    No. 45, Galle Road, Colombo 03<br>
                    <strong>Phone:</strong> 011 234 5678<br>
                    <strong>Email:</strong> info@lankacommercial.lk
                </div>
            </div>
            <div class="info-card">
                <h4>Project & Site Details</h4>
                <div class="info-card-text">
                    <strong>Project:</strong> Commercial Office Glass Partitions<br>
                    <strong>Site Location:</strong> Level 4, Colombo 03 Site<br>
                    <strong>Installation:</strong> Included &nbsp;|&nbsp; <strong>Delivery:</strong> Included
                </div>
            </div>
        </div>

        <table class="spec-table">
            <thead>
                <tr>
                    <th style="width: 25px;" class="text-center">#</th>
                    <th>Item Description & Specification</th>
                    <th style="width: 85px;" class="text-center">Dimensions</th>
                    <th style="width: 55px;" class="text-center">Sq.Ft</th>
                    <th style="width: 40px;" class="text-center">Qty</th>
                    <th style="width: 90px;" class="text-right">Unit Rate</th>
                    <th style="width: 100px;" class="text-right">Amount (LKR)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center" style="font-weight: 700;">1</td>
                    <td>
                        <strong style="color: #0F172A; font-size: 10.5px;">Aluminium Sliding Window 2-Track System</strong>
                        <div style="color: #475569; font-size: 9px; margin-top: 2px;">
                            Brand: <strong style="color: #2563EB;">Alumex</strong> &nbsp;|&nbsp;
                            Section: <strong>Sliding Window 2-Track (100mm)</strong> &nbsp;|&nbsp;
                            Glass: <strong>6mm Tempered Clear Glass</strong> &nbsp;|&nbsp;
                            Finish: <strong>Matt Black Powder Coated</strong>
                        </div>
                    </td>
                    <td class="text-center">1800 × 2100 mm</td>
                    <td class="text-center font-medium">81.37</td>
                    <td class="text-center font-medium">2</td>
                    <td class="text-right">3,000.00</td>
                    <td class="text-right" style="font-weight: 700;">244,110.00</td>
                </tr>
                <tr>
                    <td class="text-center" style="font-weight: 700;">2</td>
                    <td>
                        <strong style="color: #0F172A; font-size: 10.5px;">Commercial Shopfront Frameless Glass Door</strong>
                        <div style="color: #475569; font-size: 9px; margin-top: 2px;">
                            Brand: <strong style="color: #059669;">SwissTek</strong> &nbsp;|&nbsp;
                            Section: <strong>Shopfront Framing (100mm)</strong> &nbsp;|&nbsp;
                            Glass: <strong>12mm Laminated Clear</strong> &nbsp;|&nbsp;
                            Finish: <strong>Anodized Silver</strong>
                        </div>
                    </td>
                    <td class="text-center">1200 × 2400 mm</td>
                    <td class="text-center font-medium">31.00</td>
                    <td class="text-center font-medium">1</td>
                    <td class="text-right">4,200.00</td>
                    <td class="text-right" style="font-weight: 700;">130,200.00</td>
                </tr>
            </tbody>
        </table>

        <div class="financial-wrapper">
            <div class="terms-box">
                <h4>Commercial Scope & Terms</h4>
                <div class="terms-meta">
                    <div><strong>Delivery Period:</strong> 2-3 Weeks</div>
                    <div><strong>Payment Terms:</strong> 50% Advance</div>
                    <div><strong>Warranty:</strong> 10 Yrs Profiles / 2 Yrs Hardware</div>
                    <div><strong>Prepared By:</strong> Admin User</div>
                </div>
                <ol class="terms-list">
                    <li>Prices are valid for 30 days from quotation issue date.</li>
                    <li>Any variation in site structural opening dimensions will be adjusted on final billing.</li>
                    <li>Site readiness and opening clearing are customer responsibility prior to installation.</li>
                </ol>
            </div>

            <div class="totals-box">
                <table class="totals-table">
                    <tr>
                        <td style="color: #475569;">Subtotal:</td>
                        <td class="text-right font-medium">LKR 374,310.00</td>
                    </tr>
                    <tr>
                        <td style="color: #475569;">Overall Discount:</td>
                        <td class="text-right text-danger">- LKR 10,000.00</td>
                    </tr>
                    <tr>
                        <td style="color: #475569;">VAT (18%):</td>
                        <td class="text-right">+ LKR 65,575.80</td>
                    </tr>
                    <tr class="grand-total-row">
                        <td>Grand Total:</td>
                        <td class="text-right">LKR 429,885.80</td>
                    </tr>
                    <tr>
                        <td style="color: #475569;">Advance Deposit:</td>
                        <td class="text-right">LKR 214,942.90</td>
                    </tr>
                    <tr class="balance-row">
                        <td>Balance Payable:</td>
                        <td class="text-right">LKR 214,942.90</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="signature-area">
            <div class="sig-block">
                <div class="sig-image-container">
                    <img src="file:///C:/Users/user/.gemini/antigravity/scratch/alugrade-bms/assets/signature/signature.png" alt="Authorized Signature" />
                </div>
                <div class="sig-line-bar"></div>
                <div class="sig-person-name">MR. M. U. RAJAPAKSHA</div>
                <div class="sig-person-title">Managing Director</div>
                <div class="sig-company-name">ALUGRADE LANKA FAB & GLASS</div>
            </div>

            <div class="stamp-box">
                OFFICIAL COMPANY<br>STAMP & SEAL
            </div>

            <div class="sig-block">
                <div class="sig-image-container"></div>
                <div class="sig-line-bar"></div>
                <div class="sig-person-name">CUSTOMER ACCEPTANCE</div>
                <div class="sig-person-title">Authorized Name & Signature</div>
                <div class="sig-company-name">Date: ____ / ____ / 2026</div>
            </div>
        </div>

        <div class="document-footer">
            ALUGRADE LANKA FAB & GLASS &nbsp;•&nbsp; Commercial Enterprise System &nbsp;•&nbsp; Page 1 of 1
        </div>
    </div>
</body>
</html>'''

scratch_dir = r'C:\Users\user\.gemini\antigravity\scratch\alugrade-bms'
html_file = os.path.join(scratch_dir, 'preview.html')
with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_exe = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
brain_dir = r'C:\Users\user\.gemini\antigravity\brain\128fb562-f31e-4f33-99a9-fe22b03b8f5a'
out_png = os.path.join(brain_dir, 'quotation_preview.png')

cmd = [edge_exe, '--headless', f'--screenshot={out_png}', '--window-size=850,1180', html_file]
subprocess.run(cmd, check=True)

print(f'Screenshot saved successfully: {out_png} ({os.path.getsize(out_png)} bytes)')
