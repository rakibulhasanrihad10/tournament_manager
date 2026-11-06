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
          <div class="promo-hero-sub ${activePosterTab === 'promo' ? 'promo-glass-capsule' : ''}" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap; max-width:94%; margin:0 auto; box-sizing:border-box; backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); text-shadow:0 1px 3px rgba(0,0,0,0.8);">
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
  if (typeof PROMO_LAUREL_BRANCH_B64 !== 'undefined' && PROMO_LAUREL_BRANCH_B64) {
    return `<img class="wheat-sheaf-svg ${isLeft ? 'wheat-sheaf-left' : 'wheat-sheaf-right'}" src="${PROMO_LAUREL_BRANCH_B64}" alt="Golden Laurel Wreath" />`;
  }

  const P0 = { x: 52, y: 110 }, P1 = { x: 10, y: 112 }, P2 = { x: 10, y: 8 }, P3 = { x: 52, y: 10 };
  let leavesHtml = '';

  const numPairs = 11;
  for (let i = 1; i <= numPairs; i++) {
    const t = 0.04 + (i / (numPairs + 1)) * 0.90;
    const u = 1 - t;
    const px = u * u * u * P0.x + 3 * u * u * t * P1.x + 3 * u * t * t * P2.x + t * t * t * P3.x;
    const py = u * u * u * P0.y + 3 * u * u * t * P1.y + 3 * u * t * t * P2.y + t * t * t * P3.y;

    const tx = 3 * u * u * (P1.x - P0.x) + 6 * u * t * (P2.x - P1.x) + 3 * t * t * (P3.x - P2.x);
    const ty = 3 * u * u * (P1.y - P0.y) + 6 * u * t * (P2.y - P1.y) + 3 * t * t * (P3.y - P2.y);
    const tlen = Math.hypot(tx, ty) || 1;
    const utx = tx / tlen;
    const uty = ty / tlen;
    const unx = -uty;
    const uny = utx;

    const leafLen = 20 + Math.sin(t * Math.PI) * 5;
    const leafWidth = 8 + Math.sin(t * Math.PI) * 2;

    // Helper to generate a clean pointed-oval laurel leaf (single closed path)
    function makeLeaf(vx, vy, len, width) {
      const vlen = Math.hypot(vx, vy) || 1;
      const tipX = px + (vx / vlen) * len;
      const tipY = py + (vy / vlen) * len;
      const dx = tipX - px;
      const dy = tipY - py;
      const dlen = Math.hypot(dx, dy) || 1;
      const nx = -dy / dlen;
      const ny = dx / dlen;
      // Bulge at 45% along the leaf — wide middle, pointed tip & base
      const mx = px + dx * 0.45;
      const my = py + dy * 0.45;
      const halfW = width * 0.95;
      const cOutX = (mx + nx * halfW).toFixed(1);
      const cOutY = (my + ny * halfW).toFixed(1);
      const cInX  = (mx - nx * halfW).toFixed(1);
      const cInY  = (my - ny * halfW).toFixed(1);
      const bX = px.toFixed(1), bY = py.toFixed(1);
      const tX = tipX.toFixed(1), tY = tipY.toFixed(1);

      // Single closed leaf: base → (Q highlight side) → tip → (Q shadow side) → base
      // Then overlay the highlight half as a filled sub-path for 3D sheen
      const highlightMx = (px + dx * 0.42 + nx * halfW * 0.5).toFixed(1);
      const highlightMy = (py + dy * 0.42 + ny * halfW * 0.5).toFixed(1);

      return `
        <path d="M ${bX} ${bY} Q ${cOutX} ${cOutY} ${tX} ${tY} Q ${cInX} ${cInY} ${bX} ${bY} Z"
              fill="url(#sheafShad)" stroke="#78350f" stroke-width="0.9"/>
        <path d="M ${bX} ${bY} Q ${cOutX} ${cOutY} ${tX} ${tY} Q ${highlightMx} ${highlightMy} ${bX} ${bY} Z"
              fill="url(#sheafHigh)" stroke="none"/>
        <line x1="${bX}" y1="${bY}" x2="${tX}" y2="${tY}" stroke="#fff7aa" stroke-width="0.55" stroke-linecap="round"/>
      `;
    }

    // Outer leaf (forward acute angle ~23° leaning gently outward)
    leavesHtml += makeLeaf(utx * 0.90 - unx * 0.38, uty * 0.90 - uny * 0.38, leafLen, leafWidth);

    // Inner leaf (forward acute angle ~23° leaning gently inward)
    leavesHtml += makeLeaf(utx * 0.90 + unx * 0.38, uty * 0.90 + uny * 0.38, leafLen * 0.95, leafWidth * 0.92);
  }

  // Crowning top leaf
  const topTx = 3 * (P3.x - P2.x);
  const topTy = 3 * (P3.y - P2.y);
  const topTlen = Math.hypot(topTx, topTy) || 1;
  const crownTipX = (P3.x + (topTx / topTlen) * 16).toFixed(1);
  const crownTipY = (P3.y + (topTy / topTlen) * 16).toFixed(1);
  const crownLeaf = `
    <path d="M ${P3.x} ${P3.y} Q ${P3.x + 3} ${P3.y - 4} ${crownTipX} ${crownTipY} Q ${P3.x + 7} ${P3.y + 4} ${P3.x} ${P3.y} Z"
          fill="url(#sheafShad)" stroke="#78350f" stroke-width="0.9"/>
    <path d="M ${P3.x} ${P3.y} Q ${P3.x + 3} ${P3.y - 4} ${crownTipX} ${crownTipY} Q ${(P3.x + 5)} ${P3.y} ${P3.x} ${P3.y} Z"
          fill="url(#sheafHigh)" stroke="none"/>
    <line x1="${P3.x}" y1="${P3.y}" x2="${crownTipX}" y2="${crownTipY}" stroke="#fff7aa" stroke-width="0.55" stroke-linecap="round"/>
  `;

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
        <linearGradient id="sheafStemGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#ca8a04"/>
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#fef08a"/>
        </linearGradient>
      </defs>
      <!-- Symmetrical 3D Laurel "C" Arc Golden Stem -->
      <path d="M 52 110 C 10 112, 10 8, 52 10" stroke="url(#sheafStemGrad)" stroke-width="3.2" stroke-linecap="round"/>
      ${leavesHtml}
      ${crownLeaf}
      <!-- 3D Base Tie Node -->
      <circle cx="52" cy="110" r="4.2" fill="url(#sheafStemGrad)" stroke="#78350f" stroke-width="1.2"/>
      <circle cx="52" cy="110" r="1.8" fill="#fff59d"/>
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
  const regUrl = (c.registrationUrl && c.registrationUrl.trim())
    ? c.registrationUrl.trim()
    : ((typeof window !== 'undefined' && window.location && window.location.href && window.location.href.startsWith('http'))
        ? window.location.href.split('#')[0].split('?')[0] + '#register'
        : 'https://tournament.live/#register');

  let qrSvg = '';
  const qrGen = (typeof qrcode === 'function') ? qrcode : ((typeof window !== 'undefined' && typeof window.qrcode === 'function') ? window.qrcode : null);
  if (qrGen) {
    try {
      const qr = qrGen(0, 'M');
      qr.addData(regUrl);
      qr.make();
      qrSvg = qr.createSvgTag({ cellSize: 4.5, margin: 2, scalable: true });
    } catch (e) {
      console.warn('QR SVG error in poster:', e);
    }
  }

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

      <!-- ROW 1: 2 BLUE GLASS SPECIFICATION CARDS -->
      <div class="promo-ref-specs-grid promo-meta-grid" style="position:relative; z-index:2;">
        <div class="promo-ref-spec-card promo-meta-item">
          <div class="spec-card-top p-label">🗓️ ${tFn('poster.date')}</div>
          <div class="spec-card-val p-val">${esc(c.startDate || defaultDate)}</div>
        </div>
        <div class="promo-ref-spec-card promo-meta-item">
          <div class="spec-card-top p-label">⏱️ ${tFn('poster.duration')}</div>
          <div class="spec-card-val p-val">${esc(c.matchDuration || defaultDuration)}</div>
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
          <div class="prize-card-amount promo-prize-amount">${formatDualTonePrizeHtml(c.championPrize || (isEn ? '20,000 BDT' : '২০,০০০ টাকা'), esc)}</div>
        </div>
        <div class="promo-ref-prize-card promo-ru-card promo-prize-card ru">
          ${getWheatSheafSvg(true)}
          ${getWheatSheafSvg(false)}
          <div class="prize-card-badge promo-prize-title">
            ${getRibbonMedalSvg(true)}
            <span>${tFn('poster.runner_prize')}</span>
          </div>
          <div class="prize-card-amount promo-prize-amount">${formatDualTonePrizeHtml(c.runnerUpPrize || (isEn ? '10,000 BDT' : '১০,০০০ টাকা'), esc)}</div>
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

      <!-- ROW 5: ONLINE TEAM REGISTRATION & SMART QR CODE BOARD (LUXURY GOLDEN FRAME WHITE ROUNDED CARD) -->
      <div class="promo-ref-rules-card promo-rules-preview-box promo-registration-card" style="position:relative; z-index:2;">
        <div class="rules-card-header-wrap promo-rules-preview-title">
          <div class="rules-card-header-pill">
            <span>📲 ${tFn('poster.reg_card_title') || (isEn ? 'Online Team Registration' : 'অনলাইনে দল রেজিস্ট্রেশন করুন')}</span>
          </div>
        </div>

        <div class="promo-reg-grid-2col">
          <!-- Left Column: Smart QR Code Plaque -->
          <div class="promo-reg-qr-plaque">
            <div class="promo-reg-qr-wrapper">
              ${qrSvg ? qrSvg : '<div class="promo-reg-qr-fallback">QR Code</div>'}
              <div class="promo-reg-qr-badge">⚽</div>
            </div>
          </div>

          <!-- Center Divider -->
          <div class="promo-reg-divider"></div>

          <!-- Right Column: Registration Link & Special Note -->
          <div class="promo-reg-content-col promo-reg-steps-col">
            <div class="promo-reg-steps-header">
              <div class="promo-reg-steps-title">⚽ ${tFn('poster.reg_headline') || (isEn ? 'Complete Your Team Registration Online' : 'অনলাইনে আপনার দলের রেজিস্ট্রেশন সম্পন্ন করুন')}</div>
              <div class="promo-reg-steps-sub">${tFn('poster.reg_subtext') || (isEn ? 'Scan the QR code with your smartphone or visit the link below to fill out the form.' : 'স্মার্টফোনে কিউআর কোড স্ক্যান করুন অথবা নিচের লিংকে প্রবেশ করে ফর্ম পূরণ করুন।')}</div>
            </div>

            <!-- Registration Link Pill -->
            <a href="${esc(regUrl)}" target="_blank" rel="noopener noreferrer" class="promo-reg-url-pill">
              <span class="promo-reg-url-lbl">🔗 ${tFn('poster.reg_link_lbl') || (isEn ? 'Registration Link:' : 'রেজিস্ট্রেশন লিংক:')}</span>
              <span class="promo-reg-url-text">${esc(regUrl)}</span>
            </a>

            <!-- Special Note Banner -->
            <div class="promo-reg-urgency-banner promo-reg-special-note">
              <span>📌 ${tFn('poster.special_note') || (isEn ? 'Special Note: Team slots are limited! Finalized strictly on a "First-Come, First-Served" basis.' : 'বিশেষ দ্রষ্টব্য: দল সংখ্যা সীমিত! "আগে আসলে আগে পাবেন" ভিত্তিতে দল চূড়ান্ত করা হবে।')}</span>
            </div>
          </div>
        </div>

        <!-- Hidden Rules Dataset for Headless Test Verification & Accessibility -->
        <div class="promo-rules-dataset" style="display:none;" data-rule-count="${allActiveRules.length}">
          <span class="promo-rules-count-badge">(${allActiveRules.length} ${tFn('common.items_unit')})</span>
          ${allActiveRules.length === 0 ? `
            <div class="promo-rules-empty">${isEn ? 'No rules selected. Configure rules in Tournament Setup.' : 'কোনো বিশেষ নিয়মাবলী সেট করা হয়নি। টুর্নামেন্ট সেটআপ থেকে নিয়ম নির্বাচন করুন।'}</div>
          ` : `
            <ol class="promo-rules-ol">
              ${rulesListHtml}
            </ol>
          `}
        </div>
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
      copyBtn.textContent = isEn ? '📦 Download All' : '📦 সবগুলো ছবি ডাউনলোড';
      copyBtn.setAttribute('onclick', 'downloadAllSocialCards(this)');
    }
    if (printBtn) {
      printBtn.style.display = 'inline-flex';
      printBtn.textContent = isEn ? '📸 Download Master Board' : '📸 সম্পূর্ণ বোর্ড ছবি';
      printBtn.setAttribute('onclick', "downloadSocialCard('full', this)");
    }
    if (subtitleEl) {
      subtitleEl.textContent = isEn
        ? 'Share live standings, knockout bracket & master board cards on Facebook & WhatsApp'
        : 'ম্যাচ শেষে সোশ্যাল মিডিয়ায় এক ক্লিকে লাইভ ফলাফল ও পয়েন্ট টেবিল শেয়ার করুন';
    }
    if (tipEl) {
      tipEl.textContent = isEn
        ? '💡 Tip: Click any "📸 Download" button to directly download crisp images ready for Facebook & WhatsApp.'
        : '💡 টিপস: যেকোনো "📸 ছবি ডাউনলোড" বাটনে ক্লিক করে সরাসরি সোশ্যাল মিডিয়ায় পোস্ট করার উপযোগী ক্রিস্টাল-ক্লিয়ার ছবি নামিয়ে নিন।';
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
        printBtn.textContent = isEn ? '📸 Download Fixture' : '📸 ফিক্সচার ছবি ডাউনলোড';
        printBtn.setAttribute('onclick', "downloadSocialCard('fixtures', this)");
      } else {
        printBtn.textContent = isEn ? '📸 Download Notice' : '📸 নোটিশ ছবি ডাউনলোড';
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
        ? (activePosterTab === 'fixture'
            ? '💡 Tip: Click "📸 Download Fixture" to save crisp pictures ready for direct sharing on Facebook & WhatsApp.'
            : '💡 Tip: Click "📸 Download Notice" to save crisp pictures ready for direct sharing on Facebook & WhatsApp.')
        : (activePosterTab === 'fixture'
            ? '💡 টিপস: "📸 ফিক্সচার ছবি ডাউনলোড" বাটনে ক্লিক করে সরাসরি ফেসবুক ও হোয়াটসঅ্যাপে পোস্ট করার উপযোগী হাই-রেজোলিউশন ছবি নামিয়ে নিন।'
            : '💡 টিপস: "📸 নোটিশ ছবি ডাউনলোড" বাটনে ক্লিক করে সরাসরি ফেসবুক ও হোয়াটসঅ্যাপে পোস্ট করার উপযোগী হাই-রেজোলিউশন ছবি নামিয়ে নিন।');
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
