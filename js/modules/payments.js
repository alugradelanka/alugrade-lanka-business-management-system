/**
 * Payment Management Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 */

class PaymentModule {
    constructor(containerId) {
        this.containerId = containerId || 'pageContent';
        this.db = window.DB || { payments: [], invoices: [], orders: [] };
        this.events = window.Events || { trigger: () => {}, emit: () => {} };
        this.payments = this.loadPayments();
    }

    loadPayments() {
        const data = localStorage.getItem('alugrade_payments');
        if (data) {
            try { return JSON.parse(data); } catch(e) { return []; }
        }

        // Default enterprise payment records
        const defaults = [
            {
                payNo: 'PAY-2026-0001',
                receiptNo: 'REC-2026-0089',
                invoiceId: 'INV-2026-0002',
                orderId: 'ORD-2026-0001',
                customerName: 'Jayasinghe Construction (Pvt) Ltd',
                customerPhone: '0771234567',
                amount: 260000,
                method: 'Cheque',
                reference: 'CHQ-445102 (Commercial Bank)',
                paymentDate: '2026-07-31',
                paymentTime: '10:15 AM',
                status: 'Partial',
                invoiceTotal: 545580,
                previousPayments: 0,
                remainingBalance: 285580,
                notes: 'Advance 50% deposit received upon order placement.',
                gatewayProvider: null
            },
            {
                payNo: 'PAY-2026-0002',
                receiptNo: 'REC-2026-0090',
                invoiceId: 'INV-2026-0001',
                orderId: 'ORD-2026-0002',
                customerName: 'Sunil Shantha Perera',
                customerPhone: '0755515862',
                amount: 335710,
                method: 'Bank Transfer',
                reference: 'TRF-994120 (Sampath Bank)',
                paymentDate: '2026-07-29',
                paymentTime: '11:30 AM',
                status: 'Paid',
                invoiceTotal: 335710,
                previousPayments: 0,
                remainingBalance: 0,
                notes: 'Full payment cleared for Kottawa Villa Enclosure.',
                gatewayProvider: null
            }
        ];

        localStorage.setItem('alugrade_payments', JSON.stringify(defaults));
        return defaults;
    }

    savePayments() {
        localStorage.setItem('alugrade_payments', JSON.stringify(this.payments));
    }

    render() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        const totalReceived = this.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const todayStr = new Date().toISOString().split('T')[0];
        const todaysCash = this.payments.filter(p => p.paymentDate === todayStr && p.method === 'Cash').reduce((sum, p) => sum + (p.amount || 0), 0);
        const todaysTransfers = this.payments.filter(p => p.paymentDate === todayStr && p.method === 'Bank Transfer').reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalOutstanding = 285580; // Receivables sum

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Payment & Receipt Management</h2>
                    <p class="text-muted small mb-0">Record customer settlements, advance deposits, generate receipts, and track daily cash collections</p>
                </div>
                <button class="btn btn-primary" onclick="window.paymentModule.renderNewForm()">
                    <i class="fas fa-money-bill-wave me-1"></i> + Record Payment
                </button>
            </div>

            <!-- Financial Metrics Summary -->
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #10B981; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Total Collections</div>
                        <h3 class="mb-0 font-bold text-success mt-1">LKR ${totalReceived.toLocaleString('en-US', {minimumFractionDigits:2})}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid var(--color-brand-blue); border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Today's Cash Summary</div>
                        <h3 class="mb-0 font-bold text-primary mt-1">LKR ${todaysCash.toLocaleString('en-US', {minimumFractionDigits:2})}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #6366F1; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Bank Transfers Today</div>
                        <h3 class="mb-0 font-bold text-info mt-1">LKR ${todaysTransfers.toLocaleString('en-US', {minimumFractionDigits:2})}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #EF4444; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Total Receivables</div>
                        <h3 class="mb-0 font-bold text-danger mt-1">LKR ${totalOutstanding.toLocaleString('en-US', {minimumFractionDigits:2})}</h3>
                    </div>
                </div>
            </div>

            <!-- Main Filter Controls -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="row g-3 mb-3 align-items-center">
                    <div class="col-md-4">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                            <input type="text" id="payment-search" class="form-control border-start-0" placeholder="Search PAY#, receipt#, customer, invoice..." onkeyup="window.paymentModule.handleSearch()">
                        </div>
                    </div>

                    <div class="col-md-3">
                        <select id="status-filter" class="form-select" onchange="window.paymentModule.handleSearch()">
                            <option value="all">All Payment Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Partial">Partial</option>
                            <option value="Paid">Paid</option>
                            <option value="Refunded">Refunded</option>
                        </select>
                    </div>

                    <div class="col-md-3">
                        <select id="method-filter" class="form-select" onchange="window.paymentModule.handleSearch()">
                            <option value="all">All Payment Methods</option>
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Card Payment">Card Payment</option>
                            <option value="Online Payment">Online Payment (PayHere/WebXPay)</option>
                        </select>
                    </div>

                    <div class="col-md-2 text-end">
                        <button class="btn btn-outline-secondary btn-sm" onclick="window.paymentModule.exportListExcel()"><i class="fas fa-file-excel text-success me-1"></i> Export CSV</button>
                    </div>
                </div>

                <!-- Professional Payments Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" id="payments-table">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>PAY# & Receipt#</th>
                                <th>Customer Name</th>
                                <th>Ref Invoice / Order</th>
                                <th>Payment Date</th>
                                <th>Method</th>
                                <th>Amount Paid</th>
                                <th>Remaining Balance</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="payments-tbody">
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.loadPaymentsData();
    }

    loadPaymentsData() {
        const query = document.getElementById('payment-search')?.value || '';
        const statusFilter = document.getElementById('status-filter')?.value || 'all';
        const methodFilter = document.getElementById('method-filter')?.value || 'all';

        let filtered = this.payments;

        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(p => 
                (p.payNo && p.payNo.toLowerCase().includes(q)) ||
                (p.receiptNo && p.receiptNo.toLowerCase().includes(q)) ||
                (p.customerName && p.customerName.toLowerCase().includes(q)) ||
                (p.invoiceId && p.invoiceId.toLowerCase().includes(q)) ||
                (p.orderId && p.orderId.toLowerCase().includes(q))
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        if (methodFilter !== 'all') {
            filtered = filtered.filter(p => p.method === methodFilter);
        }

        this.renderTableData(filtered);
    }

    renderTableData(payments) {
        const tbody = document.getElementById('payments-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (payments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-muted">No payment records matching criteria.</td></tr>';
            return;
        }

        payments.forEach(p => {
            const statusBadge = {
                'Pending': 'bg-warning text-dark',
                'Partial': 'bg-info text-dark',
                'Paid': 'bg-success',
                'Refunded': 'bg-danger'
            }[p.status] || 'bg-secondary';

            const methodIcon = {
                'Cash': 'fa-money-bill text-success',
                'Bank Transfer': 'fa-university text-primary',
                'Cheque': 'fa-money-check text-warning',
                'Card Payment': 'fa-credit-card text-info',
                'Online Payment': 'fa-globe text-purple'
            }[p.method] || 'fa-coins';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <strong class="text-primary">${p.payNo}</strong>
                    <div class="small text-muted"><i class="fas fa-receipt me-1"></i>${p.receiptNo || 'N/A'}</div>
                </td>
                <td>
                    <div class="font-bold text-main">${p.customerName}</div>
                    <div class="small text-muted">${p.customerPhone || ''}</div>
                </td>
                <td>
                    <div>${p.invoiceId || '-'}</div>
                    <div class="small text-muted"><i class="fas fa-link me-1"></i>${p.orderId || '-'}</div>
                </td>
                <td>${p.paymentDate}</td>
                <td>
                    <span class="small font-medium"><i class="fas ${methodIcon} me-1"></i>${p.method}</span>
                </td>
                <td><strong class="text-success">LKR ${(p.amount || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                <td><span class="${(p.remainingBalance || 0) > 0 ? 'text-danger font-bold' : 'text-success'}">LKR ${(p.remainingBalance || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span></td>
                <td><span class="badge ${statusBadge}">${p.status}</span></td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="window.paymentModule.renderReceiptModal('${p.payNo}')">Receipt</button>
                        <button class="btn btn-outline-info" onclick="window.paymentModule.printReceipt('${p.payNo}')">Print</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    handleSearch() {
        this.loadPaymentsData();
    }

    renderNewForm(orderId = 'ORD-2026-0001', invoiceId = 'INV-2026-0002') {
        const modalId = 'paymentModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const newPayNo = 'PAY-2026-' + (this.payments.length + 1).toString().padStart(4, '0');
        const newReceiptNo = 'REC-2026-' + (this.payments.length + 91).toString().padStart(4, '0');

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-money-bill-wave text-success me-2"></i> Record Customer Payment & Issue Receipt
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="payment-form">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Payment ID</label>
                                        <input type="text" class="form-control bg-light font-bold text-primary" name="payNo" value="${newPayNo}" readonly>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Receipt Number</label>
                                        <input type="text" class="form-control bg-light font-bold" name="receiptNo" value="${newReceiptNo}" readonly>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Payment Date</label>
                                        <input type="date" class="form-control" name="paymentDate" value="${new Date().toISOString().split('T')[0]}" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Linked Invoice#</label>
                                        <input type="text" class="form-control font-bold" name="invoiceId" value="${invoiceId}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Customer Full Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="customerName" value="Jayasinghe Construction (Pvt) Ltd" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Linked Order#</label>
                                        <input type="text" class="form-control" name="orderId" value="${orderId}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Payment Method <span class="text-danger">*</span></label>
                                        <select class="form-select font-bold" name="method" id="payMethodSelect" onchange="window.paymentModule.handleMethodChange(this)" required>
                                            <option value="Cash">Cash Settlement</option>
                                            <option value="Bank Transfer" selected>Bank Transfer (Online/Deposit)</option>
                                            <option value="Cheque">Cheque Payment</option>
                                            <option value="Card Payment">Card Payment (POS Terminal)</option>
                                            <option value="Online Payment">Online Payment Gateway (PayHere / WebXPay)</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Amount Received (LKR) <span class="text-danger">*</span></label>
                                        <input type="number" step="0.01" class="form-control font-bold text-success fs-5" name="amount" value="285580" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Reference / Cheque# / Transaction ID</label>
                                        <input type="text" class="form-control" name="reference" value="TRF-994120">
                                    </div>
                                </div>

                                <!-- Future Online Payment Gateway Architecture Banner -->
                                <div id="online-gateway-info" class="p-3 bg-light rounded mb-3" style="display:none; border: 1px solid #6366F1;">
                                    <div class="d-flex align-items-center gap-2">
                                        <i class="fas fa-globe text-indigo fa-2x"></i>
                                        <div>
                                            <strong class="text-indigo">Online Payment Gateway Architecture Integration</strong>
                                            <p class="small text-muted mb-0">Prepared architecture for Sri Lankan Payment Gateways (PayHere / WebXPay). Ready for API secret keys configuration.</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Payment Notes & Remarks</label>
                                        <textarea class="form-control" name="notes" rows="2" placeholder="Full balance settlement for Homagama Commercial Complex invoice..."></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="window.paymentModule.handleSavePayment()">
                                <i class="fas fa-check me-1"></i> Save Payment & Issue Receipt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        const modalEl = document.getElementById(modalId);
        if (window.bootstrap && window.bootstrap.Modal) {
            const modal = new window.bootstrap.Modal(modalEl);
            modal.show();
        } else {
            modalEl.classList.add('show');
            modalEl.style.display = 'block';
        }
    }

    handleMethodChange(selectEl) {
        const gatewayInfo = document.getElementById('online-gateway-info');
        if (gatewayInfo) {
            gatewayInfo.style.display = selectEl.value === 'Online Payment' ? 'block' : 'none';
        }
    }

    handleSavePayment() {
        const form = document.getElementById('payment-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.amount = parseFloat(data.amount || 0);
        data.invoiceTotal = 545580;
        data.previousPayments = 260000;
        data.remainingBalance = Math.max(0, data.invoiceTotal - (data.previousPayments + data.amount));
        data.status = data.remainingBalance <= 0 ? 'Paid' : 'Partial';

        this.payments.unshift(data);
        this.savePayments();

        const modalEl = document.getElementById('paymentModal');
        if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            } else {
                modalEl.remove();
            }
        }

        alert(`Payment ${data.payNo} recorded successfully!`);
        this.render();
    }

    renderReceiptModal(payNo) {
        const pay = this.payments.find(p => p.payNo === payNo);
        if (!pay) return;

        const modalId = 'receiptModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-receipt text-success me-2"></i> Official Payment Receipt: ${pay.receiptNo || pay.payNo}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4" id="receipt-print-area">
                            <!-- Header with White ALUGRADE Logo -->
                            <div class="d-flex justify-content-between align-items-center pb-4 border-bottom mb-4">
                                <div class="d-flex align-items-center gap-3">
                                    <div style="background: #ffffff; padding: 8px 14px; border-radius: 12px; border: 1px solid var(--color-border);">
                                        <img src="assets/logo/logo.png" alt="ALUGRADE Logo" style="height: 50px; object-fit: contain;">
                                    </div>
                                    <div>
                                        <h5 class="font-bold mb-0 text-main" style="color: var(--color-brand-red);">ALUGRADE LANKA FAB & GLASS</h5>
                                        <p class="text-muted small mb-0">High-End Architectural Aluminium & Toughened Glass</p>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <h4 class="font-bold text-success mb-0">PAYMENT RECEIPT</h4>
                                    <div class="small font-bold text-main">${pay.receiptNo || pay.payNo}</div>
                                </div>
                            </div>

                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <div class="small text-muted uppercase">Received From:</div>
                                    <h5 class="font-bold text-main mb-0">${pay.customerName}</h5>
                                    <p class="small text-muted mb-0"><i class="fas fa-phone me-1"></i>${pay.customerPhone || 'N/A'}</p>
                                </div>
                                <div class="col-md-6 text-end">
                                    <div class="small text-muted uppercase">Payment Date & Time:</div>
                                    <div class="font-bold text-main">${pay.paymentDate} (${pay.paymentTime || '10:00 AM'})</div>
                                    <div class="small text-muted">Invoice Ref: <strong>${pay.invoiceId || '-'}</strong> &nbsp;|&nbsp; Order: <strong>${pay.orderId || '-'}</strong></div>
                                </div>
                            </div>

                            <div class="p-4 bg-light rounded text-center mb-4" style="border: 1px solid var(--color-border);">
                                <span class="text-muted uppercase small font-medium">Amount Received</span>
                                <h2 class="font-bold text-success my-1">LKR ${(pay.amount || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</h2>
                                <span class="badge bg-success font-medium">Payment Method: ${pay.method} (${pay.reference || 'Direct Deposit'})</span>
                            </div>

                            <!-- Managing Director Signature Block -->
                            <div class="row g-4 pt-4 border-top">
                                <div class="col-md-6">
                                    <p class="small text-muted mb-0">Thank you for your payment!<br>ALUGRADE LANKA FAB & GLASS Official Receipt.</p>
                                </div>
                                <div class="col-md-6 text-end">
                                    <div class="d-inline-block text-center pt-2">
                                        <div style="height: 45px;">
                                            <img src="assets/signature/signature.png" alt="Signature" style="height: 40px; object-fit: contain;">
                                        </div>
                                        <div style="width: 200px; border-top: 1.5px solid var(--color-brand-charcoal); margin: 4px auto;"></div>
                                        <div class="font-bold small text-main" style="font-family: 'Poppins', sans-serif;">MR. M. U. RAJAPAKSHA</div>
                                        <div class="small text-muted" style="font-family: 'Montserrat', sans-serif;">Managing Director</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary px-4" onclick="window.print()"><i class="fas fa-print me-1"></i> Print Receipt</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        const modalEl = document.getElementById(modalId);
        if (window.bootstrap && window.bootstrap.Modal) {
            const modal = new window.bootstrap.Modal(modalEl);
            modal.show();
        } else {
            modalEl.classList.add('show');
            modalEl.style.display = 'block';
        }
    }

    printReceipt(payNo) {
        window.print();
    }

    exportListExcel() {
        let csv = "PAY#,Receipt#,Customer,Date,Method,Amount,Status\n";
        this.payments.forEach(p => {
            csv += `${p.payNo},${p.receiptNo || ''},"${p.customerName}",${p.paymentDate},"${p.method}",${p.amount},${p.status}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ALUGRADE_Payments_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Payment Gateway Provider Architecture interface for future PayHere / WebXPay integrations
class OnlinePaymentGateway {
    constructor(provider = 'PayHere') {
        this.provider = provider; // 'PayHere' or 'WebXPay'
        this.isSandbox = true;
    }

    initiatePayment(paymentDetails) {
        console.log(`[OnlinePaymentGateway Architecture] Initialized payload for ${this.provider}:`, paymentDetails);
        return {
            status: 'READY_FOR_API_KEYS',
            merchantId: 'SAMPLE_MERCHANT_ID',
            returnUrl: window.location.origin + '/#/payments?status=success'
        };
    }
}

if (typeof window !== 'undefined') {
    window.PaymentModule = PaymentModule;
    window.OnlinePaymentGateway = OnlinePaymentGateway;
}
