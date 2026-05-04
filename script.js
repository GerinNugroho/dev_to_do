/* =========================================
   DevTodo – Login Page Script (Vanilla JS)
   ========================================= */

(function () {
  'use strict';

  /* ---- DOM References ---- */
  const form          = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const usernameGroup = document.getElementById('usernameGroup');
  const passwordGroup = document.getElementById('passwordGroup');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');
  const togglePassBtn = document.getElementById('togglePass');
  const eyeIcon       = document.getElementById('eyeIcon');
  const signInBtn     = document.getElementById('signInBtn');
  const forgotLink    = document.getElementById('forgotLink');
  const toast         = document.getElementById('toast');
  const toastMsg      = document.getElementById('toastMsg');
  const toastIcon     = document.getElementById('toastIcon');

  /* ---- SVG Icons for eye toggle ---- */
  const eyeOpenSVG = `
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  `;
  const eyeClosedSVG = `
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  `;

  /* ================================
     Validation Helpers
  ================================ */

  /**
   * Show an error on a form group
   */
  function showError(group, errorEl, message) {
    group.classList.add('error');
    errorEl.textContent = message;
  }

  /**
   * Clear error from a form group
   */
  function clearError(group, errorEl) {
    group.classList.remove('error');
    errorEl.textContent = '';
  }

  /**
   * Validate username field
   * @returns {boolean}
   */
  function validateUsername() {
    const val = usernameInput.value.trim();

    if (!val) {
      showError(usernameGroup, usernameError, 'Username is required.');
      return false;
    }
    if (val.length < 3) {
      showError(usernameGroup, usernameError, 'At least 3 characters required.');
      return false;
    }
    if (/\s/.test(val)) {
      showError(usernameGroup, usernameError, 'Username must not contain spaces.');
      return false;
    }

    clearError(usernameGroup, usernameError);
    return true;
  }

  /**
   * Validate password field
   * @returns {boolean}
   */
  function validatePassword() {
    const val = passwordInput.value;

    if (!val) {
      showError(passwordGroup, passwordError, 'Password is required.');
      return false;
    }
    if (val.length < 6) {
      showError(passwordGroup, passwordError, 'Password must be at least 6 characters.');
      return false;
    }

    clearError(passwordGroup, passwordError);
    return true;
  }

  /* ================================
     Live Validation (on blur/input)
  ================================ */
  usernameInput.addEventListener('blur', validateUsername);
  passwordInput.addEventListener('blur', validatePassword);

  usernameInput.addEventListener('input', function () {
    if (usernameGroup.classList.contains('error')) validateUsername();
  });

  passwordInput.addEventListener('input', function () {
    if (passwordGroup.classList.contains('error')) validatePassword();
  });

  /* ================================
     Toggle Password Visibility
  ================================ */
  let passVisible = false;

  togglePassBtn.addEventListener('click', function () {
    passVisible = !passVisible;
    passwordInput.type = passVisible ? 'text' : 'password';
    eyeIcon.innerHTML  = passVisible ? eyeClosedSVG : eyeOpenSVG;
    togglePassBtn.setAttribute('title', passVisible ? 'Hide password' : 'Show password');
  });

  /* ================================
     Toast Notification
  ================================ */
  let toastTimer = null;

  /**
   * Show a toast message
   * @param {string} message
   * @param {'success'|'error'} type
   */
  function showToast(message, type) {
    if (toastTimer) clearTimeout(toastTimer);

    toast.className = 'toast';
    toast.classList.add(`toast-${type}`, 'show');
    toastMsg.textContent = message;
    toastIcon.textContent = type === 'success' ? '✓' : '✕';

    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 3200);
  }

  /* ================================
     Simulate API Login
  ================================ */

  /**
   * Fake async login (replace with real fetch/API call)
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{success: boolean, message: string}>}
   */
  function fakeLoginAPI(username, password) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        // Demo: accept any credentials that pass validation
        if (username && password) {
          resolve({ success: true, message: 'Login successful! Entering flow state…' });
        } else {
          resolve({ success: false, message: 'Invalid credentials. Please try again.' });
        }
      }, 1400);
    });
  }

  /* ================================
     Form Submit Handler
  ================================ */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const validUser = validateUsername();
    const validPass = validatePassword();

    if (!validUser || !validPass) return;

    /* Show loading state */
    signInBtn.disabled = true;
    signInBtn.classList.add('loading');

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
      const result = await fakeLoginAPI(username, password);

      if (result.success) {
        showToast(result.message, 'success');

        /* Simulate redirect after short delay */
        setTimeout(function () {
          showToast('Redirecting to dashboard…', 'success');
          /* window.location.href = '/dashboard'; */
        }, 1800);

      } else {
        showToast(result.message, 'error');
        showError(usernameGroup, usernameError, ' ');
        showError(passwordGroup, passwordError, result.message);
      }

    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      signInBtn.disabled = false;
      signInBtn.classList.remove('loading');
    }
  });

  /* ================================
     Forgot Password Handler
  ================================ */
  forgotLink.addEventListener('click', function (e) {
    e.preventDefault();
    showToast('Password reset link sent! (demo)', 'success');
  });

  /* ================================
     Input Enter Key Navigation
  ================================ */
  usernameInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      passwordInput.focus();
    }
  });

  /* ================================
     Autofocus on first input
  ================================ */
  window.addEventListener('load', function () {
    usernameInput.focus();
  });

})();