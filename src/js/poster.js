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

  let scheduleTitle = isEn ? '📅 Group Stage Match Schedule (Pairings & Timings)' : '📅 গ্রুপ পর্বের ম্যাচ সূচি (কার সাথে কার খেলা ও সময়সূচি)';
  if (type === 'knockout') {
    scheduleTitle = isEn ? '📅 Opening Knockout Fixtures & Timings' : '📅 প্রাথমিক নকআউট পর্বের ম্যাচ সূচি ও সময়';
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

  return `
    <div class="fixture-poster-card" id="fixture-poster-content">
      <!-- HEADER -->
      <div class="promo-hero-header" style="border-bottom-color: rgba(2, 132, 199, 0.4); margin-bottom: 4px;">
        <span class="promo-badge-tag" style="background: linear-gradient(135deg, #0284c7, #0369a1);">${tFn('poster.fixture_badge')}</span>
        <h1 class="promo-hero-title">⚽ ${esc(c.title || defaultTitle)} ⚽</h1>
        <div class="promo-hero-sub">
          🚩 ${tFn('poster.footer_org')} <strong>${esc(c.organizer || defaultOrg)}</strong>
          &nbsp;|&nbsp; 📍 ${tFn('page1.meta_venue')} <strong>${esc(c.venue || defaultVenue)}</strong>
          &nbsp;|&nbsp; 🗓️ <strong>${esc(c.startDate || defaultDate)}</strong>
        </div>
      </div>

      <!-- KEY METADATA STRIP -->
      <div class="promo-meta-grid" style="grid-template-columns: repeat(4, 1fr); padding: 6px; margin-bottom: 2px;">
        <div class="promo-meta-item">
          <div class="p-label">${tFn('poster.format')}</div>
          <div class="p-val" style="font-size:11px;">${esc(c.formatType || defaultFormat)}</div>
        </div>
        <div class="promo-meta-item">
          <div class="p-label">${tFn('poster.duration')}</div>
          <div class="p-val" style="font-size:11px;">${esc(c.matchDuration || defaultDuration)}</div>
        </div>
        <div class="promo-meta-item">
          <div class="p-label">${isEn ? 'Teams' : 'অংশগ্রহণকারী দল'}</div>
          <div class="p-val" style="font-size:11px; color:#fde047;">${count} ${isEn ? 'Teams' : 'টি দল'}</div>
        </div>
        <div class="promo-meta-item">
          <div class="p-label">${isEn ? 'Total Matches' : 'সর্বমোট ম্যাচ'}</div>
          <div class="p-val" style="font-size:11px; color:#4ade80;">${matches.length + koData.cards.length} ${isEn ? 'Matches' : 'টি ম্যাচ'}</div>
        </div>
      </div>

      <!-- 1. MATCH SCHEDULE TABLE (Reuses p1-card styling without scores/winners) -->
      <div class="p1-card" style="padding: 6px 8px;">
        <div class="section-title" style="margin-bottom: 3px; font-size:12px; font-weight:800; color:#0d2b6b;">${scheduleTitle}</div>
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
      <div style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 6px; padding: 6px 10px; font-size: 10.5px; color: #cbd5e1; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
        <div>${tFn('poster.footer_notice')}</div>
        <div style="font-weight:700; color:#38bdf8;">🚩 ${esc(c.organizer || defaultOrg)}</div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 2. PROMOTIONAL NOTICE & REGISTRATION POSTER (PHASE 1)
// ----------------------------------------------------
function generatePromoPosterCardHtml() {
  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const selectedSet = new Set(c.selectedRules || []);
  const activeMasterRules = (typeof MASTER_RULES_CATALOG !== 'undefined' ? MASTER_RULES_CATALOG : []).filter(r => selectedSet.has(r.id));
  const activeCustomRules = c.customRules || [];
  const allActiveRules = [...activeMasterRules, ...activeCustomRules];

  const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
  let rulesListHtml = '';
  allActiveRules.forEach(r => {
    const rTitle = isEn && r.titleEn ? r.titleEn : r.title;
    const rDesc = isEn && r.descEn ? r.descEn : r.desc;
    rulesListHtml += `<li><strong>${esc(rTitle)}:</strong> ${esc(rDesc)}</li>`;
  });

  const defaultTitle = isEn ? 'Football Tournament 2026' : 'ফুটবল টুর্নামেন্ট ২০২৬';
  const defaultOrg = isEn ? 'Tournament Organizing Committee' : 'টুর্নামেন্ট পরিচালনা কমিটি';
  const defaultVenue = isEn ? 'Local Sports Ground' : 'স্থানীয় খেলার মাঠ';
  const defaultFormat = isEn ? '6-a-side' : '৬-এ-সাইড';
  const defaultDuration = isEn ? '20 mins' : '২০ মিনিট';
  const defaultDate = isEn ? '2026' : '২০২৬';

  const tFn = typeof t === 'function' ? t : (k) => k;

  return `
    <div class="promo-poster-card" id="promo-poster-content">
      <div class="promo-hero-header">
        <span class="promo-badge-tag">${tFn('poster.badge')}</span>
        <h1 class="promo-hero-title">⚽ ${esc(c.title || defaultTitle)} ⚽</h1>
        <div class="promo-hero-sub">
          🚩 ${tFn('poster.footer_org')} <strong>${esc(c.organizer || defaultOrg)}</strong>
          &nbsp;|&nbsp; 📍 ${tFn('page1.meta_venue')} <strong>${esc(c.venue || defaultVenue)}</strong>
        </div>
      </div>

      <div class="promo-meta-grid">
        <div class="promo-meta-item">
          <div class="p-label">${tFn('poster.format')}</div>
          <div class="p-val">${esc(c.formatType || defaultFormat)}</div>
        </div>
        <div class="promo-meta-item">
          <div class="p-label">${tFn('poster.duration')}</div>
          <div class="p-val">${esc(c.matchDuration || defaultDuration)}</div>
        </div>
        <div class="promo-meta-item">
          <div class="p-label">${tFn('poster.date')}</div>
          <div class="p-val">${esc(c.startDate || defaultDate)}</div>
        </div>
      </div>

      <div class="promo-prizes-wrap">
        <div class="promo-prize-card champ">
          <div class="promo-prize-title">${tFn('poster.champ_prize')}</div>
          <div class="promo-prize-amount">${esc(c.championPrize || (isEn ? 'Champions Trophy & Prize Money' : 'আকর্ষণীয় ট্রফি ও প্রাইজমানি'))}</div>
          <div style="font-size:9.5px; color:#fde68a;">${tFn('poster.champ_sub')}</div>
        </div>
        <div class="promo-prize-card ru">
          <div class="promo-prize-title">${tFn('poster.runner_prize')}</div>
          <div class="promo-prize-amount">${esc(c.runnerUpPrize || (isEn ? 'Runner-Up Trophy & Cash Prize' : 'রানার্স-আপ ট্রফি ও অর্থ'))}</div>
          <div style="font-size:9.5px; color:#cbd5e1;">${tFn('poster.runner_sub')}</div>
        </div>
      </div>

      ${c.thirdPrize || c.otherPrizes ? `
      <div style="display:flex; justify-content:space-around; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:6px 10px; font-size:10px; flex-wrap:wrap; gap:6px;">
        ${c.thirdPrize ? `<div>🥉 <strong>${tFn('poster.third_place')}</strong> ${esc(c.thirdPrize)}</div>` : ''}
        ${c.otherPrizes ? `<div>🎖️ <strong>${tFn('poster.special_awards')}</strong> ${esc(c.otherPrizes)}</div>` : ''}
      </div>` : ''}

      <div class="promo-entry-contact-box">
        <div style="display:flex; flex-direction:column; gap:2px;">
          <div><strong style="color:#fde047;">${tFn('poster.entry_fee')}</strong> ${esc(c.entryFee || (isEn ? 'Contact Committee' : '২,০০০ টাকা'))}</div>
          <div><strong style="color:#fde047;">${tFn('poster.reg_deadline')}</strong> ${esc(c.regDeadline || (isEn ? 'Before Kickoff' : 'ম্যাচ শুরুর ৩০ মিনিট পূর্বে'))}</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:2px; text-align:right;">
          <div><strong style="color:#38bdf8;">${tFn('poster.contact')}</strong> ${esc(c.contactPhone || (isEn ? 'Inbox / Hotline' : '০১৭১১-xxxxxx'))}</div>
          <div><strong style="color:#38bdf8;">${tFn('poster.payment')}</strong> ${esc(c.paymentMethod || (isEn ? 'Direct / Mobile Banking' : 'বিকাশ / নগদ (পার্সোনাল)'))}</div>
        </div>
      </div>

      <div class="promo-rules-preview-box">
        <div class="promo-rules-preview-title">
          <span>${tFn('poster.rules_title')} (${allActiveRules.length} ${tFn('common.items_unit')}):</span>
        </div>
        <ol class="promo-rules-ol">
          ${rulesListHtml}
        </ol>
      </div>

      <div class="promo-footer-sign">
        <div>🚩 <strong>${tFn('poster.footer_org')}</strong> ${esc(c.organizer || defaultOrg)}</div>
        <div>${tFn('poster.footer_rules')}</div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// TAB NAVIGATION & MODAL CONTROLS
// ----------------------------------------------------
function switchPosterTab(tab) {
  activePosterTab = tab === 'promo' ? 'promo' : 'fixture';
  const container = document.getElementById('promo-poster-render-target');
  const btnFixture = document.getElementById('tab-btn-poster-fixture');
  const btnPromo = document.getElementById('tab-btn-poster-promo');
  const copyBtn = document.getElementById('btn-poster-copy-action');
  const printBtn = document.getElementById('btn-poster-print-action');
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  if (btnFixture) btnFixture.classList.toggle('active', activePosterTab === 'fixture');
  if (btnPromo) btnPromo.classList.toggle('active', activePosterTab === 'promo');

  if (copyBtn) {
    if (activePosterTab === 'fixture') {
      copyBtn.textContent = isEn ? '📋 Copy Fixture Post' : '📋 ফিক্সচার পোস্ট কপি করুন';
      copyBtn.setAttribute('onclick', 'copyFacebookFixturePost()');
    } else {
      copyBtn.textContent = isEn ? '📋 Copy Promo Post' : '📋 ফেসবুক পোস্ট কপি করুন';
      copyBtn.setAttribute('onclick', 'copyFacebookPromoPost()');
    }
  }

  if (printBtn) {
    if (activePosterTab === 'fixture') {
      printBtn.textContent = isEn ? '🖨️ Print Fixture Poster / PDF' : '🖨️ ফিক্সচার পোস্টার প্রিন্ট / PDF';
    } else {
      printBtn.textContent = isEn ? '🖨️ Print Promo Poster / PDF' : '🖨️ পোস্টার প্রিন্ট / PDF';
    }
  }

  if (container) {
    container.innerHTML = activePosterTab === 'fixture' 
      ? generateFixturePosterCardHtml() 
      : generatePromoPosterCardHtml();
  }

  renderPrintablePosterSheet();
}

function openPromoPosterModal(tab = 'fixture') {
  activePosterTab = tab === 'promo' ? 'promo' : 'fixture';
  const modal = document.getElementById('promo-poster-modal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
  switchPosterTab(activePosterTab);
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
  const activeMasterRules = (typeof MASTER_RULES_CATALOG !== 'undefined' ? MASTER_RULES_CATALOG : []).filter(r => selectedSet.has(r.id));
  const activeCustomRules = c.customRules || [];
  const allActiveRules = [...activeMasterRules, ...activeCustomRules];

  let rulesText = '';
  allActiveRules.slice(0, 10).forEach((r, idx) => {
    const rTitle = isEn && r.titleEn ? r.titleEn : r.title;
    const rDesc = isEn && r.descEn ? r.descEn : r.desc;
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generatePromoPosterCardHtml,
    generateFixturePosterCardHtml,
    getDynamicKnockoutMatchesForPoster,
    copyFacebookPromoPost,
    copyFacebookFixturePost,
    openPromoPosterModal,
    openFixturePosterModal,
    closePromoPosterModal,
    switchPosterTab,
    renderPrintablePosterSheet
  };
}
