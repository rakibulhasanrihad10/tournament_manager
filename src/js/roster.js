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

  // Render 11 players table with Live Performance Badges
  const tbody = document.getElementById('roster-players-tbody');
  if (tbody) {
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
    const namePlaceholder = isEn ? 'Enter player name...' : 'খেলোয়াড়ের নাম লিখুন...';
    let rowsHtml = '';
    
    // Compute team totals
    let teamGoals = 0;
    let teamYellows = 0;
    let teamReds = 0;

    for (let i = 1; i <= 11; i++) {
      const p = (data.players && data.players.find(x => x.no === i)) || { no: i, jersey: i, name: '' };
      const pName = (p.name || '').trim();

      // Look up events for this player in this team
      let pGoals = 0;
      let pYellows = 0;
      let pReds = 0;

      if (pName && typeof matchEvents !== 'undefined') {
        for (const mId in matchEvents) {
          (matchEvents[mId] || []).forEach(e => {
            if (e.team === teamName && e.player === pName) {
              if (e.type === 'goal') {
                const count = e.count || 1;
                pGoals += count;
                teamGoals += count;
              }
              if (e.type === 'card' && e.cardType === 'yellow') {
                pYellows++;
                teamYellows++;
              }
              if (e.type === 'card' && e.cardType === 'red') {
                pReds++;
                teamReds++;
              }
            }
          });
        }
      }

      let perfHtml = '';
      if (pGoals > 0) {
        perfHtml += `<span class="perf-badge perf-badge-goal" title="${isEn ? 'Goals: ' : 'গোল: '}${pGoals}">⚽ ${pGoals}</span> `;
      }
      if (pYellows > 0) {
        perfHtml += `<span class="perf-badge perf-badge-yellow" title="${isEn ? 'Yellow Card: ' : 'হলুদ কার্ড: '}${pYellows}">🟨 ${pYellows}</span> `;
      }
      if (pReds > 0) {
        perfHtml += `<span class="perf-badge perf-badge-red" title="${isEn ? 'Red Card (Suspended)' : 'লাল কার্ড (নিষিদ্ধ)'}">🟥 ${isEn ? 'Suspended' : 'নিষিদ্ধ'}</span> `;
      }
      if (!perfHtml) {
        perfHtml = '<span class="perf-none">-</span>';
      }

      const escName = typeof escapeHtml === 'function' ? escapeHtml(p.name || '') : (p.name || '');

      rowsHtml += '<tr>' +
        '<td style="text-align:center; font-weight:700; color:#64748b;">' + i + '</td>' +
        '<td style="text-align:center;"><input type="number" class="player-input-jersey" id="p-jersey-' + i + '" value="' + (p.jersey || i) + '" min="1" max="99" oninput="saveCurrentRoster()"></td>' +
        '<td><input type="text" class="player-input-text" id="p-name-' + i + '" value="' + escName + '" placeholder="' + namePlaceholder + '" oninput="saveCurrentRoster()"></td>' +
        '<td style="text-align:center;">' + perfHtml + '</td>' +
      '</tr>';
    }
    tbody.innerHTML = rowsHtml;

    // Update Team Stats Strip
    const stripTeamEl = document.getElementById('p2-strip-team-name');
    const stripGoalsEl = document.getElementById('p2-strip-team-goals');
    const stripYellowsEl = document.getElementById('p2-strip-team-yellows');
    const stripRedsEl = document.getElementById('p2-strip-team-reds');
    if (stripTeamEl) stripTeamEl.textContent = teamName;
    if (stripGoalsEl) stripGoalsEl.textContent = teamGoals;
    if (stripYellowsEl) stripYellowsEl.textContent = teamYellows;
    if (stripRedsEl) stripRedsEl.textContent = teamReds;
  }

  // Update Page 2 Operations Hub
  if (typeof renderPage2OperationsHub === 'function') {
    renderPage2OperationsHub();
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

  if (typeof renderPage2OperationsHub === 'function') {
    renderPage2OperationsHub();
  }
}

// ========================================================
// PAGE 2 OPERATIONS HUB: TOP SCORERS & DISCIPLINE TRACKER
// ========================================================

function renderPage2OperationsHub(playerGoalsInput, teamStatsInput) {
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;

  // 1. TOP SCORERS LEADERBOARD
  const topScorersEl = document.getElementById('p2-top-scorers-container');
  if (topScorersEl) {
    let topScorersList = [];
    if (playerGoalsInput && Object.keys(playerGoalsInput).length > 0) {
      topScorersList = Object.values(playerGoalsInput).sort((a, b) => b.goals - a.goals);
    } else if (typeof matchEvents !== 'undefined') {
      const goalsMap = {};
      for (const mId in matchEvents) {
        (matchEvents[mId] || []).forEach(e => {
          if (e.type === 'goal') {
            const key = e.player + ' (' + e.team + ')';
            if (!goalsMap[key]) goalsMap[key] = { name: e.player, team: e.team, goals: 0 };
            goalsMap[key].goals += (e.count || 1);
          }
        });
      }
      topScorersList = Object.values(goalsMap).sort((a, b) => b.goals - a.goals);
    }

    if (topScorersList.length === 0) {
      topScorersEl.innerHTML = `
        <div style="padding:12px 10px; text-align:center; color:#64748b; font-size:11px;">
          <span>⚽ ${isEn ? 'No goals logged yet. Goals entered in match scoreboard will automatically appear here.' : 'কোনো গোল এখনো নথিভুক্ত হয়নি। ম্যাচে গোল এন্ট্রি করলে শীর্ষ গোলদাতাদের তালিকা এখানে রিয়েল-টাইমে দেখাবে।'}</span>
        </div>
      `;
    } else {
      const medals = ['🥇', '🥈', '🥉'];
      let html = '<table style="width:100%; border-collapse:collapse; font-size:11px;">';
      html += `
        <thead>
          <tr style="background:#f1f5f9; color:#475569; border-bottom:1px solid #cbd5e1; text-align:left;">
            <th style="padding:3px 6px; width:12%; text-align:center;">#</th>
            <th style="padding:3px 6px; width:48%;">${isEn ? 'Player' : 'খেলোয়াড়'}</th>
            <th style="padding:3px 6px; width:25%;">${isEn ? 'Team' : 'দল'}</th>
            <th style="padding:3px 6px; width:15%; text-align:center;">${isEn ? 'Goals' : 'গোল'}</th>
          </tr>
        </thead>
        <tbody>
      `;
      topScorersList.slice(0, 6).forEach((p, idx) => {
        const medal = medals[idx] || (idx + 1);
        const bg = idx % 2 === 0 ? '#fff' : '#f8fafc';
        html += `
          <tr style="background:${bg}; border-bottom:1px solid #e2e8f0;">
            <td style="padding:4px 6px; text-align:center; font-weight:700;">${medal}</td>
            <td style="padding:4px 6px; font-weight:700; color:#072a60;">${esc(p.name)}</td>
            <td style="padding:4px 6px; color:#475569;">${esc(p.team)}</td>
            <td style="padding:4px 6px; text-align:center; font-weight:800; color:#15803d;"><span class="perf-badge perf-badge-goal">⚽ ${p.goals}</span></td>
          </tr>
        `;
      });
      html += '</tbody></table>';
      topScorersEl.innerHTML = html;
    }
  }

  // 2. DISCIPLINE & SUSPENSION WATCH
  const disciplineEl = document.getElementById('p2-discipline-container');
  if (disciplineEl) {
    const cardHolders = {};
    if (typeof matchEvents !== 'undefined') {
      for (const mId in matchEvents) {
        (matchEvents[mId] || []).forEach(e => {
          if (e.type === 'card') {
            const key = e.player + ' (' + e.team + ')';
            if (!cardHolders[key]) cardHolders[key] = { name: e.player, team: e.team, yellows: 0, reds: 0 };
            if (e.cardType === 'yellow') cardHolders[key].yellows++;
            if (e.cardType === 'red') cardHolders[key].reds++;
          }
        });
      }
    }

    const cardList = Object.values(cardHolders);
    const suspendedPlayers = cardList.filter(p => p.reds > 0 || p.yellows >= 2);

    let html = '';
    // Suspension alert banner if any
    if (suspendedPlayers.length > 0) {
      html += `
        <div style="background:#fef2f2; border:1px solid #f87171; border-radius:6px; padding:6px 8px; margin-bottom:6px;">
          <strong style="color:#991b1b; font-size:10.5px; display:flex; align-items:center; gap:5px;">
            <span>⚠️</span> <span>${isEn ? 'Suspensions (Next Match):' : 'শৃঙ্খলাজনিত নিষেধাজ্ঞা (পরবর্তী ম্যাচে নিষিদ্ধ):'}</span>
          </strong>
          <div style="margin-top:4px; display:flex; flex-wrap:wrap; gap:4px;">
            ${suspendedPlayers.map(p => `
              <span class="perf-badge perf-badge-suspended">
                🚫 ${esc(p.name)} (${esc(p.team)}) — ${p.reds > 0 ? (isEn ? 'Red Card' : 'লাল কার্ড') : (isEn ? '2 Yellows' : '২ হলুদ কার্ড')}
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (cardList.length === 0) {
      html += `
        <div style="padding:12px 10px; text-align:center; color:#15803d; font-size:11px; background:#f0fdf4; border-radius:6px;">
          <span>✅ ${isEn ? 'No cards issued yet. All teams maintaining full fair play!' : 'এখনো কোনো কার্ড দেওয়া হয়নি। সকল দল ও খেলোয়াড় পূর্ণ ফেয়ার প্লে বজায় রাখছে!'}</span>
        </div>
      `;
    } else {
      html += '<table style="width:100%; border-collapse:collapse; font-size:10.5px;">';
      html += `
        <thead>
          <tr style="background:#f8fafc; color:#475569; border-bottom:1px solid #cbd5e1; text-align:left;">
            <th style="padding:3px 6px; width:45%;">${isEn ? 'Player' : 'খেলোয়াড়'}</th>
            <th style="padding:3px 6px; width:30%;">${isEn ? 'Team' : 'দল'}</th>
            <th style="padding:3px 6px; width:12%; text-align:center;">🟨</th>
            <th style="padding:3px 6px; width:13%; text-align:center;">🟥</th>
          </tr>
        </thead>
        <tbody>
      `;
      cardList.slice(0, 5).forEach((p, idx) => {
        const bg = idx % 2 === 0 ? '#fff' : '#f8fafc';
        html += `
          <tr style="background:${bg}; border-bottom:1px solid #f1f5f9;">
            <td style="padding:3px 6px; font-weight:700;">${esc(p.name)}</td>
            <td style="padding:3px 6px; color:#475569;">${esc(p.team)}</td>
            <td style="padding:3px 6px; text-align:center; font-weight:800; color:#b45309;">${p.yellows > 0 ? p.yellows : '-'}</td>
            <td style="padding:3px 6px; text-align:center; font-weight:800; color:#b91c1c;">${p.reds > 0 ? p.reds : '-'}</td>
          </tr>
        `;
      });
      html += '</tbody></table>';
    }
    disciplineEl.innerHTML = html;
  }

  // 3. TOURNAMENT OVERVIEW
  const overviewEl = document.getElementById('p2-overview-container');
  if (overviewEl) {
    let totalGoals = 0;
    let totalYellows = 0;
    let totalReds = 0;
    if (typeof matchEvents !== 'undefined') {
      for (const mId in matchEvents) {
        (matchEvents[mId] || []).forEach(e => {
          if (e.type === 'goal') totalGoals += (e.count || 1);
          if (e.type === 'card' && e.cardType === 'yellow') totalYellows++;
          if (e.type === 'card' && e.cardType === 'red') totalReds++;
        });
      }
    }

    const activeTeams = typeof getActiveTeams === 'function' ? getActiveTeams() : (typeof DEFAULT_TEAMS !== 'undefined' ? DEFAULT_TEAMS : []);
    const totalTeamsCount = activeTeams.length || 0;

    overviewEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; gap:6px; text-align:center;">
        <div style="flex:1; background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:6px 4px;">
          <div style="font-size:9.5px; color:#64748b; font-weight:700;">${isEn ? 'Active Teams' : 'দলসমূহ'}</div>
          <div style="font-size:13.5px; font-weight:900; color:#072a60; margin-top:2px;">👥 ${totalTeamsCount}</div>
        </div>
        <div style="flex:1; background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:6px 4px;">
          <div style="font-size:9.5px; color:#64748b; font-weight:700;">${isEn ? 'Tournament Goals' : 'টুর্নামেন্ট গোল'}</div>
          <div style="font-size:13.5px; font-weight:900; color:#15803d; margin-top:2px;">⚽ ${totalGoals}</div>
        </div>
        <div style="flex:1; background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:6px 4px;">
          <div style="font-size:9.5px; color:#64748b; font-weight:700;">${isEn ? 'Total Cards' : 'মোট কার্ড'}</div>
          <div style="font-size:13.5px; font-weight:900; color:#b45309; margin-top:2px;">🟨 ${totalYellows} &nbsp; 🟥 ${totalReds}</div>
        </div>
      </div>
    `;
  }
}

function openTournamentRulesModal() {
  const modal = document.getElementById('tournament-rules-modal');
  if (modal) {
    if (typeof renderPage2RulesList === 'function') renderPage2RulesList();
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

function closeTournamentRulesModal() {
  const modal = document.getElementById('tournament-rules-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
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
// ========================================================
// BLANK SQUAD REGISTRATION FORM (PRINTABLE HANDWRITTEN SHEET)
// Exact match to official tournament entry sheet layout
// Optimized for A4 Portrait Single-Page with Starting/Bench Split & Custom Graphics
// ========================================================

let blankRosterConfig = null;
let blankRosterImages = {
  leftType: 'default_ball',
  rightType: 'default_stadium',
  customLeft: null,
  customRight: null
};

if (typeof localStorage !== 'undefined') {
  try {
    const savedLeft = localStorage.getItem('tm_blank_roster_img_left');
    const savedRight = localStorage.getItem('tm_blank_roster_img_right');
    const savedLeftType = localStorage.getItem('tm_blank_roster_type_left');
    const savedRightType = localStorage.getItem('tm_blank_roster_type_right');
    if (savedLeft) blankRosterImages.customLeft = savedLeft;
    if (savedRight) blankRosterImages.customRight = savedRight;
    if (savedLeftType) blankRosterImages.leftType = savedLeftType;
    if (savedRightType) blankRosterImages.rightType = savedRightType;

    const savedConfig = localStorage.getItem('tm_blank_roster_config');
    if (savedConfig) {
      blankRosterConfig = JSON.parse(savedConfig);
    }
  } catch (e) {}
}

function getBlankRosterLogoHtml(side) {
  const type = side === 'left' ? blankRosterImages.leftType : blankRosterImages.rightType;
  const custom = side === 'left' ? blankRosterImages.customLeft : blankRosterImages.customRight;

  if (type === 'custom' && custom) {
    return `<img src="${custom}" alt="${side} logo" style="max-width:100%; max-height:58px; object-fit:contain; border-radius:4px;">`;
  }

  if (side === 'left') {
    if (type === 'trophy') {
      return `<svg viewBox="0 0 80 80" width="65" height="55" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 18 h36 v22 c0 11 -8 18 -18 18 s-18 -7 -18 -18 Z" fill="#f59e0b" stroke="#072a60" stroke-width="2.5"/>
        <path d="M22 24 C10 24 10 38 22 40" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
        <path d="M58 24 C70 24 70 38 58 40" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
        <rect x="36" y="58" width="8" height="10" fill="#d97706" stroke="#072a60" stroke-width="2"/>
        <rect x="26" y="68" width="28" height="8" rx="2" fill="#072a60"/>
        <polygon points="40,26 43,33 50,33 44,37 46,44 40,40 34,44 36,37 30,33 37,33" fill="#ffffff"/>
      </svg>`;
    }
    if (type === 'star') {
      return `<svg viewBox="0 0 80 80" width="65" height="55" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="32" fill="#072a60" stroke="#16a34a" stroke-width="3"/>
        <circle cx="40" cy="40" r="26" fill="#15803d"/>
        <polygon points="40,20 46,32 59,33 49,42 52,55 40,48 28,55 31,42 21,33 34,32" fill="#fef08a"/>
      </svg>`;
    }
    // default_ball: Football with dynamic green and blue motion swooshes (exact match to user picture!)
    return `<svg viewBox="0 0 100 80" width="75" height="58" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22 Q 35 18 64 26" stroke="#16a34a" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M2 38 Q 30 36 68 40" stroke="#0284c7" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M8 54 Q 38 50 62 55" stroke="#16a34a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="70" cy="38" r="22" fill="#ffffff" stroke="#072a60" stroke-width="2.5"/>
      <polygon points="70,26 79,32 76,42 64,42 61,32" fill="#072a60"/>
      <line x1="70" y1="26" x2="70" y2="16" stroke="#072a60" stroke-width="2"/>
      <line x1="79" y1="32" x2="89" y2="28" stroke="#072a60" stroke-width="2"/>
      <line x1="76" y1="42" x2="86" y2="51" stroke="#072a60" stroke-width="2"/>
      <line x1="64" y1="42" x2="54" y2="51" stroke="#072a60" stroke-width="2"/>
      <line x1="61" y1="32" x2="51" y2="26" stroke="#072a60" stroke-width="2"/>
    </svg>`;
  } else {
    // Right side
    if (type === 'kick') {
      return `<svg viewBox="0 0 110 70" width="85" height="54" xmlns="http://www.w3.org/2000/svg">
        <circle cx="85" cy="25" r="14" fill="#fff" stroke="#072a60" stroke-width="2"/>
        <polygon points="85,18 89,21 88,26 82,26 81,21" fill="#072a60"/>
        <path d="M15 55 L 45 40 L 65 30 L 72 26" stroke="#0284c7" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M30 62 L 45 40 L 40 22 L 52 12" stroke="#16a34a" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      </svg>`;
    }
    if (type === 'sponsor') {
      return `<svg viewBox="0 0 110 70" width="85" height="54" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="14" width="90" height="42" rx="8" fill="#f8fafc" stroke="#0284c7" stroke-width="2"/>
        <circle cx="40" cy="35" r="10" fill="#072a60"/>
        <circle cx="70" cy="35" r="10" fill="#16a34a"/>
        <path d="M40 35 Q 55 45 70 35" stroke="#f59e0b" stroke-width="3" fill="none"/>
      </svg>`;
    }
    // default_stadium: Futuristic Qatar stadium dome artwork (exact match to user picture!)
    return `<svg viewBox="0 0 120 75" width="95" height="58" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="54" rx="55" ry="17" fill="none" stroke="#0284c7" stroke-width="2.5"/>
      <ellipse cx="60" cy="50" rx="46" ry="13" fill="#f0f9ff" stroke="#072a60" stroke-width="2"/>
      <path d="M12 48 Q 60 18 108 48" stroke="#072a60" stroke-width="2.5" fill="none"/>
      <line x1="30" y1="36" x2="30" y2="55" stroke="#0284c7" stroke-width="1.8"/>
      <line x1="45" y1="28" x2="45" y2="54" stroke="#0284c7" stroke-width="1.8"/>
      <line x1="60" y1="24" x2="60" y2="54" stroke="#0284c7" stroke-width="2"/>
      <line x1="75" y1="28" x2="75" y2="54" stroke="#0284c7" stroke-width="1.8"/>
      <line x1="90" y1="36" x2="90" y2="55" stroke="#0284c7" stroke-width="1.8"/>
      <line x1="18" y1="44" x2="8" y2="28" stroke="#072a60" stroke-width="2"/>
      <line x1="102" y1="44" x2="112" y2="28" stroke="#072a60" stroke-width="2"/>
      <polygon points="5,28 13,28 9,23" fill="#16a34a"/>
      <polygon points="107,28 115,28 111,23" fill="#16a34a"/>
    </svg>`;
  }
}

function getBlankRosterBottomAccentHtml() {
  return `
    <div style="margin-top: 6px; position: relative; text-align: center; height: 24px; overflow: hidden;">
      <svg viewBox="0 0 600 28" width="100%" height="24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,24 250,24 265,4 0,4" fill="#16a34a"/>
        <polygon points="12,27 242,27 254,9 12,9" fill="#072a60"/>
        <circle cx="300" cy="14" r="11" fill="#ffffff" stroke="#072a60" stroke-width="2"/>
        <polygon points="300,8 304,11 302,16 298,16 296,11" fill="#072a60"/>
        <polygon points="350,24 600,24 600,4 335,4" fill="#16a34a"/>
        <polygon points="358,27 588,27 588,9 346,9" fill="#072a60"/>
      </svg>
    </div>
  `;
}

function openBlankRosterConfigModal() {
  const modal = document.getElementById('blank-roster-config-modal');
  if (!modal) return;

  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const startingVal = (blankRosterConfig && blankRosterConfig.startingPlayers) || parseInt(c.startingPlayers, 10) || 11;
  const benchVal = (blankRosterConfig && blankRosterConfig.benchPlayers) || parseInt(c.benchPlayers, 10) || 5;

  const startSel = document.getElementById('blank-roster-starting-select');
  const benchSel = document.getElementById('blank-roster-bench-select');
  if (startSel) startSel.value = String(startingVal);
  if (benchSel) benchSel.value = String(benchVal);

  const leftSel = document.getElementById('blank-roster-left-logo-select');
  const rightSel = document.getElementById('blank-roster-right-logo-select');
  if (leftSel) leftSel.value = blankRosterImages.leftType || 'default_ball';
  if (rightSel) rightSel.value = blankRosterImages.rightType || 'default_stadium';

  updateBlankRosterLogoPreview('left');
  updateBlankRosterLogoPreview('right');

  renderBlankRosterRulesChecklist();
  onBlankRosterConfigChange();

  modal.classList.add('active');
}

function closeBlankRosterConfigModal() {
  const modal = document.getElementById('blank-roster-config-modal');
  if (modal) modal.classList.remove('active');
}

function onBlankRosterLogoTypeChange(side) {
  const sel = document.getElementById(`blank-roster-${side}-logo-select`);
  const fileWrap = document.getElementById(`blank-roster-${side}-file-wrap`);
  const type = sel ? sel.value : (side === 'left' ? 'default_ball' : 'default_stadium');

  if (side === 'left') blankRosterImages.leftType = type;
  else blankRosterImages.rightType = type;

  if (fileWrap) {
    fileWrap.style.display = (type === 'custom') ? 'block' : 'none';
  }

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(`tm_blank_roster_type_${side}`, type);
    } catch (e) {}
  }

  updateBlankRosterLogoPreview(side);
}

function handleBlankRosterImageUpload(side, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (typeof FileReader !== 'undefined') {
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      if (side === 'left') {
        blankRosterImages.customLeft = dataUrl;
        blankRosterImages.leftType = 'custom';
        if (typeof localStorage !== 'undefined') {
          try { localStorage.setItem('tm_blank_roster_img_left', dataUrl); } catch(err) {}
        }
      } else {
        blankRosterImages.customRight = dataUrl;
        blankRosterImages.rightType = 'custom';
        if (typeof localStorage !== 'undefined') {
          try { localStorage.setItem('tm_blank_roster_img_right', dataUrl); } catch(err) {}
        }
      }
      updateBlankRosterLogoPreview(side);
    };
    reader.readAsDataURL(file);
  }
}

function updateBlankRosterLogoPreview(side) {
  const preview = document.getElementById(`blank-roster-${side}-logo-preview`);
  if (preview) {
    preview.innerHTML = getBlankRosterLogoHtml(side);
  }
}

function renderBlankRosterRulesChecklist() {
  const container = document.getElementById('blank-roster-rules-checklist');
  if (!container) return;

  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const masterRules = typeof MASTER_RULES_CATALOG !== 'undefined' ? MASTER_RULES_CATALOG : [];
  const customRules = c.customRules || [];
  const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;

  // Determine which rules should be checked initially
  let checkedSet;
  if (blankRosterConfig && blankRosterConfig.selectedRules) {
    checkedSet = new Set(blankRosterConfig.selectedRules);
  } else if (c.selectedRules && c.selectedRules.length > 0) {
    checkedSet = new Set(c.selectedRules);
  } else {
    const defRules = masterRules.filter(r => r.defaultSelected);
    checkedSet = new Set(defRules.map(r => r.id));
  }

  let html = '';
  masterRules.forEach(r => {
    const isChecked = checkedSet.has(r.id) ? 'checked' : '';
    const title = (isEn && r.titleEn) ? r.titleEn : r.title;
    const catIcon = r.categoryIcon || '📋';
    html += `
      <label class="br-rule-item-card" style="display:flex; align-items:flex-start; gap:10px; padding:8px 12px; border:1px solid #e2e8f0; border-radius:6px; background:#f8fafc; font-size:12px; cursor:pointer; transition:all 0.15s ease;">
        <input type="checkbox" class="br-rule-chk" value="${r.id}" ${isChecked} onchange="updateRuleBudgetMeter()" style="margin-top:2px; width:16px; height:16px; accent-color:#16a34a; cursor:pointer;">
        <div style="flex:1;">
          <span style="font-weight:700; color:#072a60; font-size:12px; display:block; margin-bottom:2px;">${catIcon} ${esc(title)}</span>
          <span style="display:block; font-size:10.5px; color:#64748b; line-height:1.35;">${esc((isEn && r.descEn) ? r.descEn : r.desc)}</span>
        </div>
      </label>
    `;
  });

  customRules.forEach((cr, idx) => {
    const customId = cr.id || `custom_${idx}`;
    const isChecked = checkedSet.has(customId) ? 'checked' : '';
    html += `
      <label class="br-rule-item-card" style="display:flex; align-items:flex-start; gap:10px; padding:8px 12px; border:1px solid #fed7aa; border-radius:6px; background:#fff7ed; font-size:12px; cursor:pointer; transition:all 0.15s ease;">
        <input type="checkbox" class="br-rule-chk" value="${customId}" ${isChecked} onchange="updateRuleBudgetMeter()" style="margin-top:2px; width:16px; height:16px; accent-color:#ea580c; cursor:pointer;">
        <div style="flex:1;">
          <span style="font-weight:700; color:#c2410c; font-size:12px; display:block; margin-bottom:2px;">⭐ ${esc(cr.title)}</span>
          <span style="display:block; font-size:10.5px; color:#64748b; line-height:1.35;">${esc(cr.desc)}</span>
        </div>
      </label>
    `;
  });

  container.innerHTML = html;
  updateRuleBudgetMeter();
}

function onBlankRosterConfigChange() {
  const startSel = document.getElementById('blank-roster-starting-select');
  const benchSel = document.getElementById('blank-roster-bench-select');
  const summaryEl = document.getElementById('blank-roster-squad-summary');

  const start = parseInt(startSel ? startSel.value : 11, 10) || 11;
  const bench = parseInt(benchSel ? benchSel.value : 5, 10) || 5;
  const total = start + bench;

  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  if (summaryEl) {
    summaryEl.innerHTML = isEn
      ? `📝 Total Squad: <strong>${total} Players</strong> (${start} Starters + ${bench} Substitutes)`
      : `📝 সর্বমোট স্কোয়াড: <strong>${total} জন</strong> (${start} জন মূল + ${bench} জন বিকল্প)`;
  }
}

function getSelectedBlankRosterRuleIds() {
  const checkboxes = document.querySelectorAll('.br-rule-chk:checked');
  const ids = [];
  checkboxes.forEach(cb => ids.push(cb.value));
  return ids;
}

function updateRuleBudgetMeter() {
  const meterEl = document.getElementById('blank-roster-rule-budget-meter');
  if (!meterEl) return;

  const selectedCount = getSelectedBlankRosterRuleIds().length;
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  if (selectedCount === 0) {
    meterEl.style.background = '#f1f5f9';
    meterEl.style.color = '#475569';
    meterEl.style.border = '1px solid #cbd5e1';
    meterEl.innerHTML = isEn
      ? 'ℹ️ No rules selected (Rules card on print sheet will be empty).'
      : 'ℹ️ কোনো নিয়ম নির্বাচন করা হয়নি (প্রিন্ট শিটে নিয়মের কার্ড খালি থাকবে)।';
  } else if (selectedCount <= 7) {
    meterEl.style.background = '#dcfce7';
    meterEl.style.color = '#166534';
    meterEl.style.border = '1px solid #86efac';
    meterEl.innerHTML = isEn
      ? `✅ <strong>Perfect 1-Page Fit:</strong> ${selectedCount}/7 rules selected (A4 Portrait single page guaranteed).`
      : `✅ <strong>নিখুঁত ১-পেজ ফিট:</strong> ${selectedCount}/৭টি নিয়ম নির্বাচিত (A4 পোর্ট্রেটে ১ পেজের মধ্যেই থাকবে)।`;
  } else if (selectedCount === 8) {
    meterEl.style.background = '#fef9c3';
    meterEl.style.color = '#854d0e';
    meterEl.style.border = '1px solid #fde047';
    meterEl.innerHTML = isEn
      ? `ℹ️ <strong>Tight 1-Page Fit:</strong> ${selectedCount} rules selected (fits snugly on 1 page).`
      : `ℹ️ <strong>টাইট ১-পেজ ফিট:</strong> ${selectedCount}টি নিয়ম নির্বাচিত (১ পাতার শেষ সীমানা পর্যন্ত পূর্ণ থাকবে)।`;
  } else {
    meterEl.style.background = '#fee2e2';
    meterEl.style.color = '#991b1b';
    meterEl.style.border = '1px solid #fca5a5';
    meterEl.innerHTML = isEn
      ? `⚠️ <strong>Page Overflow Warning:</strong> ${selectedCount} rules selected. Too many rules may push to Page 2! (Recommended: 6–7 rules).`
      : `⚠️ <strong>পেজ ওভারফ্লো সতর্কতা:</strong> ${selectedCount}টি নিয়ম নির্বাচিত। অতিরিক্ত নিয়মের কারণে ২য় পেজে চলে যেতে পারে! (সর্বোচ্চ ৬–৭টি নিয়ম সুপারিশকৃত)।`;
  }
}

function autoFitBlankRosterRules() {
  const checkboxes = document.querySelectorAll('.br-rule-chk');
  checkboxes.forEach(cb => { cb.checked = false; });

  const priorityIds = ['r_squad_11', 'r_squad_minibar', 'r_report_15', 'r_referee_final', 'r_tiebreaker_pen', 'r_points_system', 'r_discipline_conduct'];
  let checkedCount = 0;

  priorityIds.forEach(id => {
    const cb = document.querySelector(`.br-rule-chk[value="${id}"]`);
    if (cb && checkedCount < 6) {
      cb.checked = true;
      checkedCount++;
    }
  });

  if (checkedCount < 6) {
    checkboxes.forEach(cb => {
      if (!cb.checked && checkedCount < 6) {
        cb.checked = true;
        checkedCount++;
      }
    });
  }

  updateRuleBudgetMeter();
}

function uncheckAllBlankRosterRules() {
  const checkboxes = document.querySelectorAll('.br-rule-chk');
  checkboxes.forEach(cb => { cb.checked = false; });
  updateRuleBudgetMeter();
}

function applyBlankRosterConfigAndPrint() {
  const startSel = document.getElementById('blank-roster-starting-select');
  const benchSel = document.getElementById('blank-roster-bench-select');

  const startingPlayers = parseInt(startSel ? startSel.value : 11, 10) || 11;
  const benchPlayers = parseInt(benchSel ? benchSel.value : 5, 10) || 5;
  const selectedRules = getSelectedBlankRosterRuleIds();

  blankRosterConfig = {
    startingPlayers,
    benchPlayers,
    selectedRules
  };

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('tm_blank_roster_config', JSON.stringify(blankRosterConfig));
    }
  } catch (e) {}

  renderBlankRosterSheet(blankRosterConfig);
  closeBlankRosterConfigModal();
  if (typeof printDocument === 'function') {
    printDocument('blank-roster');
  }
}

function generateBlankRosterSheetHtml(configOverride) {
  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const cfg = configOverride || blankRosterConfig || {};
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const tFn = typeof t === 'function' ? t : (k) => k;
  const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;

  const defaultTitle = isEn ? 'World Cup 2022' : 'World Cup 2022';
  const defaultOrg = isEn ? 'Fifa' : 'Fifa';
  const defaultVenue = isEn ? 'Qatar Stadium' : 'Qatar Stadium';

  // 1. Calculate dynamic Starting XI and Bench split
  const startingCount = parseInt(cfg.startingPlayers, 10) || parseInt(c.startingPlayers, 10) || 11;
  const benchCount = parseInt(cfg.benchPlayers, 10) || parseInt(c.benchPlayers, 10) || 5;
  const totalCount = startingCount + benchCount;

  // 2. Generate Starting XI Table Rows
  let starterRowsHtml = '';
  for (let i = 1; i <= startingCount; i++) {
    starterRowsHtml += `
      <tr class="player-row starter-row">
        <td class="player-sl-cell" style="width:10%; text-align:center; font-weight:700; color:#072a60; background:#f8fafc; border:1px solid #bfdbfe; height:26px;">${i}</td>
        <td class="player-name-cell blank-cell-write" style="width:64%; border:1px solid #bfdbfe; background:#fff;"></td>
        <td class="player-pos-cell blank-cell-write" style="width:26%; border:1px solid #bfdbfe; background:#fff;"></td>
      </tr>
    `;
  }

  // 3. Generate Bench/Substitutes Table Rows
  let benchRowsHtml = '';
  for (let i = startingCount + 1; i <= totalCount; i++) {
    benchRowsHtml += `
      <tr class="player-row bench-row">
        <td class="player-sl-cell bench-sl" style="width:10%; text-align:center; font-weight:700; color:#15803d; background:#f0fdf4; border:1px solid #bfdbfe; height:26px;">${i}</td>
        <td class="player-name-cell blank-cell-write" style="width:64%; border:1px solid #bfdbfe; background:#fff;"></td>
        <td class="player-pos-cell blank-cell-write" style="width:26%; border:1px solid #bfdbfe; background:#fff;"></td>
      </tr>
    `;
  }

  // 4. Resolve active rules
  let selectedRuleIds = cfg.selectedRules;
  if (selectedRuleIds === undefined || selectedRuleIds === null) {
    if (c.selectedRules && c.selectedRules.length > 0) {
      selectedRuleIds = [...c.selectedRules];
    } else if (typeof MASTER_RULES_CATALOG !== 'undefined' && MASTER_RULES_CATALOG.length > 0) {
      selectedRuleIds = MASTER_RULES_CATALOG.filter(r => r.defaultSelected).map(r => r.id);
    } else {
      selectedRuleIds = [];
    }
  } else if (!Array.isArray(selectedRuleIds)) {
    selectedRuleIds = [];
  }

  const masterCatalog = typeof MASTER_RULES_CATALOG !== 'undefined' ? MASTER_RULES_CATALOG : [];
  const customRules = c.customRules || [];
  const ruleIcons = ['⚽', '👥', '👤', '🚫', '⏱️', '🏆', '⭐', '📋', '🎯', '🚩', '🏅', '⚖️'];
  let rulesHtml = '';
  let ruleIdx = 1;

  if (selectedRuleIds.length > 0) {
    selectedRuleIds.forEach(ruleId => {
      // Find in master catalog
      const mr = masterCatalog.find(r => r.id === ruleId);
      if (mr) {
        const title = (isEn && mr.titleEn) ? mr.titleEn : mr.title;
        const desc = (isEn && mr.descEn) ? mr.descEn : mr.desc;
        const icon = mr.categoryIcon || ruleIcons[(ruleIdx - 1) % ruleIcons.length];
        rulesHtml += `
          <li style="list-style:none; margin-bottom:5px;">
            <div class="rule-ref-item" style="display:flex; align-items:flex-start; gap:8px;">
              <div class="rule-badge-num" style="min-width:20px; height:20px; border-radius:50%; background:#15803d; color:#fff; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center; margin-top:1px;">${ruleIdx}</div>
              <div style="flex:1;">
                <div style="font-size:10.5px; font-weight:800; color:#072a60; line-height:1.25;">
                  <span>${icon}</span> <span class="rules-highlight">${esc(title)}:</span>
                </div>
                <div style="font-size:9px; color:#334155; line-height:1.3; margin-top:1px;">
                  ${esc(desc)}
                </div>
              </div>
            </div>
          </li>
        `;
        ruleIdx++;
        return;
      }

      // Find in custom rules
      const cr = customRules.find((cr, idx) => (cr.id || `custom_${idx}`) === ruleId || cr.title === ruleId);
      if (cr) {
        const icon = ruleIcons[(ruleIdx - 1) % ruleIcons.length];
        rulesHtml += `
          <li style="list-style:none; margin-bottom:5px;">
            <div class="rule-ref-item" style="display:flex; align-items:flex-start; gap:8px;">
              <div class="rule-badge-num" style="min-width:20px; height:20px; border-radius:50%; background:#15803d; color:#fff; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center; margin-top:1px;">${ruleIdx}</div>
              <div style="flex:1;">
                <div style="font-size:10.5px; font-weight:800; color:#072a60; line-height:1.25;">
                  <span>${icon}</span> <span class="rules-highlight">${esc(cr.title)}:</span>
                </div>
                <div style="font-size:9px; color:#334155; line-height:1.3; margin-top:1px;">
                  ${esc(cr.desc)}
                </div>
              </div>
            </div>
          </li>
        `;
        ruleIdx++;
      }
    });
  } else if (cfg.selectedRules === undefined && (!c.selectedRules || c.selectedRules.length === 0)) {
    // 6 Standard reference rules only when clean slate and no rules configured
    const defaultRulesData = isEn ? [
      { icon: '⚽', title: 'Rules & Format', desc: `FIFA standard match with maximum ${totalCount} registered players (${startingCount} on-field + ${benchCount} substitutes). Only registered players may participate.` },
      { icon: '👥', title: 'Match Duration', desc: 'Standard match duration is 20-30 minutes per game. A 10-minute halftime/interval is provided between matches.' },
      { icon: '👤', title: 'Coach / Manager Residency', desc: 'Team coach and players must meet residency guidelines. Official identity documents will be verified on matchday.' },
      { icon: '🚫', title: 'Multiple Squad Registration Prohibited', desc: 'A player cannot register or play for more than one team in this tournament. Violation results in immediate disqualification.' },
      { icon: '⏱️', title: 'Schedule & Tie-Breaker', desc: 'Tied matches proceed directly to penalty shootouts (no extra time). Teams must report 15 minutes before kickoff.' },
      { icon: '🏆', title: 'Discipline & Sportsmanship', desc: 'Strict sportsmanship, team harmony and fair play must be maintained on and off the pitch. Referees decision is final.' }
    ] : [
      { icon: '⚽', title: 'খেলার নিয়ম ও উপস্থাপনা', desc: `ফিফা স্ট্যান্ডার্ড ফুটবল মাঠে প্রতি দলের সর্বোচ্চ ${startingCount} জন খেলোয়াড় (এবং অতিরিক্ত ${benchCount} জন) নিয়ে খেলা যাবে। এছাড়া ${totalCount} জন মূল ও অতিরিক্ত দলের তালিকায় থাকতে হবে।` },
      { icon: '👥', title: 'ম্যাচের সময়সীমা', desc: 'ম্যাচের প্রতিটি পর্বের ২০-৩০ মিনিট সময় নির্ধারিত। প্রয়োজনীয় সময়ে ১০ মিনিট বিরতি (পরবর্তী ম্যাচের প্রস্তুতির জন্য) প্রযোজ্য হতে পারে।' },
      { icon: '👤', title: 'কোচ/ম্যানেজার (Residency)', desc: 'খেলোয়াড়দের অবশ্যই নিয়ম অনুযায়ী নির্ধারিত এলাকার বাসিন্দা হতে হবে। পরিচয়পত্র ও সংশিষ্ট কাগজপত্র ম্যাচের দিন যাচাই করা হবে।' },
      { icon: '🚫', title: 'একাধিক দলে অংশগ্রহণ নিষেধ', desc: 'একজন খেলোয়াড় একাধিক দলে খেলতে পারবেন না। একই খেলোয়াড় কেবলমাত্র একটি দলের তালিকায় অন্তর্ভুক্ত থাকতে পারবে।' },
      { icon: '⏱️', title: 'ম্যাচের সময়সূচি ও টাইব্রেকার', desc: 'নির্ধারিত সময়ে খেলা ড্র হলে অতিরিক্ত সময় ছাড়া সরাসরি পেনাল্টি শুটআউটের ব্যবস্থা থাকবে। ১৫ মিনিট পূর্বে মাঠে রিপোর্ট করতে হবে।' },
      { icon: '🏆', title: 'শৃঙ্খলা ও ক্রীড়া-আচরণ', desc: 'মাঠে ও মাঠের বাইরে শৃঙ্খলা, দলীয়-সৌহার্দ্য এবং ফেয়ার প্লে বজায় রাখা সকলের দায়িত্ব। রেফারির চূড়ান্ত সিদ্ধান্ত মানতে হবে।' }
    ];

    defaultRulesData.forEach(r => {
      rulesHtml += `
        <li style="list-style:none; margin-bottom:5px;">
          <div class="rule-ref-item" style="display:flex; align-items:flex-start; gap:8px;">
            <div class="rule-badge-num" style="min-width:20px; height:20px; border-radius:50%; background:#15803d; color:#fff; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center; margin-top:1px;">${ruleIdx}</div>
            <div style="flex:1;">
              <div style="font-size:10.5px; font-weight:800; color:#072a60; line-height:1.25;">
                <span>${r.icon}</span> <span class="rules-highlight">${esc(r.title)}:</span>
              </div>
              <div style="font-size:9px; color:#334155; line-height:1.3; margin-top:1px;">
                ${esc(r.desc)}
              </div>
            </div>
          </div>
        </li>
      `;
      ruleIdx++;
    });
  }

  // Titles
  const starterTitle = isEn
    ? `Squad Player List (Total ${totalCount}: ${startingCount} Starters + ${benchCount} Subs)`
    : `খেলোয়াড়দের পূর্ণ নামের তালিকা (মোট ${totalCount} জন: ${startingCount} জন মূল + ${benchCount} জন অতিরিক্ত)`;

  const benchTitle = isEn
    ? `Substitutes / Bench Players (${benchCount} Players)`
    : `বিকল্প / অতিরিক্ত খেলোয়াড় (${benchCount} জন)`;

  return `
    <div class="page-blank-roster" style="width:100%; max-width:100%; padding:0; margin:0 auto; background:#fff; font-family:inherit; border:none; box-shadow:none;">
      <!-- TOP HEADER: LEFT LOGO, TITLE, RIGHT GRAPHIC -->
      <div class="blank-header-wrap" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:7px;">
        <div class="header-logo-left" style="width:80px; height:60px; display:flex; align-items:center; justify-content:center;">
          ${getBlankRosterLogoHtml('left')}
        </div>
        <div class="header-center" style="text-align:center; flex:1; padding:0 10px;">
          <h1 style="font-size:22px; font-weight:900; color:#072a60; margin:0 0 2px 0; letter-spacing:0.5px;">⚽ ${esc(c.title || defaultTitle)} ⚽</h1>
          <p style="font-size:11.5px; margin:0; color:#1e293b; font-weight:800;">
            <span>${tFn('page1.meta_organizer')}</span> <strong>${esc(c.organizer || defaultOrg)}</strong>
            &nbsp;&nbsp;|&nbsp;&nbsp; <span>${tFn('page1.meta_venue')}</span> <strong>${esc(c.venue || defaultVenue)}</strong>
          </p>
        </div>
        <div class="header-logo-right" style="width:95px; height:60px; display:flex; align-items:center; justify-content:center;">
          ${getBlankRosterLogoHtml('right')}
        </div>
      </div>

      <!-- TITLE BANNER -->
      <div class="page-title-banner" style="background:#072a60; color:#fff; text-align:center; padding:5px 12px; font-weight:800; font-size:13px; border-radius:6px; margin-bottom:8px; display:flex; align-items:center; justify-content:center; gap:8px;">
        <span>📝</span> <span>${tFn('blank_roster.banner_title')}</span>
      </div>

      <!-- TEAM DETAILS (HANDWRITTEN ENTRIES IN SOFT BLUE CARD) -->
      <div class="team-meta-container blank-team-meta-box" style="background:#f0f7ff; border:1.5px solid #93c5fd; border-radius:6px; padding:8px 14px; margin-bottom:8px;">
        <div class="blank-meta-row" style="display:flex; align-items:center; width:100%;">
          <div class="meta-item blank-meta-field" style="flex:1; display:flex; align-items:center; gap:10px;">
            <strong style="color:#072a60; font-size:12px; white-space:nowrap;">${tFn('blank_roster.team_name')}</strong>
            <span class="meta-line blank-write-line" style="flex:1; border-bottom:1.3px dotted #475569; height:18px;"></span>
          </div>
        </div>
      </div>

      <!-- TWO-COLUMN SPLIT LAYOUT (EXACT MATCH TO REFERENCE IMAGE) -->
      <div class="p2-layout" style="display:flex; gap:8px; align-items:flex-start; margin-bottom:8px;">
        
        <!-- LEFT COLUMN: SQUAD PLAYERS TABLES (CARD 1: STARTING XI, CARD 2: BENCH) -->
        <div class="p2-left" style="width:calc(54% - 4px); display:flex; flex-direction:column; justify-content:flex-start; gap:8px; background:transparent; border:none; padding:0;">
          
          <!-- CARD 1: STARTING PLAYERS TABLE -->
          <div class="roster-card starter-card" style="border:1.5px solid #93c5fd; border-radius:8px; overflow:hidden; background:#fff; width:100%;">
            <div class="roster-table-subheader starting-subheader" style="background:#072a60; color:#fff; padding:5px 8px; font-size:11px; font-weight:800; display:flex; align-items:center; gap:6px;">
              <span>👥</span> <span data-i18n="page2.roster_card_title">${starterTitle}</span>
            </div>
            <table class="player-table blank-roster-player-table" style="width:100%; border-collapse:collapse; font-size:11px; table-layout:fixed;">
              <colgroup>
                <col style="width:10%;">
                <col style="width:64%;">
                <col style="width:26%;">
              </colgroup>
              <thead>
                <tr style="background:#072a60; color:#fff; border-top:1px solid rgba(255,255,255,0.2);">
                  <th style="width:10%; padding:3px 4px; text-align:center;">${tFn('blank_roster.th_sl')}</th>
                  <th style="width:64%; padding:3px 8px; text-align:left;">${tFn('blank_roster.th_name')}</th>
                  <th style="width:26%; padding:3px 6px; text-align:center;">${tFn('blank_roster.th_pos')}</th>
                </tr>
              </thead>
              <tbody>
                ${starterRowsHtml}
              </tbody>
            </table>
          </div>

          <!-- CARD 2: BENCH / SUBSTITUTES TABLE -->
          ${benchCount > 0 ? `
          <div class="roster-card bench-card" style="border:1.5px solid #93c5fd; border-radius:8px; overflow:hidden; background:#fff; width:100%;">
            <div class="roster-table-subheader bench-subheader" style="background:#15803d; color:#fff; padding:4px 8px; font-size:10.5px; font-weight:800; display:flex; align-items:center; gap:6px;">
              <span>👥</span> <span>${benchTitle}</span>
            </div>
            <table class="player-table blank-roster-player-table" style="width:100%; border-collapse:collapse; font-size:11px; table-layout:fixed;">
              <colgroup>
                <col style="width:10%;">
                <col style="width:64%;">
                <col style="width:26%;">
              </colgroup>
              <tbody>
                ${benchRowsHtml}
              </tbody>
            </table>
          </div>
          ` : ''}
        </div>

        <!-- RIGHT COLUMN: RULES & GUIDELINES + BOTTOM SLOGAN RIBBON -->
        <div class="p2-right" style="width:calc(46% - 4px); border:1.5px solid #93c5fd; border-radius:8px; overflow:hidden; background:#fff; display:flex; flex-direction:column;">
          <!-- CARD HEADER -->
          <div style="background:#072a60; color:#fff; padding:5px 8px; font-size:11px; font-weight:800; display:flex; align-items:center; gap:6px;">
            <span>📄</span> <span data-i18n="page2.rules_card_title">${tFn('page2.rules_card_title')}</span>
          </div>

          <!-- RULES LIST WITH CIRCULAR GREEN NUMBER BADGES -->
          <div class="rules-card" style="padding:6px 8px; flex:1; display:flex; flex-direction:column; justify-content:space-between; background:#fff; border:none;">
            <ul class="rules-list" style="list-style:none; margin:0; padding:0; flex:1;">
              ${rulesHtml}
            </ul>

            <!-- SLOGAN RIBBON (EXACT MATCH TO GREEN SPORTS RIBBON) -->
            <div class="rule-slogan-ribbon" style="background:linear-gradient(90deg, #15803d, #16a34a); color:#fff; border-radius:20px; text-align:center; padding:5px 12px; font-weight:800; font-size:11.5px; margin-top:auto; display:flex; align-items:center; justify-content:center; gap:8px;">
              <span>⚽</span> <span>খেলায় থাকুক সৌহার্দ্য, জিতুক ফুটবল</span> <span>⚽</span>
            </div>
          </div>
        </div>

      </div>

      <!-- FOOTER DECLARATION BOX -->
      <div class="blank-roster-footer-box" style="background:#f0f7ff; border:1.5px solid #93c5fd; border-radius:6px; padding:6px 12px; font-size:10px; margin-bottom:8px;">
        <div style="font-size:9.5px; color:#1e293b; font-weight:700; line-height:1.4;">
          ${tFn('blank_roster.terms')}
        </div>
      </div>

      <!-- OFFICIAL DETAILS & SIGNATURES BLOCK (SPACIOUS THREE CARDS) -->
      <div class="sign-row blank-sign-row" style="display:flex; justify-content:space-between; gap:10px; margin-top:8px; margin-bottom:8px;">
        
        <!-- BLOCK 1: TEAM MANAGER -->
        <div class="sign-block blank-sign-block" style="flex:1; border:1.5px solid #93c5fd; background:#f0f7ff; border-radius:6px; padding:8px 10px; display:flex; flex-direction:column; justify-content:space-between; min-height:92px;">
          <div style="font-size:11px; font-weight:800; color:#072a60; border-bottom:1px solid #bfdbfe; padding-bottom:4px; margin-bottom:7px; display:flex; align-items:center; gap:5px;">
            <span>👤</span> <span>${tFn('blank_roster.manager_name')}</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
            <strong style="font-size:10.5px; color:#1e293b; white-space:nowrap;">${tFn('blank_roster.lbl_name')}</strong>
            <span class="meta-line blank-write-line" style="flex:1; border-bottom:1.3px dotted #475569; height:18px;"></span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
            <strong style="font-size:10.5px; color:#1e293b; white-space:nowrap;">${tFn('blank_roster.lbl_mobile')}</strong>
            <span class="meta-line blank-write-line" style="flex:1; border-bottom:1.3px dotted #475569; height:18px;"></span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin-top:auto; padding-top:4px; border-top:1px dashed #cbd5e1;">
            <strong style="font-size:10px; color:#475569; white-space:nowrap;">${tFn('blank_roster.lbl_sign')}</strong>
            <span class="sign-line blank-sign-line" style="flex:1; border-bottom:1.4px solid #072a60; height:16px;"></span>
          </div>
        </div>

        <!-- BLOCK 2: TEAM COACH -->
        <div class="sign-block blank-sign-block" style="flex:1; border:1.5px solid #93c5fd; background:#f0f7ff; border-radius:6px; padding:8px 10px; display:flex; flex-direction:column; justify-content:flex-start; min-height:92px;">
          <div style="font-size:11px; font-weight:800; color:#072a60; border-bottom:1px solid #bfdbfe; padding-bottom:4px; margin-bottom:7px; display:flex; align-items:center; gap:5px;">
            <span>📋</span> <span>${tFn('blank_roster.coach_name')}</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
            <strong style="font-size:10.5px; color:#1e293b; white-space:nowrap;">${tFn('blank_roster.lbl_name')}</strong>
            <span class="meta-line blank-write-line" style="flex:1; border-bottom:1.3px dotted #475569; height:18px;"></span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
            <strong style="font-size:10.5px; color:#1e293b; white-space:nowrap;">${tFn('blank_roster.lbl_mobile')}</strong>
            <span class="meta-line blank-write-line" style="flex:1; border-bottom:1.3px dotted #475569; height:18px;"></span>
          </div>
        </div>

        <!-- BLOCK 3: ORGANIZING COMMITTEE -->
        <div class="sign-block blank-sign-block" style="flex:1; border:1.5px solid #93c5fd; background:#f0f7ff; border-radius:6px; padding:8px 10px; display:flex; flex-direction:column; justify-content:space-between; min-height:92px;">
          <div style="font-size:11px; font-weight:800; color:#072a60; border-bottom:1px solid #bfdbfe; padding-bottom:4px; margin-bottom:7px; display:flex; align-items:center; gap:5px;">
            <span>🏛️</span> <span>${tFn('blank_roster.committee_name')}</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
            <strong style="font-size:10.5px; color:#1e293b; white-space:nowrap;">${tFn('blank_roster.lbl_name')}</strong>
            <span class="meta-line blank-write-line" style="flex:1; border-bottom:1.3px dotted #475569; height:18px;"></span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
            <strong style="font-size:10.5px; color:#1e293b; white-space:nowrap;">${tFn('blank_roster.lbl_mobile')}</strong>
            <span class="meta-line blank-write-line" style="flex:1; border-bottom:1.3px dotted #475569; height:18px;"></span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin-top:auto; padding-top:4px; border-top:1px dashed #cbd5e1;">
            <strong style="font-size:10px; color:#475569; white-space:nowrap;">${tFn('blank_roster.lbl_sign')}</strong>
            <span class="sign-line blank-sign-line" style="flex:1; border-bottom:1.4px solid #072a60; height:16px;"></span>
          </div>
        </div>

      </div>

      <!-- BOTTOM SPORTS GEOMETRIC FOOTER WITH SOCCER BALL -->
      ${getBlankRosterBottomAccentHtml()}
    </div>
  `;
}

function renderBlankRosterSheet(configOverride) {
  const container = document.getElementById('page-blank-roster');
  if (container) {
    container.innerHTML = generateBlankRosterSheetHtml(configOverride);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderPage2TeamTabs,
    switchRosterTeam,
    saveCurrentRoster,
    renderPage2RulesList,
    renderPage2OperationsHub,
    openTournamentRulesModal,
    closeTournamentRulesModal,
    openBlankRosterConfigModal,
    closeBlankRosterConfigModal,
    onBlankRosterConfigChange,
    onBlankRosterLogoTypeChange,
    handleBlankRosterImageUpload,
    updateRuleBudgetMeter,
    autoFitBlankRosterRules,
    uncheckAllBlankRosterRules,
    applyBlankRosterConfigAndPrint,
    generateBlankRosterSheetHtml,
    renderBlankRosterSheet
  };
}

    // ========================================================
    // TOURNAMENT SETUP WIZARD CONTROLLER
    // ========================================================