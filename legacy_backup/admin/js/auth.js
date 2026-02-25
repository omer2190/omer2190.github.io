import { getSupabase } from "../../assets/js/config/supabase.js";
import { Router } from "./router.js";

class AuthManager {
  constructor() {
    this.supabase = getSupabase();
    this.sessionKey = "portfolio_session";
    // Clean up local admin session if it exists to avoid confusion
    localStorage.removeItem("portfolio_auth");
  }

  // Validate credentials using Supabase Auth
  async validateLogin(email, password) {
    try {
      if (!this.supabase) {
        return { success: false, message: "Supabase client not initialized" };
      }

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        return {
          success: false,
          message:
            error.message === "Invalid login credentials"
              ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
              : error.message,
        };
      }

      // Session is automatically handled by Supabase client
      return { success: true, message: "تم تسجيل الدخول بنجاح" };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: "حدث خطأ في التحقق من البيانات" };
    }
  }

  // Check if session is valid
  async isAuthenticated() {
    if (!this.supabase) return false;
    const { data } = await this.supabase.auth.getSession();
    return !!data.session;
  }

  // Get current user
  async getUser() {
    if (!this.supabase) return null;
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user;
  }

  // Logout
  async logout() {
    if (!this.supabase) return;
    await this.supabase.auth.signOut();
    localStorage.removeItem(this.sessionKey); // Clean up any old sessions
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      // First verify old password by signing in again (Supabase doesn't have a direct "verify password" without sign in)
      // Or just update directly if the user is already logged in

      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: "تم تغيير كلمة المرور بنجاح" };
    } catch (error) {
      return { success: false, message: "حدث خطأ أثناء تغيير كلمة المرور" };
    }
  }

  // Reset password (send email)
  async resetPassword(email) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: window.location.origin + "/admin/update-password.html",
      },
    );
    if (error) return { success: false, message: error.message };
    return {
      success: true,
      message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
    };
  }
}

// Initialize Auth Manager
const authManager = new AuthManager();
window.authManager = authManager; // Expose to window for global access
export { authManager };

// DOM Elements & Event Listeners
// Only run if we are on the login page (check for elements)
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const usernameInput = document.getElementById("username"); // Reusing this ID for EMAIL
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
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;

      const icon = togglePasswordBtn.querySelector("i");
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  }

  // Handle login form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = usernameInput.value.trim();
    const password = passwordInput.value;
    // const rememberMe = rememberMeCheckbox.checked; // Supabase persists session by default

    if (!email || !password) {
      showAlert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    // Disable button during login
    loginBtn.disabled = true;
    loginBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> جارٍ التحقق...';

    // Validate credentials
    const result = await authManager.validateLogin(email, password);

    if (result.success) {
      showAlert(result.message, "success");
      // Redirect using Router
      setTimeout(() => {
        Router.push("DASHBOARD");
      }, 1000);
    } else {
      showAlert(result.message);
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
    }
  });

  // Handle forgot password
  forgotPasswordLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = prompt("الرجاء إدخال بريدك الإلكتروني لاستعادة كلمة المرور:");
    if (email) {
      const result = await authManager.resetPassword(email);
      showAlert(result.message, result.success ? "success" : "error");
    }
  });

  // Check if already logged in using Router
  Router.redirectIfAuthenticated(authManager);
}
