/**
 * ALUGRADE BMS Authentication Module
 * Handles login, session management, password hashing, and permissions.
 */

const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_CUSTOMERS: 'manage_customers',
  MANAGE_SALES: 'manage_sales',
  MANAGE_INVENTORY: 'manage_inventory',
  VIEW_REPORTS: 'view_reports',
  MANAGE_SETTINGS: 'manage_settings',
  ALL: '*'
};

const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  SALES_AGENT: 'Sales Agent',
  PRODUCTION_MANAGER: 'Production Manager',
  ACCOUNTANT: 'Accountant'
};

class AuthManager {
  constructor() {
    this.sessionKey = 'alugrade_session';
    this.permissions = PERMISSIONS;
    this.roles = ROLES;
    this._checkTimeout();
  }

  /**
   * Hashes a password using SHA-256 via SubtleCrypto.
   */
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verifies if a password matches the hash.
   */
  async verifyPassword(password, hash) {
    const computedHash = await this.hashPassword(password);
    return computedHash === hash;
  }

  /**
   * Authenticates user and creates session.
   */
  async login(emailOrUsername, password, rememberMe = false) {
    try {
      let users = await window.DB.getAll('users');
      const user = users.find(u => (u.email === emailOrUsername || u.username === emailOrUsername) && u.status !== 'deleted');
      
      if (!user) throw new Error('Invalid credentials');
      if (user.status !== 'active') throw new Error('Account is inactive');

      let isValid = await this.verifyPassword(password, user.password);
      if (!isValid && user.password === password) {
        isValid = true;
        const hashed = await this.hashPassword(password);
        await window.DB.update('users', user.id, { password: hashed });
      }
      if (!isValid) throw new Error('Invalid credentials');

      // fetch role permissions
      const roles = await window.DB.getAll('roles');
      const roleObj = roles.find(r => r.name === user.role);
      const permissions = roleObj ? roleObj.permissions : [];

      const session = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: permissions,
        loginTime: Date.now(),
        lastActivity: Date.now()
      };

      if (rememberMe) {
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
      } else {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
      }

      await this.updateLastLogin(user.id);
      
      if (window.Events) {
        window.Events.emit('AUTH_LOGIN', user);
      }

      return { success: true, user };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: err.message || 'Invalid credentials' };
    }
  }

  /**
   * Logs out the current user.
   */
  logout() {
    localStorage.removeItem(this.sessionKey);
    sessionStorage.removeItem(this.sessionKey);
    if (window.Events) window.Events.emit('AUTH_LOGOUT');
    window.location.href = 'index.html';
  }

  /**
   * Retrieves the current session object.
   */
  getSession() {
    const str = localStorage.getItem(this.sessionKey) || sessionStorage.getItem(this.sessionKey);
    return str ? JSON.parse(str) : null;
  }

  /**
   * Updates last activity time to prevent timeout.
   */
  ping() {
    const session = this.getSession();
    if (session) {
      session.lastActivity = Date.now();
      if (localStorage.getItem(this.sessionKey)) {
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
      } else {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
      }
    }
  }

  /**
   * Periodic check for session timeout.
   */
  _checkTimeout() {
    setInterval(() => {
      const session = this.getSession();
      if (session) {
        const timeout = window.APP_CONFIG?.sessionTimeout || (30 * 60 * 1000);
        if (Date.now() - session.lastActivity > timeout) {
          alert('Session expired due to inactivity.');
          this.logout();
        }
      }
    }, 60 * 1000); // Check every minute
    
    // Bind interaction events to ping
    ['click', 'keypress', 'mousemove', 'scroll'].forEach(evt => {
      document.addEventListener(evt, () => this.ping(), { passive: true });
    });
  }

  /**
   * Checks if a user is logged in.
   */
  isLoggedIn() {
    return this.getSession() !== null;
  }

  /**
   * Returns current user data.
   */
  getCurrentUser() {
    return this.getSession();
  }

  /**
   * Checks if current user has a specific permission.
   */
  hasPermission(permission) {
    const session = this.getSession();
    if (!session || !session.permissions) return false;
    return session.permissions.includes(this.permissions.ALL) || session.permissions.includes(permission);
  }

  /**
   * Checks if current user has a specific role.
   */
  hasRole(role) {
    const session = this.getSession();
    return session ? session.role === role : false;
  }

  /**
   * Updates the user's last login timestamp.
   */
  async updateLastLogin(userId) {
    try {
      await window.DB.update('users', userId, { lastLogin: new Date().toISOString() });
    } catch (e) {
      console.warn('Failed to update last login', e);
    }
  }

  /**
   * Changes the user's password.
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await window.DB.get('users', userId);
    if (!user) throw new Error('User not found');
    
    const isValid = await this.verifyPassword(oldPassword, user.password);
    if (!isValid) throw new Error('Incorrect current password');
    
    const newHash = await this.hashPassword(newPassword);
    await window.DB.update('users', userId, { password: newHash });
    return true;
  }

  /**
   * Generates a reset token for the given email.
   */
  async resetPassword(email) {
    const users = await window.DB.getAll('users');
    const user = users.find(u => u.email === email && u.status === 'active');
    if (!user) throw new Error('Email not found');
    
    // In a real app, this would send an email. For local DB:
    const token = crypto.randomUUID();
    await window.DB.update('users', user.id, { resetToken: token, resetTokenExpiry: Date.now() + 3600000 });
    console.log(`Password reset token for ${email}: ${token}`);
    return token;
  }

  /**
   * Guard function: Redirects to login if not authenticated.
   */
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  /**
   * Guard function: Checks permission or redirects.
   */
  requirePermission(perm) {
    if (!this.requireAuth()) return false;
    if (!this.hasPermission(perm)) {
      alert('You do not have permission to access this area.');
      window.history.back();
      return false;
    }
    return true;
  }
}

window.Auth = new AuthManager();
