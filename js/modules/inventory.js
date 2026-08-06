/**
 * Inventory Management Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 * Full Inventory Workflow: Goods Received (GRN) -> Stock Entry -> Material Allocation -> Production Consumption -> Stock Adjustment -> Low Stock Alert -> Stock Valuation
 */

class InventoryModule {
    constructor(containerId) {
        this.containerId = containerId || 'pageContent';
        this.db = window.DB || { inventory: [], transactions: [] };
        this.events = window.Events || { trigger: () => {}, emit: () => {} };

        // Standard Inventory Categories
        this.categories = [
            'Aluminium Profiles',
            'Glass',
            'Accessories',
            'Hardware',
            'Consumables'
        ];

        this.suppliers = [
            { name: 'Lanka Aluminium Industries PLC', contact: '011 243 5678', LeadTime: '3 Days' },
            { name: 'Alumex PLC Sri Lanka', contact: '011 269 8899', LeadTime: '2 Days' },
            { name: 'SwissTek Aluminium Ltd', contact: '011 214 7700', LeadTime: '2 Days' },
            { name: 'Lanka Safety Glass (Pvt) Ltd', contact: '011 289 1234', LeadTime: '5 Days' },
            { name: 'Hardware Masters Colombo', contact: '011 233 4455', LeadTime: '1 Day' }
        ];

        this.items = this.loadInventory();
        this.activeCategoryFilter = 'All';
    }

    loadInventory() {
        const stored = localStorage.getItem('alugrade_inventory');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) { return []; }
        }

        // Default enterprise inventory dataset
        const defaults = [
            {
                itemId: 'ALU-2026-0001',
                barcode: '8934120556101',
                itemName: '100mm Heavy Duty Aluminium Section (Matt Black)',
                category: 'Aluminium Profiles',
                brand: 'Alumex',
                supplier: 'Alumex PLC Sri Lanka',
                unit: 'Bars (6m)',
                currentStock: 42,
                minStock: 15,
                maxStock: 100,
                reorderLevel: 20,
                purchasePrice: 12500,
                sellingPrice: 16500,
                location: 'Rack A-12 (Main Warehouse)',
                notes: 'Heavy duty architectural extrusion for commercial sliding doors.',
                history: [
                    { date: '2026-07-25', type: 'Stock In', qtyChange: 50, balance: 50, user: 'Store Keeper', reference: 'GRN-2026-0045', notes: 'Initial shipment received from Alumex' },
                    { date: '2026-07-31', type: 'Production Consumption', qtyChange: -8, balance: 42, user: 'Production Engine', reference: 'JOB-2026-0001', notes: 'Deducted for Homagama Complex Job' }
                ]
            },
            {
                itemId: 'ALU-2026-0002',
                barcode: '8934120556102',
                itemName: '2-Track Sliding Window Frame (White Powder Coated)',
                category: 'Aluminium Profiles',
                brand: 'SwissTek',
                supplier: 'SwissTek Aluminium Ltd',
                unit: 'Bars (6m)',
                currentStock: 14,
                minStock: 15,
                maxStock: 80,
                reorderLevel: 20,
                purchasePrice: 10800,
                sellingPrice: 14200,
                location: 'Rack A-15 (Main Warehouse)',
                notes: 'SwissTek premium white finish extrusion bars.',
                history: [
                    { date: '2026-07-20', type: 'Stock In', qtyChange: 20, balance: 20, user: 'Store Keeper', reference: 'GRN-2026-0032', notes: 'Stock entry' },
                    { date: '2026-07-30', type: 'Production Consumption', qtyChange: -6, balance: 14, user: 'Production Engine', reference: 'JOB-2026-0002', notes: 'Issued for Kottawa Villa' }
                ]
            },
            {
                itemId: 'GLS-2026-0001',
                barcode: '8934120556103',
                itemName: '8mm Dark Grey Tinted Toughened Glass Sheet (8ft x 4ft)',
                category: 'Glass',
                brand: 'Asahi Safety Glass',
                supplier: 'Lanka Safety Glass (Pvt) Ltd',
                unit: 'Sheets',
                currentStock: 8,
                minStock: 10,
                maxStock: 50,
                reorderLevel: 12,
                purchasePrice: 18500,
                sellingPrice: 24000,
                location: 'Glass Bay B-3',
                notes: 'Polished edges. Vertical rack storage.',
                history: [
                    { date: '2026-07-28', type: 'Stock In', qtyChange: 12, balance: 12, user: 'Store Keeper', reference: 'GRN-2026-0049', notes: 'Tempered glass crate' },
                    { date: '2026-07-31', type: 'Production Consumption', qtyChange: -4, balance: 8, user: 'Production Engine', reference: 'JOB-2026-0002', notes: 'Deducted for Kottawa Villa Job' }
                ]
            },
            {
                itemId: 'ACC-2026-0001',
                barcode: '8934120556104',
                itemName: 'EPDM Weather Seal Rubber Gasket (Black)',
                category: 'Accessories',
                brand: 'SealingTech LK',
                supplier: 'Lanka Rubber Components',
                unit: 'Meters',
                currentStock: 350,
                minStock: 100,
                maxStock: 1000,
                reorderLevel: 200,
                purchasePrice: 120,
                sellingPrice: 180,
                location: 'Shelf C-05',
                notes: 'UV resistant rubber gasket for window glass sealing.',
                history: [
                    { date: '2026-07-20', type: 'Stock In', qtyChange: 500, balance: 500, user: 'Store Keeper', reference: 'GRN-2026-0030', notes: 'Spool roll' },
                    { date: '2026-07-31', type: 'Production Consumption', qtyChange: -150, balance: 350, user: 'Production Engine', reference: 'JOB-2026-0001', notes: 'Issued to workshop' }
                ]
            },
            {
                itemId: 'HRD-2026-0001',
                barcode: '8934120556105',
                itemName: 'Stainless Steel Heavy Duty Mortise Lockset',
                category: 'Hardware',
                brand: 'Dorma Style',
                supplier: 'Hardware Masters Colombo',
                unit: 'Sets',
                currentStock: 4,
                minStock: 15,
                maxStock: 100,
                reorderLevel: 20,
                purchasePrice: 3800,
                sellingPrice: 5500,
                location: 'Bin H-02',
                notes: 'Multi-point security locksets for aluminium sliding doors.',
                history: [
                    { date: '2026-07-15', type: 'Stock In', qtyChange: 20, balance: 20, user: 'Store Keeper', reference: 'GRN-2026-0012', notes: 'Box of 20 sets' },
                    { date: '2026-07-30', type: 'Production Consumption', qtyChange: -16, balance: 4, user: 'Production Engine', reference: 'JOB-2026-0002', notes: 'Issued for Kottawa Villa' }
                ]
            },
            {
                itemId: 'CON-2026-0001',
                barcode: '8934120556106',
                itemName: 'Neutral Cure Silicone Sealant (Black - 300ml Tube)',
                category: 'Consumables',
                brand: 'DowSil',
                supplier: 'Chemical Supplies Lanka',
                unit: 'Tubes',
                currentStock: 65,
                minStock: 30,
                maxStock: 200,
                reorderLevel: 40,
                purchasePrice: 850,
                sellingPrice: 1250,
                location: 'Chemical Rack D-1',
                notes: 'Weatherproofing silicone sealant for exterior glass joints.',
                history: [
                    { date: '2026-07-22', type: 'Stock In', qtyChange: 100, balance: 100, user: 'Store Keeper', reference: 'GRN-2026-0038', notes: 'Crate of tubes' },
                    { date: '2026-07-31', type: 'Production Consumption', qtyChange: -35, balance: 65, user: 'Workshop Issue', reference: 'ISS-2026-009', notes: 'Site installation batch' }
                ]
            }
        ];

        localStorage.setItem('alugrade_inventory', JSON.stringify(defaults));
        return defaults;
    }

    saveInventory() {
        localStorage.setItem('alugrade_inventory', JSON.stringify(this.items));
    }

    generateItemId(category) {
        const prefixMap = {
            'Aluminium Profiles': 'ALU',
            'Glass': 'GLS',
            'Accessories': 'ACC',
            'Hardware': 'HRD',
            'Consumables': 'CON'
        };
        const prefix = prefixMap[category] || 'ITEM';
        const year = new Date().getFullYear();
        const categoryItems = this.items.filter(i => i.category === category);
        const count = categoryItems.length + 1;
        return `${prefix}-${year}-${count.toString().padStart(4, '0')}`;
    }

    render() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        const totalItems = this.items.length;
        const totalValuation = this.items.reduce((sum, item) => sum + (item.currentStock * item.purchasePrice), 0);
        const lowStockCount = this.items.filter(item => item.currentStock <= item.reorderLevel && item.currentStock > 0).length;
        const outOfStockCount = this.items.filter(item => item.currentStock <= 0).length;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Enterprise Inventory & Stock Valuation</h2>
                    <p class="text-muted small mb-0">Full Inventory Workflow: Goods Received (GRN) → Stock Entry → Material Allocation → Production Consumption → Stock Adjustment → Valuation</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="window.inventoryModule.showStockMovementModal()">
                        <i class="fas fa-exchange-alt text-primary me-1"></i> Goods Received / Adjustment
                    </button>
                    <button class="btn btn-primary" onclick="window.inventoryModule.renderNewForm()">
                        <i class="fas fa-plus-circle me-1"></i> + Register New SKU
                    </button>
                </div>
            </div>

            <!-- Summary KPI Cards -->
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid var(--color-brand-blue); border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Total Inventory SKUs</div>
                        <h3 class="mb-0 font-bold text-main mt-1" id="stat-total-skus">${totalItems} Items</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #10B981; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Total Stock Valuation</div>
                        <h3 class="mb-0 font-bold text-success mt-1" id="stat-total-val">LKR ${totalValuation.toLocaleString('en-US', {minimumFractionDigits:2})}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #F59E0B; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Low Stock Alerts</div>
                        <h3 class="mb-0 font-bold text-warning mt-1" id="stat-low-stock">${lowStockCount} SKUs</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #EF4444; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Out of Stock SKUs</div>
                        <h3 class="mb-0 font-bold text-danger mt-1" id="stat-out-stock">${outOfStockCount} SKUs</h3>
                    </div>
                </div>
            </div>

            <!-- Category Filter Tabs -->
            <ul class="nav nav-pills mb-4 gap-2" id="inventoryCategoryTabs">
                <li class="nav-item"><button class="nav-link active font-medium" onclick="window.inventoryModule.filterCategory('All', this)">All SKUs (${totalItems})</button></li>
                ${this.categories.map(c => `
                    <li class="nav-item">
                        <button class="nav-link font-medium" onclick="window.inventoryModule.filterCategory('${c}', this)">
                            ${c} (${this.items.filter(i=>i.category===c).length})
                        </button>
                    </li>
                `).join('')}
            </ul>

            <!-- Filter Controls Panel -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div class="row g-3 mb-3 align-items-center">
                    <div class="col-md-6">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                            <input type="text" id="inventory-search" class="form-control border-start-0" placeholder="Search item code, name, barcode, supplier, brand..." onkeyup="window.inventoryModule.handleSearch()">
                        </div>
                    </div>

                    <div class="col-md-3">
                        <select id="stock-filter" class="form-select" onchange="window.inventoryModule.handleSearch()">
                            <option value="all">All Stock Levels</option>
                            <option value="low">Low Stock / Reorder Alert</option>
                            <option value="out">Out of Stock</option>
                        </select>
                    </div>

                    <div class="col-md-3 text-end">
                        <div class="btn-group">
                            <button class="btn btn-outline-secondary btn-sm" onclick="window.inventoryModule.exportExcel()"><i class="fas fa-file-excel text-success me-1"></i> Export CSV</button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="window.inventoryModule.printInventoryList()"><i class="fas fa-print me-1"></i> Print Stock Sheet</button>
                        </div>
                    </div>
                </div>

                <!-- Professional Inventory Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" id="inventory-table">
                        <thead class="table-light small uppercase">
                            <tr>
                                <th>Item Code & Barcode</th>
                                <th>Item Description</th>
                                <th>Category & Brand</th>
                                <th>Location</th>
                                <th>Stock Qty</th>
                                <th>Reorder Level</th>
                                <th>Pur. Price (LKR)</th>
                                <th>Valuation (LKR)</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="inventory-tbody">
                            <!-- Loaded dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.loadInventoryData();
    }

    loadInventoryData() {
        const query = document.getElementById('inventory-search')?.value || '';
        const stockFilter = document.getElementById('stock-filter')?.value || 'all';

        let filtered = this.items;

        if (this.activeCategoryFilter && this.activeCategoryFilter !== 'All') {
            filtered = filtered.filter(i => i.category === this.activeCategoryFilter);
        }

        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(i => 
                (i.itemId && i.itemId.toLowerCase().includes(q)) ||
                (i.barcode && i.barcode.toLowerCase().includes(q)) ||
                (i.itemName && i.itemName.toLowerCase().includes(q)) ||
                (i.supplier && i.supplier.toLowerCase().includes(q)) ||
                (i.brand && i.brand.toLowerCase().includes(q))
            );
        }

        if (stockFilter === 'low') {
            filtered = filtered.filter(i => i.currentStock <= i.reorderLevel && i.currentStock > 0);
        } else if (stockFilter === 'out') {
            filtered = filtered.filter(i => i.currentStock <= 0);
        }

        this.renderTableData(filtered);
    }

    filterCategory(category, btnElement) {
        this.activeCategoryFilter = category;
        if (btnElement) {
            document.querySelectorAll('#inventoryCategoryTabs .nav-link').forEach(el => el.classList.remove('active'));
            btnElement.classList.add('active');
        }
        this.loadInventoryData();
    }

    renderTableData(items) {
        const tbody = document.getElementById('inventory-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center py-4 text-muted">No inventory items found matching criteria.</td></tr>';
            return;
        }

        items.forEach(i => {
            let statusBadge = 'bg-success';
            let statusText = 'In Stock';

            if (i.currentStock <= 0) {
                statusBadge = 'bg-danger';
                statusText = 'Out of Stock';
            } else if (i.currentStock <= i.reorderLevel) {
                statusBadge = 'bg-warning text-dark font-bold';
                statusText = 'Low Stock Alert';
            }

            const itemValuation = i.currentStock * (i.purchasePrice || 0);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <strong class="text-primary">${i.itemId}</strong>
                    <div class="small text-muted"><i class="fas fa-barcode me-1"></i>${i.barcode || 'N/A'}</div>
                </td>
                <td>
                    <div class="font-bold text-main">${i.itemName}</div>
                    <div class="small text-muted">Supplier: ${i.supplier || 'N/A'}</div>
                </td>
                <td>
                    <span class="badge bg-light text-dark border">${i.category}</span>
                    <div class="small text-muted">${i.brand || ''}</div>
                </td>
                <td><small class="font-medium"><i class="fas fa-warehouse me-1 text-muted"></i>${i.location || 'Warehouse'}</small></td>
                <td><strong class="fs-6">${i.currentStock}</strong> <small class="text-muted">${i.unit}</small></td>
                <td><small class="text-muted">Min: ${i.minStock || 5} | Reorder: ${i.reorderLevel}</small></td>
                <td>LKR ${(i.purchasePrice || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                <td><strong class="text-success">LKR ${itemValuation.toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                <td><span class="badge ${statusBadge}">${statusText}</span></td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="window.inventoryModule.renderDetail('${i.itemId}')">Detail</button>
                        <button class="btn btn-outline-success" onclick="window.inventoryModule.quickStockIn('${i.itemId}')">+ Stock</button>
                        <button class="btn btn-outline-danger" onclick="window.inventoryModule.deleteItem('${i.itemId}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    handleSearch() {
        this.loadInventoryData();
    }

    autoReduceStock(orderId, requiredMaterials = []) {
        console.log(`[Inventory Engine] Auto reducing stock for Order/Job ${orderId}`);
        const profileItem = this.items.find(i => i.category === 'Aluminium Profiles');
        if (profileItem && profileItem.currentStock >= 4) {
            profileItem.currentStock -= 4;
            profileItem.history.unshift({
                date: new Date().toISOString().split('T')[0],
                type: 'Production Consumption',
                qtyChange: -4,
                balance: profileItem.currentStock,
                user: 'Production Engine',
                reference: orderId,
                notes: `Auto reduced materials for Production Order ${orderId}`
            });
        }

        const glassItem = this.items.find(i => i.category === 'Glass');
        if (glassItem && glassItem.currentStock >= 2) {
            glassItem.currentStock -= 2;
            glassItem.history.unshift({
                date: new Date().toISOString().split('T')[0],
                type: 'Production Consumption',
                qtyChange: -2,
                balance: glassItem.currentStock,
                user: 'Production Engine',
                reference: orderId,
                notes: `Auto reduced glass sheets for Production Order ${orderId}`
            });
        }

        this.saveInventory();
        console.log(`[Inventory Engine] Stock successfully auto reduced for ${orderId}`);
    }

    quickStockIn(itemId) {
        const item = this.items.find(i => i.itemId === itemId);
        if (!item) return;

        const qtyStr = prompt(`Add Stock In for ${item.itemName}.\nCurrent Stock: ${item.currentStock} ${item.unit}\n\nEnter Quantity to Add:`, "10");
        if (qtyStr !== null) {
            const qty = parseInt(qtyStr);
            if (!isNaN(qty) && qty > 0) {
                item.currentStock += qty;
                item.history.unshift({
                    date: new Date().toISOString().split('T')[0],
                    type: 'Stock In',
                    qtyChange: qty,
                    balance: item.currentStock,
                    user: 'Store Keeper',
                    reference: 'Batch Stock In (GRN)',
                    notes: 'Manual stock entry'
                });

                this.saveInventory();
                alert(`Added +${qty} ${item.unit} to ${item.itemName}. New stock: ${item.currentStock}`);
                this.render();
            }
        }
    }

    showStockMovementModal() {
        const modalId = 'stockMovementModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-exchange-alt text-primary me-2"></i> Record Stock Movement / Adjustment (GRN)
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="stock-movement-form">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Select SKU Item <span class="text-danger">*</span></label>
                                        <select class="form-select font-bold" name="itemId" required>
                                            ${this.items.map(i => `<option value="${i.itemId}">${i.itemId} - ${i.itemName} (Stock: ${i.currentStock} ${i.unit})</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Movement Type <span class="text-danger">*</span></label>
                                        <select class="form-select font-bold text-primary" name="movementType" required>
                                            <option value="Stock In">Stock In (Goods Received / GRN)</option>
                                            <option value="Production Consumption">Production Consumption (Workshop Issue)</option>
                                            <option value="Stock Adjustment">Physical Stock Audit Adjustment</option>
                                            <option value="Damage Scrap">Damage / Scrap Write-off</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Quantity Change (+ or -) <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control font-bold fs-5" name="qtyChange" value="10" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">GRN / Reference Number</label>
                                        <input type="text" class="form-control" name="reference" value="GRN-2026-0055" placeholder="GRN-2026-XXXX">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Operator / User</label>
                                        <input type="text" class="form-control" name="user" value="Store Keeper">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Movement Notes & Reason</label>
                                        <textarea class="form-control" name="notes" rows="2" placeholder="e.g. Received batch shipment from supplier Alumex..."></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="window.inventoryModule.handleSaveStockMovement()">
                                <i class="fas fa-check me-1"></i> Apply Stock Movement
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

    handleSaveStockMovement() {
        const form = document.getElementById('stock-movement-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const item = this.items.find(i => i.itemId === data.itemId);
        if (!item) return;

        let qtyChange = parseInt(data.qtyChange || 0);
        if (data.movementType === 'Production Consumption' || data.movementType === 'Damage Scrap') {
            qtyChange = -Math.abs(qtyChange);
        }

        item.currentStock = Math.max(0, item.currentStock + qtyChange);
        item.history = item.history || [];
        item.history.unshift({
            date: new Date().toISOString().split('T')[0],
            type: data.movementType,
            qtyChange: qtyChange,
            balance: item.currentStock,
            user: data.user || 'Store Keeper',
            reference: data.reference || 'Manual Entry',
            notes: data.notes || ''
        });

        this.saveInventory();

        const modalEl = document.getElementById('stockMovementModal');
        if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            } else {
                modalEl.remove();
            }
        }

        alert(`Stock movement recorded for ${item.itemName}. New Balance: ${item.currentStock} ${item.unit}`);
        this.render();
    }

    renderNewForm() {
        this.renderItemModal();
    }

    renderEditForm(itemId) {
        const item = this.items.find(i => i.itemId === itemId);
        if (item) {
            this.renderItemModal(item);
        }
    }

    renderItemModal(item = null) {
        const isEdit = !!item;
        const modalId = 'inventoryItemModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const category = item?.category || 'Aluminium Profiles';
        const newId = isEdit ? item.itemId : this.generateItemId(category);

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-boxes text-primary me-2"></i> ${isEdit ? 'Edit SKU Item #' + newId : 'Register New Inventory Item / SKU'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="inventory-item-form">
                                <div class="row g-3 mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Auto Item Code</label>
                                        <input type="text" class="form-control bg-light font-bold text-primary" name="itemId" value="${newId}" readonly>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Barcode / QR Code</label>
                                        <input type="text" class="form-control font-bold" name="barcode" value="${item?.barcode || '8934120556' + (this.items.length+101)}">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Category <span class="text-danger">*</span></label>
                                        <select class="form-select font-bold" name="category" required>
                                            ${this.categories.map(c => `<option value="${c}" ${category === c ? 'selected' : ''}>${c}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Item Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="itemName" value="${item?.itemName || ''}" placeholder="e.g. 100mm Powder Coated White Profile" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Brand (Alumex / SwissTek / etc.)</label>
                                        <input type="text" class="form-control" name="brand" value="${item?.brand || ''}" placeholder="e.g. Alumex">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Unit of Measure</label>
                                        <select class="form-select" name="unit">
                                            <option value="Bars (6m)" ${item?.unit === 'Bars (6m)' ? 'selected' : ''}>Bars (6m)</option>
                                            <option value="Sheets" ${item?.unit === 'Sheets' ? 'selected' : ''}>Sheets</option>
                                            <option value="Meters" ${item?.unit === 'Meters' ? 'selected' : ''}>Meters</option>
                                            <option value="Pcs" ${item?.unit === 'Pcs' ? 'selected' : ''}>Pcs</option>
                                            <option value="Tubes" ${item?.unit === 'Tubes' ? 'selected' : ''}>Tubes</option>
                                            <option value="Sets" ${item?.unit === 'Sets' ? 'selected' : ''}>Sets</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Supplier Name</label>
                                        <select class="form-select" name="supplier">
                                            ${this.suppliers.map(s => `<option value="${s.name}" ${item?.supplier === s.name ? 'selected' : ''}>${s.name} (${s.contact})</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Warehouse Location</label>
                                        <input type="text" class="form-control" name="location" value="${item?.location || ''}" placeholder="e.g. Rack A-14 / Glass Bay B-2">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Current Stock Qty</label>
                                        <input type="number" class="form-control font-bold" name="currentStock" value="${item?.currentStock ?? 25}" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Reorder Level Alert</label>
                                        <input type="number" class="form-control font-bold text-warning" name="reorderLevel" value="${item?.reorderLevel ?? 10}" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Purchase Price (LKR)</label>
                                        <input type="number" step="0.01" class="form-control" name="purchasePrice" value="${item?.purchasePrice ?? 8500}" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Selling Price (LKR)</label>
                                        <input type="number" step="0.01" class="form-control font-bold text-success" name="sellingPrice" value="${item?.sellingPrice ?? 12000}" required>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label font-medium">Technical Notes & Storage Specs</label>
                                        <textarea class="form-control" name="notes" rows="2" placeholder="Storage instructions...">${item?.notes || ''}</textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="window.inventoryModule.handleSaveItem()">
                                <i class="fas fa-check me-1"></i> Save SKU Item
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

    handleSaveItem() {
        const form = document.getElementById('inventory-item-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.currentStock = parseInt(data.currentStock || 0);
        data.minStock = Math.floor(data.currentStock * 0.2);
        data.maxStock = data.currentStock * 3;
        data.reorderLevel = parseInt(data.reorderLevel || 10);
        data.purchasePrice = parseFloat(data.purchasePrice || 0);
        data.sellingPrice = parseFloat(data.sellingPrice || 0);

        const existingIndex = this.items.findIndex(i => i.itemId === data.itemId);
        if (existingIndex >= 0) {
            this.items[existingIndex] = { ...this.items[existingIndex], ...data };
        } else {
            data.history = [
                { date: new Date().toISOString().split('T')[0], type: 'Stock In', qtyChange: data.currentStock, balance: data.currentStock, user: 'Store Keeper', reference: 'Initial Registration', notes: 'Item registered' }
            ];
            this.items.unshift(data);
        }

        this.saveInventory();

        const modalEl = document.getElementById('inventoryItemModal');
        if (modalEl) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            } else {
                modalEl.remove();
            }
        }

        alert(`Item ${data.itemId} saved successfully!`);
        this.render();
    }

    deleteItem(itemId) {
        if (!confirm(`Are you sure you want to delete SKU Item ${itemId}?`)) return;
        this.items = this.items.filter(i => i.itemId !== itemId);
        this.saveInventory();
        this.render();
    }

    renderDetail(itemId) {
        const item = this.items.find(i => i.itemId === itemId);
        if (!item) return;

        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        const html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">SKU Item Detail: ${item.itemId}</h2>
                    <p class="text-muted small mb-0">${item.itemName} &nbsp;|&nbsp; Category: <strong>${item.category}</strong></p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="window.inventoryModule.render()"><i class="fas fa-arrow-left me-1"></i> Back</button>
                    <button class="btn btn-warning text-dark" onclick="window.inventoryModule.renderEditForm('${item.itemId}')"><i class="fas fa-edit me-1"></i> Edit Item</button>
                    <button class="btn btn-success" onclick="window.inventoryModule.quickStockIn('${item.itemId}')"><i class="fas fa-plus me-1"></i> Add Stock In</button>
                </div>
            </div>

            <!-- Item Overview Header Banner -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 5px solid var(--color-brand-blue); border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                <div class="row g-3">
                    <div class="col-md-6 border-end">
                        <h4 class="font-bold text-main mb-1">${item.itemName}</h4>
                        <p class="text-muted small mb-1"><i class="fas fa-barcode me-1"></i> Barcode: <strong>${item.barcode || 'N/A'}</strong></p>
                        <p class="text-muted small mb-1"><i class="fas fa-industry me-1"></i> Brand / Supplier: <strong>${item.brand || 'Standard'} (${item.supplier || 'Vendor'})</strong></p>
                        <p class="text-muted small mb-0"><i class="fas fa-warehouse me-1"></i> Location: <strong>${item.location || 'Main Warehouse'}</strong></p>
                    </div>
                    <div class="col-md-6 ps-4">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Current Stock Qty:</span>
                            <strong class="fs-4 text-primary">${item.currentStock} ${item.unit}</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Reorder Level Alert:</span>
                            <span class="badge bg-warning text-dark font-bold">${item.reorderLevel} ${item.unit}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small uppercase">Purchase Unit Price:</span>
                            <strong>LKR ${(item.purchasePrice || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</strong>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted small uppercase">Total Stock Valuation:</span>
                            <strong class="text-success fs-5">LKR ${(item.currentStock * (item.purchasePrice || 0)).toLocaleString('en-US', {minimumFractionDigits:2})}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Transaction Audit History Log -->
            <div class="card p-4 mb-4" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 14px;">
                <h5 class="font-bold text-main mb-3"><i class="fas fa-history text-primary me-2"></i> Stock Movement & Transaction History Log</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small">
                            <tr>
                                <th>Date</th>
                                <th>Movement Type</th>
                                <th>Qty Change</th>
                                <th>Balance Stock</th>
                                <th>User / System</th>
                                <th>Reference / Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(item.history || []).map(h => `
                                <tr>
                                    <td>${h.date}</td>
                                    <td><span class="badge ${h.type==='Stock In'?'bg-success':'bg-danger'}">${h.type}</span></td>
                                    <td><strong class="${h.qtyChange>0?'text-success':'text-danger'}">${h.qtyChange > 0 ? '+' : ''}${h.qtyChange}</strong></td>
                                    <td><strong>${h.balance} ${item.unit}</strong></td>
                                    <td>${h.user}</td>
                                    <td><span class="small text-muted">${h.reference || ''} (${h.notes || ''})</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    renderPrintView() {
        const totalValuation = this.items.reduce((sum, item) => sum + (item.currentStock * item.purchasePrice), 0);

        const rowsHtml = this.items.map((item, idx) => {
            const val = item.currentStock * item.purchasePrice;
            const isLow = item.currentStock <= item.reorderLevel;

            return `
                <tr style="${isLow ? 'background-color: #FEF3C7;' : ''}">
                    <td class="text-center" style="font-weight: 700;">${idx + 1}</td>
                    <td><strong>${item.itemId}</strong></td>
                    <td><strong>${item.itemName}</strong><br><span style="font-size: 8.5px; color: #64748B;">Supplier: ${item.supplier || 'N/A'}</span></td>
                    <td>${item.category} (${item.brand || ''})</td>
                    <td>${item.location || 'Main Warehouse'}</td>
                    <td class="text-center" style="font-weight: 700;">${item.currentStock} ${item.unit}</td>
                    <td class="text-center">${item.reorderLevel}</td>
                    <td class="text-end">LKR ${item.purchasePrice.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                    <td class="text-end" style="font-weight: 700;">LKR ${val.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                </tr>
            `;
        }).join('');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Stock Valuation & Audit Report - ALUGRADE LANKA</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
                <style>
                    @page { size: A4 portrait; margin: 10mm 12mm; }
                    * { box-sizing: border-box; }
                    body { font-family: 'Inter', sans-serif; padding: 20px; color: #0F172A; font-size: 10.5px; }
                    .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #2563EB; padding-bottom: 12px; margin-bottom: 16px; }
                    .company-title { font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 800; }
                    .doc-badge { background: #2563EB; color: #ffffff; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 800; padding: 4px 12px; border-radius: 6px; }
                    table.spec-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
                    table.spec-table th { background: #0F172A; color: #ffffff; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 6px 8px; border: 1px solid #0F172A; text-align: left; }
                    table.spec-table td { border: 1px solid #CBD5E1; padding: 6px 8px; font-size: 9.5px; }
                    .text-center { text-align: center; }
                    .text-end { text-align: right; }
                    .val-card { background: #F8FAFC; border: 1.5px solid #2563EB; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
                    .signature-area { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; }
                    .sig-block { text-align: center; width: 200px; }
                    .sig-block img { height: 45px; }
                    .sig-line { border-top: 1.5px solid #0F172A; margin-top: 4px; }
                </style>
            </head>
            <body>
                <div class="header-container">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="assets/logo/logo.png" style="height: 55px;" />
                        <div>
                            <div class="company-title">ALUGRADE LANKA FAB & GLASS</div>
                            <div style="color:#2563EB; font-weight:700; font-size:9.5px;">INVENTORY AUDIT & STOCK VALUATION SHEET</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div class="doc-badge">STOCK VALUATION</div>
                        <div style="margin-top:4px;"><strong>Date:</strong> ${new Date().toISOString().split('T')[0]}</div>
                    </div>
                </div>

                <div class="val-card">
                    <span>Total Registered SKUs: ${this.items.length}</span>
                    <span style="color:#2563EB;">Total Warehouse Inventory Valuation: LKR ${totalValuation.toLocaleString('en-US', {minimumFractionDigits:2})}</span>
                </div>

                <table class="spec-table">
                    <thead>
                        <tr>
                            <th style="width:25px;" class="text-center">#</th>
                            <th style="width:90px;">Item Code</th>
                            <th>Description</th>
                            <th>Category & Brand</th>
                            <th>Location</th>
                            <th style="width:70px;" class="text-center">Stock</th>
                            <th style="width:50px;" class="text-center">Reorder</th>
                            <th style="width:85px;" class="text-end">Pur. Price</th>
                            <th style="width:95px;" class="text-end">Valuation (LKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>

                <div class="signature-area">
                    <div>
                        <strong>Store & Inventory Department</strong><br>
                        Homagama Main Warehouse
                    </div>
                    <div class="sig-block">
                        <img src="assets/signature/signature.png" />
                        <div class="sig-line"></div>
                        <div>MR. M. U. RAJAPAKSHA</div>
                        <div style="font-size:9px; color:#64748B;">Managing Director</div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    printInventoryList() {
        const html = this.renderPrintView();
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
        let csv = "Item Code,Barcode,Name,Category,Brand,Supplier,Location,Stock Qty,Unit,Pur. Price,Sel. Price,Valuation\n";
        this.items.forEach(i => {
            const val = i.currentStock * i.purchasePrice;
            csv += `${i.itemId},"${i.barcode || ''}","${i.itemName}","${i.category}","${i.brand || ''}","${i.supplier || ''}","${i.location || ''}",${i.currentStock},"${i.unit}",${i.purchasePrice},${i.sellingPrice},${val}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ALUGRADE_Inventory_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Purchase Order Integration Architecture Class for future Procurement Module integration
class PurchaseOrderArchitecture {
    constructor() {
        this.moduleName = 'Purchase Orders & GRN';
    }

    createPurchaseOrder(vendorId, itemsList) {
        console.log(`[PO Architecture] Initialized Purchase Order for vendor ${vendorId}:`, itemsList);
        return { status: 'PO_DRAFT_READY', poNumber: 'PO-2026-0001' };
    }
}

if (typeof window !== 'undefined') {
    window.InventoryModule = InventoryModule;
    window.PurchaseOrderArchitecture = PurchaseOrderArchitecture;
}
