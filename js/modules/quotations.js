class QuotationModule {
    constructor(containerId) {
        this.containerId = containerId || 'pageContent';
        this.quotations = this.loadQuotations();
    }

    loadQuotations() {
        const data = localStorage.getItem('alugrade_quotations');
        if (data) {
            try { return JSON.parse(data); } catch(e) { return []; }
        }
        return [
            {
                id: 'QTN-2026-0001',
                date: '2026-07-31',
                validUntil: '2026-08-30',
                salesRep: 'Samantha Perera',
                customerId: 'CUST-001',
                customerName: 'Jayasinghe Construction (Pvt) Ltd',
                customerPhone: '0771234567',
                customerEmail: 'info@jayasinghe.lk',
                billingAddress: 'No. 45, Galle Road, Colombo 03',
                siteAddress: 'Homagama Commercial Complex Site, Diyagama Road, Homagama',
                projectName: 'Homagama Luxury Villa & Office Complex',
                deliveryPeriod: '2-3 Weeks',
                paymentTerms: '50% Advance upon order confirmation, 50% upon completion',
                installation: 'Yes',
                transportation: 'Yes',
                warranty: '10 Years for Aluminium Profiles, 2 Years for Hardware',
                notes: 'Custom powder coated matt black finish required for all exterior casement windows.',
                terms: '1. Prices are valid for 30 days from quotation date.\n2. Any variation in dimensions or site conditions will be adjusted in final invoice.\n3. Site readiness (opening clearing) is customer responsibility.',
                preparedBy: 'Admin User',
                salesRepName: 'Samantha Perera',
                subtotal: 450000.00,
                overallDiscount: 15000.00,
                vatPct: 18.00,
                vatAmount: 78300.00,
                grandTotal: 513300.00,
                advance: 250000.00,
                balance: 263300.00,
                status: 'Approved',
                items: [
                    {
                        description: 'Aluminium Sliding Window 2-Track System',
                        alumSection: 'Sliding Window 2-Track (100mm)',
                        glassType: '6mm Tempered Clear Glass',
                        colour: 'Matt Black Powder Coated',
                        width: 1800,
                        height: 1500,
                        qty: 4,
                        sqft: 116.25,
                        unitPrice: 2200.00,
                        labour: 15000.00,
                        discount: 5000.00,
                        amount: 265750.00
                    },
                    {
                        description: 'Casement Door with Heavy Duty Friction Stay',
                        alumSection: 'Casement Door System (45mm)',
                        glassType: '8mm Tinted Blue Glass',
                        colour: 'Anodized Silver',
                        width: 900,
                        height: 2100,
                        qty: 2,
                        sqft: 40.69,
                        unitPrice: 3800.00,
                        labour: 12000.00,
                        discount: 2372.00,
                        amount: 164250.00
                    }
                ],
                timeline: [
                    { date: '2026-07-31T09:30:00Z', event: 'Quotation Created' },
                    { date: '2026-07-31T11:00:00Z', event: 'Quotation Approved by Client' }
                ]
            }
        ];
    }

    saveQuotations() {
        localStorage.setItem('alugrade_quotations', JSON.stringify(this.quotations));
    }

    generateId() {
        const year = new Date().getFullYear();
        const count = this.quotations.length + 1;
        return `QTN-${year}-${count.toString().padStart(4, '0')}`;
    }

    getStatusColor(status) {
        const colors = {
            'Draft': 'secondary',
            'Sent': 'info',
            'Approved': 'success',
            'Rejected': 'danger',
            'Expired': 'warning'
        };
        return colors[status] || 'secondary';
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Enterprise Quotations</h2>
                    <p class="text-muted small mb-0">Create, manage, and convert custom fabrication quotations for client projects</p>
                </div>
                <button class="btn btn-primary" onclick="window.quotationModule.renderNewForm()">
                    <i class="fas fa-plus me-1"></i> + New Quotation
                </button>
            </div>
            
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="card-body p-0">
                    <ul class="nav nav-tabs mb-3" id="quotationStatusTabs" style="border-bottom: 1px solid var(--color-border);">
                        <li class="nav-item"><a class="nav-link active font-medium" href="#" onclick="window.quotationModule.filterStatus('All', this)">All Quotations</a></li>
                        <li class="nav-item"><a class="nav-link font-medium" href="#" onclick="window.quotationModule.filterStatus('Draft', this)">Draft</a></li>
                        <li class="nav-item"><a class="nav-link font-medium" href="#" onclick="window.quotationModule.filterStatus('Sent', this)">Sent</a></li>
                        <li class="nav-item"><a class="nav-link font-medium" href="#" onclick="window.quotationModule.filterStatus('Approved', this)">Approved</a></li>
                        <li class="nav-item"><a class="nav-link font-medium" href="#" onclick="window.quotationModule.filterStatus('Rejected', this)">Rejected</a></li>
                        <li class="nav-item"><a class="nav-link font-medium" href="#" onclick="window.quotationModule.filterStatus('Expired', this)">Expired</a></li>
                    </ul>
                    
                    <div class="row mb-3 align-items-center">
                        <div class="col-md-5">
                            <div class="input-group">
                                <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                                <input type="text" id="quoteSearch" class="form-control border-start-0" placeholder="Search QTN#, Customer, Project Name..." onkeyup="window.quotationModule.search()">
                            </div>
                        </div>
                        <div class="col-md-7 text-end">
                            <button class="btn btn-outline-secondary me-2" onclick="window.quotationModule.exportListExcel()">
                                <i class="fas fa-file-excel text-success me-1"></i> Export Excel
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0" id="quotationsTable">
                            <thead class="table-light">
                                <tr>
                                    <th>QTN#</th>
                                    <th>Customer & Project</th>
                                    <th>Date</th>
                                    <th>Valid Until</th>
                                    <th>Sales Rep</th>
                                    <th>Items</th>
                                    <th>Grand Total</th>
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
            </div>
        `;
        container.innerHTML = html;
    }

    generateTableRows(statusFilter, searchQuery = '') {
        let filtered = this.quotations;
        if (statusFilter !== 'All') {
            filtered = filtered.filter(q => q.status === statusFilter);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(q => 
                (q.id && q.id.toLowerCase().includes(query)) || 
                (q.customerName && q.customerName.toLowerCase().includes(query)) ||
                (q.projectName && q.projectName.toLowerCase().includes(query))
            );
        }

        if (filtered.length === 0) {
            return `<tr><td colspan="9" class="text-center py-4 text-muted">No matching quotations found.</td></tr>`;
        }

        return filtered.map(q => `
            <tr>
                <td><strong class="text-primary">${q.id}</strong></td>
                <td>
                    <div class="font-semibold text-main">${q.customerName}</div>
                    <div class="small text-muted">${q.projectName || 'General Quotation'}</div>
                </td>
                <td>${q.date}</td>
                <td>${q.validUntil}</td>
                <td><span class="badge bg-light text-dark border">${q.salesRep || q.salesRepName || 'Sales Dept'}</span></td>
                <td>${q.items ? q.items.length : 0} items</td>
                <td><strong style="color: var(--color-brand-blue);">LKR ${parseFloat(q.grandTotal || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong></td>
                <td><span class="badge bg-${this.getStatusColor(q.status)}">${q.status}</span></td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="window.quotationModule.renderDetail('${q.id}')" title="View Details">View</button>
                        <button class="btn btn-outline-secondary" onclick="window.quotationModule.renderNewForm('${q.id}')" title="Edit">Edit</button>
                        <button class="btn btn-outline-info" onclick="window.quotationModule.printQuotation('${q.id}')" title="Print Document">Print</button>
                        ${q.status !== 'Approved' ? `<button class="btn btn-outline-success" onclick="window.quotationModule.approveQuotation('${q.id}')" title="Approve">Approve</button>` : ''}
                        ${q.status === 'Approved' ? `<button class="btn btn-success" onclick="window.quotationModule.convertToOrder('${q.id}')" title="Convert to Order">To Order</button>` : ''}
                        <button class="btn btn-outline-danger" onclick="window.quotationModule.delete('${q.id}')" title="Delete">Del</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    filterStatus(status, element) {
        document.querySelectorAll('#quotationStatusTabs .nav-link').forEach(el => el.classList.remove('active'));
        if(element) element.classList.add('active');
        document.querySelector('#quotationsTable tbody').innerHTML = this.generateTableRows(status, document.getElementById('quoteSearch').value);
    }

    search() {
        const activeTabEl = document.querySelector('#quotationStatusTabs .nav-link.active');
        const activeTab = activeTabEl ? activeTabEl.innerText.replace(' Quotations', '') : 'All';
        const query = document.getElementById('quoteSearch').value;
        document.querySelector('#quotationsTable tbody').innerHTML = this.generateTableRows(activeTab, query);
    }

    renderNewForm(editId = null) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        let q = editId ? this.quotations.find(x => x.id === editId) : null;
        const newId = editId ? q.id : this.generateId();
        const today = new Date().toISOString().split('T')[0];
        
        // 30 days default validity
        const validDate = new Date();
        validDate.setDate(validDate.getDate() + 30);
        const defaultValidStr = validDate.toISOString().split('T')[0];

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">${editId ? 'Edit Quotation' : 'New Enterprise Quotation'}</h2>
                    <p class="text-muted small mb-0">Fill in project details and specification line items below</p>
                </div>
                <button class="btn btn-outline-secondary" onclick="window.quotationModule.render()">
                    <i class="fas fa-arrow-left me-1"></i> Back to List
                </button>
            </div>

            <form id="quotationForm" onsubmit="event.preventDefault(); window.quotationModule.save();">
                <!-- Header Metadata Box -->
                <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="card-header bg-white p-0 pb-3 mb-3 border-bottom d-flex justify-content-between align-items-center">
                        <h5 class="font-bold text-main mb-0"><i class="fas fa-file-invoice text-primary me-2"></i> Quotation Header Information</h5>
                        <span class="badge bg-primary fs-6">${newId}</span>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label font-medium">Auto Quotation Number</label>
                            <input type="text" class="form-control bg-light font-bold" id="q_id" value="${newId}" readonly>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label font-medium">Quotation Date <span class="text-danger">*</span></label>
                            <input type="date" class="form-control" id="q_date" value="${q ? q.date : today}" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label font-medium">Valid Until Date <span class="text-danger">*</span></label>
                            <input type="date" class="form-control" id="q_validUntil" value="${q ? q.validUntil : defaultValidStr}" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label font-medium">Sales Representative</label>
                            <input type="text" class="form-control" id="q_salesRep" placeholder="e.g. Samantha Perera" value="${q ? (q.salesRep || q.salesRepName || '') : 'Samantha Perera'}">
                        </div>

                        <!-- Customer Selection & Search -->
                        <div class="col-md-6">
                            <label class="form-label font-medium">Customer Selection & Search <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="fas fa-user-tie text-muted"></i></span>
                                <input type="text" class="form-control" id="q_customerName" placeholder="Type customer or company name..." value="${q ? q.customerName : ''}" required list="customerListOptions">
                                <datalist id="customerListOptions">
                                    <option value="Jayasinghe Construction (Pvt) Ltd">
                                    <option value="Kottawa Villa Projects">
                                    <option value="Homagama Medical Complex">
                                    <option value="Maharagama Commercial Tower">
                                    <option value="Perera & Sons Residences">
                                </datalist>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label font-medium">Project Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="q_projectName" placeholder="e.g. Homagama Commercial Complex Site" value="${q ? (q.projectName || '') : ''}" required>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label font-medium">Phone Number</label>
                            <input type="text" class="form-control" id="q_customerPhone" placeholder="070 279 5702" value="${q ? q.customerPhone : ''}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label font-medium">Email Address</label>
                            <input type="email" class="form-control" id="q_customerEmail" placeholder="client@domain.com" value="${q ? (q.customerEmail || '') : ''}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label font-medium">Billing Address</label>
                            <input type="text" class="form-control" id="q_billingAddress" placeholder="Billing address" value="${q ? q.billingAddress : ''}">
                        </div>

                        <div class="col-md-12">
                            <label class="form-label font-medium">Site Address <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="q_siteAddress" placeholder="Full job location / site delivery address..." value="${q ? q.siteAddress : ''}" required>
                        </div>
                    </div>
                </div>

                <!-- Itemized Quotation Grid -->
                <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="card-header bg-white p-0 pb-3 mb-3 border-bottom d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="font-bold text-main mb-0"><i class="fas fa-th-list text-primary me-2"></i> Fabrication Specification Items</h5>
                            <p class="text-muted small mb-0">Each row auto calculates Square Feet (Width × Height) and total item charges</p>
                        </div>
                        <button type="button" class="btn btn-sm btn-primary" onclick="window.quotationModule.addItemRow()">
                            <i class="fas fa-plus me-1"></i> Add Specification Row
                        </button>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-bordered align-middle mb-0" id="q_itemsTable">
                            <thead class="table-light small uppercase">
                                <tr>
                                    <th style="min-width: 170px;">Price Master Item</th>
                                    <th style="min-width: 115px;">Profile Brand</th>
                                    <th style="min-width: 160px;">Item Description</th>
                                    <th style="min-width: 150px;">Aluminium Section</th>
                                    <th style="min-width: 140px;">Glass Type</th>
                                    <th style="min-width: 130px;">Colour / Finish</th>
                                    <th style="width: 90px;">Width (mm)</th>
                                    <th style="width: 90px;">Height (mm)</th>
                                    <th style="width: 65px;">Qty</th>
                                    <th style="width: 85px;">Sq.Ft (Auto)</th>
                                    <th style="width: 105px;">Unit Rate (LKR)</th>
                                    <th style="width: 95px;">Labour (LKR)</th>
                                    <th style="width: 80px;">Disc (LKR)</th>
                                    <th style="width: 115px;">Total (LKR)</th>
                                    <th style="width: 45px;"></th>
                                </tr>
                            </thead>
                            <tbody id="q_itemsBody">
                                <!-- Dynamic rows -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Terms, Additional Info & Totals Summary -->
                <div class="row g-4 mb-4">
                    <div class="col-md-7">
                        <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                            <h5 class="font-bold text-main mb-3"><i class="fas fa-info-circle text-primary me-2"></i> Commercial Terms & Project Scope</h5>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label font-medium">Delivery Period</label>
                                    <input type="text" class="form-control" id="q_deliveryPeriod" value="${q ? q.deliveryPeriod : '2-3 Weeks'}">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label font-medium">Payment Terms</label>
                                    <input type="text" class="form-control" id="q_paymentTerms" value="${q ? q.paymentTerms : '50% Advance, 50% on Completion'}">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label font-medium">Installation Included</label>
                                    <select class="form-select" id="q_installation">
                                        <option value="Yes" ${q && q.installation === 'Yes' ? 'selected' : ''}>Yes (Included)</option>
                                        <option value="No" ${q && q.installation === 'No' ? 'selected' : ''}>No (Supply Only)</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label font-medium">Transportation Included</label>
                                    <select class="form-select" id="q_transportation">
                                        <option value="Yes" ${q && q.transportation === 'Yes' ? 'selected' : ''}>Yes (Included)</option>
                                        <option value="No" ${q && q.transportation === 'No' ? 'selected' : ''}>No (Site Pickup)</option>
                                    </select>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label font-medium">Warranty Coverage</label>
                                    <input type="text" class="form-control" id="q_warranty" value="${q ? q.warranty : '10 Years for Aluminium Profiles, 2 Years for Accessories'}">
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label font-medium">Special Remarks & Notes</label>
                                    <textarea class="form-control" id="q_notes" rows="2">${q ? q.notes : ''}</textarea>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label font-medium">Professional Terms & Conditions</label>
                                    <textarea class="form-control" id="q_terms" rows="3">${q ? q.terms : '1. Prices are valid for 30 days from quotation date.\n2. Any variation in dimensions or site conditions will be adjusted in final invoice.\n3. Site readiness (opening clearing) is customer responsibility.'}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Auto Calculation Totals Summary Box -->
                    <div class="col-md-5">
                        <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                            <h5 class="font-bold text-main mb-3"><i class="fas fa-calculator text-primary me-2"></i> Financial Summary (Auto Calculated)</h5>
                            
                            <div class="mb-3 d-flex justify-content-between align-items-center">
                                <span class="font-medium text-muted">Subtotal (LKR)</span>
                                <input type="number" step="0.01" class="form-control w-50 text-end font-bold bg-light" id="q_subtotal" value="${q ? q.subtotal : '0.00'}" readonly>
                            </div>

                            <div class="mb-3 d-flex justify-content-between align-items-center">
                                <span class="font-medium text-muted">Overall Discount (LKR)</span>
                                <input type="number" step="0.01" class="form-control w-50 text-end" id="q_overallDiscount" value="${q ? q.overallDiscount : '0.00'}" oninput="window.quotationModule.calculateTotals()">
                            </div>

                            <div class="mb-3 d-flex justify-content-between align-items-center">
                                <span class="font-medium text-muted">VAT Rate (%)</span>
                                <div class="input-group w-50">
                                    <input type="number" step="0.1" class="form-control text-end" id="q_vatPct" value="${q ? (q.vatPct !== undefined ? q.vatPct : 18.0) : 18.0}" oninput="window.quotationModule.calculateTotals()">
                                    <span class="input-group-text">%</span>
                                </div>
                            </div>

                            <div class="mb-3 d-flex justify-content-between align-items-center">
                                <span class="font-medium text-muted">VAT Amount (LKR)</span>
                                <input type="number" step="0.01" class="form-control w-50 text-end font-bold bg-light" id="q_vatAmount" value="${q ? (q.vatAmount || '0.00') : '0.00'}" readonly>
                            </div>

                            <hr style="border-color: var(--color-border);">

                            <div class="mb-3 d-flex justify-content-between align-items-center">
                                <span class="font-bold fs-5 text-main">Grand Total (LKR)</span>
                                <input type="number" step="0.01" class="form-control w-50 text-end font-bold fs-5 text-primary bg-light" id="q_grandTotal" value="${q ? q.grandTotal : '0.00'}" readonly>
                            </div>

                            <div class="mb-3 d-flex justify-content-between align-items-center">
                                <span class="font-medium text-muted">Advance Deposit (LKR)</span>
                                <input type="number" step="0.01" class="form-control w-50 text-end" id="q_advance" value="${q ? q.advance : '0.00'}" oninput="window.quotationModule.calculateTotals()">
                            </div>

                            <div class="mb-3 d-flex justify-content-between align-items-center">
                                <span class="font-bold text-dark">Remaining Balance (LKR)</span>
                                <input type="number" step="0.01" class="form-control w-50 text-end font-bold bg-light" id="q_balance" value="${q ? q.balance : '0.00'}" readonly>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Footer -->
                <div class="card p-3 mb-5 d-flex flex-row justify-content-between align-items-center" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                    <div class="text-muted small">
                        Prepared By: <strong>${q ? q.preparedBy : 'Admin User'}</strong>
                    </div>
                    <div>
                        <button type="button" class="btn btn-outline-secondary me-2" onclick="window.quotationModule.render()">Cancel</button>
                        <button type="submit" class="btn btn-success px-4">
                            <i class="fas fa-save me-1"></i> Save Quotation
                        </button>
                    </div>
                </div>
            </form>
        `;
        container.innerHTML = html;

        if (q && q.items && q.items.length > 0) {
            q.items.forEach(item => this.addItemRow(item));
        } else {
            this.addItemRow();
        }
    }

    addItemRow(item = {}) {
        const tbody = document.getElementById('q_itemsBody');
        if (!tbody) return;
        const rowId = 'row_' + Date.now() + Math.floor(Math.random() * 1000);
        const tr = document.createElement('tr');
        tr.id = rowId;
        tr.className = 'align-top';

        const priceList = window.priceListModule ? window.priceListModule.items : (JSON.parse(localStorage.getItem('alugrade_pricelist')) || []);
        const priceOptions = priceList.map(p => {
            const tot = (parseFloat(p.materialCost)||0) + (parseFloat(p.labourCost)||0) + (parseFloat(p.defaultRate)||0);
            const isSel = item.priceMasterId === p.id || item.description === p.productName;
            return `<option value="${p.id}" ${isSel ? 'selected' : ''}>${p.category.split(' ')[0]} | ${p.productName}</option>`;
        }).join('');

        const currentBrand = item.brand || 'Alumex';

        tr.innerHTML = `
            <td>
                <select class="form-select form-select-sm item-price-master-select" onchange="window.quotationModule.onProductSelect('${rowId}')">
                    <option value="">-- Select Rate Item --</option>
                    ${priceOptions}
                </select>
                <div class="item-price-warning text-danger font-medium mt-1" style="font-size:11px;display:none;">
                    ⚠️ Rate missing from Price Master
                </div>
            </td>
            <td>
                <select class="form-select form-select-sm item-brand-select" onchange="window.quotationModule.onProductSelect('${rowId}')">
                    <option value="Alumex" ${currentBrand === 'Alumex' ? 'selected' : ''}>Alumex</option>
                    <option value="SwissTek" ${currentBrand === 'SwissTek' ? 'selected' : ''}>SwissTek</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-control form-control-sm item-desc" placeholder="e.g. Sliding Door 2-Track" value="${item.description || ''}" required>
            </td>
            <td>
                <select class="form-select form-select-sm item-alum-section">
                    <option value="Sliding Window 2-Track (100mm)" ${item.alumSection === 'Sliding Window 2-Track (100mm)' ? 'selected' : ''}>Sliding Window 2-Track (100mm)</option>
                    <option value="Sliding Door 2-Track (100mm)" ${item.alumSection === 'Sliding Door 2-Track (100mm)' ? 'selected' : ''}>Sliding Door 2-Track (100mm)</option>
                    <option value="Casement Window (45mm)" ${item.alumSection === 'Casement Window (45mm)' ? 'selected' : ''}>Casement Window (45mm)</option>
                    <option value="Casement Door System (45mm)" ${item.alumSection === 'Casement Door System (45mm)' ? 'selected' : ''}>Casement Door System (45mm)</option>
                    <option value="Shopfront Framing (100mm)" ${item.alumSection === 'Shopfront Framing (100mm)' ? 'selected' : ''}>Shopfront Framing (100mm)</option>
                    <option value="Curtain Wall System (150mm)" ${item.alumSection === 'Curtain Wall System (150mm)' ? 'selected' : ''}>Curtain Wall System (150mm)</option>
                    <option value="Fixed Light Panel" ${item.alumSection === 'Fixed Light Panel' ? 'selected' : ''}>Fixed Light Panel</option>
                    <option value="Custom Special Profile" ${item.alumSection === 'Custom Special Profile' ? 'selected' : ''}>Custom Special Profile</option>
                </select>
            </td>
            <td>
                <select class="form-select form-select-sm item-glass-type">
                    <option value="5mm Clear Float Glass" ${item.glassType === '5mm Clear Float Glass' ? 'selected' : ''}>5mm Clear Float Glass</option>
                    <option value="6mm Tempered Clear Glass" ${item.glassType === '6mm Tempered Clear Glass' ? 'selected' : ''}>6mm Tempered Clear Glass</option>
                    <option value="8mm Tinted Blue Glass" ${item.glassType === '8mm Tinted Blue Glass' ? 'selected' : ''}>8mm Tinted Blue Glass</option>
                    <option value="8mm Tinted Dark Grey" ${item.glassType === '8mm Tinted Dark Grey' ? 'selected' : ''}>8mm Tinted Dark Grey</option>
                    <option value="10mm Tempered Clear" ${item.glassType === '10mm Tempered Clear' ? 'selected' : ''}>10mm Tempered Clear</option>
                    <option value="12mm Laminated Clear" ${item.glassType === '12mm Laminated Clear' ? 'selected' : ''}>12mm Laminated Clear</option>
                    <option value="Double Glazed (5+6+5)" ${item.glassType === 'Double Glazed (5+6+5)' ? 'selected' : ''}>Double Glazed (5+6+5)</option>
                    <option value="None / Aluminum Panel" ${item.glassType === 'None / Aluminum Panel' ? 'selected' : ''}>None / Aluminum Panel</option>
                </select>
            </td>
            <td>
                <select class="form-select form-select-sm item-colour">
                    <option value="Matt Black Powder Coated" ${item.colour === 'Matt Black Powder Coated' ? 'selected' : ''}>Matt Black Powder Coated</option>
                    <option value="Powder Coated White" ${item.colour === 'Powder Coated White' ? 'selected' : ''}>Powder Coated White</option>
                    <option value="Anodized Silver" ${item.colour === 'Anodized Silver' ? 'selected' : ''}>Anodized Silver</option>
                    <option value="Charcoal Dark Grey" ${item.colour === 'Charcoal Dark Grey' ? 'selected' : ''}>Charcoal Dark Grey</option>
                    <option value="Wood Grain Premium Finish" ${item.colour === 'Wood Grain Premium Finish' ? 'selected' : ''}>Wood Grain Premium Finish</option>
                    <option value="Custom RAL Color" ${item.colour === 'Custom RAL Color' ? 'selected' : ''}>Custom RAL Color</option>
                </select>
            </td>
            <td>
                <input type="number" step="1" class="form-control form-control-sm item-width text-end" placeholder="mm" value="${item.width || 1000}" oninput="window.quotationModule.calcRow('${rowId}')" required>
            </td>
            <td>
                <input type="number" step="1" class="form-control form-control-sm item-height text-end" placeholder="mm" value="${item.height || 1000}" oninput="window.quotationModule.calcRow('${rowId}')" required>
            </td>
            <td>
                <input type="number" step="1" class="form-control form-control-sm item-qty text-end" value="${item.qty || 1}" oninput="window.quotationModule.calcRow('${rowId}')" required>
            </td>
            <td>
                <input type="number" step="0.01" class="form-control form-control-sm item-sqft text-end bg-light font-medium" value="${item.sqft || '10.76'}" readonly>
            </td>
            <td>
                <input type="number" step="0.01" class="form-control form-control-sm item-price text-end font-bold" placeholder="LKR" value="${item.unitPrice || item.price || 2200}" oninput="window.quotationModule.calcRow('${rowId}')" required>
            </td>
            <td>
                <input type="number" step="0.01" class="form-control form-control-sm item-labour text-end" placeholder="0" value="${item.labour || 0}" oninput="window.quotationModule.calcRow('${rowId}')">
            </td>
            <td>
                <input type="number" step="0.01" class="form-control form-control-sm item-disc text-end" placeholder="0" value="${item.discount || 0}" oninput="window.quotationModule.calcRow('${rowId}')">
            </td>
            <td>
                <input type="number" step="0.01" class="form-control form-control-sm item-amount text-end font-bold bg-light" value="${item.amount || 0}" readonly>
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-outline-danger border-0" onclick="this.closest('tr').remove(); window.quotationModule.calculateTotals();" title="Remove Row">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);

        if (item.priceMasterId) {
            this.onProductSelect(rowId);
        } else {
            this.calcRow(rowId);
        }
    }

    onProductSelect(rowId) {
        const row = document.getElementById(rowId);
        if (!row) return;

        const priceSelect = row.querySelector('.item-price-master-select');
        const brandSelect = row.querySelector('.item-brand-select');
        const warningBadge = row.querySelector('.item-price-warning');
        const priceId = priceSelect ? priceSelect.value : '';
        const selectedBrand = brandSelect ? brandSelect.value : 'Alumex';

        if (!priceId) {
            if (warningBadge) {
                warningBadge.style.display = 'block';
                warningBadge.innerText = '⚠️ No Price Master rate selected';
            }
            this.calcRow(rowId);
            return;
        }

        let priceItem = null;
        if (window.priceListModule) {
            priceItem = window.priceListModule.getItemById(priceId);
        } else {
            const stored = JSON.parse(localStorage.getItem('alugrade_pricelist') || '[]');
            priceItem = stored.find(i => i.id === priceId);
        }

        if (!priceItem) {
            if (warningBadge) {
                warningBadge.style.display = 'block';
                warningBadge.innerText = '⚠️ Rate missing from Price Master';
            }
        } else {
            if (warningBadge) warningBadge.style.display = 'none';

            const descInput = row.querySelector('.item-desc');
            if (descInput && !descInput.value.trim()) {
                descInput.value = priceItem.productName;
            }

            let matCost = parseFloat(priceItem.materialCost) || 0;
            let labCost = parseFloat(priceItem.labourCost) || 0;
            let defRate = parseFloat(priceItem.defaultRate) || 0;

            if (priceItem.brands && priceItem.brands[selectedBrand]) {
                matCost = parseFloat(priceItem.brands[selectedBrand].materialCost) || 0;
                labCost = parseFloat(priceItem.brands[selectedBrand].labourCost) || 0;
                defRate = parseFloat(priceItem.brands[selectedBrand].defaultRate) || 0;
            }

            const totalRate = matCost + labCost + defRate;
            if (row.querySelector('.item-price')) row.querySelector('.item-price').value = totalRate.toFixed(2);
            if (row.querySelector('.item-labour')) row.querySelector('.item-labour').value = labCost.toFixed(2);
        }

        this.calcRow(rowId);
    }

    calcRow(rowId) {
        const row = document.getElementById(rowId);
        if (!row) return;

        const priceSelect = row.querySelector('.item-price-master-select');
        const warningBadge = row.querySelector('.item-price-warning');
        const priceId = priceSelect ? priceSelect.value : '';

        if (!priceId && priceSelect) {
            if (warningBadge) {
                warningBadge.style.display = 'block';
                warningBadge.innerText = '⚠️ No Price Master rate selected';
            }
        } else if (warningBadge) {
            warningBadge.style.display = 'none';
        }

        const w = parseFloat(row.querySelector('.item-width').value) || 0;
        const h = parseFloat(row.querySelector('.item-height').value) || 0;
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const unitPrice = parseFloat(row.querySelector('.item-price').value) || 0;
        const labour = parseFloat(row.querySelector('.item-labour').value) || 0;
        const disc = parseFloat(row.querySelector('.item-disc').value) || 0;

        // Auto calculate Square Feet: (W_mm * H_mm / 92903.04) * Qty
        let sqft = 0;
        if (w > 0 && h > 0) {
            sqft = (w * h / 92903.04) * qty;
        }

        row.querySelector('.item-sqft').value = sqft.toFixed(2);

        // Total Line Amount = (sqft * unitPrice) + labour - discount
        let total = (sqft * unitPrice) + labour - disc;
        if (total < 0) total = 0;

        row.querySelector('.item-amount').value = total.toFixed(2);
        this.calculateTotals();
    }

    calculateTotals() {
        let subtotal = 0;
        document.querySelectorAll('.item-amount').forEach(el => {
            subtotal += parseFloat(el.value) || 0;
        });

        const q_subtotal = document.getElementById('q_subtotal');
        if (q_subtotal) q_subtotal.value = subtotal.toFixed(2);

        const overallDisc = parseFloat(document.getElementById('q_overallDiscount')?.value) || 0;
        const vatPct = parseFloat(document.getElementById('q_vatPct')?.value) || 0;

        const netAfterDiscount = Math.max(0, subtotal - overallDisc);
        const vatAmount = netAfterDiscount * (vatPct / 100);

        const q_vatAmount = document.getElementById('q_vatAmount');
        if (q_vatAmount) q_vatAmount.value = vatAmount.toFixed(2);

        const grandTotal = netAfterDiscount + vatAmount;
        const q_grandTotal = document.getElementById('q_grandTotal');
        if (q_grandTotal) q_grandTotal.value = grandTotal.toFixed(2);

        const advance = parseFloat(document.getElementById('q_advance')?.value) || 0;
        const balance = grandTotal - advance;
        const q_balance = document.getElementById('q_balance');
        if (q_balance) q_balance.value = balance.toFixed(2);
    }

    save() {
        const id = document.getElementById('q_id').value;

        const items = [];
        document.querySelectorAll('#q_itemsBody tr').forEach(row => {
            items.push({
                priceMasterId: row.querySelector('.item-price-master-select')?.value || '',
                brand: row.querySelector('.item-brand-select')?.value || 'Alumex',
                description: row.querySelector('.item-desc').value,
                alumSection: row.querySelector('.item-alum-section').value,
                glassType: row.querySelector('.item-glass-type').value,
                colour: row.querySelector('.item-colour').value,
                width: parseFloat(row.querySelector('.item-width').value) || 0,
                height: parseFloat(row.querySelector('.item-height').value) || 0,
                qty: parseFloat(row.querySelector('.item-qty').value) || 0,
                sqft: parseFloat(row.querySelector('.item-sqft').value) || 0,
                unitPrice: parseFloat(row.querySelector('.item-price').value) || 0,
                price: parseFloat(row.querySelector('.item-price').value) || 0,
                labour: parseFloat(row.querySelector('.item-labour').value) || 0,
                discount: parseFloat(row.querySelector('.item-disc').value) || 0,
                amount: parseFloat(row.querySelector('.item-amount').value) || 0
            });
        });

        const qData = {
            id: id,
            date: document.getElementById('q_date').value,
            validUntil: document.getElementById('q_validUntil').value,
            salesRep: document.getElementById('q_salesRep').value,
            salesRepName: document.getElementById('q_salesRep').value,
            customerName: document.getElementById('q_customerName').value,
            projectName: document.getElementById('q_projectName').value,
            customerPhone: document.getElementById('q_customerPhone').value,
            customerEmail: document.getElementById('q_customerEmail').value,
            billingAddress: document.getElementById('q_billingAddress').value,
            siteAddress: document.getElementById('q_siteAddress').value,
            deliveryPeriod: document.getElementById('q_deliveryPeriod').value,
            paymentTerms: document.getElementById('q_paymentTerms').value,
            installation: document.getElementById('q_installation').value,
            transportation: document.getElementById('q_transportation').value,
            warranty: document.getElementById('q_warranty').value,
            notes: document.getElementById('q_notes').value,
            terms: document.getElementById('q_terms').value,
            preparedBy: 'Admin User',
            subtotal: parseFloat(document.getElementById('q_subtotal').value) || 0,
            overallDiscount: parseFloat(document.getElementById('q_overallDiscount').value) || 0,
            vatPct: parseFloat(document.getElementById('q_vatPct').value) || 0,
            vatAmount: parseFloat(document.getElementById('q_vatAmount').value) || 0,
            grandTotal: parseFloat(document.getElementById('q_grandTotal').value) || 0,
            advance: parseFloat(document.getElementById('q_advance').value) || 0,
            balance: parseFloat(document.getElementById('q_balance').value) || 0,
            items: items,
            status: 'Draft',
            timeline: [{ date: new Date().toISOString(), event: 'Quotation Created' }]
        };

        const existingIndex = this.quotations.findIndex(x => x.id === id);
        if (existingIndex > -1) {
            qData.status = this.quotations[existingIndex].status;
            qData.timeline = this.quotations[existingIndex].timeline || [];
            qData.timeline.push({ date: new Date().toISOString(), event: 'Quotation Saved' });
            this.quotations[existingIndex] = qData;
        } else {
            this.quotations.push(qData);
        }

        this.saveQuotations();
        this.render();
    }

    renderDetail(id) {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        const q = this.quotations.find(x => x.id === id);
        if (!q) return;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">Quotation: ${q.id}</h2>
                    <p class="text-muted small mb-0">Detailed breakdown and export actions</p>
                </div>
                <div class="btn-group">
                    <button class="btn btn-outline-secondary" onclick="window.quotationModule.render()"><i class="fas fa-arrow-left me-1"></i> Back</button>
                    <button class="btn btn-outline-primary" onclick="window.quotationModule.renderNewForm('${q.id}')"><i class="fas fa-edit me-1"></i> Edit</button>
                    <button class="btn btn-info text-white" onclick="window.quotationModule.printQuotation('${q.id}')"><i class="fas fa-print me-1"></i> Print / Save PDF</button>
                    ${q.status !== 'Approved' ? `<button class="btn btn-success" onclick="window.quotationModule.approveQuotation('${q.id}')"><i class="fas fa-check me-1"></i> Approve</button>` : ''}
                    ${q.status === 'Approved' ? `<button class="btn btn-primary" onclick="window.quotationModule.convertToOrder('${q.id}')"><i class="fas fa-shopping-bag me-1"></i> Convert to Order</button>` : ''}
                </div>
            </div>

            <div class="row g-4">
                <div class="col-md-8">
                    <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                        <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                            <div>
                                <h4 class="font-bold mb-1">${q.customerName}</h4>
                                <p class="text-muted small mb-0">Project: <strong>${q.projectName || 'N/A'}</strong></p>
                            </div>
                            <span class="badge bg-${this.getStatusColor(q.status)} fs-6">${q.status}</span>
                        </div>

                        <div class="row g-3 mb-4">
                            <div class="col-sm-6">
                                <p class="mb-1"><strong>Sales Representative:</strong> ${q.salesRep || q.salesRepName || 'Sales Dept'}</p>
                                <p class="mb-1"><strong>Phone:</strong> ${q.customerPhone || 'N/A'}</p>
                                <p class="mb-1"><strong>Email:</strong> ${q.customerEmail || 'N/A'}</p>
                                <p class="mb-1"><strong>Billing Address:</strong> ${q.billingAddress || 'N/A'}</p>
                            </div>
                            <div class="col-sm-6">
                                <p class="mb-1"><strong>Quotation Date:</strong> ${q.date}</p>
                                <p class="mb-1"><strong>Valid Until Date:</strong> ${q.validUntil}</p>
                                <p class="mb-1"><strong>Site Address:</strong> ${q.siteAddress || 'N/A'}</p>
                            </div>
                        </div>

                        <h5 class="font-bold mb-3">Itemized Specifications</h5>
                        <div class="table-responsive mb-3">
                            <table class="table table-bordered align-middle text-sm mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th>Description</th>
                                        <th>Specs (Brand / Section / Glass / Colour)</th>
                                        <th>Size (W×H)</th>
                                        <th>Qty</th>
                                        <th>Sq.Ft</th>
                                        <th class="text-end">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${q.items.map(item => `
                                        <tr>
                                            <td><strong>${item.description}</strong></td>
                                            <td>
                                                <div class="small font-medium text-primary">Brand: ${item.brand || 'Alumex'} &nbsp;|&nbsp; Section: ${item.alumSection || '-'}</div>
                                                <div class="small text-muted">Glass: ${item.glassType || '-'} | Color: ${item.colour || '-'}</div>
                                            </td>
                                            <td>${item.width} × ${item.height} mm</td>
                                            <td>${item.qty}</td>
                                            <td>${item.sqft} sq.ft</td>
                                            <td class="text-end font-bold">LKR ${item.amount.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <div class="row justify-content-end">
                            <div class="col-sm-6">
                                <table class="table table-sm text-end mb-0">
                                    <tr><td>Subtotal:</td><td class="font-medium">LKR ${q.subtotal.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</td></tr>
                                    <tr><td>Discount:</td><td class="text-danger">- LKR ${q.overallDiscount.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</td></tr>
                                    <tr><td>VAT (${q.vatPct || 18}%):</td><td>+ LKR ${(q.vatAmount || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</td></tr>
                                    <tr class="table-light"><th class="fs-6">Grand Total:</th><th class="fs-6 text-primary">LKR ${q.grandTotal.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</th></tr>
                                    <tr><td>Advance Deposit:</td><td>LKR ${(q.advance || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</td></tr>
                                    <tr class="fw-bold"><td>Remaining Balance:</td><td class="text-danger">LKR ${q.balance.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</td></tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                        <h5 class="font-bold mb-3">Scope & Terms</h5>
                        <p class="small mb-1"><strong>Delivery Period:</strong> ${q.deliveryPeriod}</p>
                        <p class="small mb-1"><strong>Payment Terms:</strong> ${q.paymentTerms}</p>
                        <p class="small mb-1"><strong>Installation:</strong> ${q.installation}</p>
                        <p class="small mb-1"><strong>Transportation:</strong> ${q.transportation}</p>
                        <p class="small mb-1"><strong>Warranty:</strong> ${q.warranty}</p>
                    </div>

                    <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                        <h5 class="font-bold mb-3">Activity Audit Trail</h5>
                        <ul class="list-group list-group-flush small">
                            ${(q.timeline || []).map(t => `<li class="list-group-item px-0"><div class="text-muted small">${new Date(t.date).toLocaleString()}</div><strong>${t.event}</strong></li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    approveQuotation(id) {
        if (confirm(`Approve quotation ${id}?`)) {
            const index = this.quotations.findIndex(x => x.id === id);
            if (index > -1) {
                this.quotations[index].status = 'Approved';
                this.quotations[index].timeline = this.quotations[index].timeline || [];
                this.quotations[index].timeline.push({ date: new Date().toISOString(), event: 'Approved' });
                this.saveQuotations();
                this.renderDetail(id);
            }
        }
    }

    convertToOrder(id) {
        if (confirm(`Convert quotation ${id} to active Order?`)) {
            const index = this.quotations.findIndex(x => x.id === id);
            if (index > -1) {
                const q = this.quotations[index];
                if (window.orderModule) {
                    window.orderModule.createFromQuotation(q);
                    q.status = 'Approved';
                    q.timeline.push({ date: new Date().toISOString(), event: 'Converted to Production Order' });
                    this.saveQuotations();
                    alert('Successfully converted quotation into Production Order!');
                    this.renderDetail(id);
                } else {
                    alert('Order module active. Quotation ready for order processing.');
                }
            }
        }
    }

    delete(id) {
        if (confirm(`Are you sure you want to delete quotation ${id}?`)) {
            this.quotations = this.quotations.filter(x => x.id !== id);
            this.saveQuotations();
            this.render();
        }
    }

    renderPrintView(id) {
        const q = this.quotations.find(x => x.id === id);
        if (!q) return '';

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Quotation ${q.id} - ALUGRADE LANKA FAB & GLASS</title>
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
                        padding: 20px;
                        color: #0F172A;
                        background: #ffffff;
                        font-size: 11px;
                        line-height: 1.4;
                        position: relative;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    /* Watermark Logo */
                    .watermark {
                        position: fixed;
                        top: 45%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-20deg);
                        width: 360px;
                        opacity: 0.07;
                        pointer-events: none;
                        z-index: 0;
                    }

                    .content-wrapper {
                        position: relative;
                        z-index: 1;
                    }

                    /* Letterhead Header */
                    .header-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 2.5px solid #2563EB;
                        padding-bottom: 14px;
                        margin-bottom: 16px;
                    }
                    .logo-brand-wrap {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                    }
                    .logo-box {
                        background: #ffffff;
                        padding: 4px;
                        border-radius: 8px;
                        display: inline-block;
                    }
                    .logo-box img {
                        height: 68px;
                        width: auto;
                        object-fit: contain;
                    }
                    .company-title {
                        font-family: 'Montserrat', sans-serif;
                        font-size: 17px;
                        font-weight: 800;
                        color: #0F172A;
                        margin: 0;
                        letter-spacing: -0.02em;
                    }
                    .company-subtitle {
                        color: #2563EB;
                        font-size: 10px;
                        font-weight: 700;
                        margin: 2px 0 3px 0;
                        text-transform: uppercase;
                        letter-spacing: 0.03em;
                    }
                    .company-contacts {
                        color: #475569;
                        font-size: 9.5px;
                        margin: 0;
                        font-weight: 500;
                    }

                    .header-info-box {
                        text-align: right;
                    }
                    .doc-badge {
                        background: #2563EB;
                        color: #ffffff;
                        font-family: 'Montserrat', sans-serif;
                        font-size: 16px;
                        font-weight: 800;
                        padding: 4px 14px;
                        border-radius: 6px;
                        display: inline-block;
                        letter-spacing: 0.05em;
                        margin-bottom: 6px;
                    }
                    .meta-line {
                        margin: 2px 0;
                        font-size: 10.5px;
                        color: #334155;
                    }
                    .meta-line strong {
                        color: #0F172A;
                    }

                    /* Customer & Project Info Grid */
                    .info-grid {
                        display: flex;
                        gap: 14px;
                        margin-bottom: 16px;
                    }
                    .info-card {
                        flex: 1;
                        border: 1px solid #E2E8F0;
                        border-radius: 8px;
                        padding: 10px 14px;
                        background: #F8FAFC;
                    }
                    .info-card h4 {
                        margin: 0 0 6px 0;
                        color: #2563EB;
                        font-size: 11px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.04em;
                        border-bottom: 1px solid #E2E8F0;
                        padding-bottom: 4px;
                    }
                    .info-card-text {
                        font-size: 10.5px;
                        color: #334155;
                        line-height: 1.45;
                    }
                    .info-card-text strong {
                        color: #0F172A;
                    }

                    /* Specification Table */
                    table.spec-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 16px;
                    }
                    table.spec-table th {
                        background: #0F172A;
                        color: #ffffff;
                        font-size: 9.5px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.04em;
                        padding: 7px 8px;
                        border: 1px solid #0F172A;
                        text-align: left;
                    }
                    table.spec-table td {
                        border: 1px solid #CBD5E1;
                        padding: 7px 8px;
                        font-size: 10px;
                        color: #1E293B;
                        vertical-align: top;
                    }
                    table.spec-table tr:nth-child(even) td {
                        background: #F8FAFC;
                    }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }

                    /* Financial Summary & Commercial Scope */
                    .financial-wrapper {
                        display: flex;
                        gap: 14px;
                        margin-bottom: 16px;
                        page-break-inside: avoid;
                    }
                    .terms-box {
                        flex: 1;
                        border: 1px solid #E2E8F0;
                        border-radius: 8px;
                        padding: 10px 14px;
                        background: #F8FAFC;
                    }
                    .terms-box h4 {
                        margin: 0 0 6px 0;
                        color: #0F172A;
                        font-size: 11px;
                        font-weight: 700;
                        border-bottom: 1px solid #E2E8F0;
                        padding-bottom: 4px;
                    }
                    .terms-list {
                        font-size: 9.5px;
                        color: #475569;
                        line-height: 1.4;
                        margin: 0;
                        padding-left: 14px;
                    }
                    .terms-meta {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 6px;
                        margin-bottom: 8px;
                        font-size: 9.5px;
                    }

                    .totals-box {
                        width: 310px;
                        border: 1px solid #CBD5E1;
                        border-radius: 8px;
                        overflow: hidden;
                        background: #ffffff;
                    }
                    .totals-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 10.5px;
                    }
                    .totals-table td {
                        padding: 5px 10px;
                        border-bottom: 1px solid #F1F5F9;
                    }
                    .totals-table tr.grand-total-row td {
                        background: #2563EB;
                        color: #ffffff;
                        font-weight: 800;
                        font-size: 12.5px;
                        padding: 7px 10px;
                    }
                    .totals-table tr.balance-row td {
                        background: #FEF2F2;
                        color: #991B1B;
                        font-weight: 700;
                    }

                    /* Dual Signature Area */
                    .signature-area {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        margin-top: 24px;
                        padding-top: 10px;
                        page-break-inside: avoid;
                    }
                    .sig-block {
                        text-align: center;
                        width: 210px;
                    }
                    .sig-image-container {
                        height: 55px;
                        display: flex;
                        align-items: flex-end;
                        justify-content: center;
                        margin-bottom: 4px;
                    }
                    .sig-image-container img {
                        max-height: 52px;
                        width: auto;
                        object-fit: contain;
                    }
                    .sig-line-bar {
                        border-top: 1.5px solid #0F172A;
                        width: 100%;
                        margin: 4px 0 4px 0;
                    }
                    .sig-person-name {
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 700;
                        font-size: 11px;
                        color: #0F172A;
                    }
                    .sig-person-title {
                        font-size: 9.5px;
                        color: #475569;
                        font-weight: 600;
                    }
                    .sig-company-name {
                        font-size: 8.5px;
                        color: #64748B;
                    }

                    .stamp-box {
                        border: 1.5px dashed #94A3B8;
                        border-radius: 6px;
                        padding: 8px;
                        text-align: center;
                        color: #94A3B8;
                        font-size: 8.5px;
                        font-weight: 600;
                        width: 140px;
                        height: 50px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .document-footer {
                        text-align: center;
                        font-size: 8.5px;
                        color: #94A3B8;
                        margin-top: 20px;
                        border-top: 1px solid #E2E8F0;
                        padding-top: 6px;
                        font-weight: 500;
                    }

                    @media print {
                        body { padding: 0; margin: 0; }
                        .no-print { display: none !important; }
                        thead { display: table-header-group; }
                        tfoot { display: table-footer-group; }
                        tr { page-break-inside: avoid; }
                        .financial-wrapper, .signature-area { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>

                <!-- Watermark Background Logo -->
                <img src="assets/logo/logo.png" class="watermark" alt="Watermark" />

                <div class="content-wrapper">

                    <!-- Header Letterhead -->
                    <div class="header-container">
                        <div class="logo-brand-wrap">
                            <div class="logo-box">
                                <img src="assets/logo/logo.png" alt="ALUGRADE LANKA FAB & GLASS" />
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
                            <div class="meta-line"><strong>QTN No:</strong> ${q.id}</div>
                            <div class="meta-line"><strong>Date:</strong> ${q.date}</div>
                            <div class="meta-line"><strong>Valid Until:</strong> ${q.validUntil}</div>
                            <div class="meta-line"><strong>Sales Rep:</strong> ${q.salesRep || q.salesRepName || 'Samantha Perera'}</div>
                        </div>
                    </div>

                    <!-- Customer & Project Info Grid -->
                    <div class="info-grid">
                        <div class="info-card">
                            <h4>Client Information</h4>
                            <div class="info-card-text">
                                <strong>${q.customerName}</strong><br>
                                ${q.billingAddress ? q.billingAddress.replace(/\n/g, '<br>') : 'Address on Record'}<br>
                                <strong>Phone:</strong> ${q.customerPhone || 'N/A'}<br>
                                <strong>Email:</strong> ${q.customerEmail || 'N/A'}
                            </div>
                        </div>
                        <div class="info-card">
                            <h4>Project & Site Details</h4>
                            <div class="info-card-text">
                                <strong>Project:</strong> ${q.projectName || 'General Commercial Fabrication'}<br>
                                <strong>Site Location:</strong> ${q.siteAddress ? q.siteAddress.replace(/\n/g, '<br>') : 'Site Location'}<br>
                                <strong>Installation:</strong> ${q.installation || 'Included'} &nbsp;|&nbsp; <strong>Delivery:</strong> ${q.transportation || 'Included'}
                            </div>
                        </div>
                    </div>

                    <!-- Itemized Specifications Table -->
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
                            ${q.items.map((item, idx) => `
                                <tr>
                                    <td class="text-center" style="font-weight: 700;">${idx + 1}</td>
                                    <td>
                                        <strong style="color: #0F172A; font-size: 10.5px;">${item.description}</strong>
                                        <div style="color: #475569; font-size: 9px; margin-top: 2px;">
                                            Brand: <strong style="color: #2563EB;">${item.brand || 'Alumex'}</strong> &nbsp;|&nbsp;
                                            Section: <strong>${item.alumSection || '-'}</strong> &nbsp;|&nbsp;
                                            Glass: <strong>${item.glassType || '-'}</strong> &nbsp;|&nbsp;
                                            Finish: <strong>${item.colour || '-'}</strong>
                                        </div>
                                    </td>
                                    <td class="text-center">${item.width} × ${item.height} mm</td>
                                    <td class="text-center font-medium">${parseFloat(item.sqft || 0).toFixed(2)}</td>
                                    <td class="text-center font-medium">${item.qty}</td>
                                    <td class="text-right">${parseFloat(item.unitPrice || item.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td class="text-right" style="font-weight: 700;">${parseFloat(item.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <!-- Financial Summary & Commercial Scope -->
                    <div class="financial-wrapper">
                        <div class="terms-box">
                            <h4>Commercial Scope & Terms</h4>
                            <div class="terms-meta">
                                <div><strong>Delivery Period:</strong> ${q.deliveryPeriod || '2-3 Weeks'}</div>
                                <div><strong>Payment Terms:</strong> ${q.paymentTerms || '50% Advance'}</div>
                                <div><strong>Warranty:</strong> ${q.warranty || '10 Yrs Profiles / 2 Yrs Hardware'}</div>
                                <div><strong>Prepared By:</strong> ${q.preparedBy || 'Admin User'}</div>
                            </div>
                            <ol class="terms-list">
                                <li>Prices are valid for 30 days from quotation issue date.</li>
                                <li>Any variation in site structural opening dimensions will be adjusted on final billing.</li>
                                <li>Site readiness and opening clearing are customer responsibility prior to installation.</li>
                            </ol>
                            ${q.notes ? `<div style="margin-top: 6px; font-size: 9px; color: #1E293B;"><strong>Remarks:</strong> ${q.notes}</div>` : ''}
                        </div>

                        <div class="totals-box">
                            <table class="totals-table">
                                <tr>
                                    <td style="color: #475569;">Subtotal:</td>
                                    <td class="text-right font-medium">LKR ${parseFloat(q.subtotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td style="color: #475569;">Overall Discount:</td>
                                    <td class="text-right text-danger">- LKR ${parseFloat(q.overallDiscount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td style="color: #475569;">VAT (${q.vatPct !== undefined ? q.vatPct : 18}%):</td>
                                    <td class="text-right">+ LKR ${parseFloat(q.vatAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                                <tr class="grand-total-row">
                                    <td>Grand Total:</td>
                                    <td class="text-right">LKR ${parseFloat(q.grandTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td style="color: #475569;">Advance Deposit:</td>
                                    <td class="text-right">LKR ${parseFloat(q.advance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                                <tr class="balance-row">
                                    <td>Balance Payable:</td>
                                    <td class="text-right">LKR ${parseFloat(q.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <!-- Dual Signature Area -->
                    <div class="signature-area">
                        <div class="sig-block">
                            <div class="sig-image-container">
                                <img src="assets/signature/signature.png" alt="Authorized Signature" />
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

                    <!-- Document Footer -->
                    <div class="document-footer">
                        ALUGRADE LANKA FAB & GLASS &nbsp;•&nbsp; Commercial Enterprise System &nbsp;•&nbsp; Page 1 of 1
                    </div>

                </div>

            </body>
            </html>
        `;
    }

    printQuotation(id) {
        const html = this.renderPrintView(id);
        if (!html) return;
        const printWindow = window.open('', '_blank', 'width=900,height=950');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }

    exportPDF(id) {
        this.printQuotation(id);
    }

    exportListExcel() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "QTN#,Customer,Project,Date,Valid Until,Sales Rep,Items,Subtotal,Discount,VAT,Grand Total,Status\n";
        this.quotations.forEach(q => {
            csvContent += `${q.id},"${q.customerName}","${q.projectName || ''}",${q.date},${q.validUntil},"${q.salesRep || ''}",${q.items ? q.items.length : 0},${q.subtotal},${q.overallDiscount},${q.vatAmount},${q.grandTotal},${q.status}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `ALUGRADE_Quotations_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

window.QuotationModule = QuotationModule;
