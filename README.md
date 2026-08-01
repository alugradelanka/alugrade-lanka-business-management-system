# ALUGRADE LANKA FAB & GLASS Business Management System (BMS)

> **Enterprise Commercial Edition v1.0.0**  
> A complete, high-performance Business Management System tailored for architectural aluminium extrusions, toughened glass fabrication, and commercial installation management.

---

## 🌟 Key System Modules & Features

### 📊 1. Executive Dashboard
* **KPI Metrics Cards:** Revenue trends, active orders, pending jobs, and receivables.
* **Analytics Charts:** Monthly revenue bar charts, orders vs deliveries, and payment status breakdown.
* **Recent Activities Panel:** Real-time audit log of latest quotations, orders, invoices, payments, and deliveries.

### 🏢 2. Customer Management System
* **Directory & Profiles:** Comprehensive directory with search, district filtering (25 districts), and NIC/BR registration numbers.
* **Financial History Tabs:** Customer history tabs for Quotations, Orders, Invoices, Payments, and Activity logs.

### 📄 3. Quotation Management System
* **Auto Numbering (`QTN-2026-XXXX`):** Automated sequential quotation numbering.
* **Granular Specifications:** Itemized rows for aluminium section, glass type, colour, width, height, auto-calculated square footage, unit price, labor, and discounts.
* **Branded PDF Export:** White logo container and official Managing Director signature block (`MR. M. U. RAJAPAKSHA`).

### 📦 4. Order Management System
* **Auto Numbering (`ORD-2026-XXXX`):** 1-Click quotation-to-order conversion modal.
* **Production Scheduling:** Priority levels (*Normal*, *High*, *Urgent*), target completion dates, and production team assignments.

### 🏭 5. Workshop Production Management
* **7 Manufacturing Stages:** *Pending* (0%), *Cutting* (16%), *Fabrication* (33%), *Assembly* (50%), *Glass Installation* (66%), *Quality Check* (83%), and *Ready for Delivery* (100%).
* **Dual View Modes:** Interactive **Kanban Board** with 1-click stage advancement and **Table View**.

### 🚚 6. Logistics & Delivery Management
* **Auto Delivery Notes (`DN-2026-XXXX`):** 1-Click conversion from completed production jobs.
* **Vehicle & Driver Assignments:** Vehicle registration numbers, driver details, contact persons, and customer receipt acknowledgements.

### 🧾 7. Commercial Invoice Management
* **Auto Tax Invoices (`INV-2026-XXXX`):** 1-Click generation from completed Delivery Notes.
* **Tax Calculation:** Configurable 18% VAT calculation, discount handling, and balance receivables tracking.

### 💵 8. Payment Settlement & Receipts
* **Auto Receipts (`PAY-2026-XXXX` / `REC-2026-XXXX`):** Supports Cash, Bank Transfer, Cheque, Card Payment, and Online Payment Gateway Architecture.

### 📦 9. Inventory & Stock Control
* **5 Standard Categories:** *Aluminium Profiles*, *Glass*, *Accessories*, *Hardware*, *Consumables*.
* **Automated Material Reduction (`autoReduceStock`):** Automatically deducts profile lengths and glass sheets when production begins.

### 📈 10. Reports & Analytics Engine
* Executive Sales Reports, Financial P&L Statement Architecture, Customer Intelligence, Quotation Conversion Rates, and Fast/Slow Moving Stock reports.

### ⚙️ 11. Settings & Company Configuration
* Company branding uploads, document prefixes, VAT percentages, paper size preferences, and security policies.

### 👥 12. User Management & Role-Based Access Control (RBAC)
* 10 Standard Roles (*Super Administrator*, *Managing Director*, *Manager*, *Sales Executive*, *Production Manager*, *Production Staff*, *Cashier*, *Store Keeper*, *Delivery Coordinator*, *Read Only User*) with 2FA architecture ready.

### 💾 13. Backup & Data Restoration
* 1-Click full IndexedDB snapshot download, drag-and-drop file restore, SHA-256 integrity validation, and auto-backup scheduling.

---

## 🛠️ Technology Stack

* **Frontend Structure:** HTML5 Semantic Markup
* **Logic & Engine:** Vanilla JavaScript (ES6+ Modules, Object-Oriented Architecture)
* **Styling & Design System:** Custom Vanilla CSS with CSS System Tokens, Glassmorphism, and White Enterprise Palette
* **Data Storage:** Browser IndexedDB (AlugradeDB v1) & `localStorage` Persistence
* **Iconography & Charts:** FontAwesome 6, Lucide Icons, and Chart.js
* **Backend Server:** Python `http.server` for local execution

---

## 📁 Folder Structure

```text
alugrade-bms/
├── index.html                  # Main Application Entry Point
├── app.html                    # Single Page Application (SPA) Shell
├── server.py                   # Python HTTP Development Server
├── start.bat                   # Windows Launch Script
├── start.ps1                   # PowerShell Launch Script
├── README.md                   # System Documentation
├── .gitignore                  # Git Exclusion Definitions
├── assets/                     # Branding Logos, Signatures & Assets
│   ├── logo/logo.png
│   └── signature/signature.png
├── css/                        # CSS Architecture & Stylesheets
│   ├── theme.css
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   └── print.css
└── js/                         # JavaScript Business Logic & Modules
    ├── config.js
    ├── db.js
    ├── auth.js
    ├── utils.js
    ├── router.js
    ├── app.js
    ├── dashboard.js
    └── modules/
        ├── customers.js
        ├── quotations.js
        ├── orders.js
        ├── production.js
        ├── delivery.js
        ├── invoices.js
        ├── payments.js
        ├── inventory.js
        ├── reports.js
        ├── settings.js
        ├── users.js
        └── backup.js
```

---

## 🚀 Installation & Local Execution Guide

### Prerequisites
* Python 3.8+ or any modern Web Browser (Google Chrome, Microsoft Edge, Firefox).

### Quick Start Commands

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/alugrade-bms.git
   cd alugrade-bms
   ```

2. **Launch the Local Development Server:**
   * Using Python:
     ```bash
     python server.py
     ```
   * Or run `start.bat` on Windows.

3. **Access the System:**
   Open your browser and navigate to:
   ```text
   http://localhost:8080/app.html
   ```

---

## 📄 License & Intellectual Property

Copyright © 2026 **ALUGRADE LANKA FAB & GLASS**. All Rights Reserved.  
*Confidential and Proprietary. Unauthorized copying, distribution, or modification of this software is strictly prohibited.*
