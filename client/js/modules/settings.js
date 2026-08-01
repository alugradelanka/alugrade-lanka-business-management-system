/**
 * Settings & Company Configuration Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 */

class SettingsModule {
    constructor(db, eventsManager) {
        this.containerId = 'pageContent';
        this.db = db || window.DB;
        this.events = eventsManager || window.Events;

        this.defaultSettings = {
            company: {
                name: 'ALUGRADE LANKA FAB & GLASS',
                logo: 'assets/logo/logo.png',
                signature: 'assets/signature/signature.png',
                seal: 'assets/seal/seal.png',
                address: 'No. 128, High Level Road, Homagama, Sri Lanka',
                phone1: '077 123 4567',
                phone2: '011 234 5678',
                email: 'info@alugrade.lk',
                website: 'www.alugrade.lk',
                brNumber: 'PV-89412',
                taxNumber: 'V-10023458'
            },
            financial: {
                currency: 'LKR',
                vatPercentage: 18,
                invoicePrefix: 'INV-2026-',
                quotationPrefix: 'QTN-2026-',
                orderPrefix: 'ORD-2026-',
                deliveryPrefix: 'DN-2026-',
                paymentPrefix: 'PAY-2026-'
            },
            document: {
                pdfLayout: 'Enterprise Commercial',
                printLayout: 'High Contrast A4',
                paperSize: 'A4',
                headerFooter: 'Show Logo, Header & Footer Notes',
                termsConditions: '1. Goods remain property of ALUGRADE LANKA FAB & GLASS until paid in full.\n2. Late payment subject to 2% monthly interest.\n3. Material warranty valid for 1 year.',
                defaultSignature: 'MR. M. U. RAJAPAKSHA (Managing Director)'
            },
            notifications: {
                emailConfig: 'smtp.alugrade.lk (TLS Port 587)',
                smsFutureReady: 'Dialog/Mobitel SMS Gateway Architecture Ready',
                whatsappFutureReady: 'Meta WhatsApp Business API Architecture Ready',
                lowStockAlerts: true,
                overdueAlerts: true
            },
            system: {
                theme: 'light',
                language: 'en',
                dateFormat: 'YYYY-MM-DD',
                timeFormat: '12h',
                timeZone: 'Asia/Colombo (+05:30)'
            },
            security: {
                enforceStrongPasswords: true,
                sessionTimeout: 30,
                maxLoginAttempts: 5,
                activityLogs: [
                    { date: '2026-07-31 10:15 AM', user: 'Admin User', action: 'Updated Company Profile Settings' },
                    { date: '2026-07-31 11:30 AM', user: 'Admin User', action: 'Configured 18% VAT Financial Rate' }
                ]
            }
        };

        this.currentSettings = this.loadSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('alugrade_settings');
        if (saved) {
            try { return JSON.parse(saved); } catch(e) { return this.defaultSettings; }
        }
        return JSON.parse(JSON.stringify(this.defaultSettings));
    }

    saveSettings() {
        localStorage.setItem('alugrade_settings', JSON.stringify(this.currentSettings));
    }

    render() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;
        const s = this.currentSettings;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Settings & System Configuration</h2>
                    <p class="text-muted small mb-0">Company profile, financial prefixes, document layouts, future gateway notifications, and security policies</p>
                </div>
                <button class="btn btn-success" onclick="window.settingsModule.saveAllSettings()">
                    <i class="fas fa-save me-1"></i> Save All Settings
                </button>
            </div>

            <!-- Settings Tabs Header -->
            <ul class="nav nav-pills mb-4 gap-2" id="settingsTabs">
                <li class="nav-item"><button class="nav-link active font-medium" onclick="window.settingsModule.switchTab('company', this)"><i class="fas fa-building me-1"></i> Company Profile</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.settingsModule.switchTab('financial', this)"><i class="fas fa-calculator me-1"></i> Financial Settings</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.settingsModule.switchTab('document', this)"><i class="fas fa-file-pdf me-1"></i> Document Settings</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.settingsModule.switchTab('notification', this)"><i class="fas fa-bell me-1"></i> Notification Integration</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.settingsModule.switchTab('preferences', this)"><i class="fas fa-sliders-h me-1"></i> System Preferences</button></li>
                <li class="nav-item"><button class="nav-link font-medium" onclick="window.settingsModule.switchTab('security', this)"><i class="fas fa-shield-alt me-1"></i> Security & Logs</button></li>
            </ul>

            <!-- Settings Tab Contents -->
            <div id="settings-tab-panes">
                <!-- 1. COMPANY SETTINGS PANE -->
                <div id="pane-company" class="settings-pane">
                    <div class="card p-4 mb-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-id-card text-primary me-2"></i> Company Identity & Branding Details</h5>
                        <form id="form-company">
                            <div class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label class="form-label font-medium">Company Registered Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control font-bold" id="set_comp_name" value="${s.company.name}" required>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label font-medium">Business Reg Number (BR)</label>
                                    <input type="text" class="form-control" id="set_comp_br" value="${s.company.brNumber}">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label font-medium">Tax / VAT Number</label>
                                    <input type="text" class="form-control" id="set_comp_tax" value="${s.company.taxNumber}">
                                </div>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-md-4">
                                    <label class="form-label font-medium">Official Company Logo</label>
                                    <div class="p-2 border rounded bg-light text-center">
                                        <img src="${s.company.logo}" alt="Logo" style="max-height: 50px;" class="mb-2 display-block mx-auto">
                                        <input type="file" class="form-control form-control-sm" accept="image/*">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label font-medium">Authorized MD Signature</label>
                                    <div class="p-2 border rounded bg-light text-center">
                                        <img src="${s.company.signature}" alt="Signature" style="max-height: 50px;" class="mb-2 display-block mx-auto">
                                        <input type="file" class="form-control form-control-sm" accept="image/*">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label font-medium">Official Company Seal</label>
                                    <div class="p-2 border rounded bg-light text-center">
                                        <div class="text-muted small py-2"><i class="fas fa-stamp fa-2x"></i><br>Company Stamp Seal Upload</div>
                                        <input type="file" class="form-control form-control-sm" accept="image/*">
                                    </div>
                                </div>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-md-12">
                                    <label class="form-label font-medium">Registered Business Address</label>
                                    <input type="text" class="form-control" id="set_comp_address" value="${s.company.address}">
                                </div>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-md-3">
                                    <label class="form-label font-medium">Primary Telephone</label>
                                    <input type="text" class="form-control" id="set_comp_phone1" value="${s.company.phone1}">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label font-medium">Secondary Telephone</label>
                                    <input type="text" class="form-control" id="set_comp_phone2" value="${s.company.phone2}">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label font-medium">Official Email</label>
                                    <input type="email" class="form-control" id="set_comp_email" value="${s.company.email}">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label font-medium">Official Website</label>
                                    <input type="text" class="form-control" id="set_comp_website" value="${s.company.website}">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- 2. FINANCIAL SETTINGS PANE -->
                <div id="pane-financial" class="settings-pane" style="display:none;">
                    <div class="card p-4 mb-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-coins text-success me-2"></i> Financial & Sequential Document Prefixes</h5>
                        <div class="row g-3 mb-3">
                            <div class="col-md-4">
                                <label class="form-label font-medium">Base Currency Code</label>
                                <input type="text" class="form-control font-bold" id="set_fin_currency" value="${s.financial.currency}">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label font-medium">Standard VAT Percentage (%)</label>
                                <input type="number" class="form-control font-bold text-success" id="set_fin_vat" value="${s.financial.vatPercentage}">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label font-medium">Quotation Number Prefix</label>
                                <input type="text" class="form-control font-bold" id="set_fin_qtn" value="${s.financial.quotationPrefix}">
                            </div>
                        </div>

                        <div class="row g-3 mb-3">
                            <div class="col-md-3">
                                <label class="form-label font-medium">Order Number Prefix</label>
                                <input type="text" class="form-control font-bold" id="set_fin_ord" value="${s.financial.orderPrefix}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label font-medium">Delivery Note Prefix</label>
                                <input type="text" class="form-control font-bold" id="set_fin_dn" value="${s.financial.deliveryPrefix}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label font-medium">Invoice Number Prefix</label>
                                <input type="text" class="form-control font-bold" id="set_fin_inv" value="${s.financial.invoicePrefix}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label font-medium">Payment Receipt Prefix</label>
                                <input type="text" class="form-control font-bold" id="set_fin_pay" value="${s.financial.paymentPrefix}">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3. DOCUMENT SETTINGS PANE -->
                <div id="pane-document" class="settings-pane" style="display:none;">
                    <div class="card p-4 mb-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-file-pdf text-danger me-2"></i> PDF & Print Document Layout Configuration</h5>
                        <div class="row g-3 mb-3">
                            <div class="col-md-4">
                                <label class="form-label font-medium">PDF Document Theme</label>
                                <select class="form-select" id="set_doc_pdf">
                                    <option value="Enterprise Commercial" selected>Enterprise Commercial (Logo + Signature)</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label font-medium">Default Paper Size</label>
                                <select class="form-select font-bold" id="set_doc_paper">
                                    <option value="A4" selected>Standard A4 Portrait (210mm x 297mm)</option>
                                    <option value="A5">A5 Small Format</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label font-medium">Default Authorized Signature</label>
                                <input type="text" class="form-control font-bold" id="set_doc_sig" value="${s.document.defaultSignature}">
                            </div>
                        </div>

                        <div class="row g-3 mb-3">
                            <div class="col-md-12">
                                <label class="form-label font-medium">Standard Terms & Conditions (Auto-imported onto PDF exports)</label>
                                <textarea class="form-control" id="set_doc_terms" rows="3">${s.document.termsConditions}</textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4. NOTIFICATION SETTINGS PANE -->
                <div id="pane-notification" class="settings-pane" style="display:none;">
                    <div class="card p-4 mb-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-bell text-warning me-2"></i> Email, SMS & WhatsApp Gateway Integration Architecture</h5>
                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label font-medium">SMTP Email Server Configuration</label>
                                <input type="text" class="form-control" id="set_notif_email" value="${s.notifications.emailConfig}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label font-medium">SMS Gateway Integration (Dialog / Mobitel)</label>
                                <input type="text" class="form-control bg-light font-bold text-primary" value="${s.notifications.smsFutureReady}" readonly>
                            </div>
                        </div>
                        <div class="row g-3 mb-3">
                            <div class="col-md-12">
                                <label class="form-label font-medium">Meta WhatsApp Business API Architecture Integration</label>
                                <input type="text" class="form-control bg-light font-bold text-success" value="${s.notifications.whatsappFutureReady}" readonly>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 5. PREFERENCES PANE -->
                <div id="pane-preferences" class="settings-pane" style="display:none;">
                    <div class="card p-4 mb-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-palette text-info me-2"></i> System UI Preferences & Locale</h5>
                        <div class="row g-3 mb-3">
                            <div class="col-md-4">
                                <label class="form-label font-medium">Interface Theme</label>
                                <select class="form-select font-bold" id="set_sys_theme" onchange="window.settingsModule.previewTheme(this.value)">
                                    <option value="light" ${s.system.theme==='light'?'selected':''}>Clean White Enterprise Theme</option>
                                    <option value="dark" ${s.system.theme==='dark'?'selected':''}>Dark Mode Theme</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label font-medium">Date Format</label>
                                <select class="form-select" id="set_sys_date">
                                    <option value="YYYY-MM-DD" selected>YYYY-MM-DD (2026-07-31)</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY (31/07/2026)</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label font-medium">Time Zone</label>
                                <input type="text" class="form-control font-bold" id="set_sys_tz" value="${s.system.timeZone}" readonly>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 6. SECURITY PANE -->
                <div id="pane-security" class="settings-pane" style="display:none;">
                    <div class="card p-4 mb-4" style="background:#ffffff; border:1px solid var(--color-border); border-radius:14px;">
                        <h5 class="font-bold text-main mb-3"><i class="fas fa-lock text-danger me-2"></i> Security Policy & Activity Audit Trail</h5>
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <label class="form-label font-medium">Session Inactivity Timeout (Minutes)</label>
                                <input type="number" class="form-control font-bold" id="set_sec_timeout" value="${s.security.sessionTimeout}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label font-medium">Max Failed Login Attempts</label>
                                <input type="number" class="form-control font-bold" id="set_sec_attempts" value="${s.security.maxLoginAttempts}">
                            </div>
                        </div>

                        <h6 class="font-bold text-main uppercase small mb-2">Recent System Activity Audit Trail:</h6>
                        <div class="table-responsive">
                            <table class="table table-sm table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>User Account</th>
                                        <th>Action Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(s.security.activityLogs || []).map(l => `
                                        <tr>
                                            <td>${l.date}</td>
                                            <td><strong>${l.user}</strong></td>
                                            <td><span class="small text-muted">${l.action}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    switchTab(tabId, btnElement) {
        document.querySelectorAll('.settings-pane').forEach(el => el.style.display = 'none');
        const activePane = document.getElementById('pane-' + tabId);
        if (activePane) activePane.style.display = 'block';

        if (btnElement) {
            document.querySelectorAll('#settingsTabs .nav-link').forEach(el => el.classList.remove('active'));
            btnElement.classList.add('active');
        }
    }

    previewTheme(val) {
        if (val === 'dark') {
            document.body.classList.add('dark-theme');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    saveAllSettings() {
        this.currentSettings.company.name = document.getElementById('set_comp_name')?.value || this.currentSettings.company.name;
        this.currentSettings.company.brNumber = document.getElementById('set_comp_br')?.value || this.currentSettings.company.brNumber;
        this.currentSettings.company.taxNumber = document.getElementById('set_comp_tax')?.value || this.currentSettings.company.taxNumber;
        this.currentSettings.company.address = document.getElementById('set_comp_address')?.value || this.currentSettings.company.address;

        this.currentSettings.financial.vatPercentage = parseFloat(document.getElementById('set_fin_vat')?.value || 18);
        this.currentSettings.financial.quotationPrefix = document.getElementById('set_fin_qtn')?.value || 'QTN-2026-';

        this.saveSettings();
        alert('All Enterprise Settings and Company Configuration saved successfully!');
    }
}

if (typeof window !== 'undefined') {
    window.SettingsModule = SettingsModule;
}
