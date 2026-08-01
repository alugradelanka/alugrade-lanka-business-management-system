/**
 * ALUGRADE BMS Configuration
 * Core configuration settings and application constants.
 */

const APP_CONFIG = {
  name: 'ALUGRADE LANKA FAB & GLASS',
  shortName: 'ALUGRADE BMS',
  version: '1.0.0',
  buildDate: '2026-07-26',
  currency: { symbol: 'LKR', code: 'LKR', locale: 'en-LK' },
  dateFormat: 'DD/MM/YYYY',
  numberPrefixes: {
    order: 'ORD',
    quotation: 'QT',
    invoice: 'INV',
    payment: 'PAY',
    delivery: 'DEL',
    customer: 'CUST'
  },
  pagination: { defaultPageSize: 50 },
  sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
  lowStockThreshold: 10,
  deliveryAlertDays: 2,
  paymentOverdueDays: 7,
  colors: {
    primary: '#C41230',
    dark: '#1A1A1A',
    glass: '#60A5FA',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6'
  }
};

const PRODUCT_CATEGORIES = [
  'Aluminium Extrusions',
  'Glass Sheets',
  'Tempered Glass',
  'Hardware & Accessories',
  'Sealants & Adhesives',
  'Tools & Equipment',
  'Fabrication Services',
  'Installation Services',
  'Other'
];

const EXPENSE_CATEGORIES = [
  'Material Purchase',
  'Salary & Wages',
  'Transport & Fuel',
  'Utility Bills (Electricity/Water/Internet)',
  'Rent & Lease',
  'Maintenance & Repairs',
  'Marketing & Advertising',
  'Office Supplies',
  'Taxes & Fees',
  'Miscellaneous'
];

const STATUS = {
  USER: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DELETED: 'deleted'
  },
  CUSTOMER: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DELETED: 'deleted'
  },
  ORDER: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PRODUCTION: 'in_production',
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  },
  QUOTATION: {
    DRAFT: 'draft',
    SENT: 'sent',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    EXPIRED: 'expired'
  },
  INVOICE: {
    DRAFT: 'draft',
    ISSUED: 'issued',
    PAID: 'paid',
    PARTIAL: 'partial',
    OVERDUE: 'overdue',
    CANCELLED: 'cancelled'
  },
  PAYMENT: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },
  INVENTORY: {
    IN_STOCK: 'in_stock',
    LOW_STOCK: 'low_stock',
    OUT_OF_STOCK: 'out_of_stock'
  },
  DELIVERY: {
    SCHEDULED: 'scheduled',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    FAILED: 'failed'
  }
};

const PAYMENT_METHODS = [
  'Cash',
  'Bank Transfer',
  'Cheque',
  'Credit Card',
  'Debit Card'
];

const SRI_LANKA_DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya'
];

window.APP_CONFIG = APP_CONFIG;
window.PRODUCT_CATEGORIES = PRODUCT_CATEGORIES;
window.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
window.STATUS = STATUS;
window.PAYMENT_METHODS = PAYMENT_METHODS;
window.SRI_LANKA_DISTRICTS = SRI_LANKA_DISTRICTS;
