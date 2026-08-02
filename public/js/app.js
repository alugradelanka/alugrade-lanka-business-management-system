/**
 * ALUGRADE BMS - Main Application Controller
 * Orchestrates all modules and connects the SPA.
 */

class AlugradeApp {
  constructor() {
    this.router    = null;
    this.modules   = {};
    this.sessionTimer = null;

    this.navConfig = [
      { id: 'dashboard',    label: 'Dashboard',        icon: 'layout-dashboard', route: '#/dashboard',    group: 'MAIN' },
      { id: 'customers',    label: 'Customers',        icon: 'users',            route: '#/customers',    group: 'OPERATIONS' },
      { id: 'quotations',   label: 'Quotations',       icon: 'file-text',        route: '#/quotations',   group: 'OPERATIONS' },
      { id: 'pricelist',    label: 'Price Master',     icon: 'tags',             route: '#/pricelist',    group: 'OPERATIONS' },
      { id: 'orders',       label: 'Orders',           icon: 'shopping-cart',    route: '#/orders',       group: 'OPERATIONS' },
      { id: 'production',   label: 'Production',       icon: 'cog',              route: '#/production',   group: 'OPERATIONS' },
      { id: 'delivery',     label: 'Delivery',         icon: 'truck',            route: '#/delivery',     group: 'OPERATIONS' },
      { id: 'invoices',     label: 'Invoices',         icon: 'receipt',          route: '#/invoices',     group: 'FINANCE' },
      { id: 'payments',     label: 'Payments',         icon: 'credit-card',      route: '#/payments',     group: 'FINANCE' },
      { id: 'expenses',     label: 'Expenses',         icon: 'minus-circle',     route: '#/expenses',     group: 'FINANCE' },
      { id: 'inventory',    label: 'Inventory',        icon: 'package',          route: '#/inventory',    group: 'STOCK' },
      { id: 'reports',      label: 'Reports',          icon: 'bar-chart-2',      route: '#/reports',      group: 'ANALYTICS' },
      { id: 'ai-assistant', label: 'AI Assistant',     icon: 'bot',              route: '#/ai-assistant', group: 'TOOLS' },
      { id: 'users',        label: 'User Management',  icon: 'user-cog',         route: '#/users',        group: 'ADMIN' },
      { id: 'backup',       label: 'Backup & Restore', icon: 'database',         route: '#/backup',       group: 'ADMIN' },
      { id: 'settings',     label: 'Settings',         icon: 'sliders',          route: '#/settings',     group: 'ADMIN' },
      { id: 'help',         label: 'Help Center',      icon: 'help-circle',      route: '#/help',         group: 'ADMIN' },
    ];
  }

  async init() {
    try {
      // 1. Check auth
      if (!window.Auth || !window.Auth.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
      }

      // 2. Initialize all modules
      this._initModules();

      // 3. Setup router with real handlers
      this._setupRouter();

      // 4. Render sidebar nav
      this._renderSidebarNav();

      // 5. Render user info in topbar
      this._renderUserInfo();

      // 6. Setup global event listeners
      this._setupEventListeners();

      // 7. Load app settings (theme, company info)
      await this._applyAppSettings();

      // 8. Start periodic timers
      this._startTimers();

      // 9. Update notification badge
      this._updateNotifBadge();

      // 10. Navigate to current hash or default
      this.router.handleRoute();

      // 11. Start clock
      this._startClock();

      // 12. Setup events bus listeners for cross-module updates
      this._setupEventBusListeners();

      // 13. Hide page loading overlay
      const loader = document.getElementById('pageLoading');
      if (loader) loader.style.display = 'none';

      // Render Lucide icons
      if (window.lucide) window.lucide.createIcons();

    } catch (err) {
      console.error('App init error:', err);
      const content = this._getContentContainer();
      if (content) {
        content.innerHTML = `
          <div style="padding:40px;text-align:center;">
            <h2 style="color:#C41230;">Application Error</h2>
            <p style="color:#666;margin:12px 0;">${err.message}</p>
            <button onclick="window.location.href='index.html'" 
              style="padding:10px 24px;background:#C41230;color:#fff;border:none;border-radius:8px;cursor:pointer;">
              Return to Login
            </button>
          </div>`;
      }
    }
  }

  _initModules() {
    // Instantiate modules if classes exist
    // Some modules take no args, some take 'pageContent' containerId
    const noArgModules = {
      'dashboard':    window.DashboardModule,
      'pricelist':    window.PriceListModule,
      'orders':       window.OrderModule,
      'inventory':    window.InventoryModule,
      'payments':     window.PaymentModule,
      'expenses':     window.ExpenseModule,
      'reports':      window.ReportModule,
      'production':   window.ProductionModule,
      'delivery':     window.DeliveryModule,
      'settings':     window.SettingsModule,
      'ai-assistant': window.AIAssistantModule,
      'help':         window.HelpModule,
      'backup':       window.BackupModule,
    };

    for (const [key, Cls] of Object.entries(noArgModules)) {
      if (Cls) {
        try { 
          this.modules[key] = typeof Cls === 'function' ? new Cls() : Cls; 
        } catch (e) { 
          console.warn(`Module init failed: ${key}`, e); 
        }
      }
    }

    // Modules that take custom parameters
    if (window.CustomerModule) {
      try { 
        this.modules['customers'] = new window.CustomerModule(window.DB, window.Events); 
      } catch(e) { console.warn('Module init failed: customers', e); }
    }
    if (window.QuotationModule) {
      try { 
        this.modules['quotations'] = new window.QuotationModule('pageContent');
      } catch(e) { console.warn('Module init failed: quotations', e); }
    }
    if (window.InvoiceModule) {
      try { 
        this.modules['invoices'] = new window.InvoiceModule('pageContent');
      } catch(e) { console.warn('Module init failed: invoices', e); }
    }
    if (window.UserModule) {
      try { 
        this.modules['users'] = new window.UserModule(window.DB, window.Events); 
      } catch(e) { console.warn('Module init failed: users', e); }
    }
    if (window.ProductionModule) {
      try { 
        this.modules['production'] = new window.ProductionModule(window.DB, window.Events); 
      } catch(e) { console.warn('Module init failed: production', e); }
    }
    if (window.DeliveryModule) {
      try { 
        this.modules['delivery'] = new window.DeliveryModule(window.DB, window.Events); 
      } catch(e) { console.warn('Module init failed: delivery', e); }
    }
    if (window.ExpenseModule) {
      try { 
        this.modules['expenses'] = new window.ExpenseModule(window.DB, window.Events); 
      } catch(e) { console.warn('Module init failed: expenses', e); }
    }
    if (window.ReportModule) {
      try { 
        this.modules['reports'] = new window.ReportModule(window.DB, window.Events); 
      } catch(e) { console.warn('Module init failed: reports', e); }
    }
    if (window.BackupModule) {
      try { 
        this.modules['backup'] = new window.BackupModule(window.DB, window.Events); 
      } catch(e) { console.warn('Module init failed: backup', e); }
    }
    if (window.SettingsModule) {
      try { 
        this.modules['settings'] = new window.SettingsModule(window.DB, window.Events); 
      } catch(e) { console.warn('Module init failed: settings', e); }
    }

    // Assign global window handles for inline onclick handlers across templates
    window.dashboardModule = this.modules['dashboard'];
    window.priceListModule = this.modules['pricelist'];
    window.customerModule  = this.modules['customers'];
    window.orderModule     = this.modules['orders'];
    window.quotationModule = this.modules['quotations'];
    window.invoiceModule   = this.modules['invoices'];
    window.userModule      = this.modules['users'];
    window.inventoryModule = this.modules['inventory'];
    window.paymentModule   = this.modules['payments'];
    window.expenseModule   = this.modules['expenses'];
    window.reportModule    = this.modules['reports'];
    window.productionModule= this.modules['production'];
    window.deliveryModule  = this.modules['delivery'];
    window.backupModule    = this.modules['backup'];

    // Direct property aliases on app instance
    this.dashboard  = this.modules['dashboard'];
    this.pricelist  = this.modules['pricelist'];
    this.customers  = this.modules['customers'];
    this.orders     = this.modules['orders'];
    this.quotations = this.modules['quotations'];
    this.invoices   = this.modules['invoices'];
    this.users      = this.modules['users'];
    this.inventory  = this.modules['inventory'];
    this.payments   = this.modules['payments'];
    this.expenses   = this.modules['expenses'];
    this.reports    = this.modules['reports'];
    this.production = this.modules['production'];
    this.delivery   = this.modules['delivery'];
    this.backup     = this.modules['backup'];
    this.settings   = this.modules['settings'];
    this.help       = this.modules['help'];

    // Notifications
    if (window.NotificationService) {
      this.notifications = new window.NotificationService(window.DB);
    }
    if (window.SearchService) {
      this.searchService = new window.SearchService(window.DB);
    }
  }

  _getContentContainer() {
    return document.getElementById('pageContent') || 
           document.getElementById('mainContent') || 
           document.getElementById('main-content') || 
           document.getElementById('page-content');
  }

  _setupRouter() {
    this.router = new Router();

    const render = (key) => (params) => {
      const mod = this.modules[key];
      const content = this._getContentContainer();
      if (!content) return;

      content.innerHTML = '<div class="page-loading"><div class="loading-spinner-large"></div></div>';

      // Short microtask delay for smooth transition
      setTimeout(async () => {
        if (mod && typeof mod.render === 'function') {
          try {
            const result = await mod.render(params);
            if (typeof result === 'string') {
              content.innerHTML = result;
            } else if (result instanceof HTMLElement) {
              content.innerHTML = '';
              content.appendChild(result);
            }
            if (typeof mod.initEventListeners === 'function') {
              mod.initEventListeners();
            }
          } catch (e) {
            console.error(`Module render error (${key}):`, e);
            content.innerHTML = this._errorPage(key, e);
          }
        } else {
          content.innerHTML = this._comingSoon(key);
        }
        if (window.lucide) window.lucide.createIcons();
        this._setActiveNav(key);
        this._updateBreadcrumb(key);
      }, 50);
    };

    const renderSub = (key, fnName) => (p) => {
      const m = this.modules[key];
      const content = this._getContentContainer();
      if (m && typeof m[fnName] === 'function' && content) {
        const result = m[fnName](p?.id || p);
        if (typeof result === 'string') content.innerHTML = result;
        else if (result instanceof HTMLElement) { content.innerHTML = ''; content.appendChild(result); }
        if (typeof m.initEventListeners === 'function') m.initEventListeners();
      }
      if (window.lucide) window.lucide.createIcons();
      this._setActiveNav(key);
      this._updateBreadcrumb(key);
    };

    // Register all routes
    this.router.register('#/dashboard',         render('dashboard'));
    this.router.register('#/customers',         render('customers'));
    this.router.register('#/customers/new',     renderSub('customers', 'renderNewForm'));
    this.router.register('#/customers/:id',     renderSub('customers', 'renderProfile'));
    this.router.register('#/customers/:id/edit',renderSub('customers', 'renderEditForm'));
    this.router.register('#/orders',            render('orders'));
    this.router.register('#/orders/new',        renderSub('orders', 'renderNewForm'));
    this.router.register('#/orders/:id',        renderSub('orders', 'renderDetail'));
    this.router.register('#/quotations',        render('quotations'));
    this.router.register('#/quotations/new',    renderSub('quotations', 'renderNewForm'));
    this.router.register('#/quotations/:id',    renderSub('quotations', 'renderDetail'));
    this.router.register('#/invoices',          render('invoices'));
    this.router.register('#/invoices/:id',      renderSub('invoices', 'renderDetail'));
    this.router.register('#/inventory',         render('inventory'));
    this.router.register('#/payments',          render('payments'));
    this.router.register('#/expenses',          render('expenses'));
    this.router.register('#/reports',           render('reports'));
    this.router.register('#/production',        render('production'));
    this.router.register('#/delivery',          render('delivery'));
    this.router.register('#/users',             render('users'));
    this.router.register('#/settings',          render('settings'));
    this.router.register('#/ai-assistant',      render('ai-assistant'));
    this.router.register('#/help',              render('help'));
    this.router.register('#/backup',            render('backup'));
    this.router.register('#/notifications',     () => {
      const n = this.notifications;
      const content = document.getElementById('pageContent');
      if (content && n) { content.innerHTML = n.renderNotificationPanel ? n.renderNotificationPanel() : '<div class="p-4">Notifications</div>'; }
    });
  }

  _renderSidebarNav() {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;

    const groups = [...new Set(this.navConfig.map(i => i.group))];
    const groupLabels = { MAIN: 'Main', OPERATIONS: 'Operations', FINANCE: 'Finance', STOCK: 'Inventory', ANALYTICS: 'Analytics', TOOLS: 'Tools', ADMIN: 'Administration' };

    let html = '';
    for (const group of groups) {
      const items = this.navConfig.filter(i => i.group === group);
      html += `<div class="nav-group">
        <div class="nav-group-title">${groupLabels[group] || group}</div>`;
      for (const item of items) {
        html += `
          <a class="nav-item" href="${item.route}" data-route="${item.id}" data-nav-id="${item.id}">
            <span class="nav-icon"><i data-lucide="${item.icon}"></i></span>
            <span class="nav-label">${item.label}</span>
          </a>`;
      }
      html += '</div>';
    }
    nav.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  _renderUserInfo() {
    const session = window.Auth.getCurrentUser();
    if (!session) return;

    const nameEl    = document.getElementById('userName');
    const roleEl    = document.getElementById('userRole');
    const avatarEl  = document.getElementById('userAvatar');

    if (nameEl)   nameEl.textContent   = session.name || 'User';
    if (roleEl)   roleEl.textContent   = session.role || 'Staff';
    if (avatarEl) avatarEl.textContent = (session.name || 'U').charAt(0).toUpperCase();
  }

  _setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar       = document.getElementById('sidebar');
    sidebarToggle?.addEventListener('click', () => {
      sidebar?.classList.toggle('sidebar--collapsed');
    });

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const overlay       = document.getElementById('sidebarOverlay');
    mobileMenuBtn?.addEventListener('click', () => {
      sidebar?.classList.toggle('sidebar--open');
      overlay?.classList.toggle('active');
    });
    overlay?.addEventListener('click', () => {
      sidebar?.classList.remove('sidebar--open');
      overlay?.classList.remove('active');
    });

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('alugrade_theme', next);
      this._updateThemeIcons(next);
    });

    // Notification bell
    document.getElementById('notificationBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = document.getElementById('notificationPanel');
      const isOpen = panel?.style.display !== 'none';
      panel.style.display = isOpen ? 'none' : 'block';
      if (!isOpen) this._loadNotifications();
    });

    // User menu
    document.getElementById('userMenuBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const dd = document.getElementById('userDropdown');
      dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.Auth.logout();
    });

    // Settings shortcut
    document.getElementById('settingsBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('userDropdown').style.display = 'none';
      window.location.hash = '#/settings';
    });

    // Help shortcut
    document.getElementById('helpBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('userDropdown').style.display = 'none';
      window.location.hash = '#/help';
    });

    // My profile
    document.getElementById('myProfileBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      const session = window.Auth.getCurrentUser();
      if (session) {
        document.getElementById('userDropdown').style.display = 'none';
        window.location.hash = `#/users`;
      }
    });

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      const notifPanel = document.getElementById('notificationPanel');
      const userDD     = document.getElementById('userDropdown');
      const searchDD   = document.getElementById('searchResults');
      if (notifPanel) notifPanel.style.display = 'none';
      if (userDD)     userDD.style.display     = 'none';
      if (searchDD)   searchDD.style.display   = 'none';
    });

    // Global search
    const searchInput = document.getElementById('globalSearch');
    let searchDebounce;
    searchInput?.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => this._doSearch(e.target.value), 300);
    });
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('searchResults').style.display = 'none';
        e.target.blur();
      }
    });

    // Ctrl+K global search shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch')?.focus();
      }
    });

    // Confirm dialog
    document.getElementById('confirmOk')?.addEventListener('click', () => {
      if (window._confirmCallback) { window._confirmCallback(); }
      document.getElementById('confirmOverlay').style.display = 'none';
    });
    document.getElementById('confirmCancel')?.addEventListener('click', () => {
      document.getElementById('confirmOverlay').style.display = 'none';
    });

    // Session extend
    document.getElementById('extendSession')?.addEventListener('click', () => {
      window.Auth.ping();
      document.getElementById('sessionWarning').style.display = 'none';
      clearInterval(this.sessionTimer);
      this._startTimers();
    });

    // AI FAB
    document.getElementById('aiFab')?.addEventListener('click', () => {
      window.location.hash = '#/ai-assistant';
    });

    // Apply saved theme
    const savedTheme = localStorage.getItem('alugrade_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this._updateThemeIcons(savedTheme);
  }

  _updateThemeIcons(theme) {
    const light = document.getElementById('themeIconLight');
    const dark  = document.getElementById('themeIconDark');
    if (theme === 'dark') {
      if (light) light.style.display = 'none';
      if (dark)  dark.style.display  = 'block';
    } else {
      if (light) light.style.display = 'block';
      if (dark)  dark.style.display  = 'none';
    }
  }

  _setActiveNav(routeId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const active = document.querySelector(`[data-nav-id="${routeId}"]`);
    if (active) active.classList.add('active');
  }

  _updateBreadcrumb(routeId) {
    const labels = {
      dashboard: 'Dashboard', customers: 'Customers', orders: 'Orders',
      quotations: 'Quotations', invoices: 'Invoices', inventory: 'Inventory',
      payments: 'Payments', expenses: 'Expenses', reports: 'Reports',
      production: 'Production', delivery: 'Delivery', users: 'Users',
      settings: 'Settings', 'ai-assistant': 'AI Assistant', help: 'Help',
      backup: 'Backup & Restore', notifications: 'Notifications'
    };
    const bc = document.getElementById('breadcrumb');
    if (bc) {
      bc.innerHTML = `
        <span class="bc-home"><i data-lucide="home" style="width:14px;height:14px;"></i></span>
        <span class="bc-sep">/</span>
        <span class="bc-current">${labels[routeId] || routeId}</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
    document.title = `${labels[routeId] || routeId} - ALUGRADE BMS`;
  }

  async _applyAppSettings() {
    try {
      const settings = await window.DB.getSettings();
      // Apply company name if set
      if (settings.companyName) {
        document.title = `ALUGRADE BMS â€“ ${settings.companyName}`;
      }
      // Apply custom logo if set
      if (settings.logoBase64) {
        const logoImgs = document.querySelectorAll('.sidebar-logo-img');
        logoImgs.forEach(img => img.src = settings.logoBase64);
      }
    } catch (e) {
      // Settings not critical
    }
  }

  async _updateNotifBadge() {
    try {
      if (!this.notifications) return;
      const count = await this.notifications.getUnreadCount();
      const badge = document.getElementById('notifBadge');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    } catch (e) {}
  }

  async _loadNotifications() {
    try {
      const panel = document.getElementById('notificationPanel');
      if (!panel || !this.notifications) return;
      const notifs = await this.notifications.getAll(20);
      const html = notifs.length
        ? `<div class="notif-header"><span>Notifications</span><button onclick="window.app._markAllRead()" class="btn-link">Mark all read</button></div>`
          + notifs.map(n => `
            <div class="notif-item ${n.isRead ? '' : 'notif-item--unread'}" onclick="window.app._notifClick('${n.id}', '${n.relatedRoute || ''}')">
              <div class="notif-dot"></div>
              <div class="notif-body">
                <div class="notif-title">${n.title || 'Notification'}</div>
                <div class="notif-msg">${n.message || ''}</div>
                <div class="notif-time">${n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
              </div>
            </div>`).join('')
        : '<div class="notif-empty"><i data-lucide="bell-off"></i><p>No notifications</p></div>';
      panel.innerHTML = html;
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {}
  }

  async _markAllRead() {
    try {
      if (this.notifications) await this.notifications.markAllAsRead();
      this._updateNotifBadge();
      this._loadNotifications();
    } catch (e) {}
  }

  _notifClick(id, route) {
    if (this.notifications) this.notifications.markAsRead(id);
    if (route) window.location.hash = route;
    document.getElementById('notificationPanel').style.display = 'none';
    this._updateNotifBadge();
  }

  async _doSearch(query) {
    const resultsEl = document.getElementById('searchResults');
    if (!resultsEl) return;
    if (!query || query.length < 2) {
      resultsEl.style.display = 'none';
      return;
    }
    try {
      if (this.searchService) {
        const results = await this.searchService.search(query);
        resultsEl.innerHTML = this.searchService.renderResults(results);
      } else {
        // Basic built-in search
        const customers = await window.DB.search('customers', query, ['name', 'phone', 'customerId', 'companyName']);
        const orders    = await window.DB.search('orders', query, ['orderNumber', 'productName']);
        const html = [
          ...customers.slice(0,3).map(c => `<div class="sr-item" onclick="window.location.hash='#/customers/${c.id}';document.getElementById('searchResults').style.display='none'"><i data-lucide="user" class="sr-icon"></i><span>${c.name}</span><small>${c.phone || ''}</small></div>`),
          ...orders.slice(0,3).map(o => `<div class="sr-item" onclick="window.location.hash='#/orders/${o.id}';document.getElementById('searchResults').style.display='none'"><i data-lucide="shopping-cart" class="sr-icon"></i><span>${o.orderNumber}</span><small>${o.customerName || ''}</small></div>`)
        ].join('') || '<div class="sr-empty">No results found</div>';
        resultsEl.innerHTML = html;
      }
      resultsEl.style.display = 'block';
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      resultsEl.style.display = 'none';
    }
  }

  _startClock() {
    const update = () => {
      const el = document.getElementById('topbarDatetime');
      if (el) {
        const now = new Date();
        el.textContent = now.toLocaleString('en-LK', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
    };
    update();
    setInterval(update, 1000);
  }

  _startTimers() {
    const timeout = (window.APP_CONFIG?.sessionTimeout) || (30 * 60 * 1000);
    const warnAt  = timeout - 5 * 60 * 1000;

    this.sessionTimer = setTimeout(() => {
      const warning = document.getElementById('sessionWarning');
      if (warning) warning.style.display = 'flex';
      let remaining = 300;
      const interval = setInterval(() => {
        remaining--;
        const cd = document.getElementById('sessionCountdown');
        if (cd) cd.textContent = `${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;
        if (remaining <= 0) {
          clearInterval(interval);
          window.Auth.logout();
        }
      }, 1000);
    }, warnAt);

    // Periodic checks every 5 min
    setInterval(async () => {
      this._updateNotifBadge();
    }, 5 * 60 * 1000);
  }

  _setupEventBusListeners() {
    if (!window.Events) return;
    const refresh = () => {
      // If currently on dashboard, refresh it
      const hash = window.location.hash;
      if (hash === '#/dashboard' || hash === '' || !hash) {
        const mod = this.modules.dashboard;
        if (mod?.loadKPIs) mod.loadKPIs();
      }
      this._updateNotifBadge();
    };
    const events = ['ORDER_CREATED', 'ORDER_UPDATED', 'PAYMENT_RECEIVED', 'CUSTOMER_CREATED', 'INVENTORY_UPDATED', 'EXPENSE_ADDED'];
    events.forEach(e => window.Events.on(e, refresh));
  }

  _comingSoon(key) {
    const labels = { dashboard: 'Dashboard', customers: 'Customers', orders: 'Orders', quotations: 'Quotations', invoices: 'Invoices', inventory: 'Inventory', payments: 'Payments', expenses: 'Expenses', reports: 'Reports', production: 'Production', delivery: 'Delivery', users: 'Users', settings: 'Settings', 'ai-assistant': 'AI Assistant', help: 'Help', backup: 'Backup' };
    return `
      <div class="empty-state" style="padding:80px 40px;text-align:center;">
        <i data-lucide="construction" style="width:64px;height:64px;color:#C41230;margin-bottom:24px;"></i>
        <h2 style="font-size:24px;font-weight:700;margin-bottom:12px;">${labels[key] || key}</h2>
        <p style="color:#6B7280;max-width:400px;margin:0 auto;">This module is loading. Please ensure all JS files are properly loaded.</p>
      </div>`;
  }

  _errorPage(key, err) {
    return `
      <div class="empty-state" style="padding:80px 40px;text-align:center;">
        <i data-lucide="alert-triangle" style="width:64px;height:64px;color:#EF4444;margin-bottom:24px;"></i>
        <h2 style="font-size:24px;font-weight:700;color:#EF4444;margin-bottom:12px;">Error Loading ${key}</h2>
        <p style="color:#6B7280;max-width:400px;margin:0 auto;">${err.message || 'An unexpected error occurred.'}</p>
        <button onclick="window.location.hash='#/dashboard'" style="margin-top:24px;padding:10px 24px;background:#C41230;color:#fff;border:none;border-radius:8px;cursor:pointer;">Go to Dashboard</button>
      </div>`;
  }
}

// Global confirm dialog helper
window.showConfirm = function(title, message, onConfirm, type = 'danger') {
  const overlay = document.getElementById('confirmOverlay');
  const titleEl = document.getElementById('confirmTitle');
  const msgEl   = document.getElementById('confirmMessage');
  const okBtn   = document.getElementById('confirmOk');
  const iconEl  = document.getElementById('confirmIcon');

  if (!overlay) { if (confirm(`${title}\n\n${message}`)) onConfirm(); return; }

  titleEl.textContent = title;
  msgEl.textContent   = message;
  okBtn.className = `btn btn-${type}`;
  iconEl.innerHTML = type === 'danger'
    ? '<i data-lucide="alert-triangle" style="width:40px;height:40px;color:#EF4444;"></i>'
    : '<i data-lucide="info" style="width:40px;height:40px;color:#3B82F6;"></i>';

  window._confirmCallback = onConfirm;
  overlay.style.display = 'flex';
  if (window.lucide) window.lucide.createIcons();
};

// Global toast helper
window.showToast = function(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const colors = { success: '#10B981', error: '#EF4444', warning: '#F59E0B', info: '#3B82F6' };
  const icons  = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info' };

  const toast = document.createElement('div');
  toast.className = 'toast toast--show';
  toast.style.cssText = `
    display:flex;align-items:center;gap:12px;
    background:${colors[type] || colors.success};
    color:#fff;padding:14px 20px;border-radius:10px;
    box-shadow:0 8px 24px rgba(0,0,0,.15);
    font-size:14px;font-weight:500;
    animation: slideInRight 0.3s ease;
  `;
  toast.innerHTML = `<i data-lucide="${icons[type] || 'check-circle'}" style="width:18px;height:18px;flex-shrink:0;"></i><span>${message}</span>`;
  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(120%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// Initialize app
window.AlugradeApp = AlugradeApp;
window.app = new AlugradeApp();



