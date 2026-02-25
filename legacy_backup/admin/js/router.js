// ==========================================
// CENTRAL ROUTER SYSTEM
// ==========================================

export const ROUTES = {
  LOGIN: "index.html",
  DASHBOARD: "dashboard.html",
  PUBLIC_HOME: "../index.html",
};

export class Router {
  /**
   * الانتقال إلى صفحة معينة
   * @param {string} routeName - اسم المسار من كائن ROUTES
   */
  static push(routeName) {
    const path = ROUTES[routeName] || routeName;
    window.location.href = path;
  }

  /**
   * حماية المسارات (Auth Guard)
   * يتم استدعاؤه في لوحة التحكم للتأكد من أن المستخدم مسجل دخوله
   */
  static async guard(authManager) {
    const isAuth = await authManager.isAuthenticated();
    if (!isAuth) {
      console.log("Access denied. Redirecting to login...");
      this.push("LOGIN");
      return false;
    }
    return true;
  }

  /**
   * التوجيه التلقائي للمستخدم المسجل دخوله
   * يتم استدعاؤه في صفحة تسجيل الدخول
   */
  static async redirectIfAuthenticated(authManager) {
    const isAuth = await authManager.isAuthenticated();
    if (isAuth) {
      console.log("User already authenticated. Redirecting to dashboard...");
      this.push("DASHBOARD");
    }
  }
}
