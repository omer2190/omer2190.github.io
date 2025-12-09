// ==========================================
// AUTHENTICATION SYSTEM
// Supports localStorage now, ready for Backend integration
// ==========================================

class AuthManager {
  constructor() {
    this.storageKey = "portfolio_auth";
    this.sessionKey = "portfolio_session";
    this.defaultCredentials = {
      username: "admin",
      // SHA-256 hash of 'omer2190' using CryptoJS
      passwordHash:
        "751b7193983fa59ebb16471280834475620a8147d25d50c53fdbfe1db5f72ac4",
    };

    // Initialize default admin if not exists
    this.initializeAdmin();
  }

  // Initialize default admin credentials
  initializeAdmin() {
    const storedAuth = localStorage.getItem(this.storageKey);
    if (!storedAuth) {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.defaultCredentials)
      );
    }
  }

  // Hash password using SHA-256
  hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }

  // Validate credentials
  async validateLogin(username, password) {
    try {
      const storedAuth = JSON.parse(localStorage.getItem(this.storageKey));
      const hashedPassword = this.hashPassword(password);

      if (
        username === storedAuth.username &&
        hashedPassword === storedAuth.passwordHash
      ) {
        return { success: true, message: "تم تسجيل الدخول بنجاح" };
      } else {
        return {
          success: false,
          message: "اسم المستخدم أو كلمة المرور غير صحيحة",
        };
      }
    } catch (error) {
      return { success: false, message: "حدث خطأ في التحقق من البيانات" };
    }
  }

  // Create session
  createSession(username, rememberMe = false) {
    const session = {
      username,
      token: this.generateToken(),
      timestamp: Date.now(),
      expiresIn: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 30 days or 1 hour
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    return session;
  }

  // Generate random token
  generateToken() {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  // Check if session is valid
  isAuthenticated() {
    try {
      const session = JSON.parse(localStorage.getItem(this.sessionKey));
      if (!session) return false;

      const now = Date.now();
      const sessionAge = now - session.timestamp;

      if (sessionAge > session.expiresIn) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Get current session
  getSession() {
    try {
      return JSON.parse(localStorage.getItem(this.sessionKey));
    } catch (error) {
      return null;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem(this.sessionKey);
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const storedAuth = JSON.parse(localStorage.getItem(this.storageKey));
      const currentHash = this.hashPassword(currentPassword);

      if (currentHash !== storedAuth.passwordHash) {
        return { success: false, message: "كلمة المرور الحالية غير صحيحة" };
      }

      const newHash = this.hashPassword(newPassword);
      storedAuth.passwordHash = newHash;
      localStorage.setItem(this.storageKey, JSON.stringify(storedAuth));

      return { success: true, message: "تم تغيير كلمة المرور بنجاح" };
    } catch (error) {
      return { success: false, message: "حدث خطأ أثناء تغيير كلمة المرور" };
    }
  }

  // Reset to default credentials
  resetToDefault() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.defaultCredentials)
    );
    this.logout();
  }
}

// Initialize Auth Manager
const authManager = new AuthManager();

// DOM Elements
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberMeCheckbox = document.getElementById("rememberMe");
const togglePasswordBtn = document.getElementById("togglePassword");
const loginBtn = document.getElementById("loginBtn");
const alertBox = document.getElementById("alert");
const forgotPasswordLink = document.getElementById("forgotPassword");

// Show alert
function showAlert(message, type = "error") {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type} show`;

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 5000);
}

// Toggle password visibility
togglePasswordBtn.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;

  const icon = togglePasswordBtn.querySelector("i");
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
});

// Handle forgot password
forgotPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();

  const confirmed = confirm(
    "هل تريد إعادة تعيين كلمة المرور إلى الافتراضية؟\n\n" +
      "اسم المستخدم: admin\n" +
      "كلمة المرور: omer2190"
  );

  if (confirmed) {
    authManager.resetToDefault();
    showAlert("تم إعادة تعيين كلمة المرور بنجاح", "success");
  }
});

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const rememberMe = rememberMeCheckbox.checked;

  if (!username || !password) {
    showAlert("يرجى إدخال اسم المستخدم وكلمة المرور");
    return;
  }

  // Disable button during login
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ التحقق...';

  // Validate credentials
  const result = await authManager.validateLogin(username, password);

  if (result.success) {
    authManager.createSession(username, rememberMe);
    showAlert(result.message, "success");

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  } else {
    showAlert(result.message);
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
  }
});

// Check if already logged in
if (authManager.isAuthenticated()) {
  window.location.href = "dashboard.html";
}

// Enter key to submit
passwordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    loginForm.dispatchEvent(new Event("submit"));
  }
});
