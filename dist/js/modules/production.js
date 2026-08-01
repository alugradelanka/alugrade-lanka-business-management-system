/**
 * Production Management Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 */

class ProductionModule {
    constructor(db, eventsManager) {
        this.db = db || window.DB || { orders: [], customers: [], inventory: [] };
        this.events = eventsManager || window.Events || {
            trigger: (event, data) => console.log(`Event: ${event}`, data),
            emit: (event, data) => console.log(`Event: ${event}`, data)
        };
        
        // 7 Standard Enterprise Stages as per requirement
        this.stages = [
            'Pending',
            'Cutting',
            'Fabrication',
            'Assembly',
            'Glass Installation',
            'Quality Check',
            'Ready for Delivery'
        ];

        this.technicians = [
            'Kamal Perera (Lead Fabricator)',
            'Nimal Fernando (Senior Technician)',
            'Saman Silva (Glazing Specialist)',
            'Bandara Team (Assembly Unit A)',
            'Sunil Shantha (QC Inspector)'
        ];

        this.viewMode = 'kanban'; // 'kanban' or 'table'
        this.jobs = this.loadJobs();
    }

    loadJobs() {
        const stored = localStorage.getItem('alugrade_production_jobs');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) { return []; }
        }

        // Default enterprise production jobs
        const defaults = [
            {
                jobNo: 'JOB-2026-0001',
                orderNo: 'ORD-2026-0001',
                customerName: 'Jayasinghe Construction (Pvt) Ltd',
                projectName: 'Homagama Commercial Complex',
                productSpecs: 'Sliding 2-Track & Fixed Partition Glass (100mm Series)',
                stage: 'Fabrication',
                progress: 33,
                assignedTech: 'Bandara Team (Assembly Unit A)',
                startDate: '2026-07-31',
                targetCompletionDate: '2026-08-12',
                completionDate: null,
                materials: [
                    { item: '100mm Heavy Aluminium Profile', qty: '12 Bars (6m)', status: 'Issued' },
                    { item: '6mm Clear Tempered Glass Panels', qty: '4 Sheets', status: 'In Workshop' },
                    { item: 'EPDM Rubber Gasket Seal', qty: '45 Meters', status: 'Issued' },
                    { item: 'Heavy Duty Corner Cleats', qty: '16 Pcs', status: 'Issued' }
                ],
                notes: 'Precision mitre joint cutting required. Ensure 0.5mm tolerance on corner connectors.',
                timeline: [
                    { stage: 'Pending', date: '2026-07-31 09:30', user: 'System', notes: 'Job created automatically from Order ORD-2026-0001.' },
                    { stage: 'Cutting', date: '2026-07-31 11:00', user: 'Kamal Perera', notes: 'Aluminium profile mitre cutting completed.' },
                    { stage: 'Fabrication', date: '2026-07-31 13:30', user: 'Bandara Team', notes: 'Cleat punching and corner assembly under way.' }
                ]
            },
            {
                jobNo: 'JOB-2026-0002',
                orderNo: 'ORD-2026-0002',
                customerName: 'Sunil Shantha Perera',
                projectName: 'Kottawa Villa Sliding Glass Enclosure',
                productSpecs: 'Matt Black 3-Track Sliding Door with 8mm Tinted Glass',
                stage: 'Ready for Delivery',
                progress: 100,
                assignedTech: 'Saman Silva (Glazing Specialist)',
                startDate: '2026-07-29',
                targetCompletionDate: '2026-08-05',
                completionDate: '2026-07-31',
                materials: [
                    { item: '70mm Architectural Profile (Matt Black)', qty: '8 Bars', status: 'Consumed' },
                    { item: '8mm Tinted Dark Grey Glass', qty: '3 Panels', status: 'Fitted' },
                    { item: 'Stainless Steel Heavy Duty Rollers', qty: '6 Sets', status: 'Fitted' }
                ],
                notes: 'Quality inspection passed. Rollers lubricated and glass cleaned.',
                timeline: [
                    { stage: 'Pending', date: '2026-07-29 10:00', user: 'Admin', notes: 'Job initialized.' },
                    { stage: 'Cutting', date: '2026-07-29 14:00', user: 'Kamal Perera', notes: 'Profiles cut.' },
                    { stage: 'Fabrication', date: '2026-07-30 09:00', user: 'Nimal Fernando', notes: 'Frame assembled.' },
                    { stage: 'Assembly', date: '2026-07-30 13:00', user: 'Nimal Fernando', notes: 'Hardware fitted.' },
                    { stage: 'Glass Installation', date: '2026-07-30 16:00', user: 'Saman Silva', notes: '8mm Tinted glass glazed.' },
                    { stage: 'Quality Check', date: '2026-07-31 09:00', user: 'Sunil Shantha', notes: 'QC passed with 100% rating.' },
                    { stage: 'Ready for Delivery', date: '2026-07-31 11:00', user: 'Sunil Shantha', notes: 'Packed and ready for dispatch.' }
                ]
            }
        ];

        localStorage.setItem('alugrade_production_jobs', JSON.stringify(defaults));
        return defaults;
    }

    saveJobs() {
        localStorage.setItem('alugrade_production_jobs', JSON.stringify(this.jobs));
    }

    calculateStageProgress(stage) {
        const idx = this.stages.indexOf(stage);
        if (idx === -1) return 0;
        return Math.round((idx / (this.stages.length - 1)) * 100);
    }

    async render() {
        const container = document.getElementById('pageContent') || document.getElementById('mainContent') || document.getElementById('main-content') || document.body;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Production & Workshop Management</h2>
                    <p class="text-muted small mb-0">Track 7 manufacturing stages, technician assignments, material usage, and ready dates</p>
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
                    <button class="btn btn-success" onclick="window.productionModule.renderNewJobModal()">
                        <i class="fas fa-plus-circle me-1"></i> + New Production Job
                    </button>
                </div>
            </div>

            <!-- Pipeline Progress Summary -->
            <div class="row g-2 mb-4">
                ${this.stages.map((stage, idx) => {
                    const count = this.jobs.filter(j => j.stage === stage).length;
                    return `
                        <div class="col">
                            <div class="card p-2 text-center" style="background: #ffffff; border: 1px solid var(--color-border); border-top: 4px solid var(--color-brand-blue); border-radius: 10px;">
                                <div class="text-muted small uppercase font-medium" style="font-size: 0.75rem;">${stage}</div>
                                <h4 class="mb-0 font-bold text-primary mt-1">${count}</h4>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Filter Controls -->
            <div class="card p-3 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
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

                    <div class="col-md-4">
                        <select id="techFilter" class="form-select" onchange="window.productionModule.handleSearch()">
                            <option value="">All Technicians / Teams</option>
                            ${this.technicians.map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>

            <!-- View Container (Kanban or Table) -->
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
        let html = `<div class="row g-3 flex-nowrap overflow-auto pb-3" style="min-height: 500px;">`;

        this.stages.forEach(stage => {
            const stageJobs = jobs.filter(j => j.stage === stage);
            html += `
                <div class="col-md-3" style="min-width: 300px;">
                    <div class="card bg-light p-3" style="border: 1px solid var(--color-border); border-radius: 14px; min-height: 480px;">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="font-bold text-main mb-0">${stage}</h6>
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
                                    <p class="text-muted small mb-2">${job.productSpecs}</p>
                                    
                                    <div class="mb-2">
                                        <div class="d-flex justify-content-between small text-muted mb-1">
                                            <span>Progress:</span>
                                            <strong>${job.progress}%</strong>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar bg-success" style="width: ${job.progress}%"></div>
                                        </div>
                                    </div>

                                    <div class="small text-muted mb-3">
                                        <i class="fas fa-user-cog me-1"></i> ${job.assignedTech || 'Unassigned'}
                                    </div>

                                    <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                                        <button class="btn btn-sm btn-outline-primary" onclick="window.productionModule.renderJobDetail('${job.jobNo}')">Detail</button>
                                        <button class="btn btn-sm btn-success" onclick="window.productionModule.advanceStage('${job.jobNo}')">
                                            Advance &rarr;
                                        </button>
                                    </div>
                                </div>
                            `).join('') : '<p class="text-muted small text-center py-4">No jobs in this stage.</p>'}
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
                                <th>Stage</th>
                                <th>Progress</th>
                                <th>Assigned Technician</th>
                                <th>Start Date</th>
                                <th>Target Date</th>
                                <th>Status</th>
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
                                    <td><span class="badge bg-primary">${j.stage}</span></td>
                                    <td style="width: 140px;">
                                        <div class="d-flex align-items-center">
                                            <span class="small font-bold me-2">${j.progress}%</span>
                                            <div class="progress flex-grow-1" style="height: 6px;">
                                                <div class="progress-bar bg-success" style="width: ${j.progress}%"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span class="small font-medium">${j.assignedTech || 'Unassigned'}</span></td>
                                    <td>${j.startDate || '-'}</td>
                                    <td><strong class="text-primary">${j.targetCompletionDate || '-'}</strong></td>
                                    <td><span class="badge ${j.stage==='Ready for Delivery'?'bg-success':'bg-warning text-dark'}">${j.stage==='Ready for Delivery'?'COMPLETED':'IN FABRICATION'}</span></td>
                                    <td class="text-end">
                                        <div class="btn-group btn-group-sm">
                                            <button class="btn btn-outline-primary" onclick="window.productionModule.renderJobDetail('${j.jobNo}')">View</button>
                                            <button class="btn btn-outline-success" onclick="window.productionModule.advanceStage('${j.jobNo}')">Advance</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="9" class="text-center py-4 text-muted">No production jobs found matching criteria.</td></tr>'}
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
            job.progress = this.calculateStageProgress(nextStage);

            if (nextStage === 'Ready for Delivery') {
                job.completionDate = new Date().toISOString().split('T')[0];
            }

            job.timeline.push({
                stage: nextStage,
                date: new Date().toLocaleString(),
                user: 'Workshop Supervisor',
                notes: `Advanced stage to ${nextStage}`
            });

            this.saveJobs();
            alert(`Job ${jobNo} advanced to '${nextStage}' (${job.progress}% complete)!`);
            this.render();
        } else {
            alert(`Job ${jobNo} is already at final stage (${job.stage}).`);
        }
    }

    renderNewJobModal() {
        const modalId = 'newJobModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const newJobNo = 'JOB-2026-' + (this.jobs.length + 1).toString().padStart(4, '0');

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-industry text-primary me-2"></i> Create New Production Job
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="new-job-form">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Production Job Number</label>
                                        <input type="text" class="form-control bg-light font-bold text-primary" name="jobNo" value="${newJobNo}" readonly>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Linked Order Number <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="orderNo" placeholder="e.g. ORD-2026-0001" value="ORD-2026-0003" required>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Customer Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="customerName" placeholder="e.g. Maharagama Medical Center" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Project Name</label>
                                        <input type="text" class="form-control" name="projectName" placeholder="e.g. Surgical Wing Partitions">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Product / Fabrication Specifications <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="productSpecs" placeholder="e.g. 100mm Powder Coated Partition with 10mm Tempered Glass" required>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Initial Stage</label>
                                        <select class="form-select font-bold" name="stage">
                                            ${this.stages.map(s => `<option value="${s}">${s}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Assigned Technician / Team</label>
                                        <select class="form-select" name="assignedTech">
                                            ${this.technicians.map(t => `<option value="${t}">${t}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Target Completion Date</label>
                                        <input type="date" class="form-control" name="targetCompletionDate" value="${new Date(Date.now() + 10*86400000).toISOString().split('T')[0]}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Production Notes & Instructions</label>
                                        <textarea class="form-control" name="notes" rows="2" placeholder="Specific cutting sizes or glass thickness notes..."></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="window.productionModule.handleSaveJob()">
                                <i class="fas fa-check me-1"></i> Create Production Job
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
        const form = document.getElementById('new-job-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.progress = this.calculateStageProgress(data.stage);
        data.startDate = new Date().toISOString().split('T')[0];
        data.completionDate = data.stage === 'Ready for Delivery' ? data.startDate : null;
        data.materials = [
            { item: 'Aluminium Profiles', qty: 'Standard Allocation', status: 'Allocated' },
            { item: 'Glass Panels', qty: 'As Per Spec', status: 'Pending Fitting' }
        ];
        data.timeline = [
            { stage: data.stage, date: new Date().toLocaleString(), user: 'Production Planner', notes: 'Job created manually.' }
        ];

        this.jobs.unshift(data);
        this.saveJobs();

        const modalEl = document.getElementById('newJobModal');
        if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            } else {
                modalEl.remove();
            }
        }

        alert(`Production Job ${data.jobNo} created successfully!`);
        this.render();
    }

    renderJobDetail(jobNo) {
        const job = this.jobs.find(j => j.jobNo === jobNo);
        if (!job) {
            alert('Job record not found');
            return;
        }

        const container = document.getElementById('pageContent') || document.getElementById('mainContent') || document.getElementById('main-content') || document.body;

        const html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">Job Card & Material Tracking</h2>
                    <p class="text-muted small mb-0">Production Job Reference: <strong>${job.jobNo}</strong> &nbsp;|&nbsp; Linked Order: <strong>${job.orderNo}</strong></p>
                </div>
                <div>
                    <button class="btn btn-outline-secondary me-2" onclick="window.productionModule.render()"><i class="fas fa-arrow-left me-1"></i> Back to Board</button>
                    <button class="btn btn-success" onclick="window.productionModule.advanceStage('${job.jobNo}')"><i class="fas fa-step-forward me-1"></i> Advance Stage</button>
                </div>
            </div>

            <!-- Job Summary Card -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 5px solid var(--color-brand-blue); border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                <div class="row g-3">
                    <div class="col-md-6 border-end">
                        <h5 class="font-bold text-main mb-2">${job.customerName}</h5>
                        <p class="text-muted small mb-1"><i class="fas fa-project-diagram me-1"></i> Project: <strong>${job.projectName || 'General'}</strong></p>
                        <p class="text-muted small mb-0"><i class="fas fa-cogs me-1"></i> Specs: <strong>${job.productSpecs}</strong></p>
                    </div>
                    <div class="col-md-6 ps-4">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Current Stage:</span>
                            <span class="badge bg-primary font-bold">${job.stage}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Completion Progress:</span>
                            <strong class="text-success">${job.progress}%</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Assigned Technician:</span>
                            <strong class="text-main">${job.assignedTech || 'Unassigned'}</strong>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted small uppercase">Target Ready Date:</span>
                            <strong class="text-primary">${job.targetCompletionDate || 'TBD'}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <!-- Left: Material Usage Tracking -->
                <div class="col-md-6">
                    <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-boxes text-primary me-2"></i> Material Allocation & Usage Log</h5>
                        <div class="table-responsive">
                            <table class="table table-sm table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr><th>Material Item</th><th>Quantity</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    ${(job.materials || []).map(m => `
                                        <tr>
                                            <td><strong>${m.item}</strong></td>
                                            <td>${m.qty}</td>
                                            <td><span class="badge bg-success">${m.status}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-3 bg-light p-3 rounded">
                            <small class="font-bold text-main">Production Notes:</small>
                            <p class="small text-muted mb-0 mt-1">${job.notes || 'No special instructions recorded.'}</p>
                        </div>
                    </div>
                </div>

                <!-- Right: Step-by-Step Timeline Audit -->
                <div class="col-md-6">
                    <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-stream text-primary me-2"></i> Fabrication Timeline Audit Log</h5>
                        <div class="timeline-wrapper">
                            ${(job.timeline || []).map(t => `
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
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }
}

if (typeof window !== 'undefined') {
    window.ProductionModule = ProductionModule;
}
