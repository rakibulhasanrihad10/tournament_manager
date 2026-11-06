// ========================================================
// SOCIAL MEDIA POSTER & NOTICE GENERATOR
// Dual Mode: 
// 1. Fixture & Match Schedule Poster (Phase 2 - Matches & Knockouts)
// 2. Promotional Notice & Registration Poster (Phase 1 - Team Registration)
// ========================================================

var activePosterTab = 'fixture';

function getDynamicKnockoutMatchesForPoster(c, isEn) {
  const cfg = c || (typeof tournamentConfig !== 'undefined' ? tournamentConfig : {});
  const type = cfg.tournamentType || 'groups';
  const count = cfg.teamCount || (cfg.teams ? cfg.teams.length : 9);
  const teams = cfg.teams || [];
  const getTName = (idx, fallback) => (teams[idx] && teams[idx].name ? teams[idx].name : fallback);

  if (type === 'knockout') {
    if (count <= 2) {
      return {
        subtitle: isEn ? '2 Teams Direct Championship Final' : '২টি দল | সরাসরি মেগা গ্র্যান্ড ফাইনাল',
        cards: [
          { title: isEn ? '🏆 Grand Final' : '🏆 গ্র্যান্ড ফাইনাল', time: isEn ? '10:00 PM' : 'রাত ১০:০০', colorClass: 'mc-dark', t1: getTName(0, isEn ? 'Team 1' : 'দল ১'), t2: getTName(1, isEn ? 'Team 2' : 'দল ২') }
        ]
      };
    } else if (count <= 4) {
      return {
        subtitle: isEn ? '4 Teams Knockout: 2 Semifinals & Grand Final' : '৪ দলের নকআউট: ২টি সেমিফাইনাল, ৩য় স্থান ও ফাইনাল',
        cards: [
          { title: isEn ? 'Semi-Final 1' : '১ম সেমিফাইনাল', time: isEn ? '9:00 PM' : 'রাত ৯:০০', colorClass: 'mc-red', t1: getTName(0, isEn ? 'Team 1' : 'দল ১'), t2: getTName(1, isEn ? 'Team 2' : 'দল ২') },
          { title: isEn ? 'Semi-Final 2' : '২য় সেমিফাইনাল', time: isEn ? '9:30 PM' : 'রাত ৯:৩০', colorClass: 'mc-blue', t1: getTName(2, isEn ? 'Team 3' : 'দল ৩'), t2: getTName(3, isEn ? 'Team 4' : 'দল ৪') },
          { title: isEn ? '🥉 3rd Place Playoff' : '🥉 ৩য় স্থান নির্ধারণী', time: isEn ? '10:00 PM' : 'রাত ১০:০০', colorClass: 'mc-purple', t1: isEn ? 'Semi 1 Runner-Up' : '১ম সেমি পরাজিত', t2: isEn ? 'Semi 2 Runner-Up' : '২য় সেমি পরাজিত' },
          { title: isEn ? '🏆 Grand Final' : '🏆 গ্র্যান্ড ফাইনাল', time: isEn ? '10:30 PM' : 'রাত ১০:৩০', colorClass: 'mc-dark', t1: isEn ? 'Semi 1 Winner' : '১ম সেমি বিজয়ী', t2: isEn ? 'Semi 2 Winner' : '২য় সেমি বিজয়ী' }
        ]
      };
    } else {
      // 8+ teams direct knockout
      return {
        subtitle: isEn ? `${count} Teams Knockout Roadmap ➔ Semi-Finals ➔ Grand Final` : `${count} দলের নকআউট রোডম্যাপ ➔ সেমিফাইনাল ➔ ফাইনাল`,
        cards: [
          { title: isEn ? 'Quarter-Final 1' : '১ম কোয়ার্টার ফাইনাল', time: isEn ? '8:00 PM' : 'রাত ৮:০০', colorClass: 'mc-blue', t1: getTName(0, isEn ? 'Team 1' : 'দল ১'), t2: getTName(1, isEn ? 'Team 2' : 'দল ২') },
          { title: isEn ? 'Quarter-Final 2' : '২য় কোয়ার্টার ফাইনাল', time: isEn ? '8:30 PM' : 'রাত ৮:৩০', colorClass: 'mc-blue', t1: getTName(2, isEn ? 'Team 3' : 'দল ৩'), t2: getTName(3, isEn ? 'Team 4' : 'দল ৪') },
          { title: isEn ? 'Semi-Final 1' : '১ম সেমিফাইনাল', time: isEn ? '10:00 PM' : 'রাত ১০:০০', colorClass: 'mc-red', t1: isEn ? 'Winner QF 1' : 'কোয়ার্টার ১ বিজয়ী', t2: isEn ? 'Winner QF 2' : 'কোয়ার্টার ২ বিজয়ী' },
          { title: isEn ? '🏆 Grand Final' : '🏆 গ্র্যান্ড ফাইনাল', time: isEn ? '11:00 PM' : 'রাত ১১:০০', colorClass: 'mc-dark', t1: isEn ? 'Winner Semi 1' : '১ম সেমি বিজয়ী', t2: isEn ? 'Winner Semi 2' : '২য় সেমি বিজয়ী' }
        ]
      };
    }
  } else if (type === 'league') {
    return {
      subtitle: isEn ? 'Single League Standings ➔ Top 2 Teams Mega Grand Final' : 'একক লিগ টেবিলের শীর্ষ দল নিয়ে মেগা গ্র্যান্ড ফাইনাল',
      cards: [
        { title: isEn ? '🥉 3rd Place Playoff' : '🥉 ৩য় স্থান প্লে-অফ', time: isEn ? '10:30 PM' : 'রাত ১০:৩০', colorClass: 'mc-purple', t1: isEn ? 'League 3rd Place' : 'লিগ টেবিল ৩য় স্থান', t2: isEn ? 'League 4th Place' : 'লিগ টেবিল ৪র্থ স্থান' },
        { title: isEn ? '🏆 Grand Final' : '🏆 গ্র্যান্ড ফাইনাল', time: isEn ? '11:15 PM' : 'রাত ১১:১৫', colorClass: 'mc-dark', t1: isEn ? 'League Champions (1st)' : 'লিগ টেবিল ১ম স্থান', t2: isEn ? 'League Runners-Up (2nd)' : 'লিগ টেবিল ২য় স্থান' }
      ]
    };
  } else {
    // 'groups'
    const groups = typeof getActiveGroups === 'function' ? getActiveGroups() : {};
    const numGroups = Object.keys(groups).length || 3;

    if (numGroups === 2) {
      return {
        subtitle: isEn ? 'Top 4 from 2 Groups (Champions & Runners-Up) ➔ Semis & Final' : '২ গ্রুপের সেরা ৪ দল (গ্রুপ চ্যাম্পিয়ন ও রানার্স-আপ) নিয়ে সেমিফাইনাল ও ফাইনাল',
        cards: [
          { title: isEn ? 'Semi-Final 1' : '১ম সেমিফাইনাল', time: isEn ? '10:00 PM' : 'রাত ১০:০০', colorClass: 'mc-red', t1: isEn ? 'Group A Champion' : 'গ্রুপ এ চ্যাম্পিয়ন', t2: isEn ? 'Group B Runner-Up' : 'গ্রুপ বি রানার্স-আপ' },
          { title: isEn ? 'Semi-Final 2' : '২য় সেমিফাইনাল', time: isEn ? '10:30 PM' : 'রাত ১০:৩০', colorClass: 'mc-blue', t1: isEn ? 'Group B Champion' : 'গ্রুপ বি চ্যাম্পিয়ন', t2: isEn ? 'Group A Runner-Up' : 'গ্রুপ এ রানার্স-আপ' },
          { title: isEn ? '🥉 3rd Place Playoff' : '🥉 ৩য় স্থান নির্ধারণী', time: isEn ? '11:00 PM' : 'রাত ১১:০০', colorClass: 'mc-purple', t1: isEn ? 'Semi 1 Runner-Up' : '১ম সেমি পরাজিত', t2: isEn ? 'Semi 2 Runner-Up' : '২য় সেমি পরাজিত' },
          { title: isEn ? '🏆 Grand Final' : '🏆 গ্র্যান্ড ফাইনাল', time: isEn ? '11:30 PM' : 'রাত ১১:৩০', colorClass: 'mc-dark', t1: isEn ? 'Semi 1 Winner' : '১ম সেমি বিজয়ী', t2: isEn ? 'Semi 2 Winner' : '২য় সেমি বিজয়ী' }
        ]
      };
    } else if (numGroups === 4) {
      return {
        subtitle: isEn ? '4 Group Champions Advance to Semi-Finals & Grand Final' : '৪ গ্রুপের সেরা চ্যাম্পিয়নদের নিয়ে সেমিফাইনাল ও গ্র্যান্ড ফাইনাল',
        cards: [
          { title: isEn ? 'Semi-Final 1' : '১ম সেমিফাইনাল', time: isEn ? '10:00 PM' : 'রাত ১০:০০', colorClass: 'mc-red', t1: isEn ? 'Group A Champion' : 'গ্রুপ এ চ্যাম্পিয়ন', t2: isEn ? 'Group B Champion' : 'গ্রুপ বি চ্যাম্পিয়ন' },
          { title: isEn ? 'Semi-Final 2' : '২য় সেমিফাইনাল', time: isEn ? '10:30 PM' : 'রাত ১০:৩০', colorClass: 'mc-blue', t1: isEn ? 'Group C Champion' : 'গ্রুপ সি চ্যাম্পিয়ন', t2: isEn ? 'Group D Champion' : 'গ্রুপ ডি চ্যাম্পিয়ন' },
          { title: isEn ? '🥉 3rd Place Playoff' : '🥉 ৩য় স্থান নির্ধারণী', time: isEn ? '11:00 PM' : 'রাত ১১:০০', colorClass: 'mc-purple', t1: isEn ? 'Semi 1 Runner-Up' : '১ম সেমি পরাজিত', t2: isEn ? 'Semi 2 Runner-Up' : '২য় সেমি পরাজিত' },
          { title: isEn ? '🏆 Grand Final' : '🏆 গ্র্যান্ড ফাইনাল', time: isEn ? '11:30 PM' : 'রাত ১১:৩০', colorClass: 'mc-dark', t1: isEn ? 'Semi 1 Winner' : '১ম সেমি বিজয়ী', t2: isEn ? 'Semi 2 Winner' : '২য় সেমি বিজয়ী' }
        ]
      };
    } else {
      // 3 groups default (e.g. 9 teams)
      return {
        subtitle: isEn ? '3 Group Champions + Best Runner-Up = 4 Teams' : '৩ গ্রুপের চ্যাম্পিয়ন + সেরা রানার্স-আপ = ৪ দল',
        cards: [
          { title: isEn ? '1st Semi-Final (Match 10)' : '১ম সেমিফাইনাল (ম্যাচ ১০)', time: isEn ? '10:30 PM' : 'রাত ১০:৩০', colorClass: 'mc-red', t1: isEn ? 'Group A Champion' : 'গ্রুপ এ চ্যাম্পিয়ন', t2: isEn ? 'Best Runner-Up' : 'সেরা রানার্স-আপ' },
          { title: isEn ? '2nd Semi-Final (Match 11)' : '২য় সেমিফাইনাল (ম্যাচ ১১)', time: isEn ? '11:00 PM' : 'রাত ১১:০০', colorClass: 'mc-blue', t1: isEn ? 'Group B Champion' : 'গ্রুপ বি চ্যাম্পিয়ন', t2: isEn ? 'Group C Champion' : 'গ্রুপ সি চ্যাম্পিয়ন' },
          { title: isEn ? '🥉 3rd Place Playoff (Match 12)' : '🥉 ৩য় স্থান নির্ধারণী (ম্যাচ ১২)', time: isEn ? '11:30 PM' : 'রাত ১১:৩০', colorClass: 'mc-purple', t1: isEn ? 'Semi 1 Runner-Up' : '১ম সেমি পরাজিত', t2: isEn ? 'Semi 2 Runner-Up' : '২য় সেমি পরাজিত' },
          { title: isEn ? '🏆 Grand Final (Match 13)' : '🏆 গ্র্যান্ড ফাইনাল (ম্যাচ ১৩)', time: isEn ? '12:00 AM' : 'রাত ১২:০০', colorClass: 'mc-dark', t1: isEn ? 'Semi 1 Winner' : '১ম সেমি বিজয়ী', t2: isEn ? 'Semi 2 Winner' : '২য় সেমি বিজয়ী' }
        ]
      };
    }
  }
}

// ----------------------------------------------------
// 0. POSTER STADIUM COVER & HERO BANNER HELPER
// Seamlessly inherits stadium cover, left/right logos,
// and branding from tournament setup & blank roster
// ----------------------------------------------------
function getPosterCoverUrl() {
  if (typeof activePosterTab !== 'undefined' && activePosterTab === 'promo') {
    if (typeof blankRosterImages !== 'undefined' && blankRosterImages) {
      if (blankRosterImages.coverType === 'custom' && blankRosterImages.customCover) {
        return blankRosterImages.customCover;
      }
      if (blankRosterImages.coverType === 'url' && blankRosterImages.activeCoverUrl) {
        return blankRosterImages.activeCoverUrl;
      }
    }
    return (typeof PROMO_STADIUM_BG_B64 !== 'undefined' && PROMO_STADIUM_BG_B64) ? PROMO_STADIUM_BG_B64 : 'assets/promo-stadium-trophy.jpg';
  }
  if (typeof getBlankRosterActiveCoverUrl === 'function') {
    return getBlankRosterActiveCoverUrl();
  }
  return 'assets/football-cover.jpg';
}

function getPosterCoverPosition() {
  if (typeof blankRosterImages !== 'undefined' && blankRosterImages && blankRosterImages.coverPosition !== undefined) {
    return blankRosterImages.coverPosition;
  }
  return 35;
}

function getPosterCoverType() {
  if (typeof blankRosterImages !== 'undefined' && blankRosterImages && blankRosterImages.coverType) {
    return blankRosterImages.coverType;
  }
  return 'default_stadium_trophy';
}

function getPosterLogoHtml(side) {
  if (typeof activePosterTab !== 'undefined' && activePosterTab === 'promo') {
    if (typeof blankRosterImages !== 'undefined' && blankRosterImages) {
      if (side === 'left' && blankRosterImages.leftType === 'custom' && blankRosterImages.customLeft) {
        return `<img src="${blankRosterImages.customLeft}" alt="Left Photo" class="hero-custom-logo-img promo-player-cutout" style="max-height:125px; width:auto; object-fit:contain; filter:drop-shadow(0 6px 14px rgba(0,0,0,0.8)); display:block;">`;
      }
      if (side === 'right' && blankRosterImages.rightType === 'custom' && blankRosterImages.customRight) {
        return `<img src="${blankRosterImages.customRight}" alt="Right Photo" class="hero-custom-logo-img promo-player-cutout" style="max-height:125px; width:auto; object-fit:contain; filter:drop-shadow(0 6px 14px rgba(0,0,0,0.8)); display:block;">`;
      }
    }
    const defaultPlayerSrc = side === 'left'
      ? ((typeof PROMO_MESSI_B64 !== 'undefined' && PROMO_MESSI_B64) ? PROMO_MESSI_B64 : 'assets/player-messi.png')
      : ((typeof PROMO_MBAPPE_B64 !== 'undefined' && PROMO_MBAPPE_B64) ? PROMO_MBAPPE_B64 : 'assets/player-mbappe.png');
    return `<img src="${defaultPlayerSrc}" alt="${side === 'left' ? 'Messi' : 'Mbappé'}" class="promo-player-cutout" style="max-height:125px; width:auto; object-fit:contain; filter:drop-shadow(0 6px 14px rgba(0,0,0,0.8)); display:block;">`;
  }
  if (typeof getBlankRosterLogoHtml === 'function') {
    return getBlankRosterLogoHtml(side);
  }
  if (side === 'left') {
    return `<svg viewBox="0 0 80 80" width="55" height="48" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 18 h36 v22 c0 11 -8 18 -18 18 s-18 -7 -18 -18 Z" fill="#f59e0b" stroke="#072a60" stroke-width="2.5"/>
      <path d="M22 24 C10 24 10 38 22 40" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
      <path d="M58 24 C70 24 70 38 58 40" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
      <rect x="36" y="58" width="8" height="10" fill="#d97706" stroke="#072a60" stroke-width="2"/>
      <rect x="26" y="68" width="28" height="8" rx="2" fill="#072a60"/>
      <polygon points="40,26 43,33 50,33 44,37 46,44 40,40 34,44 36,37 30,33 37,33" fill="#ffffff"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 80 80" width="55" height="48" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="40" rx="36" ry="24" fill="#0284c7" stroke="#ffffff" stroke-width="2"/>
    <ellipse cx="40" cy="40" rx="26" ry="16" fill="#0369a1"/>
    <polygon points="34,25 40,15 46,25" fill="#f59e0b"/>
  </svg>`;
}

function generatePosterHeroBannerHtml(opts) {
  const { badgeText, badgeStyle, extraMeta, c, defaultTitle, defaultOrg, defaultVenue, tFn, esc } = opts;
  const coverUrl = getPosterCoverUrl();
  const coverPos = getPosterCoverPosition();
  const coverType = getPosterCoverType();
  const leftLogo = getPosterLogoHtml('left');
  const rightLogo = getPosterLogoHtml('right');

  const hasCover = coverType !== 'none' && Boolean(coverUrl);

  return `
    <div class="promo-hero-header poster-hero-cover-banner" style="position:relative; margin:-16px -16px 10px -16px; border-radius:7px 7px 0 0; overflow:hidden; background:#072a60; text-align:center; border-bottom:none !important; padding:0 !important;">
      ${hasCover ? `
      <!-- Background Stadium Image with Focal Crop & Ambient Vignette -->
      <div class="poster-hero-bg-wrap" style="position:absolute; inset:0; overflow:hidden; z-index:1;">
        <img src="${coverUrl}" alt="Stadium Banner" class="poster-hero-img" style="width:100%; height:100%; object-fit:cover; object-position:center ${coverPos}%; display:block;">
        <div class="poster-hero-overlay" style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(7, 26, 68, 0.65) 0%, rgba(3, 12, 38, 0.35) 50%, rgba(5, 18, 50, 0.85) 100%);"></div>
      </div>
      ` : `
      <div style="position:absolute; inset:0; background:linear-gradient(135deg, #071f43 0%, #0c3875 100%); z-index:1;"></div>
      `}

      <!-- Foreground: Left Logo, Center Title & Right Logo -->
      <div class="poster-hero-content" style="position:relative; z-index:2; display:flex; justify-content:space-between; align-items:center; padding:12px 18px 10px 18px; box-sizing:border-box; gap:10px;">
        <!-- Left Logo / Trophy / Superstar Player -->
        <div class="poster-hero-logo" style="min-width:60px; max-width:130px; height:${activePosterTab === 'promo' ? '110px' : '65px'}; width:auto; display:flex; align-items:flex-end; justify-content:center; flex-shrink:0; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.7));">
          ${leftLogo}
        </div>

        <!-- Center Content -->
        <div class="poster-hero-center" style="text-align:center; flex:1; min-width:0;">
          ${badgeText ? `<span class="promo-badge-tag" style="${badgeStyle || ''}">${badgeText}</span>` : ''}
          <h1 class="promo-hero-title ${activePosterTab === 'promo' ? 'promo-gold-3d-title' : ''}" style="margin:2px 0 4px 0; font-size:${activePosterTab === 'promo' ? '25px' : '22px'}; font-weight:900; color:#ffca28; text-shadow:0 2px 8px rgba(0,0,0,0.85), 0 0 16px rgba(251,191,36,0.4); line-height:1.25;">
            ⚽ ${esc(c.title || defaultTitle)} ⚽
          </h1>
          <div class="promo-hero-sub ${activePosterTab === 'promo' ? 'promo-glass-capsule' : ''}" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap; font-size:11.5px; color:#e2e8f0; font-weight:600; background:rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.3); border-radius:20px; padding:3px 14px; backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); text-shadow:0 1px 3px rgba(0,0,0,0.8);">
            <span>🚩 ${tFn('poster.footer_org')} <strong>${esc(c.organizer || defaultOrg)}</strong></span>
            <span style="opacity:0.6;">|</span>
            <span>📍 ${tFn('page1.meta_venue')} <strong>${esc(c.venue || defaultVenue)}</strong></span>
            ${extraMeta ? `<span style="opacity:0.6;">|</span><span>${extraMeta}</span>` : ''}
          </div>
        </div>

        <!-- Right Logo / Venue / Sponsor / Superstar Player -->
        <div class="poster-hero-logo" style="min-width:60px; max-width:130px; height:${activePosterTab === 'promo' ? '110px' : '65px'}; width:auto; display:flex; align-items:flex-end; justify-content:center; flex-shrink:0; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.7));">
          ${rightLogo}
        </div>
      </div>

      <!-- Dynamic Curved Gold & Royal Blue Wavy Ribbon Swoosh -->
      <div class="poster-hero-swoosh" style="position:relative; z-index:3; width:100%; height:18px; margin-top:-6px; overflow:hidden;">
        <svg viewBox="0 0 1000 36" preserveAspectRatio="none" style="width:100%; height:100%; display:block;">
          <path d="M0,0 C200,32 350,36 500,20 C650,4 800,28 1000,0 L1000,36 L0,36 Z" fill="#fbbf24" opacity="0.95"/>
          <path d="M0,8 C220,36 370,32 500,24 C630,16 780,36 1000,10 L1000,36 L0,36 Z" fill="#072a60"/>
        </svg>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 1. OFFICIAL FIXTURE & SCHEDULE POSTER (PHASE 2)
// Clean layout using management panel styles:
// Group table without scores/winners; Knockout cards without score/winner blanks
// ----------------------------------------------------
function generateFixturePosterCardHtml() {
  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const tFn = typeof t === 'function' ? t : (k) => k;
  const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;

  const defaultTitle = isEn ? 'Football Tournament 2026' : 'ফুটবল টুর্নামেন্ট ২০২৬';
  const defaultOrg = isEn ? 'Tournament Organizing Committee' : 'টুর্নামেন্ট পরিচালনা কমিটি';
  const defaultVenue = isEn ? 'Local Sports Ground' : 'স্থানীয় খেলার মাঠ';
  const defaultFormat = isEn ? '6-a-side' : '৬-এ-সাইড';
  const defaultDuration = isEn ? '20 mins' : '২০ মিনিট';
  const defaultDate = isEn ? '2026' : '২০২৬';

  const matches = typeof getActiveGroupMatches === 'function' ? getActiveGroupMatches() : [];
  const type = c.tournamentType || 'groups';
  const count = c.teamCount || (c.teams ? c.teams.length : 9);

  const groupColors = {
    'A': '#b71c1c',
    'B': '#0d47a1',
    'C': '#1b5e20',
    'D': '#7c3aed',
    'KO': '#d97706'
  };

  let scheduleTitle = isEn ? '📅 Group & Knockout Match Schedule' : '📅 গ্রুপ পর্বের ম্যাচ সূচি ও নকআউট সময়সূচি';
  if (type === 'knockout') {
    scheduleTitle = isEn ? '📅 Knockout Fixtures & Match Schedule' : '📅 নকআউট পর্বের ম্যাচ সূচি ও সময়সূচি';
  } else if (type === 'league') {
    scheduleTitle = isEn ? '📅 Single League Stage Match Schedule' : '📅 একক লিগ পর্বের ম্যাচ সূচি ও সময়সূচি';
  }

  const matchRowsHtml = matches.map(m => {
    const grpColor = groupColors[m.group] || '#475569';
    let grpText = '';
    if (m.group === 'KO') {
      grpText = isEn ? 'Knockout' : 'নকআউট';
    } else if (type === 'league') {
      grpText = isEn ? 'League' : 'লিগ পর্ব';
    } else {
      grpText = isEn ? `Group ${m.group}` : `গ্রুপ ${m.group}`;
    }

    return `
      <tr>
        <td style="text-align:center; font-weight:700;">${m.id}</td>
        <td style="text-align:center; font-weight:600; color:#334155;">${esc(m.time || '')}</td>
        <td style="text-align:center; color:${grpColor}; font-weight:700;">${grpText}</td>
        <td>
          <div class="match-vs-grid">
            <div class="team-left">${esc(m.t1)}</div>
            <div><span class="vs-badge">VS</span></div>
            <div class="team-right">${esc(m.t2)}</div>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const koData = getDynamicKnockoutMatchesForPoster(c, isEn);
  const knockoutCardsHtml = koData.cards.map(card => {
    return `
      <div class="match-card">
        <div class="mc-head ${card.colorClass}">${esc(card.title)} | ${esc(card.time)}</div>
        <div class="mc-body" style="padding: 9px 8px;">
          <div class="fixture-poster-vs-row">
            <span class="team-badge-txt">${esc(card.t1)}</span>
            <span class="vs-badge" style="display:inline-block; width:18px; height:18px; font-size:8.5px;">VS</span>
            <span class="team-badge-txt">${esc(card.t2)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const heroHtml = generatePosterHeroBannerHtml({
    badgeText: tFn('poster.fixture_badge'),
    badgeStyle: 'background: linear-gradient(135deg, #0284c7, #0369a1);',
    extraMeta: `🗓️ <strong>${esc(c.startDate || defaultDate)}</strong>`,
    c,
    defaultTitle,
    defaultOrg,
    defaultVenue,
    tFn,
    esc
  });

  return `
    <div class="fixture-poster-card" id="fixture-poster-content">
      <!-- HERO BANNER -->
      ${heroHtml}

      <!-- 1. MATCH SCHEDULE TABLE (Reuses p1-card styling without scores/winners) -->
      <div class="p1-card" style="padding: 6px 8px;">
        <div class="section-title fixture-schedule-title-bar" style="margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #072a60, #0a3d87); color: #ffffff; padding: 6px 10px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
          <span style="font-size: 12px; font-weight: 800; color: #ffffff; display: flex; align-items: center; gap: 6px; letter-spacing: 0.2px;">${scheduleTitle}</span>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="fixture-meta-pill" style="font-size: 10.5px; font-weight: 700; background: rgba(255, 255, 255, 0.15); color: #fde047; padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(253, 224, 71, 0.35); white-space: nowrap;">👥 ${count} ${isEn ? 'Teams' : 'টি দল'}</span>
            <span class="fixture-meta-pill" style="font-size: 10.5px; font-weight: 700; background: rgba(255, 255, 255, 0.15); color: #4ade80; padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(74, 222, 128, 0.35); white-space: nowrap;">⚽ ${matches.length + koData.cards.length} ${isEn ? 'Matches' : 'টি ম্যাচ'}</span>
          </div>
        </div>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="width:10%;">${isEn ? 'Match' : 'ম্যাচ নং'}</th>
              <th style="width:18%;">${isEn ? 'Time' : 'সময়'}</th>
              <th style="width:16%;">${isEn ? 'Group / Stage' : 'গ্রুপ / পর্ব'}</th>
              <th style="width:56%;">${isEn ? 'Versus Teams' : 'মুখোমুখি দল'}</th>
            </tr>
          </thead>
          <tbody>
            ${matchRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- 2. KNOCKOUT BRACKET SECTION (Reuses match-card styling without score/winner blanks) -->
      <div class="p1-card" style="padding: 6px 8px;">
        <div class="bracket-header" style="margin-bottom: 5px;">
          <div>
            <div class="section-title" style="margin-bottom: 2px; font-size:12px; font-weight:800; color:#0d2b6b;">${tFn('poster.bracket_title')}</div>
            <p style="font-weight:700; font-size: 11px; color: #475569; margin:0;">${esc(koData.subtitle)}</p>
          </div>
          <div class="trophies-showcase">
            <div class="trophy-item t-gold"><span class="trophy-icon">🏆</span> <span>${isEn ? 'Champion' : 'চ্যাম্পিয়ন'}</span></div>
            <div class="trophy-item t-silver"><span class="trophy-icon">🏆</span> <span>${isEn ? 'Runner-Up' : 'রানার্স-আপ'}</span></div>
            <div class="trophy-item t-bronze"><span class="trophy-icon">🏆</span> <span>${isEn ? '3rd Place' : '৩য় স্থান'}</span></div>
          </div>
        </div>

        <div class="bracket-grid-2x2">
          ${knockoutCardsHtml}
        </div>
      </div>

      <!-- FOOTER NOTE & SIGNATURE -->
      <div class="fixture-poster-footer" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 6px; padding: 6px 10px; font-size: 10.5px; color: #cbd5e1; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
        <div>${tFn('poster.footer_notice')}</div>
        <div style="font-weight:700; color:#38bdf8;">🚩 ${esc(c.organizer || defaultOrg)}</div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 2. PROMOTIONAL NOTICE & REGISTRATION POSTER (PHASE 1)
// ----------------------------------------------------
function getRibbonMedalSvg(isSilver) {
  const medalGradId = isSilver ? 'ruMedalGrad' : 'champMedalGrad';
  const medalStroke = isSilver ? '#94a3b8' : '#ca8a04';
  const starFill = isSilver ? '#f8fafc' : '#ffffff';
  return `
    <svg class="prize-ribbon-medal-svg" viewBox="0 0 36 46" width="28" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle; filter:drop-shadow(0 3px 6px rgba(0,0,0,0.8)); margin-right:4px;">
      <defs>
        <linearGradient id="champMedalGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="25%" stop-color="#fde047"/>
          <stop offset="65%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
        <linearGradient id="ruMedalGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="35%" stop-color="#cbd5e1"/>
          <stop offset="70%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <!-- Folded V-Ribbon (Blue-White-Red Stripes) -->
      <!-- Left side fold -->
      <polygon points="10,0 18,17 14,17 7,0" fill="#1d4ed8"/>
      <polygon points="7,0 14,17 10,17 4,0" fill="#ffffff"/>
      <polygon points="4,0 10,17 6,17 0,0" fill="#b91c1c"/>
      <!-- Right side fold -->
      <polygon points="26,0 18,17 22,17 29,0" fill="#1d4ed8"/>
      <polygon points="29,0 22,17 26,17 32,0" fill="#ffffff"/>
      <polygon points="32,0 26,17 30,17 36,0" fill="#b91c1c"/>
      <!-- Medal Circle Rim -->
      <circle cx="18" cy="27" r="13.5" fill="url(#${medalGradId})" stroke="${medalStroke}" stroke-width="1.5"/>
      <circle cx="18" cy="27" r="10.5" fill="none" stroke="${medalStroke}" stroke-width="0.8" stroke-dasharray="2 1"/>
      <!-- Embossed Star in Center -->
      <polygon points="18,18 20.5,23.5 26.5,24 22,28 23.5,34 18,30.8 12.5,34 14,28 9.5,24 15.5,23.5" fill="${starFill}" opacity="0.95"/>
    </svg>
  `;
}

function formatDualTonePrizeHtml(rawText, esc) {
  if (!rawText) return '';
  const str = String(rawText).trim();
  const match = str.match(/^([০-৯0-9,]+(?:\s*(?:টাকা|BDT|\$|Tk))?)(.*)$/i);
  if (match && match[1]) {
    const numPart = match[1].trim();
    const restPart = match[2].trim();
    return `<span class="prize-amount-gold">${esc(numPart)}</span> ${restPart ? `<span class="prize-amount-white">${esc(restPart)}</span>` : ''}`;
  }
  return `<span class="prize-amount-gold">${esc(str)}</span>`;
}

function getWheatSheafSvg(isLeft) {
  return `
    <svg class="wheat-sheaf-svg ${isLeft ? 'wheat-sheaf-left' : 'wheat-sheaf-right'}" viewBox="0 0 68 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sheafHigh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="25%" stop-color="#fff59d"/>
          <stop offset="65%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
        <linearGradient id="sheafShad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="35%" stop-color="#eab308"/>
          <stop offset="75%" stop-color="#b45309"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
        <linearGradient id="sheafStemGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stop-color="#ca8a04"/>
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#fef08a"/>
        </linearGradient>
      </defs>
      <!-- Thick 3D Curved Golden Stem -->
      <path d="M24 116 C 9 68 16 30 46 10" stroke="url(#sheafStemGrad)" stroke-width="3.2" stroke-linecap="round"/>

      <!-- 8 Dense Pairs of Plump 3D Wheat Grains (Embossed Center Crease) -->
      <!-- Pair 1 -->
      <path d="M24 108 C12 112 5 104 6 94 L24 108 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M24 108 C19 100 13 94 6 94 L24 108 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="24" y1="108" x2="6" y2="94" stroke="#fff7aa" stroke-width="0.8"/>

      <path d="M25 108 C36 112 47 103 48 92 L25 108 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M25 108 C31 99 39 93 48 92 L25 108 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="25" y1="108" x2="48" y2="92" stroke="#fff7aa" stroke-width="0.8"/>

      <!-- Pair 2 -->
      <path d="M21 95 C9 99 2 89 3 79 L21 95 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M21 95 C16 87 10 80 3 79 L21 95 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="21" y1="95" x2="3" y2="79" stroke="#fff7aa" stroke-width="0.8"/>

      <path d="M22 95 C34 99 46 87 47 76 L22 95 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M22 95 C29 86 38 78 47 76 L22 95 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="22" y1="95" x2="47" y2="76" stroke="#fff7aa" stroke-width="0.8"/>

      <!-- Pair 3 -->
      <path d="M18 81 C6 85 1 73 2 63 L18 81 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M18 81 C13 73 8 64 2 63 L18 81 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="18" y1="81" x2="2" y2="63" stroke="#fff7aa" stroke-width="0.8"/>

      <path d="M19 81 C32 85 46 72 47 60 L19 81 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M19 81 C27 72 37 62 47 60 L19 81 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="19" y1="81" x2="47" y2="60" stroke="#fff7aa" stroke-width="0.8"/>

      <!-- Pair 4 -->
      <path d="M17 67 C5 70 1 58 3 47 L17 67 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M17 67 C13 59 9 49 3 47 L17 67 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="17" y1="67" x2="3" y2="47" stroke="#fff7aa" stroke-width="0.8"/>

      <path d="M19 67 C33 70 48 57 49 45 L19 67 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M19 67 C28 58 39 48 49 45 L19 67 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="19" y1="67" x2="49" y2="45" stroke="#fff7aa" stroke-width="0.8"/>

      <!-- Pair 5 -->
      <path d="M18 53 C7 56 4 43 6 33 L18 53 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M18 53 C15 45 12 35 6 33 L18 53 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="18" y1="53" x2="6" y2="33" stroke="#fff7aa" stroke-width="0.8"/>

      <path d="M21 53 C36 56 51 43 52 31 L21 53 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M21 53 C31 44 42 34 52 31 L21 53 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="21" y1="53" x2="52" y2="31" stroke="#fff7aa" stroke-width="0.8"/>

      <!-- Pair 6 -->
      <path d="M21 39 C11 41 9 29 11 20 L21 39 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M21 39 C19 32 17 23 11 20 L21 39 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="21" y1="39" x2="11" y2="20" stroke="#fff7aa" stroke-width="0.8"/>

      <path d="M24 39 C39 41 54 30 55 19 L24 39 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M24 39 C34 31 46 22 55 19 L24 39 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="24" y1="39" x2="55" y2="19" stroke="#fff7aa" stroke-width="0.8"/>

      <!-- Pair 7 -->
      <path d="M26 26 C17 27 16 17 19 9 L26 26 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M26 26 C25 20 23 12 19 9 L26 26 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="26" y1="26" x2="19" y2="9" stroke="#fff7aa" stroke-width="0.8"/>

      <path d="M31 26 C45 28 58 19 59 10 L31 26 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M31 26 C41 20 51 13 59 10 L31 26 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="31" y1="26" x2="59" y2="10" stroke="#fff7aa" stroke-width="0.8"/>

      <!-- Pair 8 -->
      <path d="M34 16 C27 16 27 7 30 2 L34 16 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M34 16 C33 11 32 5 30 2 L34 16 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="34" y1="16" x2="30" y2="2" stroke="#fff7aa" stroke-width="0.8"/>

      <path d="M39 16 C50 17 59 9 60 2 L39 16 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M39 16 C46 11 54 5 60 2 L39 16 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="39" y1="16" x2="60" y2="2" stroke="#fff7aa" stroke-width="0.8"/>

      <!-- Crowning Top Grain -->
      <path d="M43 11 C41 5 44 1 48 0 L43 11 Z" fill="url(#sheafHigh)" stroke="#78350f" stroke-width="1"/>
      <path d="M43 11 C47 7 51 3 48 0 L43 11 Z" fill="url(#sheafShad)" stroke="#78350f" stroke-width="1"/>
      <line x1="43" y1="11" x2="48" y2="0" stroke="#fff7aa" stroke-width="0.8"/>

      <!-- 3D Base Tie Node -->
      <circle cx="24" cy="116" r="4.5" fill="url(#sheafStemGrad)" stroke="#78350f" stroke-width="1.2"/>
      <circle cx="24" cy="116" r="2" fill="#fff59d"/>
    </svg>
  `;
}

function generatePromoPosterCardHtml() {
  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const selectedSet = new Set(c.selectedRules || []);
  const activeMasterRules = (typeof MASTER_RULES_CATALOG !== 'undefined' ? MASTER_RULES_CATALOG : []).filter(r => selectedSet.has(r.id) && (typeof isRuleApplicableToFormat !== 'function' || isRuleApplicableToFormat(r.id, c)));
  const activeCustomRules = c.customRules || [];
  const allActiveRules = [...activeMasterRules, ...activeCustomRules];

  const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
  let rulesListHtml = '';
  const col1Items = [];
  const col2Items = [];
  const halfCount = Math.ceil(allActiveRules.length / 2);

  allActiveRules.forEach((r, idx) => {
    const rTitle = typeof resolveRuleTitle === 'function' ? resolveRuleTitle(r, c, isEn) : (isEn && r.titleEn ? r.titleEn : r.title);
    const rDesc = typeof resolveRuleDesc === 'function' ? resolveRuleDesc(r, c, isEn) : (isEn && r.descEn ? r.descEn : r.desc);
    rulesListHtml += `<li><strong>${esc(rTitle)}:</strong> ${esc(rDesc)}</li>`;
    const itemHtml = `
      <div class="promo-rule-item">
        <span class="rule-num-badge">${idx + 1}</span>
        <div class="rule-text">
          <strong class="rule-title-line">${esc(rTitle)}:</strong>
          <span class="rule-desc-line">${esc(rDesc)}</span>
        </div>
      </div>
    `;
    if (idx < halfCount) {
      col1Items.push(itemHtml);
    } else {
      col2Items.push(itemHtml);
    }
  });

  const defaultTitle = isEn ? 'Football Tournament 2026' : 'ফুটবল টুর্নামেন্ট ২০২৬';
  const defaultOrg = isEn ? 'Tournament Organizing Committee' : 'টুর্নামেন্ট পরিচালনা কমিটি';
  const defaultVenue = isEn ? 'Local Sports Ground' : 'স্থানীয় খেলার মাঠ';
  const defaultFormat = isEn ? '6-a-side' : '৬-এ-সাইড';
  const defaultDuration = isEn ? '20 mins' : '২০ মিনিট';
  const defaultDate = isEn ? '2026' : '২০২৬';

  const tFn = typeof t === 'function' ? t : (k) => k;
  const coverUrl = getPosterCoverUrl();

  const heroHtml = generatePosterHeroBannerHtml({
    badgeText: '',
    badgeStyle: '',
    extraMeta: `🗓️ <strong>${esc(c.startDate || defaultDate)}</strong>`,
    c,
    defaultTitle,
    defaultOrg,
    defaultVenue,
    tFn,
    esc
  });

  return `
    <div class="promo-poster-card" id="promo-poster-content" style="position:relative; overflow:hidden;">
      <!-- Background Stadium Image with Crowd Silhouettes at the bottom -->
      <div class="promo-card-bg-wrap" style="position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden;">
        <img src="${coverUrl}" alt="Stadium" style="width:100%; height:100%; object-fit:cover; object-position:center bottom; opacity:0.32; display:block;">
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(7,28,61,0.55) 0%, rgba(5,20,43,0.75) 45%, rgba(3,11,24,0.88) 80%, rgba(2,7,18,0.95) 100%);"></div>
      </div>

      <!-- HERO BANNER -->
      ${heroHtml}

      <!-- ROW 1: 3 BLUE GLASS SPECIFICATION CARDS -->
      <div class="promo-ref-specs-grid promo-meta-grid" style="position:relative; z-index:2;">
        <div class="promo-ref-spec-card promo-meta-item">
          <div class="spec-card-top p-label">🗓️ ${tFn('poster.date')}</div>
          <div class="spec-card-val p-val">${esc(c.startDate || defaultDate)} (${c.startingPlayers || 7} ${isEn ? 'on pitch' : 'জন মাঠে'}, ${c.benchPlayers || 4} ${isEn ? 'subs' : 'জন বদলি'})</div>
        </div>
        <div class="promo-ref-spec-card promo-meta-item">
          <div class="spec-card-top p-label">⏱️ ${tFn('poster.duration')}</div>
          <div class="spec-card-val p-val">${esc(c.matchDuration || defaultDuration)}</div>
        </div>
        <div class="promo-ref-spec-card promo-meta-item">
          <div class="spec-card-top p-label">🏆 ${tFn('poster.edition')}</div>
          <div class="spec-card-val p-val">${esc(c.formatType || c.edition || defaultFormat)}</div>
        </div>
      </div>

      <!-- ROW 2: 2 GOLDEN WHEAT SHEAF PRIZE CARDS -->
      <div class="promo-ref-prizes-grid promo-prizes-wrap" style="position:relative; z-index:2;">
        <div class="promo-ref-prize-card promo-champ-card promo-prize-card champ">
          ${getWheatSheafSvg(true)}
          ${getWheatSheafSvg(false)}
          <div class="prize-card-badge promo-prize-title">
            ${getRibbonMedalSvg(false)}
            <span>${tFn('poster.champ_prize')}</span>
          </div>
          <div class="prize-card-amount promo-prize-amount">${formatDualTonePrizeHtml(c.championPrize || (isEn ? '20,000 BDT & Trophy' : '২০,০০০ টাকা ও আকর্ষণীয় ট্রফি'), esc)}</div>
          <div class="prize-card-sub" style="font-size:11px; color:#ffffff; font-weight:700;">${tFn('poster.champ_sub')}</div>
        </div>
        <div class="promo-ref-prize-card promo-ru-card promo-prize-card ru">
          ${getWheatSheafSvg(true)}
          ${getWheatSheafSvg(false)}
          <div class="prize-card-badge promo-prize-title">
            ${getRibbonMedalSvg(true)}
            <span>${tFn('poster.runner_prize')}</span>
          </div>
          <div class="prize-card-amount promo-prize-amount">${formatDualTonePrizeHtml(c.runnerUpPrize || (isEn ? '10,000 BDT & Trophy' : '১০,০০০ টাকা ও ট্রফি'), esc)}</div>
          <div class="prize-card-sub" style="font-size:11px; color:#cbd5e1; font-weight:700;">${tFn('poster.runner_sub')}</div>
        </div>
      </div>

      <!-- ROW 3: SECONDARY PRIZES STRIP -->
      <div class="promo-ref-subprizes-strip" style="position:relative; z-index:2;">
        <div class="subprize-item">🏆 <strong>${tFn('poster.third_place')}</strong> ${esc(c.thirdPrize || (isEn ? 'Trophy & Medals' : '৩য় স্থান: ট্রফি ও মেডেল'))}</div>
        <div class="subprize-sep">|</div>
        <div class="subprize-item">🏅 <strong>${tFn('poster.special_awards')}</strong> ${esc(c.otherPrizes || (isEn ? 'Best Player, Top Scorer, Best GK' : 'সেরা খেলোয়াড়, সেরা গোলদাতা, সেরা গোলকিপার'))}</div>
      </div>

      <!-- ROW 4: 2-COLUMN INFO & CONTACT STRIP -->
      <div class="promo-ref-info-strip promo-entry-contact-box" style="position:relative; z-index:2;">
        <div class="info-strip-col">
          <div>👥 <strong style="color:#fde047;">${tFn('poster.entry_fee')}</strong> ${esc(c.entryFee || (isEn ? '1,200 BDT' : '১,২০০ টাকা'))}</div>
          <div>🗓️ <strong style="color:#fde047;">${tFn('poster.reg_deadline')}</strong> ${esc(c.regDeadline || (isEn ? 'Before Kickoff' : 'ম্যাচ শুরুর ৩০ মিনিট পূর্বে'))}</div>
        </div>
        <div class="info-strip-divider"></div>
        <div class="info-strip-col info-strip-col-right">
          <div>📞 <strong style="color:#38bdf8;">${tFn('poster.contact')}</strong> ${esc(c.contactPhone || (isEn ? 'Inbox / Hotline' : '০১৭১১-xxxxxx'))}</div>
          <div>📱 <strong style="color:#38bdf8;">${tFn('poster.payment')}</strong> ${esc(c.paymentMethod || (isEn ? 'bKash / Nagad' : 'বিকাশ / নগদ (পার্সোনাল)'))}</div>
        </div>
      </div>

      <!-- ROW 5: MASTER RULES BOARD (WHITE ROUNDED CARD WITH VERTICAL DIVIDER) -->
      <div class="promo-ref-rules-card promo-rules-preview-box" style="position:relative; z-index:2;">
        <div class="rules-card-header-wrap promo-rules-preview-title">
          <div class="rules-card-header-pill">
            <span>📋 ${tFn('poster.rules_title')} (${allActiveRules.length} ${tFn('common.items_unit')}):</span>
          </div>
        </div>
        ${allActiveRules.length === 0 ? `
          <div style="font-size:10.5px; color:#64748b; font-style:italic; padding:6px 0; text-align:center;">
            ${isEn ? 'No rules selected. Configure rules in Tournament Setup.' : 'কোনো বিশেষ নিয়মাবলী সেট করা হয়নি। টুর্নামেন্ট সেটআপ থেকে নিয়ম নির্বাচন করুন।'}
          </div>
        ` : `
          <div class="promo-rules-grid-2col">
            <div class="promo-rules-col">${col1Items.join('')}</div>
            <div class="promo-rules-divider"></div>
            <div class="promo-rules-col">${col2Items.join('')}</div>
          </div>
          <ol class="promo-rules-ol" style="display:none;">
            ${rulesListHtml}
          </ol>
        `}
      </div>

      <!-- FOOTER RIBBON OVER CROWD -->
      <div class="promo-footer-sign promo-ref-footer" style="position:relative; z-index:2;">
        <div>⚽ <strong>${isEn ? 'In the spirit of sports, united in bond' : 'খেলাধুলার চেতনায়, ঐক্যের বন্ধনে'} — ${esc(c.title || defaultTitle)}</strong></div>
        <div style="color:#fde047;">🚩 <strong>${tFn('poster.footer_org')}</strong> ${esc(c.organizer || defaultOrg)}</div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// TAB NAVIGATION & MODAL CONTROLS
// ----------------------------------------------------
function switchPosterTab(tab) {
  activePosterTab = tab === 'promo' ? 'promo' : (tab === 'results' ? 'results' : 'fixture');
  const container = document.getElementById('promo-poster-render-target');
  const btnFixture = document.getElementById('tab-btn-poster-fixture');
  const btnPromo = document.getElementById('tab-btn-poster-promo');
  const btnResults = document.getElementById('tab-btn-poster-results');
  const copyBtn = document.getElementById('btn-poster-copy-action');
  const printBtn = document.getElementById('btn-poster-print-action');
  const brandingBtn = document.getElementById('btn-poster-branding-setup');
  const subtitleEl = document.querySelector('.modal-promo-subtitle');
  const tipEl = document.querySelector('.modal-promo-tip');
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  if (btnFixture) btnFixture.classList.toggle('active', activePosterTab === 'fixture');
  if (btnPromo) btnPromo.classList.toggle('active', activePosterTab === 'promo');
  if (btnResults) btnResults.classList.toggle('active', activePosterTab === 'results');

  if (activePosterTab === 'results') {
    if (brandingBtn) brandingBtn.style.display = 'none';
    if (copyBtn) {
      copyBtn.style.display = 'inline-flex';
      copyBtn.textContent = isEn ? '📦 Download All (PNG)' : '📦 সবগুলো ছবি ডাউনলোড (PNG)';
      copyBtn.setAttribute('onclick', 'downloadAllSocialCards(this)');
    }
    if (printBtn) {
      printBtn.style.display = 'inline-flex';
      printBtn.textContent = isEn ? '📸 Download Master Board (PNG)' : '📸 সম্পূর্ণ বোর্ড ছবি (PNG)';
      printBtn.setAttribute('onclick', "downloadSocialCard('full', this)");
    }
    if (subtitleEl) {
      subtitleEl.textContent = isEn
        ? 'Share live standings, knockout bracket & master board cards on Facebook & WhatsApp'
        : 'ম্যাচ শেষে সোশ্যাল মিডিয়ায় এক ক্লিকে লাইভ ফলাফল ও পয়েন্ট টেবিল শেয়ার করুন';
    }
    if (tipEl) {
      tipEl.textContent = isEn
        ? '💡 Tip: Click any "📸 Download (PNG)" button to directly download crisp images ready for Facebook & WhatsApp.'
        : '💡 টিপস: যেকোনো "📸 ছবি ডাউনলোড (PNG)" বাটনে ক্লিক করে সরাসরি সোশ্যাল মিডিয়ায় পোস্ট করার উপযোগী ক্রিস্টাল-ক্লিয়ার ছবি নামিয়ে নিন।';
    }
    if (container) {
      if (typeof generateSocialExportCardsHtml === 'function') {
        container.innerHTML = generateSocialExportCardsHtml();
      } else {
        container.innerHTML = '<div style="padding:20px; text-align:center;">Loading Social Cards...</div>';
      }
    }
  } else {
    if (brandingBtn) brandingBtn.style.display = 'inline-flex';
    if (copyBtn) {
      copyBtn.style.display = 'inline-flex';
      if (activePosterTab === 'fixture') {
        copyBtn.textContent = isEn ? '📋 Copy Fixture Post' : '📋 ফিক্সচার পোস্ট কপি করুন';
        copyBtn.setAttribute('onclick', 'copyFacebookFixturePost()');
      } else {
        copyBtn.textContent = isEn ? '📋 Copy Promo Post' : '📋 ফেসবুক পোস্ট কপি করুন';
        copyBtn.setAttribute('onclick', 'copyFacebookPromoPost()');
      }
    }

    if (printBtn) {
      printBtn.style.display = 'inline-flex';
      if (activePosterTab === 'fixture') {
        printBtn.textContent = isEn ? '📸 Download Fixture (PNG)' : '📸 ফিক্সচার ছবি ডাউনলোড (PNG)';
        printBtn.setAttribute('onclick', "downloadSocialCard('fixtures', this)");
      } else {
        printBtn.textContent = isEn ? '📸 Download Notice (PNG)' : '📸 নোটিশ ছবি ডাউনলোড (PNG)';
        printBtn.setAttribute('onclick', "downloadSocialCard('promo', this)");
      }
    }

    if (subtitleEl) {
      subtitleEl.textContent = activePosterTab === 'fixture'
        ? (isEn ? 'Official match schedule and knockout roadmap for all registered teams' : 'নিবন্ধিত সকল দলের অফিশিয়াল খেলার সূচি ও নকআউট রোডম্যাপ')
        : (isEn ? 'Tournament notice, rules & registration invitation banner for social media' : 'টুর্নামেন্ট শুরুর পূর্বে দল আহ্বান, প্রাইজমানি ও অফিসিয়াল নোটিশ');
    }

    if (tipEl) {
      tipEl.textContent = isEn
        ? '💡 Tip: Click "📸 Download Image (PNG)" to save crisp pictures ready for direct sharing on Facebook & WhatsApp.'
        : '💡 টিপস: "📸 ছবি ডাউনলোড (PNG)" বাটনে ক্লিক করে সরাসরি ফেসবুক ও হোয়াটসঅ্যাপে পোস্ট করার উপযোগী হাই-রেজোলিউশন ছবি নামিয়ে নিন।';
    }

    if (container) {
      container.innerHTML = activePosterTab === 'fixture' 
        ? generateFixturePosterCardHtml() 
        : generatePromoPosterCardHtml();
    }

    renderPrintablePosterSheet();
  }
}

function openPromoPosterModal(tab = 'fixture') {
  activePosterTab = tab === 'promo' ? 'promo' : (tab === 'results' ? 'results' : 'fixture');
  const modal = document.getElementById('promo-poster-modal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
  switchPosterTab(activePosterTab);
}

function openSocialHubModal(tab = 'promo') {
  openPromoPosterModal(tab);
}

function openFixturePosterModal() {
  openPromoPosterModal('fixture');
}

function closePromoPosterModal() {
  const modal = document.getElementById('promo-poster-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function renderPrintablePosterSheet() {
  const pagePoster = document.getElementById('page-poster');
  if (pagePoster) {
    pagePoster.innerHTML = activePosterTab === 'fixture'
      ? generateFixturePosterCardHtml()
      : generatePromoPosterCardHtml();
  }
}

// ----------------------------------------------------
// COPY TO CLIPBOARD: FIXTURE POST & PROMO POST
// ----------------------------------------------------
function copyFacebookFixturePost() {
  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const matches = typeof getActiveGroupMatches === 'function' ? getActiveGroupMatches() : [];
  const koData = getDynamicKnockoutMatchesForPoster(c, isEn);

  let matchLines = '';
  matches.forEach(m => {
    const grp = m.group === 'KO' ? (isEn ? 'Knockout' : 'নকআউট') : (isEn ? `Group ${m.group}` : `গ্রুপ ${m.group}`);
    matchLines += isEn
      ? `• Match ${m.id}: ${m.t1} VS ${m.t2} (${m.time || ''} | ${grp})\n`
      : `• ম্যাচ ${m.id}: ${m.t1} বনাম ${m.t2} (${m.time || ''} | ${grp})\n`;
  });

  let koLines = '';
  koData.cards.forEach(card => {
    koLines += isEn
      ? `• ${card.title}: ${card.t1} VS ${card.t2} (${card.time})\n`
      : `• ${card.title}: ${card.t1} বনাম ${card.t2} (${card.time})\n`;
  });

  const postText = isEn ? `
⚽🏆 ${c.title || 'Football Tournament 2026'} 🏆⚽
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 Official Match Fixtures & Schedule Announcement!

🚩 Organized by: ${c.organizer || 'Tournament Organizing Committee'}
📍 Venue: ${c.venue || 'Local Sports Ground'}
🗓️ Kickoff Date: ${c.startDate || 'Coming Soon'}
⚡ Format: ${c.formatType || '6-a-side'} • Match Duration: ${c.matchDuration || '20 mins'}

📅 Group / Opening Stage Fixtures:
${matchLines}
👑 Knockout Stage Schedule:
${koLines}
⚠️ Notice: Teams must report 15 mins prior to kickoff. Discipline is strictly enforced and referee decision is final.

📢 Support your favorite squad and share this post!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#FootballTournament #Fixtures #MatchSchedule #${(c.title || 'Tournament').replace(/\s+/g, '_')}
`.trim() : `
⚽🏆 ${c.title || 'ফুটবল টুর্নামেন্ট ২০২৬'} 🏆⚽
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 অফিশিয়াল ম্যাচ ফিক্সচার ও খেলার সময়সূচি ঘোষণা!

🚩 আয়োজনে: ${c.organizer || 'আয়োজক কমিটি'}
📍 খেলার মাঠ / ভেন্যু: ${c.venue || 'স্থানীয় খেলার মাঠ'}
🗓️ শুরুর তারিখ: ${c.startDate || 'শীঘ্রই আসছে'}
⚡ ফরম্যাট: ${c.formatType || '৬-এ-সাইড'} • ম্যাচের সময়: ${c.matchDuration || '২০ মিনিট'}

📅 প্রাথমিক পর্বের ম্যাচ সূচি (কার সাথে কার খেলা):
${matchLines}
👑 নকআউট পর্বের সময়সূচি ও রোডম্যাপ:
${koLines}
⚠️ বিশেষ দ্রষ্টব্য: সকল দলকে নিজ নিজ ম্যাচ শুরুর নির্ধারিত সময়ের ১৫ মিনিট পূর্বে মাঠে উপস্থিত থাকতে হবে। মাঠে শৃঙ্খলা বজায় রাখা বাধ্যতামূলক এবং রেফারির সিদ্ধান্তই চূড়ান্ত।

📢 আপনার পছন্দের দলকে শুভকামনা জানাতে পোস্টটি শেয়ার করুন!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#FootballTournament #Fixtures #MatchSchedule #${(c.title || 'Tournament').replace(/\s+/g, '_')}
`.trim();

  const successMsg = isEn
    ? '📋 Official match fixture & schedule copied to clipboard!\nYou can now paste it directly into Facebook, WhatsApp, or any social media page.'
    : '📋 অফিশিয়াল ম্যাচ ফিক্সচার ও সময়সূচির লেখাটি কপি করা হয়েছে!\nএখন যেকোনো ফেসবুক পেজ, গ্রুপ বা হোয়াটসঅ্যাপে পেস্ট করুন।';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(postText).then(() => {
      alert(successMsg);
    }).catch(err => {
      fallbackCopyText(postText);
    });
  } else {
    fallbackCopyText(postText);
  }
}

function copyFacebookPromoPost() {
  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const selectedSet = new Set(c.selectedRules || []);
  const activeMasterRules = (typeof MASTER_RULES_CATALOG !== 'undefined' ? MASTER_RULES_CATALOG : []).filter(r => selectedSet.has(r.id) && (typeof isRuleApplicableToFormat !== 'function' || isRuleApplicableToFormat(r.id, c)));
  const activeCustomRules = c.customRules || [];
  const allActiveRules = [...activeMasterRules, ...activeCustomRules];

  let rulesText = '';
  allActiveRules.slice(0, 10).forEach((r, idx) => {
    const rTitle = typeof resolveRuleTitle === 'function' ? resolveRuleTitle(r, c, isEn) : (isEn && r.titleEn ? r.titleEn : r.title);
    const rDesc = typeof resolveRuleDesc === 'function' ? resolveRuleDesc(r, c, isEn) : (isEn && r.descEn ? r.descEn : r.desc);
    rulesText += `${idx + 1}. ${rTitle}: ${rDesc}\n`;
  });
  if (allActiveRules.length > 10) {
    rulesText += isEn
      ? `...and ${allActiveRules.length - 10} more rules in the official fixture sheet.\n`
      : `...এবং আরও ${allActiveRules.length - 10}টি নিয়মাবলী ফিকশ্চার শিটে দ্রষ্টব্য।\n`;
  }

  const postText = isEn ? `
⚽🏆 ${c.title || 'Football Tournament 2026'} 🏆⚽
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 Official Tournament Announcement & Registration Notice!

🚩 Organized by: ${c.organizer || 'Tournament Organizing Committee'}
📍 Venue: ${c.venue || 'Local Sports Ground'}
🗓️ Kickoff Date: ${c.startDate || 'Coming Soon'}

⚡ Tournament Format & Match Info:
• Format: ${c.formatType || '6-a-side'}
• Match Duration: ${c.matchDuration || '20 mins'}

💰 Grand Prize Pool & Accolades:
🥇 Champion Team: ${c.championPrize || 'Trophy & Prize Money'}
🥈 Runner-Up Team: ${c.runnerUpPrize || 'Runner-Up Trophy & Cash Prize'}
🥉 3rd Place: ${c.thirdPrize || 'Medals & Trophy'}
🎖️ Special Awards: ${c.otherPrizes || 'Golden Boot, Golden Gloves & MVP'}

📝 Registration & Team Entry Fee:
💵 Entry Fee: ${c.entryFee || 'Contact Committee'}
⏰ Registration Deadline: ${c.regDeadline || 'Before Kickoff'}
📞 Contact / Hotline: ${c.contactPhone || 'Inbox / Call'}
💳 Payment Method: ${c.paymentMethod || 'Direct / Mobile Banking'}

📜 Key Rules & Participation Guidelines:
${rulesText}
⚠️ Important Notice: Referee decision is final. Any unsportsmanlike conduct or unregistered players will cause immediate squad disqualification.

📢 Limited team slots available! Confirm your squad's participation today!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#FootballTournament #Football #${(c.title || 'Tournament').replace(/\s+/g, '_')}
`.trim() : `
⚽🏆 ${c.title || 'ফুটবল টুর্নামেন্ট ২০২৬'} 🏆⚽
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 টুর্নামেন্ট শুরুর শুভ ঘোষণা ও অফিসিয়াল নোটিশ!

🚩 আয়োজনে: ${c.organizer || 'আয়োজক কমিটি'}
📍 খেলার মাঠ / ভেন্যু: ${c.venue || 'স্থানীয় খেলার মাঠ'}
🗓️ শুরুর সম্ভাব্য তারিখ: ${c.startDate || 'শীঘ্রই আসছে'}

⚡ টুর্নামেন্ট ফরম্যাট ও ডিটেইলস:
• ফরম্যাট: ${c.formatType || '৬-এ-সাইড'}
• ম্যাচের সময়: ${c.matchDuration || '২০ মিনিট'}

💰 মেগা প্রাইজমানি ও আকর্ষণীয় পুরস্কার:
🥇 চ্যাম্পিয়ন: ${c.championPrize || 'ট্রফি ও প্রাইজমানি'}
🥈 রানার্স-আপ: ${c.runnerUpPrize || 'রানার্স-আপ ট্রফি ও অর্থ'}
🥉 ৩য় স্থান: ${c.thirdPrize || 'মেডেল ও ট্রফি'}
🎖️ বিশেষ পুরস্কার: ${c.otherPrizes || 'গোল্ডেন বুট ও গ্লাভস'}

📝 দল নিবন্ধন ও এন্ট্রি ফি:
💵 এন্ট্রি ফি: ${c.entryFee || 'নির্ধারিত ফি'}
⏰ নিবন্ধনের শেষ সময়: ${c.regDeadline || 'ম্যাচ শুরুর পূর্বে'}
📞 যোগাযোগ ও হটলাইন: ${c.contactPhone || 'ইনবক্স করুন'}
💳 ফি পরিশোধ মাধ্যম: ${c.paymentMethod || 'বিকাশ / নগদ / সরাসরি'}

📜 টুর্নামেন্টের প্রধান নিয়মাবলী ও শর্তাবলী:
${rulesText}
⚠️ বিশেষ দ্রষ্টব্য: শৃঙ্খলা ও রেফারির সিদ্ধান্তই চূড়ান্ত। কোনো বহিরাগত বা ভুয়া খেলোয়াড়ের অভিযোগ প্রমাণিত হলে দল তাৎক্ষণিক বহিষ্কার হবে।

📢 সীমিত সংখ্যক দলের জন্য স্লট খালি রয়েছে। দ্রুত আপনার দলের অংশগ্রহণ নিশ্চিত করুন!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#FootballTournament #Football #${(c.title || 'Tournament').replace(/\s+/g, '_')}
`.trim();

  const successMsg = isEn
    ? '📋 Post content copied to clipboard!\nYou can now paste it directly into Facebook, WhatsApp, or any social media page.'
    : '📋 ফেসবুক ও সোশ্যাল মিডিয়ায় পোস্ট করার জন্য সম্পূর্ণ পোস্টের লেখাটি কপি করা হয়েছে!\nএখন যেকোনো ফেসবুক পেজ, গ্রুপ বা হোয়াটসঅ্যাপে পেস্ট করুন।';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(postText).then(() => {
      alert(successMsg);
    }).catch(err => {
      fallbackCopyText(postText);
    });
  } else {
    fallbackCopyText(postText);
  }
}

function fallbackCopyText(text) {
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    alert(isEn ? '📋 Post content copied to clipboard!' : '📋 পোস্টের লেখাটি কপি করা হয়েছে!');
  } catch (e) {
    prompt(isEn ? 'Copy text below:' : 'নিচের লেখাটি কপি করে নিন:', text);
  }
  document.body.removeChild(ta);
}

if (typeof window !== 'undefined') {
  window.generatePosterHeroBannerHtml = generatePosterHeroBannerHtml;
  window.generatePromoPosterCardHtml = generatePromoPosterCardHtml;
  window.generateFixturePosterCardHtml = generateFixturePosterCardHtml;
  window.getDynamicKnockoutMatchesForPoster = getDynamicKnockoutMatchesForPoster;
  window.openPromoPosterModal = openPromoPosterModal;
  window.openSocialHubModal = openSocialHubModal;
  window.openFixturePosterModal = openFixturePosterModal;
  window.closePromoPosterModal = closePromoPosterModal;
  window.switchPosterTab = switchPosterTab;
  window.copyFacebookPromoPost = copyFacebookPromoPost;
  window.copyFacebookFixturePost = copyFacebookFixturePost;
  window.renderPrintablePosterSheet = renderPrintablePosterSheet;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generatePosterHeroBannerHtml,
    generatePromoPosterCardHtml,
    generateFixturePosterCardHtml,
    getDynamicKnockoutMatchesForPoster,
    copyFacebookPromoPost,
    copyFacebookFixturePost,
    openPromoPosterModal,
    openSocialHubModal,
    openFixturePosterModal,
    closePromoPosterModal,
    switchPosterTab,
    renderPrintablePosterSheet
  };
}
