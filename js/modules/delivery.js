/**
 * Delivery Management Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 * Full Logistics Workflow: Production Completed -> Delivery Note (DN) -> Date & Team Assignment -> Dispatch -> Customer Acknowledgement -> Installation -> Delivery Completed -> Ready for Invoice
 */

class DeliveryModule {
    constructor(db, eventsManager) {
        this.db = db || window.DB || {};
        this.events = eventsManager || window.Events || {
            trigger: () => {},
            emit: () => {}
        };
        this.containerId = 'pageContent';

        this.deliveryStatuses = [
            'Scheduled',
            'Dispatched',
            'Delivered',
            'Completed',
            'Ready for Invoice',
            'Cancelled'
        ];

        this.installationStatuses = [
            'Pending Installation',
            'Installation In Progress',
            'Installed & Tested',
            'Handover Signed'
        ];

        this.drivers = [
            { name: 'Sunil Shantha', vehicle: 'Isuzu 4-Ton Flatbed Lorry (WP GA-4512)', phone: '077 889 1234' },
            { name: 'Nimal Jayasinghe', vehicle: 'Nissan Light Cargo Truck (WP PY-8821)', phone: '071 445 6677' },
            { name: 'Kumara Silva', vehicle: 'Toyota TownAce Covered Van (WP CB-1204)', phone: '075 223 9988' }
        ];

        this.deliveryTeams = [
            'Logistics Unit 1 - Homagama Base',
            'Logistics Unit 2 - Kottawa Site Crew',
            'Specialist Glazing Transport Team'
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
                contactPerson: 'Mr. Sunil Perera (075 551 5862)',
                projectName: 'Kottawa Villa Sliding Glass Enclosure',
                deliveryAddress: 'Plot 4, Highlevel Road, Kottawa',
                deliveryDate: '2026-07-31',
                deliveryTime: '10:30 AM',
                deliveryTeam: 'Logistics Unit 2 - Kottawa Site Crew',
                driverName: 'Sunil Shantha',
                vehicleNo: 'Isuzu 4-Ton Flatbed Lorry (WP GA-4512)',
                status: 'Completed',
                installationStatus: 'Handover Signed',
                notes: 'Fragile 8mm Tinted Glass panels. Suction cup handles used for unloading.',
                items: [
                    { description: 'Matt Black 3-Track Sliding Glass Door Frame', qty: 1, unit: 'Set', specs: '3000mm x 2400mm (SwissTek)' },
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
                    { title: 'Delivered & Customer Acknowledged', date: '2026-07-31 11:15 AM', user: 'Driver Sunil', notes: 'Signed by Mr. Sunil Perera.' },
                    { title: 'Installation & Handover Completed', date: '2026-07-31 04:00 PM', user: 'Installation Lead', notes: 'Handover certificate signed. Ready for Final Invoice.' }
                ]
            },
            {
                dnNo: 'DN-2026-0002',
                jobNo: 'JOB-2026-0001',
                orderNo: 'ORD-2026-0001',
                customerName: 'Jayasinghe Construction (Pvt) Ltd',
                customerPhone: '0771234567',
                contactPerson: 'Mr. K. Jayasinghe (077 123 4567)',
                projectName: 'Homagama Commercial Complex',
                deliveryAddress: 'Diyagama Road, Homagama',
                deliveryDate: '2026-08-05',
                deliveryTime: '02:00 PM',
                deliveryTeam: 'Logistics Unit 1 - Homagama Base',
                driverName: 'Nimal Jayasinghe',
                vehicleNo: 'Nissan Light Cargo Truck (WP PY-8821)',
                status: 'Dispatched',
                installationStatus: 'Pending Installation',
                notes: 'Call site manager 30 mins before arrival for crane unloading.',
                items: [
                    { description: '100mm Heavy Duty Aluminium Partition Framing', qty: 4, unit: 'Frames', specs: '2400mm x 2100mm (Alumex)' },
                    { description: '6mm Clear Tempered Glass Sheets', qty: 8, unit: 'Sheets', specs: 'Crated Safety Glass' }
                ],
                acknowledgement: {
                    receivedBy: 'Pending Arrival',
                    nicNo: '-',
                    receivedTime: '-',
                    status: 'Pending Receipt'
                },
                timeline: [
                    { title: 'Delivery Scheduled', date: '2026-07-31 14:00', user: 'Logistics Planner', notes: 'Scheduled for dispatch.' },
                    { title: 'Vehicle Dispatched', date: '2026-08-05 13:30', user: 'Driver Nimal', notes: 'Dispatched from workshop gate.' }
                ]
            }
        ];

        localStorage.setItem('alugrade_deliveries', JSON.stringify(defaults));
        return defaults;
    }

    saveDeliveries() {
        localStorage.setItem('alugrade_deliveries', JSON.stringify(this.deliveries));
    }

    generateDnNo() {
        const year = new Date().getFullYear();
        const count = this.deliveries.length + 1;
        return `DN-${year}-${count.toString().padStart(4, '0')}`;
    }

    getStatusColor(status) {
        const colors = {
            'Scheduled': 'info',
            'Dispatched': 'warning text-dark',
            'Delivered': 'primary',
            'Completed': 'purple text-white',
            'Ready for Invoice': 'success',
            'Cancelled': 'danger'
        };
        return colors[status] || 'secondary';
    }

    render() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        const countScheduled = this.deliveries.filter(d => d.status === 'Scheduled').length;
        const countDispatched = this.deliveries.filter(d => d.status === 'Dispatched').length;
        const countDelivered = this.deliveries.filter(d => d.status === 'Delivered').length;
        const countCompleted = this.deliveries.filter(d => d.status === 'Completed' || d.status === 'Ready for Invoice').length;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Delivery & Logistics Management</h2>
                    <p class="text-muted small mb-0">Full Logistics Workflow: Production Completed → Create Delivery Note → Assign Team → Dispatch → Customer Receipt → Installation → Ready for Invoice</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="window.deliveryModule.showConvertJobModal()">
                        <i class="fas fa-truck-loading text-primary me-1"></i> Issue DN from Production Job
                    </button>
                    <button class="btn btn-primary" onclick="window.deliveryModule.renderNewDeliveryModal()">
                        <i class="fas fa-plus-circle me-1"></i> + Create Delivery Note
                    </button>
                </div>
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
                        <div class="text-muted small uppercase font-medium">Dispatched En Route</div>
                        <h3 class="mb-0 font-bold text-warning mt-1" id="stat-dispatched-dn">${countDispatched}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #3B82F6; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Delivered to Site</div>
                        <h3 class="mb-0 font-bold text-primary mt-1" id="stat-delivered-dn">${countDelivered}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #10B981; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Ready for Invoice</div>
                        <h3 class="mb-0 font-bold text-success mt-1" id="stat-completed-dn">${countCompleted}</h3>
                    </div>
                </div>
            </div>

            <!-- Main Filter & Search Panel -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="row g-3 mb-3 align-items-center">
                    <div class="col-md-4">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                            <input type="text" id="del-search" class="form-control border-start-0" placeholder="Search DN#, Job#, Order#, customer, site address..." onkeyup="window.deliveryModule.handleSearch()">
                        </div>
                    </div>

                    <div class="col-md-3">
                        <select id="statusFilter" class="form-select" onchange="window.deliveryModule.handleSearch()">
                            <option value="">All Delivery Statuses</option>
                            ${this.deliveryStatuses.map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                    </div>

                    <div class="col-md-3">
                        <select id="driverFilter" class="form-select" onchange="window.deliveryModule.handleSearch()">
                            <option value="">All Drivers / Vehicles</option>
                            ${this.drivers.map(d => `<option value="${d.name}">${d.name} (${d.vehicle})</option>`).join('')}
                        </select>
                    </div>

                    <div class="col-md-2 text-end">
                        <button class="btn btn-outline-secondary btn-sm" onclick="window.deliveryModule.exportCSV()"><i class="fas fa-file-excel text-success me-1"></i> CSV</button>
                    </div>
                </div>

                <!-- Professional Delivery Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" id="delivery-table">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Delivery Note#</th>
                                <th>Linked Order & Job</th>
                                <th>Customer & Site Address</th>
                                <th>Delivery Date & Time</th>
                                <th>Driver & Vehicle</th>
                                <th>Installation Status</th>
                                <th>Delivery Status</th>
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
                (d.jobNo && d.jobNo.toLowerCase().includes(q)) ||
                (d.customerName && d.customerName.toLowerCase().includes(q)) ||
                (d.deliveryAddress && d.deliveryAddress.toLowerCase().includes(q)) ||
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
                'Scheduled': 'bg-info text-white',
                'Dispatched': 'bg-warning text-dark',
                'Delivered': 'bg-primary text-white',
                'Completed': 'bg-purple text-white',
                'Ready for Invoice': 'bg-success text-white',
                'Cancelled': 'bg-danger text-white'
            }[d.status] || 'bg-secondary';

            const installBadge = {
                'Pending Installation': 'bg-light text-dark border',
                'Installation In Progress': 'bg-warning text-dark',
                'Installed & Tested': 'bg-info text-white',
                'Handover Signed': 'bg-success text-white'
            }[d.installationStatus || 'Pending Installation'] || 'bg-light text-dark';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong class="text-primary">${d.dnNo}</strong></td>
                <td>
                    <div class="font-bold text-main">${d.orderNo || '-'}</div>
                    <div class="small text-muted"><i class="fas fa-link me-1"></i>${d.jobNo || 'N/A'}</div>
                </td>
                <td>
                    <div class="font-bold text-main">${d.customerName}</div>
                    <div class="small text-muted text-truncate" style="max-width:220px;" title="${d.deliveryAddress}"><i class="fas fa-map-marker-alt me-1"></i>${d.deliveryAddress}</div>
                </td>
                <td>
                    <div>${d.deliveryDate}</div>
                    <div class="small text-muted"><i class="fas fa-clock me-1"></i>${d.deliveryTime || '10:00 AM'}</div>
                </td>
                <td>
                    <div class="small font-bold text-main">${d.driverName || 'Unassigned'}</div>
                    <div class="small text-muted text-truncate" style="max-width:160px;" title="${d.vehicleNo || ''}">${d.vehicleNo || ''}</div>
                </td>
                <td><span class="badge ${installBadge}">${d.installationStatus || 'Pending Installation'}</span></td>
                <td><span class="badge ${statusBadge}">${d.status}</span></td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="window.deliveryModule.renderDeliveryDetail('${d.dnNo}')">View</button>
                        <button class="btn btn-outline-secondary" onclick="window.deliveryModule.renderEditDeliveryModal('${d.dnNo}')">Edit</button>
                        <button class="btn btn-outline-info" onclick="window.deliveryModule.printDeliveryNote('${d.dnNo}')" title="Print Delivery Note"><i class="fas fa-print"></i></button>
                        <button class="btn btn-outline-danger" onclick="window.deliveryModule.deleteDelivery('${d.dnNo}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    handleSearch() {
        this.loadDeliveriesData();
    }

    markAsDispatched(dnNo) {
        const del = this.deliveries.find(d => d.dnNo === dnNo);
        if (!del) return;

        del.status = 'Dispatched';
        del.timeline = del.timeline || [];
        del.timeline.push({
            title: 'Vehicle Dispatched Out for Delivery',
            date: new Date().toLocaleString(),
            user: del.driverName || 'Logistics Driver',
            notes: `Dispatched in vehicle ${del.vehicleNo || 'assigned truck'}.`
        });

        this.saveDeliveries();
        alert(`Delivery Note ${dnNo} marked as DISPATCHED!`);
        this.renderDeliveryDetail(dnNo);
    }

    markAsDelivered(dnNo) {
        const del = this.deliveries.find(d => d.dnNo === dnNo);
        if (!del) return;

        const recipientName = prompt("Enter Customer Recipient Name:", del.customerName);
        if (recipientName) {
            del.status = 'Delivered';
            del.acknowledgement = {
                receivedBy: recipientName,
                nicNo: del.acknowledgement?.nicNo || '198514209812',
                receivedTime: new Date().toLocaleString(),
                status: 'Acknowledged & Signed'
            };

            del.timeline = del.timeline || [];
            del.timeline.push({
                title: 'Delivered to Site & Customer Acknowledged',
                date: new Date().toLocaleString(),
                user: del.driverName || 'Driver',
                notes: `Signed & received by ${recipientName}.`
            });

            this.saveDeliveries();
            alert(`Delivery Note ${dnNo} marked as DELIVERED!`);
            this.renderDeliveryDetail(dnNo);
        }
    }

    markAsCompleted(dnNo) {
        const del = this.deliveries.find(d => d.dnNo === dnNo);
        if (!del) return;

        del.status = 'Ready for Invoice';
        del.installationStatus = 'Handover Signed';
        del.timeline = del.timeline || [];
        del.timeline.push({
            title: 'Installation Passed & Handover Signed',
            date: new Date().toLocaleString(),
            user: 'Site Engineer',
            notes: 'Site installation completed. Ready for Final Invoice Module.'
        });

        this.saveDeliveries();
        alert(`Delivery Note ${dnNo} completed and unlocked for INVOICE MODULE!`);
        this.renderDeliveryDetail(dnNo);
    }

    createDeliveryFromJob(job) {
        if (!job) return;
        const newDnNo = this.generateDnNo();

        const items = [];
        if (job.items && job.items.length > 0) {
            job.items.forEach(i => {
                items.push({
                    description: i.description,
                    qty: i.qty || 1,
                    unit: 'Sets',
                    specs: `${i.alumSection || 'Section'} | ${i.glassType || 'Glass'} (${i.width || 1000}×${i.height || 1000}mm)`
                });
            });
        } else {
            items.push({
                description: job.productSpecs || 'Architectural Fabrication Package',
                qty: 1,
                unit: 'Set',
                specs: 'As Per Technical Drawings'
            });
        }

        const newDelivery = {
            dnNo: newDnNo,
            jobNo: job.jobNo,
            orderNo: job.orderNo || '',
            customerName: job.customerName || 'Direct Client',
            customerPhone: job.customerPhone || '',
            contactPerson: `${job.customerName} (${job.customerPhone || 'N/A'})`,
            projectName: job.projectName || 'Fabrication Project',
            deliveryAddress: job.siteAddress || 'Customer Site Location',
            deliveryDate: new Date().toISOString().split('T')[0],
            deliveryTime: '10:30 AM',
            deliveryTeam: 'Logistics Unit 1 - Homagama Base',
            driverName: this.drivers[0].name,
            vehicleNo: this.drivers[0].vehicle,
            status: 'Scheduled',
            installationStatus: 'Pending Installation',
            notes: job.notes || 'Handle glass panels with suction cups.',
            items: items,
            acknowledgement: {
                receivedBy: 'Pending Arrival',
                nicNo: '-',
                receivedTime: '-',
                status: 'Pending Receipt'
            },
            timeline: [
                { title: 'Delivery Note Issued', date: new Date().toLocaleString(), user: 'Logistics Manager', notes: `Created 1-click from Production Job ${job.jobNo}.` }
            ]
        };

        this.deliveries.unshift(newDelivery);
        this.saveDeliveries();
        this.renderDeliveryDetail(newDnNo);
    }

    showConvertJobModal() {
        const jobs = JSON.parse(localStorage.getItem('alugrade_production_jobs') || '[]');

        const modalId = 'convertJobModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const listItemsHtml = jobs.length > 0 ? jobs.map(j => `
            <div class="list-group-item p-3 d-flex justify-content-between align-items-center mb-2" style="border-radius: 10px; border: 1px solid var(--color-border);">
                <div>
                    <h6 class="mb-1 font-bold text-primary">${j.jobNo} - ${j.customerName}</h6>
                    <p class="text-muted small mb-0">Order: ${j.orderNo} &nbsp;|&nbsp; Stage: <strong>${j.stage}</strong> &nbsp;|&nbsp; Specs: <strong>${j.productSpecs}</strong></p>
                </div>
                <button class="btn btn-success btn-sm font-medium" onclick="window.deliveryModule.convertJobToDelivery('${j.jobNo}')">
                    <i class="fas fa-truck me-1"></i> Issue Delivery Note
                </button>
            </div>
        `).join('') : '<p class="text-muted p-3 text-center">No active production jobs found.</p>';

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-truck-loading text-primary me-2"></i> Issue Delivery Note from Production Job
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <p class="text-muted small mb-3">Select a completed or active workshop job card to automatically generate its delivery note, gate pass items, and site recipient details.</p>
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

    convertJobToDelivery(jobNo) {
        const jobs = JSON.parse(localStorage.getItem('alugrade_production_jobs') || '[]');
        const job = jobs.find(j => j.jobNo === jobNo);

        if (job) {
            const modalEl = document.getElementById('convertJobModal');
            if (modalEl) {
                if (window.bootstrap && window.bootstrap.Modal) {
                    const modal = window.bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                } else {
                    modalEl.remove();
                }
            }
            this.createDeliveryFromJob(job);
        } else {
            alert('Production Job record not found');
        }
    }

    renderNewDeliveryModal() {
        this.renderFormModal();
    }

    renderEditDeliveryModal(dnNo) {
        const del = this.deliveries.find(d => d.dnNo === dnNo);
        if (del) {
            this.renderFormModal(del);
        } else {
            alert('Delivery note record not found');
        }
    }

    renderFormModal(del = null) {
        const isEdit = !!del;
        const modalId = 'deliveryFormModal';

        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const newDnNo = isEdit ? del.dnNo : this.generateDnNo();

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-truck text-primary me-2"></i> ${isEdit ? 'Edit Delivery Note #' + newDnNo : 'Create New Delivery Note & Gate Pass'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="delivery-form">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Delivery Note Number</label>
                                        <input type="text" class="form-control bg-light font-bold text-primary" name="dnNo" value="${newDnNo}" readonly>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Linked Sales Order Ref <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="orderNo" value="${del?.orderNo || 'ORD-2026-0001'}" placeholder="e.g. ORD-2026-0001" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Production Job Number</label>
                                        <input type="text" class="form-control" name="jobNo" value="${del?.jobNo || 'JOB-2026-0001'}" placeholder="e.g. JOB-2026-0001">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Customer Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="customerName" value="${del?.customerName || 'Jayasinghe Construction (Pvt) Ltd'}" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Contact Person & Phone <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="contactPerson" value="${del?.contactPerson || 'Mr. K. Jayasinghe (077 123 4567)'}" required>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Site Delivery Address <span class="text-danger">*</span></label>
                                        <textarea class="form-control" name="deliveryAddress" rows="2" required>${del?.deliveryAddress || 'Diyagama Road, Homagama Site'}</textarea>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Delivery Date</label>
                                        <input type="date" class="form-control" name="deliveryDate" value="${del?.deliveryDate || new Date().toISOString().split('T')[0]}">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Delivery Time Slot</label>
                                        <input type="text" class="form-control" name="deliveryTime" value="${del?.deliveryTime || '10:30 AM'}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Assigned Driver & Vehicle</label>
                                        <select class="form-select" name="driverName" onchange="window.deliveryModule.updateVehicleSelection(this)">
                                            ${this.drivers.map(d => `<option value="${d.name}" ${del?.driverName === d.name ? 'selected' : ''}>${d.name} - ${d.vehicle}</option>`).join('')}
                                        </select>
                                        <input type="hidden" name="vehicleNo" id="hiddenVehicleNo" value="${del?.vehicleNo || this.drivers[0].vehicle}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Delivery Team</label>
                                        <select class="form-select" name="deliveryTeam">
                                            ${this.deliveryTeams.map(t => `<option value="${t}" ${del?.deliveryTeam === t ? 'selected' : ''}>${t}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Delivery Status</label>
                                        <select class="form-select font-bold" name="status">
                                            ${this.deliveryStatuses.map(s => `<option value="${s}" ${del?.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Installation Status</label>
                                        <select class="form-select font-bold text-success" name="installationStatus">
                                            ${this.installationStatuses.map(i => `<option value="${i}" ${del?.installationStatus === i ? 'selected' : ''}>${i}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Gate Pass & Handling Instructions</label>
                                        <textarea class="form-control" name="notes" rows="2" placeholder="e.g. Handle with care, suction cups required...">${del?.notes || ''}</textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="window.deliveryModule.handleSaveDelivery()">
                                <i class="fas fa-check me-1"></i> Save Delivery Note
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
        const form = document.getElementById('delivery-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const existingIndex = this.deliveries.findIndex(d => d.dnNo === data.dnNo);
        if (existingIndex >= 0) {
            this.deliveries[existingIndex] = { ...this.deliveries[existingIndex], ...data };
        } else {
            data.status = data.status || 'Scheduled';
            data.installationStatus = data.installationStatus || 'Pending Installation';
            data.items = [
                { description: 'Aluminium Framing & Structural Glass Package', qty: 1, unit: 'Set', specs: 'As Per Order Specs' }
            ];
            data.acknowledgement = { receivedBy: 'Pending Receipt', status: 'Pending Receipt' };
            data.timeline = [{ title: 'Delivery Scheduled', date: new Date().toLocaleString(), user: 'Logistics Manager', notes: 'Scheduled for dispatch.' }];
            this.deliveries.unshift(data);
        }

        this.saveDeliveries();

        const modalEl = document.getElementById('deliveryFormModal');
        if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            } else {
                modalEl.remove();
            }
        }

        alert(`Delivery Note ${data.dnNo} saved successfully!`);
        this.render();
    }

    deleteDelivery(dnNo) {
        if (!confirm(`Are you sure you want to delete Delivery Note ${dnNo}?`)) return;
        this.deliveries = this.deliveries.filter(d => d.dnNo !== dnNo);
        this.saveDeliveries();
        this.render();
    }

    renderDeliveryDetail(dnNo) {
        const del = this.deliveries.find(d => d.dnNo === dnNo);
        if (!del) {
            alert('Delivery note record not found');
            return;
        }

        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        const timelineHtml = (del.timeline || []).map(t => `
            <div class="d-flex align-items-start mb-3 pb-3 border-bottom">
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style="width: 32px; height: 32px; flex-shrink: 0;">
                    <i class="fas fa-truck small"></i>
                </div>
                <div>
                    <h6 class="font-bold text-main mb-1">${t.title}</h6>
                    <p class="text-muted small mb-0">${t.date} &nbsp;|&nbsp; Updated by <strong>${t.user}</strong></p>
                    ${t.notes ? `<p class="small text-muted bg-light p-2 rounded mt-1 mb-0">${t.notes}</p>` : ''}
                </div>
            </div>
        `).join('');

        const html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">Delivery Note & Dispatch Gate Pass</h2>
                    <p class="text-muted small mb-0">Delivery Reference: <strong>${del.dnNo}</strong> &nbsp;|&nbsp; Linked Order: <strong>${del.orderNo || '-'}</strong> &nbsp;|&nbsp; Linked Job: <strong>${del.jobNo || '-'}</strong></p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="window.deliveryModule.render()"><i class="fas fa-arrow-left me-1"></i> Back</button>
                    <button class="btn btn-warning" onclick="window.deliveryModule.renderEditDeliveryModal('${del.dnNo}')"><i class="fas fa-edit me-1"></i> Edit Note</button>
                    <button class="btn btn-info text-white" onclick="window.deliveryModule.printDeliveryNote('${del.dnNo}')"><i class="fas fa-print me-1"></i> Print Delivery Note</button>
                    ${del.status === 'Scheduled' ? `<button class="btn btn-warning text-dark" onclick="window.deliveryModule.markAsDispatched('${del.dnNo}')"><i class="fas fa-truck-moving me-1"></i> Dispatch Vehicle</button>` : ''}
                    ${del.status === 'Dispatched' || del.status === 'Scheduled' ? `<button class="btn btn-primary" onclick="window.deliveryModule.markAsDelivered('${del.dnNo}')"><i class="fas fa-check-circle me-1"></i> Customer Signature</button>` : ''}
                    ${del.status === 'Delivered' ? `<button class="btn btn-success" onclick="window.deliveryModule.markAsCompleted('${del.dnNo}')"><i class="fas fa-file-invoice-dollar me-1"></i> Complete for Invoice</button>` : ''}
                </div>
            </div>

            <!-- Summary Header Banner -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 5px solid var(--color-brand-blue); border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                <div class="row g-3">
                    <div class="col-md-6 border-end">
                        <h5 class="font-bold text-main mb-2">${del.customerName}</h5>
                        <p class="text-muted small mb-1"><i class="fas fa-user-tag me-1"></i> Contact Person: <strong>${del.contactPerson || 'Site Representative'}</strong></p>
                        <p class="text-muted small mb-1"><i class="fas fa-project-diagram me-1"></i> Project: <strong>${del.projectName || 'Commercial Fabrication'}</strong></p>
                        <p class="text-muted small mb-0"><i class="fas fa-map-marker-alt me-1"></i> Site Address: <strong>${del.deliveryAddress}</strong></p>
                    </div>
                    <div class="col-md-6 ps-4">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Delivery Status:</span>
                            <span class="badge bg-${this.getStatusColor(del.status)} font-bold fs-6">${del.status}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Installation Status:</span>
                            <span class="badge bg-success font-bold">${del.installationStatus || 'Pending Installation'}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Delivery Date & Time:</span>
                            <strong class="text-primary">${del.deliveryDate} (${del.deliveryTime || '10:00 AM'})</strong>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted small uppercase">Driver & Vehicle:</span>
                            <strong class="text-main">${del.driverName || 'Unassigned'} - ${del.vehicleNo || ''}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delivered Items Table -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-boxes text-primary me-2"></i> Dispatched Goods & Fabrication Items</h5>
                <div class="table-responsive">
                    <table class="table table-bordered align-middle text-sm mb-0">
                        <thead class="table-light">
                            <tr>
                                <th style="width: 30px;" class="text-center">#</th>
                                <th>Item Description</th>
                                <th>Specifications & Notes</th>
                                <th style="width: 80px;" class="text-center">Quantity</th>
                                <th style="width: 80px;" class="text-center">Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(del.items || []).map((item, idx) => `
                                <tr>
                                    <td class="text-center font-bold">${idx + 1}</td>
                                    <td><strong>${item.description}</strong></td>
                                    <td>${item.specs}</td>
                                    <td class="text-center font-bold text-primary">${item.qty}</td>
                                    <td class="text-center">${item.unit}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="row g-4">
                <!-- Left: Customer Acknowledgement Block -->
                <div class="col-md-6">
                    <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-signature text-primary me-2"></i> Customer Receipt & Handover Confirmation</h5>
                        <div class="p-3 bg-light rounded border">
                            <p class="small text-muted mb-2">I hereby confirm that all architectural aluminium frames, glass panels, and accessories listed above have been received in good condition.</p>
                            <div class="small mb-1">Received By: <strong>${del.acknowledgement?.receivedBy || '_______________________'}</strong></div>
                            <div class="small mb-1">NIC / ID: <strong>${del.acknowledgement?.nicNo || '_______________________'}</strong></div>
                            <div class="small mb-1">Date & Time: <strong>${del.acknowledgement?.receivedTime || '____/____/2026'}</strong></div>
                            <div class="small mt-2"><span class="badge bg-success">${del.acknowledgement?.status || 'Pending Receipt'}</span></div>
                        </div>
                        <div class="mt-3">
                            <small class="font-bold text-main">Gate Pass Notes:</small>
                            <p class="small text-muted mb-0 mt-1">${del.notes || 'No special handling instructions.'}</p>
                        </div>
                    </div>
                </div>

                <!-- Right: Timeline Audit Log -->
                <div class="col-md-6">
                    <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-stream text-primary me-2"></i> Logistics Dispatch Timeline Audit Log</h5>
                        <div class="timeline-wrapper">
                            ${timelineHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    renderPrintView(dnNo) {
        const d = this.deliveries.find(x => x.dnNo === dnNo);
        if (!d) return '';

        const itemsHtml = (d.items || []).map((item, idx) => `
            <tr>
                <td class="text-center" style="font-weight: 700;">${idx + 1}</td>
                <td><strong>${item.description}</strong></td>
                <td>${item.specs}</td>
                <td class="text-center" style="font-weight: 700;">${item.qty}</td>
                <td class="text-center">${item.unit}</td>
            </tr>
        `).join('');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Delivery Note ${d.dnNo} - ALUGRADE LANKA</title>
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

                    .header-info-box {
                        text-align: right;
                    }
                    .doc-badge {
                        background: #2563EB;
                        color: #ffffff;
                        font-family: 'Montserrat', sans-serif;
                        font-size: 15px;
                        font-weight: 800;
                        padding: 4px 14px;
                        border-radius: 6px;
                        display: inline-block;
                        margin-bottom: 6px;
                    }

                    /* Info Cards */
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

                    /* Tables */
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
                    }
                    .text-center { text-align: center; }

                    /* Signatures */
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
                    .sig-image-container img {
                        max-height: 52px;
                        width: auto;
                    }
                    .sig-line-bar {
                        border-top: 1.5px solid #0F172A;
                        width: 100%;
                        margin: 4px 0 4px 0;
                    }

                    @media print {
                        body { padding: 0; margin: 0; }
                        thead { display: table-header-group; }
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
                                <div class="company-subtitle">Delivery Note & Dispatch Gate Pass</div>
                            </div>
                        </div>
                        <div class="header-info-box">
                            <div class="doc-badge">DELIVERY NOTE</div>
                            <div><strong>DN No:</strong> ${d.dnNo}</div>
                            <div><strong>Order Ref:</strong> ${d.orderNo || '-'}</div>
                            <div><strong>Job Ref:</strong> ${d.jobNo || '-'}</div>
                            <div><strong>Delivery Date:</strong> ${d.deliveryDate}</div>
                        </div>
                    </div>

                    <div class="info-grid">
                        <div class="info-card">
                            <h4>Customer & Recipient Details</h4>
                            <strong>${d.customerName}</strong><br>
                            Contact: ${d.contactPerson || 'Site Representative'}<br>
                            Site Address: ${d.deliveryAddress}
                        </div>
                        <div class="info-card">
                            <h4>Transport & Vehicle Metadata</h4>
                            Driver: <strong>${d.driverName || 'Unassigned'}</strong><br>
                            Vehicle Reg: <strong>${d.vehicleNo || 'N/A'}</strong><br>
                            Time Slot: ${d.deliveryTime || '10:00 AM'}
                        </div>
                    </div>

                    <h4 style="margin: 10px 0 6px 0; color: #0F172A; font-size: 11px; font-weight: 700;">DISPATCHED FABRICATION & GLASS ITEMS</h4>
                    <table class="spec-table">
                        <thead>
                            <tr>
                                <th style="width: 25px;" class="text-center">#</th>
                                <th>Item Description</th>
                                <th>Specifications & Dimensions</th>
                                <th style="width: 60px;" class="text-center">Qty</th>
                                <th style="width: 60px;" class="text-center">Unit</th>
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
                            <div>MR. M. U. RAJAPAKSHA</div>
                            <div style="font-size: 9px; color: #475569;">Managing Director</div>
                        </div>
                        <div class="sig-block">
                            <div class="sig-image-container" style="height: 52px;"></div>
                            <div class="sig-line-bar"></div>
                            <div>CUSTOMER RECIPIENT SIGNATURE</div>
                            <div style="font-size: 9px; color: #475569;">Name, NIC & Seal Stamp</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    printDeliveryNote(dnNo) {
        const html = this.renderPrintView(dnNo);
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

    exportCSV() {
        let csv = "Delivery Note#,Order#,Job#,Customer,Delivery Date,Time,Driver,Vehicle,InstallationStatus,Status\n";
        this.deliveries.forEach(d => {
            csv += `${d.dnNo},"${d.orderNo || ''}","${d.jobNo || ''}","${d.customerName}",${d.deliveryDate},"${d.deliveryTime || ''}","${d.driverName || ''}","${d.vehicleNo || ''}","${d.installationStatus || ''}",${d.status}\n`;
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
