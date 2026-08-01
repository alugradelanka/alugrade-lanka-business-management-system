/**
 * ALUGRADE BMS Utility Functions
 * Reusable helper functions across the application.
 */

const Utils = {
  /**
   * Formats a number as currency.
   */
  formatCurrency(amount, currency = 'LKR') {
    const num = parseFloat(amount);
    if (isNaN(num)) return `${currency} 0.00`;
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: currency
    }).format(num);
  },

  /**
   * Formats a date string.
   */
  formatDate(date, formatStr = window.APP_CONFIG?.dateFormat || 'DD/MM/YYYY') {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return formatStr.replace('DD', day).replace('MM', month).replace('YYYY', year);
  },

  /**
   * Formats date and time.
   */
  formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return `${this.formatDate(d)} ${d.toLocaleTimeString()}`;
  },

  /**
   * Formats relative time (e.g., '2 hours ago').
   */
  formatRelativeTime(date) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const d = new Date(date);
    const diff = (d.getTime() - Date.now()) / 1000;
    
    if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
    if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
    if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    return rtf.format(Math.round(diff / 86400), 'day');
  },

  /**
   * Parses string to date.
   */
  parseDate(dateString) {
    return new Date(dateString);
  },

  /**
   * Calculates area given width and height.
   */
  calculateArea(width, height, unit = 'sqft') {
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h)) return 0;
    return w * h;
  },

  /**
   * Validates email format.
   */
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  /**
   * Validates phone number (Sri Lankan format).
   */
  validatePhone(phone) {
    const re = /^(?:0|94|\+94)?(?:7[0-9]|11|2[134567]|3[12345678]|4[1257]|5[12457]|6[3567]|8[12])[0-9]{7}$/;
    return re.test(phone.replace(/\s+/g, ''));
  },

  /**
   * Sanitizes HTML to prevent XSS.
   */
  sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  },

  /**
   * Debounces a function call.
   */
  debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Throttles a function call.
   */
  throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Deep clones an object.
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Checks if value is empty.
   */
  isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    return false;
  },

  /**
   * Truncates string to length.
   */
  truncate(str, length) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  },

  /**
   * Capitalizes first letter.
   */
  capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Converts string to camelCase.
   */
  toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  },

  /**
   * Formats number with commas.
   */
  formatNumber(n) {
    const num = parseFloat(n);
    if (isNaN(num)) return '0';
    return new Intl.NumberFormat().format(num);
  },

  /**
   * Calculates percentage change.
   */
  percentChange(oldVal, newVal) {
    const o = parseFloat(oldVal);
    const n = parseFloat(newVal);
    if (o === 0) return n === 0 ? 0 : 100;
    return ((n - o) / o) * 100;
  },

  /**
   * Triggers a file download.
   */
  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Converts Blob to Base64.
   */
  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  /**
   * Converts File to Base64.
   */
  fileToBase64(file) {
    return this.blobToBase64(file);
  },

  /**
   * Converts Base64 to Blob.
   */
  base64ToBlob(base64, mime) {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mime });
  },

  /**
   * Gets initials from name.
   */
  getInitials(name) {
    if (!name) return '';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  },

  /**
   * Generates deterministic color from string.
   */
  colorFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  },

  /**
   * Shows a toast notification.
   */
  showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container') || (() => {
      const div = document.createElement('div');
      div.id = 'toast-container';
      div.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;';
      document.body.appendChild(div);
      return div;
    })();

    const toast = document.createElement('div');
    const colors = {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6'
    };
    
    toast.style.cssText = `
      background: ${colors[type] || colors.info};
      color: white;
      padding: 12px 20px;
      margin-top: 10px;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      font-family: sans-serif;
      transition: opacity 0.3s;
    `;
    toast.textContent = message;

    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Shows a confirmation dialog.
   */
  showConfirmDialog(title, message, onConfirm, onCancel) {
    const result = window.confirm(`${title}\n\n${message}`);
    if (result && typeof onConfirm === 'function') onConfirm();
    else if (!result && typeof onCancel === 'function') onCancel();
  },

  /**
   * Shows loading overlay on container.
   */
  showLoading(container) {
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    if (el) {
      el.style.position = 'relative';
      const loader = document.createElement('div');
      loader.className = 'loader-overlay';
      loader.innerHTML = '<div class="spinner">Loading...</div>';
      loader.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;z-index:10;';
      el.appendChild(loader);
    }
  },

  /**
   * Hides loading overlay.
   */
  hideLoading(container) {
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    if (el) {
      const loader = el.querySelector('.loader-overlay');
      if (loader) loader.remove();
    }
  },

  /**
   * Gets color for status string.
   */
  getStatusColor(status) {
    const map = {
      'active': 'success',
      'inactive': 'warning',
      'pending': 'warning',
      'completed': 'success',
      'delivered': 'info',
      'cancelled': 'danger'
    };
    return map[status.toLowerCase()] || 'primary';
  },

  /**
   * Gets icon class for status.
   */
  getStatusIcon(status) {
    const map = {
      'active': 'fa-check-circle',
      'inactive': 'fa-times-circle',
      'pending': 'fa-clock',
      'completed': 'fa-check',
      'delivered': 'fa-truck'
    };
    return map[status.toLowerCase()] || 'fa-info-circle';
  },

  /**
   * Prints an element by ID.
   */
  printElement(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head><title>Print</title></head>
        <body>${el.outerHTML}</body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
  },

  /**
   * Copies text to clipboard.
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Copied to clipboard', 'success');
    } catch (err) {
      this.showToast('Failed to copy', 'error');
    }
  },

  /**
   * Formats file size bytes to readable string.
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Checks if file is a valid image.
   */
  isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return file && validTypes.includes(file.type);
  },

  /**
   * Calculates age in days from date.
   */
  calculateAge(date) {
    const d = new Date(date);
    return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  },

  /**
   * Adds days to a date.
   */
  addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  /**
   * Returns start of month for date.
   */
  startOfMonth(date) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  },

  /**
   * Returns end of month for date.
   */
  endOfMonth(date) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  },

  /**
   * Checks if two dates are same day.
   */
  isSameDay(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  },

  /**
   * Checks if delivery date is overdue.
   */
  isOverdue(deliveryDate) {
    if (!deliveryDate) return false;
    const d = new Date(deliveryDate);
    // Overdue if today is strictly after the delivery date
    d.setHours(23, 59, 59, 999);
    return Date.now() > d.getTime();
  },

  /**
   * Days until a specific date.
   */
  daysUntil(date) {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }
};

window.Utils = Utils;
