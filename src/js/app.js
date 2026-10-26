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

      // Demo awards
      const momName = document.getElementById('award-mom-name');
      const momTeam = document.getElementById('award-mom-team');
      if (momName) momName.value = 'আরিফুল ইসলাম';
      if (momTeam) momTeam.value = 'মুড়িয়ারা';

      const gkName = document.getElementById('award-gk-name');
      const gkTeam = document.getElementById('award-gk-team');
      if (gkName) gkName.value = 'নাজমুল হাসান (GK)';
      if (gkTeam) gkTeam.value = 'মুড়িয়ারা';
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

      const topName = document.getElementById('award-top-scorer-name');
      const topTeam = document.getElementById('award-top-scorer-team');
      const topGoals = document.getElementById('award-top-scorer-goals');
      if (topName) topName.value = '';
      if (topTeam) topTeam.value = '';
      if (topGoals) topGoals.value = '';

      const momName = document.getElementById('award-mom-name');
      const momTeam = document.getElementById('award-mom-team');
      if (momName) momName.value = '';
      if (momTeam) momTeam.value = '';

      const gkName = document.getElementById('award-gk-name');
      const gkTeam = document.getElementById('award-gk-team');
      if (gkName) gkName.value = '';
      if (gkTeam) gkTeam.value = '';
    }

// ========================================================
// THEME & COLOR MODE MANAGEMENT
// 1. System App Color Mode (Dark vs Light UI)
// 2. Document / Sheet Print Theme (Stadium Color vs White Paper)
// ========================================================

let currentAppTheme = 'dark';
let currentSheetTheme = 'stadium';

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

// --- 2. DOCUMENT / PRINT SHEET THEME ---
function initSheetTheme() {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('tournament_sheet_theme') : null;
  if (saved === 'paper' || saved === 'stadium') {
    currentSheetTheme = saved;
  } else {
    currentSheetTheme = 'stadium';
  }
  setSheetTheme(currentSheetTheme, false);
}

function setSheetTheme(theme, persist = true) {
  if (theme !== 'paper' && theme !== 'stadium') return;
  currentSheetTheme = theme;
  if (persist && typeof localStorage !== 'undefined') {
    localStorage.setItem('tournament_sheet_theme', theme);
  }

  const isPaper = theme === 'paper';
  if (typeof document !== 'undefined') {
    if (document.body && document.body.classList) {
      document.body.classList.toggle('sheet-theme-paper', isPaper);
      document.body.classList.toggle('light-mode', isPaper); // backward compatibility
    }
    if (document.documentElement && document.documentElement.classList) {
      document.documentElement.classList.toggle('sheet-theme-paper', isPaper);
    }
  }

  updateSheetThemeButtonText();
}

function toggleSheetTheme() {
  setSheetTheme(currentSheetTheme === 'paper' ? 'stadium' : 'paper', true);
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

function printDocument(mode) {
      document.body.classList.remove('print-only-1', 'print-only-2', 'print-only-poster');
      if (mode === 'page1') {
        document.body.classList.add('print-only-1');
      } else if (mode === 'page2') {
        document.body.classList.add('print-only-2');
      } else if (mode === 'poster') {
        renderPrintablePosterSheet();
        document.body.classList.add('print-only-poster');
      }
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-only-1', 'print-only-2', 'print-only-poster');
      }, 1200);
    }

    // Close modals and dropdowns on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeAllDropdowns();
        if (typeof closeFootballEntryChoiceModal === 'function') closeFootballEntryChoiceModal();
        if (typeof closeSportPreviewModal === 'function') closeSportPreviewModal();
        if (activeModalMatchId) closeMatchEventsModal();
        closeTournamentWizard();
        closePromoPosterModal();
      }
    });

    // Initialize on load
    document.addEventListener('DOMContentLoaded', () => {
      initAppState();
      initWelcomeBanner();
    });
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initAppState();
      initWelcomeBanner();
    }