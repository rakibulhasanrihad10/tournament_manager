// ========================================================
// APP INITIALIZATION & GLOBAL HANDLERS
// ========================================================

function loadSampleTournamentData() {
      // 1. Group Stage Scores
      matchScores = {
        1: { s1: 2, s2: 1 }, // Mukundapur 2 - 1 Uttar Odda
        2: { s1: 3, s2: 0 }, // Muriyara 3 - 0 Noapara
        3: { s1: 2, s2: 1 }, // Batabariya 2 - 1 Mohammadpur
        4: { s1: 1, s2: 1 }, // Noapara 1 - 1 Chitadda (Draw -> Penalty)
        5: { s1: 2, s2: 0 }, // Uttar Odda 2 - 0 Dakshin Odda
        6: { s1: 1, s2: 0 }, // Mohammadpur 1 - 0 Bhangua
        7: { s1: 1, s2: 3 }, // Chitadda 1 - 3 Muriyara
        8: { s1: 1, s2: 3 }, // Dakshin Odda 1 - 3 Mukundapur
        9: { s1: 0, s2: 2 }  // Bhangua 0 - 2 Batabariya
      };
      penaltyWinners = { 4: 'চিতড্ডা' };
      penaltyScores = { 4: { p1: 2, p2: 3 } };

      // 2. Sample Match Events (Goals & Cards)
      matchEvents = {
        1: [
          { id: 101, type: 'goal', team: 'মুকুন্দপুর', player: 'তানভীর হোসেন', count: 1 },
          { id: 102, type: 'goal', team: 'মুকুন্দপুর', player: 'মুশফিকুর রহিম', count: 1 },
          { id: 103, type: 'goal', team: 'উত্তর ওড্ডা', player: 'সোহেল রানা', count: 1 },
          { id: 104, type: 'card', cardType: 'yellow', team: 'উত্তর ওড্ডা', player: 'জসীম উদ্দিন' }
        ],
        2: [
          { id: 201, type: 'goal', team: 'মুড়িয়ারা', player: 'মোঃ শাকিল আহমেদ', count: 2 },
          { id: 202, type: 'goal', team: 'মুড়িয়ারা', player: 'আরিফুল ইসলাম', count: 1 },
          { id: 203, type: 'card', cardType: 'yellow', team: 'নোয়াপাড়া', player: 'জাহিদুল ইসলাম' }
        ],
        3: [
          { id: 301, type: 'goal', team: 'বাতাবাড়িয়া', player: 'নাসির উদ্দিন', count: 2 },
          { id: 302, type: 'goal', team: 'মোহাম্মদপুর', player: 'তৌহিদুর রহমান', count: 1 }
        ],
        7: [
          { id: 701, type: 'goal', team: 'মুড়িয়ারা', player: 'মোঃ শাকিল আহমেদ', count: 2 },
          { id: 702, type: 'goal', team: 'মুড়িয়ারা', player: 'আরিফুল ইসলাম', count: 1 },
          { id: 703, type: 'goal', team: 'চিতড্ডা', player: 'ইমরান খান', count: 1 },
          { id: 704, type: 'card', cardType: 'yellow', team: 'চিতড্ডা', player: 'মাসুদ রানা' }
        ],
        8: [
          { id: 801, type: 'goal', team: 'মুকুন্দপুর', player: 'তানভীর হোসেন', count: 2 },
          { id: 802, type: 'goal', team: 'মুকুন্দপুর', player: 'মুশফিকুর রহিম', count: 1 },
          { id: 803, type: 'goal', team: 'দক্ষিণ ওড্ডা', player: 'আতিকুর রহমান', count: 1 },
          { id: 804, type: 'card', cardType: 'yellow', team: 'দক্ষিণ ওড্ডা', player: 'আলমগীর হোসেন' }
        ]
      };

      // 3. Knockout Scores
      koScores = {
        10: { s1: 2, s2: 1 }, // Semi 1
        11: { s1: 2, s2: 2 }, // Semi 2 (Draw -> Penalty)
        12: { s1: 2, s2: 0 }, // 3rd place
        13: { s1: 3, s2: 1 }  // Final
      };
      koPenWinners = { 11: 'বাতাবাড়িয়া' };
      koPenScores = { 11: { p1: 3, p2: 4 } };

      populateInputsFromState();
      recalculateAll();
      saveState();

      // Demo awards directly on Page 1
      const momPlayer = document.getElementById('p1-award-mom-player');
      const momTeam = document.getElementById('p1-award-mom-team');
      if (momPlayer) momPlayer.value = 'আরিফুল ইসলাম';
      if (momTeam) momTeam.value = 'মুড়িয়ারা';

      const gkPlayer = document.getElementById('p1-award-gk-player');
      const gkTeam = document.getElementById('p1-award-gk-team');
      if (gkPlayer) gkPlayer.value = 'নাজমুল হাসান (GK)';
      if (gkTeam) gkTeam.value = 'মুড়িয়ারা';

      savePage1Awards();
    }

    function resetTournamentData() {
      if (!confirm('আপনি কি টুর্নামেন্টের সমস্ত স্কোর, গোল ও কার্ড রিসেট করতে চান?')) return;
      matchScores = {};
      penaltyWinners = {};
      koScores = { 10: { s1: '', s2: '' }, 11: { s1: '', s2: '' }, 12: { s1: '', s2: '' }, 13: { s1: '', s2: '' } };
      koPenWinners = {};
      matchEvents = {};
      localStorage.removeItem('chitadda_app_state_2026');
      localStorage.removeItem('chitadda_tournament_config_2026');
      if (typeof loadTournamentConfig === 'function') loadTournamentConfig();
      if (typeof applyTournamentConfig === 'function') applyTournamentConfig();

      populateInputsFromState();
      recalculateAll();

      const p1TopPlayer = document.getElementById('p1-award-top-scorer-player');
      const p1TopTeam = document.getElementById('p1-award-top-scorer-team');
      const p1TopGoals = document.getElementById('p1-award-top-scorer-goals');
      if (p1TopPlayer) { p1TopPlayer.value = ''; p1TopPlayer.dataset.userEdited = 'false'; }
      if (p1TopTeam) { p1TopTeam.value = ''; p1TopTeam.dataset.userEdited = 'false'; }
      if (p1TopGoals) { p1TopGoals.value = ''; p1TopGoals.dataset.userEdited = 'false'; }

      const momPlayer = document.getElementById('p1-award-mom-player');
      const momTeam = document.getElementById('p1-award-mom-team');
      if (momPlayer) momPlayer.value = '';
      if (momTeam) momTeam.value = '';

      const gkPlayer = document.getElementById('p1-award-gk-player');
      const gkTeam = document.getElementById('p1-award-gk-team');
      if (gkPlayer) gkPlayer.value = '';
      if (gkTeam) gkTeam.value = '';

      try { localStorage.removeItem('chitadda_page1_awards_2026'); } catch (e) {}
    }

    function savePage1Awards() {
      if (typeof localStorage === 'undefined' || typeof document === 'undefined') return;
      try {
        const p1TopPlayer = document.getElementById('p1-award-top-scorer-player');
        const p1TopTeam = document.getElementById('p1-award-top-scorer-team');
        const p1TopGoals = document.getElementById('p1-award-top-scorer-goals');
        const momPlayer = document.getElementById('p1-award-mom-player');
        const momTeam = document.getElementById('p1-award-mom-team');
        const gkPlayer = document.getElementById('p1-award-gk-player');
        const gkTeam = document.getElementById('p1-award-gk-team');

        const awards = {
          topScorerPlayer: p1TopPlayer ? p1TopPlayer.value : '',
          topScorerTeam: p1TopTeam ? p1TopTeam.value : '',
          topScorerGoals: p1TopGoals ? p1TopGoals.value : '',
          topScorerUserEdited: p1TopPlayer ? (p1TopPlayer.dataset.userEdited === 'true') : false,
          momPlayer: momPlayer ? momPlayer.value : '',
          momTeam: momTeam ? momTeam.value : '',
          gkPlayer: gkPlayer ? gkPlayer.value : '',
          gkTeam: gkTeam ? gkTeam.value : ''
        };
        localStorage.setItem('chitadda_page1_awards_2026', JSON.stringify(awards));
      } catch (e) {}
    }

    function loadPage1Awards() {
      if (typeof localStorage === 'undefined' || typeof document === 'undefined') return;
      try {
        const raw = localStorage.getItem('chitadda_page1_awards_2026');
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.momPlayer && document.getElementById('p1-award-mom-player')) {
          document.getElementById('p1-award-mom-player').value = data.momPlayer;
        }
        if (data.momTeam && document.getElementById('p1-award-mom-team')) {
          document.getElementById('p1-award-mom-team').value = data.momTeam;
        }
        if (data.gkPlayer && document.getElementById('p1-award-gk-player')) {
          document.getElementById('p1-award-gk-player').value = data.gkPlayer;
        }
        if (data.gkTeam && document.getElementById('p1-award-gk-team')) {
          document.getElementById('p1-award-gk-team').value = data.gkTeam;
        }
        if (data.topScorerUserEdited) {
          const p1TopPlayer = document.getElementById('p1-award-top-scorer-player');
          const p1TopTeam = document.getElementById('p1-award-top-scorer-team');
          const p1TopGoals = document.getElementById('p1-award-top-scorer-goals');
          if (p1TopPlayer) { p1TopPlayer.value = data.topScorerPlayer || ''; p1TopPlayer.dataset.userEdited = 'true'; }
          if (p1TopTeam) { p1TopTeam.value = data.topScorerTeam || ''; p1TopTeam.dataset.userEdited = 'true'; }
          if (p1TopGoals) { p1TopGoals.value = data.topScorerGoals || ''; p1TopGoals.dataset.userEdited = 'true'; }
        }
      } catch (e) {}
    }

    function syncAwardsToPage1() {
      // Legacy wrapper for backwards compatibility
    }

    function syncAwardsFromPage1() {
      savePage1Awards();
    }

    function initAwardsSync() {
      if (typeof document === 'undefined') return;
      loadPage1Awards();

      const p1AwardIds = [
        'p1-award-top-scorer-player', 'p1-award-top-scorer-team', 'p1-award-top-scorer-goals',
        'p1-award-mom-player', 'p1-award-mom-team',
        'p1-award-gk-player', 'p1-award-gk-team'
      ];
      p1AwardIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && typeof el.addEventListener === 'function') {
          el.addEventListener('input', () => {
            if (id.includes('top-scorer')) {
              el.dataset.userEdited = 'true';
            }
            savePage1Awards();
          });
        }
      });
    }

// ========================================================
// THEME & COLOR MODE MANAGEMENT
// 1. System App Color Mode (Dark vs Light UI)
// 2. Document / Sheet Print Theme (Stadium Color vs White Paper)
// ========================================================

let currentAppTheme = 'dark';
let currentSheetTheme = 'paper';

// --- 1. SYSTEM APP COLOR MODE ---
function initTheme() {
  const hasWindow = typeof window !== 'undefined';
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('tournament_theme_mode') : null;
  if (saved === 'light' || saved === 'dark') {
    currentAppTheme = saved;
  } else {
    const prefersLight = hasWindow && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    currentAppTheme = prefersLight ? 'light' : 'dark';
  }
  setAppTheme(currentAppTheme, false);

  if (hasWindow && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (typeof localStorage !== 'undefined' && !localStorage.getItem('tournament_theme_mode')) {
        setAppTheme(e.matches ? 'light' : 'dark', false);
      }
    });
  }
}

function setAppTheme(theme, persist = true) {
  if (theme !== 'dark' && theme !== 'light') return;
  currentAppTheme = theme;
  if (persist && typeof localStorage !== 'undefined') {
    localStorage.setItem('tournament_theme_mode', theme);
  }

  // Set on root element for instant CSS token cascade
  if (typeof document !== 'undefined') {
    if (document.documentElement && typeof document.documentElement.setAttribute === 'function') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    if (document.body && typeof document.body.setAttribute === 'function') {
      document.body.setAttribute('data-theme', theme);
    }

    // Update switcher button states across all views
    if (typeof document.querySelectorAll === 'function') {
      document.querySelectorAll('.theme-btn-dark, #btn-theme-dark').forEach(b => {
        if (b && b.classList) b.classList.toggle('active', theme === 'dark');
      });
      document.querySelectorAll('.theme-btn-light, #btn-theme-light').forEach(b => {
        if (b && b.classList) b.classList.toggle('active', theme === 'light');
      });
    }
  }
}

function toggleAppTheme() {
  setAppTheme(currentAppTheme === 'dark' ? 'light' : 'dark', true);
}

// --- 2. DOCUMENT / PRINT SHEET THEME (Permanently White Paper) ---
function initSheetTheme() {
  currentSheetTheme = 'paper';
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('tournament_sheet_theme', 'paper');
  }
  setSheetTheme('paper', false);
}

function setSheetTheme(theme = 'paper', persist = true) {
  // Always enforce clean White Paper mode
  currentSheetTheme = 'paper';
  if (persist && typeof localStorage !== 'undefined') {
    localStorage.setItem('tournament_sheet_theme', 'paper');
  }

  if (typeof document !== 'undefined') {
    if (document.body && document.body.classList) {
      document.body.classList.add('sheet-theme-paper');
      document.body.classList.add('light-mode');
    }
    if (document.documentElement && document.documentElement.classList) {
      document.documentElement.classList.add('sheet-theme-paper');
    }
  }

  updateSheetThemeButtonText();
}

function toggleSheetTheme() {
  // Permanently fixed to white paper mode
  setSheetTheme('paper', true);
}

// Backward compatibility alias
function toggleColorMode() {
  toggleSheetTheme();
}

function updateSheetThemeButtonText() {
  if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return;
  const iconEl = document.getElementById('sheet-theme-icon');
  const labelEl = document.getElementById('sheet-theme-label');
  const btnEl = document.getElementById('btn-sheet-theme');
  if (!labelEl) return;

  const isPaper = currentSheetTheme === 'paper';
  if (iconEl) iconEl.textContent = isPaper ? '📄' : '🏟️';

  const key = isPaper ? 'nav.sheet_theme_paper' : 'nav.sheet_theme_stadium';
  const fallback = isPaper ? 'প্রিন্ট থিম: সাদা কাগজ' : 'প্রিন্ট থিম: স্টেডিয়াম কালার';
  const text = typeof t === 'function' ? t(key, fallback) : fallback;
  labelEl.textContent = text;

  if (btnEl && btnEl.classList) {
    btnEl.classList.toggle('active-paper', isPaper);
  }
}

// ========================================================
// ACTION BAR DROPDOWNS & ONBOARDING BANNER
// ========================================================

function toggleDropdown(dropdownId) {
  if (typeof document === 'undefined') return;
  const menu = document.getElementById(dropdownId);
  if (!menu) return;
  const isShown = menu.classList.contains('show');
  closeAllDropdowns();
  if (!isShown) {
    menu.classList.add('show');
    const wrap = menu.closest('.dropdown-wrap');
    if (wrap) wrap.classList.add('active');
  }
}

function closeAllDropdowns() {
  if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return;
  document.querySelectorAll('.dropdown-menu').forEach(m => { if (m && m.classList) m.classList.remove('show'); });
  document.querySelectorAll('.dropdown-wrap').forEach(w => { if (w && w.classList) w.classList.remove('active'); });
}

function dismissWelcomeBanner() {
  if (typeof document === 'undefined') return;
  const banner = document.getElementById('football-welcome-banner');
  if (banner) {
    banner.style.display = 'none';
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('tournament_welcome_dismissed', 'true');
  }
}

function initWelcomeBanner() {
  if (typeof document === 'undefined') return;
  const banner = document.getElementById('football-welcome-banner');
  if (!banner) return;
  const dismissed = (typeof localStorage !== 'undefined') ? localStorage.getItem('tournament_welcome_dismissed') : null;
  if (dismissed === 'true') {
    banner.style.display = 'none';
  } else {
    banner.style.display = 'block';
  }
}

// Global click listener to close dropdowns when clicking outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', function(e) {
    if (e.target && typeof e.target.closest === 'function') {
      if (!e.target.closest('.dropdown-wrap')) {
        closeAllDropdowns();
      }
    }
  });
}

function prepareBlankScoresheetForPrint() {
  if (typeof document === 'undefined') return;

  // 1. Group & Knockout match score inputs
  if (typeof document.querySelectorAll === 'function') {
    document.querySelectorAll('.score-input').forEach(inp => {
      if (inp) inp.value = '';
    });
    document.querySelectorAll('.ko-team-name').forEach(el => {
      if (el) el.textContent = '';
    });
  }

  // 2. Group match winners & penalty pickers
  for (let i = 1; i <= 9; i++) {
    const el1 = document.getElementById('m' + i + '-s1');
    const el2 = document.getElementById('m' + i + '-s2');
    if (el1) el1.value = '';
    if (el2) el2.value = '';
    const winEl = document.getElementById('m' + i + '-winner');
    if (winEl) winEl.textContent = '__________________';
    const penWrap = document.getElementById('m' + i + '-pen-wrap');
    if (penWrap && penWrap.style) penWrap.style.display = 'none';
  }

  // 3. Knockout matches & winners
  for (let m = 10; m <= 13; m++) {
    const el1 = document.getElementById('ko' + m + '-s1');
    const el2 = document.getElementById('ko' + m + '-s2');
    if (el1) el1.value = '';
    if (el2) el2.value = '';
    const winBox = (typeof document.querySelector === 'function' && document.querySelector('#ko' + m + '-winner .winner-blank-content')) || document.getElementById('ko' + m + '-winner');
    if (winBox) winBox.textContent = '';
    const penWrap = document.getElementById('ko' + m + '-pen-wrap');
    if (penWrap && penWrap.style) penWrap.style.display = 'none';
  }

  // 4. Knockout team advancement slots
  ['ko10-t1', 'ko10-t2', 'ko11-t1', 'ko11-t2', 'ko12-t1', 'ko12-t2', 'ko13-t1', 'ko13-t2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  // 5. Group Champions & Best Runner-Up displays
  ['champ-a-display', 'champ-b-display', 'champ-c-display', 'champ-d-display', 'best-ru-display'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  // 6. Standings Table Statistics (Completely blank cells for handwriting and erasing)
  ['A', 'B', 'C', 'D'].forEach(grpId => {
    const tbody = document.getElementById('tbody-group-' + grpId);
    if (!tbody || typeof tbody.querySelectorAll !== 'function') return;
    tbody.querySelectorAll('tr').forEach(tr => {
      const cells = tr.querySelectorAll('td');
      if (cells && cells.length >= 10) {
        // Strip medal emojis from team name if present
        if (cells[1]) {
          const strong = cells[1].querySelector ? cells[1].querySelector('strong') : null;
          const cleanName = strong ? strong.textContent.trim() : (cells[1].textContent || '').replace(/[\u{1F947}\u{1F948}\u{1F949}🥇🥈🥉]/gu, '').trim();
          cells[1].textContent = cleanName;
        }
        // User requested: leave PL, W, D, L, +/-, GD, FP, PTS, Form completely blank for handwriting & erasing
        if (cells[2]) cells[2].textContent = '';
        if (cells[3]) cells[3].textContent = '';
        if (cells[4]) cells[4].textContent = '';
        if (cells[5]) cells[5].textContent = '';
        if (cells[6]) cells[6].textContent = '';
        if (cells[7]) {
          cells[7].textContent = '';
          cells[7].className = 'gd-record';
        }
        if (cells.length >= 11) {
          if (cells[8]) {
            cells[8].textContent = '';
            cells[8].className = 'fp-record';
          }
          if (cells[9]) {
            cells[9].innerHTML = '';
          }
          if (cells[10]) {
            cells[10].innerHTML = '';
          }
        } else {
          if (cells[8]) {
            cells[8].innerHTML = '';
          }
          if (cells[9]) {
            cells[9].innerHTML = '';
          }
        }
      }
    });
  });

  // 7. Awards ceremony on Page 1
  ['p1-award-top-scorer-player', 'p1-award-top-scorer-team', 'p1-award-top-scorer-goals',
   'p1-award-mom-player', 'p1-award-mom-team', 'p1-award-gk-player', 'p1-award-gk-team'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (el.value !== undefined) el.value = '';
      el.textContent = '';
    }
  });
}

function printDocument(mode) {
      if (typeof updateHeroStadiumCover === 'function') {
        updateHeroStadiumCover();
      }
      document.body.classList.remove('print-only-1', 'print-only-2', 'print-only-poster', 'print-only-reg-slip', 'print-only-blank-roster', 'print-blank-scoresheet');
      
      let prevP1Stage = null;
      const p1El = typeof document !== 'undefined' ? document.getElementById('page1') : null;
      if (p1El && p1El.classList && typeof p1El.classList.contains === 'function') {
        prevP1Stage = p1El.classList.contains('p1-stage-knockout') ? 'knockout'
                    : p1El.classList.contains('p1-stage-all') ? 'all' : 'group';
      }
      if (mode === 'summary' || mode === 'all' || mode === 'page1' || mode === 'blank-scoresheet') {
        if (typeof switchP1Stage === 'function') {
          switchP1Stage('all');
        }
        if (typeof syncAwardsToPage1 === 'function') {
          syncAwardsToPage1();
        }
      }

      let pageStyle = document.getElementById('dynamic-print-page-style');
      if (!pageStyle && typeof document !== 'undefined' && document.head) {
        pageStyle = document.createElement('style');
        pageStyle.id = 'dynamic-print-page-style';
        document.head.appendChild(pageStyle);
      }

      if (mode === 'summary' || mode === 'all' || mode === 'page1') {
        if (pageStyle) pageStyle.textContent = '@page { size: A4 landscape; margin: 5mm 6mm; }';
        document.body.classList.add('print-only-1', 'print-only-summary');
        if (typeof document !== 'undefined' && document.documentElement && document.documentElement.classList) {
          document.documentElement.classList.add('print-only-summary');
        }
      } else if (mode === 'blank-scoresheet') {
        // Blank scorekeeper sheet for pen-and-paper management on the field
        if (pageStyle) pageStyle.textContent = '@page { size: A4 landscape; margin: 5mm 6mm; }';
        document.body.classList.add('print-only-1', 'print-blank-scoresheet');
        prepareBlankScoresheetForPrint();
      } else if (mode === 'page2') {
        if (pageStyle) pageStyle.textContent = '@page { size: A4 landscape; margin: 5mm 6mm; }';
        document.body.classList.add('print-only-2');
      } else if (mode === 'poster') {
        // A4 Portrait for Social Media Poster (edge-to-edge cover banner with strictly 1-page fit)
        if (pageStyle) {
          pageStyle.textContent = '@page { size: A4 portrait; margin: 0; }';
        }
        renderPrintablePosterSheet();
        document.body.classList.add('print-only-poster');
      } else if (mode === 'blank-roster') {
        // A4 Portrait for Blank Squad Registration Form (edge-to-edge cover banner with padded body)
        if (pageStyle) {
          pageStyle.textContent = '@page { size: A4 portrait; margin: 0; }';
        }
        if (typeof renderBlankRosterSheet === 'function') {
          renderBlankRosterSheet();
        }
        if (typeof document !== 'undefined' && document.documentElement && document.documentElement.classList) {
          document.documentElement.classList.add('print-only-blank-roster');
        }
        document.body.classList.add('print-only-blank-roster');
      }
      setTimeout(() => {
        if (typeof window !== 'undefined' && typeof window.print === 'function') {
          window.print();
        }
      }, 50);
      let cleanedUp = false;
      const cleanupPrint = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        const wasBlank = mode === 'blank-scoresheet' || (document.body && document.body.classList && document.body.classList.contains('print-blank-scoresheet'));
        if (typeof document !== 'undefined' && document.documentElement && document.documentElement.classList) {
          document.documentElement.classList.remove('print-only-1', 'print-only-summary', 'print-only-2', 'print-only-poster', 'print-only-reg-slip', 'print-only-blank-roster', 'print-blank-scoresheet');
        }
        if (typeof document !== 'undefined' && document.body && document.body.classList) {
          document.body.classList.remove('print-only-1', 'print-only-summary', 'print-only-2', 'print-only-poster', 'print-only-reg-slip', 'print-only-blank-roster', 'print-blank-scoresheet');
        }
        if (prevP1Stage && typeof switchP1Stage === 'function') {
          switchP1Stage(prevP1Stage);
        }
        if (pageStyle) {
          pageStyle.textContent = '@page { size: A4 landscape; margin: 5mm 6mm; }';
        }
        if (wasBlank) {
          if (typeof populateInputsFromState === 'function') {
            populateInputsFromState();
          }
          if (typeof recalculateAll === 'function') {
            recalculateAll();
          }
        }
        if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
          window.removeEventListener('afterprint', cleanupPrint);
        }
      };
      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('afterprint', cleanupPrint);
      }
      setTimeout(cleanupPrint, 60000);
    }

    // Close modals and dropdowns on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeAllDropdowns();
        if (typeof closeFootballEntryChoiceModal === 'function') closeFootballEntryChoiceModal();
        if (typeof closeSportPreviewModal === 'function') closeSportPreviewModal();
        if (typeof closeBlankRosterConfigModal === 'function') closeBlankRosterConfigModal();
        if (typeof closeSocialShareModal === 'function') closeSocialShareModal();
        if (activeModalMatchId) closeMatchEventsModal();
        closeTournamentWizard();
        closePromoPosterModal();
      }
    });

    // ========================================================
    // FAST SMOOTH SCROLL JUMP CONTROLLER (Option 2)
    // Seamlessly scrolls between Page 1 and Page 2
    // ========================================================
    function scrollToSheet(sheetId) {
      if (typeof document === 'undefined') return;
      const target = document.getElementById(sheetId);
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // ========================================================
    // PAGE 1 STAGE / PHASE MANAGEMENT (Classic Sheet Sub-tabs)
    // Stages:
    // 'group'    -> Group stage (Standings & Fixtures aligned)
    // 'knockout' -> Knockout stage (Brackets in focus)
    // 'all'      -> All-in-one classic A4 sheet
    // ========================================================
    var activeP1Stage = 'all';

    function initP1Stage() {
      let savedStage = 'all';
      try {
        savedStage = localStorage.getItem('tm_p1_stage') || 'all';
      } catch (e) {}
      switchP1Stage(savedStage);
    }

    function switchP1Stage(stage) {
      if (stage !== 'group' && stage !== 'knockout' && stage !== 'all') {
        stage = 'group';
      }
      activeP1Stage = stage;
      try {
        localStorage.setItem('tm_p1_stage', stage);
      } catch (e) {}

      const p1 = document.getElementById('page1');
      if (p1) {
        p1.classList.remove('p1-stage-group', 'p1-stage-knockout', 'p1-stage-all');
        p1.classList.add('p1-stage-' + stage);
      }

      const btnAll = document.getElementById('btn-p1-stage-all');
      const btnGroup = document.getElementById('btn-p1-stage-group');
      const btnKO = document.getElementById('btn-p1-stage-knockout');

      const tabs = [
        { btn: btnAll, key: 'all' },
        { btn: btnGroup, key: 'group' },
        { btn: btnKO, key: 'knockout' }
      ];

      tabs.forEach(t => {
        if (t.btn) {
          if (t.key === stage) {
            t.btn.classList.add('active');
            t.btn.setAttribute('aria-selected', 'true');
          } else {
            t.btn.classList.remove('active');
            t.btn.setAttribute('aria-selected', 'false');
          }
        }
      });
    }

    // Initialize on load
    document.addEventListener('DOMContentLoaded', () => {
      initAppState();
      initWelcomeBanner();
      initP1Stage();
      initAwardsSync();
      if (typeof updateHeroStadiumCover === 'function') updateHeroStadiumCover();
    });
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initAppState();
      initWelcomeBanner();
      initP1Stage();
      initAwardsSync();
      if (typeof updateHeroStadiumCover === 'function') updateHeroStadiumCover();
    }

    if (typeof window !== 'undefined') {
      window.scrollToSheet = scrollToSheet;
      window.initP1Stage = initP1Stage;
      window.switchP1Stage = switchP1Stage;
      window.syncAwardsToPage1 = syncAwardsToPage1;
      window.syncAwardsFromPage1 = syncAwardsFromPage1;
      window.initAwardsSync = initAwardsSync;
      window.savePage1Awards = savePage1Awards;
      window.loadPage1Awards = loadPage1Awards;
      window.prepareBlankScoresheetForPrint = prepareBlankScoresheetForPrint;
      window.printDocument = printDocument;
    }

    if (typeof module !== 'undefined' && module.exports) {
      module.exports = {
        scrollToSheet,
        initP1Stage,
        switchP1Stage,
        loadSampleTournamentData,
        resetTournamentData,
        printDocument,
        prepareBlankScoresheetForPrint,
        syncAwardsToPage1,
        syncAwardsFromPage1,
        initAwardsSync,
        savePage1Awards,
        loadPage1Awards
      };
    }