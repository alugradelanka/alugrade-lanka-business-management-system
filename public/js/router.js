class Router {
    constructor() {
        this.routes = [];
        this.currentRoute = null;
        this.beforeNavigateCallback = null;
        this.afterNavigateCallback = null;
        this.notFoundHandler = () => {
            const container = document.getElementById('pageContent') || document.getElementById('mainContent');
            if (container) {
                container.innerHTML = `
                    <div class="error-page" style="padding:40px;text-align:center;">
                        <h1>404</h1>
                        <h2>Page Not Found</h2>
                        <p>The requested page could not be found.</p>
                        <button class="btn btn-primary" onclick="window.app.router.navigate('#/dashboard')">Go to Dashboard</button>
                    </div>
                `;
            }
        };

        window.addEventListener('hashchange', () => this.handleRoute());
    }

    register(path, handler, permissions = []) {
        this.routes.push({
            path: path,
            regex: this._pathToRegex(path),
            handler: handler,
            permissions: permissions
        });
    }

    _pathToRegex(path) {
        return new RegExp('^' + path.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');
    }

    navigate(path, params = {}) {
        if (params && Object.keys(params).length > 0) {
            const queryParams = new URLSearchParams(params).toString();
            window.location.hash = `${path}?${queryParams}`;
        } else {
            window.location.hash = path;
        }
    }

    getCurrentRoute() {
        const hash = window.location.hash;
        return (!hash || hash === '#' || hash === '#/') ? '#/dashboard' : hash;
    }

    goBack() {
        window.history.back();
    }

    onBeforeNavigate(callback) {
        this.beforeNavigateCallback = callback;
    }

    onAfterNavigate(callback) {
        this.afterNavigateCallback = callback;
    }

    async handleRoute() {
        let hash = window.location.hash;
        if (!hash || hash === '#' || hash === '#/') {
            hash = '#/dashboard';
        }
        const [path, queryString] = hash.split('?');
        const queryParams = new URLSearchParams(queryString || '');
        
        let match = null;
        let routeParams = {};

        for (const route of this.routes) {
            const result = path.match(route.regex);
            if (result) {
                match = route;
                const paramNames = (route.path.match(/:[^\s/]+/g) || []).map(p => p.slice(1));
                paramNames.forEach((name, i) => {
                    routeParams[name] = result[i + 1];
                });
                break;
            }
        }

        if (this.beforeNavigateCallback) {
            const canNavigate = await this.beforeNavigateCallback(match ? match.path : path);
            if (!canNavigate) return;
        }

        if (match) {
            try {
                this.currentRoute = match.path;
                this._updateTitleAndBreadcrumb(match.path);
                this._highlightActiveNav(match.path);
                await match.handler(routeParams, queryParams);
            } catch (error) {
                console.error("Route handler error:", error);
                this._showError(error.message);
            }
        } else {
            this.notFoundHandler();
        }

        if (this.afterNavigateCallback) {
            this.afterNavigateCallback(match ? match.path : path);
        }
    }

    _updateTitleAndBreadcrumb(path) {
        const titleMap = {
            '#/dashboard': 'Dashboard',
            '#/customers': 'Customers',
            '#/customers/new': 'New Customer',
            '#/customers/:id': 'Customer Details',
            '#/customers/:id/edit': 'Edit Customer',
            '#/orders': 'Orders',
            '#/orders/new': 'New Order',
            '#/orders/:id': 'Order Details',
            '#/quotations': 'Quotations',
            '#/quotations/new': 'New Quotation',
            '#/quotations/:id': 'Quotation Details',
            '#/invoices': 'Invoices',
            '#/invoices/:id': 'Invoice Details',
            '#/inventory': 'Inventory',
            '#/payments': 'Payments',
            '#/expenses': 'Expenses',
            '#/reports': 'Reports',
            '#/production': 'Production',
            '#/delivery': 'Delivery',
            '#/users': 'Users',
            '#/settings': 'Settings',
            '#/help': 'Help Center',
            '#/backup': 'Backup & Restore',
            '#/audit-log': 'Audit Log',
            '#/ai-assistant': 'AI Assistant',
            '#/notifications': 'Notifications'
        };

        const title = titleMap[path] || 'App';
        document.title = `${title} | ALUGRADE BMS`;

        const breadcrumbContainer = document.getElementById('breadcrumb');
        if (breadcrumbContainer) {
            const paths = path.replace('#/', '').split('/');
            let html = '<ol class="breadcrumb-list">';
            let currentPath = '#';
            
            html += `<li class="breadcrumb-item"><a href="#/dashboard">Home</a></li>`;
            
            paths.forEach((p, index) => {
                if (p === '') return;
                currentPath += '/' + p;
                const isLast = index === paths.length - 1;
                const display = p.charAt(0).toUpperCase() + p.slice(1);
                
                if (isLast) {
                    html += `<li class="breadcrumb-item active" aria-current="page">${display}</li>`;
                } else {
                    html += `<li class="breadcrumb-item"><a href="${currentPath}">${display}</a></li>`;
                }
            });
            html += '</ol>';
            breadcrumbContainer.innerHTML = html;
        }
    }

    _highlightActiveNav(path) {
        document.querySelectorAll('.sidebar-nav-item').forEach(el => {
            el.classList.remove('active');
        });
        
        const baseRoute = path.split('/')[1];
        if (baseRoute) {
            const activeEl = document.querySelector(`.sidebar-nav-item[href="#/${baseRoute}"]`);
            if (activeEl) {
                activeEl.classList.add('active');
            }
        } else {
            const dashboardEl = document.querySelector(`.sidebar-nav-item[href="#/dashboard"]`);
            if (dashboardEl) {
                dashboardEl.classList.add('active');
            }
        }
    }

    _showError(message) {
        const content = document.getElementById('main-content');
        if (content) {
            content.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Error Loading Page</h4>
                    <p>${message}</p>
                    <hr>
                    <p class="mb-0"><button class="btn btn-primary" onclick="window.location.reload()">Retry</button></p>
                </div>
            `;
        }
    }
}

window.Router = Router;
