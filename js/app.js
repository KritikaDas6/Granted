(function (global) {
  'use strict';

  var screens = {
    auth: 'screen-auth',
    profile: 'screen-profile',
    upload: 'screen-upload',
    matches: 'screen-matches'
  };

  function goTo(screenName) {
    var targetId = screens[screenName];
    if (!targetId) return;

    Object.keys(screens).forEach(function (name) {
      var id = screens[name];
      var el = document.getElementById(id);
      if (el) {
        if (id === targetId) {
          el.classList.remove('screen-hidden');
          el.setAttribute('aria-hidden', 'false');
        } else {
          el.classList.add('screen-hidden');
          el.setAttribute('aria-hidden', 'true');
        }
      }
    });

    if (screenName === 'matches') {
      if (global.Granted && global.Granted.matches && global.Granted.matches.loadMatches) {
        global.Granted.matches.loadMatches();
      }
    }
  }

  function hasResumeStored() {
    try {
      var raw = localStorage.getItem('granted_uploads');
      var data = raw ? JSON.parse(raw) : null;
      return !!(data && data.resume && data.resume.status === 'uploaded');
    } catch (_) {
      return false;
    }
  }

  function init() {
    var user = global.Granted && global.Granted.auth ? global.Granted.auth.getStoredUser() : null;

    if (user && user.isAuthenticated) {
      var profile = global.Granted && global.Granted.profile ? global.Granted.profile.getStoredProfile() : null;
      var hasResume = hasResumeStored();

      if (!profile || !profile.interests || profile.interests.length === 0) {
        goTo('profile');
      } else if (!hasResume) {
        goTo('upload');
      } else {
        goTo('matches');
      }
    } else {
      goTo('auth');
    }

    if (global.Granted.auth) global.Granted.auth.init();
    if (global.Granted.profile) global.Granted.profile.init();
    if (global.Granted.upload) global.Granted.upload.init();
    if (global.Granted.matches) global.Granted.matches.init();
    if (global.Granted.chat) global.Granted.chat.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.Granted = global.Granted || {};
  global.Granted.app = {
    goTo: goTo,
    init: init
  };
})(typeof window !== 'undefined' ? window : this);
