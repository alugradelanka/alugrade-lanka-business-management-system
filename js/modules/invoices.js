/**
 * Invoice Management Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 */

class InvoiceModule {
    constructor(containerId) {
        this.containerId = containerId || 'pageContent';
        this.db = window.DB || { invoices: [] };
        this.events = window.Events || { trigger: () => {}, emit: () => {} };
        this.invoices = this.loadInvoices();
    }

    loadInvoices() {
        const data = localStorage.getItem('alugrade_invoices');
        if (data) {
            try { return JSON.parse(data); } catch(e) { return []; }
        }

        // Default enterprise invoice dataset
        const defaults = [
            {
                id: 'INV-2026-0001',
                dnRef: 'DN-2026-0001',
                orderId: 'ORD-2026-0002',
                qtId: 'QTN-2026-0004',
                customerName: 'Sunil Shantha Perera',
                customerPhone: '0755515862',
                projectName: 'Kottawa Villa Sliding Glass Enclosure',
                billingAddress: 'No. 12/B, Temple Road, Kottawa',
                date: '2026-07-31',
                dueDate: '2026-08-14',
                subtotal: 294500,
                discount: 10000,
                vatPct: 18,
                vatAmount: 51210,
                grandTotal: 335710,
                advanceReceived: 335710,
                balance: 0,
                status: 'Fully Paid',
                notes: 'Thank you for your business. Full payment received via Bank Transfer.',
                terms: 'Goods remain property of ALUGRADE LANKA FAB & GLASS until paid in full.',
                items: [
                    { description: 'Matt Black 3-Track Sliding Glass Door', details: '3000mm x 2400mm with 8mm Tinted Glass', qty: 1, price: 294500, amount: 294500 }
                ],
                payments: [
                    { date: '2026-07-29', amount: 335710, method: 'Bank Transfer', reference: 'TRF-994120' }
                ],
                timeline: [
                    { title: 'Invoice Issued from Delivery DN-2026-0001', date: '2026-07-31 11:30 AM', user: 'Accounts Dept' },
                    { title: 'Payment Confirmed & Settled (LKR 335,710)', date: '2026-07-31 11:35 AM', user: 'Accounts Dept' }
                ]
            },
            {
                id: 'INV-2026-0002',
                dnRef: 'DN-2026-0002',
                orderId: 'ORD-2026-0001',
                qtId: 'QTN-2026-0001',
                customerName: 'Jayasinghe Construction (Pvt) Ltd',
                customerPhone: '0771234567',
                projectName: 'Homagama Commercial Complex',
                billingAddress: 'No. 45, Galle Road, Colombo 03',
                date: '2026-07-31',
                dueDate: '2026-08-15',
                subtotal: 477356,
                discount: 15000,
                vatPct: 18,
                vatAmount: 83224,
                grandTotal: 545580,
                advanceReceived: 260000,
                balance: 285580,
                status: 'Partially Paid',
                notes: 'Advance deposit received upon order placement. Balance due on completion.',
                terms: 'Late payments are subject to a 2% monthly interest fee.',
                items: [
                    { description: '100mm Heavy Duty Aluminium Partition Framing', details: '2400mm x 2100mm with 6mm Tempered Glass', qty: 4, price: 119339, amount: 477356 }
                ],
                payments: [
                    { date: '2026-07-31', amount: 260000, method: 'Cheque Deposit', reference: 'CHQ-445102' }
                ],
                timeline: [
                    { title: 'Advance Payment Recorded (LKR 260,000)', date: '2026-07-31 10:15 AM', user: 'Accounts' }
                ]
            }
        ];

        localStorage.setItem('alugrade_invoices', JSON.stringify(defaults));
        return defaults;
    }

    saveInvoices() {
        localStorage.setItem('alugrade_invoices', JSON.stringify(this.invoices));
    }

    render() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Commercial Invoice Management</h2>
                    <p class="text-muted small mb-0">Generate commercial invoices, manage billing status, track VAT (18%), and record customer payments</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="window.invoiceModule.showConvertDeliveryModal()">
                        <i class="fas fa-truck text-primary me-1"></i> Generate from Delivery Note
                    </button>
                    <button class="btn btn-primary" onclick="window.invoiceModule.renderNewForm()">
                        <i class="fas fa-plus-circle me-1"></i> + Create New Invoice
                    </button>
                </div>
            </div>

            <!-- Invoice Status Pills Bar -->
            <ul class="nav nav-pills mb-4 gap-2" id="invoiceStatusTabs">
                <li class="nav-item"><button class="nav-link active font-medium" onclick="window.invoiceModule.filterStatus('All', this)">All (${this.invoices.length})</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.invoiceModule.filterStatus('Draft', this)">Draft (${this.invoices.filter(i=>i.status==='Draft').length})</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.invoiceModule.filterStatus('Issued', this)">Issued (${this.invoices.filter(i=>i.status==='Issued').length})</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.invoiceModule.filterStatus('Partially Paid', this)">Partially Paid (${this.invoices.filter(i=>i.status==='Partially Paid').length})</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.invoiceModule.filterStatus('Fully Paid', this)">Fully Paid (${this.invoices.filter(i=>i.status==='Fully Paid').length})</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.invoiceModule.filterStatus('Overdue', this)">Overdue (${this.invoices.filter(i=>i.status==='Overdue').length})</button></li>
            </ul>

            <!-- Filters & Search Card -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="row g-3 mb-3 align-items-center">
                    <div class="col-md-6">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                            <input type="text" id="invSearch" class="form-control border-start-0" placeholder="Search INV#, customer, order#, quotation#..." onkeyup="window.invoiceModule.search()">
                        </div>
                    </div>
                    <div class="col-md-6 text-end">
                        <button class="btn btn-outline-secondary btn-sm" onclick="window.invoiceModule.exportListExcel()"><i class="fas fa-file-excel text-success me-1"></i> Export CSV</button>
                    </div>
                </div>

                <!-- Professional Invoice Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" id="invoicesTable">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Invoice#</th>
                                <th>Customer & Project</th>
                                <th>Ref Order / Delivery</th>
                                <th>Invoice Date</th>
                                <th>Due Date</th>
                                <th>Grand Total</th>
                                <th>Paid Amount</th>
                                <th>Balance Due</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.generateTableRows('All')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    generateTableRows(statusFilter, searchQuery = '') {
        let filtered = this.invoices;
        if (statusFilter !== 'All') {
            filtered = filtered.filter(i => i.status === statusFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(i => 
                i.id.toLowerCase().includes(query) || 
                i.customerName.toLowerCase().includes(query) ||
                (i.orderId && i.orderId.toLowerCase().includes(query)) ||
                (i.dnRef && i.dnRef.toLowerCase().includes(query))
            );
        }

        if (filtered.length === 0) {
            return `<tr><td colspan="10" class="text-center py-4 text-muted">No commercial invoices found matching criteria.</td></tr>`;
        }

        return filtered.map(inv => {
            const statusBadge = {
                'Draft': 'bg-secondary',
                'Issued': 'bg-primary',
                'Partially Paid': 'bg-warning text-dark',
                'Fully Paid': 'bg-success',
                'Overdue': 'bg-danger'
            }[inv.status] || 'bg-secondary';

            return `
                <tr>
                    <td><strong class="text-primary">${inv.id}</strong></td>
                    <td>
                        <div class="font-bold text-main">${inv.customerName}</div>
                        <div class="small text-muted">${inv.projectName || 'Commercial Fabrication'}</div>
                    </td>
                    <td>
                        <div>${inv.orderId || '-'}</div>
                        <div class="small text-muted"><i class="fas fa-link me-1"></i>${inv.dnRef || 'N/A'}</div>
                    </td>
                    <td>${inv.date}</td>
                    <td><strong class="text-primary">${inv.dueDate}</strong></td>
                    <td><strong>LKR ${(inv.grandTotal || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                    <td><span class="text-success font-medium">LKR ${(inv.advanceReceived || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span></td>
                    <td><strong class="${(inv.balance || 0) > 0 ? 'text-danger' : 'text-success'}">LKR ${(inv.balance || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                    <td><span class="badge ${statusBadge}">${inv.status}</span></td>
                    <td class="text-end">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="window.invoiceModule.renderDetail('${inv.id}')">View</button>
                            <button class="btn btn-outline-info" onclick="window.invoiceModule.printInvoice('${inv.id}')">Print</button>
                            ${(inv.balance || 0) > 0 ? `<button class="btn btn-outline-success" onclick="window.invoiceModule.quickPay('${inv.id}')">Pay</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    filterStatus(status, element) {
        document.querySelectorAll('#invoiceStatusTabs .nav-link').forEach(el => el.classList.remove('active'));
        if (element) element.classList.add('active');
        const searchInput = document.getElementById('invSearch')?.value || '';
        document.querySelector('#invoicesTable tbody').innerHTML = this.generateTableRows(status, searchInput);
    }

    search() {
        const activeTabEl = document.querySelector('#invoiceStatusTabs .nav-link.active');
        const activeTab = activeTabEl ? activeTabEl.innerText.split(' ')[0] : 'All';
        const query = document.getElementById('invSearch')?.value || '';
        document.querySelector('#invoicesTable tbody').innerHTML = this.generateTableRows(activeTab, query);
    }

    // 1-CLICK GENERATION FROM DELIVERIES
    showConvertDeliveryModal() {
        const modalId = 'convertDeliveryModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-file-invoice text-primary me-2"></i> Generate Invoice from Completed Delivery Note
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <p class="text-muted small mb-3">Select a completed delivery note to automatically generate an invoice with auto-imported order items and pricing.</p>
                            <div class="list-group">
                                <div class="list-group-item p-3 d-flex justify-content-between align-items-center" style="border-radius: 10px; border: 1px solid var(--color-border);">
                                    <div>
                                        <h6 class="mb-1 font-bold text-primary">DN-2026-0001 - Sunil Shantha Perera</h6>
                                        <p class="text-muted small mb-0">Project: Kottawa Villa Enclosure &nbsp;|&nbsp; Linked Order: <strong>ORD-2026-0002</strong></p>
                                    </div>
                                    <button class="btn btn-success font-medium" onclick="window.invoiceModule.createFromDelivery('DN-2026-0001')">
                                        <i class="fas fa-bolt me-1"></i> Generate Invoice
                                    </button>
                                </div>
                            </div>
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

    createFromDelivery(dnNo) {
        const newInvId = 'INV-2026-' + (this.invoices.length + 1).toString().padStart(4, '0');
        const newInv = {
            id: newInvId,
            dnRef: dnNo,
            orderId: 'ORD-2026-0002',
            qtId: 'QTN-2026-0004',
            customerName: 'Sunil Shantha Perera',
            customerPhone: '0755515862',
            projectName: 'Kottawa Villa Sliding Glass Enclosure',
            billingAddress: 'No. 12/B, Temple Road, Kottawa',
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14*86400000).toISOString().split('T')[0],
            subtotal: 294500,
            discount: 10000,
            vatPct: 18,
            vatAmount: 51210,
            grandTotal: 335710,
            advanceReceived: 335710,
            balance: 0,
            status: 'Fully Paid',
            notes: 'Generated 1-click from Delivery Note ' + dnNo,
            terms: 'Goods remain property of ALUGRADE LANKA FAB & GLASS until paid in full.',
            items: [
                { description: 'Matt Black 3-Track Sliding Glass Door System', details: '3000mm x 2400mm with 8mm Tinted Glass', qty: 1, price: 294500, amount: 294500 }
            ],
            payments: [
                { date: new Date().toISOString().split('T')[0], amount: 335710, method: 'Direct Bank Settlement', reference: '1-Click Delivery Auto-Clear' }
            ],
            timeline: [
                { title: `Generated 1-Click from Delivery Note ${dnNo}`, date: new Date().toLocaleString(), user: 'Billing Dept' },
                { title: 'Invoice Marked Fully Paid', date: new Date().toLocaleString(), user: 'System Auto' }
            ]
        };

        this.invoices.unshift(newInv);
        this.saveInvoices();

        const modalEl = document.getElementById('convertDeliveryModal');
        if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            } else {
                modalEl.remove();
            }
        }

        alert(`Invoice ${newInvId} generated successfully from ${dnNo}!`);
        this.render();
    }

    renderNewForm() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        const newId = 'INV-2026-' + (this.invoices.length + 1).toString().padStart(4, '0');
        const today = new Date().toISOString().split('T')[0];
        const dueDateStr = new Date(Date.now() + 14*86400000).toISOString().split('T')[0];

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <h2 class="font-bold mb-0">Create Commercial Invoice</h2>
                <button class="btn btn-outline-secondary" onclick="window.invoiceModule.render()">Back to Invoices</button>
            </div>
            <form id="invoiceForm" onsubmit="event.preventDefault(); window.invoiceModule.save();">
                <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                    <div class="row g-3 mb-3">
                        <div class="col-md-3">
                            <label class="form-label font-medium">Invoice Number</label>
                            <input type="text" class="form-control bg-light font-bold text-primary" id="inv_id" value="${newId}" readonly>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label font-medium">Invoice Date</label>
                            <input type="date" class="form-control" id="inv_date" value="${today}" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label font-medium">Payment Due Date</label>
                            <input type="date" class="form-control" id="inv_dueDate" value="${dueDateStr}" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label font-medium">Order# / Delivery# Ref</label>
                            <input type="text" class="form-control" id="inv_orderId" value="ORD-2026-0001" placeholder="ORD-2026-0001">
                        </div>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label font-medium">Customer Full Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="inv_customerName" value="Jayasinghe Construction (Pvt) Ltd" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label font-medium">Customer Phone Number</label>
                            <input type="text" class="form-control" id="inv_customerPhone" value="0771234567">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label font-medium">Billing & Site Address</label>
                            <textarea class="form-control" id="inv_billingAddress" rows="2">No. 45, Galle Road, Colombo 03</textarea>
                        </div>
                    </div>
                </div>

                <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="font-bold text-main mb-0">Fabrication Items & Pricing</h5>
                        <button type="button" class="btn btn-sm btn-primary" onclick="window.invoiceModule.addItemRow()">+ Add Item Row</button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-bordered align-middle mb-0" id="inv_itemsTable">
                            <thead class="table-light small">
                                <tr>
                                    <th>Item & Specifications Description</th>
                                    <th style="width:100px;">Qty</th>
                                    <th style="width:180px;">Unit Price (LKR)</th>
                                    <th style="width:180px;">Amount (LKR)</th>
                                    <th style="width:50px;"></th>
                                </tr>
                            </thead>
                            <tbody id="inv_itemsBody">
                                <!-- Dynamic rows -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                            <h5 class="font-bold text-main mb-3">Notes & Commercial Terms</h5>
                            <div class="mb-3">
                                <label class="form-label font-medium">Invoice Notes</label>
                                <textarea class="form-control" id="inv_notes" rows="2">Thank you for choosing ALUGRADE LANKA FAB & GLASS.</textarea>
                            </div>
                            <div>
                                <label class="form-label font-medium">Payment Terms & Conditions</label>
                                <textarea class="form-control" id="inv_terms" rows="2">Late payment subject to 2% monthly interest. Goods remain property of ALUGRADE until paid in full.</textarea>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                            <h5 class="font-bold text-main mb-3">Financial Calculation Summary</h5>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label mb-0">Subtotal Amount:</label>
                                <input type="number" class="form-control w-50 text-end font-bold" id="inv_subtotal" value="477356" readonly>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label mb-0">Discount (LKR):</label>
                                <input type="number" class="form-control w-50 text-end" id="inv_discount" value="15000" oninput="window.invoiceModule.calculateTotals()">
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label mb-0">VAT (18%):</label>
                                <input type="number" class="form-control w-50 text-end" id="inv_tax" value="83224" oninput="window.invoiceModule.calculateTotals()">
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between align-items-center mb-2 fs-5 font-bold">
                                <label class="form-label mb-0">Grand Total:</label>
                                <input type="number" class="form-control w-50 text-end font-bold text-primary fs-5" id="inv_grandTotal" value="545580" readonly>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label mb-0">Advance / Paid Amount:</label>
                                <input type="number" class="form-control w-50 text-end font-bold text-success" id="inv_advance" value="260000" oninput="window.invoiceModule.calculateTotals()">
                            </div>
                            <div class="d-flex justify-content-between align-items-center fs-5 font-bold text-danger">
                                <label class="form-label mb-0">Balance Due:</label>
                                <input type="number" class="form-control w-50 text-end font-bold text-danger fs-5" id="inv_balance" value="285580" readonly>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-end mb-4">
                    <button type="button" class="btn btn-outline-secondary me-2" onclick="window.invoiceModule.render()">Cancel</button>
                    <button type="submit" class="btn btn-success px-4"><i class="fas fa-save me-1"></i> Save & Issue Invoice</button>
                </div>
            </form>
        `;

        container.innerHTML = html;
        this.addItemRow({ description: '100mm Heavy Duty Aluminium Partition Framing', details: '2400mm x 2100mm with 6mm Tempered Glass', qty: 4, price: 119339, amount: 477356 });
    }

    addItemRow(item = {}) {
        const tbody = document.getElementById('inv_itemsBody');
        if (!tbody) return;

        const rowId = 'invrow_' + Date.now() + Math.floor(Math.random() * 1000);
        const tr = document.createElement('tr');
        tr.id = rowId;
        tr.innerHTML = `
            <td>
                <input type="text" class="form-control form-control-sm item-desc mb-1 font-medium" placeholder="Item Description" value="${item.description || ''}" required>
                <input type="text" class="form-control form-control-sm item-details text-muted" placeholder="Specifications & Dimensions" value="${item.details || ''}">
            </td>
            <td>
                <input type="number" class="form-control form-control-sm item-qty text-center" value="${item.qty || 1}" oninput="window.invoiceModule.calcRow('${rowId}')" required>
            </td>
            <td>
                <input type="number" step="0.01" class="form-control form-control-sm item-price text-end" value="${item.price || 0}" oninput="window.invoiceModule.calcRow('${rowId}')" required>
            </td>
            <td>
                <input type="number" class="form-control form-control-sm item-amount text-end font-bold" value="${item.amount || 0}" readonly>
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.closest('tr').remove(); window.invoiceModule.calculateTotals();"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
        this.calcRow(rowId);
    }

    calcRow(rowId) {
        const row = document.getElementById(rowId);
        if (!row) return;
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const amount = qty * price;
        row.querySelector('.item-amount').value = amount.toFixed(2);
        this.calculateTotals();
    }

    calculateTotals() {
        let subtotal = 0;
        document.querySelectorAll('#inv_itemsBody .item-amount').forEach(el => {
            subtotal += parseFloat(el.value) || 0;
        });

        const inv_subtotal = document.getElementById('inv_subtotal');
        if (inv_subtotal) inv_subtotal.value = subtotal.toFixed(2);

        const discount = parseFloat(document.getElementById('inv_discount')?.value) || 0;
        const tax = parseFloat(document.getElementById('inv_tax')?.value) || 0;

        const grandTotal = Math.max(0, subtotal - discount + tax);
        const inv_grandTotal = document.getElementById('inv_grandTotal');
        if (inv_grandTotal) inv_grandTotal.value = grandTotal.toFixed(2);

        const advance = parseFloat(document.getElementById('inv_advance')?.value) || 0;
        const balance = Math.max(0, grandTotal - advance);
        const inv_balance = document.getElementById('inv_balance');
        if (inv_balance) inv_balance.value = balance.toFixed(2);
    }

    save() {
        const id = document.getElementById('inv_id').value;
        const items = [];

        document.querySelectorAll('#inv_itemsBody tr').forEach(row => {
            items.push({
                description: row.querySelector('.item-desc').value,
                details: row.querySelector('.item-details').value,
                qty: parseFloat(row.querySelector('.item-qty').value),
                price: parseFloat(row.querySelector('.item-price').value),
                amount: parseFloat(row.querySelector('.item-amount').value)
            });
        });

        const grandTotal = parseFloat(document.getElementById('inv_grandTotal').value);
        const advanceReceived = parseFloat(document.getElementById('inv_advance').value);
        const balance = parseFloat(document.getElementById('inv_balance').value);

        let status = 'Issued';
        if (balance <= 0) status = 'Fully Paid';
        else if (advanceReceived > 0) status = 'Partially Paid';

        const invData = {
            id: id,
            date: document.getElementById('inv_date').value,
            dueDate: document.getElementById('inv_dueDate').value,
            orderId: document.getElementById('inv_orderId').value,
            customerName: document.getElementById('inv_customerName').value,
            customerPhone: document.getElementById('inv_customerPhone').value,
            billingAddress: document.getElementById('inv_billingAddress').value,
            notes: document.getElementById('inv_notes').value,
            terms: document.getElementById('inv_terms').value,
            subtotal: parseFloat(document.getElementById('inv_subtotal').value),
            discount: parseFloat(document.getElementById('inv_discount').value),
            vatAmount: parseFloat(document.getElementById('inv_tax').value),
            grandTotal: grandTotal,
            advanceReceived: advanceReceived,
            balance: balance,
            items: items,
            status: status,
            payments: advanceReceived > 0 ? [{ date: new Date().toISOString().split('T')[0], amount: advanceReceived, method: 'Advance Payment', reference: 'Initial Deposit' }] : [],
            timeline: [{ title: 'Invoice Issued', date: new Date().toLocaleString(), user: 'Accounts Dept' }]
        };

        this.invoices.unshift(invData);
        this.saveInvoices();
        alert(`Invoice ${id} saved successfully!`);
        this.renderDetail(id);
    }

    renderDetail(id) {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;
        const inv = this.invoices.find(x => x.id === id);
        if (!inv) return;

        const isPaid = inv.balance <= 0;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">Invoice Detail: ${inv.id}</h2>
                    <p class="text-muted small mb-0">Customer: <strong>${inv.customerName}</strong> &nbsp;|&nbsp; Due Date: <strong>${inv.dueDate}</strong></p>
                </div>
                <div>
                    <button class="btn btn-outline-secondary me-2" onclick="window.invoiceModule.render()"><i class="fas fa-arrow-left me-1"></i> Back to Invoices</button>
                    ${!isPaid ? `<button class="btn btn-success me-2" onclick="window.invoiceModule.quickPay('${inv.id}')"><i class="fas fa-money-bill-wave me-1"></i> Record Payment</button>` : ''}
                    <button class="btn btn-primary" onclick="window.invoiceModule.printInvoice('${inv.id}')"><i class="fas fa-print me-1"></i> Print Invoice</button>
                </div>
            </div>

            <!-- Printable Commercial Invoice Card -->
            <div class="card p-5 mb-4" id="printable-invoice" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                <!-- Header with White ALUGRADE Logo Container -->
                <div class="d-flex justify-content-between align-items-center pb-4 border-bottom mb-4">
                    <div class="d-flex align-items-center gap-3">
                        <div style="background: #ffffff; padding: 10px 16px; border-radius: 12px; border: 1px solid var(--color-border);">
                            <img src="assets/logo/logo.png" alt="ALUGRADE Logo" style="height: 60px; object-fit: contain;">
                        </div>
                        <div>
                            <h4 class="font-bold mb-0 text-main" style="color: var(--color-brand-red);">ALUGRADE LANKA FAB & GLASS</h4>
                            <p class="text-muted small mb-0">High-End Architectural Aluminium & Toughened Glass Fabrication</p>
                            <p class="text-muted small mb-0">No. 128, High Level Road, Homagama &nbsp;|&nbsp; Tel: 077 123 4567 / 011 234 5678</p>
                        </div>
                    </div>
                    <div class="text-end">
                        <h3 class="font-bold text-primary mb-1">TAX INVOICE</h3>
                        <div class="fs-5 font-bold text-main">${inv.id}</div>
                        <span class="badge ${isPaid?'bg-success':'bg-warning text-dark'} font-bold mt-1">${inv.status}</span>
                    </div>
                </div>

                <!-- Customer & Invoice Metadata -->
                <div class="row g-4 mb-4">
                    <div class="col-md-6 border-end">
                        <h6 class="font-bold text-main uppercase small mb-2">Billed To Customer:</h6>
                        <h5 class="font-bold text-main mb-1">${inv.customerName}</h5>
                        <p class="small text-muted mb-1"><i class="fas fa-phone me-1"></i> Phone: ${inv.customerPhone || 'N/A'}</p>
                        <p class="small text-muted mb-0"><i class="fas fa-map-marker-alt me-1"></i> Billing Address: ${inv.billingAddress || 'N/A'}</p>
                    </div>
                    <div class="col-md-6 ps-4">
                        <h6 class="font-bold text-main uppercase small mb-2">Invoice Summary Metadata:</h6>
                        <div class="d-flex justify-content-between small mb-1">
                            <span class="text-muted">Invoice Date:</span>
                            <strong>${inv.date}</strong>
                        </div>
                        <div class="d-flex justify-content-between small mb-1">
                            <span class="text-muted">Payment Due Date:</span>
                            <strong class="text-primary">${inv.dueDate}</strong>
                        </div>
                        <div class="d-flex justify-content-between small mb-0">
                            <span class="text-muted">Order / Delivery Ref:</span>
                            <strong>${inv.orderId || '-'} (${inv.dnRef || ''})</strong>
                        </div>
                    </div>
                </div>

                <!-- Itemized Pricing Table -->
                <h6 class="font-bold text-main uppercase small mb-2">Fabrication Items & Services:</h6>
                <div class="table-responsive mb-4">
                    <table class="table table-bordered align-middle text-sm mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>#</th>
                                <th>Item & Description</th>
                                <th>Qty</th>
                                <th class="text-end">Unit Price (LKR)</th>
                                <th class="text-end">Amount (LKR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${inv.items.map((item, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td>
                                        <strong>${item.description}</strong>
                                        ${item.details ? `<div class="small text-muted">${item.details}</div>` : ''}
                                    </td>
                                    <td>${item.qty}</td>
                                    <td class="text-end">LKR ${item.price.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                                    <td class="text-end"><strong>LKR ${item.amount.toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Financial Totals Summary -->
                <div class="row g-4 mb-4">
                    <div class="col-md-7">
                        <div class="p-3 bg-light rounded" style="border: 1px solid var(--color-border);">
                            <small class="font-bold text-main">Notes & Terms:</small>
                            <p class="small text-muted mb-0 mt-1">${inv.notes}</p>
                            <p class="small text-muted mb-0 mt-1">${inv.terms}</p>
                        </div>
                    </div>
                    <div class="col-md-5 text-end">
                        <div class="d-flex justify-content-between py-1 small">
                            <span>Subtotal:</span>
                            <span>LKR ${(inv.subtotal || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-1 small text-muted">
                            <span>Discount:</span>
                            <span>- LKR ${(inv.discount || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-1 small">
                            <span>VAT (18%):</span>
                            <span>LKR ${(inv.vatAmount || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-top border-bottom fs-5 font-bold my-1">
                            <span>Grand Total:</span>
                            <span class="text-primary">LKR ${(inv.grandTotal || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-1 small text-success font-medium">
                            <span>Paid Amount / Advance:</span>
                            <span>LKR ${(inv.advanceReceived || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2 fs-5 font-bold text-danger">
                            <span>Balance Due:</span>
                            <span>LKR ${(inv.balance || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                        </div>
                    </div>
                </div>

                <!-- Managing Director Signature Block -->
                <div class="row g-4 pt-4 border-top">
                    <div class="col-md-6">
                        <h6 class="font-bold text-main uppercase small mb-2">Payment Methods Accepted:</h6>
                        <p class="small text-muted mb-0">Bank Transfer / Cheque / Cash Settlement<br>Account Name: ALUGRADE LANKA FAB & GLASS<br>Bank: Commercial Bank Homagama (Acc: 8941205561)</p>
                    </div>

                    <div class="col-md-6 text-end">
                        <div class="d-inline-block text-center pt-2">
                            <div style="height: 50px;">
                                <img src="assets/signature/signature.png" alt="Signature" style="height: 45px; object-fit: contain;">
                            </div>
                            <div style="width: 220px; border-top: 1.5px solid var(--color-brand-charcoal); margin: 6px auto;"></div>
                            <div class="font-bold small text-main" style="font-family: 'Poppins', sans-serif;">MR. M. U. RAJAPAKSHA</div>
                            <div class="small text-muted" style="font-family: 'Montserrat', sans-serif;">Managing Director</div>
                            <div class="small text-muted" style="font-family: 'Poppins', sans-serif;">ALUGRADE LANKA FAB & GLASS</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    quickPay(id) {
        const inv = this.invoices.find(x => x.id === id);
        if (!inv) return;

        const amountStr = prompt(`Record payment for Invoice ${inv.id}.\nBalance Due: LKR ${inv.balance.toLocaleString('en-US', {minimumFractionDigits:2})}`, inv.balance);
        if (amountStr !== null) {
            const amount = parseFloat(amountStr);
            if (!isNaN(amount) && amount > 0) {
                inv.advanceReceived += amount;
                inv.balance = Math.max(0, inv.grandTotal - inv.advanceReceived);
                
                if (inv.balance <= 0) inv.status = 'Fully Paid';
                else inv.status = 'Partially Paid';

                inv.payments.push({
                    date: new Date().toISOString().split('T')[0],
                    amount: amount,
                    method: 'Bank Transfer / Cheque',
                    reference: 'Customer Payment Entry'
                });

                inv.timeline.push({
                    title: `Payment Received: LKR ${amount.toLocaleString('en-US', {minimumFractionDigits:2})}`,
                    date: new Date().toLocaleString(),
                    user: 'Accounts Dept'
                });

                this.saveInvoices();
                alert(`Payment of LKR ${amount.toLocaleString('en-US', {minimumFractionDigits:2})} recorded successfully!`);
                this.render();
            }
        }
    }

    printInvoice(id) {
        window.print();
    }

    exportListExcel() {
        let csv = "Invoice#,Customer,Order#,Date,Due Date,Total,Paid,Balance,Status\n";
        this.invoices.forEach(i => {
            csv += `${i.id},"${i.customerName}",${i.orderId || '-'},${i.date},${i.dueDate},${i.grandTotal},${i.advanceReceived},${i.balance},${i.status}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ALUGRADE_Invoices_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

if (typeof window !== 'undefined') {
    window.InvoiceModule = InvoiceModule;
}
