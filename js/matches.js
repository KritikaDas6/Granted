(function (global) {
  'use strict';

  var selectedMatchId = null;
  var allMatches = [];
  var filterValue = 'all';
  var sortValue = 'score';

  function getMatches() {
    return typeof getDummyMatches === 'function' ? getDummyMatches() : [];
  }

  function filterAndSort(matches) {
    var filtered = matches;
    if (filterValue === '90+') filtered = matches.filter(function (m) { return m.score >= 90; });
    else if (filterValue === '80+') filtered = matches.filter(function (m) { return m.score >= 80; });
    else if (filterValue === '70+') filtered = matches.filter(function (m) { return m.score >= 70; });

    var sorted = filtered.slice();
    if (sortValue === 'score') {
      sorted.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
    } else if (sortValue === 'name') {
      sorted.sort(function (a, b) {
        var na = (a.professor && a.professor.name) || '';
        var nb = (b.professor && b.professor.name) || '';
        return na.localeCompare(nb);
      });
    }
    return sorted;
  }

  function renderScore(score, maxScore) {
    maxScore = maxScore || 100;
    var pct = Math.round((score / maxScore) * 100);
    var stars = Math.round((pct / 100) * 5);
    var starStr = '';
    for (var i = 0; i < 5; i++) {
      starStr += i < stars ? '★' : '☆';
    }
    return starStr + ' ' + pct + '%';
  }

  function renderMatchCards() {
    var list = document.getElementById('matches-list');
    var loading = document.getElementById('matches-loading');
    var empty = document.getElementById('matches-empty');

    if (!list) return;

    var matches = filterAndSort(allMatches);

    if (allMatches.length === 0) {
      list.innerHTML = '';
      if (loading) loading.classList.add('matches-loading-hidden');
      if (empty) {
        empty.classList.remove('empty-state-hidden');
      }
      return;
    }

    if (loading) loading.classList.add('matches-loading-hidden');
    if (empty) empty.classList.add('empty-state-hidden');

    list.innerHTML = '';
    matches.forEach(function (match) {
      var card = document.createElement('div');
      card.className = 'match-card' + (match.id === selectedMatchId ? ' match-card-selected' : '');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('data-match-id', match.id);

      var prof = match.professor || {};
      var scoreStr = renderScore(match.score, match.maxScore);
      card.innerHTML =
        '<h4>' + (prof.name || 'Professor') + '</h4>' +
        '<p class="match-lab">' + (prof.lab || '') + '</p>' +
        '<span class="match-score">' + scoreStr + '</span>' +
        '<p class="match-focus">' + (match.researchFocus || '').slice(0, 80) + (match.researchFocus && match.researchFocus.length > 80 ? '…' : '') + '</p>';

      card.addEventListener('click', function () {
        selectMatch(match.id);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectMatch(match.id);
        }
      });

      list.appendChild(card);
    });
  }

  function updateWhyMatch(matchId) {
    selectedMatchId = matchId;

    var emptyEl = document.getElementById('why-match-empty');
    var contentEl = document.getElementById('why-match-content');
    var scoreEl = document.getElementById('why-match-score');
    var reasonsEl = document.getElementById('why-match-reasons');
    var tagsEl = document.getElementById('why-match-tags');
    var focusEl = document.getElementById('why-match-focus');

    if (!matchId) {
      if (emptyEl) emptyEl.hidden = false;
      if (contentEl) contentEl.classList.add('why-match-content-hidden');
      if (global.Granted && global.Granted.chat) {
        global.Granted.chat.selectMatch(null);
        global.Granted.chat.enableChat(false);
      }
      renderMatchCards();
      return;
    }

    var match = allMatches.find(function (m) { return m.id === matchId; });
    if (!match) {
      if (emptyEl) emptyEl.hidden = false;
      if (contentEl) contentEl.classList.add('why-match-content-hidden');
      if (global.Granted && global.Granted.chat) global.Granted.chat.enableChat(false);
      renderMatchCards();
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (contentEl) contentEl.classList.remove('why-match-content-hidden');

    if (scoreEl) {
      var pct = Math.round(((match.score || 0) / (match.maxScore || 100)) * 100);
      scoreEl.textContent = pct + '% match';
    }
    if (reasonsEl) {
      reasonsEl.innerHTML = '';
      (match.reasons || []).forEach(function (r) {
        var li = document.createElement('li');
        li.textContent = r;
        reasonsEl.appendChild(li);
      });
    }
    if (tagsEl) {
      tagsEl.innerHTML = '';
      (match.tags || []).forEach(function (t) {
        var chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = t;
        tagsEl.appendChild(chip);
      });
    }
    if (focusEl) {
      focusEl.textContent = 'Research focus: ' + (match.researchFocus || '');
    }

    if (global.Granted && global.Granted.chat) {
      global.Granted.chat.selectMatch(matchId);
      global.Granted.chat.enableChat(true);
    }

    renderMatchCards();
  }

  function selectMatch(matchId) {
    updateWhyMatch(matchId);
  }

  function loadMatches() {
    var loading = document.getElementById('matches-loading');
    var list = document.getElementById('matches-list');
    var empty = document.getElementById('matches-empty');

    if (loading) loading.classList.remove('matches-loading-hidden');
    if (list) list.innerHTML = '';
    if (empty) empty.classList.add('empty-state-hidden');

    setTimeout(function () {
      allMatches = getMatches();
      if (loading) loading.classList.add('matches-loading-hidden');
      renderMatchCards();
      if (selectedMatchId && allMatches.some(function (m) { return m.id === selectedMatchId; })) {
        updateWhyMatch(selectedMatchId);
      } else {
        selectedMatchId = null;
        updateWhyMatch(null);
      }
    }, 1200);
  }

  function initMatches() {
    var filterSelect = document.getElementById('matches-filter');
    var sortSelect = document.getElementById('matches-sort');
    var profileBtn = document.getElementById('matches-profile');
    var editProfileBtn = document.getElementById('matches-edit-profile');

    if (filterSelect) {
      filterSelect.addEventListener('change', function () {
        filterValue = filterSelect.value;
        renderMatchCards();
      });
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        sortValue = sortSelect.value;
        renderMatchCards();
      });
    }
    if (profileBtn) {
      profileBtn.addEventListener('click', function () {
        if (global.Granted && global.Granted.app) global.Granted.app.goTo('profile');
      });
    }
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', function () {
        if (global.Granted && global.Granted.app) global.Granted.app.goTo('profile');
      });
    }

    loadMatches();
  }

  global.Granted = global.Granted || {};
  global.Granted.matches = {
    init: initMatches,
    loadMatches: loadMatches,
    selectMatch: selectMatch,
    updateWhyMatch: updateWhyMatch
  };
})(typeof window !== 'undefined' ? window : this);
