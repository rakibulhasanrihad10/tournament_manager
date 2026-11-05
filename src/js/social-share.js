// ========================================================
// SOCIAL MEDIA EXPORT HUB & HIGH-RESOLUTION CANVAS ENGINE
// 100% Client-Side Pure Canvas 2D Rendering for Direct PNG Downloads
// Zero Tainted Canvas Security Errors, Zero External Dependencies
// ========================================================

function openSocialShareModal() {
  const modal = document.getElementById('social-share-modal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

function closeSocialShareModal() {
  const modal = document.getElementById('social-share-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

// ----------------------------------------------------
// CANVAS 2D DRAWING UTILITIES
// ----------------------------------------------------
function drawRoundedRect(ctx, x, y, width, height, radius, fillColor, strokeColor, lineWidth = 1) {
  let r = radius;
  if (typeof r === 'number') {
    r = { tl: r, tr: r, br: r, bl: r };
  } else {
    r = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, r);
  }

  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + width - r.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r.tr);
  ctx.lineTo(x + width, y + height - r.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r.br, y + height);
  ctx.lineTo(x + r.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function drawCardHeader(ctx, width, badgeText, titleText, subText, gradColors) {
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, gradColors[0]);
  grad.addColorStop(1, gradColors[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, 120);

  // Decorative border
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(0, 117, width, 3);

  // Badge
  ctx.font = 'bold 12px "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.textAlign = 'left';
  ctx.fillText(badgeText.toUpperCase(), 30, 32);

  // Main Title
  ctx.font = 'bold 26px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(titleText, 30, 68);

  // Subtitle / Venue
  ctx.font = '14px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(subText, 30, 96);
}

function drawCardFooter(ctx, width, y) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, y, width, 45);
  ctx.font = '13px "Hind Siliguri", "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'left';
  ctx.fillText('⚽ টুর্নামেন্ট ম্যানেজার • Sports Tournament Pro', 30, y + 27);
  ctx.textAlign = 'right';
  ctx.fillText('অফিশিয়াল লাইভ আপডেট কার্ড', width - 30, y + 27);
  ctx.textAlign = 'left';
}

// ----------------------------------------------------
// 0. PROMO TOURNAMENT NOTICE BANNER CANVAS RENDERER
// ----------------------------------------------------
function renderPromoPosterToCanvas() {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 820;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#0b1329';
  ctx.fillRect(0, 0, width, height);

  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const title = c.title || (document.getElementById('app-title-display')?.textContent?.trim() || 'ফুটবল বিশ্বকাপ ২০২৬');
  const venue = c.venue || (document.getElementById('app-venue-display')?.textContent?.trim() || 'স্টেডিয়াম মাঠ');
  const org = c.organizer || (document.getElementById('app-org-display')?.textContent?.trim() || 'আয়োজক কমিটি');

  drawCardHeader(ctx, width, isEn ? '📢 OFFICIAL TOURNAMENT NOTICE • ANNOUNCEMENT' : '📢 অফিশিয়াল টুর্নামেন্ট নোটিশ ও প্রচার ব্যানার', title, `📍 ভেন্যু: ${venue} | 🚩 আয়োজনে: ${org}`, ['#0f172a', '#1e40af']);

  // 3 Columns: Prize Pool, Tournament Details, Rules & Registration
  const colY = 145;
  const colH = 510;
  const colW = 360;

  // 1. Prize Pool Card
  const c1X = 30;
  drawRoundedRect(ctx, c1X, colY, colW, colH, 12, '#131f37', '#233554', 1.5);
  const pGrad = ctx.createLinearGradient(c1X, colY, c1X + colW, colY);
  pGrad.addColorStop(0, '#854d0e');
  pGrad.addColorStop(1, '#ca8a04');
  drawRoundedRect(ctx, c1X, colY, colW, 44, { tl: 12, tr: 12, bl: 0, br: 0 }, pGrad);
  ctx.font = 'bold 16px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('🏆 ' + (isEn ? 'Tournament Prize Pool' : 'পুরস্কার ও প্রাইজপুল'), c1X + 16, colY + 28);

  const champPrize = c.champPrize || '৩০,০০০ টাকা + আকর্ষণীয় ট্রফি';
  const runnerPrize = c.runnerPrize || '১৫,০০০ টাকা + রানার্স-আপ ট্রফি';
  const thirdPrize = c.thirdPrize || 'ট্রফি ও মেডেল';

  drawRoundedRect(ctx, c1X + 14, colY + 60, colW - 28, 90, 8, '#0f172a', '#eab308', 1);
  ctx.font = 'bold 12px "Segoe UI", sans-serif';
  ctx.fillStyle = '#eab308';
  ctx.fillText('🥇 CHAMPION PRIZE / চ্যাম্পিয়ন প্রাইজ', c1X + 26, colY + 84);
  ctx.font = 'bold 17px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(champPrize, c1X + 26, colY + 115);

  drawRoundedRect(ctx, c1X + 14, colY + 165, colW - 28, 90, 8, '#0f172a', '#94a3b8', 1);
  ctx.font = 'bold 12px "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('🥈 RUNNER-UP PRIZE / রানার্স-আপ প্রাইজ', c1X + 26, colY + 189);
  ctx.font = 'bold 17px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(runnerPrize, c1X + 26, colY + 220);

  drawRoundedRect(ctx, c1X + 14, colY + 270, colW - 28, 220, 8, '#0f172a', '#334155', 1);
  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('🎖️ ' + (isEn ? 'Individual Awards & Medals' : 'ব্যক্তিগত আকর্ষণীয় পুরস্কার'), c1X + 26, colY + 298);
  ctx.font = '13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('• ম্যান অব দ্য ম্যাচ (প্রতিটি খেলায় ট্রফি)', c1X + 26, colY + 330);
  ctx.fillText('• টুর্নামেন্ট সেরা খেলোয়াড় (Golden Ball)', c1X + 26, colY + 360);
  ctx.fillText('• সর্বোচ্চ গোলদাতা (Golden Boot)', c1X + 26, colY + 390);
  ctx.fillText('• টুর্নামেন্ট সেরা গোলকিপার (Golden Glove)', c1X + 26, colY + 420);
  ctx.fillText('• ৩য় স্থান নির্ধারণী পুরস্কার: ' + thirdPrize, c1X + 26, colY + 450);

  // 2. Tournament Details & Format Card
  const c2X = 420;
  drawRoundedRect(ctx, c2X, colY, colW, colH, 12, '#131f37', '#233554', 1.5);
  const fGrad = ctx.createLinearGradient(c2X, colY, c2X + colW, colY);
  fGrad.addColorStop(0, '#1e3a8a');
  fGrad.addColorStop(1, '#0284c7');
  drawRoundedRect(ctx, c2X, colY, colW, 44, { tl: 12, tr: 12, bl: 0, br: 0 }, fGrad);
  ctx.font = 'bold 16px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('📋 ' + (isEn ? 'Format & Schedule Details' : 'টুর্নামেন্ট বিবরণ ও ফরম্যাট'), c2X + 16, colY + 28);

  const entryFee = c.entryFee || '৫,০০০ টাকা';
  const regDeadline = c.deadline || 'ম্যাচ শুরুর ৩০ মিনিট পূর্বে';
  const matchDuration = c.matchDuration || '২০ মিনিট';
  const ballSize = c.ballSize || '৫ নং সাইজ';
  const squadSize = c.squadRule || '১১ মাঠে + ৫ বেঞ্চ';

  const details = [
    { label: '💰 এন্ট্রি ফি (Entry Fee):', val: entryFee, color: '#38bdf8' },
    { label: '⏰ নিবন্ধনের শেষ সময়:', val: regDeadline, color: '#f59e0b' },
    { label: '⏱️ ম্যাচের স্থায়ীত্ব (Duration):', val: matchDuration, color: '#ffffff' },
    { label: '⚽ বল সাইজ (Ball Size):', val: ballSize, color: '#ffffff' },
    { label: '👥 স্কোয়াড সংখ্যা (Squad):', val: squadSize, color: '#ffffff' },
    { label: '🏟️ খেলার মাঠ (Venue):', val: venue, color: '#a7f3d0' }
  ];

  details.forEach((d, idx) => {
    const rowY = colY + 60 + idx * 72;
    drawRoundedRect(ctx, c2X + 14, rowY, colW - 28, 62, 8, '#0f172a', '#334155', 1);
    ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(d.label, c2X + 26, rowY + 24);
    ctx.font = 'bold 15px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = d.color;
    ctx.fillText(d.val, c2X + 26, rowY + 48);
  });

  // 3. Rules & Registration Hotline Card
  const c3X = 810;
  drawRoundedRect(ctx, c3X, colY, colW, colH, 12, '#131f37', '#233554', 1.5);
  const rGrad = ctx.createLinearGradient(c3X, colY, c3X + colW, colY);
  rGrad.addColorStop(0, '#064e3b');
  rGrad.addColorStop(1, '#059669');
  drawRoundedRect(ctx, c3X, colY, colW, 44, { tl: 12, tr: 12, bl: 0, br: 0 }, rGrad);
  ctx.font = 'bold 16px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('📞 ' + (isEn ? 'Rules & Team Registration' : 'দল নিবন্ধন ও জরুরি যোগাযোগ'), c3X + 16, colY + 28);

  const contactPhone = c.contactPhone || '০১৭১XXXXXXX, ০১৯১XXXXXXX';
  const paymentInfo = c.paymentInfo || 'বিকাশ / নগদ (Personal): ০১৭১XXXXXXX';

  drawRoundedRect(ctx, c3X + 14, colY + 60, colW - 28, 110, 8, '#064e3b', '#10b981', 1);
  ctx.font = 'bold 12px "Segoe UI", sans-serif';
  ctx.fillStyle = '#a7f3d0';
  ctx.fillText('📱 REGISTRATION HOTLINE / হটলাইন:', c3X + 26, colY + 85);
  ctx.font = 'bold 16px "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(contactPhone, c3X + 26, colY + 115);
  ctx.font = '12px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('দল নিবন্ধনের জন্য দ্রুত যোগাযোগ করুন', c3X + 26, colY + 145);

  drawRoundedRect(ctx, c3X + 14, colY + 185, colW - 28, 90, 8, '#0f172a', '#334155', 1);
  ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#f43f5e';
  ctx.fillText('💳 এন্ট্রি ফি পরিশোধের মাধ্যম (Payment):', c3X + 26, colY + 210);
  ctx.font = 'bold 14px "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(paymentInfo, c3X + 26, colY + 242);

  // Key Rules Notice
  drawRoundedRect(ctx, c3X + 14, colY + 290, colW - 28, 200, 8, '#0f172a', '#334155', 1);
  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('📜 গুরুত্বপূর্ণ টুর্নামেন্ট নির্দেশনা:', c3X + 26, colY + 318);
  ctx.font = '12.5px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('• নির্ধারিত সময়ের ১৫ মিনিট পূর্বে মাঠে উপস্থিত থাকতে হবে', c3X + 26, colY + 348);
  ctx.fillText('• শৃঙ্খলা ও রেফারির সিদ্ধান্তই চূড়ান্ত বলে গণ্য হবে', c3X + 26, colY + 378);
  ctx.fillText('• সকল খেলোয়াড়কে উপযুক্ত বুট ও জার্সি পরিধান করতে হবে', c3X + 26, colY + 408);
  ctx.fillText('• টুর্নামেন্ট পরিচালনা কমিটির সিদ্ধান্ত সর্বজনীন', c3X + 26, colY + 438);
  ctx.fillText('• ফেয়ার প্লে ও সৌহার্দ্যপূর্ণ ক্রীড়াসুলভ মনোভাব বজায় রাখুন', c3X + 26, colY + 468);

  drawCardFooter(ctx, width, 700);

  return canvas;
}

// ----------------------------------------------------
// 1. GROUP STANDINGS CARD CANVAS RENDERER
// ----------------------------------------------------
function renderStandingsToCanvas() {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 820;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#0b1329';
  ctx.fillRect(0, 0, width, height);

  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const title = c.title || (document.getElementById('app-title-display')?.textContent?.trim() || 'ফুটবল বিশ্বকাপ ২০২৬');
  const venue = c.venue || (document.getElementById('app-venue-display')?.textContent?.trim() || 'স্টেডিয়াম মাঠ');
  const org = c.organizer || (document.getElementById('app-org-display')?.textContent?.trim() || 'আয়োজক কমিটি');

  drawCardHeader(ctx, width, '📊 OFFICIAL GROUP STANDINGS • অফিশিয়াল পয়েন্ট টেবিল', title, `📍 ভেন্যু: ${venue} | 🚩 আয়োজনে: ${org}`, ['#1e3a8a', '#0284c7']);

  const groups = [
    { key: 'A', name: 'গ্রুপ এ (Group A)', color: '#b71c1c', grad: ['#7f1d1d', '#b71c1c'], x: 30 },
    { key: 'B', name: 'গ্রুপ বি (Group B)', color: '#0d47a1', grad: ['#1e3a8a', '#0d47a1'], x: 420 },
    { key: 'C', name: 'গ্রুপ সি (Group C)', color: '#1b5e20', grad: ['#064e3b', '#1b5e20'], x: 810 }
  ];

  const cardW = 360;
  const cardH = 510;
  const cardY = 145;

  groups.forEach(g => {
    drawRoundedRect(ctx, g.x, cardY, cardW, cardH, 12, '#131f37', '#233554', 1.5);

    const gGrad = ctx.createLinearGradient(g.x, cardY, g.x + cardW, cardY);
    gGrad.addColorStop(0, g.grad[0]);
    gGrad.addColorStop(1, g.grad[1]);
    drawRoundedRect(ctx, g.x, cardY, cardW, 44, { tl: 12, tr: 12, bl: 0, br: 0 }, gGrad);

    ctx.font = 'bold 16px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('🏆 ' + g.name, g.x + 14, cardY + 28);

    const thY = cardY + 70;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(g.x + 8, cardY + 52, cardW - 16, 26);

    ctx.font = 'bold 11px "Segoe UI", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('#', g.x + 18, thY);
    ctx.fillText('দল (Team)', g.x + 42, thY);
    ctx.fillText('P', g.x + 175, thY);
    ctx.fillText('W', g.x + 205, thY);
    ctx.fillText('D', g.x + 235, thY);
    ctx.fillText('L', g.x + 265, thY);
    ctx.fillText('GD', g.x + 295, thY);
    ctx.fillText('PTS', g.x + 328, thY);

    const tbody = document.getElementById('tbody-group-' + g.key);
    let rowsData = [];
    if (tbody) {
      const trs = tbody.querySelectorAll('tr');
      trs.forEach((tr, idx) => {
        const teamName = tr.querySelector('.team-name-cell')?.textContent?.trim() || `Team ${idx + 1}`;
        const cells = tr.querySelectorAll('td');
        const pl = cells[2]?.textContent?.trim() || '০';
        const w = cells[3]?.textContent?.trim() || '০';
        const d = cells[4]?.textContent?.trim() || '০';
        const l = cells[5]?.textContent?.trim() || '০';
        const gd = tr.querySelector('.gd-record')?.textContent?.trim() || cells[7]?.textContent?.trim() || '০';
        const pts = tr.querySelector('.pts-badge')?.textContent?.trim() || cells[9]?.textContent?.trim() || '০';
        rowsData.push({ rank: idx + 1, team: teamName, pl, w, d, l, gd, pts });
      });
    }

    if (rowsData.length === 0) {
      const fallbackTeams = g.key === 'A' ? ['মুড়িয়ারা', 'নোয়াপাড়া', 'চিতড্ডা'] : g.key === 'B' ? ['মুকুন্দপুর', 'উত্তর ওড্ডা', 'দক্ষিণ ওড্ডা'] : ['বাতাবাড়িয়া', 'মোহাম্মদপুর', 'ভংগুয়া'];
      rowsData = fallbackTeams.map((t, idx) => ({ rank: idx + 1, team: t, pl: '০', w: '০', d: '০', l: '০', gd: '০', pts: '০' }));
    }

    rowsData.forEach((r, idx) => {
      const rowY = cardY + 92 + (idx * 54);
      if (idx % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fillRect(g.x + 8, rowY - 14, cardW - 16, 48);
      }

      const rankColor = r.rank === 1 ? '#f59e0b' : r.rank === 2 ? '#38bdf8' : '#64748b';
      ctx.fillStyle = rankColor;
      ctx.beginPath();
      ctx.arc(g.x + 22, rowY + 10, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 12px "Segoe UI", sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText(String(r.rank), g.x + 22, rowY + 14);

      ctx.font = 'bold 14px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      const truncatedTeam = r.team.length > 13 ? r.team.substring(0, 12) + '…' : r.team;
      ctx.fillText(truncatedTeam, g.x + 42, rowY + 14);

      ctx.font = '13px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(r.pl, g.x + 175, rowY + 14);
      ctx.fillText(r.w, g.x + 205, rowY + 14);
      ctx.fillText(r.d, g.x + 235, rowY + 14);
      ctx.fillText(r.l, g.x + 265, rowY + 14);
      ctx.fillText(r.gd, g.x + 295, rowY + 14);

      drawRoundedRect(ctx, g.x + 322, rowY - 3, 28, 24, 6, r.rank === 1 ? '#059669' : '#0284c7');
      ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(r.pts, g.x + 336, rowY + 14);
      ctx.textAlign = 'left';
    });

    const champDisp = document.getElementById('champ-' + g.key.toLowerCase() + '-display')?.textContent?.trim();
    const champY = cardY + cardH - 50;
    drawRoundedRect(ctx, g.x + 12, champY, cardW - 24, 38, 8, 'rgba(245, 158, 11, 0.12)', '#f59e0b', 1);
    ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('🏆 গ্রুপ ' + g.key + ' চ্যাম্পিয়ন:', g.x + 20, champY + 24);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(champDisp || '__________________', g.x + 155, champY + 24);
  });

  const bestRuY = 675;
  const bestRu = document.getElementById('best-ru-display')?.textContent?.trim();
  drawRoundedRect(ctx, 30, bestRuY, width - 60, 48, 10, '#111e38', '#38bdf8', 1.5);
  ctx.font = 'bold 14px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('⭐ সেমিফাইনালে খেলার যোগ্য সেরা রানার্স-আপ (Best Runner-up):', 45, bestRuY + 30);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillText(bestRu || '__________________', 480, bestRuY + 30);

  drawCardFooter(ctx, width, 745);
  return canvas;
}

// ----------------------------------------------------
// 2. KNOCKOUT BRACKET CARD CANVAS RENDERER
// ----------------------------------------------------
function renderBracketToCanvas() {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 780;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#0b0f24';
  ctx.fillRect(0, 0, width, height);

  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const title = c.title || (document.getElementById('app-title-display')?.textContent?.trim() || 'ফুটবল বিশ্বকাপ ২০২৬');
  const venue = c.venue || (document.getElementById('app-venue-display')?.textContent?.trim() || 'স্টেডিয়াম মাঠ');

  drawCardHeader(ctx, width, '⚔️ KNOCKOUT ROADMAP & GRAND FINALS • নকআউট ও মেগা ফাইনাল', title, `📍 ভেন্যু: ${venue} | ৩ গ্রুপ চ্যাম্পিয়ন + সেরা রানার্স-আপ = ৪ দল`, ['#312e81', '#6366f1']);

  const semi1_t1 = document.getElementById('ko10-t1')?.textContent?.trim() || 'গ্রুপ এ চ্যাম্পিয়ন';
  const semi1_t2 = document.getElementById('ko10-t2')?.textContent?.trim() || 'সেরা রানার্স-আপ';
  const semi1_s1 = document.getElementById('ko10-s1')?.value || '';
  const semi1_s2 = document.getElementById('ko10-s2')?.value || '';
  const semi1_win = document.querySelector('#ko10-winner .winner-blank-content')?.textContent?.trim() || '';

  const semi2_t1 = document.getElementById('ko11-t1')?.textContent?.trim() || 'গ্রুপ বি চ্যাম্পিয়ন';
  const semi2_t2 = document.getElementById('ko11-t2')?.textContent?.trim() || 'গ্রুপ সি চ্যাম্পিয়ন';
  const semi2_s1 = document.getElementById('ko11-s1')?.value || '';
  const semi2_s2 = document.getElementById('ko11-s2')?.value || '';
  const semi2_win = document.querySelector('#ko11-winner .winner-blank-content')?.textContent?.trim() || '';

  const final_t1 = document.getElementById('ko13-t1')?.textContent?.trim() || '১ম সেমি বিজয়ী';
  const final_t2 = document.getElementById('ko13-t2')?.textContent?.trim() || '২য় সেমি বিজয়ী';
  const final_s1 = document.getElementById('ko13-s1')?.value || '';
  const final_s2 = document.getElementById('ko13-s2')?.value || '';
  const champ_win = document.querySelector('#ko13-winner .winner-blank-content')?.textContent?.trim() || '';

  // Semi 1
  const s1X = 40;
  const s1Y = 150;
  const semiW = 540;
  const semiH = 180;
  drawRoundedRect(ctx, s1X, s1Y, semiW, semiH, 12, '#12183a', '#ef4444', 1.5);
  drawRoundedRect(ctx, s1X, s1Y, semiW, 40, { tl: 12, tr: 12, bl: 0, br: 0 }, '#b91c1c');
  ctx.font = 'bold 15px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('🔥 ১ম সেমিফাইনাল (ম্যাচ ১০) | রাত ১০:৩০', s1X + 16, s1Y + 26);

  ctx.font = 'bold 17px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(semi1_t1, s1X + 20, s1Y + 75);
  ctx.fillStyle = '#ef4444';
  ctx.fillText('VS', s1X + 250, s1Y + 75);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(semi1_t2, s1X + 300, s1Y + 75);

  const score1Txt = semi1_s1 !== '' && semi1_s2 !== '' ? `${semi1_s1} - ${semi1_s2}` : '০ - ০';
  drawRoundedRect(ctx, s1X + 20, s1Y + 105, 110, 36, 8, '#1e293b', '#64748b', 1);
  ctx.font = 'bold 16px "Segoe UI", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('স্কোর: ' + score1Txt, s1X + 30, s1Y + 129);

  drawRoundedRect(ctx, s1X + 150, s1Y + 105, semiW - 170, 36, 8, 'rgba(16, 185, 129, 0.15)', '#10b981', 1);
  ctx.font = 'bold 14px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.fillText('✔ বিজয়ী দল: ' + (semi1_win || '__________________'), s1X + 165, s1Y + 129);

  // Semi 2
  const s2X = 620;
  drawRoundedRect(ctx, s2X, s1Y, semiW, semiH, 12, '#12183a', '#0284c7', 1.5);
  drawRoundedRect(ctx, s2X, s1Y, semiW, 40, { tl: 12, tr: 12, bl: 0, br: 0 }, '#0369a1');
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🔥 ২য় সেমিফাইনাল (ম্যাচ ১১) | রাত ১১:০০', s2X + 16, s1Y + 26);

  ctx.font = 'bold 17px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(semi2_t1, s2X + 20, s1Y + 75);
  ctx.fillStyle = '#0284c7';
  ctx.fillText('VS', s2X + 250, s1Y + 75);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(semi2_t2, s2X + 300, s1Y + 75);

  const score2Txt = semi2_s1 !== '' && semi2_s2 !== '' ? `${semi2_s1} - ${semi2_s2}` : '০ - ০';
  drawRoundedRect(ctx, s2X + 20, s1Y + 105, 110, 36, 8, '#1e293b', '#64748b', 1);
  ctx.font = 'bold 16px "Segoe UI", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('স্কোর: ' + score2Txt, s2X + 30, s1Y + 129);

  drawRoundedRect(ctx, s2X + 150, s1Y + 105, semiW - 170, 36, 8, 'rgba(16, 185, 129, 0.15)', '#10b981', 1);
  ctx.font = 'bold 14px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.fillText('✔ বিজয়ী দল: ' + (semi2_win || '__________________'), s2X + 165, s1Y + 129);

  // Grand Final Card
  const fX = 160;
  const fY = 360;
  const fW = 880;
  const fH = 340;
  drawRoundedRect(ctx, fX, fY, fW, fH, 16, '#11183c', '#f59e0b', 2.5);

  const fGrad = ctx.createLinearGradient(fX, fY, fX + fW, fY);
  fGrad.addColorStop(0, '#78350f');
  fGrad.addColorStop(0.5, '#b45309');
  fGrad.addColorStop(1, '#78350f');
  drawRoundedRect(ctx, fX, fY, fW, 54, { tl: 16, tr: 16, bl: 0, br: 0 }, fGrad);

  ctx.font = 'bold 20px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('🏆 মেগা গ্র্যান্ড ফাইনাল (ম্যাচ ১৩) | রাত ১২:০০ 🏆', fX + (fW / 2), fY + 36);

  ctx.font = 'bold 22px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(final_t1, fX + 200, fY + 115);
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 18px "Segoe UI", sans-serif';
  ctx.fillText('V E R S U S', fX + (fW / 2), fY + 115);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 22px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillText(final_t2, fX + fW - 200, fY + 115);

  const finalScoreTxt = final_s1 !== '' && final_s2 !== '' ? `${final_s1} - ${final_s2}` : '০ - ০';
  drawRoundedRect(ctx, fX + (fW / 2) - 80, fY + 140, 160, 42, 10, '#0f172a', '#fbbf24', 1.5);
  ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(finalScoreTxt, fX + (fW / 2), fY + 170);

  const champBoxY = fY + 205;
  drawRoundedRect(ctx, fX + 40, champBoxY, fW - 80, 80, 12, 'rgba(16, 185, 129, 0.2)', '#10b981', 2);
  ctx.font = 'bold 16px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('🎉 অফিশিয়াল টুর্নামেন্ট চ্যাম্পিয়ন 🎉', fX + (fW / 2), champBoxY + 30);
  ctx.font = 'bold 26px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(champ_win ? `🏆 ${champ_win} 🏆` : '🏆 ট্রফি অর্জনকারী দল 🏆', fX + (fW / 2), champBoxY + 62);

  ctx.textAlign = 'left';
  drawCardFooter(ctx, width, 725);
  return canvas;
}

// ----------------------------------------------------
// 3. MATCH FIXTURES & SCHEDULE CANVAS RENDERER
// ----------------------------------------------------
function renderFixturesCanvas() {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 860;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#061c24';
  ctx.fillRect(0, 0, width, height);

  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const title = c.title || (document.getElementById('app-title-display')?.textContent?.trim() || 'ফুটবল বিশ্বকাপ ২০২৬');
  const venue = c.venue || (document.getElementById('app-venue-display')?.textContent?.trim() || 'স্টেডিয়াম মাঠ');
  const org = c.organizer || (document.getElementById('app-org-display')?.textContent?.trim() || 'আয়োজক কমিটি');

  drawCardHeader(ctx, width, '🗓️ MATCH SCHEDULE & FIXTURES • খেলার সময়সূচি ও ফলাফল', title, `📍 ভেন্যু: ${venue} | 🚩 আয়োজনে: ${org}`, ['#044e54', '#0d9488']);

  const tblX = 30;
  const tblY = 145;
  const tblW = width - 60;
  const tblH = 620;
  drawRoundedRect(ctx, tblX, tblY, tblW, tblH, 12, '#0c2731', '#134e4a', 1.5);

  drawRoundedRect(ctx, tblX, tblY, tblW, 40, { tl: 12, tr: 12, bl: 0, br: 0 }, '#115e59');
  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('ম্যাচ নং', tblX + 20, tblY + 25);
  ctx.fillText('সময়', tblX + 110, tblY + 25);
  ctx.fillText('গ্রুপ', tblX + 240, tblY + 25);
  ctx.fillText('মুখোমুখি দুই দল', tblX + 440, tblY + 25);
  ctx.fillText('স্কোর', tblX + 780, tblY + 25);
  ctx.fillText('ফলাফল / বিজয়ী', tblX + 920, tblY + 25);

  const tbody = document.getElementById('dynamic-schedule-tbody');
  let matchRows = [];
  if (tbody) {
    const trs = tbody.querySelectorAll('tr');
    trs.forEach((tr, idx) => {
      const cells = tr.querySelectorAll('td');
      if (cells.length >= 6) {
        const matchNo = cells[0]?.textContent?.trim() || String(idx + 1);
        const time = cells[1]?.textContent?.trim() || '';
        const grp = cells[2]?.textContent?.trim() || '';
        const team1 = cells[3]?.querySelector('.team-left')?.textContent?.trim() || '';
        const team2 = cells[3]?.querySelector('.team-right')?.textContent?.trim() || '';
        const s1 = cells[4]?.querySelector('.score-input:nth-child(1)')?.value || '';
        const s2 = cells[4]?.querySelector('.score-input:nth-child(3)')?.value || '';
        const winner = cells[5]?.querySelector('.match-winner-txt')?.textContent?.trim() || '';
        matchRows.push({ matchNo, time, grp, team1, team2, s1, s2, winner });
      }
    });
  }

  if (matchRows.length === 0) {
    matchRows = [
      { matchNo: '১', time: 'সন্ধ্যা ৬:০০', grp: 'গ্রুপ বি', team1: 'মুকুন্দপুর', team2: 'উত্তর ওড্ডা', s1: '', s2: '', winner: '' },
      { matchNo: '২', time: 'সন্ধ্যা ৬:৩০', grp: 'গ্রুপ এ', team1: 'মুড়িয়ারা', team2: 'নোয়াপাড়া', s1: '', s2: '', winner: '' },
      { matchNo: '৩', time: 'রাত ৭:০০', grp: 'গ্রুপ সি', team1: 'বাতাবাড়িয়া', team2: 'মোহাম্মদপুর', s1: '', s2: '', winner: '' },
      { matchNo: '৪', time: 'রাত ৭:৩০', grp: 'গ্রুপ এ', team1: 'নোয়াপাড়া', team2: 'চিতড্ডা', s1: '', s2: '', winner: '' },
      { matchNo: '৫', time: 'রাত ৮:০০', grp: 'গ্রুপ বি', team1: 'উত্তর ওড্ডা', team2: 'দক্ষিণ ওড্ডা', s1: '', s2: '', winner: '' },
      { matchNo: '৬', time: 'রাত ৮:৩০', grp: 'গ্রুপ সি', team1: 'মোহাম্মদপুর', team2: 'ভংগুয়া', s1: '', s2: '', winner: '' },
      { matchNo: '৭', time: 'রাত ৯:০০', grp: 'গ্রুপ এ', team1: 'চিতড্ডা', team2: 'মুড়িয়ারা', s1: '', s2: '', winner: '' },
      { matchNo: '৮', time: 'রাত ৯:৩০', grp: 'গ্রুপ বি', team1: 'দক্ষিণ ওড্ডা', team2: 'মুকুন্দপুর', s1: '', s2: '', winner: '' },
      { matchNo: '৯', time: 'রাত ১০:০০', grp: 'গ্রুপ সি', team1: 'ভংগুয়া', team2: 'বাতাবাড়িয়া', s1: '', s2: '', winner: '' }
    ];
  }

  matchRows.slice(0, 9).forEach((m, idx) => {
    const rowY = tblY + 45 + (idx * 60);

    if (idx % 2 === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(tblX + 4, rowY, tblW - 8, 54);
    }

    ctx.font = 'bold 15px "Segoe UI", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(m.matchNo, tblX + 35, rowY + 33);

    ctx.font = '14px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(m.time, tblX + 100, rowY + 33);

    const grpColor = m.grp.includes('এ') || m.grp.includes('A') ? '#ef4444' : m.grp.includes('বি') || m.grp.includes('B') ? '#38bdf8' : '#10b981';
    drawRoundedRect(ctx, tblX + 225, rowY + 14, 85, 26, 6, 'rgba(255, 255, 255, 0.08)', grpColor, 1);
    ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = grpColor;
    ctx.textAlign = 'center';
    ctx.fillText(m.grp, tblX + 267, rowY + 32);
    ctx.textAlign = 'left';

    ctx.font = 'bold 16px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(m.team1, tblX + 350, rowY + 33);

    ctx.font = 'bold 12px "Segoe UI", sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('VS', tblX + 490, rowY + 33);

    ctx.font = 'bold 16px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(m.team2, tblX + 530, rowY + 33);

    const hasScore = m.s1 !== '' && m.s2 !== '';
    const scoreStr = hasScore ? `${m.s1} - ${m.s2}` : '০ - ০';
    drawRoundedRect(ctx, tblX + 760, rowY + 12, 90, 28, 6, hasScore ? '#065f46' : '#1e293b', hasScore ? '#10b981' : '#475569', 1);
    ctx.font = 'bold 14px "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(scoreStr, tblX + 805, rowY + 31);
    ctx.textAlign = 'left';

    const cleanWin = m.winner && !m.winner.includes('___') ? m.winner : 'অমীমাংসিত / বাকি';
    const winColor = m.winner && !m.winner.includes('___') ? '#10b981' : '#64748b';
    ctx.font = 'bold 14px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = winColor;
    ctx.fillText(cleanWin, tblX + 900, rowY + 33);
  });

  drawCardFooter(ctx, width, 785);
  return canvas;
}

// ----------------------------------------------------
// 4. FULL MASTER BOARD CANVAS RENDERER
// ----------------------------------------------------
function renderMasterBoardToCanvas() {
  const canvas = document.createElement('canvas');
  const width = 1400;
  const height = 960;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#0a1026';
  ctx.fillRect(0, 0, width, height);

  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const title = c.title || (document.getElementById('app-title-display')?.textContent?.trim() || 'ফুটবল বিশ্বকাপ ২০২৬');
  const venue = c.venue || (document.getElementById('app-venue-display')?.textContent?.trim() || 'স্টেডিয়াম মাঠ');
  const org = c.organizer || (document.getElementById('app-org-display')?.textContent?.trim() || 'আয়োজক কমিটি');

  drawCardHeader(ctx, width, '🏆 COMPLETE MASTER BOARD • সম্পূর্ণ টুর্নামেন্ট মাস্টার বোর্ড', title, `📍 ভেন্যু: ${venue} | 🚩 আয়োজনে: ${org} | ৩ গ্রুপ • ৯ লিগ ম্যাচ • সেমি ও গ্র্যান্ড ফাইনাল`, ['#1e1b4b', '#4338ca']);

  const leftX = 30;
  const leftW = 460;
  drawRoundedRect(ctx, leftX, 140, leftW, 740, 14, '#101735', '#2a3563', 1.5);
  drawRoundedRect(ctx, leftX, 140, leftW, 38, { tl: 14, tr: 14, bl: 0, br: 0 }, '#1e293b');
  ctx.font = 'bold 15px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.fillText('📊 দলগত পয়েন্ট ও অবস্থান (Groups A, B, C)', leftX + 16, 165);

  const groups = [
    { key: 'A', name: 'গ্রুপ এ', color: '#ef4444', y: 195 },
    { key: 'B', name: 'গ্রুপ বি', color: '#38bdf8', y: 395 },
    { key: 'C', name: 'গ্রুপ সি', color: '#10b981', y: 595 }
  ];

  groups.forEach(g => {
    drawRoundedRect(ctx, leftX + 12, g.y, leftW - 24, 185, 10, '#151f42', g.color, 1);
    ctx.font = 'bold 14px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = g.color;
    ctx.fillText('🏆 ' + g.name, leftX + 24, g.y + 24);

    const tbody = document.getElementById('tbody-group-' + g.key);
    let rowsData = [];
    if (tbody) {
      tbody.querySelectorAll('tr').forEach((tr, idx) => {
        const team = tr.querySelector('.team-name-cell')?.textContent?.trim() || `Team ${idx + 1}`;
        const pts = tr.querySelector('.pts-badge')?.textContent?.trim() || '০';
        const gd = tr.querySelector('.gd-record')?.textContent?.trim() || '০';
        rowsData.push({ rank: idx + 1, team, pts, gd });
      });
    }
    if (rowsData.length === 0) {
      const fb = g.key === 'A' ? ['মুড়িয়ারা', 'নোয়াপাড়া', 'চিতড্ডা'] : g.key === 'B' ? ['মুকুন্দপুর', 'উত্তর ওড্ডা', 'দক্ষিণ ওড্ডা'] : ['বাতাবাড়িয়া', 'মোহাম্মদপুর', 'ভংগুয়া'];
      rowsData = fb.map((t, idx) => ({ rank: idx + 1, team: t, pts: '০', gd: '০' }));
    }

    rowsData.slice(0, 3).forEach((r, idx) => {
      const ry = g.y + 54 + (idx * 34);
      ctx.font = 'bold 12px "Segoe UI", sans-serif';
      ctx.fillStyle = r.rank === 1 ? '#f59e0b' : '#94a3b8';
      ctx.fillText(String(r.rank) + '.', leftX + 28, ry);

      ctx.font = 'bold 13.5px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(r.team, leftX + 50, ry);

      ctx.font = '12px "Segoe UI", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('GD: ' + r.gd, leftX + 310, ry);

      drawRoundedRect(ctx, leftX + 380, ry - 14, 38, 20, 5, r.rank === 1 ? '#059669' : '#0284c7');
      ctx.font = 'bold 12px "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(r.pts, leftX + 399, ry);
      ctx.textAlign = 'left';
    });

    const champDisp = document.getElementById('champ-' + g.key.toLowerCase() + '-display')?.textContent?.trim();
    ctx.font = '12px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('শীর্ষ দল: ' + (champDisp || 'নির্ধারিত হয়নি'), leftX + 28, g.y + 168);
  });

  const bestRu = document.getElementById('best-ru-display')?.textContent?.trim();
  drawRoundedRect(ctx, leftX + 12, 795, leftW - 24, 70, 10, 'rgba(56, 189, 248, 0.1)', '#38bdf8', 1.5);
  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('⭐ সেরা রানার্স-আপ (Best Runner-up):', leftX + 24, 825);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 15px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillText(bestRu || 'নির্ধারিত হয়নি', leftX + 24, 850);

  const rightX = 510;
  const rightW = width - rightX - 30;

  drawRoundedRect(ctx, rightX, 140, rightW, 360, 14, '#101735', '#2a3563', 1.5);
  drawRoundedRect(ctx, rightX, 140, rightW, 38, { tl: 14, tr: 14, bl: 0, br: 0 }, '#1e293b');
  ctx.font = 'bold 15px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.fillText('🗓️ গ্রুপ পর্বের ফিক্সচার ও ফলাফল', rightX + 16, 165);

  const schedTbody = document.getElementById('dynamic-schedule-tbody');
  let mList = [];
  if (schedTbody) {
    schedTbody.querySelectorAll('tr').forEach((tr, idx) => {
      const cells = tr.querySelectorAll('td');
      if (cells.length >= 6) {
        mList.push({
          no: cells[0]?.textContent?.trim() || String(idx + 1),
          t1: cells[3]?.querySelector('.team-left')?.textContent?.trim() || '',
          t2: cells[3]?.querySelector('.team-right')?.textContent?.trim() || '',
          s1: cells[4]?.querySelector('.score-input:nth-child(1)')?.value || '',
          s2: cells[4]?.querySelector('.score-input:nth-child(3)')?.value || ''
        });
      }
    });
  }
  if (mList.length === 0) {
    mList = [
      { no: '১', t1: 'মুকুন্দপুর', t2: 'উত্তর ওড্ডা', s1: '', s2: '' },
      { no: '২', t1: 'মুড়িয়ারা', t2: 'নোয়াপাড়া', s1: '', s2: '' },
      { no: '৩', t1: 'বাতাবাড়িয়া', t2: 'মোহাম্মদপুর', s1: '', s2: '' },
      { no: '৪', t1: 'নোয়াপাড়া', t2: 'চিতড্ডা', s1: '', s2: '' },
      { no: '৫', t1: 'উত্তর ওড্ডা', t2: 'দক্ষিণ ওড্ডা', s1: '', s2: '' },
      { no: '৬', t1: 'মোহাম্মদপুর', t2: 'ভংগুয়া', s1: '', s2: '' },
      { no: '৭', t1: 'চিতড্ডা', t2: 'মুড়িয়ারা', s1: '', s2: '' },
      { no: '৮', t1: 'দক্ষিণ ওড্ডা', t2: 'মুকুন্দপুর', s1: '', s2: '' },
      { no: '৯', t1: 'ভংগুয়া', t2: 'বাতাবাড়িয়া', s1: '', s2: '' }
    ];
  }

  mList.slice(0, 9).forEach((m, idx) => {
    const isCol2 = idx >= 5;
    const itemX = isCol2 ? rightX + (rightW / 2) + 6 : rightX + 14;
    const itemY = 192 + ((idx % 5) * 56);
    const itemW = (rightW / 2) - 20;

    drawRoundedRect(ctx, itemX, itemY, itemW, 46, 8, '#162045', '#243260', 1);
    ctx.font = 'bold 12px "Segoe UI", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('ম্যাচ ' + m.no, itemX + 10, itemY + 28);

    ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${m.t1} v ${m.t2}`, itemX + 65, itemY + 28);

    const hasS = m.s1 !== '' && m.s2 !== '';
    ctx.font = 'bold 12px "Segoe UI", sans-serif';
    ctx.fillStyle = hasS ? '#10b981' : '#64748b';
    ctx.textAlign = 'right';
    ctx.fillText(hasS ? `${m.s1}-${m.s2}` : '-', itemX + itemW - 12, itemY + 28);
    ctx.textAlign = 'left';
  });

  const koY = 515;
  const koH = 365;
  drawRoundedRect(ctx, rightX, koY, rightW, koH, 14, '#101735', '#d97706', 1.5);
  drawRoundedRect(ctx, rightX, koY, rightW, 38, { tl: 14, tr: 14, bl: 0, br: 0 }, '#78350f');
  ctx.font = 'bold 15px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('👑 সেমিফাইনাল ও গ্র্যান্ড মেগা ফাইনাল', rightX + 16, koY + 25);

  const semi1_t1 = document.getElementById('ko10-t1')?.textContent?.trim() || 'গ্রুপ এ চ্যাম্পিয়ন';
  const semi1_t2 = document.getElementById('ko10-t2')?.textContent?.trim() || 'সেরা রানার্স-আপ';
  const semi1_win = document.querySelector('#ko10-winner .winner-blank-content')?.textContent?.trim() || '';

  const semi2_t1 = document.getElementById('ko11-t1')?.textContent?.trim() || 'গ্রুপ বি চ্যাম্পিয়ন';
  const semi2_t2 = document.getElementById('ko11-t2')?.textContent?.trim() || 'গ্রুপ সি চ্যাম্পিয়ন';
  const semi2_win = document.querySelector('#ko11-winner .winner-blank-content')?.textContent?.trim() || '';

  const final_t1 = document.getElementById('ko13-t1')?.textContent?.trim() || '১ম সেমি বিজয়ী';
  const final_t2 = document.getElementById('ko13-t2')?.textContent?.trim() || '২য় সেমি বিজয়ী';
  const champ_win = document.querySelector('#ko13-winner .winner-blank-content')?.textContent?.trim() || '';

  const sW = (rightW / 2) - 20;
  drawRoundedRect(ctx, rightX + 14, koY + 52, sW, 95, 8, '#162045', '#ef4444', 1);
  ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.fillText('🔥 ১ম সেমিফাইনাল', rightX + 24, koY + 72);
  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${semi1_t1} বনাম ${semi1_t2}`, rightX + 24, koY + 98);
  ctx.fillStyle = '#10b981';
  ctx.fillText('বিজয়ী: ' + (semi1_win || 'নির্ধারিত হয়নি'), rightX + 24, koY + 128);

  drawRoundedRect(ctx, rightX + (rightW / 2) + 6, koY + 52, sW, 95, 8, '#162045', '#0284c7', 1);
  ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#0284c7';
  ctx.fillText('🔥 ২য় সেমিফাইনাল', rightX + (rightW / 2) + 16, koY + 72);
  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${semi2_t1} বনাম ${semi2_t2}`, rightX + (rightW / 2) + 16, koY + 98);
  ctx.fillStyle = '#10b981';
  ctx.fillText('বিজয়ী: ' + (semi2_win || 'নির্ধারিত হয়নি'), rightX + (rightW / 2) + 16, koY + 128);

  const fBoxY = koY + 160;
  drawRoundedRect(ctx, rightX + 14, fBoxY, rightW - 28, 190, 10, '#151838', '#f59e0b', 1.5);
  ctx.font = 'bold 16px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.textAlign = 'center';
  ctx.fillText('🏆 গ্র্যান্ড মেগা ফাইনাল 🏆', rightX + (rightW / 2), fBoxY + 30);

  ctx.font = 'bold 18px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${final_t1}   বনাম   ${final_t2}`, rightX + (rightW / 2), fBoxY + 68);

  drawRoundedRect(ctx, rightX + 34, fBoxY + 95, rightW - 68, 75, 8, 'rgba(245, 158, 11, 0.15)', '#f59e0b', 1.5);
  ctx.font = 'bold 16px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('🎉 টুর্নামেন্ট চ্যাম্পিয়ন 🎉', rightX + (rightW / 2), fBoxY + 122);
  ctx.font = 'bold 22px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(champ_win ? `🏆 ${champ_win} 🏆` : '🏆 বিজয়ী দল 🏆', rightX + (rightW / 2), fBoxY + 152);

  ctx.textAlign = 'left';
  drawCardFooter(ctx, width, 895);
  return canvas;
}

// ----------------------------------------------------
// PNG EXPORT & DOWNLOAD CONTROLLER
// ----------------------------------------------------
function downloadCanvasAsPng(canvas, filename) {
  return new Promise((resolve, reject) => {
    try {
      if (!canvas) {
        throw new Error('Canvas element not available');
      }

      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = filename || 'tournament-card.png';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 2000);
            resolve(url);
          } else {
            const dataUrl = canvas.toDataURL('image/png');
            downloadDataUrl(dataUrl, filename);
            resolve(dataUrl);
          }
        }, 'image/png');
      } else if (typeof canvas.toDataURL === 'function') {
        const dataUrl = canvas.toDataURL('image/png');
        downloadDataUrl(dataUrl, filename);
        resolve(dataUrl);
      } else {
        throw new Error('Canvas export not supported');
      }
    } catch (err) {
      reject(err);
    }
  });
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.style.display = 'none';
  a.download = filename || 'tournament-card.png';
  a.href = dataUrl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function downloadSocialCard(type, btnElement) {
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const cleanTitle = (c.title || 'tournament').replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_').toLowerCase();

  let canvas = null;
  let filename = `${cleanTitle}-card.png`;

  if (type === 'promo') {
    canvas = renderPromoPosterToCanvas();
    filename = `${cleanTitle}-tournament-notice.png`;
  } else if (type === 'standings') {
    canvas = renderStandingsToCanvas();
    filename = `${cleanTitle}-group-standings.png`;
  } else if (type === 'bracket') {
    canvas = renderBracketToCanvas();
    filename = `${cleanTitle}-knockout-bracket.png`;
  } else if (type === 'fixtures') {
    canvas = renderFixturesCanvas();
    filename = `${cleanTitle}-match-fixtures.png`;
  } else if (type === 'full') {
    canvas = renderMasterBoardToCanvas();
    filename = `${cleanTitle}-master-board.png`;
  }

  if (!canvas) {
    alert(isEn ? 'Could not generate card image.' : 'কার্ডের ছবি তৈরি করা সম্ভব হয়নি।');
    return;
  }

  let originalHtml = '';
  if (btnElement) {
    originalHtml = btnElement.innerHTML;
    btnElement.innerHTML = isEn ? '⏳ Exporting...' : '⏳ ডাউনলোড হচ্ছে...';
    btnElement.disabled = true;
  }

  try {
    await downloadCanvasAsPng(canvas, filename);
    if (btnElement) {
      btnElement.innerHTML = isEn ? '✅ Downloaded!' : '✅ ডাউনলোড সম্পন্ন!';
      setTimeout(() => {
        btnElement.innerHTML = originalHtml;
        btnElement.disabled = false;
      }, 2000);
    }
  } catch (err) {
    console.error('PNG download error:', err);
    if (btnElement) {
      btnElement.innerHTML = originalHtml;
      btnElement.disabled = false;
    }
    alert(isEn ? 'Could not download card image.' : 'ছবি ডাউনলোড করতে সমস্যা হয়েছে।');
  }
}

async function downloadAllSocialCards(btnElement) {
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  let originalHtml = '';
  if (btnElement) {
    originalHtml = btnElement.innerHTML;
    btnElement.innerHTML = isEn ? '⏳ Exporting All Cards...' : '⏳ সবগুলো ছবি প্রসেসিং হচ্ছে...';
    btnElement.disabled = true;
  }

  const sections = ['promo', 'standings', 'bracket', 'fixtures', 'full'];
  for (let i = 0; i < sections.length; i++) {
    await downloadSocialCard(sections[i], null);
    await new Promise(r => setTimeout(r, 600));
  }

  if (btnElement) {
    btnElement.innerHTML = isEn ? '✅ All Images Downloaded!' : '✅ সবগুলো ছবি ডাউনলোড সম্পন্ন!';
    setTimeout(() => {
      btnElement.innerHTML = originalHtml;
      btnElement.disabled = false;
    }, 2500);
  }
}

// ----------------------------------------------------
// GENERATE SOCIAL EXPORT CARDS HTML (FOR UNIFIED HUB)
// ----------------------------------------------------
function generateSocialExportCardsHtml() {
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  return `
    <div style="background: linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(67, 56, 202, 0.08)); border: 1px solid rgba(2, 132, 199, 0.2); border-radius: 10px; padding: 10px 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 22px;">🏆</span>
      <div>
        <strong style="color: #0284c7; font-size: 13px;">${isEn ? 'Stage 3: Match Standings & Results (Crystal-Clear PNG Images)' : 'ধাপ ৩: টুর্নামেন্ট ফলাফল ও সোশ্যাল ছবি (PNG)'}</strong>
        <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">${isEn ? 'Share live group standings, knockout roadmaps, and full boards directly on Facebook & WhatsApp as matches finish.' : 'খেলা চলাকালীন প্রতিটি ম্যাচ শেষে বা টুর্নামেন্ট সমাপ্তির পর সোশ্যাল মিডিয়ায় লাইভ পয়েন্ট টেবিল, রোডম্যাপ ও সম্পূর্ণ বোর্ডের ছবি শেয়ার করুন।'}</p>
      </div>
    </div>
    <div class="social-export-grid">
      <!-- 1. Standings -->
      <div class="social-card">
        <div class="social-card-head sc-blue">
          <span class="sc-badge">${isEn ? 'Points & Standings' : 'পয়েন্ট ও দলগত অবস্থান'}</span>
          <h4>📊 ${isEn ? 'Group Standings Table' : 'গ্রুপ পর্বের পয়েন্ট টেবিল'}</h4>
        </div>
        <div class="social-card-body">
          <p>${isEn ? 'Live points, goal difference (GD), form, and top runners-up qualification card.' : 'সবকটি গ্রুপের লাইভ পয়েন্ট, গোল ব্যবধান (GD), সাম্প্রতিক ফর্ম ও সেমিফাইনালের কার্ড।'}</p>
          <div class="social-card-actions">
            <button type="button" class="btn btn-sc-primary" onclick="downloadSocialCard('standings', this)" style="width: 100%;">
              <span class="btn-ic">📸</span> <span>${isEn ? 'Download Standings PNG' : 'পয়েন্ট টেবিল ছবি (PNG)'}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Knockout Bracket -->
      <div class="social-card">
        <div class="social-card-head sc-purple">
          <span class="sc-badge">${isEn ? 'Final Stage' : 'ফাইনাল স্টেজ'}</span>
          <h4>⚔️ ${isEn ? 'Semifinals & Grand Final' : 'সেমিফাইনাল ও মেগা ফাইনাল'}</h4>
        </div>
        <div class="social-card-body">
          <p>${isEn ? 'Head-to-head roadmap, semifinals, and Grand Final championship trophy bracket.' : '১ম ও ২য় সেমিফাইনাল, ৩য় স্থান নির্ধারণী ম্যাচ এবং গ্র্যান্ড ফাইনালের হেড-টু-হেড রোডম্যাপ।'}</p>
          <div class="social-card-actions">
            <button type="button" class="btn btn-sc-primary" onclick="downloadSocialCard('bracket', this)" style="width: 100%;">
              <span class="btn-ic">📸</span> <span>${isEn ? 'Download Knockout PNG' : 'নকআউট ব্র্যাকেট ছবি (PNG)'}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Fixtures -->
      <div class="social-card">
        <div class="social-card-head sc-emerald">
          <span class="sc-badge">${isEn ? 'Match Schedule' : 'খেলার সময়সূচি'}</span>
          <h4>🗓️ ${isEn ? 'Match Schedule Card' : 'ম্যাচ ফিক্সচার ও সময়সূচি'}</h4>
        </div>
        <div class="social-card-body">
          <p>${isEn ? 'Match timings, group opponents, head-to-head clash schedule, and live score results.' : 'কার সাথে কার খেলা, ম্যাচের সময়, গ্রুপ পর্বের প্রতিপক্ষের মুখোমুখি লড়াই ও ফলাফল।'}</p>
          <div class="social-card-actions">
            <button type="button" class="btn btn-sc-primary" onclick="downloadSocialCard('fixtures', this)" style="width: 100%;">
              <span class="btn-ic">📸</span> <span>${isEn ? 'Download Fixtures PNG' : 'ফিক্সচার ছবি (PNG)'}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 4. Full Master Board -->
      <div class="social-card">
        <div class="social-card-head sc-gold">
          <span class="sc-badge">${isEn ? 'Full 1-Page View' : 'পূর্ণাঙ্গ ১-পেজ ভিউ'}</span>
          <h4>🏆 ${isEn ? 'Full Master Tournament Board' : 'সম্পূর্ণ টুর্নামেন্ট মাস্টার বোর্ড'}</h4>
        </div>
        <div class="social-card-body">
          <p>${isEn ? 'High-resolution complete Page 1 including banner, standings, fixtures & roadmap.' : 'ব্যানার, ভেন্যু, পয়েন্ট টেবিল, ফিকশ্চার ও নকআউট ব্র্যাকেটসহ সম্পূর্ণ ক্রিস্টাল-ক্লিয়ার বোর্ড।'}</p>
          <div class="social-card-actions">
            <button type="button" class="btn btn-sc-primary" onclick="downloadSocialCard('full', this)" style="width: 100%;">
              <span class="btn-ic">📸</span> <span>${isEn ? 'Download Master Board PNG' : 'সম্পূর্ণ বোর্ড ছবি (PNG)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 14px; text-align: center;">
      <button type="button" class="btn btn-dl-all-social" onclick="downloadAllSocialCards(this)" style="padding: 10px 20px; font-weight: 700; font-size: 13px; background: linear-gradient(135deg, #1e40af, #4338ca); color: #fff; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);">
        📦 ${isEn ? 'Download All 5 Social Images (Batch PNG)' : 'সবগুলো ৫টি ছবি একসাথে ডাউনলোড (Download All PNGs)'}
      </button>
    </div>
  `;
}

// Global exports
if (typeof globalThis !== 'undefined') {
  globalThis.openSocialShareModal = openSocialShareModal;
  globalThis.closeSocialShareModal = closeSocialShareModal;
  globalThis.generateSocialExportCardsHtml = generateSocialExportCardsHtml;
  globalThis.drawRoundedRect = drawRoundedRect;
  globalThis.renderPromoPosterToCanvas = renderPromoPosterToCanvas;
  globalThis.renderStandingsToCanvas = renderStandingsToCanvas;
  globalThis.renderBracketToCanvas = renderBracketToCanvas;
  globalThis.renderFixturesCanvas = renderFixturesCanvas;
  globalThis.renderMasterBoardToCanvas = renderMasterBoardToCanvas;
  globalThis.downloadCanvasAsPng = downloadCanvasAsPng;
  globalThis.downloadSocialCard = downloadSocialCard;
  globalThis.downloadAllSocialCards = downloadAllSocialCards;
}
if (typeof window !== 'undefined') {
  window.openSocialShareModal = openSocialShareModal;
  window.closeSocialShareModal = closeSocialShareModal;
  window.generateSocialExportCardsHtml = generateSocialExportCardsHtml;
  window.drawRoundedRect = drawRoundedRect;
  window.renderPromoPosterToCanvas = renderPromoPosterToCanvas;
  window.renderStandingsToCanvas = renderStandingsToCanvas;
  window.renderBracketToCanvas = renderBracketToCanvas;
  window.renderFixturesCanvas = renderFixturesCanvas;
  window.renderMasterBoardToCanvas = renderMasterBoardToCanvas;
  window.downloadCanvasAsPng = downloadCanvasAsPng;
  window.downloadSocialCard = downloadSocialCard;
  window.downloadAllSocialCards = downloadAllSocialCards;
}
