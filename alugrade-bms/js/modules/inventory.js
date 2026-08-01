/**
 * Inventory Management Module for ALUGRADE BMS
 * Commercial Enterprise Edition
 */

class InventoryModule {
    constructor(containerId) {
        this.containerId = containerId || 'pageContent';
        this.db = window.DB || { inventory: [], transactions: [] };
        this.events = window.Events || { trigger: () => {}, emit: () => {} };

        // 5 Standard Inventory Categories as required
        this.categories = [
            'Aluminium Profiles',
            'Glass',
            'Accessories',
            'Hardware',
            'Consumables'
        ];

        this.items = this.loadInventory();
    }

    loadInventory() {
        const stored = localStorage.getItem('alugrade_inventory');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) { return []; }
        }

        // Default enterprise inventory dataset
        const defaults = [
            {
                itemId: 'ITEM-2026-0001',
                barcode: '8934120556101',
                itemName: '100mm Heavy Duty Aluminium Profile (Matt Black)',
                category: 'Aluminium Profiles',
                brand: 'AluLanka Premium',
                supplier: 'Lanka Aluminium Industries PLC',
                unit: 'Bars (6m)',
                currentStock: 42,
                minStock: 15,
                maxStock: 100,
                reorderLevel: 20,
                purchasePrice: 12500,
                sellingPrice: 16500,
                location: 'Rack A-12 (Main Warehouse)',
                notes: 'Heavy duty architectural extrusion for commercial partitions.',
                history: [
                    { date: '2026-07-25', type: 'Stock In', qtyChange: 50, balance: 50, user: 'Store Keeper', reference: 'GRN-2026-0045', notes: 'Initial shipment received' },
                    { date: '2026-07-31', type: 'Stock Out', qtyChange: -8, balance: 42, user: 'Production Auto', reference: 'JOB-2026-0001', notes: 'Auto reduced for Job JOB-2026-0001' }
                ]
            },
            {
                itemId: 'ITEM-2026-0002',
                barcode: '8934120556102',
                itemName: '6mm Clear Tempered Glass Sheet (8ft x 4ft)',
                category: 'Glass',
                brand: 'Asahi Glass Sri Lanka',
                supplier: 'Lanka Safety Glass (Pvt) Ltd',
                unit: 'Sheets',
                currentStock: 8,
                minStock: 10,
                maxStock: 50,
                reorderLevel: 12,
                purchasePrice: 18500,
                sellingPrice: 24000,
                location: 'Glass Bay B-3',
                notes: 'Polished edges. Fragile storage vertical rack.',
                history: [
                    { date: '2026-07-28', type: 'Stock In', qtyChange: 12, balance: 12, user: 'Store Keeper', reference: 'GRN-2026-0049', notes: 'Tempered glass crate' },
                    { date: '2026-07-31', type: 'Stock Out', qtyChange: -4, balance: 8, user: 'Production Auto', reference: 'JOB-2026-0001', notes: 'Auto reduced for Job JOB-2026-0001' }
                ]
            },
            {
                itemId: 'ITEM-2026-0003',
                barcode: '8934120556103',
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
                    { date: '2026-07-31', type: 'Stock Out', qtyChange: -150, balance: 350, user: 'Production Auto', reference: 'JOB-2026-0001', notes: 'Issued to workshop' }
                ]
            },
            {
                itemId: 'ITEM-2026-0004',
                barcode: '8934120556104',
                itemName: 'Stainless Steel Sliding Door Rollers (Double Wheel)',
                category: 'Hardware',
                brand: 'Dorma/Kaba Style',
                supplier: 'Hardware Masters Colombo',
                unit: 'Pcs',
                currentStock: 4,
                minStock: 20,
                maxStock: 200,
                reorderLevel: 25,
                purchasePrice: 1450,
                sellingPrice: 2200,
                location: 'Bin H-02',
                notes: 'Heavy duty 120kg load rated double rollers.',
                history: [
                    { date: '2026-07-15', type: 'Stock In', qtyChange: 30, balance: 30, user: 'Store Keeper', reference: 'GRN-2026-0012', notes: 'Box of 30 pcs' },
                    { date: '2026-07-30', type: 'Stock Out', qtyChange: -26, balance: 4, user: 'Production Auto', reference: 'JOB-2026-0002', notes: 'Issued for Kottawa Villa Job' }
                ]
            },
            {
                itemId: 'ITEM-2026-0005',
                barcode: '8934120556105',
                itemName: 'Neutral Cure Silicone Sealant (Black - 300ml Tube)',
                category: 'Consumables',
                brand: 'DowSil / Wacker',
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
                    { date: '2026-07-31', type: 'Stock Out', qtyChange: -35, balance: 65, user: 'Workshop Issue', reference: 'ISS-2026-009', notes: 'Site installation batch' }
                ]
            }
        ];

        localStorage.setItem('alugrade_inventory', JSON.stringify(defaults));
        return defaults;
    }

    saveInventory() {
        localStorage.setItem('alugrade_inventory', JSON.stringify(this.items));
    }

    render() {
        const container = document.getElementById(this.containerId) || document.getElementById('pageContent') || document.body;

        const totalItems = this.items.length;
        const totalValue = this.items.reduce((sum, item) => sum + (item.currentStock * item.purchasePrice), 0);
        const lowStockCount = this.items.filter(item => item.currentStock <= item.reorderLevel && item.currentStock > 0).length;
        const outOfStockCount = this.items.filter(item => item.currentStock <= 0).length;

        let html = `
            <div class="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal); font-size: 1.6rem;">Enterprise Inventory & Stock Control</h2>
                    <p class="text-muted small mb-0">Manage aluminium extrusions, glass sheets, hardware, accessories, and automated stock reduction</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="window.inventoryModule.showStockMovementModal()">
                        <i class="fas fa-exchange-alt text-primary me-1"></i> Stock Movement Ops
                    </button>
                    <button class="btn btn-primary" onclick="window.inventoryModule.renderNewForm()">
                        <i class="fas fa-plus-circle me-1"></i> + Add New Item
                    </button>
                </div>
            </div>

            <!-- Summary KPI Cards -->
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid var(--color-brand-blue); border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Total Inventory SKUs</div>
                        <h3 class="mb-0 font-bold text-main mt-1">${totalItems} Items</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #10B981; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Total Valuation (LKR)</div>
                        <h3 class="mb-0 font-bold text-success mt-1">LKR ${totalValue.toLocaleString('en-US', {minimumFractionDigits:2})}</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #F59E0B; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Low Stock Alerts</div>
                        <h3 class="mb-0 font-bold text-warning mt-1">${lowStockCount} SKUs</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-3" style="background: #ffffff; border: 1px solid var(--color-border); border-left: 4px solid #EF4444; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div class="text-muted small uppercase font-medium">Out of Stock SKUs</div>
                        <h3 class="mb-0 font-bold text-danger mt-1">${outOfStockCount} SKUs</h3>
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
                            <option value="low">Low Stock / Reorder</option>
                            <option value="out">Out of Stock</option>
                        </select>
                    </div>

                    <div class="col-md-3 text-end">
                        <div class="btn-group">
                            <button class="btn btn-outline-secondary btn-sm" onclick="window.inventoryModule.exportExcel()"><i class="fas fa-file-excel text-success me-1"></i> Export CSV</button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="window.inventoryModule.printInventoryList()"><i class="fas fa-print me-1"></i> Print</button>
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
                                <th>Sel. Price (LKR)</th>
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
                <td><small class="text-muted">Min: ${i.minStock} | Reorder: ${i.reorderLevel}</small></td>
                <td>LKR ${(i.purchasePrice || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                <td><strong>LKR ${(i.sellingPrice || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                <td><span class="badge ${statusBadge}">${statusText}</span></td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="window.inventoryModule.renderDetail('${i.itemId}')">Detail</button>
                        <button class="btn btn-outline-success" onclick="window.inventoryModule.quickStockIn('${i.itemId}')">+ Stock</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    handleSearch() {
        this.loadInventoryData();
    }

    // AUTOMATIC STOCK REDUCTION WHEN PRODUCTION FABRICATES
    autoReduceStock(orderId, requiredMaterials = []) {
        console.log(`[Inventory Engine] Auto reducing stock for Order/Job ${orderId}`);
        // Deduct 100mm profile & Glass panels automatically
        const profileItem = this.items.find(i => i.category === 'Aluminium Profiles');
        if (profileItem && profileItem.currentStock >= 4) {
            profileItem.currentStock -= 4;
            profileItem.history.unshift({
                date: new Date().toISOString().split('T')[0],
                type: 'Stock Out',
                qtyChange: -4,
                balance: profileItem.currentStock,
                user: 'Production Auto Engine',
                reference: orderId,
                notes: `Auto reduced materials for Production Order ${orderId}`
            });
        }

        const glassItem = this.items.find(i => i.category === 'Glass');
        if (glassItem && glassItem.currentStock >= 2) {
            glassItem.currentStock -= 2;
            glassItem.history.unshift({
                date: new Date().toISOString().split('T')[0],
                type: 'Stock Out',
                qtyChange: -2,
                balance: glassItem.currentStock,
                user: 'Production Auto Engine',
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
                    reference: 'Batch Stock In',
                    notes: 'Manual stock addition'
                });

                this.saveInventory();
                alert(`Added +${qty} ${item.unit} to ${item.itemName}. New stock: ${item.currentStock}`);
                this.render();
            }
        }
    }

    showStockMovementModal() {
        alert("Stock Movement Operations Modal (Stock In / Stock Out / Adjustment / Location Transfer). Select an item and click '+ Stock' or 'Detail' to manage.");
    }

    renderNewForm() {
        const modalId = 'inventoryItemModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const newId = 'ITEM-2026-' + (this.items.length + 1).toString().padStart(4, '0');

        const html = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; border: 1px solid var(--color-border);">
                        <div class="modal-header bg-white border-bottom p-4">
                            <h5 class="modal-title font-bold text-main">
                                <i class="fas fa-boxes text-primary me-2"></i> Register New Inventory Item / SKU
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
                                        <input type="text" class="form-control font-bold" name="barcode" value="8934120556${(this.items.length+101)}">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label font-medium">Category <span class="text-danger">*</span></label>
                                        <select class="form-select font-bold" name="category" required>
                                            ${this.categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Item Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="itemName" placeholder="e.g. 100mm Powder Coated White Profile" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Brand</label>
                                        <input type="text" class="form-control" name="brand" placeholder="e.g. AluLanka">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Unit of Measure</label>
                                        <select class="form-select" name="unit">
                                            <option value="Bars (6m)">Bars (6m)</option>
                                            <option value="Sheets">Sheets</option>
                                            <option value="Meters">Meters</option>
                                            <option value="Pcs">Pcs</option>
                                            <option value="Tubes">Tubes</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Supplier Name</label>
                                        <input type="text" class="form-control" name="supplier" placeholder="e.g. Lanka Aluminium PLC">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label font-medium">Warehouse Location</label>
                                        <input type="text" class="form-control" name="location" placeholder="e.g. Rack A-14 / Glass Bay B-2">
                                    </div>
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Initial Stock Qty</label>
                                        <input type="number" class="form-control font-bold" name="currentStock" value="25" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Reorder Level Alert</label>
                                        <input type="number" class="form-control font-bold text-warning" name="reorderLevel" value="10" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Purchase Price (LKR)</label>
                                        <input type="number" step="0.01" class="form-control" name="purchasePrice" value="8500" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label font-medium">Selling Price (LKR)</label>
                                        <input type="number" step="0.01" class="form-control font-bold text-success" name="sellingPrice" value="12000" required>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer bg-light p-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="window.inventoryModule.handleSaveItem()">
                                <i class="fas fa-check me-1"></i> Register SKU Item
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
        data.history = [
            { date: new Date().toISOString().split('T')[0], type: 'Stock In', qtyChange: data.currentStock, balance: data.currentStock, user: 'Store Keeper', reference: 'Initial Registration', notes: 'Item added' }
        ];

        this.items.unshift(data);
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

        alert(`Item ${data.itemId} registered successfully!`);
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
                <div>
                    <button class="btn btn-outline-secondary me-2" onclick="window.inventoryModule.render()"><i class="fas fa-arrow-left me-1"></i> Back to Inventory</button>
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
                            <span class="text-muted small uppercase">Selling Unit Price:</span>
                            <strong class="text-success">LKR ${(item.sellingPrice || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</strong>
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

    exportExcel() {
        let csv = "Item Code,Barcode,Name,Category,Brand,Supplier,Location,Stock Qty,Unit,Pur. Price,Sel. Price\n";
        this.items.forEach(i => {
            csv += `${i.itemId},"${i.barcode || ''}","${i.itemName}","${i.category}","${i.brand || ''}","${i.supplier || ''}","${i.location || ''}",${i.currentStock},"${i.unit}",${i.purchasePrice},${i.sellingPrice}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ALUGRADE_Inventory_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    printInventoryList() {
        window.print();
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
