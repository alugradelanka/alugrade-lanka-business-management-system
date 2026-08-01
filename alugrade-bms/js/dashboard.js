class Dashboard {
    constructor() {
        this.container = document.getElementById('pageContent') || document.getElementById('mainContent') || document.getElementById('main-content') || document.getElementById('page-content');
        this.chartManager = window.ChartManager ? new window.ChartManager() : null;
        this._rendered = false;
        this.filterData = {
            period: 'today',
            from: new Date(),
            to: new Date()
        };
        
        this._setDateRange('today');
        
        if (window.Events) {
            window.Events.on('*', () => {
                if (this._rendered) this.refreshAll();
            });
        }
    }

    _setDateRange(period) {
        const now = new Date();
        this.filterData.period = period;
        this.filterData.to = new Date(now);
        switch (period) {
            case 'today':
                this.filterData.from = new Date(now.setHours(0,0,0,0));
                break;
            case 'week': {
                const firstDay = now.getDate() - now.getDay();
                this.filterData.from = new Date(now.setDate(firstDay));
                this.filterData.from.setHours(0,0,0,0);
                break;
            }
            case 'month':
                this.filterData.from = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                this.filterData.from = new Date(now.getFullYear(), 0, 1);
                break;
        }
    }

    applyDateFilter(period) {
        this._setDateRange(period);
        if (this._rendered) this.refreshAll();
    }

    async render() {
        this.container = document.getElementById('pageContent') || document.getElementById('mainContent') || document.getElementById('main-content') || document.getElementById('page-content');
        if (!this.container) return;

        const currentDateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        this.container.innerHTML = `
            <!-- Enterprise ERP Header Banner -->
            <div class="card mb-4 p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 6px solid var(--color-brand-blue, #2563EB); border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
                <div class="flex-between flex-wrap gap-4 items-center" style="display: flex !important; justify-content: space-between !important; align-items: center !important; flex-wrap: wrap !important;">
                    <div class="flex items-center gap-4" style="display: flex !important; align-items: center !important; gap: 1.5rem !important; flex-wrap: wrap !important;">
                        <!-- Prominent 2.6x Larger Official Logo Container -->
                        <div class="logo-container" style="background: #ffffff; padding: 12px 20px; border-radius: 14px; border: 1px solid var(--color-border); box-shadow: 0 2px 10px rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <img src="assets/logo/logo.png" alt="ALUGRADE LANKA FAB & GLASS" style="height: 135px; width: auto; max-width: 280px; object-fit: contain; display: block;" />
                        </div>

                        <div>
                            <div class="flex items-center gap-2 mb-1" style="display: flex; align-items: center; gap: 0.5rem;">
                                <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--color-text-main); margin: 0; letter-spacing: -0.02em; line-height: 1.2;">
                                    ALUGRADE LANKA FAB & GLASS
                                </h1>
                                <span class="badge badge-primary" style="font-size: 0.72rem; padding: 0.25rem 0.6rem; border-radius: 6px;">ENTERPRISE ERP</span>
                            </div>
                            <p style="font-size: 0.95rem; color: var(--color-brand-blue, #2563EB); margin: 0 0 0.5rem 0; font-weight: 700; letter-spacing: 0.01em;">
                                Quality Aluminium & Glass Solutions · Business Management System
                            </p>
                            <div class="small text-muted flex-wrap gap-3" style="display: flex; gap: 0.75rem; font-size: 0.82rem; color: var(--color-text-muted);">
                                <span>📍 53/1/A Diyagama, Homagama</span>
                                <span>📞 0702795702</span>
                                <span>💬 WhatsApp: 0755515862</span>
                                <span>✉️ alugredelankafabglass@gmail.com</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3" style="display: flex !important; align-items: center !important; gap: 1rem !important;">
                        <div class="text-right hidden-mobile" style="font-size: 0.85rem; color: var(--color-text-muted);">
                            <div style="font-weight: 700; color: var(--color-text-main); font-size: 0.9rem;">${currentDateStr} · ${currentTimeStr}</div>
                            <div class="small mt-1"><span class="badge badge-success" style="font-size: 0.75rem; padding: 0.3rem 0.65rem;">● SYSTEM ONLINE</span></div>
                        </div>

                        <!-- Date Filter Buttons -->
                        <div class="date-filter-bar flex gap-1 p-1 bg-light border rounded-lg" style="display: flex !important; gap: 0.25rem !important; padding: 0.3rem !important; border-radius: 10px !important;">
                            <button class="filter-btn btn btn-sm ${this.filterData.period === 'today' ? 'btn-primary' : 'btn-ghost'}" data-period="today">Today</button>
                            <button class="filter-btn btn btn-sm ${this.filterData.period === 'week' ? 'btn-primary' : 'btn-ghost'}" data-period="week">Week</button>
                            <button class="filter-btn btn btn-sm ${this.filterData.period === 'month' ? 'btn-primary' : 'btn-ghost'}" data-period="month">Month</button>
                            <button class="filter-btn btn btn-sm ${this.filterData.period === 'year' ? 'btn-primary' : 'btn-ghost'}" data-period="year">Year</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top 8 KPI Cards -->
            <div class="card-header p-0 mb-2 border-0 flex-between">
                <div>
                    <h3 class="text-sm font-bold text-muted uppercase" style="letter-spacing: 0.05em;">8 Key Executive KPIs</h3>
                    <p class="small text-muted mb-0">Real-time business indicators for ALUGRADE LANKA FAB & GLASS</p>
                </div>
                <span class="badge badge-success" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">● Live Data Sync</span>
            </div>
            
            <div class="mb-4" style="display: grid !important; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important; gap: 1.25rem !important; align-items: stretch !important;">
                <div class="kpi-card top-kpi-card p-3 rounded-lg shadow-sm transition-all hover:shadow-md border-left-blue" style="min-height: 110px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                    <div class="flex-between items-start" style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important;">
                        <div>
                            <p class="small text-muted font-bold uppercase mb-1" style="font-size: 0.75rem; letter-spacing: 0.04em;">Total Customers</p>
                            <h3 class="h4 font-bold text-main mb-0" style="font-size: 1.5rem; letter-spacing: -0.02em;"><span class="kpi-value" data-val="850">850</span></h3>
                            <span class="small text-success font-bold" style="font-size: 0.75rem;">↑ +12% this month</span>
                        </div>
                        <div class="p-2 bg-light rounded-circle" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgba(37, 99, 235, 0.08);"><i class="fas fa-users text-primary text-lg"></i></div>
                    </div>
                </div>

                <div class="kpi-card top-kpi-card p-3 rounded-lg shadow-sm transition-all hover:shadow-md border-left-blue" style="min-height: 110px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                    <div class="flex-between items-start" style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important;">
                        <div>
                            <p class="small text-muted font-bold uppercase mb-1" style="font-size: 0.75rem; letter-spacing: 0.04em;">Active Quotations</p>
                            <h3 class="h4 font-bold text-main mb-0" style="font-size: 1.5rem; letter-spacing: -0.02em;"><span class="kpi-value" data-val="64">64</span></h3>
                            <span class="small text-primary font-bold" style="font-size: 0.75rem;">Pending Approval</span>
                        </div>
                        <div class="p-2 bg-light rounded-circle" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgba(59, 130, 246, 0.08);"><i class="fas fa-file-alt text-blue-500 text-lg"></i></div>
                    </div>
                </div>

                <div class="kpi-card top-kpi-card p-3 rounded-lg shadow-sm transition-all hover:shadow-md border-left-blue" style="min-height: 110px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                    <div class="flex-between items-start" style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important;">
                        <div>
                            <p class="small text-muted font-bold uppercase mb-1" style="font-size: 0.75rem; letter-spacing: 0.04em;">Active Orders</p>
                            <h3 class="h4 font-bold text-main mb-0" style="font-size: 1.5rem; letter-spacing: -0.02em;"><span class="kpi-value" data-val="157">157</span></h3>
                            <span class="small text-warning font-bold" style="font-size: 0.75rem;">In Processing</span>
                        </div>
                        <div class="p-2 bg-light rounded-circle" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgba(245, 158, 11, 0.08);"><i class="fas fa-shopping-cart text-warning text-lg"></i></div>
                    </div>
                </div>

                <div class="kpi-card top-kpi-card p-3 rounded-lg shadow-sm transition-all hover:shadow-md border-left-blue" style="min-height: 110px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                    <div class="flex-between items-start" style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important;">
                        <div>
                            <p class="small text-muted font-bold uppercase mb-1" style="font-size: 0.75rem; letter-spacing: 0.04em;">Running Production</p>
                            <h3 class="h4 font-bold text-main mb-0" style="font-size: 1.5rem; letter-spacing: -0.02em;"><span class="kpi-value" data-val="112">112</span></h3>
                            <span class="small text-info font-bold" style="font-size: 0.75rem;">Workshop Pipeline</span>
                        </div>
                        <div class="p-2 bg-light rounded-circle" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgba(139, 92, 246, 0.08);"><i class="fas fa-cogs text-purple-600 text-lg"></i></div>
                    </div>
                </div>

                <div class="kpi-card top-kpi-card p-3 rounded-lg shadow-sm transition-all hover:shadow-md border-left-green" style="min-height: 110px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                    <div class="flex-between items-start" style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important;">
                        <div>
                            <p class="small text-muted font-bold uppercase mb-1" style="font-size: 0.75rem; letter-spacing: 0.04em;">Monthly Revenue</p>
                            <h3 class="h4 font-bold text-main mb-0" style="font-size: 1.5rem; letter-spacing: -0.02em;"><span class="small text-muted me-1" style="font-size:0.8rem;">LKR</span><span class="kpi-value" data-val="1250000">1,250,000</span></h3>
                            <span class="small text-success font-bold" style="font-size: 0.75rem;">↑ +15% vs last month</span>
                        </div>
                        <div class="p-2 bg-light rounded-circle" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgba(16, 185, 129, 0.08);"><i class="fas fa-chart-line text-success text-lg"></i></div>
                    </div>
                </div>

                <div class="kpi-card top-kpi-card p-3 rounded-lg shadow-sm transition-all hover:shadow-md border-left-warning" style="min-height: 110px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                    <div class="flex-between items-start" style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important;">
                        <div>
                            <p class="small text-muted font-bold uppercase mb-1" style="font-size: 0.75rem; letter-spacing: 0.04em;">Pending Invoices</p>
                            <h3 class="h4 font-bold text-main mb-0" style="font-size: 1.5rem; letter-spacing: -0.02em;"><span class="kpi-value" data-val="28">28</span></h3>
                            <span class="small text-warning font-bold" style="font-size: 0.75rem;">Awaiting Payment</span>
                        </div>
                        <div class="p-2 bg-light rounded-circle" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgba(245, 158, 11, 0.08);"><i class="fas fa-file-invoice text-warning text-lg"></i></div>
                    </div>
                </div>

                <div class="kpi-card top-kpi-card p-3 rounded-lg shadow-sm transition-all hover:shadow-md border-left-danger" style="min-height: 110px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                    <div class="flex-between items-start" style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important;">
                        <div>
                            <p class="small text-muted font-bold uppercase mb-1" style="font-size: 0.75rem; letter-spacing: 0.04em;">Pending Payments</p>
                            <h3 class="h4 font-bold text-main mb-0" style="font-size: 1.5rem; letter-spacing: -0.02em;"><span class="small text-muted me-1" style="font-size:0.8rem;">LKR</span><span class="kpi-value" data-val="1200000">1,200,000</span></h3>
                            <span class="small text-danger font-bold" style="font-size: 0.75rem;">Overdue Receivables</span>
                        </div>
                        <div class="p-2 bg-light rounded-circle" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgba(239, 68, 68, 0.08);"><i class="fas fa-exclamation-circle text-danger text-lg"></i></div>
                    </div>
                </div>

                <div class="kpi-card top-kpi-card p-3 rounded-lg shadow-sm transition-all hover:shadow-md border-left-green" style="min-height: 110px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                    <div class="flex-between items-start" style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important;">
                        <div>
                            <p class="small text-muted font-bold uppercase mb-1" style="font-size: 0.75rem; letter-spacing: 0.04em;">Completed Deliveries</p>
                            <h3 class="h4 font-bold text-main mb-0" style="font-size: 1.5rem; letter-spacing: -0.02em;"><span class="kpi-value" data-val="1300">1,300</span></h3>
                            <span class="small text-success font-bold" style="font-size: 0.75rem;">Dispatched to Site</span>
                        </div>
                        <div class="p-2 bg-light rounded-circle" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgba(16, 185, 129, 0.08);"><i class="fas fa-truck text-success text-lg"></i></div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions Panel -->
            <div class="card mb-4 p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="card-header pb-3 mb-3 border-bottom flex-between" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                    <div>
                        <h3 class="text-sm font-bold text-muted uppercase" style="letter-spacing: 0.05em; font-size: 0.85rem;"><i class="fas fa-bolt text-warning me-2"></i> Quick Actions Panel</h3>
                        <p class="small text-muted mb-0">Direct shortcuts to create records and navigate core ERP modules</p>
                    </div>
                    <span class="small text-muted font-medium">8 Instant Shortcuts</span>
                </div>
                <div class="gap-3" style="display: grid !important; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important; gap: 0.85rem !important;">
                    <button class="btn btn-outline flex items-center gap-3 justify-start p-3 transition-all hover:shadow-sm" style="border-radius: 10px; border: 1px solid var(--color-border); background: #ffffff; text-align: left;" onclick="window.location.hash='#/customers'">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-user-plus text-primary"></i>
                        </div> 
                        <div class="text-left">
                            <div class="font-bold small text-main">+ New Customer</div>
                            <div class="text-muted" style="font-size: 0.72rem;">Register Client CRM</div>
                        </div>
                    </button>

                    <button class="btn btn-outline flex items-center gap-3 justify-start p-3 transition-all hover:shadow-sm" style="border-radius: 10px; border: 1px solid var(--color-border); background: #ffffff; text-align: left;" onclick="window.location.hash='#/quotations'">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(59, 130, 246, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-file-alt text-blue-500"></i>
                        </div> 
                        <div class="text-left">
                            <div class="font-bold small text-main">+ New Quotation</div>
                            <div class="text-muted" style="font-size: 0.72rem;">Create Price Estimate</div>
                        </div>
                    </button>

                    <button class="btn btn-outline flex items-center gap-3 justify-start p-3 transition-all hover:shadow-sm" style="border-radius: 10px; border: 1px solid var(--color-border); background: #ffffff; text-align: left;" onclick="window.location.hash='#/orders'">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(245, 158, 11, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-shopping-bag text-warning"></i>
                        </div> 
                        <div class="text-left">
                            <div class="font-bold small text-main">+ New Order</div>
                            <div class="text-muted" style="font-size: 0.72rem;">Confirm Fabrication Job</div>
                        </div>
                    </button>

                    <button class="btn btn-outline flex items-center gap-3 justify-start p-3 transition-all hover:shadow-sm" style="border-radius: 10px; border: 1px solid var(--color-border); background: #ffffff; text-align: left;" onclick="window.location.hash='#/invoices'">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(16, 185, 129, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-file-invoice-dollar text-success"></i>
                        </div> 
                        <div class="text-left">
                            <div class="font-bold small text-main">+ New Invoice</div>
                            <div class="text-muted" style="font-size: 0.72rem;">Generate Billing Record</div>
                        </div>
                    </button>

                    <button class="btn btn-outline flex items-center gap-3 justify-start p-3 transition-all hover:shadow-sm" style="border-radius: 10px; border: 1px solid var(--color-border); background: #ffffff; text-align: left;" onclick="window.location.hash='#/production'">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(139, 92, 246, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-cogs text-purple-600"></i>
                        </div> 
                        <div class="text-left">
                            <div class="font-bold small text-main">Production Entry</div>
                            <div class="text-muted" style="font-size: 0.72rem;">Advance Stage Pipeline</div>
                        </div>
                    </button>

                    <button class="btn btn-outline flex items-center gap-3 justify-start p-3 transition-all hover:shadow-sm" style="border-radius: 10px; border: 1px solid var(--color-border); background: #ffffff; text-align: left;" onclick="window.location.hash='#/payments'">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(16, 185, 129, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-wallet text-success"></i>
                        </div> 
                        <div class="text-left">
                            <div class="font-bold small text-main">Record Payment</div>
                            <div class="text-muted" style="font-size: 0.72rem;">Process Cash / Deposit</div>
                        </div>
                    </button>

                    <button class="btn btn-outline flex items-center gap-3 justify-start p-3 transition-all hover:shadow-sm" style="border-radius: 10px; border: 1px solid var(--color-border); background: #ffffff; text-align: left;" onclick="window.location.hash='#/delivery'">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(99, 102, 241, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-truck text-indigo-500"></i>
                        </div> 
                        <div class="text-left">
                            <div class="font-bold small text-main">Delivery Note</div>
                            <div class="text-muted" style="font-size: 0.72rem;">Schedule Site Dispatch</div>
                        </div>
                    </button>

                    <button class="btn btn-outline flex items-center gap-3 justify-start p-3 transition-all hover:shadow-sm" style="border-radius: 10px; border: 1px solid var(--color-border); background: #ffffff; text-align: left;" onclick="window.location.hash='#/reports'">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(37, 99, 235, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-chart-pie text-primary"></i>
                        </div> 
                        <div class="text-left">
                            <div class="font-bold small text-main">Reports</div>
                            <div class="text-muted" style="font-size: 0.72rem;">Export P&L & Stock Logs</div>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Four Operational Sector Summaries -->
            <div class="mb-4" style="display: grid !important; grid-template-columns: repeat(auto-fit, minmax(440px, 1fr)) !important; gap: 1.25rem !important;">
                <!-- Inventory Summary -->
                <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="card-header border-bottom pb-2 mb-3 flex-between" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <h3 class="text-primary font-bold" style="font-size: 0.95rem;"><i class="fas fa-boxes text-blue-500 me-2"></i> Inventory Summary</h3>
                        <span class="badge badge-warning">Low Stock Monitor</span>
                    </div>
                    <div class="gap-2 text-center" style="display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 0.5rem !important;">
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">Aluminium Profiles</div>
                            <div class="fw-bold text-danger">8 Profiles</div>
                            <div class="small text-muted" style="font-size:0.7rem">Min Threshold: 10</div>
                        </div>
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">Glass Sheets</div>
                            <div class="fw-bold text-success">45 Sheets</div>
                            <div class="small text-muted" style="font-size:0.7rem">Clear & Tempered</div>
                        </div>
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">Accessories</div>
                            <div class="fw-bold text-primary">120 Units</div>
                            <div class="small text-muted" style="font-size:0.7rem">Locks & Rollers</div>
                        </div>
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">Rubber & Gasket</div>
                            <div class="fw-bold text-success">15 Rolls</div>
                            <div class="small text-muted" style="font-size:0.7rem">EPDM Quality</div>
                        </div>
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">Silicon Sealant</div>
                            <div class="fw-bold text-warning">14 Tubes</div>
                            <div class="small text-muted" style="font-size:0.7rem">Weatherproof</div>
                        </div>
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">King Long Hardware</div>
                            <div class="fw-bold text-success">60 Sets</div>
                            <div class="small text-muted" style="font-size:0.7rem">Fittings & Hinges</div>
                        </div>
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">BP Hardware</div>
                            <div class="fw-bold text-success">35 Sets</div>
                            <div class="small text-muted" style="font-size:0.7rem">Locks & Handles</div>
                        </div>
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">3H Hardware</div>
                            <div class="fw-bold text-success">28 Sets</div>
                            <div class="small text-muted" style="font-size:0.7rem">Architectural</div>
                        </div>
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">304 Stainless Steel</div>
                            <div class="fw-bold text-success">90 Pcs</div>
                            <div class="small text-muted" style="font-size:0.7rem">SS Accessories</div>
                        </div>
                    </div>
                </div>

                <!-- Payment Summary -->
                <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="card-header border-bottom pb-2 mb-3 flex-between" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <h3 class="text-success font-bold" style="font-size: 0.95rem;"><i class="fas fa-wallet text-green-500 me-2"></i> Payment Summary</h3>
                        <span class="badge badge-success">Collection Audit</span>
                    </div>
                    <div class="mb-3 p-3 bg-light rounded border flex-between" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <div>
                            <div class="small text-muted font-bold">Today's Total Cash Collection</div>
                            <div class="h4 font-bold text-success mb-0">LKR 485,000.00</div>
                        </div>
                        <i class="fas fa-cash-register text-success text-2xl"></i>
                    </div>
                    <div class="gap-2 text-center mb-1" style="display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 0.5rem !important;">
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">Cash Counter</div>
                            <div class="fw-bold text-primary">LKR 125,000.00</div>
                        </div>
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">Commercial Bank Deposit</div>
                            <div class="fw-bold text-primary">LKR 260,000.00</div>
                        </div>
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">Online Bank Transfer</div>
                            <div class="fw-bold text-primary">LKR 100,000.00</div>
                        </div>
                        <div class="p-2 bg-light rounded border">
                            <div class="small text-muted font-bold">Pending Receivable</div>
                            <div class="fw-bold text-danger">LKR 1,200,000.00</div>
                        </div>
                    </div>
                </div>

                <!-- Production Progress -->
                <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="card-header border-bottom pb-2 mb-3 flex-between" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <h3 class="text-info font-bold" style="font-size: 0.95rem;"><i class="fas fa-cogs text-purple-500 me-2"></i> Production Progress</h3>
                        <span class="badge badge-info">Workshop Queue</span>
                    </div>
                    <div class="gap-2 text-center" style="display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 0.5rem !important;">
                        <div class="p-3 bg-light rounded border">
                            <div class="small text-muted font-bold mb-1">Pending Jobs</div>
                            <div class="h3 font-bold text-warning mb-0">45</div>
                            <div class="small text-muted" style="font-size:0.7rem">Awaiting Cutting</div>
                        </div>
                        <div class="p-3 bg-light rounded border">
                            <div class="small text-muted font-bold mb-1">Running Jobs</div>
                            <div class="h3 font-bold text-primary mb-0">112</div>
                            <div class="small text-muted" style="font-size:0.7rem">Fabrication & Assembly</div>
                        </div>
                        <div class="p-3 bg-light rounded border">
                            <div class="small text-muted font-bold mb-1">Completed Jobs</div>
                            <div class="h3 font-bold text-success mb-0">1,350</div>
                            <div class="small text-muted" style="font-size:0.7rem">Passed Quality Check</div>
                        </div>
                    </div>
                </div>

                <!-- Delivery Status -->
                <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="card-header border-bottom pb-2 mb-3 flex-between" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <h3 class="text-primary font-bold" style="font-size: 0.95rem;"><i class="fas fa-truck text-indigo-500 me-2"></i> Delivery Status</h3>
                        <span class="badge badge-info">Logistics Status</span>
                    </div>
                    <div class="gap-2 text-center" style="display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 0.5rem !important;">
                        <div class="p-3 bg-light rounded border">
                            <div class="small text-muted font-bold mb-1">Pending Dispatch</div>
                            <div class="h3 font-bold text-warning mb-0">45</div>
                            <div class="small text-muted" style="font-size:0.7rem">Scheduled This Week</div>
                        </div>
                        <div class="p-3 bg-light rounded border">
                            <div class="small text-muted font-bold mb-1">Ready at Depot</div>
                            <div class="h3 font-bold text-primary mb-0">8</div>
                            <div class="small text-muted" style="font-size:0.7rem">Today's Shipments</div>
                        </div>
                        <div class="p-3 bg-light rounded border">
                            <div class="small text-muted font-bold mb-1">Delivered to Site</div>
                            <div class="h3 font-bold text-success mb-0">1,300</div>
                            <div class="small text-muted" style="font-size:0.7rem">Signed Off</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Business Analytics Charts Grid -->
            <div class="card-header p-0 mb-2 border-0 flex-between">
                <div>
                    <h3 class="text-sm font-bold text-muted uppercase" style="letter-spacing: 0.05em;">Enterprise Analytics & Charts</h3>
                    <p class="small text-muted mb-0">Revenue trends, order fulfillment, and payment distribution analytics</p>
                </div>
                <span class="small text-muted font-medium">Interactive Canvas Visualizations</span>
            </div>

            <div class="mb-4" style="display: grid !important; grid-template-columns: repeat(auto-fit, minmax(440px, 1fr)) !important; gap: 1.25rem !important;">
                <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="flex-between mb-3" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <h3 class="text-sm font-bold text-main uppercase mb-0" style="letter-spacing: 0.04em;"><i class="fas fa-chart-line text-primary me-2"></i> Revenue Chart (Monthly Revenue Trend)</h3>
                        <span class="badge badge-primary">12-Month Performance</span>
                    </div>
                    <div style="height: 250px;"><canvas id="salesChart"></canvas></div>
                </div>
                <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="flex-between mb-3" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <h3 class="text-sm font-bold text-main uppercase mb-0" style="letter-spacing: 0.04em;"><i class="fas fa-credit-card text-success me-2"></i> Payment Status Chart</h3>
                        <span class="badge badge-success">Paid / Pending / Overdue</span>
                    </div>
                    <div style="height: 250px;"><canvas id="financialChart"></canvas></div>
                </div>
            </div>
            
            <div class="mb-4" style="display: grid !important; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important; gap: 1.25rem !important;">
                <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="flex-between mb-3" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <h3 class="text-sm font-bold text-main uppercase mb-0" style="letter-spacing: 0.04em;"><i class="fas fa-pie-chart text-warning me-2"></i> Orders vs Deliveries Chart</h3>
                        <span class="badge badge-warning">Status Distribution</span>
                    </div>
                    <div style="height: 250px;"><canvas id="orderStatusChart"></canvas></div>
                </div>
                <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="flex-between mb-3" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <h3 class="text-sm font-bold text-main uppercase mb-0" style="letter-spacing: 0.04em;"><i class="fas fa-tasks text-purple-600 me-2"></i> Production Progress Pipeline</h3>
                        <span class="badge badge-info">Stage Breakdown</span>
                    </div>
                    <div style="height: 250px;"><canvas id="pipelineChart"></canvas></div>
                </div>
                <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="flex-between mb-3" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <h3 class="text-sm font-bold text-main uppercase mb-0" style="letter-spacing: 0.04em;"><i class="fas fa-receipt text-danger me-2"></i> Expense Categories</h3>
                        <span class="badge badge-danger">Cost Allocation</span>
                    </div>
                    <div style="height: 250px;"><canvas id="expenseChart"></canvas></div>
                </div>
            </div>
            
            <div class="mb-4" style="display: grid !important; grid-template-columns: repeat(auto-fit, minmax(440px, 1fr)) !important; gap: 1.25rem !important;">
                <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="flex-between mb-3" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <h3 class="text-sm font-bold text-main uppercase mb-0" style="letter-spacing: 0.04em;"><i class="fas fa-user-plus text-primary me-2"></i> Customer Growth</h3>
                        <span class="badge badge-primary">Monthly Acquisition</span>
                    </div>
                    <div style="height: 250px;"><canvas id="customerChart"></canvas></div>
                </div>
                <div class="card p-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div class="flex-between mb-3" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <h3 class="text-sm font-bold text-main uppercase mb-0" style="letter-spacing: 0.04em;"><i class="fas fa-cubes text-indigo-500 me-2"></i> Top Products Demand</h3>
                        <span class="badge badge-info">Fabrication Volume</span>
                    </div>
                    <div style="height: 250px;"><canvas id="productsChart"></canvas></div>
                </div>
            </div>

            <!-- Complete 24 System Metrics Grid -->
            <div class="card-header p-0 mb-2 border-0 flex-between">
                <div>
                    <h3 class="text-sm font-bold text-muted uppercase" style="letter-spacing: 0.05em;">System Metrics Grid</h3>
                    <p class="small text-muted mb-0">24 Detailed Performance & Operational Metrics</p>
                </div>
                <span class="small text-muted font-medium">Full Operational Audit</span>
            </div>

            <div id="kpi-grid" class="mb-4" style="display: grid !important; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important; gap: 1.25rem !important; align-items: stretch !important;">
                <!-- Skeleton loader -->
                ${Array(24).fill(0).map(() => `
                    <div class="kpi-card p-3 rounded-lg shadow-sm animate-pulse" style="min-height: 110px; background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;">
                        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div class="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                `).join('')}
            </div>

            <!-- Recent Activities Panel Grid -->
            <div class="card-header p-0 mb-2 border-0 flex-between">
                <div>
                    <h3 class="text-sm font-bold text-muted uppercase" style="letter-spacing: 0.05em;">Recent Activities & System Streams</h3>
                    <p class="small text-muted mb-0">Live event timeline covering Quotations, Orders, Invoices, Payments, and Deliveries</p>
                </div>
                <span class="small text-muted font-medium">Real-Time Operational Audit</span>
            </div>

            <div id="widgets-grid" class="mb-4" style="display: grid !important; grid-template-columns: repeat(auto-fit, minmax(440px, 1fr)) !important; gap: 1.25rem !important;">
                <!-- Populated dynamically -->
            </div>
            
            <!-- Business Insights -->
            <div id="business-insights" class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <h3 class="text-primary font-bold mb-3 flex items-center" style="font-size: 1.05rem;">
                    <i class="fas fa-lightbulb text-warning me-2"></i> Commercial ERP Business Insights
                </h3>
                <ul id="insights-list" class="space-y-2 text-muted mb-0" style="padding-left: 0; list-style: none;">
                    <li class="animate-pulse bg-blue-200 h-4 w-3/4 rounded mb-2"></li>
                    <li class="animate-pulse bg-blue-200 h-4 w-2/3 rounded"></li>
                </ul>
            </div>
        `;
        
        this._rendered = true;
        this.bindEvents();
        await this.refreshAll();
    }

    bindEvents() {
        const btns = this.container.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.filter-btn') || e.target;
                const period = target.dataset.period;
                if (!period) return;

                this.applyDateFilter(period);
                
                btns.forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-ghost');
                });
                target.classList.remove('btn-ghost');
                target.classList.add('btn-primary');
            });
        });
    }

    async refreshAll() {
        await Promise.all([
            this.loadKPIs(),
            this.loadCharts(),
            this.loadWidgets(),
            this.loadBusinessInsights()
        ]);
    }

    async fetchKPIData() {
        return {
            totalOrders: 1542,
            pendingOrders: 45,
            inProgress: 112,
            completedOrders: 1350,
            deliveredOrders: 1300,
            cancelledOrders: 35,
            totalCustomers: 850,
            newCustomersMonth: 24,
            activeCustomers: 420,
            monthlyRevenue: 1250000,
            annualRevenue: 15400000,
            totalSales: 16000000,
            totalExpenses: 8000000,
            monthlyExpenses: 650000,
            grossProfit: 6000000,
            netProfit: 3500000,
            outstandingBalance: 1200000,
            advanceReceived: 800000,
            inventoryValue: 2500000,
            lowStockItems: 12,
            outOfStock: 3,
            todaysDeliveries: 8,
            upcomingDeliveries: 45,
            overdueDeliveries: 2
        };
    }

    animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    }

    async loadKPIs() {
        const data = await this.fetchKPIData();
        
        const kpis = [
            { id: 'totalOrders', label: 'Total Orders', value: data.totalOrders, icon: 'fa-shopping-cart', color: 'text-blue-500' },
            { id: 'pendingOrders', label: 'Pending Orders', value: data.pendingOrders, icon: 'fa-clock', color: 'text-yellow-500' },
            { id: 'inProgress', label: 'In Progress', value: data.inProgress, icon: 'fa-spinner', color: 'text-blue-400' },
            { id: 'completedOrders', label: 'Completed Orders', value: data.completedOrders, icon: 'fa-check-circle', color: 'text-green-500' },
            { id: 'deliveredOrders', label: 'Delivered Orders', value: data.deliveredOrders, icon: 'fa-truck', color: 'text-green-600' },
            { id: 'cancelledOrders', label: 'Cancelled Orders', value: data.cancelledOrders, icon: 'fa-times-circle', color: 'text-red-500' },
            { id: 'totalCustomers', label: 'Total Customers', value: data.totalCustomers, icon: 'fa-users', color: 'text-purple-500' },
            { id: 'newCustomersMonth', label: 'New Customers (Month)', value: data.newCustomersMonth, icon: 'fa-user-plus', color: 'text-purple-400' },
            { id: 'activeCustomers', label: 'Active Customers', value: data.activeCustomers, icon: 'fa-user-check', color: 'text-green-400' },
            { id: 'monthlyRevenue', label: 'Monthly Revenue', value: data.monthlyRevenue, icon: 'fa-chart-line', color: 'text-green-600', isCurrency: true },
            { id: 'annualRevenue', label: 'Annual Revenue', value: data.annualRevenue, icon: 'fa-chart-bar', color: 'text-green-700', isCurrency: true },
            { id: 'totalSales', label: 'Total Sales', value: data.totalSales, icon: 'fa-money-bill-wave', color: 'text-blue-600', isCurrency: true },
            { id: 'totalExpenses', label: 'Total Expenses', value: data.totalExpenses, icon: 'fa-file-invoice-dollar', color: 'text-red-600', isCurrency: true },
            { id: 'monthlyExpenses', label: 'Monthly Expenses', value: data.monthlyExpenses, icon: 'fa-receipt', color: 'text-red-500', isCurrency: true },
            { id: 'grossProfit', label: 'Gross Profit', value: data.grossProfit, icon: 'fa-piggy-bank', color: 'text-green-500', isCurrency: true },
            { id: 'netProfit', label: 'Net Profit', value: data.netProfit, icon: 'fa-wallet', color: 'text-green-600', isCurrency: true },
            { id: 'outstandingBalance', label: 'Outstanding Balance', value: data.outstandingBalance, icon: 'fa-exclamation-circle', color: 'text-orange-500', isCurrency: true },
            { id: 'advanceReceived', label: 'Advance Received', value: data.advanceReceived, icon: 'fa-hand-holding-usd', color: 'text-teal-500', isCurrency: true },
            { id: 'inventoryValue', label: 'Inventory Value', value: data.inventoryValue, icon: 'fa-boxes', color: 'text-indigo-500', isCurrency: true },
            { id: 'lowStockItems', label: 'Low Stock Items', value: data.lowStockItems, icon: 'fa-exclamation-triangle', color: 'text-yellow-600' },
            { id: 'outOfStock', label: 'Out of Stock', value: data.outOfStock, icon: 'fa-ban', color: 'text-red-600' },
            { id: 'todaysDeliveries', label: "Today's Deliveries", value: data.todaysDeliveries, icon: 'fa-calendar-day', color: 'text-blue-500' },
            { id: 'upcomingDeliveries', label: 'Upcoming Deliveries', value: data.upcomingDeliveries, icon: 'fa-calendar-alt', color: 'text-purple-500' },
            { id: 'overdueDeliveries', label: 'Overdue Deliveries', value: data.overdueDeliveries, icon: 'fa-calendar-times', color: 'text-red-600' }
        ];

        const grid = document.getElementById('kpi-grid');
        if (!grid) return;
        grid.innerHTML = '';

        kpis.forEach(kpi => {
            const card = document.createElement('div');
            card.className = 'kpi-card p-3 rounded-lg shadow-sm transition-all hover:shadow-md';
            card.style.cssText = 'min-height: 110px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px;';
            
            const currencyPrefix = kpi.isCurrency ? '<span class="text-sm text-muted me-1" style="font-size:0.8rem;">LKR</span>' : '';
            
            card.innerHTML = `
                <div class="flex-between items-start" style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important;">
                    <div>
                        <p class="small text-muted font-bold uppercase mb-1" style="font-size:0.75rem; letter-spacing: 0.04em;">${kpi.label}</p>
                        <h3 class="h4 font-bold text-main mb-0" style="font-size:1.4rem; letter-spacing:-0.02em;">${currencyPrefix}<span class="kpi-value" data-val="${kpi.value}">0</span></h3>
                    </div>
                    <div class="p-2 bg-light rounded-circle flex items-center justify-center" style="width: 38px; height: 38px; flex-shrink: 0; background: rgba(37, 99, 235, 0.06);">
                        <i class="fas ${kpi.icon} ${kpi.color} text-base"></i>
                    </div>
                </div>
            `;
            grid.appendChild(card);
            
            const valSpan = card.querySelector('.kpi-value');
            this.animateValue(valSpan, 0, kpi.value, 1000);
        });
    }

    async loadCharts() {
        if (!this.chartManager && window.ChartManager) {
            this.chartManager = new window.ChartManager();
        }
        if (!this.chartManager) return;

        // 1. Monthly Revenue Trend Chart (salesChart)
        this.chartManager.createAreaChart('salesChart', 
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            [{ 
                label: 'Monthly Revenue (LKR)', 
                data: [850000, 920000, 1050000, 1150000, 980000, 1250000, 1350000, 1420000, 1380000, 1500000, 1450000, 1600000], 
                borderColor: '#2563EB',
                backgroundColor: 'rgba(37, 99, 235, 0.12)' 
            }]
        );

        // 2. Payment Status Chart (Paid / Pending / Overdue) (financialChart)
        this.chartManager.createDoughnutChart('financialChart',
            ['Paid Collection', 'Pending Receivable', 'Overdue Receivables'],
            [16500000, 1200000, 450000],
            ['#10B981', '#F59E0B', '#EF4444']
        );

        // 3. Orders vs Deliveries Chart (orderStatusChart)
        this.chartManager.createBarChart('orderStatusChart',
            ['Pending Orders', 'Running Production', 'Completed Jobs', 'Delivered to Site'],
            [{
                label: 'Volume Count',
                data: [45, 112, 1350, 1300],
                backgroundColor: ['#F59E0B', '#2563EB', '#10B981', '#6366F1']
            }]
        );

        // 4. Production Progress Pipeline
        this.chartManager.createBarChart('pipelineChart',
            ['Cutting', 'Fabrication', 'Assembly', 'Glass Fitting', 'Ready'],
            [{ label: 'Orders in Stage', data: [20, 45, 25, 15, 7], backgroundColor: '#8B5CF6' }]
        );

        // 5. Expense Categories
        this.chartManager.createPieChart('expenseChart',
            ['Profiles & Glass', 'Factory Labor', 'Logistics', 'Utilities', 'Consumables'],
            [500000, 200000, 50000, 30000, 20000]
        );

        // 6. Customer Growth
        this.chartManager.createLineChart('customerChart',
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            [{ label: 'New Client Accounts', data: [10, 15, 12, 25, 20, 30], borderColor: '#2563EB' }]
        );

        // 7. Top Products Demand
        this.chartManager.createHorizontalBarChart('productsChart',
            ['Sliding Doors', 'Casement Windows', 'Shop Fronts', 'Shower Cubicles', 'Partitions'],
            [150, 220, 80, 95, 110]
        );
    }

    async loadWidgets() {
        const widgetsGrid = document.getElementById('widgets-grid');
        if (!widgetsGrid) return;
        widgetsGrid.innerHTML = '';

        const panels = [
            { 
                title: 'Recent Activities Panel', 
                icon: 'fa-history', 
                type: 'activities', 
                color: 'blue',
                items: [
                    { title: 'Quotation #QT-2026-0089 created for Jayasinghe Construction', time: '10m ago', badge: 'Quotation', badgeClass: 'badge-primary' },
                    { title: 'Order #ORD-2026-0157 approved (Aluminium Sliding Doors)', time: '35m ago', badge: 'Order', badgeClass: 'badge-warning' },
                    { title: 'Invoice #INV-2026-0142 issued for LKR 485,000', time: '1h ago', badge: 'Invoice', badgeClass: 'badge-info' },
                    { title: 'Payment #PAY-2026-0098 received via Commercial Bank', time: '2h ago', badge: 'Payment', badgeClass: 'badge-success' },
                    { title: 'Delivery #DEL-2026-0045 dispatched to Homagama site', time: '3h ago', badge: 'Delivery', badgeClass: 'badge-secondary' }
                ]
            },
            { 
                title: 'Recent Orders Stream', 
                icon: 'fa-shopping-cart', 
                type: 'orders', 
                color: 'blue',
                items: [
                    { title: 'ORD-2026-0157 · 4x Sliding Door Sets (Jayasinghe)', time: '35m ago', badge: 'In Progress', badgeClass: 'badge-warning' },
                    { title: 'ORD-2026-0156 · 12x Casement Windows (Silva Builders)', time: '2h ago', badge: 'Cutting', badgeClass: 'badge-info' },
                    { title: 'ORD-2026-0155 · Glass Partition Wall (Perera Towers)', time: '4h ago', badge: 'Completed', badgeClass: 'badge-success' }
                ]
            },
            { 
                title: 'Recent Payment Receipts', 
                icon: 'fa-wallet', 
                type: 'payments', 
                color: 'green',
                items: [
                    { title: 'PAY-2026-0098 · LKR 260,000.00 (Bank Deposit)', time: '2h ago', badge: 'Verified', badgeClass: 'badge-success' },
                    { title: 'PAY-2026-0097 · LKR 125,000.00 (Cash Counter)', time: '3h ago', badge: 'Verified', badgeClass: 'badge-success' },
                    { title: 'PAY-2026-0096 · LKR 100,000.00 (Online Transfer)', time: '5h ago', badge: 'Verified', badgeClass: 'badge-success' }
                ]
            },
            { 
                title: 'Low Stock Critical Alerts', 
                icon: 'fa-exclamation-triangle', 
                type: 'stock', 
                color: 'red',
                items: [
                    { title: 'Aluminium Profile 4-Inch Heavy (Qty: 8 / Min: 10)', time: '1h ago', badge: 'Low Stock', badgeClass: 'badge-danger' },
                    { title: 'Silicon Sealant Clear (Qty: 14 / Min: 20)', time: '2h ago', badge: 'Reorder', badgeClass: 'badge-warning' },
                    { title: 'King Long Roller Double Wheel (Qty: 18 / Min: 25)', time: '4h ago', badge: 'Reorder', badgeClass: 'badge-warning' }
                ]
            },
            { 
                title: 'Upcoming Site Deliveries', 
                icon: 'fa-truck', 
                type: 'deliveries', 
                color: 'indigo',
                items: [
                    { title: 'DEL-2026-0045 · Homagama Hospital Site (Today 2:30 PM)', time: 'Today', badge: 'Dispatched', badgeClass: 'badge-primary' },
                    { title: 'DEL-2026-0046 · Kottawa Villa Project (Tomorrow 10:00 AM)', time: 'Tomorrow', badge: 'Scheduled', badgeClass: 'badge-info' },
                    { title: 'DEL-2026-0047 · Maharagama Commercial Complex', time: 'Aug 02', badge: 'Pending', badgeClass: 'badge-secondary' }
                ]
            },
            { 
                title: 'Workshop Production Queue', 
                icon: 'fa-cogs', 
                type: 'production', 
                color: 'yellow',
                items: [
                    { title: 'Job #112 · Glass Fitting Stage for ORD-0154', time: 'Active', badge: 'Assembly', badgeClass: 'badge-primary' },
                    { title: 'Job #111 · Frame Cutting Stage for ORD-0155', time: 'Active', badge: 'Cutting', badgeClass: 'badge-info' },
                    { title: 'Job #110 · Quality Inspection for ORD-0153', time: 'Testing', badge: 'QC Audit', badgeClass: 'badge-warning' }
                ]
            }
        ];

        panels.forEach(panel => {
            const el = document.createElement('div');
            el.className = 'card p-3 widget-panel';
            el.style.cssText = 'background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);';
            
            let itemsHTML = panel.items.map(item => `
                <div class="flex-between py-2 border-bottom" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                    <div class="truncate pe-2 flex items-center gap-2" style="display:flex; align-items:center; gap:0.5rem;">
                        <span class="badge ${item.badgeClass}" style="font-size:0.68rem; padding:0.2rem 0.5rem; flex-shrink:0;">${item.badge}</span>
                        <span class="small text-main font-medium truncate" style="font-size:0.82rem;">${item.title}</span>
                    </div>
                    <span class="small text-muted font-medium flex-shrink-0" style="font-size:0.75rem;">${item.time}</span>
                </div>
            `).join('');

            el.innerHTML = `
                <div class="card-header pb-2 mb-2 border-bottom flex-between" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                    <h3 class="font-bold text-main small mb-0" style="font-size: 0.9rem;"><i class="fas ${panel.icon} text-primary me-2"></i> ${panel.title}</h3>
                    <button class="btn btn-sm btn-ghost text-primary" style="font-size:0.75rem; padding: 0.2rem 0.5rem;">View All</button>
                </div>
                <div class="widget-content text-sm">
                    ${itemsHTML}
                </div>
            `;
            widgetsGrid.appendChild(el);
        });
    }

    async loadBusinessInsights() {
        const insightsList = document.getElementById('insights-list');
        if (!insightsList) return;
        
        const insights = [
            "Revenue is up 15% compared to the same period last month.",
            "Sliding Doors & Casement Windows represent 68% of total fabrication volume.",
            "You have 12 inventory items running low on stock. Consider reordering soon.",
            "Payment collections are on track with 93% on-time settlement.",
            "Customer acquisition has increased by 12% this month.",
            "Production line currently has 112 running jobs across workshop stations.",
            "Outstanding balance stands at LKR 1,200,000 across 28 pending invoices."
        ];

        insightsList.innerHTML = '';
        insights.forEach(insight => {
            const li = document.createElement('li');
            li.className = 'flex items-start mb-2';
            li.style.cssText = 'display: flex; align-items: flex-start; gap: 0.5rem; color: var(--color-text-main); font-size: 0.85rem;';
            li.innerHTML = `<i class="fas fa-check-circle text-success mt-1 me-1 small" style="flex-shrink:0;"></i> <span>${insight}</span>`;
        });
    }
}

window.Dashboard = Dashboard;
window.DashboardModule = Dashboard;
