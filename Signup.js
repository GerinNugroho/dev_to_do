/* =========================================
   DevTodo – Sign Up Page Script (Vanilla JS)
   ========================================= */

(function () {
  'use strict';

  /* ---- DOM References ---- */
  const form            = document.getElementById('signupForm');
  const fullnameInput   = document.getElementById('fullname');
  const usernameInput   = document.getElementById('username');
  const passwordInput   = document.getElementById('password');
  const confirmInput    = document.getElementById('confirmPassword');

  const nameGroup       = document.getElementById('nameGroup');
  const usernameGroup   = document.getElementById('usernameGroup');
  const passwordGroup   = document.getElementById('passwordGroup');
  const confirmGroup    = document.getElementById('confirmGroup');

  const nameError       = document.getElementById('nameError');
  const usernameError   = document.getElementById('usernameError');
  const passwordError   = document.getElementById('passwordError');
  const confirmError    = document.getElementById('confirmError');

  const nameCheck       = document.getElementById('nameCheck');
  const usernameCheck   = document.getElementById('usernameCheck');
  const confirmCheck    = document.getElementById('confirmCheck');

  const strengthBar     = document.getElementById('strengthBar');
  const strengthFill    = document.getElementById('strengthFill');
  const strengthLabel   = document.getElementById('strengthLabel');

  const togglePassBtn   = document.getElementById('togglePass');
  const eyeIcon         = document.getElementById('eyeIcon');
  const signUpBtn       = document.getElementById('signUpBtn');

  const toast           = document.getElementById('toast');
  const toastMsg        = document.getElementById('toastMsg');
  const toastIcon       = document.getElementById('toastIcon');

  const card            = document.getElementById('signupCard');

  /* ---- Step indicators ---- */
  const steps           = document.querySelectorAll('.step');
  const connectors      = document.querySelectorAll('.step-connector');

  /* ---- SVG Icons ---- */
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

  function showError(group, errorEl, message, checkEl) {
    group.classList.add('error');
    errorEl.textContent = message;
    if (checkEl) { checkEl.className = 'input-check invalid'; }
  }

  function clearError(group, errorEl, checkEl, valid) {
    group.classList.remove('error');
    errorEl.textContent = '';
    if (checkEl) {
      checkEl.className = valid ? 'input-check valid' : 'input-check';
    }
  }

  /* ================================
     Validate: Full Name
  ================================ */
  function validateName() {
    const val = fullnameInput.value.trim();

    if (!val) {
      showError(nameGroup, nameError, 'Full name is required.', nameCheck);
      return false;
    }
    if (val.length < 2) {
      showError(nameGroup, nameError, 'Name must be at least 2 characters.', nameCheck);
      return false;
    }
    if (/[^a-zA-Z\s\-']/.test(val)) {
      showError(nameGroup, nameError, 'Name contains invalid characters.', nameCheck);
      return false;
    }

    clearError(nameGroup, nameError, nameCheck, true);
    return true;
  }

  /* ================================
     Validate: Username
  ================================ */
  function validateUsername() {
    const val = usernameInput.value.trim();

    if (!val) {
      showError(usernameGroup, usernameError, 'Username is required.', usernameCheck);
      return false;
    }
    if (val.length < 3) {
      showError(usernameGroup, usernameError, 'At least 3 characters required.', usernameCheck);
      return false;
    }
    if (val.length > 20) {
      showError(usernameGroup, usernameError, 'Max 20 characters allowed.', usernameCheck);
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(val)) {
      showError(usernameGroup, usernameError, 'Only letters, numbers, underscores.', usernameCheck);
      return false;
    }

    clearError(usernameGroup, usernameError, usernameCheck, true);
    return true;
  }

  /* ================================
     Validate: Password + Strength
  ================================ */
  function getPasswordStrength(val) {
    let score = 0;
    if (val.length >= 8)              score++;
    if (/[A-Z]/.test(val))            score++;
    if (/[0-9]/.test(val))            score++;
    if (/[^a-zA-Z0-9]/.test(val))    score++;

    if (score <= 1) return { level: 'weak',   label: 'WEAK' };
    if (score <= 2) return { level: 'fair',   label: 'FAIR' };
    return              { level: 'strong', label: 'STRONG' };
  }

  function updateStrengthBar(val) {
    if (!val) {
      strengthBar.classList.remove('visible');
      return;
    }

    strengthBar.classList.add('visible');
    const { level, label } = getPasswordStrength(val);

    strengthFill.className = `strength-fill ${level}`;
    strengthLabel.className = `strength-label ${level}`;
    strengthLabel.textContent = label;
  }

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
     Validate: Confirm Password
  ================================ */
  function validateConfirm() {
    const val     = confirmInput.value;
    const passVal = passwordInput.value;

    if (!val) {
      showError(confirmGroup, confirmError, 'Please confirm your password.', confirmCheck);
      return false;
    }
    if (val !== passVal) {
      showError(confirmGroup, confirmError, 'Passwords do not match.', confirmCheck);
      return false;
    }

    clearError(confirmGroup, confirmError, confirmCheck, true);
    return true;
  }

  /* ================================
     Live Validation (blur / input)
  ================================ */
  fullnameInput.addEventListener('blur',  validateName);
  usernameInput.addEventListener('blur',  validateUsername);
  passwordInput.addEventListener('blur',  validatePassword);
  confirmInput.addEventListener('blur',   validateConfirm);

  fullnameInput.addEventListener('input', function () {
    if (nameGroup.classList.contains('error')) validateName();
    else if (fullnameInput.value.trim().length > 1) {
      nameCheck.className = 'input-check valid';
    }
  });

  usernameInput.addEventListener('input', function () {
    if (usernameGroup.classList.contains('error')) validateUsername();
  });

  passwordInput.addEventListener('input', function () {
    updateStrengthBar(passwordInput.value);
    if (passwordGroup.classList.contains('error')) validatePassword();
    if (confirmInput.value) validateConfirm(); // re-check match live
  });

  confirmInput.addEventListener('input', function () {
    if (confirmGroup.classList.contains('error')) validateConfirm();
    else if (confirmInput.value && confirmInput.value === passwordInput.value) {
      confirmCheck.className = 'input-check valid';
    } else if (confirmInput.value) {
      confirmCheck.className = 'input-check invalid';
    }
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
     Progress Steps Update
  ================================ */
  function updateSteps(activeIndex) {
    steps.forEach(function (step, i) {
      step.classList.remove('step--active', 'step--done');
      if (i < activeIndex)  step.classList.add('step--done');
      if (i === activeIndex) step.classList.add('step--active');
    });
    connectors.forEach(function (conn, i) {
      conn.classList.toggle('done', i < activeIndex);
    });
  }

  /* Determine step based on filled fields */
  function refreshSteps() {
    const nameOk     = !nameGroup.classList.contains('error') && fullnameInput.value.trim().length >= 2;
    const userOk     = !usernameGroup.classList.contains('error') && usernameInput.value.trim().length >= 3;
    const passOk     = !passwordGroup.classList.contains('error') && passwordInput.value.length >= 6;
    const confirmOk  = !confirmGroup.classList.contains('error') && confirmInput.value === passwordInput.value && confirmInput.value;

    if (confirmOk && passOk && userOk && nameOk) { updateSteps(2); return; }
    if (passOk && userOk && nameOk)               { updateSteps(1); return; }
    updateSteps(0);
  }

  [fullnameInput, usernameInput, passwordInput, confirmInput].forEach(function (el) {
    el.addEventListener('input', refreshSteps);
  });

  /* ================================
     Toast Notification
  ================================ */
  let toastTimer = null;

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
     Simulate API Register
  ================================ */
  function fakeRegisterAPI(name, username, password) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        // Demo: always succeed
        resolve({ success: true, username: username });
      }, 1600);
    });
  }

  /* ================================
     Show Success Screen
  ================================ */
  function showSuccessScreen(username) {
    card.classList.add('card--success');

    card.innerHTML = `
      <div class="success-screen visible">
        <div class="success-icon">🚀</div>
        <p class="card-badge">ACCOUNT CREATED</p>
        <h2 class="success-title">You're in, @${username}!</h2>
        <p class="success-sub">
          Your DevTodo account is ready.<br>
          Time to enter your flow state.
        </p>
        <a href="index.html" class="success-link">→ Go to Sign In</a>
      </div>
    `;
  }

  /* ================================
     Form Submit Handler
  ================================ */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const validName     = validateName();
    const validUsername = validateUsername();
    const validPassword = validatePassword();
    const validConfirm  = validateConfirm();

    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
      showToast('Please agree to the Terms & Privacy Policy.', 'error');
      return;
    }

    if (!validName || !validUsername || !validPassword || !validConfirm) return;

    /* Loading state */
    signUpBtn.disabled = true;
    signUpBtn.classList.add('loading');

    const name     = fullnameInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
      const result = await fakeRegisterAPI(name, username, password);

      if (result.success) {
        updateSteps(2);
        showToast(`Welcome aboard, @${username}! 🎉`, 'success');
        setTimeout(function () {
          showSuccessScreen(username);
        }, 800);
      } else {
        showToast('Registration failed. Please try again.', 'error');
      }

    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      signUpBtn.disabled = false;
      signUpBtn.classList.remove('loading');
    }
  });

  /* ================================
     Enter Key Navigation
  ================================ */
  fullnameInput.addEventListener('keydown',   function (e) { if (e.key === 'Enter') { e.preventDefault(); usernameInput.focus(); } });
  usernameInput.addEventListener('keydown',   function (e) { if (e.key === 'Enter') { e.preventDefault(); passwordInput.focus(); } });
  passwordInput.addEventListener('keydown',   function (e) { if (e.key === 'Enter') { e.preventDefault(); confirmInput.focus(); } });

  /* ================================
     Autofocus
  ================================ */
  window.addEventListener('load', function () {
    fullnameInput.focus();
  });

})();