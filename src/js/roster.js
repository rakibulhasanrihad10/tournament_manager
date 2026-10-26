// ========================================================
// PAGE 2 ROSTER & RULES MANAGEMENT
// ========================================================

function renderPage2TeamTabs() {
  const container = document.getElementById('p2-dynamic-team-tabs');
  if (!container) return;

  const teams = typeof getActiveTeams === 'function' ? getActiveTeams() : DEFAULT_TEAMS;
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  if (!teams || teams.length === 0) return;

  // Ensure currentRosterTeam is valid
  if (!teams.some(t => t.name === currentRosterTeam)) {
    currentRosterTeam = teams[0].name;
  }

  // Group teams
  const groupsMap = new Map();
  teams.forEach(t => {
    const grp = t.group || 'A';
    if (!groupsMap.has(grp)) groupsMap.set(grp, []);
    groupsMap.get(grp).push(t);
  });

  const grpClasses = { 'A': 'ga', 'B': 'gb', 'C': 'gc', 'D': 'gd', 'KO': 'ga' };

  let html = `<span style="font-size:10px; font-weight:800; color:#475569;">${isEn ? 'Select Team:' : 'দল নির্বাচন:'}</span>`;

  groupsMap.forEach((tms, grp) => {
    const cls = grpClasses[grp] || 'ga';
    const grpLabel = grp === 'KO' ? (isEn ? 'Knockout' : 'নকআউট') : (isEn ? `Group ${grp}` : `গ্রুপ ${grp}`);
    html += `<span class="p2-grp-label ${cls}">${grpLabel}</span>`;
    tms.forEach(t => {
      const activeClass = (t.name === currentRosterTeam) ? 'active' : '';
      html += `<button type="button" class="p2-team-tab ${activeClass}" id="tab-btn-${escapeHtml(t.name)}" onclick="switchRosterTeam('${escapeHtml(t.name)}')">${escapeHtml(t.name)}</button>`;
    });
  });

  container.innerHTML = html;
  switchRosterTeam(currentRosterTeam);
}

function switchRosterTeam(teamName) {
      currentRosterTeam = teamName;

      // Update active tab styling
      document.querySelectorAll('.p2-team-tab').forEach(b => b.classList.remove('active'));
      const activeBtn = document.getElementById('tab-btn-' + teamName);
      if (activeBtn) activeBtn.classList.add('active');

      const data = teamRosters[teamName] || { group: '', manager: '', phone: '', players: [] };

      // Update Header info
      const nameDisp = document.getElementById('roster-team-name-display');
      const grpDisp = document.getElementById('roster-group-display');
      const mgrInp = document.getElementById('roster-manager-input');
      const phoneInp = document.getElementById('roster-phone-input');

      if (nameDisp) nameDisp.textContent = teamName;
      if (grpDisp) grpDisp.textContent = data.group || '';
      if (mgrInp) mgrInp.value = data.manager || '';
      if (phoneInp) phoneInp.value = data.phone || '';

      // Render 11 players table
      const tbody = document.getElementById('roster-players-tbody');
      if (tbody) {
        const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
        const namePlaceholder = isEn ? 'Enter player name...' : 'খেলোয়াড়ের নাম লিখুন...';
        let rowsHtml = '';
        for (let i = 1; i <= 11; i++) {
          const p = data.players.find(x => x.no === i) || { no: i, jersey: i, name: '' };
          rowsHtml += '<tr>' +
            '<td style="text-align:center; font-weight:700; color:#64748b;">' + i + '</td>' +
            '<td style="text-align:center;"><input type="number" class="player-input-jersey" id="p-jersey-' + i + '" value="' + (p.jersey || i) + '" min="1" max="99" oninput="saveCurrentRoster()"></td>' +
            '<td><input type="text" class="player-input-text" id="p-name-' + i + '" value="' + (p.name || '') + '" placeholder="' + namePlaceholder + '" oninput="saveCurrentRoster()"></td>' +
          '</tr>';
        }
        tbody.innerHTML = rowsHtml;
      }
    }

    function saveCurrentRoster() {
      if (!teamRosters[currentRosterTeam]) {
        teamRosters[currentRosterTeam] = { group: '', manager: '', phone: '', players: [] };
      }

      const mgrInp = document.getElementById('roster-manager-input');
      const phoneInp = document.getElementById('roster-phone-input');
      if (mgrInp) teamRosters[currentRosterTeam].manager = mgrInp.value.trim();
      if (phoneInp) teamRosters[currentRosterTeam].phone = phoneInp.value.trim();

      const players = [];
      for (let i = 1; i <= 11; i++) {
        const jEl = document.getElementById('p-jersey-' + i);
        const nEl = document.getElementById('p-name-' + i);
        const jerseyVal = jEl ? parseInt(jEl.value, 10) || i : i;
        const nameVal = nEl ? nEl.value.trim() : '';
        players.push({ no: i, jersey: jerseyVal, name: nameVal || ('খেলোয়াড় ' + i) });
      }
      teamRosters[currentRosterTeam].players = players;

      saveRosters();

      // If an event modal is open, refresh dropdowns
      if (activeModalMatchId) {
        populateModalDropdowns(activeModalMatchId);
      }
    }

    // ========================================================
    // MATCH EVENTS MODAL (GOALS & FAIR PLAY CARDS)
    // ========================================================

function renderPage2RulesList() {
      const listEl = document.getElementById('tournament-rules-list');
      if (!listEl) return;

      const selectedSet = new Set(tournamentConfig.selectedRules || []);
      const activeMasterRules = MASTER_RULES_CATALOG.filter(r => selectedSet.has(r.id));
      const activeCustomRules = tournamentConfig.customRules || [];

      if (activeMasterRules.length === 0 && activeCustomRules.length === 0) {
        const emptyMsg = typeof t === 'function' ? t('page2.no_rules_selected') : 'কোনো বিশেষ নিয়মাবলী সেট করা হয়নি।';
        listEl.innerHTML = `<li><em>${emptyMsg}</em></li>`;
        return;
      }

      let html = '';
      activeMasterRules.forEach(r => {
        const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
        const title = (isEn && r.titleEn) ? r.titleEn : r.title;
        const desc = (isEn && r.descEn) ? r.descEn : r.desc;
        html += `<li><span class="rules-highlight">${escapeHtml(title)}:</span> ${escapeHtml(desc)}</li>`;
      });

      activeCustomRules.forEach(cr => {
        html += `<li><span class="rules-highlight">${escapeHtml(cr.title)}:</span> ${escapeHtml(cr.desc)}</li>`;
      });

      listEl.innerHTML = html;
    }

    // ========================================================
    // TOURNAMENT SETUP WIZARD CONTROLLER
    // ========================================================