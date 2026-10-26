/**
 * ========================================================
 * TEAM REGISTRATION PORTAL MODULE (দল নিবন্ধন পোর্টাল)
 * ========================================================
 * Allows participating teams to view tournament rules, agree
 * to regulations, and register team manager, coach, and squad
 * players list directly. Automatically synchronizes with the
 * central tournament state, wizard, and page 2 rosters.
 */

(function(window) {
  'use strict';

  let currentRegSlipData = null;

  function initRegistrationModule() {
    // Check URL hash on page load
    if (window.location.hash === '#register') {
      setTimeout(function() {
        openTeamRegistrationModal();
      }, 300);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', function() {
      if (window.location.hash === '#register') {
        openTeamRegistrationModal();
      }
    });
  }

  function openTeamRegistrationModal() {
    const modal = document.getElementById('team-registration-modal');
    if (!modal) return;

    // Reset view states
    const formSection = document.getElementById('reg-form-section');
    const successSection = document.getElementById('reg-success-section');
    if (formSection) formSection.style.display = 'block';
    if (successSection) successSection.style.display = 'none';

    // Populate tournament highlights
    populateRegTournamentHighlights();

    // Populate official rules list
    populateRegRulesList();

    // Reset and render 11 player rows
    renderRegDefaultPlayerRows();

    // Clear form inputs
    const nameInp = document.getElementById('reg-team-name');
    const mgrInp = document.getElementById('reg-manager-name');
    const phoneInp = document.getElementById('reg-manager-phone');
    const coachInp = document.getElementById('reg-coach-name');
    const jerseyInp = document.getElementById('reg-jersey-color');
    const noteInp = document.getElementById('reg-payment-note');
    const termsCheck = document.getElementById('reg-terms-agree');

    if (nameInp) nameInp.value = '';
    if (mgrInp) mgrInp.value = '';
    if (phoneInp) phoneInp.value = '';
    if (coachInp) coachInp.value = '';
    if (jerseyInp) jerseyInp.value = '';
    if (noteInp) noteInp.value = '';
    if (termsCheck) termsCheck.checked = false;

    modal.classList.add('active');
    modal.style.display = 'flex';
  }

  function closeTeamRegistrationModal() {
    const modal = document.getElementById('team-registration-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
    if (window.location.hash === '#register') {
      window.location.hash = '#football';
    }
  }

  function populateRegTournamentHighlights() {
    const cfg = (typeof tournamentConfig !== 'undefined' && tournamentConfig) ? tournamentConfig : (typeof DEFAULT_CONFIG !== 'undefined' ? DEFAULT_CONFIG : {});
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

    const titleEl = document.getElementById('reg-highlight-title');
    const prizeEl = document.getElementById('reg-highlight-prize');
    const feeEl = document.getElementById('reg-highlight-fee');
    const deadlineEl = document.getElementById('reg-highlight-deadline');
    const venueEl = document.getElementById('reg-highlight-venue');
    const squadEl = document.getElementById('reg-highlight-squad');

    const startingCount = (cfg.startingPlayers !== undefined && cfg.startingPlayers !== null) ? parseInt(cfg.startingPlayers, 10) : 11;
    const benchCount = (cfg.benchPlayers !== undefined && cfg.benchPlayers !== null) ? parseInt(cfg.benchPlayers, 10) : 5;
    const maxSubs = (cfg.maxSubstitutes !== undefined && cfg.maxSubstitutes !== null) ? parseInt(cfg.maxSubstitutes, 10) : 5;

    if (titleEl) titleEl.textContent = cfg.title || (isEn ? 'Football Tournament 2026' : 'ফুটবল টুর্নামেন্ট ২০২৬');
    if (prizeEl) prizeEl.textContent = cfg.prizeChampion || (isEn ? '30,000 BDT + Trophy' : '৩০,০০০ টাকা + ট্রফি');
    if (feeEl) feeEl.textContent = cfg.entryFee || (isEn ? '2,000 BDT' : '২,০০০ টাকা');
    if (deadlineEl) deadlineEl.textContent = cfg.regDeadline || (isEn ? 'Before Match Kickoff' : 'ম্যাচ শুরুর পূর্বে');
    if (venueEl) venueEl.textContent = cfg.venue || (isEn ? 'Official Stadium Ground' : 'অফিশিয়াল স্টেডিয়াম মাঠ');
    if (squadEl) {
      squadEl.textContent = isEn
        ? `${startingCount} on pitch + ${benchCount} bench (Max ${maxSubs} subs)`
        : `${startingCount} মাঠে + ${benchCount} বেঞ্চ (সর্বোচ্চ ${maxSubs} বদলি)`;
    }
  }

  function populateRegRulesList() {
    const rulesBox = document.getElementById('reg-rules-summary-box');
    if (!rulesBox) return;

    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
    const cfg = (typeof tournamentConfig !== 'undefined' && tournamentConfig) ? tournamentConfig : {};
    const catalog = (typeof MASTER_RULES_CATALOG !== 'undefined') ? MASTER_RULES_CATALOG : [];
    const selectedIds = cfg.selectedRules || [];

    const activeRules = catalog.filter(r => selectedIds.includes(r.id));
    const customRules = cfg.customRules || [];

    if (activeRules.length === 0 && customRules.length === 0) {
      rulesBox.innerHTML = '<div style="color:#64748b; font-size:11.5px; padding:6px;">' +
        (isEn ? 'Standard fair play and official referee guidelines apply.' : 'সাধারণ ফেয়ার প্লে ও অফিসিয়াল রেফারির সিদ্ধান্ত অনুযায়ী খেলা পরিচালিত হবে।') +
        '</div>';
      return;
    }

    let html = '<div class="reg-rules-grid">';
    activeRules.forEach((r, idx) => {
      const title = isEn ? r.titleEn : r.titleBn;
      const desc = isEn ? r.descEn : r.descBn;
      html += `
        <div class="reg-rule-item">
          <strong>${idx + 1}. ${title}:</strong> <span>${desc}</span>
        </div>
      `;
    });

    customRules.forEach((cr, idx) => {
      html += `
        <div class="reg-rule-item" style="border-left-color:#38bdf8;">
          <strong>⭐ ${cr.title}:</strong> <span>${cr.desc}</span>
        </div>
      `;
    });
    html += '</div>';

    rulesBox.innerHTML = html;
  }

  function renderRegDefaultPlayerRows() {
    const tbody = document.getElementById('reg-players-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const cfg = (typeof tournamentConfig !== 'undefined' && tournamentConfig) ? tournamentConfig : {};
    const startingCount = (cfg.startingPlayers !== undefined && cfg.startingPlayers !== null) ? parseInt(cfg.startingPlayers, 10) : 11;

    for (let i = 1; i <= startingCount; i++) {
      const defaultRole = i === 1 ? 'GK' : (i === startingCount ? 'C' : 'Player');
      addRegistrationPlayerRow(i, defaultRole);
    }
  }

  function createPlayerRowContent(rowIdx, jerseyNo, name, role) {
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
    return `
      <td class="reg-sl-cell" style="text-align:center; font-weight:700; color:#64748b;">${rowIdx}</td>
      <td style="width:75px; text-align:center;">
        <input type="number" min="1" max="99" class="w-input reg-inp-jersey" value="${jerseyNo}" style="padding:4px; text-align:center; font-weight:800;" placeholder="${rowIdx}">
      </td>
      <td>
        <input type="text" class="w-input reg-inp-name" value="${name || ''}" placeholder="${isEn ? 'Player ' + rowIdx + ' Full Name...' : 'খেলোয়াড় ' + rowIdx + '-এর পূর্ণ নাম...'}" style="padding:5px 8px;">
      </td>
      <td style="width:115px;">
        <select class="w-select reg-inp-role" style="padding:4px 6px; font-size:11.5px; font-weight:700;">
          <option value="Player" ${role === 'Player' ? 'selected' : ''}>${isEn ? 'Player' : 'খেলোয়াড়'}</option>
          <option value="C" ${role === 'C' ? 'selected' : ''}>${isEn ? 'Captain (C)' : 'অধিনায়ক (C)'}</option>
          <option value="GK" ${role === 'GK' ? 'selected' : ''}>${isEn ? 'Goalkeeper (GK)' : 'গোলরক্ষক (GK)'}</option>
        </select>
      </td>
      <td style="width:36px; text-align:center;">
        <button type="button" class="btn-reg-del-row" onclick="removeRegistrationPlayerRow(this)" title="${isEn ? 'Remove Player' : 'বাদ দিন'}">✕</button>
      </td>
    `;
  }

  function addRegistrationPlayerRow(customJersey, customRole) {
    const tbody = document.getElementById('reg-players-tbody');
    if (!tbody) return;

    const cfg = (typeof tournamentConfig !== 'undefined' && tournamentConfig) ? tournamentConfig : {};
    const startingCount = (cfg.startingPlayers !== undefined && cfg.startingPlayers !== null) ? parseInt(cfg.startingPlayers, 10) : 11;
    const benchCount = (cfg.benchPlayers !== undefined && cfg.benchPlayers !== null) ? parseInt(cfg.benchPlayers, 10) : 5;
    const maxAllowed = Math.max(startingCount + benchCount, 11);

    const currentRows = tbody.querySelectorAll('.reg-player-row');
    if (currentRows.length >= maxAllowed) {
      const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
      alert(isEn
        ? `A team can register maximum ${maxAllowed} players (${startingCount} Starting + ${benchCount} Bench).`
        : `একটি দলে সর্বোচ্চ ${maxAllowed} জন খেলোয়াড় নিবন্ধন করা যাবে (${startingCount} জন মাঠে + ${benchCount} জন বেঞ্চ)।`);
      return;
    }

    const nextIdx = currentRows.length + 1;
    const jerseyNo = (customJersey !== undefined && customJersey !== null) ? customJersey : nextIdx;
    const role = customRole || 'Player';

    const tr = document.createElement('tr');
    tr.className = 'reg-player-row';
    tr.id = 'reg-prow-' + nextIdx;
    tr.innerHTML = createPlayerRowContent(nextIdx, jerseyNo, '', role);
    tbody.appendChild(tr);
  }

  function removeRegistrationPlayerRow(btn) {
    const tbody = document.getElementById('reg-players-tbody');
    if (!tbody) return;

    const cfg = (typeof tournamentConfig !== 'undefined' && tournamentConfig) ? tournamentConfig : {};
    const startingCount = (cfg.startingPlayers !== undefined && cfg.startingPlayers !== null) ? parseInt(cfg.startingPlayers, 10) : 11;
    const minAllowed = Math.max(Math.floor(startingCount * 0.65), 5);

    const currentRows = tbody.querySelectorAll('.reg-player-row');
    if (currentRows.length <= minAllowed) {
      const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
      alert(isEn
        ? `Minimum ${minAllowed} players are required to register a team.`
        : `দল নিবন্ধনের জন্য কমপক্ষে ${minAllowed} জন খেলোয়াড় আবশ্যক।`);
      return;
    }

    const row = btn.closest ? btn.closest('tr') : (btn.parentElement ? btn.parentElement.parentElement : null);
    if (row && typeof row.remove === 'function') {
      row.remove();
      // Re-index remaining rows
      const remaining = tbody.querySelectorAll('.reg-player-row');
      remaining.forEach((r, idx) => {
        const slCell = r.querySelector('.reg-sl-cell');
        if (slCell) slCell.textContent = idx + 1;
      });
    }
  }

  function copyRegistrationLink(btn) {
    const url = window.location.origin + window.location.pathname + '#register';
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function() {
        showCopyFeedback(btn, isEn);
      }).catch(function() {
        fallbackCopy(url, btn, isEn);
      });
    } else {
      fallbackCopy(url, btn, isEn);
    }
  }

  function fallbackCopy(text, btn, isEn) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showCopyFeedback(btn, isEn);
    } catch (err) {
      alert(isEn ? 'Registration URL: ' + text : 'নিবন্ধন লিংক: ' + text);
    }
    document.body.removeChild(textArea);
  }

  function showCopyFeedback(btn, isEn) {
    if (btn) {
      const origText = btn.innerHTML;
      btn.innerHTML = '✅ ' + (isEn ? 'Link Copied!' : 'লিংক কপি হয়েছে!');
      btn.style.borderColor = '#22c55e';
      setTimeout(function() {
        btn.innerHTML = origText;
        btn.style.borderColor = '';
      }, 2500);
    } else {
      alert(isEn ? 'Registration link copied to clipboard! Share it with teams.' : 'অনলাইন দল নিবন্ধন লিংক ক্লিপবোর্ডে কপি হয়েছে! দলগুলোর সাথে শেয়ার করুন।');
    }
  }

  function submitTeamRegistration(e) {
    if (e && e.preventDefault) e.preventDefault();

    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

    // 1. Gather form fields
    const teamNameInp = document.getElementById('reg-team-name');
    const mgrInp = document.getElementById('reg-manager-name');
    const phoneInp = document.getElementById('reg-manager-phone');
    const coachInp = document.getElementById('reg-coach-name');
    const jerseyInp = document.getElementById('reg-jersey-color');
    const noteInp = document.getElementById('reg-payment-note');
    const termsCheck = document.getElementById('reg-terms-agree');

    const teamName = teamNameInp ? teamNameInp.value.trim() : '';
    const manager = mgrInp ? mgrInp.value.trim() : '';
    const phone = phoneInp ? phoneInp.value.trim() : '';
    const coach = coachInp ? coachInp.value.trim() : '';
    const jerseyColor = jerseyInp ? jerseyInp.value.trim() : '';
    const paymentNote = noteInp ? noteInp.value.trim() : '';

    // Validations
    if (!teamName) {
      alert(isEn ? 'Please enter the Team Name!' : 'অনুগ্রহ করে দলের পূর্ণ নাম লিখুন!');
      if (teamNameInp && typeof teamNameInp.focus === 'function') teamNameInp.focus();
      return false;
    }

    if (!manager) {
      alert(isEn ? 'Please enter the Team Manager or Captain name!' : 'অনুগ্রহ করে টিম ম্যানেজার বা অধিনায়কের নাম লিখুন!');
      if (mgrInp && typeof mgrInp.focus === 'function') mgrInp.focus();
      return false;
    }

    if (!phone) {
      alert(isEn ? 'Please enter the Manager contact phone number!' : 'অনুগ্রহ করে যোগাযোগের মোবাইল বা হোয়াটসঅ্যাপ নম্বর লিখুন!');
      if (phoneInp && typeof phoneInp.focus === 'function') phoneInp.focus();
      return false;
    }

    if (!termsCheck || !termsCheck.checked) {
      alert(isEn ? 'Please agree to the tournament official rules and referee guidelines!' : 'টুর্নামেন্টের অফিসিয়াল নিয়মাবলী ও রেফারির সিদ্ধান্ত মেনে নেওয়ার শর্তে টিক দিন!');
      if (termsCheck && typeof termsCheck.focus === 'function') termsCheck.focus();
      return false;
    }

    // 2. Gather players
    const rows = document.querySelectorAll('#reg-players-tbody .reg-player-row');
    const players = [];
    rows.forEach((r, idx) => {
      const jInp = r.querySelector ? r.querySelector('.reg-inp-jersey') : null;
      const nInp = r.querySelector ? r.querySelector('.reg-inp-name') : null;
      const rInp = r.querySelector ? r.querySelector('.reg-inp-role') : null;

      const jVal = jInp ? (parseInt(jInp.value, 10) || (idx + 1)) : (idx + 1);
      const nVal = nInp ? nInp.value.trim() : '';
      const rVal = rInp ? rInp.value : 'Player';

      if (nVal !== '') {
        players.push({
          no: idx + 1,
          jersey: jVal,
          name: nVal,
          role: rVal
        });
      }
    });

    if (players.length < 5) {
      alert(isEn ? 'Please provide at least 5 player names in your squad roster!' : 'অনুগ্রহ করে স্কোয়াডে কমপক্ষে ৫ জন খেলোয়াড়ের নাম লিখুন!');
      return false;
    }

    // 3. Register into tournament state
    const regId = 'REG-2026-' + Math.floor(1000 + Math.random() * 9000);
    const regDate = new Date().toLocaleDateString(isEn ? 'en-US' : 'bn-BD');

    if (typeof tournamentConfig === 'undefined' || !tournamentConfig) {
      window.tournamentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }
    if (!Array.isArray(tournamentConfig.teams)) {
      tournamentConfig.teams = JSON.parse(JSON.stringify(DEFAULT_TEAMS));
    }

    // Check if team already exists
    let existingTeam = tournamentConfig.teams.find(t => {
      const tName = typeof t === 'string' ? t : (t && t.name ? t.name : '');
      return tName.toLowerCase() === teamName.toLowerCase();
    });
    let groupAssigned = 'A';

    if (existingTeam) {
      // Update existing team
      if (typeof existingTeam === 'object') {
        existingTeam.manager = manager;
        existingTeam.phone = phone;
        existingTeam.coach = coach;
        existingTeam.jerseyColor = jerseyColor;
        existingTeam.feeStatus = existingTeam.feeStatus || 'due';
        existingTeam.regId = regId;
        existingTeam.regDate = regDate;
        groupAssigned = existingTeam.group || 'A';
      }
    } else {
      // Create new team
      const teamIdx = tournamentConfig.teams.length + 1;
      const numGroups = tournamentConfig.tournamentType === 'groups'
        ? (tournamentConfig.teams.length >= 11 ? 4 : (tournamentConfig.teams.length >= 8 ? 3 : 2))
        : 1;
      const grpLetters = ['A', 'B', 'C', 'D'].slice(0, numGroups);
      groupAssigned = grpLetters[(teamIdx - 1) % grpLetters.length] || 'A';

      const newTeamObj = {
        id: 'team_' + Date.now(),
        name: teamName,
        group: groupAssigned,
        manager: manager,
        phone: phone,
        coach: coach,
        jerseyColor: jerseyColor,
        feeStatus: 'due',
        regId: regId,
        regDate: regDate,
        paymentNote: paymentNote
      };

      tournamentConfig.teams.push(newTeamObj);
      tournamentConfig.teamCount = tournamentConfig.teams.length;
    }

    // Also store details in teamDetails mapping
    if (!tournamentConfig.teamDetails) {
      tournamentConfig.teamDetails = {};
    }
    tournamentConfig.teamDetails[teamName] = {
      manager: manager,
      phone: phone,
      coach: coach,
      jerseyColor: jerseyColor,
      feeStatus: 'due',
      regId: regId,
      regDate: regDate,
      paymentNote: paymentNote
    };

    // 4. Update teamRosters
    if (typeof teamRosters === 'undefined') {
      window.teamRosters = {};
    }

    teamRosters[teamName] = {
      group: 'গ্রুপ ' + groupAssigned,
      manager: manager,
      phone: phone,
      coach: coach,
      jerseyColor: jerseyColor,
      feeStatus: 'due',
      regId: regId,
      regDate: regDate,
      paymentNote: paymentNote,
      players: players
    };

    // 5. Persist and Re-generate structure
    if (typeof saveTournamentConfig === 'function') {
      saveTournamentConfig({
        teams: tournamentConfig.teams,
        teamCount: tournamentConfig.teams.length,
        teamDetails: tournamentConfig.teamDetails
      });
    }

    if (typeof saveRosters === 'function') {
      saveRosters();
    }

    // Update dynamic views
    if (typeof recalculateAll === 'function') {
      recalculateAll();
    }
    if (typeof renderPage2TeamTabs === 'function') {
      renderPage2TeamTabs();
    }

    // Update wizard if tempWizardTeams exists
    if (typeof tempWizardTeams !== 'undefined' && Array.isArray(tempWizardTeams)) {
      if (!tempWizardTeams.some(t => (t.name || '').toLowerCase() === teamName.toLowerCase())) {
        tempWizardTeams.push({
          id: 'team_' + Date.now(),
          name: teamName,
          group: groupAssigned,
          manager: manager,
          phone: phone,
          feeStatus: 'due'
        });
        if (typeof updateWizardStructureSummary === 'function') updateWizardStructureSummary();
        if (typeof renderWizardTeamsDashboard === 'function') renderWizardTeamsDashboard();
      }
    }

    // 6. Show Registration Slip / Confirmation Screen
    currentRegSlipData = {
      regId: regId,
      regDate: regDate,
      teamName: teamName,
      group: groupAssigned,
      manager: manager,
      phone: phone,
      coach: coach,
      jerseyColor: jerseyColor,
      feeStatus: 'due',
      paymentNote: paymentNote,
      players: players
    };

    displayRegistrationSlip(currentRegSlipData);
    return true;
  }

  function displayRegistrationSlip(data) {
    const formSection = document.getElementById('reg-form-section');
    const successSection = document.getElementById('reg-success-section');
    const slipContainer = document.getElementById('reg-slip-container');

    if (formSection) formSection.style.display = 'none';
    if (successSection) successSection.style.display = 'block';

    if (!slipContainer) return;

    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
    const cfg = (typeof tournamentConfig !== 'undefined' && tournamentConfig) ? tournamentConfig : {};

    let playersHtml = '';
    data.players.forEach(p => {
      const roleBadge = p.role === 'C' ? ' <span class="badge-role badge-c">(C)</span>' : (p.role === 'GK' ? ' <span class="badge-role badge-gk">(GK)</span>' : '');
      playersHtml += `
        <tr>
          <td style="text-align:center; font-weight:700;">${p.no}</td>
          <td style="text-align:center; font-weight:800; color:#0284c7;">#${p.jersey}</td>
          <td style="font-weight:700;">${p.name}${roleBadge}</td>
          <td style="font-size:11px; color:#64748b;">${p.role === 'C' ? (isEn ? 'Captain' : 'অধিনায়ক') : (p.role === 'GK' ? (isEn ? 'Goalkeeper' : 'গোলরক্ষক') : (isEn ? 'Player' : 'খেলোয়াড়'))}</td>
        </tr>
      `;
    });

    slipContainer.innerHTML = `
      <div class="reg-slip-card" id="printable-reg-slip">
        <!-- Slip Header -->
        <div class="reg-slip-header">
          <div style="font-size:11px; font-weight:800; text-transform:uppercase; color:#0284c7; letter-spacing:1px;" data-i18n="reg.slip_title">দলীয় অফিশিয়াল নিবন্ধন স্লিপ (Registration Slip)</div>
          <h3 style="margin:4px 0; font-size:16px; color:#0f172a;">${cfg.title || 'ফুটবল টুর্নামেন্ট ২০২৬'}</h3>
          <div style="font-size:11px; color:#64748b;">🚩 ${cfg.organizer || 'টুর্নামেন্ট পরিচালনা পরিষদ'} • 📍 ${cfg.venue || 'স্টেডিয়াম মাঠ'}</div>
        </div>

        <!-- Slip Meta Bar -->
        <div class="reg-slip-meta-grid">
          <div>
            <small style="color:#64748b;" data-i18n="reg.lbl_reg_id">নিবন্ধন আইডি:</small>
            <div style="font-weight:900; color:#0284c7; font-size:13.5px;">${data.regId}</div>
          </div>
          <div>
            <small style="color:#64748b;" data-i18n="reg.lbl_reg_date">নিবন্ধনের তারিখ:</small>
            <div style="font-weight:700; color:#0f172a;">${data.regDate}</div>
          </div>
          <div>
            <small style="color:#64748b;" data-i18n="reg.lbl_fee_status">এন্ট্রি ফি স্ট্যাটাস:</small>
            <div style="font-weight:800; color:#d97706;" data-i18n="reg.status_due">🟡 বাকি (Due)</div>
          </div>
        </div>

        <!-- Team & Management Details -->
        <div class="reg-slip-team-info">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #cbd5e1; padding-bottom:6px; margin-bottom:6px;">
            <span style="font-size:14px; font-weight:900; color:#0f172a;">⚽ ${data.teamName}</span>
            <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:12px; font-weight:800; font-size:11px;">গ্রুপ ${data.group}</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:11.5px;">
            <div><strong>ম্যানেজার:</strong> ${data.manager} (${data.phone})</div>
            <div><strong>কোচ:</strong> ${data.coach || 'উল্লেখ নেই'}</div>
            <div><strong>জার্সির রঙ:</strong> ${data.jerseyColor || 'স্বাভাবিক'}</div>
            <div><strong>পেমেন্ট নোট:</strong> ${data.paymentNote || 'মাঠে পরিশোধ'}</div>
          </div>
        </div>

        <!-- Squad List Table -->
        <div style="margin-top:10px;">
          <div style="font-weight:800; font-size:12px; margin-bottom:4px; color:#0f172a;" data-i18n="reg.sec_squad">👥 স্কোয়াড খেলোয়াড়দের তালিকা (${data.players.length} জন):</div>
          <table class="reg-slip-table">
            <thead>
              <tr>
                <th style="width:35px; text-align:center;">ক্রমিক</th>
                <th style="width:50px; text-align:center;">জার্সি নং</th>
                <th>খেলোয়াড়ের পূর্ণ নাম</th>
                <th style="width:90px;">ভূমিকা</th>
              </tr>
            </thead>
            <tbody>
              ${playersHtml}
            </tbody>
          </table>
        </div>

        <!-- Footer Signatures -->
        <div class="reg-slip-footer">
          <div style="text-align:center;">
            <div style="border-top:1px dashed #94a3b8; width:130px; margin:0 auto; padding-top:2px;">টিম ম্যানেজারের স্বাক্ষর</div>
          </div>
          <div style="text-align:center;">
            <div style="border-top:1px dashed #94a3b8; width:140px; margin:0 auto; padding-top:2px;">আয়োজক কমিটির সিল ও স্বাক্ষর</div>
          </div>
        </div>
      </div>
    `;
  }

  function printRegistrationSlip() {
    window.print();
  }

  function shareRegistrationOnWhatsApp() {
    if (!currentRegSlipData) return;
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
    const cfg = (typeof tournamentConfig !== 'undefined' && tournamentConfig) ? tournamentConfig : {};

    const msg = isEn
      ? `⚽ Official Team Registration Submitted!\n🏆 Tournament: ${cfg.title || 'Football 2026'}\n📋 Team: ${currentRegSlipData.teamName}\n👤 Manager: ${currentRegSlipData.manager} (${currentRegSlipData.phone})\n🔖 Registration ID: ${currentRegSlipData.regId}\n👥 Total Squad Players: ${currentRegSlipData.players.length}\n💳 Entry Fee: ${cfg.entryFee || '2000 BDT'} (Due)`
      : `⚽ অফিশিয়াল দল নিবন্ধন সম্পন্ন হয়েছে!\n🏆 টুর্নামেন্ট: ${cfg.title || 'ফুটবল টুর্নামেন্ট ২০২৬'}\n📋 দলের নাম: ${currentRegSlipData.teamName}\n👤 ম্যানেজার: ${currentRegSlipData.manager} (${currentRegSlipData.phone})\n🔖 নিবন্ধন আইডি: ${currentRegSlipData.regId}\n👥 স্কোয়াড খেলোয়াড়: ${currentRegSlipData.players.length} জন\n💳 এন্ট্রি ফি: ${cfg.entryFee || '২,০০০ টাকা'} (বাকি)`;

    const waUrl = 'https://wa.me/?text=' + encodeURIComponent(msg);
    window.open(waUrl, '_blank');
  }

  // Export to global scope
  window.openTeamRegistrationModal = openTeamRegistrationModal;
  window.closeTeamRegistrationModal = closeTeamRegistrationModal;
  window.addRegistrationPlayerRow = addRegistrationPlayerRow;
  window.removeRegistrationPlayerRow = removeRegistrationPlayerRow;
  window.copyRegistrationLink = copyRegistrationLink;
  window.submitTeamRegistration = submitTeamRegistration;
  window.printRegistrationSlip = printRegistrationSlip;
  window.shareRegistrationOnWhatsApp = shareRegistrationOnWhatsApp;
  window.initRegistrationModule = initRegistrationModule;

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRegistrationModule);
  } else {
    initRegistrationModule();
  }

})(typeof window !== 'undefined' ? window : global);
