/**
 * Order Management System for ALUGRADE BMS
 * Commercial Enterprise Edition
 * Full Production Lifecycle: Accepted Quotation -> Convert to Sales Order -> Deposit Verification -> Order Approval -> Production Queue -> Ready for Production
 */

class OrderModule {
    constructor(db, eventsManager) {
        this.db = db || window.DB || {};
        this.events = eventsManager || window.Events || {
            trigger: () => {},
            emit: () => {}
        };
        this.containerId = 'pageContent';
        this.categories = [
            "Casement Windows", "Sliding Windows", "Fixed Glass",
            "Swing Doors", "Sliding Doors", "Folding Doors",
            "Shop Fronts", "Partitions", "Curtain Walls",
            "Shower Cubicles", "Custom Fabrication"
        ];
        this.productionTeams = [
            "Bandara Fabrication Team A",
            "Kamal Lead Glazing & Assembly Team",
            "Nimal Site Installation Unit 1",
            "Sunil Quality Control & Finishing Team"
        ];
        this.activeStatusFilter = 'All';
        this.orders = this.loadOrders();
    }

    loadOrders() {
        const stored = localStorage.getItem('alugrade_orders');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) { return []; }
        }

        // Default Production Orders Dataset
        const defaults = [
            {
                id: 'ORD-2026-0001',
                quotationRef: 'QTN-2026-0001',
                customerId: 'CUST-2026-0001',
                customerName: 'Jayasinghe Construction (Pvt) Ltd',
                customerPhone: '0771234567',
                customerEmail: 'info@jayasinghe.lk',
                salesRep: 'Samantha Perera',
                projectName: 'Homagama Commercial Complex - Phase 1',
                siteAddress: 'Diyagama Road, Homagama',
                billingAddress: 'No. 45, Galle Road, Colombo 03',
                profileBrand: 'Alumex',
                orderDate: '2026-07-31',
                expectedDate: '2026-08-15',
                priority: 'High',
                status: 'In Production',
                productionStatus: 'Fabrication',
                depositVerified: true,
                paymentStatus: 'Partial',
                assignedTeam: 'Bandara Fabrication Team A',
                remarks: 'Special attention required for rubber gasket sealing and corner cleats.',
                subtotal: 450000.00,
                overallDiscount: 15000.00,
                vatPct: 18.00,
                vatAmount: 78300.00,
                grandTotal: 513300.00,
                advancePayment: 250000.00,
                balance: 263300.00,
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
                    { title: 'Quotation QTN-2026-0001 Approved', date: '2026-07-31 09:30', user: 'Admin', icon: 'fa-file-signature', notes: 'Converted with 1-click from approved quotation.' },
                    { title: 'Order Created & Deposit Verified', date: '2026-07-31 09:35', user: 'Sales Manager', icon: 'fa-check-double', notes: 'Deposit of LKR 250,000 verified.' },
                    { title: 'Approved for Production Queue', date: '2026-07-31 10:15', user: 'Production Lead', icon: 'fa-cogs', notes: 'Assigned to Bandara Fabrication Team A.' }
                ]
            }
        ];

        localStorage.setItem('alugrade_orders', JSON.stringify(defaults));
        return defaults;
    }

    saveOrders() {
        localStorage.setItem('alugrade_orders', JSON.stringify(this.orders));
    }

    generateId() {
        const year = new Date().getFullYear();
        const count = this.orders.length + 1;
        return `ORD-${year}-${count.toString().padStart(4, '0')}`;
    }

    getStatusColor(status) {
        const colors = {
            'Pending Deposit': 'warning',
            'Deposit Verified': 'info',
            'Approved': 'primary',
            'In Production': 'purple',
            'Completed': 'success',
            'Delivered': 'dark',
            'Cancelled': 'danger'
        };
        return colors[status] || 'secondary';
    }

    render() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        const countPending = this.orders.filter(o => o.status === 'Pending Deposit').length;
        const countVerified = this.orders.filter(o => o.status === 'Deposit Verified').length;
        const countApproved = this.orders.filter(o => o.status === 'Approved').length;
        const countProduction = this.orders.filter(o => o.status === 'In Production').length;
        const countCompleted = this.orders.filter(o => o.status === 'Completed').length;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Order Management System</h2>
                    <p class="text-muted small mb-0">Commercial sales order workflow: Accepted Quotation → Deposit Verification → Order Approval → Production Queue</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="window.orderModule.showConvertQuotationModal()">
                        <i class="fas fa-file-invoice text-primary me-1"></i> Convert Quotation to Order
                    </button>
                    <button class="btn btn-primary" onclick="window.orderModule.renderNewForm()">
                        <i class="fas fa-plus-circle me-1"></i> + Create New Order
                    </button>
                </div>
            </div>

            <!-- Status Filter Tabs -->
            <ul class="nav nav-pills mb-4 gap-2" id="orderStatusTabs">
                <li class="nav-item"><button class="nav-link ${this.activeStatusFilter==='All'?'active':''} font-medium" onclick="window.orderModule.filterStatus('All', this)">All Orders (${this.orders.length})</button></li>
                <li class="nav-item"><button class="nav-link ${this.activeStatusFilter==='Pending Deposit'?'active':''} font-medium" onclick="window.orderModule.filterStatus('Pending Deposit', this)">Pending Deposit (${countPending})</button></li>
                <li class="nav-item"><button class="nav-link ${this.activeStatusFilter==='Deposit Verified'?'active':''} font-medium" onclick="window.orderModule.filterStatus('Deposit Verified', this)">Deposit Verified (${countVerified})</button></li>
                <li class="nav-item"><button class="nav-link ${this.activeStatusFilter==='Approved'?'active':''} font-medium" onclick="window.orderModule.filterStatus('Approved', this)">Approved (${countApproved})</button></li>
                <li class="nav-item"><button class="nav-link ${this.activeStatusFilter==='In Production'?'active':''} font-medium" onclick="window.orderModule.filterStatus('In Production', this)">In Production (${countProduction})</button></li>
                <li class="nav-item"><button class="nav-link ${this.activeStatusFilter==='Completed'?'active':''} font-medium" onclick="window.orderModule.filterStatus('Completed', this)">Completed (${countCompleted})</button></li>
            </ul>

            <!-- Main Filter & Search Panel -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="row g-3 mb-3 align-items-center">
                    <div class="col-md-4">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                            <input type="text" id="order-search" class="form-control border-start-0" placeholder="Search order#, quotation#, customer, project..." onkeyup="window.orderModule.handleSearch()">
                        </div>
                    </div>

                    <div class="col-md-3">
                        <select id="priorityFilter" class="form-select" onchange="window.orderModule.handleSearch()">
                            <option value="">All Priorities</option>
                            <option value="Normal">Normal Priority</option>
                            <option value="High">High Priority</option>
                            <option value="Urgent">Urgent / Rush</option>
                        </select>
                    </div>

                    <div class="col-md-3">
                        <select id="teamFilter" class="form-select" onchange="window.orderModule.handleSearch()">
                            <option value="">All Production Teams</option>
                            ${this.productionTeams.map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                    </div>

                    <div class="col-md-2 text-end">
                        <div class="btn-group">
                            <button class="btn btn-outline-secondary btn-sm" onclick="window.orderModule.exportExcel()"><i class="fas fa-file-excel text-success me-1"></i> CSV</button>
                        </div>
                    </div>
                </div>

                <!-- Orders Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" id="orders-table">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Order# & Ref</th>
                                <th>Customer & Project</th>
                                <th>Expected Date</th>
                                <th>Brand & Rep</th>
                                <th>Grand Total</th>
                                <th>Advance Paid</th>
                                <th>Balance Due</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="orders-tbody">
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.loadOrdersData();
    }

    loadOrdersData() {
        const query = document.getElementById('order-search')?.value || '';
        const priorityFilter = document.getElementById('priorityFilter')?.value || '';
        const teamFilter = document.getElementById('teamFilter')?.value || '';

        let filtered = this.orders;

        if (this.activeStatusFilter && this.activeStatusFilter !== 'All') {
            filtered = filtered.filter(o => o.status === this.activeStatusFilter);
        }

        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(o =>
                (o.id && o.id.toLowerCase().includes(q)) ||
                (o.quotationRef && o.quotationRef.toLowerCase().includes(q)) ||
                (o.customerName && o.customerName.toLowerCase().includes(q)) ||
                (o.projectName && o.projectName.toLowerCase().includes(q)) ||
                (o.customerPhone && o.customerPhone.includes(q))
            );
        }

        if (priorityFilter) {
            filtered = filtered.filter(o => o.priority === priorityFilter);
        }

        if (teamFilter) {
            filtered = filtered.filter(o => o.assignedTeam === teamFilter);
        }

        this.renderTableData(filtered);
    }

    filterStatus(status, btnElement) {
        this.activeStatusFilter = status;
        if (btnElement) {
            document.querySelectorAll('#orderStatusTabs .nav-link').forEach(el => el.classList.remove('active'));
            btnElement.classList.add('active');
        }
        this.loadOrdersData();
    }

    renderTableData(orders) {
        const tbody = document.getElementById('orders-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-muted">No orders found matching search criteria.</td></tr>';
            return;
        }

        orders.forEach(o => {
            const statusBadgeClass = {
                'Pending Deposit': 'bg-warning text-dark',
                'Deposit Verified': 'bg-info text-white',
                'Approved': 'bg-primary text-white',
                'In Production': 'bg-purple text-white',
                'Completed': 'bg-success text-white',
                'Delivered': 'bg-dark text-white',
                'Cancelled': 'bg-danger text-white'
            }[o.status] || 'bg-secondary';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <strong class="text-primary">${o.id}</strong>
                    ${o.quotationRef ? `<div class="small text-muted"><i class="fas fa-link me-1"></i>${o.quotationRef}</div>` : ''}
                </td>
                <td>
                    <div class="font-bold text-main">${o.customerName || 'N/A'}</div>
                    <div class="small text-muted">${o.projectName || 'General Fabrication'}</div>
                </td>
                <td>
                    <div>${o.expectedDate || 'TBD'}</div>
                    <div class="small text-muted"><i class="fas fa-calendar-alt me-1"></i>Ordered: ${o.orderDate || ''}</div>
                </td>
                <td>
                    <div><span class="badge bg-light text-dark border">${o.profileBrand || 'Alumex'}</span></div>
                    <div class="small text-muted">${o.salesRep || 'Sales Dept'}</div>
                </td>
                <td><strong>LKR ${(o.grandTotal || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong></td>
                <td><span class="text-success font-medium">LKR ${(o.advancePayment || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</span></td>
                <td><strong class="${(o.balance || 0) > 0 ? 'text-danger' : 'text-success'}">LKR ${(o.balance || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong></td>
                <td><span class="badge ${statusBadgeClass}" style="${o.status==='In Production'?'background-color:#7C3AED;':''}">${o.status || 'Pending Deposit'}</span></td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" title="View Detail & Timeline" onclick="window.orderModule.renderDetail('${o.id}')">View</button>
                        <button class="btn btn-outline-secondary" title="Edit Order" onclick="window.orderModule.renderEditForm('${o.id}')">Edit</button>
                        <button class="btn btn-outline-info" title="Print Job Sheet" onclick="window.orderModule.printOrder('${o.id}')"><i class="fas fa-print"></i></button>
                        <button class="btn btn-outline-danger" title="Delete" onclick="window.orderModule.delete('${o.id}')"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    handleSearch() {
        this.loadOrdersData();
    }

    // 1-CLICK CONVERSION FROM QUOTATION
    createFromQuotation(q) {
        if (!q) return;
        const newOrderId = this.generateId();

        const newOrder = {
            id: newOrderId,
            quotationRef: q.id,
            customerId: q.customerId || 'CUST-AUTO',
            customerName: q.customerName || 'Direct Client',
            customerPhone: q.customerPhone || '',
            customerEmail: q.customerEmail || '',
            salesRep: q.salesRep || q.salesRepName || 'Sales Dept',
            projectName: q.projectName || 'Fabrication Order',
            siteAddress: q.siteAddress || '',
            billingAddress: q.billingAddress || '',
            profileBrand: q.profileBrand || 'Alumex',
            orderDate: new Date().toISOString().split('T')[0],
            expectedDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            priority: 'High',
            status: (q.advance > 0) ? 'Deposit Verified' : 'Pending Deposit',
            depositVerified: (q.advance > 0),
            paymentStatus: (q.advance >= q.grandTotal) ? 'Paid' : (q.advance > 0 ? 'Partial' : 'Unpaid'),
            assignedTeam: 'Bandara Fabrication Team A',
            remarks: q.notes || `Converted 1-Click from quotation ${q.id}`,
            subtotal: q.subtotal || 0,
            overallDiscount: q.overallDiscount || 0,
            vatPct: q.vatPct !== undefined ? q.vatPct : 18.0,
            vatAmount: q.vatAmount || 0,
            grandTotal: q.grandTotal || 0,
            advancePayment: q.advance || 0,
            balance: q.balance || 0,
            items: q.items ? JSON.parse(JSON.stringify(q.items)) : [],
            timeline: [
                { title: `Converted 1-Click from Quotation ${q.id}`, date: new Date().toLocaleString(), user: 'Admin', icon: 'fa-bolt', notes: 'Quotation line items and financials imported.' },
                { title: (q.advance > 0) ? 'Deposit Verified' : 'Awaiting Deposit Verification', date: new Date().toLocaleString(), user: 'Finance', icon: 'fa-money-bill-wave', notes: `Advance deposit recorded: LKR ${(q.advance || 0).toLocaleString()}` }
            ]
        };

        this.orders.unshift(newOrder);
        this.saveOrders();
        this.renderDetail(newOrderId);
    }

    showConvertQuotationModal() {
        const quotations = JSON.parse(localStorage.getItem('alugrade_quotations') || '[]');
        const approved = quotations.filter(q => q.status === 'Approved' || q.status === 'Sent' || q.status === 'Draft');

        const modalId = 'convertQuotationModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const listItemsHtml = approved.length > 0 ? approved.map(q => `
            <div class="list-group-item p-3 d-flex justify-content-between align-items-center mb-2" style="border-radius: 10px; border: 1px solid var(--color-border);">
                <div>
                    <h6 class="mb-1 font-bold text-primary">${q.id} - ${q.customerName}</h6>
                    <p class="text-muted small mb-0">Project: ${q.projectName || 'N/A'} &nbsp;|&nbsp; Brand: <strong>${q.profileBrand || 'Alumex'}</strong> &nbsp;|&nbsp; Amount: <strong>LKR ${(q.grandTotal || 0).toLocaleString()}</strong></p>
                </div>
                <button class="btn btn-success btn-sm font-medium" onclick="window.orderModule.convertQuotationToOrder('${q.id}')">
                    <i class="fas fa-bolt me-1"></i> Convert to Order
                </button>
            </div>
        `).join('') : '<p class="text-muted p-3 text-center">No active quotations found. Create or select a quotation first.</p>';

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-file-invoice text-primary me-2"></i> Convert Quotation to Production Order
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <p class="text-muted small mb-3">Select a customer quotation to automatically convert it into a production order with 1 click.</p>
                            <div class="list-group">
                                ${listItemsHtml}
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

    convertQuotationToOrder(quotationId) {
        const quotations = JSON.parse(localStorage.getItem('alugrade_quotations') || '[]');
        const q = quotations.find(x => x.id === quotationId);

        if (q) {
            const modalEl = document.getElementById('convertQuotationModal');
            if (modalEl) {
                if (window.bootstrap && window.bootstrap.Modal) {
                    const modal = window.bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                } else {
                    modalEl.remove();
                }
            }
            this.createFromQuotation(q);
        } else {
            alert('Quotation record not found');
        }
    }

    renderNewForm() {
        this.renderFormModal();
    }

    renderEditForm(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            this.renderFormModal(order);
        } else {
            alert('Order record not found');
        }
    }

    renderFormModal(order = null) {
        const isEdit = !!order;
        const modalId = 'orderFormModal';

        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const newId = isEdit ? order.id : this.generateId();

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-boxes text-primary me-2"></i> ${isEdit ? 'Edit Production Order #' + newId : 'Create New Commercial Production Order'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="order-form">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Order Number</label>
                                        <input type="text" class="form-control bg-light font-bold text-primary" name="id" value="${newId}" readonly>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Linked Quotation Ref</label>
                                        <input type="text" class="form-control" name="quotationRef" value="${order?.quotationRef || ''}" placeholder="e.g. QTN-2026-0001">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Customer Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="customerName" value="${order?.customerName || 'Jayasinghe Construction (Pvt) Ltd'}" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Sales Representative</label>
                                        <input type="text" class="form-control" name="salesRep" value="${order?.salesRep || 'Samantha Perera'}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Project Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="projectName" value="${order?.projectName || 'Homagama Villa Project'}" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Customer Phone</label>
                                        <input type="tel" class="form-control" name="customerPhone" value="${order?.customerPhone || '0771234567'}">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Customer Email</label>
                                        <input type="email" class="form-control" name="customerEmail" value="${order?.customerEmail || 'info@domain.lk'}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Profile Brand</label>
                                        <select class="form-select font-bold text-primary" name="profileBrand">
                                            <option value="Alumex" ${(!order || order?.profileBrand === 'Alumex') ? 'selected' : ''}>Alumex Aluminium</option>
                                            <option value="SwissTek" ${order?.profileBrand === 'SwissTek' ? 'selected' : ''}>SwissTek Aluminium</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Order Status</label>
                                        <select class="form-select font-bold" name="status">
                                            <option value="Pending Deposit" ${order?.status === 'Pending Deposit' ? 'selected' : ''}>Pending Deposit</option>
                                            <option value="Deposit Verified" ${order?.status === 'Deposit Verified' ? 'selected' : ''}>Deposit Verified</option>
                                            <option value="Approved" ${order?.status === 'Approved' ? 'selected' : ''}>Approved</option>
                                            <option value="In Production" ${(!order || order?.status === 'In Production') ? 'selected' : ''}>In Production</option>
                                            <option value="Completed" ${order?.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                            <option value="Delivered" ${order?.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                            <option value="Cancelled" ${order?.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Production Priority</label>
                                        <select class="form-select font-bold text-warning" name="priority">
                                            <option value="Normal" ${order?.priority === 'Normal' ? 'selected' : ''}>Normal Priority</option>
                                            <option value="High" ${(!order || order?.priority === 'High') ? 'selected' : ''}>High Priority</option>
                                            <option value="Urgent" ${order?.priority === 'Urgent' ? 'selected' : ''}>Urgent / Rush</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Expected Completion Date</label>
                                        <input type="date" class="form-control" name="expectedDate" value="${order?.expectedDate || new Date(Date.now()+14*86400000).toISOString().split('T')[0]}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Assigned Production Team</label>
                                        <select class="form-select" name="assignedTeam">
                                            ${this.productionTeams.map(t => `<option value="${t}" ${order?.assignedTeam === t ? 'selected' : ''}>${t}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Grand Total (LKR)</label>
                                        <input type="number" step="0.01" class="form-control font-bold" name="grandTotal" value="${order?.grandTotal || 513300}">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Advance Deposit Paid (LKR)</label>
                                        <input type="number" step="0.01" class="form-control font-bold text-success" name="advancePayment" value="${order?.advancePayment || 250000}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Site Location Address</label>
                                        <input type="text" class="form-control" name="siteAddress" value="${order?.siteAddress || 'Diyagama Road, Homagama'}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Special Remarks & Scope Notes</label>
                                        <input type="text" class="form-control" name="remarks" value="${order?.remarks || 'Special attention required for rubber gasket sealing'}">
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="window.orderModule.handleSaveForm()">
                                <i class="fas fa-check me-1"></i> Save Order Details
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
        const form = document.getElementById('order-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.grandTotal = parseFloat(data.grandTotal || 0);
        data.advancePayment = parseFloat(data.advancePayment || 0);
        data.subtotal = data.subtotal || data.grandTotal;
        data.balance = Math.max(0, data.grandTotal - data.advancePayment);
        data.depositVerified = (data.advancePayment > 0);

        const existingIndex = this.orders.findIndex(o => o.id === data.id);
        if (existingIndex >= 0) {
            this.orders[existingIndex] = { ...this.orders[existingIndex], ...data };
        } else {
            data.orderDate = new Date().toISOString().split('T')[0];
            data.timeline = [{ title: 'Order Created', date: new Date().toLocaleString(), user: 'Admin', icon: 'fa-plus-circle' }];
            this.orders.unshift(data);
        }

        this.saveOrders();

        const modalEl = document.getElementById('orderFormModal');
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

    verifyDeposit(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        order.depositVerified = true;
        if (order.status === 'Pending Deposit') {
            order.status = 'Deposit Verified';
        }
        order.timeline = order.timeline || [];
        order.timeline.push({
            title: `Deposit Verified (LKR ${(order.advancePayment || 0).toLocaleString()})`,
            date: new Date().toLocaleString(),
            user: 'Accounts Lead',
            icon: 'fa-check-double',
            notes: 'Advance deposit confirmed in bank account.'
        });

        this.saveOrders();
        alert(`Deposit for Order ${orderId} verified successfully!`);
        this.renderDetail(orderId);
    }

    approveOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        order.status = 'Approved';
        order.timeline = order.timeline || [];
        order.timeline.push({
            title: 'Order Approved for Production Queue',
            date: new Date().toLocaleString(),
            user: 'Sales Manager',
            icon: 'fa-thumbs-up',
            notes: 'Production team assigned and queue unlocked.'
        });

        this.saveOrders();
        alert(`Order ${orderId} approved and added to Production Queue!`);
        this.renderDetail(orderId);
    }

    delete(id) {
        if (!confirm(`Are you sure you want to delete Order ${id}?`)) return;
        this.orders = this.orders.filter(o => o.id !== id);
        this.saveOrders();
        this.render();
    }

    renderDetail(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) {
            alert('Order record not found');
            return;
        }

        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        const timelineHtml = (order.timeline || []).map(t => `
            <div class="d-flex align-items-start mb-3 pb-3 border-bottom">
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style="width: 36px; height: 36px; flex-shrink: 0;">
                    <i class="fas ${t.icon || 'fa-check'}"></i>
                </div>
                <div>
                    <h6 class="font-bold text-main mb-1">${t.title}</h6>
                    <p class="text-muted small mb-0">${t.date} &nbsp;|&nbsp; Updated by <strong>${t.user}</strong></p>
                    ${t.notes ? `<p class="small bg-light p-2 rounded mt-1 mb-0">${t.notes}</p>` : ''}
                </div>
            </div>
        `).join('');

        const itemsHtml = (order.items && order.items.length > 0) ? order.items.map((item, idx) => `
            <tr>
                <td class="text-center font-bold">${idx + 1}</td>
                <td>
                    <strong class="text-main">${item.description}</strong>
                    <div class="small text-muted">Section: ${item.alumSection || '-'} | Glass: ${item.glassType || '-'} | Color: ${item.colour || '-'}</div>
                </td>
                <td class="text-center">${item.width} × ${item.height} mm</td>
                <td class="text-center">${parseFloat(item.sqft || 0).toFixed(2)}</td>
                <td class="text-center">${item.qty}</td>
                <td class="text-end font-bold">LKR ${parseFloat(item.amount || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
        `).join('') : `<tr><td colspan="6" class="text-muted text-center py-3">No individual items itemized. Summary order total: LKR ${(order.grandTotal || 0).toLocaleString()}</td></tr>`;

        const html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">Order Detail & Production Job Sheet</h2>
                    <p class="text-muted small mb-0">Order Reference: <strong>${order.id}</strong> ${order.quotationRef ? `(Linked QTN: ${order.quotationRef})` : ''}</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="window.orderModule.render()"><i class="fas fa-arrow-left me-1"></i> Back</button>
                    <button class="btn btn-warning" onclick="window.orderModule.renderEditForm('${order.id}')"><i class="fas fa-edit me-1"></i> Edit Order</button>
                    <button class="btn btn-info text-white" onclick="window.orderModule.printOrder('${order.id}')"><i class="fas fa-print me-1"></i> Print Job Sheet</button>
                    ${!order.depositVerified ? `<button class="btn btn-success" onclick="window.orderModule.verifyDeposit('${order.id}')"><i class="fas fa-check-double me-1"></i> Verify Deposit</button>` : ''}
                    ${order.status === 'Deposit Verified' || order.status === 'Pending Deposit' ? `<button class="btn btn-primary" onclick="window.orderModule.approveOrder('${order.id}')"><i class="fas fa-thumbs-up me-1"></i> Approve Order</button>` : ''}
                </div>
            </div>

            <!-- Summary Header Banner -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 5px solid var(--color-brand-blue); border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                <div class="row g-3">
                    <div class="col-md-6 border-end">
                        <h5 class="font-bold text-main mb-2">${order.customerName}</h5>
                        <p class="text-muted small mb-1"><i class="fas fa-project-diagram me-1"></i> Project: <strong>${order.projectName || 'Fabrication'}</strong></p>
                        <p class="text-muted small mb-1"><i class="fas fa-layer-group me-1"></i> Profile Brand: <strong class="text-primary">${order.profileBrand || 'Alumex'}</strong></p>
                        <p class="text-muted small mb-1"><i class="fas fa-user-tie me-1"></i> Sales Rep: <strong>${order.salesRep || 'Sales Dept'}</strong></p>
                        <p class="text-muted small mb-1"><i class="fas fa-phone me-1"></i> Phone: ${order.customerPhone || 'N/A'}</p>
                        <p class="text-muted small mb-0"><i class="fas fa-map-marker-alt me-1"></i> Site: ${order.siteAddress || 'N/A'}</p>
                    </div>
                    <div class="col-md-6 ps-4">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Order Status:</span>
                            <span class="badge bg-${this.getStatusColor(order.status)} fs-6">${order.status}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Production Priority:</span>
                            <span class="badge bg-warning text-dark font-bold">${order.priority || 'Normal'}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Expected Completion:</span>
                            <strong class="text-primary">${order.expectedDate || 'TBD'}</strong>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted small uppercase">Assigned Team:</span>
                            <strong class="text-main">${order.assignedTeam || 'Unassigned'}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Itemized Specifications Grid -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-th-list text-primary me-2"></i> Itemized Fabrication Specifications</h5>
                <div class="table-responsive">
                    <table class="table table-bordered align-middle text-sm mb-0">
                        <thead class="table-light">
                            <tr>
                                <th style="width: 30px;" class="text-center">#</th>
                                <th>Specification Description</th>
                                <th style="width: 110px;" class="text-center">Dimensions</th>
                                <th style="width: 70px;" class="text-center">Sq.Ft</th>
                                <th style="width: 50px;" class="text-center">Qty</th>
                                <th style="width: 120px;" class="text-end">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="row g-4">
                <!-- Left: Production Timeline & History -->
                <div class="col-md-7">
                    <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-stream text-primary me-2"></i> Production Order Timeline & Audit Log</h5>
                        <div class="timeline-container mt-3">
                            ${timelineHtml}
                        </div>
                    </div>
                </div>

                <!-- Right: Financial Summary -->
                <div class="col-md-5">
                    <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-calculator text-primary me-2"></i> Deposit & Financial Summary</h5>
                        <div class="d-flex justify-content-between py-2 border-bottom">
                            <span class="text-muted">Subtotal Amount:</span>
                            <strong>LKR ${(order.subtotal || order.grandTotal || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-bottom text-muted">
                            <span>Overall Discount:</span>
                            <span class="text-danger">- LKR ${(order.overallDiscount || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-bottom">
                            <span class="text-muted">VAT (18%):</span>
                            <span>+ LKR ${(order.vatAmount || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-bottom fs-5 font-bold">
                            <span>Grand Total:</span>
                            <span class="text-primary">LKR ${(order.grandTotal || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-bottom text-success font-medium">
                            <span>Advance Deposit Verified:</span>
                            <span>LKR ${(order.advancePayment || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-3 fs-5 font-bold text-danger">
                            <span>Balance Due:</span>
                            <span>LKR ${(order.balance || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    renderPrintView(orderId) {
        const o = this.orders.find(x => x.id === orderId);
        if (!o) return '';

        const itemsHtml = (o.items && o.items.length > 0) ? o.items.map((item, idx) => `
            <tr>
                <td class="text-center" style="font-weight: 700;">${idx + 1}</td>
                <td>
                    <strong style="color: #0F172A; font-size: 10.5px;">${item.description}</strong>
                    <div style="color: #475569; font-size: 9px; margin-top: 2px;">
                        Section: <strong>${item.alumSection || '-'}</strong> &nbsp;|&nbsp;
                        Glass: <strong>${item.glassType || '-'}</strong> &nbsp;|&nbsp;
                        Finish: <strong>${item.colour || '-'}</strong>
                    </div>
                </td>
                <td class="text-center">${item.width} × ${item.height} mm</td>
                <td class="text-center font-medium">${parseFloat(item.sqft || 0).toFixed(2)}</td>
                <td class="text-center font-medium">${item.qty}</td>
                <td class="text-right" style="font-weight: 700;">${parseFloat(item.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `).join('') : `
            <tr>
                <td class="text-center">1</td>
                <td><strong>${o.productName || 'Custom Architectural Fabrication'}</strong></td>
                <td class="text-center">${o.width || '-'} × ${o.height || '-'} mm</td>
                <td class="text-center">${parseFloat(o.sqft || 0).toFixed(2)}</td>
                <td class="text-center">${o.quantity || 1}</td>
                <td class="text-right" style="font-weight: 700;">${parseFloat(o.grandTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `;

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Job Sheet ${o.id} - ALUGRADE LANKA FAB & GLASS</title>
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
                    }
                    .company-subtitle {
                        color: #2563EB;
                        font-size: 10px;
                        font-weight: 700;
                        margin: 2px 0 3px 0;
                        text-transform: uppercase;
                    }
                    .company-contacts {
                        color: #475569;
                        font-size: 9.5px;
                        margin: 0;
                    }

                    .header-info-box {
                        text-align: right;
                    }
                    .doc-badge {
                        background: #0F172A;
                        color: #ffffff;
                        font-family: 'Montserrat', sans-serif;
                        font-size: 15px;
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
                        border-bottom: 1px solid #E2E8F0;
                        padding-bottom: 4px;
                    }
                    .info-card-text {
                        font-size: 10.5px;
                        color: #334155;
                        line-height: 1.45;
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
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }

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

                    @media print {
                        body { padding: 0; margin: 0; }
                        thead { display: table-header-group; }
                        tfoot { display: table-footer-group; }
                        tr { page-break-inside: avoid; }
                        .signature-area { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <img src="assets/logo/logo.png" class="watermark" alt="Watermark" />
                <div class="content-wrapper">
                    <div class="header-container">
                        <div class="logo-brand-wrap">
                            <div class="logo-box">
                                <img src="assets/logo/logo.png" alt="ALUGRADE LANKA" />
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
                            <div class="doc-badge">PRODUCTION JOB SHEET</div>
                            <div class="meta-line"><strong>Order No:</strong> ${o.id}</div>
                            <div class="meta-line"><strong>Quotation Ref:</strong> ${o.quotationRef || 'Direct Order'}</div>
                            <div class="meta-line"><strong>Order Date:</strong> ${o.orderDate || ''}</div>
                            <div class="meta-line"><strong>Expected Date:</strong> ${o.expectedDate || 'TBD'}</div>
                            <div class="meta-line"><strong>Profile Brand:</strong> ${o.profileBrand || 'Alumex'}</div>
                            <div class="meta-line"><strong>Sales Rep:</strong> ${o.salesRep || 'Sales Dept'}</div>
                        </div>
                    </div>

                    <div class="info-grid">
                        <div class="info-card">
                            <h4>Client Information</h4>
                            <div class="info-card-text">
                                <strong>${o.customerName}</strong><br>
                                ${o.billingAddress ? o.billingAddress.replace(/\n/g, '<br>') : 'Address on Record'}<br>
                                <strong>Phone:</strong> ${o.customerPhone || 'N/A'}<br>
                                <strong>Email:</strong> ${o.customerEmail || 'N/A'}
                            </div>
                        </div>
                        <div class="info-card">
                            <h4>Production Assignment & Scope</h4>
                            <div class="info-card-text">
                                <strong>Project:</strong> ${o.projectName || 'General Commercial Fabrication'}<br>
                                <strong>Site Address:</strong> ${o.siteAddress || 'N/A'}<br>
                                <strong>Assigned Team:</strong> ${o.assignedTeam || 'Workshop Team A'}<br>
                                <strong>Priority:</strong> ${o.priority || 'Normal'} &nbsp;|&nbsp; <strong>Status:</strong> ${o.status || 'Approved'}
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
                                <th style="width: 100px;" class="text-right">Total (LKR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <div class="signature-area">
                        <div class="sig-block">
                            <div class="sig-image-container">
                                <img src="assets/signature/signature.png" alt="Authorized Signature" />
                            </div>
                            <div class="sig-line-bar"></div>
                            <div class="sig-person-name">MR. M. U. RAJAPAKSHA</div>
                            <div class="sig-person-title">Managing Director</div>
                        </div>
                        <div class="sig-block">
                            <div class="sig-image-container"></div>
                            <div class="sig-line-bar"></div>
                            <div class="sig-person-name">WORKSHOP TEAM LEAD</div>
                            <div class="sig-person-title">Production Acceptance</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    printOrder(orderId) {
        const html = this.renderPrintView(orderId);
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

    exportPDF(orderId) {
        if (orderId) {
            this.printOrder(orderId);
        } else {
            alert("To export an order to PDF, please click 'View' or 'Print' on the target order.");
        }
    }

    exportExcel() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Order#,QuotationRef,Customer,Project,Order Date,Expected Date,Brand,Priority,Team,Subtotal,Discount,VAT,Grand Total,Advance,Balance,Status\n";
        this.orders.forEach(o => {
            csvContent += `${o.id},"${o.quotationRef || ''}","${o.customerName || ''}","${o.projectName || ''}",${o.orderDate || ''},${o.expectedDate || ''},"${o.profileBrand || 'Alumex'}","${o.priority || 'Normal'}","${o.assignedTeam || ''}",${o.subtotal || 0},${o.overallDiscount || 0},${o.vatAmount || 0},${o.grandTotal || 0},${o.advancePayment || 0},${o.balance || 0},${o.status || ''}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `ALUGRADE_Production_Orders_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

if (typeof window !== 'undefined') {
    window.OrderModule = OrderModule;
}
