/**
 * ALUGRADE BMS Database Layer
 * IndexedDB wrapper for application data persistence.
 */

class Database {
  constructor() {
    this.dbName = 'AlugradeDB';
    this.dbVersion = 1;
    this.db = null;
  }

  /**
   * Initializes the database, creating object stores and indexes.
   */
  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('Database error:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this._seedData().then(() => resolve(this.db)).catch(reject);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // users
        if (!db.objectStoreNames.contains('users')) {
          const store = db.createObjectStore('users', { keyPath: 'id' });
          store.createIndex('email', 'email', { unique: true });
          store.createIndex('role', 'role', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }

        // customers
        if (!db.objectStoreNames.contains('customers')) {
          const store = db.createObjectStore('customers', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('phone', 'phone', { unique: false });
          store.createIndex('customerId', 'customerId', { unique: true });
          store.createIndex('city', 'city', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }

        // orders
        if (!db.objectStoreNames.contains('orders')) {
          const store = db.createObjectStore('orders', { keyPath: 'id' });
          store.createIndex('orderNumber', 'orderNumber', { unique: true });
          store.createIndex('customerId', 'customerId', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('deliveryDate', 'deliveryDate', { unique: false });
          store.createIndex('productionStatus', 'productionStatus', { unique: false });
          store.createIndex('paymentStatus', 'paymentStatus', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // orderItems
        if (!db.objectStoreNames.contains('orderItems')) {
          const store = db.createObjectStore('orderItems', { keyPath: 'id' });
          store.createIndex('orderId', 'orderId', { unique: false });
        }

        // quotations
        if (!db.objectStoreNames.contains('quotations')) {
          const store = db.createObjectStore('quotations', { keyPath: 'id' });
          store.createIndex('quotationNumber', 'quotationNumber', { unique: true });
          store.createIndex('customerId', 'customerId', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // quotationItems
        if (!db.objectStoreNames.contains('quotationItems')) {
          const store = db.createObjectStore('quotationItems', { keyPath: 'id' });
          store.createIndex('quotationId', 'quotationId', { unique: false });
        }

        // invoices
        if (!db.objectStoreNames.contains('invoices')) {
          const store = db.createObjectStore('invoices', { keyPath: 'id' });
          store.createIndex('invoiceNumber', 'invoiceNumber', { unique: true });
          store.createIndex('customerId', 'customerId', { unique: false });
          store.createIndex('orderId', 'orderId', { unique: false });
          store.createIndex('paymentStatus', 'paymentStatus', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // invoiceItems
        if (!db.objectStoreNames.contains('invoiceItems')) {
          const store = db.createObjectStore('invoiceItems', { keyPath: 'id' });
          store.createIndex('invoiceId', 'invoiceId', { unique: false });
        }

        // payments
        if (!db.objectStoreNames.contains('payments')) {
          const store = db.createObjectStore('payments', { keyPath: 'id' });
          store.createIndex('paymentId', 'paymentId', { unique: true });
          store.createIndex('customerId', 'customerId', { unique: false });
          store.createIndex('orderId', 'orderId', { unique: false });
          store.createIndex('invoiceId', 'invoiceId', { unique: false });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('method', 'method', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }

        // expenses
        if (!db.objectStoreNames.contains('expenses')) {
          const store = db.createObjectStore('expenses', { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }

        // inventory
        if (!db.objectStoreNames.contains('inventory')) {
          const store = db.createObjectStore('inventory', { keyPath: 'id' });
          store.createIndex('itemId', 'itemId', { unique: true });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('supplier', 'supplier', { unique: false });
          store.createIndex('barcode', 'barcode', { unique: false });
        }

        // inventoryTransactions
        if (!db.objectStoreNames.contains('inventoryTransactions')) {
          const store = db.createObjectStore('inventoryTransactions', { keyPath: 'id' });
          store.createIndex('inventoryId', 'inventoryId', { unique: false });
          store.createIndex('orderId', 'orderId', { unique: false });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('date', 'date', { unique: false });
        }

        // suppliers
        if (!db.objectStoreNames.contains('suppliers')) {
          const store = db.createObjectStore('suppliers', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }

        // employees
        if (!db.objectStoreNames.contains('employees')) {
          const store = db.createObjectStore('employees', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('role', 'role', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }

        // productionTracking
        if (!db.objectStoreNames.contains('productionTracking')) {
          const store = db.createObjectStore('productionTracking', { keyPath: 'id' });
          store.createIndex('orderId', 'orderId', { unique: false });
          store.createIndex('stage', 'stage', { unique: false });
          store.createIndex('assignedEmployee', 'assignedEmployee', { unique: false });
        }

        // deliveries
        if (!db.objectStoreNames.contains('deliveries')) {
          const store = db.createObjectStore('deliveries', { keyPath: 'id' });
          store.createIndex('deliveryNumber', 'deliveryNumber', { unique: true });
          store.createIndex('orderId', 'orderId', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('deliveryDate', 'deliveryDate', { unique: false });
        }

        // notifications
        if (!db.objectStoreNames.contains('notifications')) {
          const store = db.createObjectStore('notifications', { keyPath: 'id' });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('isRead', 'isRead', { unique: false });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // activityLogs
        if (!db.objectStoreNames.contains('activityLogs')) {
          const store = db.createObjectStore('activityLogs', { keyPath: 'id' });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('action', 'action', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // appSettings
        if (!db.objectStoreNames.contains('appSettings')) {
          const store = db.createObjectStore('appSettings', { keyPath: 'key' });
          store.createIndex('key', 'key', { unique: true });
        }

        // roles
        if (!db.objectStoreNames.contains('roles')) {
          const store = db.createObjectStore('roles', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: true });
        }
      };
    });
  }

  /**
   * Helper to ensure db is ready before operations
   */
  _ensureDb() {
    if (!this.db) throw new Error('Database is not initialized. Call init() first.');
  }

  /**
   * Seeds initial data if not present.
   */
  async _seedData() {
    const rolesCount = await this.count('roles');
    if (rolesCount === 0) {
      await this.add('roles', { id: this.generateId('ROLE'), name: 'Super Admin', permissions: ['*'] });
      await this.add('roles', { id: this.generateId('ROLE'), name: 'Admin', permissions: ['manage_users', 'manage_sales', 'manage_inventory', 'view_reports'] });
      await this.add('roles', { id: this.generateId('ROLE'), name: 'Sales Agent', permissions: ['manage_customers', 'manage_sales', 'view_inventory'] });
    }

    const usersCount = await this.count('users');
    if (usersCount === 0) {
      // admin / Admin@1234
      const passwordHash = (window.Auth && typeof window.Auth.hashPassword === 'function' && window.Auth.hashPassword !== Object.prototype.hashPassword)
        ? await window.Auth.hashPassword('Admin@1234')
        : '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
      await this.add('users', {
        id: this.generateId('USER'),
        username: 'admin',
        email: 'admin@alugrade.lk',
        password: passwordHash,
        role: 'Super Admin',
        status: window.STATUS?.USER?.ACTIVE || 'active',
        name: 'System Administrator'
      });
    }

    const settingsCount = await this.count('appSettings');
    if (settingsCount === 0) {
      await this.setSetting('companyName', 'ALUGRADE LANKA FAB & GLASS');
      await this.setSetting('currency', 'LKR');
      await this.setSetting('taxRate', '0');
    }
  }

  /**
   * Adds a record to the specified store. Auto-generates ID if not provided.
   */
  add(storeName, data) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      const record = { ...data };
      if (!record.id) record.id = crypto.randomUUID();
      record.createdAt = new Date().toISOString();
      record.updatedAt = new Date().toISOString();

      const request = store.add(record);

      request.onsuccess = () => resolve(record.id);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Retrieves a record by primary key.
   */
  get(storeName, id) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Retrieves all records from a store.
   */
  getAll(storeName) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Retrieves a single record matching an index.
   */
  getByIndex(storeName, indexName, value) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.get(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Retrieves all records matching an index.
   */
  getAllByIndex(storeName, indexName, value) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Updates an existing record.
   */
  update(storeName, id, data) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        if (!getRequest.result) {
          reject(new Error('Record not found'));
          return;
        }
        
        const updatedRecord = { ...getRequest.result, ...data, updatedAt: new Date().toISOString() };
        const putRequest = store.put(updatedRecord);
        
        putRequest.onsuccess = () => resolve(updatedRecord);
        putRequest.onerror = (e) => reject(e.target.error);
      };
      
      getRequest.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Soft deletes a record by setting status to 'deleted'. Hard delete if hard=true.
   */
  delete(storeName, id, hard = false) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      if (hard) {
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      } else {
        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
          if (!getRequest.result) {
            resolve(true); // already deleted or doesn't exist
            return;
          }
          const record = getRequest.result;
          record.status = 'deleted';
          record.updatedAt = new Date().toISOString();
          const putRequest = store.put(record);
          putRequest.onsuccess = () => resolve(true);
          putRequest.onerror = (e) => reject(e.target.error);
        };
        getRequest.onerror = (e) => reject(e.target.error);
      }
    });
  }

  /**
   * Returns count of records in a store.
   */
  count(storeName) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Searches a store across multiple fields for a term.
   */
  search(storeName, searchTerm, fields) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = request.result || [];
        const lowerTerm = searchTerm.toLowerCase();
        const results = records.filter(record => {
          if (record.status === 'deleted') return false;
          return fields.some(field => {
            const val = record[field];
            return val && String(val).toLowerCase().includes(lowerTerm);
          });
        });
        resolve(results);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Filters a store based on multiple criteria object.
   */
  filter(storeName, filters) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = request.result || [];
        const results = records.filter(record => {
          if (record.status === 'deleted') return false;
          for (const key in filters) {
            if (record[key] !== filters[key]) return false;
          }
          return true;
        });
        resolve(results);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Generates a unique ID with prefix.
   */
  generateId(prefix) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Generates a sequential number for a specific field in a store.
   */
  async generateNumber(prefix, storeName, field) {
    const records = await this.getAll(storeName);
    const datePart = new Date().getFullYear().toString();
    
    let maxSeq = 0;
    records.forEach(r => {
      const val = r[field];
      if (val && val.startsWith(`${prefix}-${datePart}-`)) {
        const seq = parseInt(val.split('-')[2], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    });
    
    const nextSeq = String(maxSeq + 1).padStart(6, '0');
    return `${prefix}-${datePart}-${nextSeq}`;
  }

  /**
   * Exports entire DB to JSON.
   */
  exportAll() {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const stores = Array.from(this.db.objectStoreNames);
      const exportData = {};
      
      const tx = this.db.transaction(stores, 'readonly');
      let completedStores = 0;

      stores.forEach(storeName => {
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => {
          exportData[storeName] = req.result;
          completedStores++;
          if (completedStores === stores.length) {
            resolve(JSON.stringify(exportData));
          }
        };
        req.onerror = () => reject(req.error);
      });
    });
  }

  /**
   * Imports DB from JSON.
   */
  importAll(jsonString) {
    this._ensureDb();
    return new Promise(async (resolve, reject) => {
      try {
        const data = JSON.parse(jsonString);
        const stores = Object.keys(data);
        const tx = this.db.transaction(stores, 'readwrite');
        
        for (const storeName of stores) {
          if (this.db.objectStoreNames.contains(storeName)) {
            const store = tx.objectStore(storeName);
            store.clear();
            for (const item of data[storeName]) {
              store.put(item);
            }
          }
        }
        
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Clears a store entirely.
   */
  clear(storeName) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Gets all app settings.
   */
  getSettings() {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('appSettings', 'readonly');
      const store = tx.objectStore('appSettings');
      const request = store.getAll();

      request.onsuccess = () => {
        const settings = {};
        (request.result || []).forEach(r => {
          settings[r.key] = r.value;
        });
        resolve(settings);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Sets a single setting.
   */
  setSetting(key, value) {
    this._ensureDb();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('appSettings', 'readwrite');
      const store = tx.objectStore('appSettings');
      const request = store.put({ key, value, updatedAt: new Date().toISOString() });

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }
}

// Ensure Auth namespace exists before db loads it for seeding
if (!window.Auth) {
  window.Auth = {
    hashPassword: async (p) => p // dummy until auth.js loads
  };
}

window.DB = new Database();
