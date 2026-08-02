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
    const round2 = (num) => Math.round(num * 100) / 100;

    const defaultPrices = [
      // Category 1: Aluminium Windows System
      {
        id: 'PRC-WIN-001', category: 'Aluminium Windows System', productName: 'Sliding Window 2-Track System (Standard)', unit: 'sq.ft',
        materialCost: 1250.00, labourCost: 450.00, defaultRate: 500.00, status: 'Active', notes: 'Includes 100mm frame, EPDM seals, and standard hardware',
        brands: {
          'Alumex': { materialCost: 1250.00, labourCost: 450.00, defaultRate: 500.00 },
          'SwissTek': { materialCost: 1180.00, labourCost: 420.00, defaultRate: 480.00 }
        }
      },
      {
        id: 'PRC-WIN-002', category: 'Aluminium Windows System', productName: 'Sliding Window 3-Track System (with Insect Mesh)', unit: 'sq.ft',
        materialCost: 1550.00, labourCost: 550.00, defaultRate: 600.00, status: 'Active', notes: 'Includes 3-track frame + SS mesh sash',
        brands: {
          'Alumex': { materialCost: 1550.00, labourCost: 550.00, defaultRate: 600.00 },
          'SwissTek': { materialCost: 1470.00, labourCost: 520.00, defaultRate: 580.00 }
        }
      },
      {
        id: 'PRC-WIN-003', category: 'Aluminium Windows System', productName: 'Casement Openable Window (45mm Series)', unit: 'sq.ft',
        materialCost: 1850.00, labourCost: 650.00, defaultRate: 700.00, status: 'Active', notes: 'Includes SS friction stays & multi-point handles',
        brands: {
          'Alumex': { materialCost: 1850.00, labourCost: 650.00, defaultRate: 700.00 },
          'SwissTek': { materialCost: 1750.00, labourCost: 620.00, defaultRate: 670.00 }
        }
      },
      {
        id: 'PRC-WIN-004', category: 'Aluminium Windows System', productName: 'Top-Hung Awning Window', unit: 'sq.ft',
        materialCost: 1650.00, labourCost: 550.00, defaultRate: 600.00, status: 'Active', notes: 'Heavy duty awning stay & locking cockspur',
        brands: {
          'Alumex': { materialCost: 1650.00, labourCost: 550.00, defaultRate: 600.00 },
          'SwissTek': { materialCost: 1560.00, labourCost: 520.00, defaultRate: 570.00 }
        }
      },
      {
        id: 'PRC-WIN-005', category: 'Aluminium Windows System', productName: 'Fixed Glass Window Panel', unit: 'sq.ft',
        materialCost: 1100.00, labourCost: 350.00, defaultRate: 450.00, status: 'Active', notes: 'Sub-frame architrave + glass glazing',
        brands: {
          'Alumex': { materialCost: 1100.00, labourCost: 350.00, defaultRate: 450.00 },
          'SwissTek': { materialCost: 1040.00, labourCost: 330.00, defaultRate: 430.00 }
        }
      },

      // Category 2: Aluminium Doors System
      {
        id: 'PRC-DOR-001', category: 'Aluminium Doors System', productName: 'Heavy Duty 2-Track Sliding Patio Door', unit: 'sq.ft',
        materialCost: 2200.00, labourCost: 750.00, defaultRate: 850.00, status: 'Active', notes: 'Heavy duty tandem rollers & cylinder lock',
        brands: {
          'Alumex': { materialCost: 2200.00, labourCost: 750.00, defaultRate: 850.00 },
          'SwissTek': { materialCost: 2080.00, labourCost: 710.00, defaultRate: 810.00 }
        }
      },
      {
        id: 'PRC-DOR-002', category: 'Aluminium Doors System', productName: 'Aluminium Swing Entrance Door (Solid / Glass)', unit: 'sq.ft',
        materialCost: 2500.00, labourCost: 850.00, defaultRate: 950.00, status: 'Active', notes: '45mm sash + heavy duty butt hinges & lever lock',
        brands: {
          'Alumex': { materialCost: 2500.00, labourCost: 850.00, defaultRate: 950.00 },
          'SwissTek': { materialCost: 2360.00, labourCost: 800.00, defaultRate: 900.00 }
        }
      },
      {
        id: 'PRC-DOR-003', category: 'Aluminium Doors System', productName: 'Aluminium Folding / Bi-Fold Door System', unit: 'sq.ft',
        materialCost: 3200.00, labourCost: 1100.00, defaultRate: 1200.00, status: 'Active', notes: 'Top-hung track guide & bottom stainless hinges',
        brands: {
          'Alumex': { materialCost: 3200.00, labourCost: 1100.00, defaultRate: 1200.00 },
          'SwissTek': { materialCost: 3040.00, labourCost: 1040.00, defaultRate: 1140.00 }
        }
      },

      // Category 3: Curtain Wall & Structural Glazing
      {
        id: 'PRC-CW-001', category: 'Curtain Wall & Structural Glazing', productName: 'Stick Curtain Wall (Exposed Pressure Plate)', unit: 'sq.ft',
        materialCost: 3400.00, labourCost: 1100.00, defaultRate: 1300.00, status: 'Active', notes: 'Architectural mullion & transom extrusions with EPDM seals',
        brands: {
          'Alumex': { materialCost: 3400.00, labourCost: 1100.00, defaultRate: 1300.00 },
          'SwissTek': { materialCost: 3230.00, labourCost: 1040.00, defaultRate: 1230.00 }
        }
      },
      {
        id: 'PRC-CW-002', category: 'Curtain Wall & Structural Glazing', productName: 'Full Structural Silicone Glazing (SSG)', unit: 'sq.ft',
        materialCost: 4200.00, labourCost: 1400.00, defaultRate: 1600.00, status: 'Active', notes: 'Dow Corning structural silicone jointing + thermal break brackets',
        brands: {
          'Alumex': { materialCost: 4200.00, labourCost: 1400.00, defaultRate: 1600.00 },
          'SwissTek': { materialCost: 3990.00, labourCost: 1330.00, defaultRate: 1520.00 }
        }
      },

      // Category 4: Office Partitions, Shopfronts & Cubicles
      {
        id: 'PRC-PRT-001', category: 'Office Partitions, Shopfronts & Cubicles', productName: 'Aluminium Framed Office Partition (Single Glazed)', unit: 'sq.ft',
        materialCost: 1450.00, labourCost: 450.00, defaultRate: 500.00, status: 'Active', notes: '100mm partition profile with 6mm clear glass',
        brands: {
          'Alumex': { materialCost: 1450.00, labourCost: 450.00, defaultRate: 500.00 },
          'SwissTek': { materialCost: 1370.00, labourCost: 420.00, defaultRate: 470.00 }
        }
      },
      {
        id: 'PRC-PRT-003', category: 'Office Partitions, Shopfronts & Cubicles', productName: 'Commercial Shopfront Glazing Framework', unit: 'sq.ft',
        materialCost: 2100.00, labourCost: 650.00, defaultRate: 750.00, status: 'Active', notes: 'Heavy duty shopfront transom and corner mullions',
        brands: {
          'Alumex': { materialCost: 2100.00, labourCost: 650.00, defaultRate: 750.00 },
          'SwissTek': { materialCost: 1995.00, labourCost: 615.00, defaultRate: 710.00 }
        }
      },

      // Category 5: Glass, Accessories & Hardware
      {
        id: 'PRC-GLS-002', category: 'Glass Master Catalog', productName: '6mm Tempered / Toughened Clear Glass', unit: 'sq.ft',
        materialCost: 750.00, labourCost: 220.00, defaultRate: 250.00, status: 'Active', notes: 'Grade A safety toughened glass',
        brands: {
          'Alumex': { materialCost: 750.00, labourCost: 220.00, defaultRate: 250.00 },
          'SwissTek': { materialCost: 750.00, labourCost: 220.00, defaultRate: 250.00 }
        }
      },
      {
        id: 'PRC-GLS-004', category: 'Glass Master Catalog', productName: '12mm Toughened Clear Glass', unit: 'sq.ft',
        materialCost: 1450.00, labourCost: 420.00, defaultRate: 480.00, status: 'Active', notes: 'Frameless partition & door grade glass',
        brands: {
          'Alumex': { materialCost: 1450.00, labourCost: 420.00, defaultRate: 480.00 },
          'SwissTek': { materialCost: 1450.00, labourCost: 420.00, defaultRate: 480.00 }
        }
      }
    ];

    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach(item => {
            if (!item.brands) {
              const mat = parseFloat(item.materialCost) || 0;
              const lab = parseFloat(item.labourCost) || 0;
              const def = parseFloat(item.defaultRate) || 0;
              item.brands = {
                'Alumex': { materialCost: mat, labourCost: lab, defaultRate: def },
                'SwissTek': { materialCost: round2(mat * 0.95), labourCost: round2(lab * 0.95), defaultRate: round2(def * 0.95) }
              };
            }
          });
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse stored price list:', e);
      }
    }

    localStorage.setItem(this.storageKey, JSON.stringify(defaultPrices));
    return defaultPrices;
  }

  savePrices() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  calculateTotalRate(item, brandName = 'Alumex') {
    if (item.brands && item.brands[brandName]) {
      const b = item.brands[brandName];
      return (parseFloat(b.materialCost) || 0) + (parseFloat(b.labourCost) || 0) + (parseFloat(b.defaultRate) || 0);
    }
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
      ? sqftItems.reduce((acc, curr) => acc + this.calculateTotalRate(curr, 'Alumex'), 0) / sqftItems.length
      : 0;

    container.innerHTML = `
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0 font-bold" style="color: var(--color-brand-charcoal);">Price Master Database</h2>
          <p class="text-muted small mb-0">Multi-Brand Aluminium Profile & Glass Standard Rate Cards (Alumex & SwissTek)</p>
        </div>
        <div class="btn-group">
          <button class="btn btn-outline-secondary" onclick="window.priceListModule.exportExcel()"><i class="fas fa-file-excel me-1"></i> Export Rate Card</button>
          <button class="btn btn-primary" onclick="window.priceListModule.showAddModal()"><i class="fas fa-plus me-1"></i> Add Product Rate</button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px;">
        <div class="stat-card" style="background:white;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid #E2E8F0;">
          <div style="font-size:13px;color:#64748B;font-weight:500;">Master Products</div>
          <div style="font-size:28px;font-weight:700;color:#0F172A;margin-top:4px;">${totalCount}</div>
        </div>
        <div class="stat-card" style="background:white;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid #E2E8F0;">
          <div style="font-size:13px;color:#64748B;font-weight:500;">Active Rates</div>
          <div style="font-size:28px;font-weight:700;color:#10B981;margin-top:4px;">${activeCount}</div>
        </div>
        <div class="stat-card" style="background:white;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid #E2E8F0;">
          <div style="font-size:13px;color:#64748B;font-weight:500;">Avg Alumex Sq.Ft Rate</div>
          <div style="font-size:24px;font-weight:700;color:#2563EB;margin-top:4px;">LKR ${avgSqftRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div class="stat-card" style="background:white;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid #E2E8F0;">
          <div style="font-size:13px;color:#64748B;font-weight:500;">Supported Brands</div>
          <div style="font-size:24px;font-weight:700;color:#8B5CF6;margin-top:4px;">Alumex & SwissTek</div>
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
                <th style="padding:14px 18px;">Product Name & Spec</th>
                <th style="padding:14px 18px;">Category</th>
                <th style="padding:14px 18px;">Unit</th>
                <th style="padding:14px 18px;text-align:right;">Alumex Rate</th>
                <th style="padding:14px 18px;text-align:right;">SwissTek Rate</th>
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
      return `<tr><td colspan="8" style="padding:30px;text-align:center;color:#64748B;">No pricing items found.</td></tr>`;
    }

    return itemsList.map(item => {
      const alumexTot = this.calculateTotalRate(item, 'Alumex');
      const swisstekTot = this.calculateTotalRate(item, 'SwissTek');

      return `
        <tr style="border-bottom:1px solid #F1F5F9;transition:background 0.15s;" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background='white'">
          <td style="padding:14px 18px;font-weight:600;color:#2563EB;">${item.id}</td>
          <td style="padding:14px 18px;font-weight:600;color:#0F172A;">
            ${item.productName}
            ${item.notes ? `<div style="font-size:12px;color:#64748B;font-weight:400;margin-top:2px;">${item.notes}</div>` : ''}
          </td>
          <td style="padding:14px 18px;color:#475569;"><span style="background:#F1F5F9;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:500;">${item.category}</span></td>
          <td style="padding:14px 18px;color:#475569;font-weight:500;">${item.unit}</td>
          <td style="padding:14px 18px;text-align:right;font-weight:700;color:#2563EB;">
            <span style="background:#EFF6FF;color:#1D4ED8;padding:4px 10px;border-radius:6px;border:1px solid #BFDBFE;">
              LKR ${alumexTot.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </td>
          <td style="padding:14px 18px;text-align:right;font-weight:700;color:#059669;">
            <span style="background:#ECFDF5;color:#059669;padding:4px 10px;border-radius:6px;border:1px solid #A7F3D0;">
              LKR ${swisstekTot.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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

    const alumex = (item && item.brands && item.brands['Alumex']) || { materialCost: item ? item.materialCost : 0, labourCost: item ? item.labourCost : 0, defaultRate: item ? item.defaultRate : 0 };
    const swisstek = (item && item.brands && item.brands['SwissTek']) || { materialCost: item ? Math.round(item.materialCost * 0.95) : 0, labourCost: item ? Math.round(item.labourCost * 0.95) : 0, defaultRate: item ? Math.round(item.defaultRate * 0.95) : 0 };

    modal = document.createElement('div');
    modal.id = modalId;
    modal.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,0.6);
      display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;
    `;

    modal.innerHTML = `
      <div style="background:white;border-radius:16px;max-width:620px;width:100%;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);overflow:hidden;">
        <div style="padding:20px 24px;background:#F8FAFC;border-bottom:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center;">
          <h3 style="margin:0;font-size:18px;font-weight:700;color:#0F172A;">${isEdit ? 'Edit Multi-Brand Rate' : 'Add New Multi-Brand Rate'}</h3>
          <button onclick="document.getElementById('${modalId}').remove()" style="background:none;border:none;cursor:pointer;color:#64748B;">
            <i data-lucide="x" style="width:20px;height:20px;"></i>
          </button>
        </div>
        <form id="priceModalForm" style="padding:24px;max-height:80vh;overflow-y:auto;">
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

          <!-- Alumex Brand Pricing -->
          <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:14px;margin-bottom:16px;">
            <h5 style="margin:0 0 10px 0;font-size:13px;font-weight:700;color:#1E40AF;">Alumex Brand Rates (LKR)</h5>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#3B82F6;">Material Cost</label>
                <input type="number" step="0.01" id="modalAlumexMaterial" required value="${alumex.materialCost}" oninput="window.priceListModule.updateModalTotal()" style="width:100%;padding:8px 10px;border:1px solid #93C5FD;border-radius:6px;font-size:13px;" />
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#3B82F6;">Labour Cost</label>
                <input type="number" step="0.01" id="modalAlumexLabour" required value="${alumex.labourCost}" oninput="window.priceListModule.updateModalTotal()" style="width:100%;padding:8px 10px;border:1px solid #93C5FD;border-radius:6px;font-size:13px;" />
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#3B82F6;">Profit Rate</label>
                <input type="number" step="0.01" id="modalAlumexDefault" required value="${alumex.defaultRate}" oninput="window.priceListModule.updateModalTotal()" style="width:100%;padding:8px 10px;border:1px solid #93C5FD;border-radius:6px;font-size:13px;" />
              </div>
            </div>
          </div>

          <!-- SwissTek Brand Pricing -->
          <div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:10px;padding:14px;margin-bottom:16px;">
            <h5 style="margin:0 0 10px 0;font-size:13px;font-weight:700;color:#065F46;">SwissTek Brand Rates (LKR)</h5>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#10B981;">Material Cost</label>
                <input type="number" step="0.01" id="modalSwissMaterial" required value="${swisstek.materialCost}" oninput="window.priceListModule.updateModalTotal()" style="width:100%;padding:8px 10px;border:1px solid #6EE7B7;border-radius:6px;font-size:13px;" />
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#10B981;">Labour Cost</label>
                <input type="number" step="0.01" id="modalSwissLabour" required value="${swisstek.labourCost}" oninput="window.priceListModule.updateModalTotal()" style="width:100%;padding:8px 10px;border:1px solid #6EE7B7;border-radius:6px;font-size:13px;" />
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#10B981;">Profit Rate</label>
                <input type="number" step="0.01" id="modalSwissDefault" required value="${swisstek.defaultRate}" oninput="window.priceListModule.updateModalTotal()" style="width:100%;padding:8px 10px;border:1px solid #6EE7B7;border-radius:6px;font-size:13px;" />
              </div>
            </div>
          </div>

          <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px 16px;border-radius:8px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:600;color:#475569;font-size:13px;">Totals (Alumex / SwissTek):</span>
            <span id="modalTotalDisplay" style="font-weight:700;color:#2563EB;font-size:15px;">LKR 0.00 / LKR 0.00</span>
          </div>

          <div style="margin-bottom:20px;">
            <label style="display:block;font-size:12px;font-weight:600;color:#64748B;margin-bottom:6px;text-transform:uppercase;">Technical Notes / Spec</label>
            <textarea id="modalNotes" rows="2" style="width:100%;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;font-family:inherit;">${item ? (item.notes || '') : ''}</textarea>
          </div>

          <div style="display:flex;gap:12px;justify-content:flex-end;">
            <button type="button" onclick="document.getElementById('${modalId}').remove()" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Multi-Brand Item</button>
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
    const aMat = parseFloat(document.getElementById('modalAlumexMaterial')?.value) || 0;
    const aLab = parseFloat(document.getElementById('modalAlumexLabour')?.value) || 0;
    const aDef = parseFloat(document.getElementById('modalAlumexDefault')?.value) || 0;
    const aTot = aMat + aLab + aDef;

    const sMat = parseFloat(document.getElementById('modalSwissMaterial')?.value) || 0;
    const sLab = parseFloat(document.getElementById('modalSwissLabour')?.value) || 0;
    const sDef = parseFloat(document.getElementById('modalSwissDefault')?.value) || 0;
    const sTot = sMat + sLab + sDef;

    const display = document.getElementById('modalTotalDisplay');
    if (display) {
      display.innerText = `Alumex: LKR ${aTot.toLocaleString('en-US', { minimumFractionDigits: 2 })} | SwissTek: LKR ${sTot.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
  }

  saveModalData(isEdit) {
    const id = document.getElementById('modalItemId').value;
    const category = document.getElementById('modalCategory').value;
    const productName = document.getElementById('modalProductName').value.trim();
    const unit = document.getElementById('modalUnit').value;
    const status = document.getElementById('modalStatus').value;
    const notes = document.getElementById('modalNotes').value.trim();

    const aMat = parseFloat(document.getElementById('modalAlumexMaterial')?.value) || 0;
    const aLab = parseFloat(document.getElementById('modalAlumexLabour')?.value) || 0;
    const aDef = parseFloat(document.getElementById('modalAlumexDefault')?.value) || 0;

    const sMat = parseFloat(document.getElementById('modalSwissMaterial')?.value) || 0;
    const sLab = parseFloat(document.getElementById('modalSwissLabour')?.value) || 0;
    const sDef = parseFloat(document.getElementById('modalSwissDefault')?.value) || 0;

    if (!productName) {
      alert('Please enter a product name.');
      return;
    }

    const newItem = {
      id,
      category,
      productName,
      unit,
      materialCost: aMat,
      labourCost: aLab,
      defaultRate: aDef,
      brands: {
        'Alumex': { materialCost: aMat, labourCost: aLab, defaultRate: aDef },
        'SwissTek': { materialCost: sMat, labourCost: sLab, defaultRate: sDef }
      },
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
