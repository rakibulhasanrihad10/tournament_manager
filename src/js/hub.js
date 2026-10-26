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
  } else {
    hubView.style.display = 'block';
    footballView.style.display = 'none';
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
            <li><strong>21-Point & Best of 3 Sets Scoring:</strong> Official BWF rally point scoring rules.</li>
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
            <li><strong>২১-পয়েন্ট ও ৩-সেট স্কোরিং:</strong> অফিসিয়াল ব্যাডমিন্টন বিশ্ব ফেডারেশন (BWF) রুলস।</li>
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
// FOOTBALL ENTRY CHOICE MODAL (SETUP VS DEMO)
// ========================================================

function openFootballEntryChoiceModal() {
  const modal = document.getElementById('football-entry-modal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  } else {
    navigateToView('football');
  }
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

// Initial View Detector on Load
function initViewRouter() {
  const hash = window.location.hash;
  if (hash === '#football') {
    currentAppView = 'football';
  } else {
    currentAppView = 'hub';
  }
  renderCurrentView();

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
