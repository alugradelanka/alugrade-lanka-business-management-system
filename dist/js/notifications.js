const NOTIFICATION_TYPES = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
    LOW_STOCK: 'LOW_STOCK',
    OVERDUE_DELIVERY: 'OVERDUE_DELIVERY',
    OVERDUE_PAYMENT: 'OVERDUE_PAYMENT',
    PRODUCTION_DELAY: 'PRODUCTION_DELAY',
    NEW_ORDER: 'NEW_ORDER',
    PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
    SYSTEM_ALERT: 'SYSTEM_ALERT'
};

class NotificationService {
    constructor(db) {
        this.db = db;
    }

    async createNotification(type, title, message, relatedId = null, relatedType = null) {
        const notif = {
            id: Date.now().toString(),
            type,
            title,
            message,
            relatedId,
            relatedType,
            isRead: false,
            createdAt: new Date().toISOString()
        };
        // await this.db.notifications.add(notif);
        this.showToastNotification(type, title, message);
        this.updateBellBadge();
        return notif;
    }

    async getUnreadCount() {
        // const notifs = await this.db.notifications.where({isRead: false}).toArray();
        // return notifs.length;
        return 0; // placeholder
    }

    async getAll(limit = 50) {
        // return await this.db.notifications.orderBy('createdAt').reverse().limit(limit).toArray();
        return []; // placeholder
    }

    async markAsRead(id) {
        // await this.db.notifications.update(id, {isRead: true});
        this.updateBellBadge();
    }

    async markAllAsRead() {
        // const unread = await this.db.notifications.where({isRead: false}).toArray();
        // for (let n of unread) {
        //     await this.db.notifications.update(n.id, {isRead: true});
        // }
        this.updateBellBadge();
    }

    async delete(id) {
        // await this.db.notifications.delete(id);
    }

    renderNotificationItem(notification) {
        const iconMap = {
            [NOTIFICATION_TYPES.INFO]: 'info',
            [NOTIFICATION_TYPES.WARNING]: 'alert-triangle',
            [NOTIFICATION_TYPES.ERROR]: 'alert-circle',
            [NOTIFICATION_TYPES.SUCCESS]: 'check-circle'
        };
        const icon = iconMap[notification.type] || 'bell';
        
        return `
            <div class="notification-item ${notification.isRead ? '' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon">
                    <i data-lucide="${icon}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${new Date(notification.createdAt).toLocaleString()}</span>
                </div>
            </div>
        `;
    }

    async updateBellBadge() {
        const count = await this.getUnreadCount();
        const badge = document.getElementById('bell-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }

    showToastNotification(type, title, message) {
        const toastContainer = document.getElementById('toast-container') || (() => {
            const el = document.createElement('div');
            el.id = 'toast-container';
            el.className = 'toast-container';
            document.body.appendChild(el);
            return el;
        })();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type.toLowerCase()}`;
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="mr-auto">${title}</strong>
                <button type="button" class="ml-2 mb-1 close" onclick="this.parentElement.parentElement.remove()">
                    <span>&times;</span>
                </button>
            </div>
            <div class="toast-body">${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        setTimeout(() => {
            if(toast.parentElement) toast.remove();
        }, 5000);
    }

    async checkOverdueDeliveries() {
        // placeholder
    }

    async checkLowStock() {
        // placeholder
    }

    async checkOverduePayments() {
        // placeholder
    }

    async checkProductionDelays() {
        // placeholder
    }
}

window.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
window.NotificationService = NotificationService;
