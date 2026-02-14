(function (global) {
  'use strict';

  const STORAGE_KEY = 'granted_profile';

  function getStoredProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function setStoredProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (_) {}
  }

  function parsePublications(text) {
    if (!text || !text.trim()) return [];
    const lines = text.trim().split(/\n/).filter(Boolean);
    return lines.map(function (line) {
      return { title: line, journal: '', year: null };
    });
  }

  function initProfile() {
    const form = document.getElementById('profile-form');
    const backBtn = document.getElementById('profile-back');
    const interestsInput = document.getElementById('profile-interests');
    const skillsInput = document.getElementById('profile-skills');
    const interestsChips = document.getElementById('interests-chips');
    const skillsChips = document.getElementById('skills-chips');
    const interestsError = document.getElementById('interests-error');
    const skillsError = document.getElementById('skills-error');
    const linkInput = document.getElementById('profile-link');
    const addLinkBtn = document.getElementById('profile-add-link');
    const linksList = document.getElementById('profile-links-list');

    let interests = [];
    let skills = [];
    let links = [];

    function addChip(chipsEl, arr, errorEl, value) {
      const v = (value || '').trim();
      if (!v || arr.indexOf(v) >= 0) return;
      arr.push(v);
      renderChips(chipsEl, arr, function (idx) {
        arr.splice(idx, 1);
        renderChips(chipsEl, arr, null);
        if (errorEl) errorEl.hidden = true;
      });
      if (errorEl) errorEl.hidden = true;
    }

    function renderChips(container, arr, onRemove) {
      if (!container) return;
      container.innerHTML = '';
      arr.forEach(function (label, idx) {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = label;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'chip-remove';
        remove.setAttribute('aria-label', 'Remove ' + label);
        remove.textContent = '×';
        remove.addEventListener('click', function () {
          if (onRemove) onRemove(idx);
        });
        chip.appendChild(remove);
        container.appendChild(chip);
      });
    }

    function handleTagKeydown(inputEl, chipsEl, arr, errorEl, e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addChip(chipsEl, arr, errorEl, inputEl.value);
        inputEl.value = '';
      }
    }

    if (interestsInput && interestsChips) {
      interestsInput.addEventListener('keydown', function (e) {
        handleTagKeydown(interestsInput, interestsChips, interests, interestsError, e);
      });
      interestsInput.addEventListener('blur', function () {
        if (interestsInput.value.trim()) {
          addChip(interestsChips, interests, interestsError, interestsInput.value);
          interestsInput.value = '';
        }
      });
    }

    if (skillsInput && skillsChips) {
      skillsInput.addEventListener('keydown', function (e) {
        handleTagKeydown(skillsInput, skillsChips, skills, skillsError, e);
      });
      skillsInput.addEventListener('blur', function () {
        if (skillsInput.value.trim()) {
          addChip(skillsChips, skills, skillsError, skillsInput.value);
          skillsInput.value = '';
        }
      });
    }

    function addLink() {
      const url = (linkInput && linkInput.value || '').trim();
      if (!url) return;
      try {
        new URL(url);
      } catch (_) {
        if (global.Granted && global.Granted.utils) {
          global.Granted.utils.showToast('Enter a valid URL', 'error');
        }
        return;
      }
      links.push({ type: 'link', url: url });
      if (linkInput) linkInput.value = '';
      renderLinks();
    }

    function renderLinks() {
      if (!linksList) return;
      linksList.innerHTML = '';
      links.forEach(function (link, idx) {
        const chip = document.createElement('span');
        chip.className = 'link-chip';
        chip.textContent = link.url;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'link-chip-remove';
        remove.textContent = '×';
        remove.addEventListener('click', function () {
          links.splice(idx, 1);
          renderLinks();
        });
        chip.appendChild(remove);
        linksList.appendChild(chip);
      });
    }

    if (addLinkBtn && linkInput) {
      addLinkBtn.addEventListener('click', addLink);
      linkInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          addLink();
        }
      });
    }

    function validate() {
      var valid = true;
      if (interests.length === 0) {
        if (interestsError) {
          interestsError.textContent = 'Add at least one interest';
          interestsError.hidden = false;
        }
        if (interestsInput && interestsInput.closest('.form-group')) {
          interestsInput.closest('.form-group').classList.add('has-error');
        }
        valid = false;
      } else {
        if (interestsError) interestsError.hidden = true;
        if (interestsInput && interestsInput.closest('.form-group')) {
          interestsInput.closest('.form-group').classList.remove('has-error');
        }
      }
      if (skills.length === 0) {
        if (skillsError) {
          skillsError.textContent = 'Add at least one skill';
          skillsError.hidden = false;
        }
        if (skillsInput && skillsInput.closest('.form-group')) {
          skillsInput.closest('.form-group').classList.add('has-error');
        }
        valid = false;
      } else {
        if (skillsError) skillsError.hidden = true;
        if (skillsInput && skillsInput.closest('.form-group')) {
          skillsInput.closest('.form-group').classList.remove('has-error');
        }
      }
      return valid;
    }

    function loadStored() {
      var p = getStoredProfile();
      if (p) {
        interests = p.interests || [];
        skills = p.skills || [];
        links = p.links || [];
        renderChips(interestsChips, interests, function (idx) {
          interests.splice(idx, 1);
          renderChips(interestsChips, interests, null);
        });
        renderChips(skillsChips, skills, function (idx) {
          skills.splice(idx, 1);
          renderChips(skillsChips, skills, null);
        });
        var pubs = document.getElementById('profile-publications');
        if (pubs && p.publications && p.publications.length) {
          pubs.value = p.publications.map(function (x) { return x.title || ''; }).join('\n');
        }
        renderLinks();
      }
    }

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        if (global.Granted && global.Granted.app) global.Granted.app.goTo('auth');
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validate()) return;

        var pubsEl = document.getElementById('profile-publications');
        var profile = {
          id: 'student_001',
          interests: interests,
          skills: skills,
          publications: parsePublications(pubsEl ? pubsEl.value : ''),
          links: links,
          createdAt: new Date().toISOString()
        };
        setStoredProfile(profile);
        if (global.Granted && global.Granted.app) global.Granted.app.goTo('upload');
      });
    }

    loadStored();
  }

  global.Granted = global.Granted || {};
  global.Granted.profile = {
    init: initProfile,
    getStoredProfile: getStoredProfile,
    setStoredProfile: setStoredProfile
  };
})(typeof window !== 'undefined' ? window : this);
