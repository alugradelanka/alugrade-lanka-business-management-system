/**
 * Customer Management Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 */

class CustomerModule {
    constructor(db, eventsManager) {
        this.db = db || window.DB || {
            customers: [],
            orders: [],
            invoices: [],
            payments: [],
            quotations: []
        };
        this.events = eventsManager || window.Events || {
            trigger: (event, data) => console.log(`Event: ${event}`, data),
            emit: (event, data) => console.log(`Event: ${event}`, data)
        };
        this.districts = [
            "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
            "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
            "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
            "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
            "Moneragala", "Ratnapura", "Kegalle"
        ];
        this.customers = this.loadCustomers();
    }

    loadCustomers() {
        const stored = localStorage.getItem('alugrade_customers');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) { return []; }
        }
        
        // Seed default enterprise customer dataset with complete profiles
        const defaults = [
            {
                id: 'CUST-2026-0001',
                name: 'Jayasinghe Construction (Pvt) Ltd',
                company: 'Jayasinghe Commercial Projects',
                nicRegNo: 'PV-89412',
                phone: '0771234567',
                altPhone: '0112345678',
                email: 'info@jayasinghe.lk',
                city: 'Homagama',
                district: 'Colombo',
                billingAddress: 'No. 45, Galle Road, Colombo 03',
                siteAddress: 'Homagama Commercial Complex Site, Diyagama Road, Homagama',
                active: true,
                createdAt: '2026-01-15',
                notes: 'Key commercial contractor for multi-story aluminium partition and curtain wall fabrication.',
                history: [
                    { type: 'Quotation', ref: 'QTN-2026-0001', date: '2026-07-31', amount: 513300, status: 'Approved' },
                    { type: 'Order', ref: 'ORD-2026-0157', date: '2026-07-31', amount: 513300, status: 'In Production' },
                    { type: 'Invoice', ref: 'INV-2026-0142', date: '2026-07-31', amount: 485000, status: 'Partially Paid' },
                    { type: 'Payment', ref: 'PAY-2026-0098', date: '2026-07-31', amount: 260000, status: 'Confirmed' }
                ]
            },
            {
                id: 'CUST-2026-0002',
                name: 'Sunil Shantha Perera',
                company: 'Kottawa Villa Project Owner',
                nicRegNo: '197514209876',
                phone: '0755515862',
                altPhone: '0714455667',
                email: 'sunil.perera@gmail.com',
                city: 'Kottawa',
                district: 'Colombo',
                billingAddress: 'No. 12/B, Temple Road, Kottawa',
                siteAddress: 'Plot 4, Highlevel Road, Kottawa',
                active: true,
                createdAt: '2026-02-10',
                notes: 'Residential luxury villa construction requiring custom matt black sliding doors.',
                history: [
                    { type: 'Quotation', ref: 'QTN-2026-0004', date: '2026-07-28', amount: 320000, status: 'Approved' },
                    { type: 'Order', ref: 'ORD-2026-0140', date: '2026-07-29', amount: 320000, status: 'Completed' },
                    { type: 'Invoice', ref: 'INV-2026-0130', date: '2026-07-29', amount: 320000, status: 'Paid' },
                    { type: 'Payment', ref: 'PAY-2026-0085', date: '2026-07-29', amount: 320000, status: 'Confirmed' }
                ]
            },
            {
                id: 'CUST-2026-0003',
                name: 'Maharagama Medical Center',
                company: 'Healthcare Properties Sri Lanka',
                nicRegNo: 'PV-10492',
                phone: '0702795702',
                altPhone: '0112844556',
                email: 'admin@maharagamamedical.lk',
                city: 'Maharagama',
                district: 'Colombo',
                billingAddress: 'No. 88, Station Road, Maharagama',
                siteAddress: 'New Surgical Wing, Station Road, Maharagama',
                active: true,
                createdAt: '2026-03-05',
                notes: 'Hospital cleanroom aluminium partitions and toughened glass doors.',
                history: [
                    { type: 'Quotation', ref: 'QTN-2026-0008', date: '2026-07-25', amount: 890000, status: 'Sent' }
                ]
            }
        ];
        
        localStorage.setItem('alugrade_customers', JSON.stringify(defaults));
        return defaults;
    }

    saveCustomers() {
        localStorage.setItem('alugrade_customers', JSON.stringify(this.customers));
    }

    render() {
        const container = document.getElementById('pageContent') || document.getElementById('mainContent') || document.getElementById('main-content') || document.body;
        
        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Customer Directory & CRM</h2>
                    <p class="text-muted small mb-0">Manage customer accounts, NIC / Company Registration, site locations, and order history</p>
                </div>
                <button class="btn btn-primary" onclick="window.customerModule.renderNewForm()">
                    <i class="fas fa-user-plus me-1"></i> + New Customer Registration
                </button>
            </div>
            
            <!-- Summary Metric Cards -->
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid var(--color-brand-blue); border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Total Registered</div>
                        <h3 class="mb-0 font-bold text-main mt-1" id="stat-total-customers">${this.customers.length}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #10B981; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Active Accounts</div>
                        <h3 class="mb-0 font-bold text-success mt-1" id="stat-active-customers">${this.customers.filter(c => c.active).length}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #6366F1; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">New This Month</div>
                        <h3 class="mb-0 font-bold text-primary mt-1" id="stat-new-month">${this.customers.length}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #EF4444; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Total Receivables</div>
                        <h3 class="mb-0 font-bold text-danger mt-1" id="stat-total-outstanding">LKR 263,300.00</h3>
                    </div>
                </div>
            </div>

            <!-- Main Directory Card -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <!-- Search & Filters Bar -->
                <div class="row g-3 mb-3 align-items-center">
                    <div class="col-md-5">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                            <input type="text" id="customer-search" class="form-control border-start-0" placeholder="Search by name, phone, ID, NIC/BR, city..." onkeyup="window.customerModule.handleSearch()">
                        </div>
                    </div>

                    <div class="col-md-3">
                        <select id="district-filter" class="form-select" onchange="window.customerModule.handleSearch()">
                            <option value="">All Districts (Sri Lanka)</option>
                            ${this.districts.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>

                    <div class="col-md-2">
                        <select id="status-filter" class="form-select" onchange="window.customerModule.handleSearch()">
                            <option value="all">All Statuses</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div class="col-md-2 text-end">
                        <div class="btn-group">
                            <button class="btn btn-outline-secondary btn-sm" onclick="window.customerModule.exportPDF()"><i class="fas fa-file-pdf text-danger me-1"></i> PDF</button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="window.customerModule.exportExcel()"><i class="fas fa-file-excel text-success me-1"></i> Excel</button>
                        </div>
                    </div>
                </div>

                <!-- Professional Customer Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" id="customers-table">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Customer ID</th>
                                <th>Name & NIC / BR</th>
                                <th>Company / Business</th>
                                <th>Phone & Email</th>
                                <th>Location (City/District)</th>
                                <th>Orders</th>
                                <th>Outstanding Balance</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="customers-tbody">
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.loadCustomersData();
    }

    loadCustomersData() {
        const query = document.getElementById('customer-search')?.value || '';
        const districtFilter = document.getElementById('district-filter')?.value || '';
        const statusFilter = document.getElementById('status-filter')?.value || 'all';

        let filtered = this.customers;

        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(c => 
                (c.id && c.id.toLowerCase().includes(q)) ||
                (c.name && c.name.toLowerCase().includes(q)) ||
                (c.nicRegNo && c.nicRegNo.toLowerCase().includes(q)) ||
                (c.phone && c.phone.includes(q)) ||
                (c.company && c.company.toLowerCase().includes(q)) ||
                (c.city && c.city.toLowerCase().includes(q))
            );
        }

        if (districtFilter) {
            filtered = filtered.filter(c => c.district === districtFilter);
        }

        if (statusFilter === 'active') {
            filtered = filtered.filter(c => c.active);
        } else if (statusFilter === 'inactive') {
            filtered = filtered.filter(c => !c.active);
        }

        this.renderTableData(filtered);
    }

    renderTableData(customers) {
        const tbody = document.getElementById('customers-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        if (customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-muted">No customer records matching criteria.</td></tr>';
            return;
        }

        customers.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong class="text-primary">${c.id || 'N/A'}</strong></td>
                <td>
                    <div class="font-bold text-main">${c.name || 'N/A'}</div>
                    <div class="small text-muted"><i class="fas fa-id-card me-1"></i> ${c.nicRegNo || 'N/A'}</div>
                </td>
                <td>${c.company || '-'}</td>
                <td>
                    <div><i class="fas fa-phone small text-muted me-1"></i> ${c.phone || 'N/A'}</div>
                    <div class="small text-muted"><i class="fas fa-envelope me-1"></i> ${c.email || 'N/A'}</div>
                </td>
                <td>
                    <div>${c.city || 'N/A'}</div>
                    <div class="small text-muted">${c.district || ''}</div>
                </td>
                <td><span class="badge bg-light text-dark border">4 Orders</span></td>
                <td><strong class="text-danger">LKR 263,300.00</strong></td>
                <td><span class="badge ${c.active ? 'bg-success' : 'bg-danger'}">${c.active ? 'Active' : 'Inactive'}</span></td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" title="View Profile" onclick="window.customerModule.renderProfile('${c.id}')">View</button>
                        <button class="btn btn-outline-secondary" title="Edit" onclick="window.customerModule.renderEditForm('${c.id}')">Edit</button>
                        <button class="btn btn-outline-danger" title="Delete" onclick="window.customerModule.delete('${c.id}')">Del</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    handleSearch() {
        this.loadCustomersData();
    }

    renderNewForm() {
        this.renderFormModal();
    }

    renderEditForm(customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        if (customer) {
            this.renderFormModal(customer);
        } else {
            alert('Customer not found');
        }
    }

    renderFormModal(customer = null) {
        const isEdit = !!customer;
        const modalId = 'customerFormModal';
        
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const districtOptions = this.districts.map(d => 
            `<option value="${d}" ${customer && customer.district === d ? 'selected' : ''}>${d}</option>`
        ).join('');

        const newId = isEdit ? customer.id : 'CUST-' + new Date().getFullYear() + '-' + (this.customers.length + 1).toString().padStart(4, '0');

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="customerModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main" id="customerModalLabel">
                                <i class="fas fa-user-circle text-primary me-2"></i> ${isEdit ? 'Edit Customer Account' : 'New Customer Registration'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="customer-form">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Customer ID</label>
                                        <input type="text" class="form-control bg-light font-bold" name="id" value="${newId}" readonly>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Active Status</label>
                                        <div class="form-check form-switch mt-2">
                                            <input class="form-check-input" type="checkbox" name="active" ${(!customer || customer.active) ? 'checked' : ''}>
                                            <label class="form-check-label font-medium">Account Active</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Customer Full Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="name" placeholder="e.g. Sunil Shantha Perera" value="${customer?.name || ''}" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Company / Business Name</label>
                                        <input type="text" class="form-control" name="company" placeholder="e.g. Jayasinghe Construction (Pvt) Ltd" value="${customer?.company || ''}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">NIC / Company Reg. Number <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="nicRegNo" placeholder="e.g. 198812345678 / PV-89412" value="${customer?.nicRegNo || ''}" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Primary Phone Number <span class="text-danger">*</span></label>
                                        <input type="tel" class="form-control" name="phone" placeholder="e.g. 077 123 4567" value="${customer?.phone || ''}" required>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Alternative Phone Number</label>
                                        <input type="tel" class="form-control" name="altPhone" placeholder="Landline or secondary phone" value="${customer?.altPhone || ''}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Email Address</label>
                                        <input type="email" class="form-control" name="email" placeholder="client@domain.com" value="${customer?.email || ''}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Billing Address</label>
                                        <textarea class="form-control" name="billingAddress" rows="2" placeholder="Official billing address...">${customer?.billingAddress || ''}</textarea>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Default Site Address</label>
                                        <textarea class="form-control" name="siteAddress" rows="2" placeholder="Primary fabrication site location...">${customer?.siteAddress || ''}</textarea>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">City</label>
                                        <input type="text" class="form-control" name="city" placeholder="e.g. Homagama" value="${customer?.city || ''}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">District (Sri Lanka)</label>
                                        <select class="form-select" name="district">
                                            <option value="">Select District</option>
                                            ${districtOptions}
                                        </select>
                                    </div>
                                </div>

                                <div class="row g-3 mb-2">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Customer Notes & Instructions</label>
                                        <textarea class="form-control" name="notes" rows="2" placeholder="Special requirements or contractor details...">${customer?.notes || ''}</textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="window.customerModule.handleSaveForm()">
                                <i class="fas fa-check me-1"></i> Save Customer Account
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

    async handleSaveForm() {
        const form = document.getElementById('customer-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.active = formData.has('active');
        
        if (!data.name || !data.phone || !data.nicRegNo) {
            alert('Please complete required fields: Name, Phone, and NIC / Reg Number.');
            return;
        }

        const existingIndex = this.customers.findIndex(c => c.id === data.id);
        if (existingIndex >= 0) {
            this.customers[existingIndex] = { ...this.customers[existingIndex], ...data };
        } else {
            data.createdAt = new Date().toISOString().split('T')[0];
            data.history = [{ type: 'Account', ref: 'Created', date: data.createdAt, amount: 0, status: 'Active' }];
            this.customers.push(data);
        }

        this.saveCustomers();

        const modalEl = document.getElementById('customerFormModal');
        if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            } else {
                modalEl.remove();
            }
        }

        this.render();
    }

    delete(id) {
        if (!confirm(`Are you sure you want to delete customer ${id}?`)) return;
        this.customers = this.customers.filter(c => c.id !== id);
        this.saveCustomers();
        this.render();
    }

    renderProfile(customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        if (!customer) {
            alert('Customer record not found');
            return;
        }

        const container = document.getElementById('pageContent') || document.getElementById('mainContent') || document.getElementById('main-content') || document.body;
        const initials = (customer.name || 'C').substring(0, 2).toUpperCase();

        const history = customer.history || [
            { type: 'Quotation', ref: 'QTN-2026-0001', date: '2026-07-31', amount: 513300, status: 'Approved' },
            { type: 'Order', ref: 'ORD-2026-0157', date: '2026-07-31', amount: 513300, status: 'In Production' },
            { type: 'Invoice', ref: 'INV-2026-0142', date: '2026-07-31', amount: 485000, status: 'Partially Paid' },
            { type: 'Payment', ref: 'PAY-2026-0098', date: '2026-07-31', amount: 260000, status: 'Confirmed' }
        ];

        const quotations = history.filter(h => h.type === 'Quotation');
        const orders = history.filter(h => h.type === 'Order');
        const invoices = history.filter(h => h.type === 'Invoice');
        const payments = history.filter(h => h.type === 'Payment');

        const html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">Customer Profile & History</h2>
                    <p class="text-muted small mb-0">Account breakdown for ${customer.name}</p>
                </div>
                <div>
                    <button class="btn btn-outline-secondary me-2" onclick="window.customerModule.render()"><i class="fas fa-arrow-left me-1"></i> Back to Directory</button>
                    <button class="btn btn-warning me-2" onclick="window.customerModule.renderEditForm('${customer.id}')"><i class="fas fa-edit me-1"></i> Edit Account</button>
                    <button class="btn btn-info text-white" onclick="window.customerModule.printProfile('${customer.id}')"><i class="fas fa-print me-1"></i> Print Account Statement</button>
                </div>
            </div>

            <!-- Profile Header Banner -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 5px solid var(--color-brand-blue); border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                <div class="d-flex align-items-center flex-wrap gap-4">
                    <div class="avatar text-white font-bold rounded-circle d-flex align-items-center justify-content-center" style="width: 80px; height: 80px; font-size: 2rem; background: linear-gradient(135deg, #2563EB, #1D4ED8); flex-shrink: 0;">
                        ${initials}
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <h3 class="font-bold text-main mb-0">${customer.name}</h3>
                            <span class="badge ${customer.active ? 'bg-success' : 'bg-danger'}">${customer.active ? 'Active Account' : 'Inactive'}</span>
                        </div>
                        <p class="text-muted mb-2 font-medium">${customer.company || 'Individual Account'} &nbsp;|&nbsp; <strong>${customer.id}</strong> &nbsp;|&nbsp; NIC/BR: <strong>${customer.nicRegNo || 'N/A'}</strong></p>
                        <div class="d-flex flex-wrap gap-4 text-muted small">
                            <span><i class="fas fa-phone text-primary me-1"></i> ${customer.phone} ${customer.altPhone ? '(' + customer.altPhone + ')' : ''}</span>
                            <span><i class="fas fa-envelope text-primary me-1"></i> ${customer.email || 'N/A'}</span>
                            <span><i class="fas fa-map-marker-alt text-primary me-1"></i> ${customer.city || 'N/A'}, ${customer.district || ''}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Financial Summary Row -->
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <div class="card p-3 text-center" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                        <div class="text-muted small uppercase">Total Quotations</div>
                        <h4 class="font-bold text-main mb-0 mt-1">${quotations.length}</h4>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3 text-center" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                        <div class="text-muted small uppercase">Total Orders</div>
                        <h4 class="font-bold text-primary mb-0 mt-1">${orders.length}</h4>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3 text-center" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                        <div class="text-muted small uppercase">Total Payments Received</div>
                        <h4 class="font-bold text-success mb-0 mt-1">LKR 260,000.00</h4>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3 text-center" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                        <div class="text-muted small uppercase">Outstanding Balance</div>
                        <h4 class="font-bold text-danger mb-0 mt-1">LKR 263,300.00</h4>
                    </div>
                </div>
            </div>

            <!-- Comprehensive History Tabs -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <ul class="nav nav-tabs mb-3" id="profileTabs" role="tablist">
                    <li class="nav-item">
                        <button class="nav-link active font-medium" id="quotations-tab" data-bs-toggle="tab" data-bs-target="#quotations-pane" type="button">Quotations (${quotations.length})</button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link font-medium" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders-pane" type="button">Orders (${orders.length})</button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link font-medium" id="invoices-tab" data-bs-toggle="tab" data-bs-target="#invoices-pane" type="button">Invoices (${invoices.length})</button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link font-medium" id="payments-tab" data-bs-toggle="tab" data-bs-target="#payments-pane" type="button">Payments (${payments.length})</button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link font-medium" id="activity-tab" data-bs-toggle="tab" data-bs-target="#activity-pane" type="button">Recent Activities</button>
                    </li>
                </ul>

                <div class="tab-content" id="profileTabContent">
                    <!-- Quotations Tab -->
                    <div class="tab-pane fade show active" id="quotations-pane" role="tabpanel">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle text-sm mb-0">
                                <thead class="table-light">
                                    <tr><th>QTN#</th><th>Date</th><th>Amount (LKR)</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    ${quotations.length > 0 ? quotations.map(q => `
                                        <tr>
                                            <td><strong class="text-primary">${q.ref}</strong></td>
                                            <td>${q.date}</td>
                                            <td>LKR ${q.amount.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                                            <td><span class="badge bg-success">${q.status}</span></td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="4" class="text-muted text-center py-3">No quotation records found.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Orders Tab -->
                    <div class="tab-pane fade" id="orders-pane" role="tabpanel">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle text-sm mb-0">
                                <thead class="table-light">
                                    <tr><th>Order#</th><th>Date</th><th>Amount (LKR)</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    ${orders.length > 0 ? orders.map(o => `
                                        <tr>
                                            <td><strong class="text-primary">${o.ref}</strong></td>
                                            <td>${o.date}</td>
                                            <td>LKR ${o.amount.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                                            <td><span class="badge bg-info">${o.status}</span></td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="4" class="text-muted text-center py-3">No active orders found.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Invoices Tab -->
                    <div class="tab-pane fade" id="invoices-pane" role="tabpanel">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle text-sm mb-0">
                                <thead class="table-light">
                                    <tr><th>Invoice#</th><th>Date</th><th>Amount (LKR)</th><th>Payment Status</th></tr>
                                </thead>
                                <tbody>
                                    ${invoices.length > 0 ? invoices.map(i => `
                                        <tr>
                                            <td><strong class="text-primary">${i.ref}</strong></td>
                                            <td>${i.date}</td>
                                            <td>LKR ${i.amount.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                                            <td><span class="badge bg-warning">${i.status}</span></td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="4" class="text-muted text-center py-3">No invoice records found.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Payments Tab -->
                    <div class="tab-pane fade" id="payments-pane" role="tabpanel">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle text-sm mb-0">
                                <thead class="table-light">
                                    <tr><th>Payment Ref</th><th>Date</th><th>Amount (LKR)</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    ${payments.length > 0 ? payments.map(p => `
                                        <tr>
                                            <td><strong class="text-primary">${p.ref}</strong></td>
                                            <td>${p.date}</td>
                                            <td><strong class="text-success">LKR ${p.amount.toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                                            <td><span class="badge bg-success">${p.status}</span></td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="4" class="text-muted text-center py-3">No payment transactions found.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Recent Activities Tab -->
                    <div class="tab-pane fade" id="activity-pane" role="tabpanel">
                        <ul class="list-group list-group-flush small">
                            ${history.map(h => `
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <i class="fas fa-check-circle text-success me-2"></i> ${h.type} <strong>${h.ref}</strong> - LKR ${h.amount.toLocaleString('en-US', {minimumFractionDigits:2})} (${h.status})
                                    </div>
                                    <span class="text-muted small">${h.date}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    exportPDF() {
        alert("Exporting customer directory report to PDF...");
    }

    exportExcel() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Customer ID,Name,NIC / Reg No,Company,Phone,Email,City,District,Status\n";
        this.customers.forEach(c => {
            csvContent += `${c.id},"${c.name}","${c.nicRegNo || ''}","${c.company || ''}",${c.phone},"${c.email || ''}",${c.city || ''},${c.district || ''},${c.active ? 'Active' : 'Inactive'}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `ALUGRADE_Customers_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    printProfile(customerId) {
        window.print();
    }
}

if (typeof window !== 'undefined') {
    window.CustomerModule = CustomerModule;
}
