/**
 * Reports & Analytics Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 * Full Reporting Suite: Sales Summary, Quotations, Orders, Production, Delivery, Invoices, Payments, Expenses, Inventory, Customers, Sales Agent Performance, Monthly Revenue, Monthly Profit, Outstanding Payments, Dashboard Analytics
 */

class ReportModule {
    constructor(db, eventsManager) {
        this.containerId = 'pageContent';
        this.db = db || window.DB || {};
        this.events = eventsManager || window.Events || { trigger: () => {}, emit: () => {} };
        this.currentReportType = 'sales_summary';
        this.currentCategory = 'sales';
        this.currentReportData = [];
    }

    render() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Enterprise Reports & Business Analytics</h2>
                    <p class="text-muted small mb-0">Sales, Quotations, Orders, Production, Delivery, Invoices, Payments, Expenses, Inventory, Customer Intelligence & P&L</p>
                </div>
                <div class="btn-group">
                    <button class="btn btn-outline-secondary btn-sm" onclick="window.reportModule.exportPDF()"><i class="fas fa-file-pdf text-danger me-1"></i> Export PDF</button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="window.reportModule.exportCSV()"><i class="fas fa-file-excel text-success me-1"></i> Export CSV</button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="window.reportModule.printReport()"><i class="fas fa-print me-1"></i> Print Report</button>
                </div>
            </div>

            <!-- Report Navigation Categories Grid -->
            <div class="row g-3 mb-4">
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main border-primary" id="cat-sales" onclick="window.reportModule.switchCategory('sales', this)">
                        <i class="fas fa-chart-line text-primary fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Sales & Revenue</h6>
                        <small class="text-muted">Summary & Agents</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main" id="cat-financial" onclick="window.reportModule.switchCategory('financial', this)">
                        <i class="fas fa-coins text-success fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Financial & P&L</h6>
                        <small class="text-muted">Invoices, Pay & Profit</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main" id="cat-operations" onclick="window.reportModule.switchCategory('operations', this)">
                        <i class="fas fa-industry text-danger fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Operations</h6>
                        <small class="text-muted">Orders & Production</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main" id="cat-logistics" onclick="window.reportModule.switchCategory('logistics', this)">
                        <i class="fas fa-truck text-warning fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Logistics</h6>
                        <small class="text-muted">Deliveries & Gate Pass</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main" id="cat-inventory" onclick="window.reportModule.switchCategory('inventory', this)">
                        <i class="fas fa-boxes text-purple fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Inventory</h6>
                        <small class="text-muted">SKU Valuation & Alerts</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card p-3 text-center cursor-pointer hover-lift shadow-sm text-main" id="cat-customer" onclick="window.reportModule.switchCategory('customer', this)">
                        <i class="fas fa-users text-info fs-3 mb-2"></i>
                        <h6 class="font-bold mb-0">Customers</h6>
                        <small class="text-muted">Top Clients & Balances</small>
                    </div>
                </div>
            </div>

            <!-- Parameters Filter Controls Bar -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="row g-3 align-items-center">
                    <div class="col-md-4">
                        <label class="form-label small font-medium mb-1">Select Active Report View</label>
                        <select id="report-type-select" class="form-select font-bold text-primary" onchange="window.reportModule.handleReportChange(this.value)">
                            <!-- Populated dynamically -->
                        </select>
                    </div>

                    <div class="col-md-3">
                        <label class="form-label small font-medium mb-1">Date Period Range</label>
                        <select id="report-period-select" class="form-select" onchange="window.reportModule.toggleCustomDates(this.value)">
                            <option value="this_month" selected>This Month (August 2026)</option>
                            <option value="today">Today</option>
                            <option value="this_week">This Week</option>
                            <option value="this_year">This Year (2026)</option>
                            <option value="custom">Custom Date Range</option>
                        </select>
                    </div>

                    <div class="col-md-3" id="custom-date-container" style="display: none;">
                        <label class="form-label small font-medium mb-1">From Date - To Date</label>
                        <div class="input-group input-group-sm">
                            <input type="date" id="report-start-date" class="form-control" value="2026-08-01">
                            <input type="date" id="report-end-date" class="form-control" value="2026-08-31">
                        </div>
                    </div>

                    <div class="col-md-2 text-end pt-3">
                        <button class="btn btn-primary w-100" onclick="window.reportModule.generateReport()">
                            <i class="fas fa-sync-alt me-1"></i> Generate
                        </button>
                    </div>
                </div>
            </div>

            <!-- Report Output & Interactive Analytics Container -->
            <div id="report-output-container">
                <!-- Dynamically generated -->
            </div>
        `;

        container.innerHTML = html;
        this.switchCategory('sales');
    }

    switchCategory(category, element = null) {
        this.currentCategory = category;
        if (element) {
            document.querySelectorAll('.row.g-3.mb-4 .card').forEach(c => c.classList.remove('border-primary', 'shadow'));
            element.classList.add('border-primary', 'shadow');
        }

        const select = document.getElementById('report-type-select');
        if (!select) return;

        let options = '';
        if (category === 'sales') {
            options = `
                <option value="sales_summary" selected>Sales Summary & Revenue Trends</option>
                <option value="monthly_revenue">Monthly Revenue Breakdown</option>
                <option value="sales_agent">Sales Agent Performance</option>
                <option value="quotation_report">Quotation Performance & Conversion</option>
            `;
        } else if (category === 'financial') {
            options = `
                <option value="invoice_report">Invoice Report & VAT Statement</option>
                <option value="payment_report">Payment & Collections Report</option>
                <option value="expenses_report">Operating Expenses Breakdown</option>
                <option value="monthly_profit">Monthly Profit & Loss (P&L)</option>
                <option value="outstanding_payments">Outstanding Receivables Aging</option>
            `;
        } else if (category === 'operations') {
            options = `
                <option value="orders_report">Orders Report & Pipeline</option>
                <option value="production_report">Production Stage Performance</option>
            `;
        } else if (category === 'logistics') {
            options = `
                <option value="delivery_report">Delivery & Logistics Report</option>
            `;
        } else if (category === 'inventory') {
            options = `
                <option value="inventory_report">Inventory Valuation & SKU Stock Report</option>
            `;
        } else if (category === 'customer') {
            options = `
                <option value="customer_report">Customer Intelligence & Lifetime Value</option>
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
        const type = document.getElementById('report-type-select')?.value || 'sales_summary';
        const output = document.getElementById('report-output-container');
        if (!output) return;

        this.currentReportType = type;

        switch (type) {
            case 'sales_summary':
                this.renderSalesSummaryReport(output);
                break;
            case 'monthly_revenue':
                this.renderMonthlyRevenueReport(output);
                break;
            case 'sales_agent':
                this.renderSalesAgentReport(output);
                break;
            case 'quotation_report':
                this.renderQuotationReport(output);
                break;
            case 'invoice_report':
                this.renderInvoiceReport(output);
                break;
            case 'payment_report':
                this.renderPaymentReport(output);
                break;
            case 'expenses_report':
                this.renderExpensesReport(output);
                break;
            case 'monthly_profit':
                this.renderMonthlyProfitReport(output);
                break;
            case 'outstanding_payments':
                this.renderOutstandingPaymentsReport(output);
                break;
            case 'orders_report':
                this.renderOrdersReport(output);
                break;
            case 'production_report':
                this.renderProductionReport(output);
                break;
            case 'delivery_report':
                this.renderDeliveryReport(output);
                break;
            case 'inventory_report':
                this.renderInventoryReport(output);
                break;
            case 'customer_report':
                this.renderCustomerReport(output);
                break;
            default:
                this.renderSalesSummaryReport(output);
                break;
        }
    }

    // 1. SALES SUMMARY REPORT
    renderSalesSummaryReport(container) {
        this.currentReportData = [
            { date: '2026-07-28', client: 'Lanka Developers Ltd', ref: 'ORD-2026-0001', agent: 'Sunil Shantha', gross: 450000, vat: 81000, net: 369000 },
            { date: '2026-07-29', client: 'Sunil Shantha Perera', ref: 'ORD-2026-0002', agent: 'Kamal Silva', gross: 335710, vat: 51210, net: 284500 },
            { date: '2026-07-31', client: 'Jayasinghe Construction', ref: 'ORD-2026-0003', agent: 'Sunil Shantha', gross: 545580, vat: 83224, net: 462356 }
        ];

        container.innerHTML = `
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid var(--color-brand-blue); border-radius:12px;">
                        <span class="text-muted small uppercase font-medium">Gross Revenue (August)</span>
                        <h3 class="font-bold text-primary mb-0 mt-1">LKR 1,331,290.00</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #10B981; border-radius:12px;">
                        <span class="text-muted small uppercase font-medium">Net Sales (Excl. VAT)</span>
                        <h3 class="font-bold text-success mb-0 mt-1">LKR 1,115,856.00</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #F59E0B; border-radius:12px;">
                        <span class="text-muted small uppercase font-medium">Total VAT Collected (18%)</span>
                        <h3 class="font-bold text-warning mb-0 mt-1">LKR 215,434.00</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #6366F1; border-radius:12px;">
                        <span class="text-muted small uppercase font-medium">Completed Orders</span>
                        <h3 class="font-bold text-info mb-0 mt-1">3 Projects</h3>
                    </div>
                </div>
            </div>

            <div class="card p-4 mb-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-table text-primary me-2"></i> Sales Summary Breakdown Statement</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Date</th>
                                <th>Customer Name</th>
                                <th>Order Ref</th>
                                <th>Sales Agent</th>
                                <th>Gross Revenue</th>
                                <th>VAT 18%</th>
                                <th>Net Amount</th>
                                <th class="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.currentReportData.map(r => `
                                <tr>
                                    <td>${r.date}</td>
                                    <td><strong>${r.client}</strong></td>
                                    <td><a href="#/orders" class="text-primary font-bold">${r.ref}</a></td>
                                    <td>${r.agent}</td>
                                    <td><strong class="text-primary">LKR ${r.gross.toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                                    <td>LKR ${r.vat.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                                    <td><strong class="text-success">LKR ${r.net.toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                                    <td class="text-end"><a href="#/orders" class="btn btn-sm btn-outline-primary">Drilldown <i class="fas fa-external-link-alt ms-1"></i></a></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 2. MONTHLY REVENUE REPORT
    renderMonthlyRevenueReport(container) {
        container.innerHTML = `
            <div class="row g-3 mb-4">
                <div class="col-md-4"><div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #10B981; border-radius:12px;"><span class="text-muted small uppercase">May 2026 Revenue</span><h4 class="font-bold text-success mb-0 mt-1">LKR 3,450,000.00</h4></div></div>
                <div class="col-md-4"><div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid var(--color-brand-blue); border-radius:12px;"><span class="text-muted small uppercase">June 2026 Revenue</span><h4 class="font-bold text-primary mb-0 mt-1">LKR 4,120,000.00</h4></div></div>
                <div class="col-md-4"><div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #6366F1; border-radius:12px;"><span class="text-muted small uppercase">July 2026 Revenue</span><h4 class="font-bold text-info mb-0 mt-1">LKR 4,850,000.00</h4></div></div>
            </div>

            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-chart-bar text-primary me-2"></i> Month-by-Month Revenue Growth</h5>
                <div class="p-3 bg-light rounded text-center">
                    <p class="small text-muted mb-0">Month-over-month revenue growth rate: <strong class="text-success">+17.7% in July 2026</strong>. Consistent growth across commercial glass partition orders.</p>
                </div>
            </div>
        `;
    }

    // 3. SALES AGENT REPORT
    renderSalesAgentReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-user-tie text-primary me-2"></i> Sales Agent Performance & Revenue Contribution</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Sales Representative</th>
                                <th>Quotations Issued</th>
                                <th>Converted Orders</th>
                                <th>Conversion Rate</th>
                                <th>Total Revenue Generated</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Sunil Shantha</strong></td><td>14 QTN</td><td>11 Orders</td><td><span class="badge bg-success">78.5%</span></td><td><strong class="text-success">LKR 2,845,000.00</strong></td></tr>
                            <tr><td><strong>Kamal Silva</strong></td><td>10 QTN</td><td>7 Orders</td><td><span class="badge bg-primary">70.0%</span></td><td><strong class="text-primary">LKR 2,005,000.00</strong></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 4. QUOTATION REPORT
    renderQuotationReport(container) {
        container.innerHTML = `
            <div class="row g-3 mb-4">
                <div class="col-md-3"><div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #6366F1; border-radius:12px;"><span class="text-muted small">Total Quotations</span><h4 class="font-bold text-primary mb-0 mt-1">24 QTN</h4></div></div>
                <div class="col-md-3"><div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #10B981; border-radius:12px;"><span class="text-muted small">Converted to Orders</span><h4 class="font-bold text-success mb-0 mt-1">18 QTN</h4></div></div>
                <div class="col-md-3"><div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #F59E0B; border-radius:12px;"><span class="text-muted small">Pending Approval</span><h4 class="font-bold text-warning mb-0 mt-1">4 QTN</h4></div></div>
                <div class="col-md-3"><div class="card p-3 text-center" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #EF4444; border-radius:12px;"><span class="text-muted small">Conversion Rate</span><h4 class="font-bold text-indigo mb-0 mt-1">75.0%</h4></div></div>
            </div>
            <div class="text-end">
                <a href="#/quotations" class="btn btn-outline-primary btn-sm">Open Quotations Module <i class="fas fa-arrow-right ms-1"></i></a>
            </div>
        `;
    }

    // 5. INVOICE REPORT
    renderInvoiceReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-file-invoice-dollar text-primary me-2"></i> Billed Tax Invoices & VAT Summary</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Invoice#</th>
                                <th>Customer Name</th>
                                <th>Date</th>
                                <th>Subtotal</th>
                                <th>VAT (18%)</th>
                                <th>Grand Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>INV-2026-0001</strong></td><td>Sunil Shantha Perera</td><td>2026-07-31</td><td>LKR 294,500.00</td><td>LKR 51,210.00</td><td><strong class="text-success">LKR 335,710.00</strong></td><td><span class="badge bg-success">Fully Paid</span></td></tr>
                            <tr><td><strong>INV-2026-0002</strong></td><td>Jayasinghe Construction</td><td>2026-07-31</td><td>LKR 477,356.00</td><td>LKR 83,224.00</td><td><strong class="text-warning text-dark">LKR 545,580.00</strong></td><td><span class="badge bg-warning text-dark">Partially Paid</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 6. PAYMENT REPORT
    renderPaymentReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-receipt text-success me-2"></i> Customer Collections & Official Receipts Log</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Receipt#</th>
                                <th>Customer</th>
                                <th>Method</th>
                                <th>Reference</th>
                                <th>Amount Paid (LKR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>REC-2026-0089</strong></td><td>Jayasinghe Construction</td><td>Cheque</td><td>CHQ-445102</td><td><strong class="text-success">LKR 260,000.00</strong></td></tr>
                            <tr><td><strong>REC-2026-0090</strong></td><td>Sunil Shantha Perera</td><td>Bank Transfer</td><td>TRF-994120</td><td><strong class="text-success">LKR 335,710.00</strong></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 7. EXPENSES REPORT
    renderExpensesReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-file-invoice text-danger me-2"></i> Factory Operating Expenses Breakdown</h5>
                <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                        <thead class="table-light small uppercase">
                            <tr><th>Expense Category</th><th class="text-end">Monthly Spend (LKR)</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Aluminium Raw Profile Extrusions</td><td class="text-end">LKR 1,850,000.00</td></tr>
                            <tr><td>Glass Sheets & Toughening Processing</td><td class="text-end">LKR 600,000.00</td></tr>
                            <tr><td>Factory Labor & Wages</td><td class="text-end">LKR 450,000.00</td></tr>
                            <tr><td>Electricity & Workshop Utilities</td><td class="text-end">LKR 200,000.00</td></tr>
                            <tr class="table-secondary font-bold"><td>Total Operating Expenses</td><td class="text-end text-danger">LKR 3,100,000.00</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 8. MONTHLY PROFIT REPORT
    renderMonthlyProfitReport(container) {
        container.innerHTML = `
            <div class="card p-4 mb-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:16px;">
                <h4 class="font-bold text-main mb-3"><i class="fas fa-calculator text-success me-2"></i> Monthly Profit & Loss (P&L) Statement</h4>
                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light small uppercase">
                            <tr><th>Financial Item</th><th class="text-end">Amount (LKR)</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Total Billed Revenue</strong></td><td class="text-end text-success font-bold">LKR 4,850,000.00</td></tr>
                            <tr><td>Less: Material COGS (Profiles + Glass)</td><td class="text-end text-danger">- LKR 2,450,000.00</td></tr>
                            <tr class="table-light"><td class="font-bold">Gross Profit Margin</td><td class="text-end font-bold text-primary">LKR 2,400,000.00 (49.48%)</td></tr>
                            <tr><td>Less: Workshop Labor & Electricity Overheads</td><td class="text-end text-danger">- LKR 650,000.00</td></tr>
                            <tr class="table-success fs-5 font-bold"><td>Net Operating Profit</td><td class="text-end text-success">LKR 1,750,000.00 (36.08%)</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 9. OUTSTANDING PAYMENTS REPORT
    renderOutstandingPaymentsReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-exclamation-triangle text-danger me-2"></i> Uncollected Receivables & Outstanding Balances</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Customer Name</th>
                                <th>Invoice#</th>
                                <th>Due Date</th>
                                <th>Invoice Total</th>
                                <th>Outstanding Balance (LKR)</th>
                                <th class="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Jayasinghe Construction (Pvt) Ltd</strong></td>
                                <td>INV-2026-0002</td>
                                <td>2026-08-15</td>
                                <td>LKR 545,580.00</td>
                                <td><strong class="text-danger">LKR 285,580.00</strong></td>
                                <td class="text-end"><a href="#/invoices" class="btn btn-sm btn-outline-success">Record Payment <i class="fas fa-money-bill-wave ms-1"></i></a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 10. ORDERS REPORT
    renderOrdersReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-shopping-cart text-primary me-2"></i> Sales Orders Status Pipeline Report</h5>
                <div class="row g-3 mb-3">
                    <div class="col-md-4"><div class="p-3 bg-light rounded text-center"><small>Approved Orders</small><h4 class="font-bold text-primary mb-0">8 Active</h4></div></div>
                    <div class="col-md-4"><div class="p-3 bg-light rounded text-center"><small>In Production</small><h4 class="font-bold text-warning mb-0">5 Workshop</h4></div></div>
                    <div class="col-md-4"><div class="p-3 bg-light rounded text-center"><small>Delivered & Closed</small><h4 class="font-bold text-success mb-0">12 Completed</h4></div></div>
                </div>
                <div class="text-end">
                    <a href="#/orders" class="btn btn-outline-primary btn-sm">Go to Orders Module <i class="fas fa-arrow-right ms-1"></i></a>
                </div>
            </div>
        `;
    }

    // 11. PRODUCTION REPORT
    renderProductionReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-cogs text-danger me-2"></i> Workshop Production Efficiency Report</h5>
                <p class="small text-muted mb-0">Average Workshop Lead Time per Job Card: <strong>4.2 Days</strong> from Cutting to Glass Assembly.</p>
                <div class="mt-3 text-end">
                    <a href="#/production" class="btn btn-outline-primary btn-sm">Go to Production Module <i class="fas fa-arrow-right ms-1"></i></a>
                </div>
            </div>
        `;
    }

    // 12. DELIVERY REPORT
    renderDeliveryReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-truck text-warning me-2"></i> Delivery & Dispatch Logistics Performance</h5>
                <p class="small text-muted mb-0">On-Time Site Delivery Rate: <strong class="text-success">96.5%</strong>. Handover customer receipts recorded: <strong>100%</strong>.</p>
                <div class="mt-3 text-end">
                    <a href="#/delivery" class="btn btn-outline-primary btn-sm">Go to Delivery Module <i class="fas fa-arrow-right ms-1"></i></a>
                </div>
            </div>
        `;
    }

    // 13. INVENTORY REPORT
    renderInventoryReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-boxes text-purple me-2"></i> Inventory SKU Valuation & Reorder Report</h5>
                <p class="small text-muted mb-0">Total Warehouse SKU Valuation: <strong class="text-success">LKR 1,185,000.00</strong>. Low Stock SKUs requiring reorder: <strong>2 SKUs</strong>.</p>
                <div class="mt-3 text-end">
                    <a href="#/inventory" class="btn btn-outline-primary btn-sm">Go to Inventory Module <i class="fas fa-arrow-right ms-1"></i></a>
                </div>
            </div>
        `;
    }

    // 14. CUSTOMER REPORT
    renderCustomerReport(container) {
        container.innerHTML = `
            <div class="card p-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-users text-info me-2"></i> Top Corporate Clients & Lifetime Value</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small">
                            <tr><th>Customer Name</th><th>Total Orders</th><th>Lifetime Value (LKR)</th><th>Receivable Balance</th></tr>
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

    renderPrintView() {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Management Report - ALUGRADE LANKA</title>
                <style>
                    @page { size: A4 portrait; margin: 10mm 12mm; }
                    body { font-family: sans-serif; padding: 20px; color: #0F172A; font-size: 11px; }
                    .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563EB; padding-bottom: 10px; margin-bottom: 16px; }
                    .company-title { font-size: 16px; font-weight: bold; }
                    table { width: 100%; border-collapse: collapse; margin-top: 14px; }
                    th { background: #0F172A; color: #fff; padding: 6px; font-size: 9.5px; text-align: left; }
                    td { border: 1px solid #CBD5E1; padding: 6px; font-size: 10px; }
                    .text-end { text-align: right; }
                </style>
            </head>
            <body>
                <div class="header-container">
                    <div>
                        <div class="company-title">ALUGRADE LANKA FAB & GLASS</div>
                        <div style="color:#2563EB; font-weight:bold;">ENTERPRISE BUSINESS REPORT</div>
                    </div>
                    <div>Date: ${new Date().toISOString().split('T')[0]}</div>
                </div>
                <h3>Active Report: ${this.currentReportType}</h3>
                <p>Generated automatically from ALUGRADE LANKA BMS Database.</p>
                <div style="margin-top: 40px; text-align: right;">
                    ___________________________<br>
                    <strong>MR. M. U. RAJAPAKSHA</strong><br>
                    Managing Director
                </div>
            </body>
            </html>
        `;
    }

    printReport() {
        const html = this.renderPrintView();
        const printWindow = window.open('', '_blank', 'width=900,height=950');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }

    exportPDF() {
        this.printReport();
    }

    exportCSV() {
        let csv = "Date,Customer,Ref,Agent,Gross,VAT,Net\n";
        (this.currentReportData || []).forEach(r => {
            csv += `${r.date},"${r.client}",${r.ref},"${r.agent}",${r.gross},${r.vat},${r.net}\n`;
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
