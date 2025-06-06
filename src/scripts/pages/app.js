// pages/app.js
import routes from "../routes/routes";
import { getActiveRoute, parseActivePathname } from "../routes/url-parser";
import { isAuthenticated, removeAccessToken } from "../utils/auth";

class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;
    this._initAppShell();
    this._setupSkipToContent();
  }

  _initAppShell() {
    this._setupDrawer();
    this._setupNavigation();
    this._setupLogout();
  }

  _setupSkipToContent() {
    if (!document.querySelector(".skip-to-content")) {
      const skipLink = document.createElement("a");
      skipLink.className = "skip-to-content";
      skipLink.href = "#main-content";
      skipLink.textContent = "Skip to content";
      document.body.insertBefore(skipLink, document.body.firstChild);

      skipLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.content.setAttribute("tabindex", "-1");
        this.content.focus();
        this.content.scrollIntoView();
      });
    }
  }

  _setupDrawer() {
    if (this.drawerButton) {
      this.drawerButton.addEventListener("click", (event) => {
        this.navigationDrawer.classList.toggle("open");
        event.stopPropagation();
      });
    }

    document.addEventListener("click", (event) => {
      if (
        this.navigationDrawer &&
        !this.navigationDrawer.contains(event.target) &&
        this.navigationDrawer.classList.contains("open")
      ) {
        this.navigationDrawer.classList.remove("open");
      }
    });
  }

  _setupNavigation() {
    this._updateNavigation();

    window.addEventListener("hashchange", () => {
      this._updateNavigation();
    });
  }

  _updateNavigation() {
    const isLoggedIn = isAuthenticated();
    const loginContainer = document.getElementById("login-container");
    const registerContainer = document.getElementById("register-container");
    const profileContainer = document.getElementById("profile-container");
    const diabetesCheckedUserContainer = document.getElementById(
      "diabetes-checked-user-container"
    );

    if (isLoggedIn) {
      // User is logged in - show profile

      if (diabetesCheckedUserContainer)
        diabetesCheckedUserContainer.style.display = "block";
      if (loginContainer) loginContainer.style.display = "none";
      if (registerContainer) registerContainer.style.display = "none";
      if (profileContainer) profileContainer.style.display = "block";
    } else {
      // User is not logged in - show login and register
      if (diabetesCheckedUserContainer)
        diabetesCheckedUserContainer.style.display = "none";
      if (loginContainer) loginContainer.style.display = "block";
      if (registerContainer) registerContainer.style.display = "block";
      if (profileContainer) profileContainer.style.display = "none";
    }
  }

  _setupLogout() {
    // Ganti dengan menangani logout dari dropdown
    const dropdownLogout = document.getElementById("dropdown-logout");

    if (dropdownLogout) {
      dropdownLogout.addEventListener("click", (event) => {
        event.preventDefault();
        this._handleLogout();
      });
    }
  }

  _handleLogout() {
    removeAccessToken();
    window.location.hash = "#/login";
    this._updateNavigation();
  }

  async renderPage() {
    const activeRoute = getActiveRoute();
    const routeConfig = routes[activeRoute];

    if (!routeConfig) {
      this.content.innerHTML = "<p>Page not found</p>";
      return;
    }

    if (routeConfig.check && !routeConfig.check()) {
      return;
    }

    try {
      const page = routeConfig.page;
      const urlParams = parseActivePathname();

      if (document.startViewTransition) {
        document.startViewTransition(async () => {
          this.content.innerHTML = await page.render(urlParams);
          await page.afterRender(urlParams);
          this._updateNavigation();
        });
      } else {
        this.content.innerHTML = await page.render(urlParams);
        await page.afterRender(urlParams);
        this._updateNavigation();
      }
    } catch (error) {
      console.error("Error rendering page:", error);
      this.content.innerHTML = "<p>Error loading page</p>";
    }
  }
}

export default App;
