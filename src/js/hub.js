// ========================================================
// SPORTS HUB NAVIGATION ROUTER & MULTI-SPORT SYSTEM
// ========================================================

let currentAppView = 'hub'; // 'hub' or 'football'

function navigateToView(viewName) {
  if (viewName !== 'football' && viewName !== 'hub') {
    viewName = 'hub';
  }

  currentAppView = viewName;
  window.location.hash = viewName === 'football' ? '#football' : '#hub';
  renderCurrentView();

  // Scroll to top when switching views
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentView() {
  const hubView = document.getElementById('sports-hub-view');
  const footballView = document.getElementById('football-app-view');

  if (!hubView || !footballView) return;

  if (currentAppView === 'football') {
    hubView.style.display = 'none';
    footballView.style.display = 'block';

    // Recalculate football standings and redraw state
    if (typeof recalculateAll === 'function') {
      recalculateAll();
    }
    if (typeof updateNavWizardButton === 'function') {
      updateNavWizardButton();
    }
  } else {
    hubView.style.display = 'block';
    footballView.style.display = 'none';

    // Update football launch card button state when visiting hub
    if (typeof updateHubFootballCard === 'function') {
      updateHubFootballCard();
    }
  }

  // Update document title dynamically
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  if (currentAppView === 'football') {
    const defaultTitle = isEn
      ? 'Football Tournament 2026 - Official Fixture & Scoreboard'
      : 'ফুটবল টুর্নামেন্ট ২০২৬ - অফিসিয়াল ফিকশ্চার ও স্কোরবোর্ড';
    const cfgTitle = (typeof tournamentConfig !== 'undefined' && tournamentConfig.title) ? tournamentConfig.title : defaultTitle;
    document.title = cfgTitle;
  } else {
    document.title = isEn
      ? 'Sports Tournament Pro - Multi-Sport Tournament Management Platform'
      : 'স্পোর্টস টুর্নামেন্ট প্রো - মাল্টি-স্পোর্টস টুর্নামেন্ট ম্যানেজমেন্ট প্ল্যাটফর্ম';
  }
}

// ========================================================
// UPCOMING SPORT ROADMAP & FEATURE PREVIEW MODAL
// ========================================================

function openSportPreviewModal(sportKey) {
  const modal = document.getElementById('sport-preview-modal');
  if (!modal) return;

  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const titleEl = document.getElementById('preview-sport-title');
  const bodyEl = document.getElementById('preview-sport-body');

  if (sportKey === 'cricket') {
    if (titleEl) {
      titleEl.innerHTML = isEn
        ? '🏏 Cricket Tournament Manager (Roadmap)'
        : '🏏 ক্রিকেট টুর্নামেন্ট ম্যানেজার (রোডম্যাপ ও ফিচার)';
    }
    if (bodyEl) {
      bodyEl.innerHTML = isEn ? `
        <div style="line-height:1.6; color:var(--text-modal-main);">
          <div style="background:rgba(5, 150, 105, 0.15); border:1px solid #059669; border-radius:8px; padding:12px; margin-bottom:14px;">
            <strong style="color:#34d399;">⚡ In Active Development:</strong> Cricket Tournament Engine is currently being engineered and will be launched in the upcoming update!
          </div>
          <h4 style="margin:12px 0 6px; color:#38bdf8;">Planned Modules:</h4>
          <ul style="padding-left:20px; margin-bottom:14px;">
            <li><strong>T-10, T-20 & Short-Over League Fixtures:</strong> Automated 4 to 12 teams group matches.</li>
            <li><strong>Net Run Rate (NRR) Engine:</strong> Live formula-based NRR standings calculation.</li>
            <li><strong>Live Ball-by-Ball & Over Tracker:</strong> Track runs, wickets, extras and maiden overs.</li>
            <li><strong>Batting & Bowling Scorecard Sheets:</strong> Print-ready individual statistics.</li>
            <li><strong>A4 Landscape Official Scorebook Print:</strong> Tournament summary sheet for match officials.</li>
          </ul>
        </div>
      ` : `
        <div style="line-height:1.6; color:var(--text-modal-main);">
          <div style="background:rgba(5, 150, 105, 0.15); border:1px solid #059669; border-radius:8px; padding:12px; margin-bottom:14px;">
            <strong style="color:#10b981;">⚡ ডেভেলপমেন্ট চলমান:</strong> ক্রিকেট টুর্নামেন্ট ইঞ্জিনটি দ্রুত গতিতে তৈরি হচ্ছে এবং পরবর্তী আপডেটে উন্মুক্ত করা হবে!
          </div>
          <h4 style="margin:12px 0 6px; color:#38bdf8;">পরিকল্পিত প্রধান ফিচারসমূহ:</h4>
          <ul style="padding-left:20px; margin-bottom:14px;">
            <li><strong>টি-১০, টি-২০ ও শর্ট ওভার লিগ ফিকশ্চার:</strong> ৪ থেকে ১২ দলের গ্রুপ ভিত্তিক ম্যাচ তৈরি।</li>
            <li><strong>নেট রান রেট (NRR) অটো ক্যালকুলেটর:</strong> আন্তর্জাতিক নিয়মানুযায়ী স্বয়ংক্রিয় NRR হিসাব।</li>
            <li><strong>লাইভ ওভার ও বল ট্র্যাকার:</strong> রান, উইকেট, অতিরিক্ত রান ও বাউন্ডারি ট্র্যাকিং।</li>
            <li><strong>ব্যাটার ও বোলার রেকর্ড শিট:</strong> ম্যান অব দ্য ম্যাচ ও ব্যক্তিগত পারফরম্যান্স ডাটা।</li>
            <li><strong>A4 ল্যান্ডস্কেপ ক্রিকেট স্কোরবুক প্রিন্ট:</strong> অফিশিয়াল ম্যাচ রিপোর্ট ও সামারি শিট।</li>
          </ul>
        </div>
      `;
    }
  } else if (sportKey === 'badminton') {
    if (titleEl) {
      titleEl.innerHTML = isEn
        ? '🏸 Badminton Tournament Manager (Roadmap)'
        : '🏸 ব্যাডমিন্টন টুর্নামেন্ট ম্যানেজার (রোডম্যাপ ও ফিচার)';
    }
    if (bodyEl) {
      bodyEl.innerHTML = isEn ? `
        <div style="line-height:1.6; color:var(--text-modal-main);">
          <div style="background:rgba(124, 58, 237, 0.15); border:1px solid #7c3aed; border-radius:8px; padding:12px; margin-bottom:14px;">
            <strong style="color:#a78bfa;">⚡ In Active Development:</strong> Badminton Tournament Engine is being engineered for winter tournaments and night badminton fests!
          </div>
          <h4 style="margin:12px 0 6px; color:#38bdf8;">Planned Modules:</h4>
          <ul style="padding-left:20px; margin-bottom:14px;">
            <li><strong>Singles & Doubles Brackets:</strong> 8, 16 or 32 player/team knockout trees.</li>
            <li><strong>BWF & Bangla Scoring Modes:</strong> Official BWF rally points (21 pts) & classic Bangla service-over (15 pts).</li>
            <li><strong>Deuce & Golden Point Handling:</strong> Up to 30 points cap automation.</li>
            <li><strong>Court Scheduling & Umpire Sheets:</strong> Court 1, Court 2 visual match timeline.</li>
            <li><strong>A4 Landscape Visual Knockout Bracket Print:</strong> Wall-mounted tournament fixture tree.</li>
          </ul>
        </div>
      ` : `
        <div style="line-height:1.6; color:var(--text-modal-main);">
          <div style="background:rgba(124, 58, 237, 0.15); border:1px solid #7c3aed; border-radius:8px; padding:12px; margin-bottom:14px;">
            <strong style="color:#a78bfa;">⚡ ডেভেলপমেন্ট চলমান:</strong> শীতকালীন টুর্নামেন্ট ও নাইট ব্যাডমিন্টন ফেস্টের জন্য ব্যাডমিন্টন ইঞ্জিনটি প্রস্তুত করা হচ্ছে!
          </div>
          <h4 style="margin:12px 0 6px; color:#38bdf8;">পরিকল্পিত প্রধান ফিচারসমূহ:</h4>
          <ul style="padding-left:20px; margin-bottom:14px;">
            <li><strong>সিঙ্গেলস ও ডাবলস ড্র ব্র্যাকেট:</strong> ৮, ১৬ বা ৩২ দল/প্লেয়ারের পূর্ণাঙ্গ নকআউট ট্রি।</li>
            <li><strong>BWF ও দেশীয় বাংলা স্কোরিং মোড:</strong> অফিসিয়াল BWF র‍্যালি পয়েন্ট (২১ পয়েন্ট) ও ক্লাসিক বাংলা সার্ভ-কাট নিয়ম (১৫ পয়েন্ট)।</li>
            <li><strong>ডিউস ও গোল্ডেন পয়েন্ট অটোমেশন:</strong> ২৯-২৯ এ ৩০ পয়েন্টের গোল্ডেন রুলস ট্র্যাকার।</li>
            <li><strong>কোর্ট শিডিউল ও আম্পায়ার শিট:</strong> একাধিক কোর্টে একই সাথে ম্যাচ পরিচালনার রুটিন।</li>
            <li><strong>A4 ল্যান্ডস্কেপ ব্র্যাকেট প্রিন্ট শিট:</strong> নোটিশ বোর্ডে লাগানোর মতো প্রিমিয়াম ট্রি চার্ট।</li>
          </ul>
        </div>
      `;
    }
  }

  modal.classList.add('active');
  modal.style.display = 'flex';
}

function closeSportPreviewModal() {
  const modal = document.getElementById('sport-preview-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

// ========================================================
// FOOTBALL ENTRY & RESUME MANAGEMENT SYSTEM
// ========================================================

function updateHubFootballCard() {
  const btn = document.getElementById('btn-football-launch') || (typeof document !== 'undefined' && document.querySelector ? document.querySelector('.btn-football-launch') : null);
  if (!btn) return;

  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const hasCustom = typeof hasActiveCustomTournament === 'function' && hasActiveCustomTournament();

  if (hasCustom && typeof tournamentConfig !== 'undefined' && tournamentConfig.title) {
    const rawTitle = tournamentConfig.title;
    const truncatedTitle = rawTitle.length > 32 ? (rawTitle.slice(0, 31) + '…') : rawTitle;
    btn.textContent = isEn
      ? `▶️ Resume: ${truncatedTitle} ➜`
      : `▶️ পরিচালনা করুন: ${truncatedTitle} ➜`;
    if (btn.setAttribute) {
      btn.setAttribute('title', rawTitle);
    }
    if (btn.classList && btn.classList.add) {
      btn.classList.add('btn-has-active-tournament');
    }
  } else {
    btn.textContent = isEn
      ? '🚀 Enter Football Tournament ➜'
      : '🚀 ফুটবল টুর্নামেন্টে প্রবেশ করুন ➜';
    if (btn.removeAttribute) {
      btn.removeAttribute('title');
    }
    if (btn.classList && btn.classList.remove) {
      btn.classList.remove('btn-has-active-tournament');
    }
  }
}

function openFootballEntryChoiceModal() {
  const modal = document.getElementById('football-entry-modal');
  if (!modal) {
    navigateToView('football');
    return;
  }

  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const hasCustom = typeof hasActiveCustomTournament === 'function' && hasActiveCustomTournament();
  const choicesGrid = document.getElementById('football-entry-choices');
  const headerEl = document.getElementById('football-entry-header');
  const footerEl = document.getElementById('football-entry-footer');

  if (hasCustom && typeof tournamentConfig !== 'undefined') {
    const rawTitle = tournamentConfig.title || (isEn ? 'Football Tournament' : 'ফুটবল টুর্নামেন্ট');
    const escTitle = typeof escapeHtml === 'function' ? escapeHtml(rawTitle) : rawTitle;

    if (headerEl) {
      headerEl.style.display = 'block';
      headerEl.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
          <span style="display:inline-flex; align-items:center; gap:5px; background:rgba(16, 185, 129, 0.15); color:#10b981; border:1px solid rgba(16, 185, 129, 0.3); padding:3px 10px; border-radius:9999px; font-size:12px; font-weight:700;">
            🟢 ${isEn ? 'Active Tournament' : 'সক্রিয় টুর্নামেন্ট'}
          </span>
          <span style="font-size:12px; color:var(--text-modal-sub, #64748b);">
            ${isEn ? 'Saved in Browser' : 'ব্রাউজারে সংরক্ষিত'}
          </span>
        </div>
        <h3 style="margin:0 0 6px; font-size:1.25rem; font-weight:800; color:var(--text-modal-main, #0f172a); line-height:1.3;">
          ${escTitle}
        </h3>
        <p style="margin:0; font-size:0.875rem; color:var(--text-modal-sub, #64748b); line-height:1.4;">
          ${isEn ? 'Your custom tournament is ready. Choose an option to proceed:' : 'আপনার তৈরি করা টুর্নামেন্ট সক্রিয় রয়েছে। নিচের যেকোনো অপশন বেছে নিন:'}
        </p>
      `;
    }

    if (choicesGrid) {
      choicesGrid.innerHTML = `
        <!-- Choice 1: Resume Tournament Management (Primary) -->
        <div class="entry-choice-card choice-resume" onclick="startFootballWithDemo()" role="button" tabindex="0" style="border: 2px solid #10b981; background: rgba(16, 185, 129, 0.06);">
          <div class="choice-icon-wrap" style="background: linear-gradient(135deg, #059669, #10b981); color: #fff;">
            ▶️
          </div>
          <div class="choice-content">
            <h4 style="color:#059669; font-weight:800;">${isEn ? 'Resume Tournament Management' : 'আপনার টুর্নামেন্ট পরিচালনা করুন'}</h4>
            <p>${isEn ? 'Enter your tournament dashboard directly to record match results, update points table, and print sheets.' : 'সরাসরি টুর্নামেন্ট ড্যাশবোর্ডে প্রবেশ করে পয়েন্ট টেবিল, লাইভ স্কোর ও ফিকশ্চার পরিচালনা করুন।'}</p>
          </div>
          <div class="choice-arrow" style="color:#059669; font-weight:bold;">➜</div>
        </div>

        <!-- Choice 2: Edit Tournament Settings & Teams -->
        <div class="entry-choice-card choice-edit" onclick="startFootballWithWizard()" role="button" tabindex="0">
          <div class="choice-icon-wrap" style="background: linear-gradient(135deg, #4f46e5, #6366f1); color: #fff;">
            ⚙️
          </div>
          <div class="choice-content">
            <h4>${isEn ? 'Edit Tournament Settings & Teams' : 'টুর্নামেন্ট সেটিংস ও দল পরিবর্তন করুন'}</h4>
            <p>${isEn ? 'Open setup wizard to adjust tournament title, teams, squad size, venue, prize pool or rules.' : 'টুর্নামেন্টের নাম, ফরম্যাট, খেলার মাঠ, প্রাইজমানি বা দলের তালিকা পরিবর্তন করতে সেটআপ উইজার্ড খুলুন।'}</p>
          </div>
          <div class="choice-arrow">➜</div>
        </div>
      `;
    }

    if (footerEl) {
      footerEl.style.display = 'block';
      footerEl.innerHTML = `
        <button type="button" class="btn-start-fresh" onclick="startFreshTournament()" style="background:none; border:none; color:var(--text-modal-sub, #64748b); font-size:13px; font-weight:600; cursor:pointer; text-decoration:underline; padding:6px 12px; transition:color 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--text-modal-sub, #64748b)'">
          ${isEn ? '🔄 Start a brand new tournament from scratch' : '🔄 সম্পূর্ণ নতুন টুর্নামেন্ট তৈরি করুন (নতুন করে শুরু)'}
        </button>
      `;
    }
  } else {
    // Default Clean Slate Onboarding
    if (headerEl) {
      headerEl.style.display = 'none';
      headerEl.innerHTML = '';
    }

    if (choicesGrid) {
      choicesGrid.innerHTML = `
        <!-- Choice 1: Setup My Tournament Directly -->
        <div class="entry-choice-card choice-setup" onclick="startFootballWithWizard()" role="button" tabindex="0">
          <div class="choice-icon-wrap" style="background: linear-gradient(135deg, #4f46e5, #6366f1); color: #fff;">
            🚀
          </div>
          <div class="choice-content">
            <h4 data-i18n="entry.choice_wizard_title">${isEn ? 'Set Up Your Tournament' : 'আপনার টুর্নামেন্ট সেটআপ করুন'}</h4>
            <p data-i18n="entry.choice_wizard_desc">${isEn ? 'Configure tournament name, venue, prize pool & rules to build an official custom fixture sheet.' : 'টুর্নামেন্টের নাম, খেলার মাঠ, প্রাইজমানি ও নিয়মাবলী সেট করে সরাসরি সম্পূর্ণ নতুন ফিকশ্চার শিট তৈরি করুন।'}</p>
          </div>
          <div class="choice-arrow">➜</div>
        </div>

        <!-- Choice 2: Explore Demo Interface First -->
        <div class="entry-choice-card choice-demo" onclick="startFootballWithDemo()" role="button" tabindex="0">
          <div class="choice-icon-wrap" style="background: linear-gradient(135deg, #0284c7, #0ea5e9); color: #fff;">
            👀
          </div>
          <div class="choice-content">
            <h4 data-i18n="entry.choice_demo_title">${isEn ? 'Explore Demo Interface First' : 'ডেমো ইন্টারফেস ঘুরে দেখুন'}</h4>
            <p data-i18n="entry.choice_demo_desc">${isEn ? 'Explore sample fixtures, auto-calculating points tables and scoreboard features before customizing.' : 'সম্পূর্ণ সাজানো ফিকশ্চার, অটো ক্যালকুলেটর ও স্কোরবোর্ড কীভাবে কাজ করে তা আগে একটু টেস্ট করে দেখুন।'}</p>
          </div>
          <div class="choice-arrow">➜</div>
        </div>
      `;
    }

    if (footerEl) {
      footerEl.style.display = 'none';
      footerEl.innerHTML = '';
    }
  }

  modal.classList.add('active');
  modal.style.display = 'flex';
}

function closeFootballEntryChoiceModal() {
  const modal = document.getElementById('football-entry-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function startFootballWithWizard() {
  closeFootballEntryChoiceModal();
  navigateToView('football');
  setTimeout(() => {
    if (typeof openTournamentWizard === 'function') {
      openTournamentWizard();
    }
  }, 150);
}

function startFootballWithDemo() {
  closeFootballEntryChoiceModal();
  navigateToView('football');
}

function startFreshTournament() {
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const confirmMsg = isEn
    ? 'Are you sure you want to start a brand new tournament? Your current tournament configuration and scores will be reset.'
    : 'আপনি কি সম্পূর্ণ নতুন একটি টুর্নামেন্ট শুরু করতে চান? বর্তমান টুর্নামেন্টের সেটিংস ও স্কোরবোর্ড খালি হয়ে যাবে।';

  if (typeof confirm === 'function' && !confirm(confirmMsg)) {
    return;
  }

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('chitadda_tournament_config_2026');
      localStorage.removeItem('chitadda_app_state_2026');
      localStorage.removeItem('chitadda_tournament_rosters_2026');
    }
  } catch (e) {
    console.warn('Storage clear error', e);
  }

  if (typeof matchScores !== 'undefined') matchScores = {};
  if (typeof penaltyWinners !== 'undefined') penaltyWinners = {};
  if (typeof penaltyScores !== 'undefined') penaltyScores = {};
  if (typeof koScores !== 'undefined') koScores = { 10: { s1: '', s2: '' }, 11: { s1: '', s2: '' }, 12: { s1: '', s2: '' }, 13: { s1: '', s2: '' } };
  if (typeof koPenWinners !== 'undefined') koPenWinners = {};
  if (typeof koPenScores !== 'undefined') koPenScores = {};
  if (typeof matchEvents !== 'undefined') matchEvents = {};

  if (typeof DEFAULT_CONFIG !== 'undefined') {
    tournamentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    tournamentConfig.isCustomConfig = false;
  }
  if (typeof DEFAULT_ROSTERS !== 'undefined') {
    teamRosters = JSON.parse(JSON.stringify(DEFAULT_ROSTERS));
  }

  if (typeof populateInputsFromState === 'function') {
    populateInputsFromState();
  }
  if (typeof recalculateAll === 'function') {
    recalculateAll();
  }
  if (typeof applyTournamentConfig === 'function') {
    applyTournamentConfig();
  }
  if (typeof updateHubFootballCard === 'function') {
    updateHubFootballCard();
  }

  closeFootballEntryChoiceModal();
  navigateToView('football');

  setTimeout(() => {
    if (typeof openTournamentWizard === 'function') {
      openTournamentWizard();
    }
  }, 150);
}

// Initial View Detector on Load
function initViewRouter() {
  const hash = window.location.hash;
  if (hash === '#football') {
    currentAppView = 'football';
  } else {
    currentAppView = 'hub';
  }
  renderCurrentView();
  if (typeof updateHubFootballCard === 'function') {
    updateHubFootballCard();
  }

  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash;
    currentAppView = (newHash === '#football') ? 'football' : 'hub';
    renderCurrentView();
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initViewRouter);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initViewRouter();
  }
}
