// ========================================================
// APPLICATION STATE & STORAGE PERSISTENCE
// ========================================================

let tournamentConfig = {};
let tempWizardSelectedRules = new Set();
let tempWizardCustomRules = [];

let teamRosters = {};
    let currentRosterTeam = 'মুড়িয়ারা';

    let matchScores = {};
    let penaltyWinners = {};
    let penaltyScores = {}; // { [matchId]: { p1: number|'', p2: number|'' } }
    let koScores = { 10: { s1: '', s2: '' }, 11: { s1: '', s2: '' }, 12: { s1: '', s2: '' }, 13: { s1: '', s2: '' } };
    let koPenWinners = {};
    let koPenScores = {}; // { [matchId]: { p1: number|'', p2: number|'' } }
    let matchEvents = {}; // { [matchId]: [ { id, team, player, type: 'goal'|'card', cardType?: 'yellow'|'red', count?: number } ] }

    let activeModalMatchId = null;

    // Initialization

function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // ========================================================
    // TOURNAMENT STRUCTURE ENGINE & UNIVERSAL GENERATOR
    // ========================================================
    function generateTournamentStructure(teamCount = 9, tournamentType = 'groups', teamsList = null) {
      const count = Math.max(2, parseInt(teamCount, 10) || 9);
      const type = tournamentType || 'groups';

      // 1. Resolve teams array
      let teams = [];
      if (Array.isArray(teamsList) && teamsList.length > 0) {
        teams = JSON.parse(JSON.stringify(teamsList)).slice(0, count);
      }
      while (teams.length < count) {
        const idx = teams.length + 1;
        const defaultTeam = (typeof DEFAULT_TEAMS !== 'undefined' && DEFAULT_TEAMS[idx - 1]) ? DEFAULT_TEAMS[idx - 1] : null;
        teams.push({
          id: 't' + idx,
          name: defaultTeam ? defaultTeam.name : ('দল ' + idx),
          group: 'A',
          manager: defaultTeam ? defaultTeam.manager : ('ম্যানেজার ' + idx),
          phone: defaultTeam ? defaultTeam.phone : '০১৭xxxxxxxx',
          feeStatus: defaultTeam ? defaultTeam.feeStatus : 'due'
        });
      }

      const defaultTimesBn = [
        'সন্ধ্যা ৬:০০', 'সন্ধ্যা ৬:৩০', 'রাত ৭:০০', 'রাত ৭:৩০',
        'রাত ৮:০০', 'রাত ৮:৩০', 'রাত ৯:০০', 'রাত ৯:৩০',
        'রাত ১০:০০', 'রাত ১০:৩০', 'রাত ১১:০০', 'রাত ১১:৩০',
        'রাত ১২:০০', 'রাত ১২:৩০', 'রাত ১:০০', 'রাত ১:৩০'
      ];
      const defaultTimesEn = [
        '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
        '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
        '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM',
        '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM'
      ];
      const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
      const times = isEn ? defaultTimesEn : defaultTimesBn;

      let groups = {};
      let matches = [];
      let summaryBn = '';
      let summaryEn = '';

      if (type === 'knockout') {
        // Direct Knockout (Single Elimination)
        let matchId = 1;
        for (let i = 0; i < teams.length; i += 2) {
          if (i + 1 < teams.length) {
            matches.push({
              id: matchId,
              group: 'KO',
              t1: teams[i].name,
              t2: teams[i + 1].name,
              time: times[(matchId - 1) % times.length],
              stage: 'Knockout Round'
            });
            matchId++;
          }
        }
        summaryBn = `সরাসরি নকআউট (হারলেই বাদ) • মোট ${count}টি দল • মোট ${matches.length}টি প্রাথমিক ম্যাচ ➔ সেমিফাইনাল ➔ ফাইনাল।`;
        summaryEn = `Direct Knockout • Total ${count} Teams • ${matches.length} Opening Matches ➔ Semi-Finals ➔ Final.`;

      } else if (type === 'league' || (type !== 'groups' && count <= 3)) {
        // Single League / Round Robin (1 Group)
        groups['A'] = teams.map(t => t.name);
        teams.forEach(t => { t.group = 'A'; });

        let matchId = 1;
        for (let i = 0; i < teams.length; i++) {
          for (let j = i + 1; j < teams.length; j++) {
            matches.push({
              id: matchId,
              group: 'A',
              t1: teams[i].name,
              t2: teams[j].name,
              time: times[(matchId - 1) % times.length],
              stage: 'League Stage'
            });
            matchId++;
          }
        }
        summaryBn = `একক লিগ পয়েন্ট টেবিল • মোট ${count}টি দল (গ্রুপ এ) • মোট ${matches.length}টি ম্যাচ • শীর্ষ ২ দল নিয়ে মেগা ফাইনাল।`;
        summaryEn = `Single League Standings • Total ${count} Teams (Group A) • Total ${matches.length} Matches • Top 2 contest Grand Final.`;

      } else {
        // Group Stage + Knockout
        let numGroups = 2;
        if (count >= 12) numGroups = 4;
        else if (count >= 9) numGroups = 3;
        else numGroups = 2;

        const groupLetters = ['A', 'B', 'C', 'D'].slice(0, numGroups);
        groupLetters.forEach(g => { groups[g] = []; });

        // Backward compatibility for standard 9-team default
        const isDefault9 = count === 9 && (typeof GROUPS !== 'undefined') &&
          teams.every(t => ['মুড়িয়ারা', 'নোয়াপাড়া', 'চিতড্ডা', 'মুকুন্দপুর', 'উত্তর ওড্ডা', 'দক্ষিণ ওড্ডা', 'বাতাবাড়িয়া', 'মোহাম্মদপুর', 'ভংগুয়া'].includes(t.name));

        if (isDefault9 && typeof GROUPS !== 'undefined' && typeof GROUP_MATCH_DEFS !== 'undefined') {
          groups = JSON.parse(JSON.stringify(GROUPS));
          matches = JSON.parse(JSON.stringify(GROUP_MATCH_DEFS));
          matches.forEach((m, idx) => { m.time = times[idx % times.length]; });
        } else {
          const teamsPerGroup = Math.ceil(teams.length / numGroups);
          teams.forEach((t, idx) => {
            const gIdx = Math.min(Math.floor(idx / teamsPerGroup), numGroups - 1);
            const g = groupLetters[gIdx];
            groups[g].push(t.name);
            t.group = g;
          });

          const grpPairings = {};
          groupLetters.forEach(g => {
            grpPairings[g] = [];
            const tms = groups[g];
            for (let i = 0; i < tms.length; i++) {
              for (let j = i + 1; j < tms.length; j++) {
                grpPairings[g].push({ t1: tms[i], t2: tms[j] });
              }
            }
          });

          let matchId = 1;
          let hasMore = true;
          let roundIdx = 0;
          while (hasMore) {
            hasMore = false;
            for (const g of groupLetters) {
              if (roundIdx < grpPairings[g].length) {
                const pair = grpPairings[g][roundIdx];
                matches.push({
                  id: matchId,
                  group: g,
                  t1: pair.t1,
                  t2: pair.t2,
                  time: times[(matchId - 1) % times.length],
                  stage: 'Group Stage'
                });
                matchId++;
                hasMore = true;
              }
            }
            roundIdx++;
          }
        }

        if (numGroups === 2) {
          summaryBn = `২টি গ্রুপ (${groups['A'].length}+${groups['B'].length} দল) • মোট ${matches.length}টি গ্রুপ ম্যাচ • সেমিফাইনাল (A1 বনাম B2, B1 বনাম A2) ➔ ফাইনাল।`;
          summaryEn = `2 Groups (${groups['A'].length}+${groups['B'].length} Teams) • Total ${matches.length} Group Matches • Semi-Finals (A1 vs B2, B1 vs A2) ➔ Final.`;
        } else if (numGroups === 3) {
          summaryBn = `৩টি গ্রুপ (প্রতি গ্রুপে ৩ দল) • মোট ${matches.length}টি গ্রুপ ম্যাচ • ৩ চ্যাম্পিয়ন + ১ সেরা রানার্স-আপ ➔ সেমিফাইনাল ➔ ফাইনাল।`;
          summaryEn = `3 Groups (3 Teams each) • Total ${matches.length} Group Matches • 3 Champions + 1 Best Runner-Up ➔ Semi-Finals ➔ Final.`;
        } else {
          summaryBn = `৪টি গ্রুপ • মোট ${matches.length}টি গ্রুপ ম্যাচ • কোয়ার্টার ফাইনাল / সেমিফাইনাল ➔ গ্র্যান্ড ফাইনাল।`;
          summaryEn = `4 Groups • Total ${matches.length} Group Matches • Knockout Stage ➔ Grand Final.`;
        }
      }

      return {
        tournamentType: type,
        teamCount: count,
        teams: teams,
        groups: groups,
        matches: matches,
        summaryBn: summaryBn,
        summaryEn: summaryEn
      };
    }

    function getActiveGroups() {
      if (tournamentConfig && tournamentConfig.generatedStructure && tournamentConfig.generatedStructure.groups && Object.keys(tournamentConfig.generatedStructure.groups).length > 0) {
        return tournamentConfig.generatedStructure.groups;
      }
      if (tournamentConfig && tournamentConfig.groups && Object.keys(tournamentConfig.groups).length > 0) {
        return tournamentConfig.groups;
      }
      return typeof GROUPS !== 'undefined' ? GROUPS : { 'A': [], 'B': [], 'C': [] };
    }

    function getActiveGroupMatches() {
      if (tournamentConfig && tournamentConfig.generatedStructure && Array.isArray(tournamentConfig.generatedStructure.matches) && tournamentConfig.generatedStructure.matches.length > 0) {
        return tournamentConfig.generatedStructure.matches;
      }
      if (tournamentConfig && Array.isArray(tournamentConfig.matches) && tournamentConfig.matches.length > 0) {
        return tournamentConfig.matches;
      }
      return typeof GROUP_MATCH_DEFS !== 'undefined' ? GROUP_MATCH_DEFS : [];
    }

    function getActiveTeams() {
      if (tournamentConfig && Array.isArray(tournamentConfig.teams) && tournamentConfig.teams.length > 0) {
        return tournamentConfig.teams;
      }
      return typeof DEFAULT_TEAMS !== 'undefined' ? DEFAULT_TEAMS : [];
    }

    // ========================================================
    // TOURNAMENT CONFIGURATION & PERSISTENCE
    // ========================================================
    function loadTournamentConfig() {
      const saved = localStorage.getItem('chitadda_tournament_config_2026');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Purge legacy Chitadda text from browser localStorage if present
          if (parsed && parsed.title && (parsed.title.includes('চিতড্ডা') || parsed.title.includes('Chitadda'))) {
            tournamentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            localStorage.setItem('chitadda_tournament_config_2026', JSON.stringify(tournamentConfig));
          } else {
            tournamentConfig = Object.assign({}, DEFAULT_CONFIG, parsed);
          }
          if (!Array.isArray(tournamentConfig.selectedRules)) {
            tournamentConfig.selectedRules = DEFAULT_CONFIG.selectedRules;
          }
          if (!Array.isArray(tournamentConfig.customRules)) {
            tournamentConfig.customRules = [];
          }
          if (!tournamentConfig.tournamentType) {
            tournamentConfig.tournamentType = 'groups';
          }
          if (!tournamentConfig.teamCount) {
            tournamentConfig.teamCount = 9;
          }
          if (!Array.isArray(tournamentConfig.teams) || tournamentConfig.teams.length === 0) {
            tournamentConfig.teams = JSON.parse(JSON.stringify(DEFAULT_TEAMS));
          }
          if (!tournamentConfig.generatedStructure) {
            tournamentConfig.generatedStructure = generateTournamentStructure(tournamentConfig.teamCount, tournamentConfig.tournamentType, tournamentConfig.teams);
          }
        } catch (e) {
          console.error('Error loading tournament config', e);
          tournamentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
          tournamentConfig.generatedStructure = generateTournamentStructure(9, 'groups', DEFAULT_TEAMS);
        }
      } else {
        tournamentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        tournamentConfig.generatedStructure = generateTournamentStructure(9, 'groups', DEFAULT_TEAMS);
      }
    }

    function saveTournamentConfig(newCfg) {
      tournamentConfig = Object.assign({}, tournamentConfig, newCfg);
      // Re-generate structure
      tournamentConfig.generatedStructure = generateTournamentStructure(
        tournamentConfig.teamCount || 9,
        tournamentConfig.tournamentType || 'groups',
        tournamentConfig.teams || DEFAULT_TEAMS
      );

      // Synchronize teamRosters with all teams in tournamentConfig.teams
      if (Array.isArray(tournamentConfig.teams)) {
        tournamentConfig.teams.forEach(t => {
          if (!teamRosters[t.name]) {
            const defRoster = (typeof DEFAULT_ROSTERS !== 'undefined' && DEFAULT_ROSTERS[t.name]) ? DEFAULT_ROSTERS[t.name] : null;
            teamRosters[t.name] = {
              group: t.group ? ('গ্রুপ ' + t.group) : '',
              manager: t.manager || '',
              phone: t.phone || '',
              feeStatus: t.feeStatus || 'due',
              players: defRoster ? defRoster.players : []
            };
          } else {
            if (t.manager) teamRosters[t.name].manager = t.manager;
            if (t.phone) teamRosters[t.name].phone = t.phone;
            if (t.feeStatus) teamRosters[t.name].feeStatus = t.feeStatus;
            if (t.group) teamRosters[t.name].group = 'গ্রুপ ' + t.group;
          }
        });
        saveRosters();
      }

      localStorage.setItem('chitadda_tournament_config_2026', JSON.stringify(tournamentConfig));
      applyTournamentConfig();
    }

    function applyTournamentConfig() {
      if (!tournamentConfig || !tournamentConfig.title) return;

      const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
      let activeCfg = tournamentConfig;
      if (isEn && tournamentConfig.title === DEFAULT_CONFIG.title && typeof DEFAULT_CONFIG_EN !== 'undefined') {
        activeCfg = Object.assign({}, DEFAULT_CONFIG_EN, {
          selectedRules: tournamentConfig.selectedRules,
          customRules: tournamentConfig.customRules
        });
      }

      const titleAccent = activeCfg.titleAccent || activeCfg.title;
      const titleRest = activeCfg.titleRest || '';

      const elAcc1 = document.getElementById('app-title-accent');
      if (elAcc1) elAcc1.textContent = titleAccent;
      const elRest1 = document.getElementById('app-title-rest');
      if (elRest1) elRest1.textContent = titleRest;

      const elAcc2 = document.getElementById('app-title-accent-p2');
      if (elAcc2) elAcc2.textContent = titleAccent;
      const elRest2 = document.getElementById('app-title-rest-p2');
      if (elRest2) elRest2.textContent = titleRest;

      const elOrg1 = document.getElementById('app-org-display');
      if (elOrg1) elOrg1.textContent = activeCfg.organizer || '';
      const elOrg2 = document.getElementById('app-org-display-p2');
      if (elOrg2) elOrg2.textContent = activeCfg.organizer || '';

      const elVen1 = document.getElementById('app-venue-display');
      if (elVen1) elVen1.textContent = activeCfg.venue || '';
      const elVen2 = document.getElementById('app-venue-display-p2');
      if (elVen2) elVen2.textContent = activeCfg.venue || '';

      const defaultTitle = isEn ? 'Football Tournament' : 'ফুটবল টুর্নামেন্ট';
      const defaultSuffix = isEn ? ' - Official Fixtures & Scoreboard' : ' - অফিসিয়াল ফিকশ্চার ও স্কোরবোর্ড';
      document.title = (activeCfg.title || defaultTitle) + defaultSuffix;

      if (typeof renderDynamicStandings === 'function') {
        renderDynamicStandings();
      }
      if (typeof renderDynamicSchedule === 'function') {
        renderDynamicSchedule();
      }
      if (typeof renderPage2TeamTabs === 'function') {
        renderPage2TeamTabs();
      }
      if (typeof renderPage2RulesList === 'function') {
        renderPage2RulesList();
      }
    }

function initAppState() {
      // -1. Initialize Internationalization (i18n)
      if (typeof initI18n === 'function') {
        initI18n();
      }

      // -2. Initialize System Theme & Sheet Print Theme
      if (typeof initTheme === 'function') {
        initTheme();
      }
      if (typeof initSheetTheme === 'function') {
        initSheetTheme();
      }

      // 0. Load & Apply Tournament Configuration & Selected Rules
      loadTournamentConfig();
      applyTournamentConfig();

      // 1. Load Rosters
      const savedRosters = localStorage.getItem('chitadda_tournament_rosters_2026');
      if (savedRosters) {
        try { teamRosters = JSON.parse(savedRosters); } catch(e) { teamRosters = DEFAULT_ROSTERS; }
      } else {
        teamRosters = JSON.parse(JSON.stringify(DEFAULT_ROSTERS));
      }

      // 2. Load Tournament Matches & Events State
      const savedState = localStorage.getItem('chitadda_app_state_2026');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          matchScores = parsed.matchScores || {};
          penaltyWinners = parsed.penaltyWinners || {};
          penaltyScores = parsed.penaltyScores || {};
          koScores = parsed.koScores || { 10: { s1: '', s2: '' }, 11: { s1: '', s2: '' }, 12: { s1: '', s2: '' }, 13: { s1: '', s2: '' } };
          koPenWinners = parsed.koPenWinners || {};
          koPenScores = parsed.koPenScores || {};
          matchEvents = parsed.matchEvents || {};
        } catch(e) { console.error('Error loading state', e); }
      }

      // 3. Render Page 2 Roster Form
      switchRosterTeam(currentRosterTeam);

      // 4. Populate match inputs
      populateInputsFromState();

      // 5. Recalculate Standings, Leaderboard & Fair Play
      recalculateAll();
    }

    function saveState() {
      const state = { matchScores, penaltyWinners, penaltyScores, koScores, koPenWinners, koPenScores, matchEvents };
      localStorage.setItem('chitadda_app_state_2026', JSON.stringify(state));
    }

    function saveRosters() {
      localStorage.setItem('chitadda_tournament_rosters_2026', JSON.stringify(teamRosters));
    }

    // ========================================================
    // PAGE 2: INTERACTIVE TEAM & PLAYER ROSTER SYSTEM
    // ========================================================