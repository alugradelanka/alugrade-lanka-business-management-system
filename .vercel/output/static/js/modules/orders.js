/**
 * Order Management System for ALUGRADE BMS
 * Commercial Enterprise Edition
 */

class OrderModule {
    constructor(db, eventsManager) {
        this.db = db || window.DB || {
            customers: [],
            orders: [],
            quotations: [],
            employees: []
        };
        this.events = eventsManager || window.Events || {
            trigger: (event, data) => console.log(`Event: ${event}`, data),
            emit: (event, data) => console.log(`Event: ${event}`, data)
        };
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
        this.orders = this.loadOrders();
    }

    loadOrders() {
        const stored = localStorage.getItem('alugrade_orders');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) { return []; }
        }

        // Seed default enterprise order dataset
        const defaults = [
            {
                id: 'ORD-2026-0001',
                quotationRef: 'QTN-2026-0001',
                customerId: 'CUST-2026-0001',
                customerName: 'Jayasinghe Construction (Pvt) Ltd',
                customerPhone: '0771234567',
                projectName: 'Homagama Commercial Complex - Phase 1',
                siteAddress: 'Diyagama Road, Homagama',
                productName: 'Sliding 2-Track & Fixed Partition Glass',
                category: 'Partitions',
                profileType: 'Heavy Duty 100mm Series',
                colour: 'Matt Black Powder Coated',
                glassType: '6mm Tempered Clear Glass',
                width: 2400,
                height: 2100,
                quantity: 4,
                sqft: 216.98,
                unitPrice: 2200,
                subtotal: 477356,
                discount: 15000,
                vatAmount: 83224,
                grandTotal: 545580,
                advancePayment: 260000,
                balance: 285580,
                orderDate: '2026-07-31',
                expectedDate: '2026-08-15',
                priority: 'High',
                status: 'In Production',
                productionStatus: 'Fabrication',
                paymentStatus: 'Partial',
                assignedTeam: 'Bandara Fabrication Team A',
                remarks: 'Special attention required for rubber gasket sealing and corner cleats.',
                timeline: [
                    { title: 'Quotation QTN-2026-0001 Approved', date: '2026-07-31 09:30', user: 'Admin', icon: 'fa-file-signature', notes: 'Converted with 1-click from approved quotation.' },
                    { title: 'Order Created & Scheduled', date: '2026-07-31 09:35', user: 'Sales Manager', icon: 'fa-plus-circle', notes: 'Auto assigned to Bandara Fabrication Team A.' },
                    { title: 'Advance Payment Received (LKR 260,000)', date: '2026-07-31 10:15', user: 'Accounts Dept', icon: 'fa-money-bill-wave', notes: 'Receipt #REC-2026-0089 issued.' },
                    { title: 'Material Issued to Workshop', date: '2026-07-31 11:00', user: 'Store Manager', icon: 'fa-boxes', notes: 'Matt Black Aluminium Profiles & 6mm Tempered Glass issued.' },
                    { title: 'Fabrication & Mitre Cutting Started', date: '2026-07-31 13:00', user: 'Bandara Team Lead', icon: 'fa-tools', notes: 'Corner joining in progress.' }
                ]
            },
            {
                id: 'ORD-2026-0002',
                quotationRef: 'QTN-2026-0004',
                customerId: 'CUST-2026-0002',
                customerName: 'Sunil Shantha Perera',
                customerPhone: '0755515862',
                projectName: 'Kottawa Villa Sliding Glass Enclosure',
                siteAddress: 'Plot 4, Highlevel Road, Kottawa',
                productName: 'Matt Black 3-Track Sliding Door',
                category: 'Sliding Doors',
                profileType: '70mm Architectural Series',
                colour: 'Matt Black Powder Coated',
                glassType: '8mm Tinted Dark Grey Glass',
                width: 3000,
                height: 2400,
                quantity: 1,
                sqft: 77.50,
                unitPrice: 3800,
                subtotal: 294500,
                discount: 10000,
                vatAmount: 51210,
                grandTotal: 335710,
                advancePayment: 335710,
                balance: 0,
                orderDate: '2026-07-29',
                expectedDate: '2026-08-08',
                priority: 'Normal',
                status: 'Completed',
                productionStatus: 'Ready',
                paymentStatus: 'Paid',
                assignedTeam: 'Kamal Lead Glazing & Assembly Team',
                remarks: 'Heavy duty rollers and multi-point mortise lock requested.',
                timeline: [
                    { title: 'Order Placed', date: '2026-07-29 10:00', user: 'Admin', icon: 'fa-plus-circle' },
                    { title: 'Full Payment Cleared', date: '2026-07-29 11:30', user: 'Accounts Dept', icon: 'fa-check-circle' },
                    { title: 'Fabrication Completed & QC Passed', date: '2026-07-30 16:00', user: 'Sunil QC', icon: 'fa-award' }
                ]
            }
        ];

        localStorage.setItem('alugrade_orders', JSON.stringify(defaults));
        return defaults;
    }

    saveOrders() {
        localStorage.setItem('alugrade_orders', JSON.stringify(this.orders));
    }

    render() {
        const container = document.getElementById('pageContent') || document.getElementById('mainContent') || document.getElementById('main-content') || document.body;
        
        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Order Management System</h2>
                    <p class="text-muted small mb-0">Track commercial orders, fabrication status, assigned production teams, and completion timelines</p>
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
                <li class="nav-item"><button class="nav-link active font-medium" onclick="window.orderModule.filterStatus('All', this)">All Orders (${this.orders.length})</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.orderModule.filterStatus('Pending', this)">Pending (${this.orders.filter(o=>o.status==='Pending').length})</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.orderModule.filterStatus('Approved', this)">Approved (${this.orders.filter(o=>o.status==='Approved').length})</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.orderModule.filterStatus('In Production', this)">In Production (${this.orders.filter(o=>o.status==='In Production').length})</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.orderModule.filterStatus('Completed', this)">Completed (${this.orders.filter(o=>o.status==='Completed').length})</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.orderModule.filterStatus('Delivered', this)">Delivered (${this.orders.filter(o=>o.status==='Delivered').length})</button></li>
            </ul>

            <!-- Main Filter & Search Panel -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="row g-3 mb-3 align-items-center">
                    <div class="col-md-4">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                            <input type="text" id="order-search" class="form-control border-start-0" placeholder="Search order#, customer, project, phone..." onkeyup="window.orderModule.handleSearch()">
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
                            <button class="btn btn-outline-secondary btn-sm" onclick="window.orderModule.exportPDF()"><i class="fas fa-file-pdf text-danger me-1"></i> PDF</button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="window.orderModule.exportExcel()"><i class="fas fa-file-excel text-success me-1"></i> CSV</button>
                        </div>
                    </div>
                </div>

                <!-- Enterprise Orders Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" id="orders-table">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Order# & Ref</th>
                                <th>Customer & Project</th>
                                <th>Expected Date</th>
                                <th>Priority</th>
                                <th>Assigned Team</th>
                                <th>Grand Total</th>
                                <th>Balance Due</th>
                                <th>Order Status</th>
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
            const statusBadge = {
                'Pending': 'bg-warning text-dark',
                'Approved': 'bg-primary',
                'In Production': 'bg-purple text-white',
                'Completed': 'bg-success',
                'Delivered': 'bg-info text-dark',
                'Cancelled': 'bg-danger'
            }[o.status] || 'bg-secondary';

            const priorityBadge = {
                'Normal': 'bg-light text-dark border',
                'High': 'bg-warning text-dark font-bold',
                'Urgent': 'bg-danger text-white font-bold'
            }[o.priority || 'Normal'] || 'bg-light text-dark';

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
                <td><span class="badge ${priorityBadge}">${o.priority || 'Normal'}</span></td>
                <td>
                    <div class="small font-medium text-main">${o.assignedTeam || 'Unassigned'}</div>
                </td>
                <td><strong>LKR ${(o.grandTotal || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                <td><strong class="${(o.balance || 0) > 0 ? 'text-danger' : 'text-success'}">LKR ${(o.balance || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                <td><span class="badge ${statusBadge}" style="${o.status==='In Production'?'background-color:#7C3AED;':''}">${o.status || 'Pending'}</span></td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" title="View Detail & Timeline" onclick="window.orderModule.renderDetail('${o.id}')">View</button>
                        <button class="btn btn-outline-secondary" title="Edit Order" onclick="window.orderModule.renderEditForm('${o.id}')">Edit</button>
                        <button class="btn btn-outline-danger" title="Delete" onclick="window.orderModule.delete('${o.id}')">Del</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    handleSearch() {
        this.loadOrdersData();
    }

    // 1-CLICK CONVERSION FROM APPROVED QUOTATION
    showConvertQuotationModal() {
        const modalId = 'convertQuotationModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-file-invoice text-primary me-2"></i> Convert Approved Quotation to Production Order
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <p class="text-muted small mb-3">Select an approved customer quotation to automatically convert it into a production order with 1 click.</p>
                            <div class="list-group">
                                <div class="list-group-item p-3 d-flex justify-content-between align-items-center" style="border-radius: 10px; border: 1px solid var(--color-border);">
                                    <div>
                                        <h6 class="mb-1 font-bold text-primary">QTN-2026-0001 - Jayasinghe Construction (Pvt) Ltd</h6>
                                        <p class="text-muted small mb-0">Project: Homagama Commercial Complex &nbsp;|&nbsp; Amount: <strong>LKR 513,300.00</strong></p>
                                    </div>
                                    <button class="btn btn-success font-medium" onclick="window.orderModule.convertQuotationToOrder('QTN-2026-0001')">
                                        <i class="fas fa-bolt me-1"></i> Convert to Order
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

    convertQuotationToOrder(quotationNumber) {
        const newOrderId = 'ORD-2026-' + (this.orders.length + 1).toString().padStart(4, '0');
        const newOrder = {
            id: newOrderId,
            quotationRef: quotationNumber,
            customerId: 'CUST-2026-0001',
            customerName: 'Jayasinghe Construction (Pvt) Ltd',
            customerPhone: '0771234567',
            projectName: 'Homagama Commercial Complex',
            siteAddress: 'Diyagama Road, Homagama',
            productName: 'Aluminium Doors & Partition Systems',
            category: 'Partitions',
            profileType: '100mm Heavy Duty Series',
            colour: 'Matt Black Powder Coated',
            glassType: '6mm Clear Tempered Glass',
            width: 2400,
            height: 2100,
            quantity: 4,
            sqft: 216.98,
            unitPrice: 2200,
            subtotal: 477356,
            discount: 15000,
            vatAmount: 83224,
            grandTotal: 545580,
            advancePayment: 260000,
            balance: 285580,
            orderDate: new Date().toISOString().split('T')[0],
            expectedDate: new Date(Date.now() + 14*86400000).toISOString().split('T')[0],
            priority: 'High',
            status: 'Approved',
            productionStatus: 'Material Ordered',
            paymentStatus: 'Partial',
            assignedTeam: 'Bandara Fabrication Team A',
            remarks: 'Converted with 1-click from quotation ' + quotationNumber,
            timeline: [
                { title: `Converted 1-Click from Quotation ${quotationNumber}`, date: new Date().toLocaleString(), user: 'Admin', icon: 'fa-bolt', notes: 'All items and pricing copied.' },
                { title: 'Order Status Set to Approved', date: new Date().toLocaleString(), user: 'Admin', icon: 'fa-check-circle', notes: 'Production queue updated.' }
            ]
        };

        this.orders.unshift(newOrder);
        this.saveOrders();

        const modalEl = document.getElementById('convertQuotationModal');
        if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            } else {
                modalEl.remove();
            }
        }

        alert(`Successfully converted ${quotationNumber} to Order ${newOrderId}!`);
        this.render();
    }

    renderNewForm() {
        this.renderFormModal();
    }

    renderEditForm(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            this.renderFormModal(order);
        } else {
            alert('Order not found');
        }
    }

    renderFormModal(order = null) {
        const isEdit = !!order;
        const modalId = 'orderFormModal';
        
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const newId = isEdit ? order.id : 'ORD-2026-' + (this.orders.length + 1).toString().padStart(4, '0');

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-boxes text-primary me-2"></i> ${isEdit ? 'Edit Order #' + newId : 'Create New Fabrication Order'}
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
                                        <label class="form-label font-medium">Customer Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="customerName" value="${order?.customerName || 'Jayasinghe Construction (Pvt) Ltd'}" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Customer Phone</label>
                                        <input type="tel" class="form-control" name="customerPhone" value="${order?.customerPhone || '0771234567'}">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Project Name</label>
                                        <input type="text" class="form-control" name="projectName" value="${order?.projectName || 'Homagama Villa Project'}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Order Status</label>
                                        <select class="form-select font-bold" name="status">
                                            <option value="Pending" ${order?.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                            <option value="Approved" ${order?.status === 'Approved' ? 'selected' : ''}>Approved</option>
                                            <option value="In Production" ${(!order || order?.status === 'In Production') ? 'selected' : ''}>In Production</option>
                                            <option value="Completed" ${order?.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                            <option value="Delivered" ${order?.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
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
                                        <input type="date" class="form-control" name="expectedDate" value="${order?.expectedDate || '2026-08-15'}">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Assigned Production Team</label>
                                        <select class="form-select" name="assignedTeam">
                                            ${this.productionTeams.map(t => `<option value="${t}" ${order?.assignedTeam === t ? 'selected' : ''}>${t}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Product / Fabrication Description</label>
                                        <input type="text" class="form-control" name="productName" value="${order?.productName || 'Aluminium Doors & Sliding Panels'}">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Grand Total (LKR)</label>
                                        <input type="number" class="form-control font-bold" name="grandTotal" value="${order?.grandTotal || 545580}">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Advance Paid (LKR)</label>
                                        <input type="number" class="form-control font-bold text-success" name="advancePayment" value="${order?.advancePayment || 260000}">
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
        data.balance = Math.max(0, data.grandTotal - data.advancePayment);

        const existingIndex = this.orders.findIndex(o => o.id === data.id);
        if (existingIndex >= 0) {
            this.orders[existingIndex] = { ...this.orders[existingIndex], ...data };
        } else {
            data.orderDate = new Date().toISOString().split('T')[0];
            data.timeline = [{ title: 'Order Created', date: new Date().toLocaleString(), user: 'Admin', icon: 'fa-plus-circle' }];
            this.orders.push(data);
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

        const container = document.getElementById('pageContent') || document.getElementById('mainContent') || document.getElementById('main-content') || document.body;

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

        const html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">Order Detail & Production Timeline</h2>
                    <p class="text-muted small mb-0">Order Reference: <strong>${order.id}</strong></p>
                </div>
                <div>
                    <button class="btn btn-outline-secondary me-2" onclick="window.orderModule.render()"><i class="fas fa-arrow-left me-1"></i> Back to Orders</button>
                    <button class="btn btn-warning me-2" onclick="window.orderModule.renderEditForm('${order.id}')"><i class="fas fa-edit me-1"></i> Edit Order</button>
                    <button class="btn btn-info text-white" onclick="window.orderModule.printOrder('${order.id}')"><i class="fas fa-print me-1"></i> Print Job Sheet</button>
                </div>
            </div>

            <!-- Summary Header Banner -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 5px solid var(--color-brand-blue); border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                <div class="row g-3">
                    <div class="col-md-6 border-end">
                        <h5 class="font-bold text-main mb-2">${order.customerName}</h5>
                        <p class="text-muted small mb-1"><i class="fas fa-project-diagram me-1"></i> Project: <strong>${order.projectName || 'Fabrication'}</strong></p>
                        <p class="text-muted small mb-1"><i class="fas fa-phone me-1"></i> Phone: ${order.customerPhone}</p>
                        <p class="text-muted small mb-0"><i class="fas fa-map-marker-alt me-1"></i> Site: ${order.siteAddress || 'N/A'}</p>
                    </div>
                    <div class="col-md-6 ps-4">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Order Status:</span>
                            <span class="badge bg-primary">${order.status}</span>
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

            <div class="row g-4">
                <!-- Left: Production Timeline & History -->
                <div class="col-md-7">
                    <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-stream text-primary me-2"></i> Production Order Timeline & Audit Log</h5>
                        <div class="timeline-container mt-3">
                            ${timelineHtml}
                        </div>
                    </div>
                </div>

                <!-- Right: Financial Breakdown -->
                <div class="col-md-5">
                    <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-calculator text-primary me-2"></i> Financial Summary</h5>
                        <div class="d-flex justify-content-between py-2 border-bottom">
                            <span>Subtotal Amount:</span>
                            <strong>LKR ${(order.subtotal || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</strong>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-bottom text-muted">
                            <span>Discount:</span>
                            <span>- LKR ${(order.discount || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-bottom">
                            <span>VAT (18%):</span>
                            <span>LKR ${(order.vatAmount || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-bottom fs-5 font-bold">
                            <span>Grand Total:</span>
                            <span class="text-primary">LKR ${(order.grandTotal || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-bottom text-success font-medium">
                            <span>Advance Paid:</span>
                            <span>LKR ${(order.advancePayment || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                        </div>
                        <div class="d-flex justify-content-between py-3 fs-5 font-bold text-danger">
                            <span>Balance Due:</span>
                            <span>LKR ${(order.balance || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    exportPDF() {
        alert("Exporting Orders summary to PDF...");
    }

    exportExcel() {
        alert("Exporting Orders summary to CSV...");
    }

    printOrder(orderId) {
        window.print();
    }
}

if (typeof window !== 'undefined') {
    window.OrderModule = OrderModule;
}
