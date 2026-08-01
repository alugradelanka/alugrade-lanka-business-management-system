/**
 * ALUGRADE BMS Event Bus
 * Facilitates cross-module communication via publish/subscribe.
 */

const EVENTS = {
  // Auth
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',

  // Order
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_UPDATED: 'ORDER_UPDATED',
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  ORDER_DELETED: 'ORDER_DELETED',

  // Quotation
  QUOTATION_CREATED: 'QUOTATION_CREATED',
  QUOTATION_UPDATED: 'QUOTATION_UPDATED',
  QUOTATION_ACCEPTED: 'QUOTATION_ACCEPTED',

  // Invoice & Payment
  INVOICE_CREATED: 'INVOICE_CREATED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  
  // Customer
  CUSTOMER_CREATED: 'CUSTOMER_CREATED',
  CUSTOMER_UPDATED: 'CUSTOMER_UPDATED',
  CUSTOMER_DELETED: 'CUSTOMER_DELETED',

  // Inventory
  INVENTORY_UPDATED: 'INVENTORY_UPDATED',
  INVENTORY_LOW_STOCK: 'INVENTORY_LOW_STOCK',
  
  // App
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
  DATA_REFRESH_REQUIRED: 'DATA_REFRESH_REQUIRED'
};

class EventBus {
  constructor() {
    this.listeners = {};
    this.EVENTS = EVENTS;
  }

  /**
   * Subscribes to an event.
   */
  on(event, listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
    
    // Return unsubscribe function
    return () => this.off(event, listener);
  }

  /**
   * Unsubscribes from an event.
   */
  off(event, listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  /**
   * Subscribes to an event to be executed only once.
   */
  once(event, listener) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener(...args);
    };
    this.on(event, onceWrapper);
  }

  /**
   * Emits an event with optional data payload.
   */
  emit(event, data = null) {
    if (!this.listeners[event]) return;
    
    // Execute listeners asynchronously to prevent blocking
    this.listeners[event].forEach(listener => {
      setTimeout(() => {
        try {
          listener(data);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      }, 0);
    });

    // Automatically trigger a generic data refresh if it's a data mutation event
    if (event !== EVENTS.DATA_REFRESH_REQUIRED && 
       (event.includes('_CREATED') || event.includes('_UPDATED') || event.includes('_DELETED') || event.includes('_RECEIVED') || event.includes('_CHANGED'))) {
      this.emit(EVENTS.DATA_REFRESH_REQUIRED, { sourceEvent: event });
    }
  }
}

// Global instance
window.Events = new EventBus();
