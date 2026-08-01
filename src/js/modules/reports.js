/**
 * Reports & Analytics Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 */

class ReportModule {
    constructor(db, eventsManager) {
        this.containerId = 'pageContent';
        this.db = db || window.DB;
        this.events = eventsManager || window.Events;
        this.currentReportType = 'executive_sales';
        this.currentCategory = 'executive';
        this.currentReportData = [];
    }

    render() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Enterprise Reports & Business Analytics</h2>
                    <p class="text-muted small mb-0">Executive dashboards, financial statements, customer intelligence, quotation conversion & inventory analytics</p>
                </div>
                <div class="btn-group">
                    <button class="btn btn-outline-secondary btn-sm" onclick="window.reportModule.exportPDF()"><i class="fas fa-file-pdf text-danger me-1"></i> Export PDF</button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="window.reportModule.exportExcel()"><i class="fas fa-file-excel text-success me-1"></i> Export Excel</button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="window.print()"><i class="fas fa-print me-1"></i> Print Report</button>
                </div>
            </div>

            <!-- Report Navigation Categories Grid -->
            <div class="row g-3 mb-4">
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main" id="cat-exec" onclick="window.reportModule.switchCategory('executive')">
                        <i class="fas fa-chart-line text-primary fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Executive Sales</h6>
                        <small class="text-muted">Daily/Weekly/Monthly</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main" id="cat-fin" onclick="window.reportModule.switchCategory('financial')">
                        <i class="fas fa-coins text-success fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Financial & P&L</h6>
                        <small class="text-muted">Revenue & Margins</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main" id="cat-cust" onclick="window.reportModule.switchCategory('customer')">
                        <i class="fas fa-users text-info fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Customer Intelligence</h6>
                        <small class="text-muted">Top Clients & Balances</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main" id="cat-qtn" onclick="window.reportModule.switchCategory('quotation')">
                        <i class="fas fa-file-signature text-warning fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Quotations</h6>
                        <small class="text-muted">Conversion Rate</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main" id="cat-inv" onclick="window.reportModule.switchCategory('inventory')">
                        <i class="fas fa-boxes text-purple fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Inventory</h6>
                        <small class="text-muted">Fast/Slow Moving</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main" id="cat-prod" onclick="window.reportModule.switchCategory('production')">
                        <i class="fas fa-industry text-danger fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Production</h6>
                        <small class="text-muted">Technician Efficiency</small>
                    </div>
                </div>
            </div>

            <!-- Parameters Filter Controls Bar -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="row g-3 align-items-center">
                    <div class="col-md-4">
                        <label class="form-label small font-medium mb-1">Select Report Type</label>
                        <select id="report-type-select" class="form-select font-bold" onchange="window.reportModule.handleReportChange(this.value)">
                            <!-- Populated dynamically -->
                        </select>
                    </div>

                    <div class="col-md-3">
                        <label class="form-label small font-medium mb-1">Date Period Range</label>
                        <select id="report-period-select" class="form-select" onchange="window.reportModule.toggleCustomDates(this.value)">
                            <option value="this_month" selected>This Month (July 2026)</option>
                            <option value="today">Today</option>
                            <option value="this_week">This Week</option>
                            <option value="this_year">This Year (2026)</option>
                            <option value="custom">Custom Date Range</option>
                        </select>
                    </div>

                    <div class="col-md-3" id="custom-date-container" style="display: none;">
                        <label class="form-label small font-medium mb-1">From Date - To Date</label>
                        <div class="input-group input-group-sm">
                            <input type="date" id="report-start-date" class="form-control" value="2026-07-01">
                            <input type="date" id="report-end-date" class="form-control" value="2026-07-31">
                        </div>
                    </div>

                    <div class="col-md-2 text-end pt-3">
                        <button class="btn btn-primary w-100" onclick="window.reportModule.generateReport()">
                            <i class="fas fa-play me-1"></i> Generate
                        </button>
                    </div>
                </div>
            </div>

            <!-- Report Output & Interactive Charts Render Area -->
            <div id="report-output-container">
                <!-- Dynamically generated -->
            </div>
        `;

        container.innerHTML = html;
        this.switchCategory('executive');
    }

    switchCategory(category) {
        this.currentCategory = category;
        const select = document.getElementById('report-type-select');
        if (!select) return;

        let options = '';
        if (category === 'executive') {
            options = `
                <option value="daily_sales">Daily Sales Report</option>
                <option value="weekly_sales">Weekly Sales Summary</option>
                <option value="monthly_sales" selected>Monthly Sales Performance</option>
                <option value="annual_sales">Annual Sales & Revenue Trend</option>
            `;
        } else if (category === 'financial') {
            options = `
                <option value="revenue_summary">Total Generated Revenue</option>
                <option value="outstanding_payments">Outstanding Receivables Balance</option>
                <option value="paid_unpaid_invoices">Paid vs Unpaid Invoices</option>
                <option value="profit_summary">Profit & Loss (P&L) Summary Architecture</option>
                <option value="cash_flow">Cash Flow Statement</option>
            `;
        } else if (category === 'customer') {
            options = `
                <option value="top_customers">Top Customers by Revenue</option>
                <option value="customer_history">Customer Purchase History</option>
                <option value="outstanding_customers">Outstanding Customer Balances</option>
            `;
        } else if (category === 'quotation') {
            options = `
                <option value="pending_quotations">Pending Quotations</option>
                <option value="approved_quotations">Approved Quotations</option>
                <option value="rejected_quotations">Rejected Quotations</option>
                <option value="quotation_conversion">Quotation Conversion Rate Analytics</option>
            `;
        } else if (category === 'inventory') {
            options = `
                <option value="current_stock">Current Stock Valuation</option>
                <option value="low_stock_report">Low Stock & Reorder Report</option>
                <option value="fast_moving">Fast Moving Materials</option>
                <option value="slow_moving">Slow Moving Stock</option>
            `;
        } else if (category === 'production') {
            options = `
                <option value="production_performance">Production Stage Lead Times</option>
                <option value="technician_performance">Technician & Team Performance</option>
            `;
        }

        select.innerHTML = options;
        this.generateReport();
    }

    handleReportChange(val) {
        this.currentReportType = val;
        this.generateReport();
    }

    toggleCustomDates(val) {
        const customDiv = document.getElementById('custom-date-container');
        if (customDiv) customDiv.style.display = val === 'custom' ? 'block' : 'none';
    }

    generateReport() {
        const type = document.getElementById('report-type-select')?.value || 'monthly_sales';
        const output = document.getElementById('report-output-container');
        if (!output) return;

        this.currentReportType = type;

        if (type.includes('sales') || type === 'revenue_summary') {
            this.renderExecutiveSalesReport(output);
        } else if (type === 'paid_unpaid_invoices' || type === 'outstanding_payments' || type === 'cash_flow') {
            this.renderFinancialReport(output);
        } else if (type === 'profit_summary') {
            this.renderProfitSummaryReport(output);
        } else if (type.includes('customer')) {
            this.renderCustomerIntelligenceReport(output);
        } else if (type.includes('quotation')) {
            this.renderQuotationAnalyticsReport(output);
        } else if (type.includes('stock') || type.includes('moving')) {
            this.renderInventoryAnalyticsReport(output);
        } else {
            this.renderProductionPerformanceReport(output);
        }
    }

    renderExecutiveSalesReport(container) {
        this.currentReportData = [
            { Date: '2026-07-28', Customer: 'Lanka Developers Ltd', Order: 'ORD-2026-0001', Revenue: 'LKR 450,000.00', Status: 'Completed' },
            { Date: '2026-07-29', Customer: 'Sunil Shantha Perera', Order: 'ORD-2026-0002', Revenue: 'LKR 335,710.00', Status: 'Completed' },
            { Date: '2026-07-31', Customer: 'Jayasinghe Construction', Order: 'ORD-2026-0003', Revenue: 'LKR 545,580.00', Status: 'In Production' }
        ];

        container.innerHTML = `
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid var(--color-brand-blue); border-radius:12px;">
                        <small class="text-muted uppercase">Daily Sales</small>
                        <h4 class="font-bold text-primary mb-0 mt-1">LKR 335,710.00</h4>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #10B981; border-radius:12px;">
                        <small class="text-muted uppercase">Weekly Sales</small>
                        <h4 class="font-bold text-success mb-0 mt-1">LKR 1,331,290.00</h4>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #6366F1; border-radius:12px;">
                        <small class="text-muted uppercase">Monthly Sales (July)</small>
                        <h4 class="font-bold text-info mb-0 mt-1">LKR 4,850,000.00</h4>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #F59E0B; border-radius:12px;">
                        <small class="text-muted uppercase">Annual Sales YTD</small>
                        <h4 class="font-bold text-warning mb-0 mt-1">LKR 28,450,000.00</h4>
                    </div>
                </div>
            </div>

            <div class="card p-4 mb-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-table text-primary me-2"></i> Executive Sales Breakdown Data</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Date</th>
                                <th>Customer Name</th>
                                <th>Order Ref</th>
                                <th>Generated Revenue (LKR)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.currentReportData.map(r => `
                                <tr>
                                    <td>${r.Date}</td>
                                    <td><strong>${r.Customer}</strong></td>
                                    <td>${r.Order}</td>
                                    <td><strong class="text-success">${r.Revenue}</strong></td>
                                    <td><span class="badge bg-success">${r.Status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderFinancialReport(container) {
        container.innerHTML = `
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #10B981; border-radius:12px;">
                        <small class="text-muted uppercase">Total Settled Invoices</small>
                        <h4 class="font-bold text-success mb-0 mt-1">LKR 3,980,000.00</h4>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #EF4444; border-radius:12px;">
                        <small class="text-muted uppercase">Outstanding Unpaid Receivables</small>
                        <h4 class="font-bold text-danger mb-0 mt-1">LKR 870,000.00</h4>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #6366F1; border-radius:12px;">
                        <small class="text-muted uppercase">Paid Ratio</small>
                        <h4 class="font-bold text-indigo mb-0 mt-1">82.06% Fully Paid</h4>
                    </div>
                </div>
            </div>

            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3">Paid vs Unpaid Invoices Summary</h5>
                <p class="text-muted small">Comprehensive statement of billed commercial invoices, advance collections, and uncollected outstanding accounts.</p>
            </div>
        `;
    }

    renderProfitSummaryReport(container) {
        container.innerHTML = `
            <div class="card p-4 mb-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:16px;">
                <h4 class="font-bold text-main mb-3"><i class="fas fa-calculator text-success me-2"></i> Commercial Profit & Loss (P&L) Statement Architecture</h4>
                <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Financial Metric / Line Item</th>
                                <th class="text-end">Amount (LKR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Gross Sales Revenue</strong></td><td class="text-end text-success font-bold">LKR 4,850,000.00</td></tr>
                            <tr><td>Less: Material Extrusion & Glass Costs</td><td class="text-end text-danger">- LKR 2,450,000.00</td></tr>
                            <tr class="table-light"><td class="font-bold">Gross Profit Margin</td><td class="text-end font-bold text-primary">LKR 2,400,000.00 (49.4%)</td></tr>
                            <tr><td>Less: Workshop Labor & Electricity Overhead</td><td class="text-end text-danger">- LKR 650,000.00</td></tr>
                            <tr class="table-success fs-5 font-bold"><td>Net Operating Profit</td><td class="text-end text-success">LKR 1,750,000.00 (36.08%)</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderCustomerIntelligenceReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-crown text-warning me-2"></i> Top Corporate & Retail Clients</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small">
                            <tr>
                                <th>Customer Name</th>
                                <th>Total Projects</th>
                                <th>Lifetime Value (LKR)</th>
                                <th>Outstanding Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Jayasinghe Construction (Pvt) Ltd</strong></td><td>4 Orders</td><td class="text-success font-bold">LKR 1,850,000.00</td><td class="text-danger font-bold">LKR 285,580.00</td></tr>
                            <tr><td><strong>Sunil Shantha Perera</strong></td><td>2 Orders</td><td class="text-success font-bold">LKR 650,000.00</td><td class="text-success">LKR 0.00</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderQuotationAnalyticsReport(container) {
        container.innerHTML = `
            <div class="row g-3 mb-4">
                <div class="col-md-3"><div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #6366F1; border-radius:12px;"><small class="text-muted">Total Quotations Issued</small><h4 class="font-bold text-primary mb-0 mt-1">24 QTN</h4></div></div>
                <div class="col-md-3"><div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #10B981; border-radius:12px;"><small class="text-muted">Approved & Converted</small><h4 class="font-bold text-success mb-0 mt-1">18 QTN</h4></div></div>
                <div class="col-md-3"><div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #F59E0B; border-radius:12px;"><small class="text-muted">Pending Feedback</small><h4 class="font-bold text-warning mb-0 mt-1">4 QTN</h4></div></div>
                <div class="col-md-3"><div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #EF4444; border-radius:12px;"><small class="text-muted">Quotation Conversion Rate</small><h4 class="font-bold text-indigo mb-0 mt-1">75.00% Success</h4></div></div>
            </div>
        `;
    }

    renderInventoryAnalyticsReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-boxes text-purple me-2"></i> Fast & Slow Moving Materials Analysis</h5>
                <div class="row g-3">
                    <div class="col-md-6 border-end">
                        <h6 class="font-bold text-success">🚀 Fast Moving Stock SKUs</h6>
                        <ul class="list-group list-group-flush small">
                            <li class="list-group-item">100mm Powder Coated Black Profile (High Turnover)</li>
                            <li class="list-group-item">6mm Clear Tempered Glass Sheets</li>
                        </ul>
                    </div>
                    <div class="col-md-6 ps-4">
                        <h6 class="font-bold text-warning">🐢 Slow Moving Stock SKUs</h6>
                        <ul class="list-group list-group-flush small">
                            <li class="list-group-item">Special Bronze Anodized Extrusions</li>
                            <li class="list-group-item">Heavy Duty 120kg Double Rollers</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductionPerformanceReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-industry text-danger me-2"></i> Technician Efficiency & Workshop Output</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small">
                            <tr>
                                <th>Production Technician / Team</th>
                                <th>Assigned Jobs</th>
                                <th>Completed On-Time</th>
                                <th>Efficiency Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Bandara Fabrication Team A</strong></td><td>12 Jobs</td><td>11 Jobs</td><td><span class="badge bg-success font-bold">91.6% Efficiency</span></td></tr>
                            <tr><td><strong>Kamal Glass Installation Team B</strong></td><td>8 Jobs</td><td>8 Jobs</td><td><span class="badge bg-success font-bold">100% On-Time</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    exportPDF() {
        window.print();
    }

    exportExcel() {
        let csv = "Date,Customer,Order,Revenue,Status\n";
        (this.currentReportData || []).forEach(r => {
            csv += `${r.Date},"${r.Customer}",${r.Order},"${r.Revenue}",${r.Status}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ALUGRADE_Report_${this.currentReportType}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

if (typeof window !== 'undefined') {
    window.ReportModule = ReportModule;
}
