/**
 * ExpenseModule - Manages expenses for ALUGRADE BMS
 */
class ExpenseModule {
  constructor(db, eventsManager) {
    this.db = db || window.DB;
    this.events = eventsManager || window.Events;
    this.container = null;
    
    this.categories = [
      'Salaries', 'Aluminium Purchase', 'Glass Purchase', 'Accessories', 
      'Fuel', 'Electricity', 'Internet', 'Office Supplies', 'Transport', 
      'Equipment', 'Maintenance', 'Marketing', 'Other'
    ];
  }

  async render() {
    this.container = document.getElementById('pageContent') || document.getElementById('mainContent') || document.getElementById('main-content');
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="page-header">
        <h2>Expense Management</h2>
        <div class="actions">
          <button class="btn btn-primary" id="btn-add-expense">
            <i class="icon-plus"></i> Add Expense
          </button>
        </div>
      </div>
      
      <div class="summary-cards" id="expense-summary">
        <div class="card summary-card"><div class="card-body"><h5 class="card-title">Total This Month</h5><h3 id="summary-month">Loading...</h3></div></div>
        <div class="card summary-card"><div class="card-body"><h5 class="card-title">By Category</h5><h3 id="summary-category">Loading...</h3></div></div>
        <div class="card summary-card"><div class="card-body"><h5 class="card-title">Total This Year</h5><h3 id="summary-year">Loading...</h3></div></div>
      </div>

      <div class="filters-section mt-4">
        <div class="row">
          <div class="col-md-3">
            <select class="form-control" id="filter-category">
              <option value="All">All Categories</option>
              ${this.categories.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-control" id="filter-date">
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="ThisWeek">This Week</option>
              <option value="ThisMonth">This Month</option>
              <option value="Custom">Custom Range</option>
            </select>
          </div>
          <div class="col-md-4">
            <input type="text" class="form-control" id="search-expense" placeholder="Search description, supplier...">
          </div>
          <div class="col-md-2">
            <div class="btn-group w-100">
              <button class="btn btn-outline-secondary" id="btn-export-pdf"><i class="icon-file-text"></i> PDF</button>
              <button class="btn btn-outline-secondary" id="btn-export-excel"><i class="icon-file"></i> Excel</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-4">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Expense ID</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Supplier</th>
                  <th>Amount (LKR)</th>
                  <th>Payment Method</th>
                  <th>Receipt #</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="expenses-table-body">
                <tr><td colspan="9" class="text-center">Loading expenses...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-add-expense').addEventListener('click', () => this.renderNewForm());
    document.getElementById('btn-export-pdf').addEventListener('click', () => this.exportPDF());
    document.getElementById('btn-export-excel').addEventListener('click', () => this.exportExcel());
    
    // Listeners for filters
    document.getElementById('filter-category').addEventListener('change', () => this.loadExpensesTable());
    document.getElementById('filter-date').addEventListener('change', () => this.loadExpensesTable());
    document.getElementById('search-expense').addEventListener('input', (e) => {
      // Debounce would be ideal here
      setTimeout(() => this.loadExpensesTable(), 300);
    });

    await this.updateSummaries();
    await this.loadExpensesTable();
  }
  
  async updateSummaries() {
    try {
      const db = this.db || window.DB;
      if(!db) return;
      // In a real app, calculate actual sums
      document.getElementById('summary-month').innerText = 'LKR 0.00';
      document.getElementById('summary-category').innerText = 'LKR 0.00';
      document.getElementById('summary-year').innerText = 'LKR 0.00';
    } catch(e) {
      console.error(e);
    }
  }

  async loadExpensesTable() {
    const tbody = document.getElementById('expenses-table-body');
    if (!tbody) return;
    try {
      const db = this.db || window.DB;
      const expenses = (await db.getAll('expenses')) || [];
      const catFilter = document.getElementById('filter-category').value;
      const search = document.getElementById('search-expense').value.toLowerCase();
      
      let filtered = expenses;
      if(catFilter !== 'All') {
        filtered = filtered.filter(e => e.category === catFilter);
      }
      if(search) {
        filtered = filtered.filter(e => 
          (e.description && e.description.toLowerCase().includes(search)) ||
          (e.supplier && e.supplier.toLowerCase().includes(search))
        );
      }
      
      if(filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No expenses found</td></tr>';
        return;
      }
      
      tbody.innerHTML = filtered.map(e => `
        <tr>
          <td>${e.id}</td>
          <td>${e.date}</td>
          <td><span class="badge badge-info">${e.category}</span></td>
          <td>${e.description}</td>
          <td>${e.supplier || '-'}</td>
          <td class="text-right">${Number(e.amount).toFixed(2)}</td>
          <td>${e.paymentMethod}</td>
          <td>${e.receiptNumber || '-'}</td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-info btn-view" data-id="${e.id}"><i class="icon-eye"></i></button>
              <button class="btn btn-warning btn-edit" data-id="${e.id}"><i class="icon-edit"></i></button>
              <button class="btn btn-danger btn-delete" data-id="${e.id}"><i class="icon-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
      
      tbody.querySelectorAll('.btn-view').forEach(b => b.addEventListener('click', (e) => this.renderDetail(e.currentTarget.dataset.id)));
      tbody.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', (e) => this.renderEditForm(e.currentTarget.dataset.id)));
      tbody.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', (e) => this.delete(e.currentTarget.dataset.id)));
      
    } catch (e) {
      console.error(e);
      tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Error loading expenses</td></tr>';
    }
  }

  async renderNewForm() {
    const today = new Date().toISOString().split('T')[0];
    const generatedId = 'EXP-' + Date.now();

    this.container.innerHTML = `
      <div class="page-header">
        <h2>Add Expense</h2>
        <button class="btn btn-outline-secondary" id="btn-back">Back to Expenses</button>
      </div>
      
      <div class="card mt-4">
        <div class="card-body">
          <form id="expense-form">
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Expense ID</label>
                <input type="text" class="form-control" name="id" value="${generatedId}" readonly>
              </div>
              <div class="col-md-6 form-group">
                <label>Date *</label>
                <input type="date" class="form-control" name="date" value="${today}" required>
              </div>
            </div>
            
            <div class="row mt-3">
              <div class="col-md-6 form-group">
                <label>Category *</label>
                <select class="form-control" name="category" required>
                  <option value="">Select Category...</option>
                  ${this.categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
              </div>
              <div class="col-md-6 form-group">
                <label>Supplier</label>
                <input type="text" class="form-control" name="supplier">
              </div>
            </div>
            
            <div class="form-group mt-3">
              <label>Description *</label>
              <textarea class="form-control" name="description" rows="2" required></textarea>
            </div>
            
            <div class="row mt-3">
              <div class="col-md-4 form-group">
                <label>Amount (LKR) *</label>
                <input type="number" step="0.01" min="0" class="form-control" name="amount" required>
              </div>
              <div class="col-md-4 form-group">
                <label>Payment Method</label>
                <select class="form-control" name="paymentMethod">
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Card">Card</option>
                </select>
              </div>
              <div class="col-md-4 form-group">
                <label>Receipt Number</label>
                <input type="text" class="form-control" name="receiptNumber">
              </div>
            </div>
            
            <div class="form-group mt-3">
              <label>Notes</label>
              <textarea class="form-control" name="notes" rows="3"></textarea>
            </div>
            
            <div class="mt-4 form-actions">
              <button type="submit" class="btn btn-primary">Save Expense</button>
              <button type="button" class="btn btn-secondary" id="btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('btn-back').addEventListener('click', () => this.render());
    document.getElementById('btn-cancel').addEventListener('click', () => this.render());
    
    document.getElementById('expense-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      data.amount = parseFloat(data.amount);
      await this.save(data);
    });
  }

  async renderDetail(id) {
    const db = this.db || window.DB;
    const expense = await db.get('expenses', id);
    if (!expense) return alert('Expense not found');
    
    this.container.innerHTML = `
      <div class="page-header">
        <h2>Expense Details: ${expense.id}</h2>
        <div class="actions">
          <button class="btn btn-warning" id="btn-edit"><i class="icon-edit"></i> Edit</button>
          <button class="btn btn-outline-secondary" id="btn-back">Back</button>
        </div>
      </div>
      
      <div class="card mt-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <table class="table table-borderless">
                <tr><th>Date:</th><td>${expense.date}</td></tr>
                <tr><th>Category:</th><td>${expense.category}</td></tr>
                <tr><th>Description:</th><td>${expense.description}</td></tr>
                <tr><th>Supplier:</th><td>${expense.supplier || '-'}</td></tr>
              </table>
            </div>
            <div class="col-md-6">
              <table class="table table-borderless">
                <tr><th>Amount:</th><td><h4>LKR ${Number(expense.amount).toFixed(2)}</h4></td></tr>
                <tr><th>Payment Method:</th><td>${expense.paymentMethod}</td></tr>
                <tr><th>Receipt #:</th><td>${expense.receiptNumber || '-'}</td></tr>
              </table>
            </div>
          </div>
          ${expense.notes ? `<div class="mt-3"><strong>Notes:</strong><p>${expense.notes}</p></div>` : ''}
        </div>
      </div>
    `;

    document.getElementById('btn-back').addEventListener('click', () => this.render());
    document.getElementById('btn-edit').addEventListener('click', () => this.renderEditForm(id));
  }

  async renderEditForm(id) {
    const db = this.db || window.DB;
    const expense = await db.get('expenses', id);
    if (!expense) return alert('Expense not found');

    this.container.innerHTML = `
      <div class="page-header">
        <h2>Edit Expense</h2>
        <button class="btn btn-outline-secondary" id="btn-back">Cancel</button>
      </div>
      
      <div class="card mt-4">
        <div class="card-body">
          <form id="expense-form">
            <input type="hidden" name="id" value="${expense.id}">
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Date *</label>
                <input type="date" class="form-control" name="date" value="${expense.date}" required>
              </div>
              <div class="col-md-6 form-group">
                <label>Category *</label>
                <select class="form-control" name="category" required>
                  ${this.categories.map(c => `<option value="${c}" ${c === expense.category ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
              </div>
            </div>
            
            <div class="row mt-3">
              <div class="col-md-12 form-group">
                <label>Description *</label>
                <textarea class="form-control" name="description" rows="2" required>${expense.description}</textarea>
              </div>
            </div>
            
            <div class="row mt-3">
              <div class="col-md-6 form-group">
                <label>Supplier</label>
                <input type="text" class="form-control" name="supplier" value="${expense.supplier || ''}">
              </div>
              <div class="col-md-6 form-group">
                <label>Amount (LKR) *</label>
                <input type="number" step="0.01" min="0" class="form-control" name="amount" value="${expense.amount}" required>
              </div>
            </div>
            
            <div class="row mt-3">
              <div class="col-md-6 form-group">
                <label>Payment Method</label>
                <select class="form-control" name="paymentMethod">
                  <option value="Cash" ${expense.paymentMethod === 'Cash' ? 'selected' : ''}>Cash</option>
                  <option value="Bank Transfer" ${expense.paymentMethod === 'Bank Transfer' ? 'selected' : ''}>Bank Transfer</option>
                  <option value="Cheque" ${expense.paymentMethod === 'Cheque' ? 'selected' : ''}>Cheque</option>
                  <option value="Card" ${expense.paymentMethod === 'Card' ? 'selected' : ''}>Card</option>
                </select>
              </div>
              <div class="col-md-6 form-group">
                <label>Receipt Number</label>
                <input type="text" class="form-control" name="receiptNumber" value="${expense.receiptNumber || ''}">
              </div>
            </div>
            
            <div class="form-group mt-3">
              <label>Notes</label>
              <textarea class="form-control" name="notes" rows="3">${expense.notes || ''}</textarea>
            </div>
            
            <div class="mt-4 form-actions">
              <button type="submit" class="btn btn-primary">Update Expense</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('btn-back').addEventListener('click', () => this.render());
    
    document.getElementById('expense-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      data.amount = parseFloat(data.amount);
      data.updatedAt = new Date().toISOString();
      await this.save(data);
    });
  }

  async save(expenseData) {
    try {
      const db = this.db || window.DB;
      const events = this.events || window.Events;
      await db.put('expenses', expenseData);
      if (events) {
        events.emit('EXPENSE_ADDED', expenseData);
      }
      alert('Expense saved successfully!');
      this.render();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense.');
    }
  }

  async delete(id) {
    if(confirm('Are you sure you want to delete this expense?')) {
      try {
        const db = this.db || window.DB;
        await db.delete('expenses', id);
        this.loadExpensesTable();
        this.updateSummaries();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense.');
      }
    }
  }

  async getMonthlyTotal(month, year) {
    const db = this.db || window.DB;
    const expenses = (await db.getAll('expenses')) || [];
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    }).reduce((sum, e) => sum + e.amount, 0);
  }

  async getByCategory(category, fromDate, toDate) {
    const db = this.db || window.DB;
    const expenses = (await db.getAll('expenses')) || [];
    return expenses.filter(e => {
      const matchCat = e.category === category;
      const matchFrom = fromDate ? new Date(e.date) >= new Date(fromDate) : true;
      const matchTo = toDate ? new Date(e.date) <= new Date(toDate) : true;
      return matchCat && matchFrom && matchTo;
    });
  }

  async calculateProfitMetrics() {
    try {
      const db = this.db || window.DB;
      const sales = (await db.getAll('orders')) || [];
      const expenses = (await db.getAll('expenses')) || [];
      
      const totalSales = sales.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      const grossProfit = totalSales - totalExpenses; // Simplified
      const netProfit = grossProfit; // Simplified
      const outstanding = sales.reduce((sum, o) => sum + ((Number(o.totalAmount) || 0) - (Number(o.advancePayment) || 0)), 0);
      
      return { totalSales, totalExpenses, grossProfit, netProfit, outstanding };
    } catch (e) {
      console.error(e);
      return { totalSales: 0, totalExpenses: 0, grossProfit: 0, netProfit: 0, outstanding: 0 };
    }
  }

  exportPDF() {
    alert('PDF Export functionality will be generated here.');
    // implementation for PDF export with category breakdown
  }

  exportExcel() {
    alert('Excel Export functionality will be generated here.');
    // implementation for Excel export
  }

  printReport(dateRange) {
    window.print();
  }
}

window.ExpenseModule = ExpenseModule;

