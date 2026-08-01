class HelpModule {
    constructor() {
        this.container = null;
    }

    render() {
        this.container = document.createElement('div');
        this.container.className = 'help-module';
        this.container.innerHTML = `
            <div class="help-header" style="padding: 20px; background: #007bff; color: white; border-radius: 8px; margin-bottom: 20px;">
                <h2>Help Center</h2>
                <input type="text" placeholder="Search for help..." class="form-control" style="max-width: 400px; margin-top: 10px;">
            </div>
            
            <div class="help-tabs mb-4">
                <button class="btn btn-outline-primary" onclick="window.helpModule.showSection('categories')">Categories</button>
                <button class="btn btn-outline-primary" onclick="window.helpModule.showSection('guide')">User Guide</button>
                <button class="btn btn-outline-primary" onclick="window.helpModule.showSection('faq')">FAQ</button>
                <button class="btn btn-outline-primary" onclick="window.helpModule.showSection('about')">About</button>
                <button class="btn btn-outline-primary" onclick="window.helpModule.showSection('release-notes')">Release Notes</button>
            </div>
            
            <div id="help-content-area">
                ${this.renderCategories()}
            </div>
        `;
        // Setup global reference for onclick handlers
        window.helpModule = this;
        return this.container;
    }

    showSection(section) {
        const area = document.getElementById('help-content-area');
        if (!area) return;
        
        if (section === 'categories') area.innerHTML = this.renderCategories();
        if (section === 'guide') area.innerHTML = this.renderUserGuide();
        if (section === 'faq') area.innerHTML = this.renderFAQ();
        if (section === 'about') area.innerHTML = this.renderAbout();
        if (section === 'release-notes') area.innerHTML = this.renderReleaseNotes();
    }

    renderCategories() {
        const cats = [
            'Getting Started', 'Customers', 'Orders', 'Quotations', 'Invoices', 
            'Inventory', 'Payments', 'Reports', 'Settings', 'Troubleshooting'
        ];
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                ${cats.map(c => `
                    <div class="card p-3 text-center" style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <h5>${c}</h5>
                        <small class="text-muted">Learn more about ${c.toLowerCase()}</small>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderUserGuide() {
        return `
            <div class="user-guide">
                <h3>Comprehensive User Guide</h3>
                
                <h4>1. Getting Started</h4>
                <p>Welcome to ALUGRADE BMS. Start by setting up your company profile in the Settings menu. Ensure your tax rates and document prefixes are configured correctly.</p>
                <div style="background:#eee; height:100px; display:flex; align-items:center; justify-content:center; margin-bottom:15px;">[Screenshot: Settings Dashboard]</div>
                
                <h4>2. Managing Customers</h4>
                <p>Navigate to the Customers tab to add new clients. You can assign default discounts and view their transaction history.</p>
                
                <h4>3. Creating an Order</h4>
                <p>Go to Orders > New Order. Select a customer, add products from inventory or create custom fabrications. Save to generate an order number.</p>
                
                <h4>4. Inventory & Stock</h4>
                <p>Keep track of aluminum profiles, glass, and accessories. Set minimum stock alerts in System Settings to get notified when supplies are low.</p>
                
                <h4>Tips & Best Practices</h4>
                <ul>
                    <li>Always backup your data weekly.</li>
                    <li>Use the AI Assistant to quickly find outstanding payments.</li>
                    <li>Review the Monthly Report to gauge business health.</li>
                </ul>
            </div>
        `;
    }

    renderFAQ() {
        const faqs = [
            { q: "How to create an order?", a: "Go to the Orders section and click 'New Order'. Fill in customer details and items." },
            { q: "How to generate an invoice?", a: "From a completed order, click 'Generate Invoice' to convert it automatically." },
            { q: "How to record a payment?", a: "Go to Payments, click 'Add Payment', select the corresponding invoice, and enter the amount." },
            { q: "How to add inventory?", a: "In the Inventory module, click 'Add Item'. Fill in details including SKU, quantity, and cost." },
            { q: "How to create a quotation?", a: "Navigate to Quotations, select a customer, add items, and save. You can print it or email it directly." },
            { q: "How to export to PDF/Excel?", a: "In any list view (Orders, Invoices, etc.), use the 'Export' dropdown in the top right corner." },
            { q: "How to manage users?", a: "Go to Settings > Employees. Here you can add users and set their roles/permissions." },
            { q: "How to backup data?", a: "Go to the Backup module and click 'Manual Backup'. A JSON file will be downloaded." },
            { q: "What is the AI Assistant?", a: "A built-in helper that understands natural language. Ask it for 'pending orders' or 'monthly sales'." },
            { q: "Can I use multiple currencies?", a: "Currently, the system supports a single base currency configured in Settings." },
            { q: "How to set up tax?", a: "Go to Settings > Documents, enable tax, and set the default percentage." },
            { q: "Can I customize the invoice prefix?", a: "Yes, under Settings > Documents." },
            { q: "How do I change the theme?", a: "Go to Settings > System and select Light or Dark theme." },
            { q: "Are deleted items recoverable?", a: "No, deletion is permanent. We recommend disabling/archiving items instead." },
            { q: "How do I track employee performance?", a: "Use the Reports module and filter by Employee/Installer." },
            { q: "How are low stock alerts triggered?", a: "When an item's quantity falls below its configured minimum threshold." },
            { q: "Can I upload my company logo?", a: "Yes, in Settings > Company Info." },
            { q: "Is the app accessible offline?", a: "Yes, it uses local storage (IndexedDB) and works completely offline." },
            { q: "How to update the software?", a: "Since it's a PWA/local tool, clearing cache or pulling the latest files will update it." },
            { q: "Who do I contact for support?", a: "Contact your system administrator or refer to the About page for developer info." }
        ];

        return `
            <div class="faq-section">
                <h3>Frequently Asked Questions</h3>
                <div class="accordion" id="faqAccordion" style="margin-top:20px;">
                    ${faqs.map((f, i) => `
                        <div class="card mb-2">
                            <div class="card-header" style="cursor:pointer; background:#f8f9fa;" onclick="const el = document.getElementById('collapse${i}'); el.style.display = el.style.display === 'none' ? 'block' : 'none';">
                                <strong>${f.q}</strong>
                            </div>
                            <div id="collapse${i}" style="display:none; padding:15px; border-top:1px solid #ddd;">
                                ${f.a}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderAbout() {
        return `
            <div class="about-section text-center" style="padding: 40px; background: #f9f9f9; border-radius: 8px;">
                <img src="" alt="ALUGRADE Logo" style="height: 80px; margin-bottom: 20px; display:none;" id="about-logo">
                <h2>ALUGRADE LANKA FAB & GLASS</h2>
                <h4 class="text-muted">Business Management System</h4>
                <hr>
                <div style="text-align: left; max-width: 500px; margin: 0 auto;">
                    <p><strong>Software:</strong> ALUGRADE BMS</p>
                    <p><strong>Version:</strong> 1.0.0</p>
                    <p><strong>Build Date:</strong> 2026</p>
                    <h5>Features:</h5>
                    <ul>
                        <li>Customer & Order Management</li>
                        <li>Inventory & Stock Control</li>
                        <li>Invoicing & Quotations</li>
                        <li>Advanced Reporting & AI Assistant</li>
                        <li>Offline Capability</li>
                    </ul>
                    <hr>
                    <h5>Contact Information</h5>
                    <p>For technical support, contact the IT department or system vendor.</p>
                </div>
            </div>
        `;
    }

    renderReleaseNotes() {
        return `
            <div class="release-notes">
                <h3>Release Notes & Changelog</h3>
                <div class="timeline" style="border-left: 2px solid #007bff; padding-left: 20px; margin-top: 20px;">
                    <div style="margin-bottom: 20px; position: relative;">
                        <span style="position: absolute; left: -26px; top: 0; width: 10px; height: 10px; background: #007bff; border-radius: 50%;"></span>
                        <h4>Version 1.0.0 (Initial Release - 2026)</h4>
                        <ul>
                            <li>Core modules implemented: Orders, Customers, Inventory.</li>
                            <li>Integrated IndexedDB local storage for offline use.</li>
                            <li>AI Assistant NLP integration.</li>
                            <li>PDF and Excel Export capabilities.</li>
                            <li>Comprehensive Settings and Backup modules.</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
}

window.HelpModule = HelpModule;
window.helpModule = new HelpModule();


