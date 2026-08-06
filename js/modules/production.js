/**
 * Production Management Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 * Full Manufacturing Workflow: Approved Sales Order -> Job Card -> Material Allocation -> Aluminium Cutting List -> Glass Order -> Fabrication -> Assembly -> Quality Check -> Ready for Delivery
 */

class ProductionModule {
    constructor(db, eventsManager) {
        this.db = db || window.DB || {};
        this.events = eventsManager || window.Events || {
            trigger: () => {},
            emit: () => {}
        };
        this.containerId = 'pageContent';

        // 8 Enterprise Manufacturing Stages as per requirement
        this.stages = [
            'Job Created',
            'Material Allocated',
            'Aluminium Cutting List',
            'Glass Order',
            'Fabrication Status',
            'Assembly',
            'Quality Check',
            'Ready for Delivery'
        ];

        this.technicians = [
            'Bandara Fabrication Team A',
            'Kamal Perera (Lead Fabricator)',
            'Nimal Fernando (Senior Technician)',
            'Saman Silva (Glazing Specialist)',
            'Sunil Shantha (Quality Control Manager)'
        ];

        this.viewMode = 'kanban'; // 'kanban' or 'table'
        this.activeStageFilter = 'All';
        this.jobs = this.loadJobs();
    }

    loadJobs() {
        const stored = localStorage.getItem('alugrade_production_jobs');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) { return []; }
        }

        // Default enterprise production job dataset
        const defaults = [
            {
                jobNo: 'JOB-2026-0001',
                orderNo: 'ORD-2026-0001',
                customerName: 'Jayasinghe Construction (Pvt) Ltd',
                customerPhone: '0771234567',
                projectName: 'Homagama Commercial Complex - Phase 1',
                siteAddress: 'Diyagama Road, Homagama',
                productSpecs: 'Sliding 2-Track & Fixed Partition Glass (100mm Heavy Duty Series)',
                profileBrand: 'Alumex',
                stage: 'Fabrication Status',
                progress: 50,
                assignedTech: 'Bandara Fabrication Team A',
                startDate: '2026-07-31',
                targetCompletionDate: '2026-08-15',
                completionDate: null,
                items: [
                    {
                        description: 'Aluminium Sliding Window 2-Track System',
                        alumSection: 'Sliding Window 2-Track (100mm)',
                        glassType: '6mm Tempered Clear Glass',
                        colour: 'Matt Black Powder Coated',
                        width: 1800,
                        height: 1500,
                        qty: 4
                    },
                    {
                        description: 'Casement Door with Heavy Duty Friction Stay',
                        alumSection: 'Casement Door System (45mm)',
                        glassType: '8mm Tinted Blue Glass',
                        colour: 'Anodized Silver',
                        width: 900,
                        height: 2100,
                        qty: 2
                    }
                ],
                materials: [
                    { item: '100mm Heavy Duty Aluminium Profile (Matt Black)', qty: '12 Bars (6m)', status: 'Issued to Workshop' },
                    { item: '45mm Casement Door Profile (Silver Anodized)', qty: '6 Bars (6m)', status: 'Issued to Workshop' },
                    { item: '6mm Clear Tempered Glass Panels', qty: '4 Sheets (1740x1440mm)', status: 'Received & Inspected' },
                    { item: '8mm Tinted Blue Glass Panels', qty: '2 Sheets (840x2040mm)', status: 'On Order' },
                    { item: 'EPDM Heavy Rubber Gasket Seal', qty: '80 Meters', status: 'Issued' },
                    { item: 'Heavy Duty Corner Cleats & Screws', qty: '32 Sets', status: 'Issued' }
                ],
                cuttingList: [
                    { section: '100mm 2-Track Outer Frame Top/Bottom', cutLength: 1800, qty: 8, angle: '90° Square Cut', profileCode: 'ALM-100-TF' },
                    { section: '100mm 2-Track Outer Frame Left/Right', cutLength: 1500, qty: 8, angle: '90° Square Cut', profileCode: 'ALM-100-SF' },
                    { section: '100mm Sliding Sash Profile Top/Bottom', cutLength: 910, qty: 16, angle: '45° Mitre Cut', profileCode: 'ALM-100-SH' },
                    { section: '100mm Sliding Sash Profile Stiles', cutLength: 1440, qty: 16, angle: '45° Mitre Cut', profileCode: 'ALM-100-SS' },
                    { section: '45mm Casement Door Frame Stiles', cutLength: 2100, qty: 4, angle: '45° Mitre Cut', profileCode: 'ALM-045-DFS' },
                    { section: '45mm Casement Door Top Rail', cutLength: 900, qty: 4, angle: '45° Mitre Cut', profileCode: 'ALM-045-DFT' }
                ],
                glassOrder: [
                    { glassType: '6mm Tempered Clear Glass', width: 870, height: 1420, qty: 8, processing: 'Polished Edges & Safety Stamp' },
                    { glassType: '8mm Tinted Blue Glass', width: 820, height: 2020, qty: 2, processing: 'Toughened / Heat Soaked' }
                ],
                notes: 'Precision mitre joint cutting required. Ensure 0.5mm tolerance on corner connectors. Double-check EPDM gasket seating.',
                timeline: [
                    { stage: 'Job Created', date: '2026-07-31 09:30', user: 'System', notes: 'Job created automatically from Sales Order ORD-2026-0001.' },
                    { stage: 'Material Allocated', date: '2026-07-31 10:15', user: 'Store Keeper', notes: 'Aluminium profiles and hardware issued from stock.' },
                    { stage: 'Aluminium Cutting List', date: '2026-07-31 11:30', user: 'Kamal Perera', notes: 'Mitre cutting and square cutting completed.' },
                    { stage: 'Glass Order', date: '2026-07-31 14:00', user: 'Procurement', notes: 'Glass order sent to supplier for tempering.' },
                    { stage: 'Fabrication Status', date: '2026-08-01 09:00', user: 'Bandara Team', notes: 'Corner joining and punch assembly in progress.' }
                ]
            }
        ];

        localStorage.setItem('alugrade_production_jobs', JSON.stringify(defaults));
        return defaults;
    }

    saveJobs() {
        localStorage.setItem('alugrade_production_jobs', JSON.stringify(this.jobs));
    }

    generateJobNo() {
        const year = new Date().getFullYear();
        const count = this.jobs.length + 1;
        return `JOB-${year}-${count.toString().padStart(4, '0')}`;
    }

    calculateProgress(stage) {
        const idx = this.stages.indexOf(stage);
        if (idx === -1) return 0;
        return Math.round((idx / (this.stages.length - 1)) * 100);
    }

    render() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Production & Workshop Management</h2>
                    <p class="text-muted small mb-0">Full Manufacturing Lifecycle: Approved Order → Job Card → Material Allocation → Cutting List → Glass Order → Assembly → Quality Control → Ready for Delivery</p>
                </div>
                <div class="d-flex gap-2">
                    <div class="btn-group me-2">
                        <button class="btn ${this.viewMode==='kanban'?'btn-primary':'btn-outline-secondary'}" onclick="window.productionModule.switchView('kanban')">
                            <i class="fas fa-columns me-1"></i> Kanban Board
                        </button>
                        <button class="btn ${this.viewMode==='table'?'btn-primary':'btn-outline-secondary'}" onclick="window.productionModule.switchView('table')">
                            <i class="fas fa-list me-1"></i> Table View
                        </button>
                    </div>
                    <button class="btn btn-outline-secondary" onclick="window.productionModule.showConvertOrderModal()">
                        <i class="fas fa-magic text-primary me-1"></i> Generate Job from Order
                    </button>
                    <button class="btn btn-primary" onclick="window.productionModule.renderNewJobModal()">
                        <i class="fas fa-plus-circle me-1"></i> + Create Job Card
                    </button>
                </div>
            </div>

            <!-- Pipeline Progress Summary Cards -->
            <div class="row g-2 mb-4">
                ${this.stages.map(stage => {
                    const count = this.jobs.filter(j => j.stage === stage).length;
                    return `
                        <div class="col">
                            <div class="card p-2 text-center" style="background: #ffffff; border: 1px solid var(--color-border); border-top: 4px solid var(--color-brand-blue); border-radius: 10px;">
                                <div class="text-muted small uppercase font-medium" style="font-size: 0.7rem;">${stage}</div>
                                <h4 class="mb-0 font-bold text-primary mt-1">${count}</h4>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Filter & Search Controls -->
            <div class="card p-3 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="row g-3 align-items-center">
                    <div class="col-md-5">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                            <input type="text" id="prod-search" class="form-control border-start-0" placeholder="Search Job#, Order#, customer, technician..." onkeyup="window.productionModule.handleSearch()">
                        </div>
                    </div>

                    <div class="col-md-3">
                        <select id="stageFilter" class="form-select" onchange="window.productionModule.handleSearch()">
                            <option value="">All Production Stages</option>
                            ${this.stages.map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                    </div>

                    <div class="col-md-3">
                        <select id="techFilter" class="form-select" onchange="window.productionModule.handleSearch()">
                            <option value="">All Technicians / Teams</option>
                            ${this.technicians.map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                    </div>

                    <div class="col-md-1 text-end">
                        <button class="btn btn-outline-secondary btn-sm" onclick="window.productionModule.exportExcel()" title="Export CSV"><i class="fas fa-file-excel text-success"></i> CSV</button>
                    </div>
                </div>
            </div>

            <!-- Main View Container (Kanban or Table) -->
            <div id="production-view-container">
                <!-- Loaded dynamically -->
            </div>
        `;

        container.innerHTML = html;
        this.renderCurrentView();
    }

    switchView(mode) {
        this.viewMode = mode;
        this.render();
    }

    renderCurrentView() {
        const container = document.getElementById('production-view-container');
        if (!container) return;

        const query = document.getElementById('prod-search')?.value || '';
        const stageFilter = document.getElementById('stageFilter')?.value || '';
        const techFilter = document.getElementById('techFilter')?.value || '';

        let filtered = this.jobs;

        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(j =>
                (j.jobNo && j.jobNo.toLowerCase().includes(q)) ||
                (j.orderNo && j.orderNo.toLowerCase().includes(q)) ||
                (j.customerName && j.customerName.toLowerCase().includes(q)) ||
                (j.productSpecs && j.productSpecs.toLowerCase().includes(q)) ||
                (j.assignedTech && j.assignedTech.toLowerCase().includes(q))
            );
        }

        if (stageFilter) {
            filtered = filtered.filter(j => j.stage === stageFilter);
        }

        if (techFilter) {
            filtered = filtered.filter(j => j.assignedTech === techFilter);
        }

        if (this.viewMode === 'kanban') {
            this.renderKanbanView(container, filtered);
        } else {
            this.renderTableView(container, filtered);
        }
    }

    renderKanbanView(container, jobs) {
        let html = `<div class="row g-3 flex-nowrap overflow-auto pb-3" style="min-height: 520px;">`;

        this.stages.forEach(stage => {
            const stageJobs = jobs.filter(j => j.stage === stage);
            html += `
                <div class="col-md-3" style="min-width: 300px;">
                    <div class="card bg-light p-3" style="border: 1px solid var(--color-border); border-radius: 14px; min-height: 500px;">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="font-bold text-main mb-0" style="font-size: 0.85rem;">${stage}</h6>
                            <span class="badge bg-white text-dark border font-bold">${stageJobs.length}</span>
                        </div>

                        <div class="kanban-cards-wrapper d-flex flex-column gap-3">
                            ${stageJobs.length > 0 ? stageJobs.map(job => `
                                <div class="card p-3 bg-white shadow-sm" style="border: 1px solid var(--color-border); border-radius: 12px;">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <strong class="text-primary">${job.jobNo}</strong>
                                        <span class="badge bg-light text-muted border">${job.orderNo}</span>
                                    </div>
                                    <h6 class="font-bold text-main mb-1" style="font-size: 0.95rem;">${job.customerName}</h6>
                                    <p class="text-muted small mb-2 text-truncate" title="${job.productSpecs}">${job.productSpecs}</p>

                                    <div class="mb-2">
                                        <div class="d-flex justify-content-between small text-muted mb-1">
                                            <span>Stage Progress:</span>
                                            <strong>${job.progress || 0}%</strong>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar bg-success" style="width: ${job.progress || 0}%"></div>
                                        </div>
                                    </div>

                                    <div class="small text-muted mb-3">
                                        <i class="fas fa-user-cog me-1"></i> ${job.assignedTech || 'Unassigned'}
                                    </div>

                                    <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                                        <button class="btn btn-sm btn-outline-primary" onclick="window.productionModule.renderJobDetail('${job.jobNo}')">View Card</button>
                                        ${job.stage !== 'Ready for Delivery' ? `
                                            <button class="btn btn-sm btn-success" onclick="window.productionModule.advanceStage('${job.jobNo}')">
                                                Advance &rarr;
                                            </button>
                                        ` : '<span class="badge bg-success">COMPLETED</span>'}
                                    </div>
                                </div>
                            `).join('') : '<p class="text-muted small text-center py-4">No active jobs in this stage.</p>'}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    renderTableView(container, jobs) {
        let html = `
            <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Job# & Order#</th>
                                <th>Customer & Project</th>
                                <th>Product Specifications</th>
                                <th>Stage</th>
                                <th>Progress</th>
                                <th>Assigned Tech / Team</th>
                                <th>Target Date</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${jobs.length > 0 ? jobs.map(j => `
                                <tr>
                                    <td>
                                        <strong class="text-primary">${j.jobNo}</strong>
                                        <div class="small text-muted"><i class="fas fa-link me-1"></i>${j.orderNo}</div>
                                    </td>
                                    <td>
                                        <div class="font-bold text-main">${j.customerName}</div>
                                        <div class="small text-muted">${j.projectName || 'General Fabrication'}</div>
                                    </td>
                                    <td><div class="small font-medium text-main text-truncate" style="max-width:220px;" title="${j.productSpecs}">${j.productSpecs}</div></td>
                                    <td><span class="badge bg-primary">${j.stage}</span></td>
                                    <td style="width: 130px;">
                                        <div class="d-flex align-items-center">
                                            <span class="small font-bold me-2">${j.progress}%</span>
                                            <div class="progress flex-grow-1" style="height: 6px;">
                                                <div class="progress-bar bg-success" style="width: ${j.progress}%"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span class="small font-medium">${j.assignedTech || 'Unassigned'}</span></td>
                                    <td><strong class="text-primary">${j.targetCompletionDate || 'TBD'}</strong></td>
                                    <td class="text-end">
                                        <div class="btn-group btn-group-sm">
                                            <button class="btn btn-outline-primary" onclick="window.productionModule.renderJobDetail('${j.jobNo}')">View</button>
                                            <button class="btn btn-outline-secondary" onclick="window.productionModule.renderEditJobModal('${j.jobNo}')">Edit</button>
                                            <button class="btn btn-outline-info" onclick="window.productionModule.printJobCard('${j.jobNo}')" title="Print Job Card Sheet"><i class="fas fa-print"></i></button>
                                            <button class="btn btn-outline-danger" onclick="window.productionModule.deleteJob('${j.jobNo}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="8" class="text-center py-4 text-muted">No production jobs found matching criteria.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    handleSearch() {
        this.renderCurrentView();
    }

    advanceStage(jobNo) {
        const job = this.jobs.find(j => j.jobNo === jobNo);
        if (!job) return;

        const currentIdx = this.stages.indexOf(job.stage);
        if (currentIdx < this.stages.length - 1) {
            const nextStage = this.stages[currentIdx + 1];
            job.stage = nextStage;
            job.progress = this.calculateProgress(nextStage);

            if (nextStage === 'Ready for Delivery') {
                job.completionDate = new Date().toISOString().split('T')[0];
            }

            job.timeline = job.timeline || [];
            job.timeline.push({
                stage: nextStage,
                date: new Date().toLocaleString(),
                user: 'Workshop Lead',
                notes: `Advanced production stage to ${nextStage}`
            });

            this.saveJobs();
            alert(`Job ${jobNo} advanced to '${nextStage}' (${job.progress}% complete)!`);
            this.render();
        } else {
            alert(`Job ${jobNo} is already at final stage ('${job.stage}').`);
        }
    }

    createJobFromOrder(order) {
        if (!order) return;
        const newJobNo = this.generateJobNo();

        // Calculate automatic cutting list & glass order
        const cuttingList = [];
        const glassOrder = [];
        const materials = [
            { item: `${order.profileBrand || 'Alumex'} Aluminium Profiles`, qty: 'Standard Bar Allocation (6m)', status: 'Allocated' },
            { item: 'EPDM Rubber Gasket Seals', qty: 'As Per Specifications', status: 'Allocated' },
            { item: 'Heavy Duty Screws & Cleats', qty: 'Full Assembly Set', status: 'Issued' }
        ];

        if (order.items && order.items.length > 0) {
            order.items.forEach((item, idx) => {
                const w = parseFloat(item.width) || 1000;
                const h = parseFloat(item.height) || 1000;
                const qty = parseInt(item.qty) || 1;

                // Frame cutting list
                cuttingList.push({
                    section: `${item.alumSection || 'Outer Frame'} Top/Bottom`,
                    cutLength: w,
                    qty: qty * 2,
                    angle: '90° Square Cut',
                    profileCode: `ALM-FRAME-W-${idx+1}`
                });
                cuttingList.push({
                    section: `${item.alumSection || 'Outer Frame'} Stiles`,
                    cutLength: h,
                    qty: qty * 2,
                    angle: '90° Square Cut',
                    profileCode: `ALM-FRAME-H-${idx+1}`
                });

                // Glass order specification
                const glassW = Math.max(100, w - 60);
                const glassH = Math.max(100, h - 60);
                glassOrder.push({
                    glassType: item.glassType || '6mm Clear Tempered Glass',
                    width: glassW,
                    height: glassH,
                    qty: qty,
                    processing: 'Polished Edges & Toughened Stamp'
                });

                materials.push({
                    item: item.glassType || 'Clear Tempered Glass',
                    qty: `${qty} Panels (${glassW}×${glassH}mm)`,
                    status: 'Order Placed'
                });
            });
        }

        const newJob = {
            jobNo: newJobNo,
            orderNo: order.id,
            customerName: order.customerName || 'Direct Client',
            customerPhone: order.customerPhone || '',
            projectName: order.projectName || 'Commercial Fabrication',
            siteAddress: order.siteAddress || '',
            productSpecs: order.productName || (order.items && order.items[0]?.description) || 'Aluminium Doors & Glass Panels',
            profileBrand: order.profileBrand || 'Alumex',
            stage: 'Job Created',
            progress: 0,
            assignedTech: 'Bandara Fabrication Team A',
            startDate: new Date().toISOString().split('T')[0],
            targetCompletionDate: order.expectedDate || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
            completionDate: null,
            items: order.items ? JSON.parse(JSON.stringify(order.items)) : [],
            materials: materials,
            cuttingList: cuttingList,
            glassOrder: glassOrder,
            notes: order.remarks || 'Job card generated from sales order.',
            timeline: [
                { stage: 'Job Created', date: new Date().toLocaleString(), user: 'Production System', notes: `Created 1-click from Sales Order ${order.id}.` }
            ]
        };

        this.jobs.unshift(newJob);
        this.saveJobs();
        this.renderJobDetail(newJobNo);
    }

    showConvertOrderModal() {
        const orders = JSON.parse(localStorage.getItem('alugrade_orders') || '[]');

        const modalId = 'convertOrderModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const listItemsHtml = orders.length > 0 ? orders.map(o => `
            <div class="list-group-item p-3 d-flex justify-content-between align-items-center mb-2" style="border-radius: 10px; border: 1px solid var(--color-border);">
                <div>
                    <h6 class="mb-1 font-bold text-primary">${o.id} - ${o.customerName}</h6>
                    <p class="text-muted small mb-0">Project: ${o.projectName || 'N/A'} &nbsp;|&nbsp; Status: <strong>${o.status}</strong> &nbsp;|&nbsp; Brand: <strong>${o.profileBrand || 'Alumex'}</strong></p>
                </div>
                <button class="btn btn-success btn-sm font-medium" onclick="window.productionModule.convertOrderToJob('${o.id}')">
                    <i class="fas fa-cogs me-1"></i> Generate Job Card
                </button>
            </div>
        `).join('') : '<p class="text-muted p-3 text-center">No active sales orders found.</p>';

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-magic text-primary me-2"></i> Generate Production Job Card from Sales Order
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <p class="text-muted small mb-3">Select an approved sales order to automatically generate its workshop job card, cutting list, glass specifications, and material allocation.</p>
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

    convertOrderToJob(orderId) {
        const orders = JSON.parse(localStorage.getItem('alugrade_orders') || '[]');
        const order = orders.find(o => o.id === orderId);

        if (order) {
            const modalEl = document.getElementById('convertOrderModal');
            if (modalEl) {
                if (window.bootstrap && window.bootstrap.Modal) {
                    const modal = window.bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                } else {
                    modalEl.remove();
                }
            }
            this.createJobFromOrder(order);
        } else {
            alert('Sales Order record not found');
        }
    }

    renderNewJobModal() {
        this.renderFormModal();
    }

    renderEditJobModal(jobNo) {
        const job = this.jobs.find(j => j.jobNo === jobNo);
        if (job) {
            this.renderFormModal(job);
        } else {
            alert('Job record not found');
        }
    }

    renderFormModal(job = null) {
        const isEdit = !!job;
        const modalId = 'jobFormModal';

        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const newJobNo = isEdit ? job.jobNo : this.generateJobNo();

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-industry text-primary me-2"></i> ${isEdit ? 'Edit Production Job #' + newJobNo : 'Create New Workshop Job Card'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="job-form">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Job Card Number</label>
                                        <input type="text" class="form-control bg-light font-bold text-primary" name="jobNo" value="${newJobNo}" readonly>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Linked Sales Order Ref <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="orderNo" value="${job?.orderNo || ''}" placeholder="e.g. ORD-2026-0001" required>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Customer Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="customerName" value="${job?.customerName || 'Jayasinghe Construction (Pvt) Ltd'}" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Project Name</label>
                                        <input type="text" class="form-control" name="projectName" value="${job?.projectName || 'Homagama Villa Project'}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Product / Fabrication Specifications <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="productSpecs" value="${job?.productSpecs || 'Sliding 2-Track & Fixed Partition Glass'}" required>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Current Manufacturing Stage</label>
                                        <select class="form-select font-bold" name="stage">
                                            ${this.stages.map(s => `<option value="${s}" ${job?.stage === s ? 'selected' : ''}>${s}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Assigned Technician / Team</label>
                                        <select class="form-select" name="assignedTech">
                                            ${this.technicians.map(t => `<option value="${t}" ${job?.assignedTech === t ? 'selected' : ''}>${t}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Target Ready Date</label>
                                        <input type="date" class="form-control" name="targetCompletionDate" value="${job?.targetCompletionDate || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Workshop Notes & Technical Instructions</label>
                                        <textarea class="form-control" name="notes" rows="3" placeholder="Specific cutting sizes, corner joint tolerances or glass thickness notes...">${job?.notes || ''}</textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="window.productionModule.handleSaveJob()">
                                <i class="fas fa-check me-1"></i> Save Job Card Details
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

    handleSaveJob() {
        const form = document.getElementById('job-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.progress = this.calculateProgress(data.stage);

        const existingIndex = this.jobs.findIndex(j => j.jobNo === data.jobNo);
        if (existingIndex >= 0) {
            this.jobs[existingIndex] = { ...this.jobs[existingIndex], ...data };
        } else {
            data.startDate = new Date().toISOString().split('T')[0];
            data.completionDate = data.stage === 'Ready for Delivery' ? data.startDate : null;
            data.materials = [
                { item: 'Aluminium Profiles', qty: 'Standard Allocation', status: 'Allocated' },
                { item: 'Glass Panels', qty: 'As Per Spec', status: 'Pending Fitting' }
            ];
            data.timeline = [
                { stage: data.stage, date: new Date().toLocaleString(), user: 'Production Lead', notes: 'Job card initialized.' }
            ];
            this.jobs.unshift(data);
        }

        this.saveJobs();

        const modalEl = document.getElementById('jobFormModal');
        if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            } else {
                modalEl.remove();
            }
        }

        alert(`Production Job ${data.jobNo} saved successfully!`);
        this.render();
    }

    deleteJob(jobNo) {
        if (!confirm(`Are you sure you want to delete Job Card ${jobNo}?`)) return;
        this.jobs = this.jobs.filter(j => j.jobNo !== jobNo);
        this.saveJobs();
        this.render();
    }

    renderJobDetail(jobNo) {
        const job = this.jobs.find(j => j.jobNo === jobNo);
        if (!job) {
            alert('Job record not found');
            return;
        }

        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        const cuttingListHtml = (job.cuttingList && job.cuttingList.length > 0) ? job.cuttingList.map((c, idx) => `
            <tr>
                <td class="text-center font-bold">${idx + 1}</td>
                <td><strong>${c.section}</strong> <span class="badge bg-light text-dark border ms-1">${c.profileCode || '-'}</span></td>
                <td class="text-center font-bold text-primary">${c.cutLength} mm</td>
                <td class="text-center">${c.qty}</td>
                <td class="text-center"><span class="badge bg-secondary">${c.angle}</span></td>
            </tr>
        `).join('') : `<tr><td colspan="5" class="text-muted text-center py-2">General profile cutting rules apply as per specifications.</td></tr>`;

        const glassOrderHtml = (job.glassOrder && job.glassOrder.length > 0) ? job.glassOrder.map((g, idx) => `
            <tr>
                <td class="text-center font-bold">${idx + 1}</td>
                <td><strong>${g.glassType}</strong></td>
                <td class="text-center font-bold">${g.width} × ${g.height} mm</td>
                <td class="text-center">${g.qty}</td>
                <td class="small text-muted">${g.processing || '-'}</td>
            </tr>
        `).join('') : `<tr><td colspan="5" class="text-muted text-center py-2">No custom glass cutting specs attached.</td></tr>`;

        const materialsHtml = (job.materials && job.materials.length > 0) ? job.materials.map(m => `
            <tr>
                <td><strong>${m.item}</strong></td>
                <td>${m.qty}</td>
                <td><span class="badge bg-success">${m.status}</span></td>
            </tr>
        `).join('') : `<tr><td colspan="3" class="text-muted text-center py-2">Standard workshop allocation.</td></tr>`;

        const timelineHtml = (job.timeline || []).map(t => `
            <div class="d-flex align-items-start mb-3 pb-3 border-bottom">
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style="width: 32px; height: 32px; flex-shrink: 0;">
                    <i class="fas fa-check small"></i>
                </div>
                <div>
                    <h6 class="font-bold text-main mb-1">Stage: ${t.stage}</h6>
                    <p class="text-muted small mb-0">${t.date} &nbsp;|&nbsp; Updated by <strong>${t.user}</strong></p>
                    ${t.notes ? `<p class="small text-muted bg-light p-2 rounded mt-1 mb-0">${t.notes}</p>` : ''}
                </div>
            </div>
        `).join('');

        const html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">Job Card & Technical Cutting Sheet</h2>
                    <p class="text-muted small mb-0">Production Reference: <strong>${job.jobNo}</strong> &nbsp;|&nbsp; Linked Sales Order: <strong>${job.orderNo}</strong></p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="window.productionModule.render()"><i class="fas fa-arrow-left me-1"></i> Back to Board</button>
                    <button class="btn btn-warning" onclick="window.productionModule.renderEditJobModal('${job.jobNo}')"><i class="fas fa-edit me-1"></i> Edit Job Card</button>
                    <button class="btn btn-info text-white" onclick="window.productionModule.printJobCard('${job.jobNo}')"><i class="fas fa-print me-1"></i> Print Job Card</button>
                    ${job.stage !== 'Ready for Delivery' ? `<button class="btn btn-success" onclick="window.productionModule.advanceStage('${job.jobNo}')"><i class="fas fa-step-forward me-1"></i> Advance Stage</button>` : ''}
                </div>
            </div>

            <!-- Job Summary Card Banner -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 5px solid var(--color-brand-blue); border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                <div class="row g-3">
                    <div class="col-md-6 border-end">
                        <h5 class="font-bold text-main mb-2">${job.customerName}</h5>
                        <p class="text-muted small mb-1"><i class="fas fa-project-diagram me-1"></i> Project: <strong>${job.projectName || 'General'}</strong></p>
                        <p class="text-muted small mb-1"><i class="fas fa-layer-group me-1"></i> Profile Brand: <strong class="text-primary">${job.profileBrand || 'Alumex'}</strong></p>
                        <p class="text-muted small mb-0"><i class="fas fa-cogs me-1"></i> Specs: <strong>${job.productSpecs}</strong></p>
                    </div>
                    <div class="col-md-6 ps-4">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Manufacturing Stage:</span>
                            <span class="badge bg-primary font-bold fs-6">${job.stage}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Stage Progress:</span>
                            <strong class="text-success">${job.progress}%</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Assigned Staff / Team:</span>
                            <strong class="text-main">${job.assignedTech || 'Unassigned'}</strong>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted small uppercase">Target Completion Date:</span>
                            <strong class="text-primary">${job.targetCompletionDate || 'TBD'}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Technical Cutting & Glass Order Grid -->
            <div class="row g-4 mb-4">
                <!-- Aluminium Cutting List -->
                <div class="col-md-7">
                    <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-cut text-primary me-2"></i> Aluminium Profile Cutting List</h5>
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle text-sm mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 25px;" class="text-center">#</th>
                                        <th>Profile Section</th>
                                        <th style="width: 100px;" class="text-center">Cut Length</th>
                                        <th style="width: 50px;" class="text-center">Qty</th>
                                        <th style="width: 110px;" class="text-center">Cut Angle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${cuttingListHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Glass Order Specifications -->
                <div class="col-md-5">
                    <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-glass-martini-alt text-primary me-2"></i> Structural Glass Order Specs</h5>
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle text-sm mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 25px;" class="text-center">#</th>
                                        <th>Glass Type</th>
                                        <th style="width: 100px;" class="text-center">Size (W×H)</th>
                                        <th style="width: 40px;" class="text-center">Qty</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${glassOrderHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <!-- Left: Material Allocation -->
                <div class="col-md-6">
                    <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-boxes text-primary me-2"></i> Workshop Material Allocation</h5>
                        <div class="table-responsive">
                            <table class="table table-sm table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr><th>Material Item</th><th>Quantity</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    ${materialsHtml}
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-3 bg-light p-3 rounded">
                            <small class="font-bold text-main">Workshop Instructions:</small>
                            <p class="small text-muted mb-0 mt-1">${job.notes || 'No special workshop instructions recorded.'}</p>
                        </div>
                    </div>
                </div>

                <!-- Right: Step-by-Step Timeline Audit -->
                <div class="col-md-6">
                    <div class="card p-4 h-100" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-stream text-primary me-2"></i> Manufacturing Process Timeline Audit</h5>
                        <div class="timeline-wrapper">
                            ${timelineHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    renderPrintView(jobNo) {
        const j = this.jobs.find(x => x.jobNo === jobNo);
        if (!j) return '';

        const cuttingListHtml = (j.cuttingList && j.cuttingList.length > 0) ? j.cuttingList.map((c, idx) => `
            <tr>
                <td class="text-center" style="font-weight: 700;">${idx + 1}</td>
                <td><strong>${c.section}</strong> (${c.profileCode || '-'})</td>
                <td class="text-center" style="font-weight: 700; color: #2563EB;">${c.cutLength} mm</td>
                <td class="text-center">${c.qty}</td>
                <td class="text-center">${c.angle}</td>
            </tr>
        `).join('') : `<tr><td colspan="5" class="text-center">Standard profile cutting rules apply.</td></tr>`;

        const glassOrderHtml = (j.glassOrder && j.glassOrder.length > 0) ? j.glassOrder.map((g, idx) => `
            <tr>
                <td class="text-center" style="font-weight: 700;">${idx + 1}</td>
                <td><strong>${g.glassType}</strong></td>
                <td class="text-center" style="font-weight: 700;">${g.width} × ${g.height} mm</td>
                <td class="text-center">${g.qty}</td>
                <td>${g.processing || '-'}</td>
            </tr>
        `).join('') : `<tr><td colspan="5" class="text-center">No glass specifications.</td></tr>`;

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Workshop Job Card ${j.jobNo} - ALUGRADE LANKA</title>
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
                                <div class="company-subtitle">Workshop Job Card & Aluminium Cutting Sheet</div>
                            </div>
                        </div>
                        <div class="header-info-box">
                            <div class="doc-badge">WORKSHOP JOB CARD</div>
                            <div><strong>Job Card No:</strong> ${j.jobNo}</div>
                            <div><strong>Linked Order:</strong> ${j.orderNo}</div>
                            <div><strong>Profile Brand:</strong> ${j.profileBrand || 'Alumex'}</div>
                            <div><strong>Target Date:</strong> ${j.targetCompletionDate || 'TBD'}</div>
                        </div>
                    </div>

                    <div class="info-grid">
                        <div class="info-card">
                            <h4>Customer & Project</h4>
                            <strong>${j.customerName}</strong><br>
                            Project: ${j.projectName || 'Commercial Fabrication'}<br>
                            Site: ${j.siteAddress || 'N/A'}
                        </div>
                        <div class="info-card">
                            <h4>Manufacturing Assignment</h4>
                            Assigned Team: <strong>${j.assignedTech || 'Workshop Team'}</strong><br>
                            Stage: <strong>${j.stage}</strong> (${j.progress}% Complete)<br>
                            Start Date: ${j.startDate || '-'}
                        </div>
                    </div>

                    <h4 style="margin: 10px 0 6px 0; color: #0F172A; font-size: 11px; font-weight: 700;">1. ALUMINIUM PROFILE CUTTING LIST</h4>
                    <table class="spec-table">
                        <thead>
                            <tr>
                                <th style="width: 25px;" class="text-center">#</th>
                                <th>Profile Section</th>
                                <th style="width: 100px;" class="text-center">Cut Length</th>
                                <th style="width: 50px;" class="text-center">Qty</th>
                                <th style="width: 110px;" class="text-center">Cut Angle</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cuttingListHtml}
                        </tbody>
                    </table>

                    <h4 style="margin: 10px 0 6px 0; color: #0F172A; font-size: 11px; font-weight: 700;">2. STRUCTURAL GLASS ORDER SPECIFICATIONS</h4>
                    <table class="spec-table">
                        <thead>
                            <tr>
                                <th style="width: 25px;" class="text-center">#</th>
                                <th>Glass Type</th>
                                <th style="width: 100px;" class="text-center">Size (W×H)</th>
                                <th style="width: 40px;" class="text-center">Qty</th>
                                <th>Processing Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${glassOrderHtml}
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
                            <div>QUALITY CONTROL INSPECTOR</div>
                            <div style="font-size: 9px; color: #475569;">QC Sign-off & Inspection Stamp</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    printJobCard(jobNo) {
        const html = this.renderPrintView(jobNo);
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

    exportExcel() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "JobNo,OrderNo,Customer,Project,ProfileBrand,Stage,Progress,AssignedTech,StartDate,TargetDate,CompletionDate\n";
        this.jobs.forEach(j => {
            csvContent += `${j.jobNo},"${j.orderNo}","${j.customerName}","${j.projectName || ''}","${j.profileBrand || 'Alumex'}","${j.stage}",${j.progress},"${j.assignedTech || ''}",${j.startDate || ''},${j.targetCompletionDate || ''},${j.completionDate || ''}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `ALUGRADE_Production_Jobs_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

if (typeof window !== 'undefined') {
    window.ProductionModule = ProductionModule;
}
