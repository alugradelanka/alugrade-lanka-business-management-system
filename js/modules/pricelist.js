/**
 * Price List / Price Master Module for ALUGRADE BMS
 * Professional Pricing & Rate Management System
 */

class PriceListModule {
  constructor(containerId) {
    this.containerId = containerId || 'pageContent';
    this.storageKey = 'alugrade_pricelist';
    
    this.categories = [
      'Aluminium Windows System',
      'Aluminium Doors System',
      'Curtain Wall & Structural Glazing',
      'Office Partitions, Shopfronts & Cubicles',
      'ACP Cladding, Skylights & Balustrades',
      'Glass Master Catalog',
      'Extrusions & Finishes',
      'Hardware & Accessories'
    ];

    this.units = ['sq.ft', 'ft', 'unit', 'sheet', 'm', 'set'];
    this.items = this.loadPrices();
  }

  loadPrices() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse stored price list:', e);
      }
    }

    const defaultPrices = [
      // Category 1: Aluminium Windows System
      { id: 'PRC-WIN-001', category: 'Aluminium Windows System', productName: 'Sliding Window 2-Track System (Standard)', unit: 'sq.ft', materialCost: 1250.00, labourCost: 450.00, defaultRate: 500.00, status: 'Active', notes: 'Includes 100mm frame, EPDM seals, and standard hardware' },
      { id: 'PRC-WIN-002', category: 'Aluminium Windows System', productName: 'Sliding Window 3-Track System (with Insect Mesh)', unit: 'sq.ft', materialCost: 1550.00, labourCost: 550.00, defaultRate: 600.00, status: 'Active', notes: 'Includes 3-track frame + SS mesh sash' },
      { id: 'PRC-WIN-003', category: 'Aluminium Windows System', productName: 'Casement Openable Window (45mm Series)', unit: 'sq.ft', materialCost: 1850.00, labourCost: 650.00, defaultRate: 700.00, status: 'Active', notes: 'Includes SS friction stays & multi-point handles' },
      { id: 'PRC-WIN-004', category: 'Aluminium Windows System', productName: 'Top-Hung Awning Window', unit: 'sq.ft', materialCost: 1650.00, labourCost: 550.00, defaultRate: 600.00, status: 'Active', notes: 'Heavy duty awning stay & locking cockspur' },
      { id: 'PRC-WIN-005', category: 'Aluminium Windows System', productName: 'Fixed Glass Window Panel', unit: 'sq.ft', materialCost: 1100.00, labourCost: 350.00, defaultRate: 450.00, status: 'Active', notes: 'Sub-frame architrave + glass glazing' },
      { id: 'PRC-WIN-006', category: 'Aluminium Windows System', productName: 'Aluminium Louver Window (Glass Blades)', unit: 'sq.ft', materialCost: 1350.00, labourCost: 450.00, defaultRate: 500.00, status: 'Active', notes: 'Glass blade clips + adjustable louver mechanism' },

      // Category 2: Aluminium Doors System
      { id: 'PRC-DOR-001', category: 'Aluminium Doors System', productName: 'Heavy Duty 2-Track Sliding Patio Door', unit: 'sq.ft', materialCost: 2200.00, labourCost: 750.00, defaultRate: 850.00, status: 'Active', notes: 'Heavy duty tandem rollers & cylinder lock' },
      { id: 'PRC-DOR-002', category: 'Aluminium Doors System', productName: 'Aluminium Swing Entrance Door (Solid / Glass)', unit: 'sq.ft', materialCost: 2500.00, labourCost: 850.00, defaultRate: 950.00, status: 'Active', notes: '45mm sash + heavy duty butt hinges & lever lock' },
      { id: 'PRC-DOR-003', category: 'Aluminium Doors System', productName: 'Aluminium Folding / Bi-Fold Door System', unit: 'sq.ft', materialCost: 3200.00, labourCost: 1100.00, defaultRate: 1200.00, status: 'Active', notes: 'Top-hung track guide & bottom stainless hinges' },
      { id: 'PRC-DOR-004', category: 'Aluminium Doors System', productName: 'Frameless Toughened Glass Door (Floor Spring)', unit: 'sq.ft', materialCost: 3800.00, labourCost: 1200.00, defaultRate: 1400.00, status: 'Active', notes: '12mm toughened glass + hydraulic floor spring & SS patch fittings' },
      { id: 'PRC-DOR-005', category: 'Aluminium Doors System', productName: 'Automatic Motion Sensor Sliding Door', unit: 'unit', materialCost: 185000.00, labourCost: 35000.00, defaultRate: 40000.00, status: 'Active', notes: 'Microprocessor controller, radar sensors & safety beam' },

      // Category 3: Curtain Wall & Structural Glazing
      { id: 'PRC-CW-001', category: 'Curtain Wall & Structural Glazing', productName: 'Stick Curtain Wall (Exposed Pressure Plate)', unit: 'sq.ft', materialCost: 3400.00, labourCost: 1100.00, defaultRate: 1300.00, status: 'Active', notes: 'Architectural mullion & transom extrusions with EPDM seals' },
      { id: 'PRC-CW-002', category: 'Curtain Wall & Structural Glazing', productName: 'Full Structural Silicone Glazing (SSG)', unit: 'sq.ft', materialCost: 4200.00, labourCost: 1400.00, defaultRate: 1600.00, status: 'Active', notes: 'Dow Corning structural silicone jointing + thermal break brackets' },
      { id: 'PRC-CW-003', category: 'Curtain Wall & Structural Glazing', productName: '4-Way Stainless Steel Spider Glazing System', unit: 'sq.ft', materialCost: 5500.00, labourCost: 1800.00, defaultRate: 2000.00, status: 'Active', notes: '304 SS spider fittings & routel connectors' },

      // Category 4: Office Partitions, Shopfronts & Cubicles
      { id: 'PRC-PRT-001', category: 'Office Partitions, Shopfronts & Cubicles', productName: 'Aluminium Framed Office Partition (Single Glazed)', unit: 'sq.ft', materialCost: 1450.00, labourCost: 450.00, defaultRate: 500.00, status: 'Active', notes: '100mm partition profile with 6mm clear glass' },
      { id: 'PRC-PRT-002', category: 'Office Partitions, Shopfronts & Cubicles', productName: 'Frameless Glass Partition (12mm Toughened)', unit: 'sq.ft', materialCost: 2600.00, labourCost: 800.00, defaultRate: 900.00, status: 'Active', notes: 'Polished glass edges + perimeter aluminium U-channel' },
      { id: 'PRC-PRT-003', category: 'Office Partitions, Shopfronts & Cubicles', productName: 'Commercial Shopfront Glazing Framework', unit: 'sq.ft', materialCost: 2100.00, labourCost: 650.00, defaultRate: 750.00, status: 'Active', notes: 'Heavy duty shopfront transom and corner mullions' },
      { id: 'PRC-PRT-004', category: 'Office Partitions, Shopfronts & Cubicles', productName: 'Frameless Glass Shower Enclosure (Corner Unit)', unit: 'unit', materialCost: 68000.00, labourCost: 18000.00, defaultRate: 22000.00, status: 'Active', notes: '10mm toughened glass + SS hinges, stabilizer bar & magnetic seals' },

      // Category 5: ACP Cladding, Skylights & Balustrades
      { id: 'PRC-ACP-001', category: 'ACP Cladding, Skylights & Balustrades', productName: 'Aluminium Composite Panel (ACP) Wall Cladding (PVDF)', unit: 'sq.ft', materialCost: 1150.00, labourCost: 450.00, defaultRate: 500.00, status: 'Active', notes: '4mm PVDF ACP sheet + GI sub-frame steel grid & silicone joint' },
      { id: 'PRC-ACP-002', category: 'ACP Cladding, Skylights & Balustrades', productName: 'Pyramid Glass Skylight System', unit: 'sq.ft', materialCost: 4800.00, labourCost: 1600.00, defaultRate: 1800.00, status: 'Active', notes: 'Laminated safety glass + heavy duty guttered aluminium rafters' },
      { id: 'PRC-ACP-003', category: 'ACP Cladding, Skylights & Balustrades', productName: 'Frameless Glass Balustrade (Base Track Channel)', unit: 'ft', materialCost: 8500.00, labourCost: 2800.00, defaultRate: 3200.00, status: 'Active', notes: 'Heavy duty aluminium U-channel base + 15mm toughened glass' },

      // Category 6: Glass Master Catalog
      { id: 'PRC-GLS-001', category: 'Glass Master Catalog', productName: '6mm Clear Float Glass', unit: 'sq.ft', materialCost: 420.00, labourCost: 120.00, defaultRate: 150.00, status: 'Active', notes: 'Standard clear float glass sheet' },
      { id: 'PRC-GLS-002', category: 'Glass Master Catalog', productName: '6mm Tempered / Toughened Clear Glass', unit: 'sq.ft', materialCost: 750.00, labourCost: 220.00, defaultRate: 250.00, status: 'Active', notes: 'Grade A safety toughened glass' },
      { id: 'PRC-GLS-003', category: 'Glass Master Catalog', productName: '8mm Tempered / Toughened Clear Glass', unit: 'sq.ft', materialCost: 980.00, labourCost: 280.00, defaultRate: 320.00, status: 'Active', notes: 'Heavy duty structural safety glass' },
      { id: 'PRC-GLS-004', category: 'Glass Master Catalog', productName: '12mm Toughened Clear Glass', unit: 'sq.ft', materialCost: 1450.00, labourCost: 420.00, defaultRate: 480.00, status: 'Active', notes: 'Frameless partition & door grade glass' },
      { id: 'PRC-GLS-005', category: 'Glass Master Catalog', productName: '6mm Tinted Glass (Dark Grey / Bronze / Blue)', unit: 'sq.ft', materialCost: 850.00, labourCost: 240.00, defaultRate: 280.00, status: 'Active', notes: 'Heat absorbing solar tint glass' },
      { id: 'PRC-GLS-006', category: 'Glass Master Catalog', productName: 'Double Glazed Unit (DGU 6mm+9A+6mm)', unit: 'sq.ft', materialCost: 2200.00, labourCost: 650.00, defaultRate: 750.00, status: 'Active', notes: 'Insulated double glazing unit with aluminium spacer & argon gas' },

      // Category 7: Extrusions & Finishes
      { id: 'PRC-EXT-001', category: 'Extrusions & Finishes', productName: 'Anodized Natural Silver Powder Coat Surcharge', unit: 'sq.ft', materialCost: 180.00, labourCost: 50.00, defaultRate: 70.00, status: 'Active', notes: 'Standard anodized silver protective coating' },
      { id: 'PRC-EXT-002', category: 'Extrusions & Finishes', productName: 'Matt Black Powder Coating (RAL 9005)', unit: 'sq.ft', materialCost: 280.00, labourCost: 80.00, defaultRate: 100.00, status: 'Active', notes: 'Architectural grade matte black polyester powder coat' },
      { id: 'PRC-EXT-003', category: 'Extrusions & Finishes', productName: 'Wood Grain Sublimation Timber Finish', unit: 'sq.ft', materialCost: 580.00, labourCost: 150.00, defaultRate: 200.00, status: 'Active', notes: 'Premium wood pattern heat transfer finish' },

      // Category 8: Hardware & Accessories
      { id: 'PRC-HDW-001', category: 'Hardware & Accessories', productName: 'SS Friction Stay Pair (12 Inch Heavy Duty)', unit: 'set', materialCost: 2400.00, labourCost: 600.00, defaultRate: 700.00, status: 'Active', notes: 'Grade 304 stainless steel casement window hinges' },
      { id: 'PRC-HDW-002', category: 'Hardware & Accessories', productName: 'Hydraulic Floor Spring Unit (120kg Capacity)', unit: 'unit', materialCost: 28000.00, labourCost: 6500.00, defaultRate: 7500.00, status: 'Active', notes: 'Dual valve speed adjustment hydraulic floor closer' },
      { id: 'PRC-HDW-003', category: 'Hardware & Accessories', productName: 'Structural Silicone Sealant Tube (Dow Corning)', unit: 'unit', materialCost: 2800.00, labourCost: 500.00, defaultRate: 600.00, status: 'Active', notes: 'High modulus structural glazing silicone' }
    ];

    localStorage.setItem(this.storageKey, JSON.stringify(defaultPrices));
    return defaultPrices;
  }

  savePrices() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  calculateTotalRate(item) {
    const mat = parseFloat(item.materialCost) || 0;
    const lab = parseFloat(item.labourCost) || 0;
    const def = parseFloat(item.defaultRate) || 0;
    return mat + lab + def;
  }

  getItemById(id) {
    return this.items.find(i => i.id === id);
  }

  getItemByName(name) {
    return this.items.find(i => i.productName.toLowerCase() === (name || '').toLowerCase());
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Calculate Summary Stats
    const totalCount = this.items.length;
    const activeCount = this.items.filter(i => i.status === 'Active').length;
    const sqftItems = this.items.filter(i => i.unit === 'sq.ft');
    const avgSqftRate = sqftItems.length > 0
      ? sqftItems.reduce((acc, curr) => acc + this.calculateTotalRate(curr), 0) / sqftItems.length
      : 0;

    container.innerHTML = `
      <div class="module-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 style="font-size:24px;font-weight:700;color:var(--color-text-main,#0F172A);margin:0;">Price Master Catalog</h1>
          <p style="color:var(--color-text-muted,#64748B);font-size:14px;margin:4px 0 0 0;">Manage aluminium, glass, and fabrication rate cards for dynamic quotation generation.</p>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="window.priceListModule.exportExcel()">
            <i data-lucide="download"></i> Export Rate Sheet
          </button>
          <button class="btn btn-primary" onclick="window.priceListModule.showAddModal()">
            <i data-lucide="plus"></i> Add New Product Rate
          </button>
        </div>
      </div>

      <!-- Stats Summary Cards -->
      <div class="stats-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px;">
        <div class="stat-card" style="background:white;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid #E2E8F0;">
          <div style="font-size:13px;color:#64748B;font-weight:500;">Total Master Products</div>
          <div style="font-size:28px;font-weight:700;color:#0F172A;margin-top:4px;">${totalCount}</div>
        </div>
        <div class="stat-card" style="background:white;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid #E2E8F0;">
          <div style="font-size:13px;color:#64748B;font-weight:500;">Active Rates</div>
          <div style="font-size:28px;font-weight:700;color:#10B981;margin-top:4px;">${activeCount}</div>
        </div>
        <div class="stat-card" style="background:white;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid #E2E8F0;">
          <div style="font-size:13px;color:#64748B;font-weight:500;">Avg Sq.Ft Rate</div>
          <div style="font-size:24px;font-weight:700;color:#2563EB;margin-top:4px;">LKR ${avgSqftRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div class="stat-card" style="background:white;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid #E2E8F0;">
          <div style="font-size:13px;color:#64748B;font-weight:500;">Categories</div>
          <div style="font-size:28px;font-weight:700;color:#8B5CF6;margin-top:4px;">${this.categories.length}</div>
        </div>
      </div>

      <!-- Controls & Filters -->
      <div style="background:white;padding:16px 20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid #E2E8F0;margin-bottom:24px;display:flex;gap:16px;flex-wrap:wrap;align-items:center;justify-content:space-between;">
        <div style="display:flex;gap:12px;flex:1;min-width:280px;">
          <div style="position:relative;flex:1;">
            <i data-lucide="search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94A3B8;width:18px;height:18px;"></i>
            <input type="text" id="priceSearch" placeholder="Search product name or code..." onkeyup="window.priceListModule.filterTable()" style="width:100%;padding:10px 14px 10px 40px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;" />
          </div>
          <select id="categoryFilter" onchange="window.priceListModule.filterTable()" style="padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;background:white;">
            <option value="">All Categories</option>
            ${this.categories.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div style="font-size:13px;color:#64748B;">Showing <span id="visibleCount">${totalCount}</span> items</div>
      </div>

      <!-- Price Master Table -->
      <div style="background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid #E2E8F0;overflow:hidden;">
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;text-align:left;font-size:14px;">
            <thead>
              <tr style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;color:#475569;font-weight:600;">
                <th style="padding:14px 18px;">Product Code</th>
                <th style="padding:14px 18px;">Product Name</th>
                <th style="padding:14px 18px;">Category</th>
                <th style="padding:14px 18px;">Unit</th>
                <th style="padding:14px 18px;text-align:right;">Material Cost</th>
                <th style="padding:14px 18px;text-align:right;">Labour Cost</th>
                <th style="padding:14px 18px;text-align:right;">Default Rate</th>
                <th style="padding:14px 18px;text-align:right;">Total Rate</th>
                <th style="padding:14px 18px;text-align:center;">Status</th>
                <th style="padding:14px 18px;text-align:center;">Actions</th>
              </tr>
            </thead>
            <tbody id="priceTableBody">
              ${this.renderTableRows(this.items)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  renderTableRows(itemsList) {
    if (!itemsList || itemsList.length === 0) {
      return `<tr><td colspan="10" style="padding:30px;text-align:center;color:#64748B;">No pricing items found.</td></tr>`;
    }

    return itemsList.map(item => {
      const total = this.calculateTotalRate(item);
      return `
        <tr style="border-bottom:1px solid #F1F5F9;transition:background 0.15s;" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background='white'">
          <td style="padding:14px 18px;font-weight:600;color:#2563EB;">${item.id}</td>
          <td style="padding:14px 18px;font-weight:600;color:#0F172A;">
            ${item.productName}
            ${item.notes ? `<div style="font-size:12px;color:#64748B;font-weight:400;margin-top:2px;">${item.notes}</div>` : ''}
          </td>
          <td style="padding:14px 18px;color:#475569;"><span style="background:#F1F5F9;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:500;">${item.category}</span></td>
          <td style="padding:14px 18px;color:#475569;font-weight:500;">${item.unit}</td>
          <td style="padding:14px 18px;text-align:right;color:#475569;">LKR ${parseFloat(item.materialCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          <td style="padding:14px 18px;text-align:right;color:#475569;">LKR ${parseFloat(item.labourCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          <td style="padding:14px 18px;text-align:right;color:#475569;">LKR ${parseFloat(item.defaultRate).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          <td style="padding:14px 18px;text-align:right;font-weight:700;color:#059669;">
            <span style="background:#ECFDF5;color:#059669;padding:4px 10px;border-radius:6px;border:1px solid #A7F3D0;">
              LKR ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </td>
          <td style="padding:14px 18px;text-align:center;">
            <span style="background:${item.status === 'Active' ? '#DEF7EC' : '#FDE8E8'};color:${item.status === 'Active' ? '#03543F' : '#9B1C1C'};padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;">
              ${item.status}
            </span>
          </td>
          <td style="padding:14px 18px;text-align:center;">
            <div style="display:flex;gap:8px;justify-content:center;">
              <button onclick="window.priceListModule.showEditModal('${item.id}')" style="background:none;border:none;color:#2563EB;cursor:pointer;padding:4px;" title="Edit Rate">
                <i data-lucide="edit-3" style="width:16px;height:16px;"></i>
              </button>
              <button onclick="window.priceListModule.deleteItem('${item.id}')" style="background:none;border:none;color:#EF4444;cursor:pointer;padding:4px;" title="Delete Rate">
                <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  filterTable() {
    const q = (document.getElementById('priceSearch')?.value || '').toLowerCase();
    const cat = document.getElementById('categoryFilter')?.value || '';

    const filtered = this.items.filter(item => {
      const matchQ = !q || item.productName.toLowerCase().includes(q) || item.id.toLowerCase().includes(q) || (item.notes || '').toLowerCase().includes(q);
      const matchCat = !cat || item.category === cat;
      return matchQ && matchCat;
    });

    const tbody = document.getElementById('priceTableBody');
    if (tbody) tbody.innerHTML = this.renderTableRows(filtered);
    const visibleCount = document.getElementById('visibleCount');
    if (visibleCount) visibleCount.innerText = filtered.length;
    if (window.lucide) window.lucide.createIcons();
  }

  showAddModal() {
    this.renderModal(null);
  }

  showEditModal(id) {
    const item = this.getItemById(id);
    if (item) this.renderModal(item);
  }

  deleteItem(id) {
    if (!confirm('Are you sure you want to delete this price master entry?')) return;
    this.items = this.items.filter(i => i.id !== id);
    this.savePrices();
    this.render();
  }

  renderModal(item = null) {
    const isEdit = !!item;
    const modalId = 'priceModal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const catOptions = this.categories.map(c => `<option value="${c}" ${item && item.category === c ? 'selected' : ''}>${c}</option>`).join('');
    const unitOptions = this.units.map(u => `<option value="${u}" ${item && item.unit === u ? 'selected' : ''}>${u}</option>`).join('');

    const newId = isEdit ? item.id : `PRC-${Date.now().toString().slice(-4)}`;

    modal = document.createElement('div');
    modal.id = modalId;
    modal.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,0.6);
      display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;
    `;

    modal.innerHTML = `
      <div style="background:white;border-radius:16px;max-width:550px;width:100%;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);overflow:hidden;">
        <div style="padding:20px 24px;background:#F8FAFC;border-bottom:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center;">
          <h3 style="margin:0;font-size:18px;font-weight:700;color:#0F172A;">${isEdit ? 'Edit Product Rate' : 'Add New Product Rate'}</h3>
          <button onclick="document.getElementById('${modalId}').remove()" style="background:none;border:none;cursor:pointer;color:#64748B;">
            <i data-lucide="x" style="width:20px;height:20px;"></i>
          </button>
        </div>
        <form id="priceModalForm" style="padding:24px;">
          <input type="hidden" id="modalItemId" value="${newId}" />
          
          <div style="margin-bottom:16px;">
            <label style="display:block;font-size:12px;font-weight:600;color:#64748B;margin-bottom:6px;text-transform:uppercase;">Product Category</label>
            <select id="modalCategory" required style="width:100%;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;">
              ${catOptions}
            </select>
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block;font-size:12px;font-weight:600;color:#64748B;margin-bottom:6px;text-transform:uppercase;">Product Name / Description</label>
            <input type="text" id="modalProductName" required value="${item ? item.productName : ''}" placeholder="e.g. 100mm Sliding Window 2-Track" style="width:100%;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;" />
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#64748B;margin-bottom:6px;text-transform:uppercase;">Unit of Measure</label>
              <select id="modalUnit" required style="width:100%;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;">
                ${unitOptions}
              </select>
            </div>
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#64748B;margin-bottom:6px;text-transform:uppercase;">Status</label>
              <select id="modalStatus" style="width:100%;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;">
                <option value="Active" ${item && item.status === 'Active' ? 'selected' : ''}>Active</option>
                <option value="Inactive" ${item && item.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
              </select>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
            <div>
              <label style="display:block;font-size:11px;font-weight:600;color:#64748B;margin-bottom:6px;text-transform:uppercase;">Material Cost</label>
              <input type="number" step="0.01" id="modalMaterial" required value="${item ? item.materialCost : '0.00'}" oninput="window.priceListModule.updateModalTotal()" style="width:100%;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;" />
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;color:#64748B;margin-bottom:6px;text-transform:uppercase;">Labour Cost</label>
              <input type="number" step="0.01" id="modalLabour" required value="${item ? item.labourCost : '0.00'}" oninput="window.priceListModule.updateModalTotal()" style="width:100%;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;" />
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;color:#64748B;margin-bottom:6px;text-transform:uppercase;">Default Rate / Profit</label>
              <input type="number" step="0.01" id="modalDefaultRate" required value="${item ? item.defaultRate : '0.00'}" oninput="window.priceListModule.updateModalTotal()" style="width:100%;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;" />
            </div>
          </div>

          <div style="background:#ECFDF5;border:1px solid #A7F3D0;padding:12px 16px;border-radius:8px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:600;color:#065F46;font-size:13px;">Calculated Total Rate:</span>
            <span id="modalTotalDisplay" style="font-weight:700;color:#059669;font-size:16px;">LKR 0.00</span>
          </div>

          <div style="margin-bottom:20px;">
            <label style="display:block;font-size:12px;font-weight:600;color:#64748B;margin-bottom:6px;text-transform:uppercase;">Technical Notes / Spec</label>
            <textarea id="modalNotes" rows="2" style="width:100%;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;font-family:inherit;">${item ? (item.notes || '') : ''}</textarea>
          </div>

          <div style="display:flex;gap:12px;justify-content:flex-end;">
            <button type="button" onclick="document.getElementById('${modalId}').remove()" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Rate Item</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();
    this.updateModalTotal();

    document.getElementById('priceModalForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveModalData(isEdit);
    });
  }

  updateModalTotal() {
    const mat = parseFloat(document.getElementById('modalMaterial')?.value) || 0;
    const lab = parseFloat(document.getElementById('modalLabour')?.value) || 0;
    const def = parseFloat(document.getElementById('modalDefaultRate')?.value) || 0;
    const total = mat + lab + def;
    const display = document.getElementById('modalTotalDisplay');
    if (display) {
      display.innerText = `LKR ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  saveModalData(isEdit) {
    const id = document.getElementById('modalItemId').value;
    const category = document.getElementById('modalCategory').value;
    const productName = document.getElementById('modalProductName').value.trim();
    const unit = document.getElementById('modalUnit').value;
    const status = document.getElementById('modalStatus').value;
    const materialCost = parseFloat(document.getElementById('modalMaterial').value) || 0;
    const labourCost = parseFloat(document.getElementById('modalLabour').value) || 0;
    const defaultRate = parseFloat(document.getElementById('modalDefaultRate').value) || 0;
    const notes = document.getElementById('modalNotes').value.trim();

    if (!productName) {
      alert('Please enter a product name.');
      return;
    }

    const newItem = {
      id,
      category,
      productName,
      unit,
      materialCost,
      labourCost,
      defaultRate,
      status,
      notes
    };

    if (isEdit) {
      const idx = this.items.findIndex(i => i.id === id);
      if (idx !== -1) this.items[idx] = newItem;
    } else {
      this.items.unshift(newItem);
    }

    this.savePrices();
    document.getElementById('priceModal')?.remove();
    this.render();
  }

  exportExcel() {
    if (!window.XLSX) {
      alert('Excel export library loading...');
      return;
    }
    const data = this.items.map(i => ({
      'Product ID': i.id,
      'Product Name': i.productName,
      'Category': i.category,
      'Unit': i.unit,
      'Material Cost (LKR)': i.materialCost,
      'Labour Cost (LKR)': i.labourCost,
      'Default Rate (LKR)': i.defaultRate,
      'Total Rate (LKR)': this.calculateTotalRate(i),
      'Status': i.status,
      'Notes': i.notes || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Price Master');
    XLSX.writeFile(wb, 'ALUGRADE_BMS_Price_Master.xlsx');
  }
}

window.PriceListModule = PriceListModule;
