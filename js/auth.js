(function (global) {
  'use strict';

  const STORAGE_KEY = 'granted_user';

  function getStoredUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function setStoredUser(user) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (_) {}
  }

  function clearStoredUser() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
  }

  function validatePassword(password) {
    return (password || '').length >= 8;
  }

  function initAuth() {
    const form = document.getElementById('auth-form');
    const submitBtn = document.getElementById('auth-submit');
    const btnText = submitBtn && submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn && submitBtn.querySelector('.btn-spinner');
    const errorEl = document.getElementById('auth-error');
    const switchBtn = document.getElementById('auth-switch');

    let isSignUp = false;

    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      if (btnText) btnText.hidden = loading;
      if (btnSpinner) btnSpinner.hidden = !loading;
    }

    function showError(msg) {
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.hidden = false;
      }
    }

    function hideError() {
      if (errorEl) errorEl.hidden = true;
    }

    function toggleMode() {
      isSignUp = !isSignUp;
      hideError();
      if (btnText) btnText.textContent = isSignUp ? 'Sign Up' : 'Sign In';
      if (switchBtn) switchBtn.textContent = isSignUp ? 'Sign In' : 'Sign Up';
    }

    if (switchBtn) {
      switchBtn.addEventListener('click', function () {
        toggleMode();
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        hideError();

        const emailInput = document.getElementById('auth-email');
        const passwordInput = document.getElementById('auth-password');
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        if (!validateEmail(email)) {
          showError('Enter a valid email.');
          return;
        }
        if (!validatePassword(password)) {
          showError('Password must be 8+ characters.');
          return;
        }

        setLoading(true);

        setTimeout(function () {
          setStoredUser({
            id: 'student_001',
            email: email,
            isAuthenticated: true
          });
          setLoading(false);
          if (global.Granted && global.Granted.app && global.Granted.app.goTo) {
            global.Granted.app.goTo('profile');
          }
        }, 600);
      });
    }
  }

  global.Granted = global.Granted || {};
  global.Granted.auth = {
    init: initAuth,
    getStoredUser: getStoredUser,
    setStoredUser: setStoredUser,
    clearStoredUser: clearStoredUser
  };
})(typeof window !== 'undefined' ? window : this);
