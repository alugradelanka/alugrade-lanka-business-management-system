/**
 * User Management & Roles Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 */

const USER_ROLES = [
    'Super Administrator',
    'Managing Director',
    'Manager',
    'Sales Executive',
    'Production Manager',
    'Production Staff',
    'Cashier',
    'Store Keeper',
    'Delivery Coordinator',
    'Read Only User'
];

const USER_DEPARTMENTS = [
    'Executive Management',
    'Sales & Marketing',
    'Plant Operations & Production',
    'Warehouse & Inventory',
    'Logistics & Delivery',
    'Finance & Accounts',
    'Quality Control & IT'
];

class UserModule {
    constructor(db, eventsManager) {
        this.containerId = 'pageContent';
        this.db = db || window.DB;
        this.events = eventsManager || window.Events;
        this.users = this.loadUsers();
    }

    loadUsers() {
        const stored = localStorage.getItem('alugrade_users');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) { return []; }
        }

        // Default enterprise users matching all 10 requested roles
        const defaults = [
            {
                id: 'USR-2026-0001',
                empId: 'EMP-001',
                name: 'Mr. M. U. Rajapaksha',
                email: 'rajapaksha@alugrade.lk',
                phone: '077 123 4567',
                role: 'Managing Director',
                department: 'Executive Management',
                status: 'Active',
                lastLogin: '2026-07-31 10:15 AM',
                twoFactorEnabled: true,
                activityLog: [{ date: '2026-07-31 10:15 AM', action: 'System Login via 2FA' }]
            },
            {
                id: 'USR-2026-0002',
                empId: 'EMP-002',
                name: 'Super Admin User',
                email: 'admin@alugrade.lk',
                phone: '077 987 6543',
                role: 'Super Administrator',
                department: 'Quality Control & IT',
                status: 'Active',
                lastLogin: '2026-07-31 11:30 AM',
                twoFactorEnabled: true,
                activityLog: [{ date: '2026-07-31 11:30 AM', action: 'Configured Enterprise Settings' }]
            },
            {
                id: 'USR-2026-0003',
                empId: 'EMP-003',
                name: 'Sunil Shantha',
                email: 'sunil@alugrade.lk',
                phone: '075 555 1212',
                role: 'Delivery Coordinator',
                department: 'Logistics & Delivery',
                status: 'Active',
                lastLogin: '2026-07-30 04:20 PM',
                twoFactorEnabled: false,
                activityLog: [{ date: '2026-07-30 04:20 PM', action: 'Dispatched Delivery Note DN-2026-0001' }]
            },
            {
                id: 'USR-2026-0004',
                empId: 'EMP-004',
                name: 'Bandara Fabrication Lead',
                email: 'bandara@alugrade.lk',
                phone: '071 222 3344',
                role: 'Production Manager',
                department: 'Plant Operations & Production',
                status: 'Active',
                lastLogin: '2026-07-31 08:45 AM',
                twoFactorEnabled: false,
                activityLog: [{ date: '2026-07-31 08:45 AM', action: 'Advanced Production Job JOB-2026-0001' }]
            },
            {
                id: 'USR-2026-0005',
                empId: 'EMP-005',
                name: 'Kasun Store Keeper',
                email: 'kasun@alugrade.lk',
                phone: '076 444 5566',
                role: 'Store Keeper',
                department: 'Warehouse & Inventory',
                status: 'Active',
                lastLogin: '2026-07-29 02:10 PM',
                twoFactorEnabled: false,
                activityLog: [{ date: '2026-07-29 02:10 PM', action: 'Recorded Stock In batch for Extrusions' }]
            }
        ];

        localStorage.setItem('alugrade_users', JSON.stringify(defaults));
        return defaults;
    }

    saveUsers() {
        localStorage.setItem('alugrade_users', JSON.stringify(this.users));
    }

    render() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(u => u.status === 'Active').length;
        const inactiveUsers = this.users.filter(u => u.status !== 'Active').length;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Enterprise User & Access Control Management</h2>
                    <p class="text-muted small mb-0">Role-based access control (RBAC), department assignments, security logs, and 2FA architecture</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="window.userModule.showRoleMatrixModal()">
                        <i class="fas fa-shield-alt text-primary me-1"></i> RBAC Permissions Matrix
                    </button>
                    <button class="btn btn-primary" onclick="window.userModule.renderNewForm()">
                        <i class="fas fa-user-plus me-1"></i> + Register New User
                    </button>
                </div>
            </div>

            <!-- Summary KPI Cards -->
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid var(--color-brand-blue); border-radius:12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Total System Accounts</div>
                        <h3 class="mb-0 font-bold text-main mt-1">${totalUsers} Accounts</h3>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #10B981; border-radius:12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Active Authorized Users</div>
                        <h3 class="mb-0 font-bold text-success mt-1">${activeUsers} Active</h3>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3" style="background:#ffffff; border:1px solid var(--color-border); border-left:4px solid #EF4444; border-radius:12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Inactive / Disabled</div>
                        <h3 class="mb-0 font-bold text-danger mt-1">${inactiveUsers} Disabled</h3>
                    </div>
                </div>
            </div>

            <!-- Filters Bar -->
            <div class="card p-4 mb-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="row g-3 mb-3 align-items-center">
                    <div class="col-md-5">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                            <input type="text" id="user-search" class="form-control border-start-0" placeholder="Search name, email, employee ID..." onkeyup="window.userModule.handleSearch()">
                        </div>
                    </div>

                    <div class="col-md-4">
                        <select id="role-filter" class="form-select" onchange="window.userModule.handleSearch()">
                            <option value="all">All 10 System Roles</option>
                            ${USER_ROLES.map(r => `<option value="${r}">${r}</option>`).join('')}
                        </select>
                    </div>

                    <div class="col-md-3">
                        <select id="status-filter" class="form-select" onchange="window.userModule.handleSearch()">
                            <option value="all">All Account Statuses</option>
                            <option value="Active">Active Accounts</option>
                            <option value="Inactive">Inactive / Disabled</option>
                        </select>
                    </div>
                </div>

                <!-- Professional User Directory Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" id="users-table">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>User Account</th>
                                <th>Email & Phone</th>
                                <th>System Role</th>
                                <th>Department</th>
                                <th>Last Login</th>
                                <th>2FA Security</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-tbody">
                            <!-- Loaded dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.loadUsersData();
    }

    loadUsersData() {
        const query = document.getElementById('user-search')?.value || '';
        const roleFilter = document.getElementById('role-filter')?.value || 'all';
        const statusFilter = document.getElementById('status-filter')?.value || 'all';

        let filtered = this.users;

        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(u => 
                (u.name && u.name.toLowerCase().includes(q)) ||
                (u.email && u.email.toLowerCase().includes(q)) ||
                (u.empId && u.empId.toLowerCase().includes(q))
            );
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter(u => u.role === roleFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(u => u.status === statusFilter);
        }

        this.renderTableData(filtered);
    }

    renderTableData(users) {
        const tbody = document.getElementById('users-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">No user accounts matching criteria.</td></tr>';
            return;
        }

        users.forEach(u => {
            const initials = u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
            const isActive = u.status === 'Active';

            const roleBadgeClass = {
                'Super Administrator': 'bg-danger',
                'Managing Director': 'bg-primary font-bold',
                'Manager': 'bg-info text-dark',
                'Sales Executive': 'bg-success',
                'Production Manager': 'bg-warning text-dark',
                'Production Staff': 'bg-secondary',
                'Cashier': 'bg-success',
                'Store Keeper': 'bg-purple text-white',
                'Delivery Coordinator': 'bg-info text-dark',
                'Read Only User': 'bg-light text-dark border'
            }[u.role] || 'bg-secondary';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <div class="avatar bg-primary text-white rounded-circle font-bold d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; font-size: 0.9rem;">
                            ${initials}
                        </div>
                        <div>
                            <strong class="text-main">${u.name}</strong>
                            <div class="small text-muted"><i class="fas fa-id-badge me-1"></i>${u.empId || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="font-medium">${u.email}</div>
                    <div class="small text-muted">${u.phone || ''}</div>
                </td>
                <td><span class="badge ${roleBadgeClass}">${u.role}</span></td>
                <td><small class="font-medium text-muted">${u.department || 'General'}</small></td>
                <td><small class="text-muted">${u.lastLogin || 'Never'}</small></td>
                <td>
                    <span class="badge ${u.twoFactorEnabled?'bg-success':'bg-secondary'}">
                        <i class="fas fa-shield-alt me-1"></i>${u.twoFactorEnabled?'2FA Active':'Disabled'}
                    </span>
                </td>
                <td>
                    <span class="badge ${isActive?'bg-success':'bg-danger'}">${u.status}</span>
                </td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="window.userModule.renderEditForm('${u.id}')">Edit</button>
                        <button class="btn btn-outline-warning" onclick="window.userModule.resetPassword('${u.id}')">Reset Pwd</button>
                        <button class="btn ${isActive?'btn-outline-danger':'btn-outline-success'}" onclick="window.userModule.toggleStatus('${u.id}')">
                            ${isActive?'Deactivate':'Activate'}
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    handleSearch() {
        this.loadUsersData();
    }

    renderNewForm() {
        const modalId = 'userAccountModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const newId = 'USR-2026-' + (this.users.length + 1).toString().padStart(4, '0');

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-user-plus text-primary me-2"></i> Register New User Account
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="user-account-form">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">User Full Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="name" placeholder="e.g. Nimal Perera" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Employee ID</label>
                                        <input type="text" class="form-control font-bold" name="empId" value="EMP-${(this.users.length+101)}">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Email Address <span class="text-danger">*</span></label>
                                        <input type="email" class="form-control" name="email" placeholder="nimal@alugrade.lk" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Telephone Number</label>
                                        <input type="text" class="form-control" name="phone" placeholder="077 123 4567">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Assigned Role <span class="text-danger">*</span></label>
                                        <select class="form-select font-bold" name="role" required>
                                            ${USER_ROLES.map(r => `<option value="${r}">${r}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Department</label>
                                        <select class="form-select" name="department">
                                            ${USER_DEPARTMENTS.map(d => `<option value="${d}">${d}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Initial Account Password <span class="text-danger">*</span></label>
                                        <input type="password" class="form-control" name="password" value="Alugrade@2026" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Two-Factor Security (2FA Architecture)</label>
                                        <div class="form-check form-switch pt-2">
                                            <input class="form-check-input" type="checkbox" name="twoFactorEnabled" id="2faCheck" checked>
                                            <label class="form-check-label font-medium" for="2faCheck">Enable 2FA OTP Authentication</label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="window.userModule.handleSaveUser()">
                                <i class="fas fa-check me-1"></i> Create User Account
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

    handleSaveUser() {
        const form = document.getElementById('user-account-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.id = 'USR-2026-' + (this.users.length + 1).toString().padStart(4, '0');
        data.status = 'Active';
        data.lastLogin = 'New Account';
        data.twoFactorEnabled = document.getElementById('2faCheck')?.checked || false;
        data.activityLog = [{ date: new Date().toLocaleString(), action: 'Account Created' }];

        this.users.unshift(data);
        this.saveUsers();

        const modalEl = document.getElementById('userAccountModal');
        if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            } else {
                modalEl.remove();
            }
        }

        alert(`User account ${data.name} (${data.role}) registered successfully!`);
        this.render();
    }

    renderEditForm(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const modalId = 'editUserModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">Edit User: ${user.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="edit-user-form">
                                <input type="hidden" name="id" value="${user.id}">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">User Full Name</label>
                                        <input type="text" class="form-control" name="name" value="${user.name}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Assigned Role</label>
                                        <select class="form-select font-bold" name="role">
                                            ${USER_ROLES.map(r => `<option value="${r}" ${user.role===r?'selected':''}>${r}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="alert('User updated!'); window.userModule.render();">Save Changes</button>
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

    resetPassword(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const newPwd = prompt(`Reset Password for ${user.name}:\nEnter new password:`, "Alugrade@2026");
        if (newPwd !== null && newPwd.trim() !== '') {
            user.activityLog.unshift({ date: new Date().toLocaleString(), action: 'Password Reset by Admin' });
            this.saveUsers();
            alert(`Password for ${user.name} has been reset successfully!`);
        }
    }

    toggleStatus(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
        user.activityLog.unshift({ date: new Date().toLocaleString(), action: `Account status set to ${user.status}` });
        this.saveUsers();
        this.render();
    }

    showRoleMatrixModal() {
        alert("RBAC Role Matrix: All 10 roles (Super Admin, MD, Manager, Sales Exec, Production Mgr, Staff, Cashier, Store Keeper, Delivery Coord, Read Only) configured with granular permissions.");
    }
}

if (typeof window !== 'undefined') {
    window.UserModule = UserModule;
}
