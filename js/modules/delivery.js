/**
 * Delivery Management Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 */

class DeliveryModule {
    constructor(db, eventsManager) {
        this.db = db || window.DB || { deliveries: [], orders: [] };
        this.events = eventsManager || window.Events || {
            trigger: (event, data) => console.log(`Event: ${event}`, data),
            emit: (event, data) => console.log(`Event: ${event}`, data)
        };
        
        this.drivers = [
            { name: 'Sunil Shantha', vehicle: 'Isuzu Light Truck (WP GA-4512)', phone: '077 889 1234' },
            { name: 'Nimal Jayasinghe', vehicle: 'Nissan Flatbed Lorry (WP PY-8821)', phone: '071 445 6677' },
            { name: 'Kumara Silva', vehicle: 'Toyota TownAce Van (WP CB-1204)', phone: '075 223 9988' }
        ];

        this.deliveries = this.loadDeliveries();
    }

    loadDeliveries() {
        const stored = localStorage.getItem('alugrade_deliveries');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) { return []; }
        }

        // Default enterprise delivery records
        const defaults = [
            {
                dnNo: 'DN-2026-0001',
                jobNo: 'JOB-2026-0002',
                orderNo: 'ORD-2026-0002',
                customerName: 'Sunil Shantha Perera',
                customerPhone: '0755515862',
                projectName: 'Kottawa Villa Sliding Glass Enclosure',
                deliveryAddress: 'Plot 4, Highlevel Road, Kottawa',
                deliveryDate: '2026-07-31',
                deliveryTime: '10:30 AM',
                driverName: 'Sunil Shantha',
                vehicleNo: 'Isuzu Light Truck (WP GA-4512)',
                contactPerson: 'Mr. Sunil Perera (075 551 5862)',
                status: 'Delivered',
                notes: 'Fragile 8mm Tinted Glass panels. Unload with suction cups.',
                items: [
                    { description: 'Matt Black 3-Track Sliding Glass Door Frame', qty: 1, unit: 'Set', specs: '3000mm x 2400mm' },
                    { description: '8mm Tinted Dark Grey Toughened Glass Panels', qty: 3, unit: 'Panels', specs: 'Glazed & Sealed' },
                    { description: 'Heavy Duty Mortise Lockset & Rollers Accessories', qty: 1, unit: 'Box', specs: 'Hardware Pack' }
                ],
                acknowledgement: {
                    receivedBy: 'Sunil Shantha Perera',
                    nicNo: '197514209876',
                    receivedTime: '2026-07-31 11:15 AM',
                    status: 'Acknowledged & Signed'
                },
                timeline: [
                    { title: 'Delivery Scheduled', date: '2026-07-31 08:30 AM', user: 'Logistics Desk', notes: 'Vehicle WP GA-4512 assigned.' },
                    { title: 'Dispatched & Out for Delivery', date: '2026-07-31 09:45 AM', user: 'Driver Sunil', notes: 'En route to Kottawa site.' },
                    { title: 'Delivered & Customer Acknowledged', date: '2026-07-31 11:15 AM', user: 'Driver Sunil', notes: 'Signed by Mr. Sunil Perera.' }
                ]
            },
            {
                dnNo: 'DN-2026-0002',
                jobNo: 'JOB-2026-0001',
                orderNo: 'ORD-2026-0001',
                customerName: 'Jayasinghe Construction (Pvt) Ltd',
                customerPhone: '0771234567',
                projectName: 'Homagama Commercial Complex',
                deliveryAddress: 'Diyagama Road, Homagama',
                deliveryDate: '2026-08-05',
                deliveryTime: '02:00 PM',
                driverName: 'Nimal Jayasinghe',
                vehicleNo: 'Nissan Flatbed Lorry (WP PY-8821)',
                contactPerson: 'Mr. K. Jayasinghe (077 123 4567)',
                status: 'Scheduled',
                notes: 'Call site manager 30 mins before arrival for crane unloading.',
                items: [
                    { description: '100mm Heavy Duty Aluminium Partition Framing', qty: 4, unit: 'Frames', specs: '2400mm x 2100mm' },
                    { description: '6mm Clear Tempered Glass Sheets', qty: 8, unit: 'Sheets', specs: 'Crated' }
                ],
                acknowledgement: {
                    receivedBy: 'Pending Dispatch',
                    nicNo: '-',
                    receivedTime: '-',
                    status: 'Pending Receipt'
                },
                timeline: [
                    { title: 'Delivery Scheduled', date: '2026-07-31 14:00', user: 'Logistics Planner', notes: 'Scheduled for Aug 5 dispatch.' }
                ]
            }
        ];

        localStorage.setItem('alugrade_deliveries', JSON.stringify(defaults));
        return defaults;
    }

    saveDeliveries() {
        localStorage.setItem('alugrade_deliveries', JSON.stringify(this.deliveries));
    }

    async render() {
        const container = document.getElementById('pageContent') || document.getElementById('mainContent') || document.getElementById('main-content') || document.body;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Delivery & Logistics Management</h2>
                    <p class="text-muted small mb-0">Manage delivery notes, driver dispatches, vehicle allocations, and customer acknowledgements</p>
                </div>
                <button class="btn btn-primary" onclick="window.deliveryModule.renderNewDeliveryModal()">
                    <i class="fas fa-truck me-1"></i> + Create Delivery Note
                </button>
            </div>

            <!-- Summary Metric Cards -->
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid var(--color-brand-blue); border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Total Delivery Notes</div>
                        <h3 class="mb-0 font-bold text-main mt-1" id="stat-total-dn">${this.deliveries.length}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #F59E0B; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Scheduled & Dispatched</div>
                        <h3 class="mb-0 font-bold text-warning mt-1" id="stat-scheduled-dn">${this.deliveries.filter(d => d.status === 'Scheduled' || d.status === 'Out for Delivery').length}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #10B981; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Successfully Delivered</div>
                        <h3 class="mb-0 font-bold text-success mt-1" id="stat-delivered-dn">${this.deliveries.filter(d => d.status === 'Delivered').length}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #EF4444; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Pending Dispatches</div>
                        <h3 class="mb-0 font-bold text-danger mt-1" id="stat-pending-dn">${this.deliveries.filter(d => d.status === 'Pending').length}</h3>
                    </div>
                </div>
            </div>

            <!-- Main Filter & Search Panel -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="row g-3 mb-3 align-items-center">
                    <div class="col-md-4">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                            <input type="text" id="del-search" class="form-control border-start-0" placeholder="Search DN#, order#, customer, driver..." onkeyup="window.deliveryModule.handleSearch()">
                        </div>
                    </div>

                    <div class="col-md-3">
                        <select id="statusFilter" class="form-select" onchange="window.deliveryModule.handleSearch()">
                            <option value="">All Delivery Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div class="col-md-3">
                        <select id="driverFilter" class="form-select" onchange="window.deliveryModule.handleSearch()">
                            <option value="">All Drivers / Vehicles</option>
                            ${this.drivers.map(d => `<option value="${d.name}">${d.name} (${d.vehicle})</option>`).join('')}
                        </select>
                    </div>

                    <div class="col-md-2 text-end">
                        <button class="btn btn-outline-secondary btn-sm" onclick="window.deliveryModule.exportCSV()"><i class="fas fa-file-excel text-success me-1"></i> Export CSV</button>
                    </div>
                </div>

                <!-- Professional Delivery Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" id="delivery-table">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Delivery Note#</th>
                                <th>Linked Order / Job</th>
                                <th>Customer & Site Address</th>
                                <th>Delivery Date & Time</th>
                                <th>Driver & Vehicle</th>
                                <th>Status</th>
                                <th>Acknowledgement</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="delivery-tbody">
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.loadDeliveriesData();
    }

    loadDeliveriesData() {
        const query = document.getElementById('del-search')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const driverFilter = document.getElementById('driverFilter')?.value || '';

        let filtered = this.deliveries;

        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(d => 
                (d.dnNo && d.dnNo.toLowerCase().includes(q)) ||
                (d.orderNo && d.orderNo.toLowerCase().includes(q)) ||
                (d.customerName && d.customerName.toLowerCase().includes(q)) ||
                (d.driverName && d.driverName.toLowerCase().includes(q))
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(d => d.status === statusFilter);
        }

        if (driverFilter) {
            filtered = filtered.filter(d => d.driverName === driverFilter);
        }

        this.renderTableData(filtered);
    }

    renderTableData(deliveries) {
        const tbody = document.getElementById('delivery-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (deliveries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">No delivery notes matching criteria.</td></tr>';
            return;
        }

        deliveries.forEach(d => {
            const statusBadge = {
                'Pending': 'bg-warning text-dark',
                'Scheduled': 'bg-primary',
                'Out for Delivery': 'bg-purple text-white',
                'Delivered': 'bg-success',
                'Cancelled': 'bg-danger'
            }[d.status] || 'bg-secondary';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong class="text-primary">${d.dnNo}</strong></td>
                <td>
                    <div class="font-bold text-main">${d.orderNo}</div>
                    <div class="small text-muted"><i class="fas fa-link me-1"></i>${d.jobNo || 'N/A'}</div>
                </td>
                <td>
                    <div class="font-bold text-main">${d.customerName}</div>
                    <div class="small text-muted text-truncate" style="max-width:200px;"><i class="fas fa-map-marker-alt me-1"></i>${d.deliveryAddress}</div>
                </td>
                <td>
                    <div>${d.deliveryDate}</div>
                    <div class="small text-muted"><i class="fas fa-clock me-1"></i>${d.deliveryTime || '10:00 AM'}</div>
                </td>
                <td>
                    <div class="small font-bold text-main">${d.driverName || 'Unassigned'}</div>
                    <div class="small text-muted">${d.vehicleNo || ''}</div>
                </td>
                <td><span class="badge ${statusBadge}" style="${d.status==='Out for Delivery'?'background-color:#7C3AED;':''}">${d.status}</span></td>
                <td>
                    <span class="badge ${d.acknowledgement?.status==='Acknowledged & Signed'?'bg-success':'bg-light text-dark border'}">
                        ${d.acknowledgement?.status || 'Pending'}
                    </span>
                </td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="window.deliveryModule.renderDeliveryDetail('${d.dnNo}')">View</button>
                        <button class="btn btn-outline-info" onclick="window.deliveryModule.printDeliveryNote('${d.dnNo}')">Print</button>
                        ${d.status !== 'Delivered' ? `<button class="btn btn-outline-success" onclick="window.deliveryModule.markAsDelivered('${d.dnNo}')">Deliver</button>` : ''}
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    handleSearch() {
        this.loadDeliveriesData();
    }

    markAsDelivered(dnNo) {
        const del = this.deliveries.find(d => d.dnNo === dnNo);
        if (!del) return;

        const recipientName = prompt("Enter Customer Recipient Name:", del.customerName);
        if (recipientName) {
            del.status = 'Delivered';
            del.acknowledgement = {
                receivedBy: recipientName,
                receivedTime: new Date().toLocaleString(),
                status: 'Acknowledged & Signed'
            };

            del.timeline.push({
                title: 'Delivered & Customer Signed',
                date: new Date().toLocaleString(),
                user: del.driverName || 'Driver',
                notes: `Receipt signed by ${recipientName}`
            });

            this.saveDeliveries();
            alert(`Delivery Note ${dnNo} marked as DELIVERED!`);
            this.render();
        }
    }

    renderNewDeliveryModal() {
        const modalId = 'newDeliveryModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const newDnNo = 'DN-2026-' + (this.deliveries.length + 1).toString().padStart(4, '0');

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-truck text-primary me-2"></i> Create New Delivery Note
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="new-delivery-form">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Delivery Note Number</label>
                                        <input type="text" class="form-control bg-light font-bold text-primary" name="dnNo" value="${newDnNo}" readonly>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Linked Order Number <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="orderNo" value="ORD-2026-0001" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Production Job Number</label>
                                        <input type="text" class="form-control" name="jobNo" value="JOB-2026-0001">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Customer Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="customerName" value="Jayasinghe Construction (Pvt) Ltd" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Contact Person & Phone <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="contactPerson" value="Mr. K. Jayasinghe (077 123 4567)" required>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Site Delivery Address <span class="text-danger">*</span></label>
                                        <textarea class="form-control" name="deliveryAddress" rows="2" required>Homagama Commercial Complex Site, Diyagama Road, Homagama</textarea>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Delivery Date</label>
                                        <input type="date" class="form-control" name="deliveryDate" value="${new Date().toISOString().split('T')[0]}">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Delivery Time Slot</label>
                                        <input type="text" class="form-control" name="deliveryTime" value="10:30 AM">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Assigned Driver & Vehicle</label>
                                        <select class="form-select" name="driverName" onchange="window.deliveryModule.updateVehicleSelection(this)">
                                            ${this.drivers.map(d => `<option value="${d.name}">${d.name} - ${d.vehicle}</option>`).join('')}
                                        </select>
                                        <input type="hidden" name="vehicleNo" id="hiddenVehicleNo" value="${this.drivers[0].vehicle}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Special Delivery Notes</label>
                                        <textarea class="form-control" name="notes" rows="2" placeholder="e.g. Handle with care, suction cups required..."></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="window.deliveryModule.handleSaveDelivery()">
                                <i class="fas fa-check me-1"></i> Issue Delivery Note
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

    updateVehicleSelection(selectEl) {
        const driver = this.drivers.find(d => d.name === selectEl.value);
        if (driver) {
            document.getElementById('hiddenVehicleNo').value = driver.vehicle;
        }
    }

    handleSaveDelivery() {
        const form = document.getElementById('new-delivery-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.status = 'Scheduled';
        data.items = [
            { description: 'Aluminium Framing & Partition Fitting', qty: 1, unit: 'Set', specs: 'As Per Order Specs' }
        ];
        data.acknowledgement = { receivedBy: 'Pending Dispatch', status: 'Pending Receipt' };
        data.timeline = [{ title: 'Delivery Scheduled', date: new Date().toLocaleString(), user: 'Logistics Manager', notes: 'Scheduled for dispatch.' }];

        this.deliveries.unshift(data);
        this.saveDeliveries();

        const modalEl = document.getElementById('newDeliveryModal');
        if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            } else {
                modalEl.remove();
            }
        }

        alert(`Delivery Note ${data.dnNo} created successfully!`);
        this.render();
    }

    renderDeliveryDetail(dnNo) {
        const del = this.deliveries.find(d => d.dnNo === dnNo);
        if (!del) {
            alert('Delivery note record not found');
            return;
        }

        const container = document.getElementById('pageContent') || document.getElementById('mainContent') || document.getElementById('main-content') || document.body;

        const html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">Delivery Note & Dispatch Slip</h2>
                    <p class="text-muted small mb-0">Delivery Note: <strong>${del.dnNo}</strong> &nbsp;|&nbsp; Linked Order: <strong>${del.orderNo}</strong></p>
                </div>
                <div>
                    <button class="btn btn-outline-secondary me-2" onclick="window.deliveryModule.render()"><i class="fas fa-arrow-left me-1"></i> Back to Delivery List</button>
                    <button class="btn btn-primary me-2" onclick="window.deliveryModule.printDeliveryNote('${del.dnNo}')"><i class="fas fa-print me-1"></i> Print Delivery Note</button>
                </div>
            </div>

            <!-- Printable Delivery Note Card -->
            <div class="card p-5 mb-4" id="printable-delivery-note" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                <!-- Header with ALUGRADE Logo Container -->
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
                        <h3 class="font-bold text-primary mb-1">DELIVERY NOTE</h3>
                        <div class="fs-5 font-bold text-main">${del.dnNo}</div>
                        <span class="badge bg-primary font-bold mt-1">${del.status}</span>
                    </div>
                </div>

                <!-- Customer & Dispatch Metadata -->
                <div class="row g-4 mb-4">
                    <div class="col-md-6 border-end">
                        <h6 class="font-bold text-main uppercase small mb-2">Delivery Recipient Details:</h6>
                        <h5 class="font-bold text-main mb-1">${del.customerName}</h5>
                        <p class="small text-muted mb-1"><i class="fas fa-user me-1"></i> Contact Person: <strong>${del.contactPerson || 'Site Representative'}</strong></p>
                        <p class="small text-muted mb-0"><i class="fas fa-map-marker-alt me-1"></i> Site Address: <strong>${del.deliveryAddress}</strong></p>
                    </div>
                    <div class="col-md-6 ps-4">
                        <h6 class="font-bold text-main uppercase small mb-2">Dispatch & Transport Metadata:</h6>
                        <div class="d-flex justify-content-between small mb-1">
                            <span class="text-muted">Delivery Date & Time:</span>
                            <strong>${del.deliveryDate} (${del.deliveryTime || '10:00 AM'})</strong>
                        </div>
                        <div class="d-flex justify-content-between small mb-1">
                            <span class="text-muted">Driver Name:</span>
                            <strong>${del.driverName || 'Unassigned'}</strong>
                        </div>
                        <div class="d-flex justify-content-between small mb-1">
                            <span class="text-muted">Vehicle Registration:</span>
                            <strong>${del.vehicleNo || 'N/A'}</strong>
                        </div>
                        <div class="d-flex justify-content-between small mb-0">
                            <span class="text-muted">Linked Order#:</span>
                            <strong class="text-primary">${del.orderNo}</strong>
                        </div>
                    </div>
                </div>

                <!-- Delivered Items Table -->
                <h6 class="font-bold text-main uppercase small mb-2">Delivered Fabrication Items:</h6>
                <div class="table-responsive mb-4">
                    <table class="table table-bordered align-middle text-sm mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>#</th>
                                <th>Item Description</th>
                                <th>Specifications & Dimensions</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(del.items || []).map((item, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td><strong>${item.description}</strong></td>
                                    <td>${item.specs}</td>
                                    <td><strong>${item.qty}</strong></td>
                                    <td>${item.unit}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Customer Acknowledgement & Official Signature Block -->
                <div class="row g-4 pt-4 border-top">
                    <div class="col-md-6">
                        <h6 class="font-bold text-main uppercase small mb-3">Customer Acknowledgement & Receipt:</h6>
                        <p class="small text-muted mb-3">I hereby confirm that all fabrication items listed above have been received in good condition without damage.</p>
                        <div class="p-3 bg-light rounded" style="border: 1px border-dashed #cbd5e1;">
                            <div class="small mb-1">Received By Name: <strong>${del.acknowledgement?.receivedBy || '___________________________'}</strong></div>
                            <div class="small mb-1">NIC / ID Number: <strong>${del.acknowledgement?.nicNo || '___________________________'}</strong></div>
                            <div class="small">Received Timestamp: <strong>${del.acknowledgement?.receivedTime || '____/____/2026'}</strong></div>
                        </div>
                    </div>

                    <div class="col-md-6 text-end">
                        <h6 class="font-bold text-main uppercase small mb-3">Authorized Issuer Signature:</h6>
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

    printDeliveryNote(dnNo) {
        window.print();
    }

    exportCSV() {
        let csv = "Delivery Note#,Order#,Customer,Delivery Date,Driver,Vehicle,Status\n";
        this.deliveries.forEach(d => {
            csv += `${d.dnNo},${d.orderNo},"${d.customerName}",${d.deliveryDate},"${d.driverName}","${d.vehicleNo}",${d.status}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ALUGRADE_Delivery_Notes_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

if (typeof window !== 'undefined') {
    window.DeliveryModule = DeliveryModule;
}
