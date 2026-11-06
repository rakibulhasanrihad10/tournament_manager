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

// ========================================================
// 0. PROMO TOURNAMENT NOTICE BANNER CANVAS RENDERER
// (High-Resolution 1200x920 Canvas matching Reference Layout)
// ========================================================

var cachedPromoStadiumImg = null;
var cachedPromoMessiImg = null;
var cachedPromoMbappeImg = null;

if (typeof PROMO_STADIUM_BG_B64 !== 'undefined' && PROMO_STADIUM_BG_B64) {
  cachedPromoStadiumImg = new Image();
  cachedPromoStadiumImg.src = PROMO_STADIUM_BG_B64;
}
if (typeof PROMO_MESSI_B64 !== 'undefined' && PROMO_MESSI_B64) {
  cachedPromoMessiImg = new Image();
  cachedPromoMessiImg.src = PROMO_MESSI_B64;
}
if (typeof PROMO_MBAPPE_B64 !== 'undefined' && PROMO_MBAPPE_B64) {
  cachedPromoMbappeImg = new Image();
  cachedPromoMbappeImg.src = PROMO_MBAPPE_B64;
}

function drawCanvasLaurelWreath(ctx, cx, cy, r, startA, endA, leaves, col) {
  if (!ctx || !ctx.beginPath) return;
  ctx.save();
  ctx.strokeStyle = col || '#facc15';
  ctx.fillStyle = col || '#facc15';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (typeof ctx.arc === 'function') ctx.arc(cx, cy, r, startA, endA);
  ctx.stroke();

  for (let i = 0; i <= leaves; i++) {
    const t = i / leaves;
    const a = startA + t * (endA - startA);
    const lx = cx + r * Math.cos(a);
    const ly = cy + r * Math.sin(a);

    if (typeof ctx.translate === 'function' && typeof ctx.rotate === 'function' && typeof ctx.ellipse === 'function') {
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(a + Math.PI / 4);
      ctx.beginPath();
      ctx.ellipse(0, 0, 6.5, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(a - Math.PI / 4);
      ctx.beginPath();
      ctx.ellipse(0, 0, 6.5, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (typeof ctx.arc === 'function') {
      ctx.beginPath();
      ctx.arc(lx, ly, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function getPromoCanvasDefaultRules(isEn) {
  return isEn ? [
    { title: 'Squad & Lineup Size', desc: 'Starting lineup and substitute players must be registered before the kickoff.' },
    { title: 'Multi-team Ban', desc: 'A player can represent only one team throughout the entire tournament.' },
    { title: 'Guest Player Limit', desc: 'Maximum 1 or 2 guest players allowed per team as per committee rules.' },
    { title: 'Walkover & Punctuality', desc: 'Teams arriving more than 15 minutes late will concede a walkover loss.' },
    { title: 'Substitutions & Injuries', desc: 'Rolling substitutions permitted with prior notification to the referee.' },
    { title: 'Referee Authority', desc: 'The referee\'s decision on the field of play is supreme and final.' },
    { title: 'Official Kit & Shoes', desc: 'All players must wear matching jerseys and proper football turf shoes.' },
    { title: 'Cards & Disciplinary Code', desc: '2 Yellow cards or 1 Red card leads to an automatic 1-match suspension.' },
    { title: 'Match Forfeit & Misconduct', desc: 'Severe misconduct will lead to team disqualification and a 3-0 forfeit.' },
    { title: 'Adverse Weather Policy', desc: 'In case of heavy storm or unplayable pitch, match will be rescheduled.' }
  ] : [
    { title: 'দলে স্কোয়াড ও খেলোয়াড় সংখ্যা', desc: 'ম্যাচ শুরুর পূর্বে মূল একাদশ এবং বদলি খেলোয়াড়দের অফিশিয়াল তালিকায় নাম দিতে হবে।' },
    { title: 'একাধিক দলে অংশগ্রহণ সম্পূর্ণ নিষেধ', desc: 'একজন খেলোয়াড় পুরো টুর্নামেন্টে শুধুমাত্র একটি দলের হয়েই অংশ নিতে পারবেন।' },
    { title: 'বহিরাগত/ভাড়ায় খেলোয়াড় কোটা', desc: 'কমিটির নিয়ম অনুযায়ী প্রতি ম্যাচে একদলে সর্বোচ্চ ২ জন বহিরাগত খেলোয়াড় খেলতে পারবে।' },
    { title: 'ওয়াকওভার (Walkover) ও সময়সীমা', desc: 'ম্যাচ শুরু নির্ধারিত সময়ের সর্বোচ্চ ১৫ মিনিট অপেক্ষা করা হবে; অনুপস্থিত থাকলে প্রতিপক্ষ বিজয়ী।' },
    { title: 'আঘাতপ্রাপ্ত খেলোয়াড় ও বদলি নিয়ম', desc: 'প্রয়োজনীয় ক্ষেত্রে রেফারির অনুমতি সাপেক্ষে রোলিং বা নির্দিষ্ট বদলি কার্যকর হবে।' },
    { title: 'রেফারির সিদ্ধান্তই মাঠে চূড়ান্ত', desc: 'খেলার মাঠে রেফারির সিদ্ধান্ত চূড়ান্ত; রেফারির সিদ্ধান্ত নিয়ে অযৌক্তিক তর্ক শাস্তিযোগ্য অপরাধ।' },
    { title: 'অফিশিয়াল জার্সি ও সেফটি বুট', desc: 'দলের সকল খেলোয়াড়কে নির্দিষ্ট জার্সি এবং সেফটি বুট পরিধান করে মাঠে নামতে হবে।' },
    { title: 'হলুদ ও লাল কার্ড শৃঙ্খলা নীতি', desc: 'একটি টুর্নামেন্টে ২ হলুদ কার্ড বা ১ সরাসরি লাল কার্ড পেলে পরবর্তী ১ ম্যাচ বহিষ্কার।' },
    { title: 'শৃঙ্খলাভঙ্গ ও ম্যাচ বাজেয়াপ্ত', desc: 'মারামারি বা কমিটির সাথে অসৌজন্যমূলক আচরণে সংশ্লিষ্ট দল বাতিল ও বিপক্ষ দল ৩-০ গোলে বিজয়ী।' },
    { title: 'প্রাকৃতিক দুর্যোগ ও বৃষ্টি নীতি', desc: 'ভারী বৃষ্টি বা দুর্যোগে খেলা বাতিল হলে কমিটি পরবর্তী সুবিধাজনক তারিখ ঘোষণা করবে।' }
  ];
}

function drawCanvasLaurelLeaf(ctx, bx, by, tx, ty, width, fillColor, strokeColor) {
  ctx.save();
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1;

  const dx = tx - bx;
  const dy = ty - by;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;

  const midX = (bx + tx) / 2;
  const midY = (by + ty) / 2;
  const c1x = midX + px * (width / 2);
  const c1y = midY + py * (width / 2);
  const c2x = midX - px * (width / 2);
  const c2y = midY - py * (width / 2);

  ctx.beginPath();
  if (typeof ctx.moveTo === 'function') ctx.moveTo(bx, by);
  if (typeof ctx.quadraticCurveTo === 'function') {
    ctx.quadraticCurveTo(c1x, c1y, tx, ty);
    ctx.quadraticCurveTo(c2x, c2y, bx, by);
  } else if (typeof ctx.lineTo === 'function') {
    ctx.lineTo(tx, ty);
    ctx.lineTo(bx, by);
  }
  if (typeof ctx.closePath === 'function') ctx.closePath();
  if (typeof ctx.fill === 'function') ctx.fill();
  if (typeof ctx.stroke === 'function') ctx.stroke();
  ctx.restore();
}

function drawCanvasRiceSheafWreath(ctx, cardX, cardY, cardW, cardH, isLeft) {
  ctx.save();
  const dir = isLeft ? 1 : -1;
  const baseX = isLeft ? (cardX + 26) : (cardX + cardW - 26);
  const baseY = cardY + cardH - 16;
  const tipX = isLeft ? (cardX + 60) : (cardX + cardW - 60);
  const tipY = cardY + 16;
  const ctrlX = isLeft ? (cardX + 12) : (cardX + cardW - 12);
  const ctrlY = cardY + cardH * 0.52;

  // Draw main curved golden stem
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (typeof ctx.moveTo === 'function') ctx.moveTo(baseX, baseY);
  if (typeof ctx.quadraticCurveTo === 'function') {
    ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
  } else if (typeof ctx.lineTo === 'function') {
    ctx.lineTo(tipX, tipY);
  }
  if (typeof ctx.stroke === 'function') ctx.stroke();

  // Draw pairs of golden leaves/grains along stem
  const numPairs = 6;
  for (let i = 1; i <= numPairs; i++) {
    const t = 0.12 + (i / (numPairs + 1)) * 0.82;
    const px = (1 - t) * (1 - t) * baseX + 2 * (1 - t) * t * ctrlX + t * t * tipX;
    const py = (1 - t) * (1 - t) * baseY + 2 * (1 - t) * t * ctrlY + t * t * tipY;

    // Stem tangent derivative
    const tx = 2 * (1 - t) * (ctrlX - baseX) + 2 * t * (tipX - ctrlX);
    const ty = 2 * (1 - t) * (ctrlY - baseY) + 2 * t * (tipY - ctrlY);
    const tlen = Math.hypot(tx, ty) || 1;
    const utx = tx / tlen;
    const uty = ty / tlen;
    const unx = -uty;
    const uny = utx;

    const leafLen = 13 + (1 - Math.abs(t - 0.5) * 1.5) * 6;
    const leafWidth = 6.5;

    // Outer leaf (points away from center and up)
    const outAngleX = utx * 0.7 - (unx * dir * 0.7);
    const outAngleY = uty * 0.7 - (uny * dir * 0.7);
    const outTipX = px + outAngleX * leafLen;
    const outTipY = py + outAngleY * leafLen;
    drawCanvasLaurelLeaf(ctx, px, py, outTipX, outTipY, leafWidth, '#fde047', '#ca8a04');

    // Inner leaf (points towards center and up)
    const inAngleX = utx * 0.75 + (unx * dir * 0.65);
    const inAngleY = uty * 0.75 + (uny * dir * 0.65);
    const inTipX = px + inAngleX * (leafLen * 0.9);
    const inTipY = py + inAngleY * (leafLen * 0.9);
    drawCanvasLaurelLeaf(ctx, px, py, inTipX, inTipY, leafWidth * 0.95, '#facc15', '#ca8a04');
  }

  // Tip grain at the very top
  const topDx = (tipX - ctrlX);
  const topDy = (tipY - ctrlY);
  const topLen = Math.hypot(topDx, topDy) || 1;
  const topTipX = tipX + (topDx / topLen) * 14;
  const topTipY = tipY + (topDy / topLen) * 14;
  drawCanvasLaurelLeaf(ctx, tipX, tipY, topTipX, topTipY, 6, '#fef08a', '#ca8a04');

  // Base node
  ctx.fillStyle = '#ca8a04';
  ctx.beginPath();
  if (typeof ctx.arc === 'function') ctx.arc(baseX, baseY, 3, 0, Math.PI * 2);
  if (typeof ctx.fill === 'function') ctx.fill();

  ctx.restore();
}

function renderPromoPosterToCanvas() {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 920;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. BASE BACKGROUND FILL
  ctx.fillStyle = '#07152b';
  ctx.fillRect(0, 0, width, height);

  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  const defaultTitle = isEn ? 'Football Tournament 2026' : 'ফুটবল টুর্নামেন্ট ২০২৬';
  const defaultOrg = isEn ? 'Tournament Organizing Committee' : 'টুর্নামেন্ট পরিচালনা কমিটি';
  const defaultVenue = isEn ? 'Local Sports Ground' : 'স্থানীয় খেলার মাঠ';
  const defaultFormat = isEn ? '6-a-side' : '৬-এ-সাইড';
  const defaultDuration = isEn ? '20 mins (10+2+10 mins)' : '২০ মিনিট (১০+২+১০ মিনিট)';
  const defaultDate = isEn ? '2026' : '২০২৬';

  const title = c.title || (typeof document !== 'undefined' && document.getElementById('app-title-display')?.textContent?.trim()) || defaultTitle;
  const venue = c.venue || (typeof document !== 'undefined' && document.getElementById('app-venue-display')?.textContent?.trim()) || defaultVenue;
  const org = c.organizer || (typeof document !== 'undefined' && document.getElementById('app-org-display')?.textContent?.trim()) || defaultOrg;
  const date = c.startDate || defaultDate;
  const matchDuration = c.matchDuration || defaultDuration;
  const edition = c.edition || date;
  const startingPlayers = c.startingPlayers || 7;
  const benchPlayers = c.benchPlayers || 4;

  const champPrize = c.championPrize || c.champPrize || (isEn ? '20,000 BDT & Trophy' : '২০,০০০ টাকা ও আকর্ষণীয় ট্রফি');
  const runnerPrize = c.runnerUpPrize || c.runnerPrize || (isEn ? '10,000 BDT & Trophy' : '১০,০০০ টাকা ও ট্রফি');
  const thirdPrize = c.thirdPrize || (isEn ? 'Trophy & Medals' : 'ট্রফি ও মেডেল');
  const otherPrizes = c.otherPrizes || (isEn ? 'Best Player, Top Scorer, Best Goalkeeper' : 'সেরা খেলোয়াড়, সেরা গোলদাতা, সেরা গোলকিপার');

  const entryFee = c.entryFee || (isEn ? '1,200 BDT' : '১,২০০ টাকা');
  const regDeadline = c.regDeadline || c.deadline || (isEn ? 'Before Kickoff' : 'ম্যাচ শুরুর ৩০ মিনিট পূর্বে');
  const contactPhone = c.contactPhone || (isEn ? '017XXXXXXXX' : '০১৭১১-xxxxxx');
  const paymentMethod = c.paymentMethod || c.paymentInfo || (isEn ? 'bKash / Nagad (Personal)' : 'বিকাশ / নগদ (পার্সোনাল)');

  // 2. STADIUM & TROPHY BACKGROUND IMAGE (with zero security taint)
  let stadiumImg = null;
  if (typeof blankRosterImages !== 'undefined' && blankRosterImages && blankRosterImages.coverType === 'custom' && blankRosterImages.customCover && blankRosterImages.customCover.startsWith('data:')) {
    const customImg = new Image();
    customImg.src = blankRosterImages.customCover;
    if (customImg.complete && customImg.naturalWidth > 0) stadiumImg = customImg;
  }
  if (!stadiumImg && cachedPromoStadiumImg && cachedPromoStadiumImg.complete && cachedPromoStadiumImg.naturalWidth > 0) {
    stadiumImg = cachedPromoStadiumImg;
  }

  if (stadiumImg && stadiumImg.naturalWidth > 0) {
    try {
      // Draw stadium image spanning entire canvas so crowd silhouettes are visible at bottom
      ctx.drawImage(stadiumImg, 0, 0, width, height);
    } catch (e) {
      // fallback
    }
  }

  // Dark atmospheric gradient overlay (keeping bottom crowd silhouettes visible behind glass ribbon)
  const bgOverlay = ctx.createLinearGradient(0, 0, 0, height);
  bgOverlay.addColorStop(0, 'rgba(7, 21, 43, 0.35)');
  bgOverlay.addColorStop(0.2, 'rgba(7, 21, 43, 0.6)');
  bgOverlay.addColorStop(0.5, 'rgba(5, 14, 29, 0.86)');
  bgOverlay.addColorStop(0.85, 'rgba(4, 12, 28, 0.76)');
  bgOverlay.addColorStop(1, 'rgba(2, 8, 20, 0.58)');
  ctx.fillStyle = bgOverlay;
  ctx.fillRect(0, 0, width, height);

  // 3. SUPERSTAR PLAYER CUTOUTS (OR CUSTOM LOGOS)
  // Left: Messi or User Custom Photo
  let leftPlayerImg = null;
  if (typeof blankRosterImages !== 'undefined' && blankRosterImages && blankRosterImages.leftType === 'custom' && blankRosterImages.customLeft && blankRosterImages.customLeft.startsWith('data:')) {
    const cLeft = new Image();
    cLeft.src = blankRosterImages.customLeft;
    if (cLeft.complete && cLeft.naturalWidth > 0) leftPlayerImg = cLeft;
  }
  if (!leftPlayerImg && cachedPromoMessiImg && cachedPromoMessiImg.complete && cachedPromoMessiImg.naturalWidth > 0) {
    leftPlayerImg = cachedPromoMessiImg;
  }

  if (leftPlayerImg && leftPlayerImg.naturalWidth > 0) {
    try {
      ctx.save();
      if (ctx.shadowColor !== undefined) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
      }
      const maxW = 270;
      const maxH = 340;
      const pRatio = leftPlayerImg.naturalWidth / leftPlayerImg.naturalHeight;
      let drawW = maxW;
      let drawH = drawW / pRatio;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = drawH * pRatio;
      }
      ctx.drawImage(leftPlayerImg, 15, 20, drawW, drawH);
      ctx.restore();
    } catch (e) {
      // fallback
    }
  }

  // Right: Mbappé or User Custom Photo
  let rightPlayerImg = null;
  if (typeof blankRosterImages !== 'undefined' && blankRosterImages && blankRosterImages.rightType === 'custom' && blankRosterImages.customRight && blankRosterImages.customRight.startsWith('data:')) {
    const cRight = new Image();
    cRight.src = blankRosterImages.customRight;
    if (cRight.complete && cRight.naturalWidth > 0) rightPlayerImg = cRight;
  }
  if (!rightPlayerImg && cachedPromoMbappeImg && cachedPromoMbappeImg.complete && cachedPromoMbappeImg.naturalWidth > 0) {
    rightPlayerImg = cachedPromoMbappeImg;
  }

  if (rightPlayerImg && rightPlayerImg.naturalWidth > 0) {
    try {
      ctx.save();
      if (ctx.shadowColor !== undefined) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
      }
      const maxW = 270;
      const maxH = 340;
      const pRatio = rightPlayerImg.naturalWidth / rightPlayerImg.naturalHeight;
      let drawW = maxW;
      let drawH = drawW / pRatio;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = drawH * pRatio;
      }
      ctx.drawImage(rightPlayerImg, width - drawW - 15, 20, drawW, drawH);
      ctx.restore();
    } catch (e) {
      // fallback
    }
  }

  // 4. CENTER HERO TITLE & CAPSULE
  const centerTitleX = 600;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 3D Golden Metallic Title Effect
  ctx.font = '900 italic 40px "Hind Siliguri", "Segoe UI", sans-serif';
  // Shadow layers
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillText(title, centerTitleX + 1, 86);
  ctx.fillText(title, centerTitleX, 87);
  ctx.fillText(title, centerTitleX - 1, 86);

  const titleGrad = ctx.createLinearGradient(centerTitleX, 60, centerTitleX, 105);
  titleGrad.addColorStop(0, '#ffffff');
  titleGrad.addColorStop(0.35, '#fef08a');
  titleGrad.addColorStop(0.7, '#facc15');
  titleGrad.addColorStop(1, '#ca8a04');
  ctx.fillStyle = titleGrad;
  ctx.fillText(title, centerTitleX, 84);
  ctx.restore();

  // Glass Capsule Pill: Organizer & Venue with glowing golden border
  const pillW = 620;
  const pillH = 38;
  const pillX = 600 - (pillW / 2);
  const pillY = 112;
  ctx.save();
  if (ctx.shadowColor !== undefined) {
    ctx.shadowColor = 'rgba(250, 204, 21, 0.8)';
    ctx.shadowBlur = 18;
  }
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 19, 'rgba(4, 15, 36, 0.95)', '#facc15', 2.5);
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 13.5px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`🚩 ${isEn ? 'Organized by:' : 'আয়োজনে:'} ${org}   |   📍 ${isEn ? 'Venue:' : 'স্থান:'} ${venue}`, 600, pillY + (pillH / 2));
  ctx.restore();

  // 5. ROW 1: 3 BLUE GLASS SPECIFICATION CARDS
  const r1Y = 168;
  const r1H = 66;
  const cardW = 345;
  const cardsGap = 22;
  const cardsStartX = (width - (cardW * 3 + cardsGap * 2)) / 2; // 60px

  const specCards = [
    { label: isEn ? '🗓️ MATCH DATE' : '🗓️ ম্যাচের তারিখ', val: `${date} (${startingPlayers} ${isEn ? 'on pitch' : 'জন মাঠে'}, ${benchPlayers} ${isEn ? 'subs' : 'জন বদলি'})` },
    { label: isEn ? '⏱️ MATCH DURATION' : '⏱️ ম্যাচের সময়', val: matchDuration },
    { label: isEn ? '🏆 TOURNAMENT EDITION' : '🏆 টুর্নামেন্ট সংস্করণ', val: c.formatType || edition }
  ];

  specCards.forEach((sc, i) => {
    const cX = cardsStartX + i * (cardW + cardsGap);
    const scGrad = ctx.createLinearGradient(cX, r1Y, cX, r1Y + r1H);
    scGrad.addColorStop(0, 'rgba(3, 70, 140, 0.95)');
    scGrad.addColorStop(1, 'rgba(2, 132, 199, 0.85)');
    ctx.save();
    if (ctx.shadowColor !== undefined) {
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 14;
    }
    drawRoundedRect(ctx, cX, r1Y, cardW, r1H, 12, scGrad, '#38bdf8', 2);
    ctx.restore();

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 12px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#bae6fd';
    ctx.fillText(sc.label, cX + cardW / 2, r1Y + 20);

    ctx.font = '900 15px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    if (ctx.shadowColor !== undefined) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
    }
    ctx.fillText(sc.val, cX + cardW / 2, r1Y + 44);
    ctx.restore();
  });

  // 6. ROW 2: 2 GOLDEN RICE SHEAF PRIZE CARDS
  const r2Y = 248;
  const r2H = 135;
  const prizeCardW = 528;
  const prizeGap = 24;
  const p1X = cardsStartX; // 60px
  const p2X = p1X + prizeCardW + prizeGap; // 612px

  // Champion Prize Card (Golden Rice Sheaf)
  const champGrad = ctx.createLinearGradient(p1X, r2Y, p1X + prizeCardW, r2Y + r2H);
  champGrad.addColorStop(0, '#582405');
  champGrad.addColorStop(0.35, '#a16207');
  champGrad.addColorStop(0.7, '#ca8a04');
  champGrad.addColorStop(1, '#451a03');

  ctx.save();
  if (ctx.shadowColor !== undefined) {
    ctx.shadowColor = 'rgba(250, 204, 21, 0.75)';
    ctx.shadowBlur = 22;
  }
  drawRoundedRect(ctx, p1X, r2Y, prizeCardW, r2H, 16, champGrad, '#facc15', 3);
  ctx.restore();

  // Rice sheaf branches flanking champion prize with perfect placement
  drawCanvasRiceSheafWreath(ctx, p1X, r2Y, prizeCardW, r2H, true);
  drawCanvasRiceSheafWreath(ctx, p1X, r2Y, prizeCardW, r2H, false);

  const maxPrizeTextW = prizeCardW - 160; // 368px safe space between left and right wheat sheaves

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(isEn ? '🥇 CHAMPION TEAM PRIZE MONEY' : '🥇 চ্যাম্পিয়ন দলের প্রাইজমানি', p1X + prizeCardW / 2, r2Y + 28);

  // Scaled prize text so it never overlaps the sheaves
  let champFontPx = 24;
  ctx.font = `900 ${champFontPx}px "Hind Siliguri", "Segoe UI", sans-serif`;
  if (ctx.measureText) {
    const textW = ctx.measureText(champPrize).width;
    if (textW > maxPrizeTextW) {
      champFontPx = Math.max(14, Math.floor(champFontPx * (maxPrizeTextW / textW)));
      ctx.font = `900 ${champFontPx}px "Hind Siliguri", "Segoe UI", sans-serif`;
    }
  }
  ctx.fillStyle = '#ffffff';
  if (ctx.shadowColor !== undefined) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
  }
  ctx.fillText(champPrize, p1X + prizeCardW / 2, r2Y + 68);

  ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fde68a';
  if (ctx.shadowBlur !== undefined) ctx.shadowBlur = 0;
  ctx.fillText(isEn ? '+ Champion Winners Trophy & Gold Medals' : '+ সেরা খেলোয়াড় ট্রফি ও মেডেল', p1X + prizeCardW / 2, r2Y + 104);
  ctx.restore();

  // Runner-Up Prize Card (Golden Rice Sheaf & Gold Glowing Border)
  const ruGrad = ctx.createLinearGradient(p2X, r2Y, p2X + prizeCardW, r2Y + r2H);
  ruGrad.addColorStop(0, '#1e293b');
  ruGrad.addColorStop(0.4, '#475569');
  ruGrad.addColorStop(0.7, '#64748b');
  ruGrad.addColorStop(1, '#0f172a');

  ctx.save();
  if (ctx.shadowColor !== undefined) {
    ctx.shadowColor = 'rgba(250, 204, 21, 0.65)';
    ctx.shadowBlur = 20;
  }
  drawRoundedRect(ctx, p2X, r2Y, prizeCardW, r2H, 16, ruGrad, '#facc15', 3);
  ctx.restore();

  // Rice sheaf branches flanking runner-up prize with perfect placement
  drawCanvasRiceSheafWreath(ctx, p2X, r2Y, prizeCardW, r2H, true);
  drawCanvasRiceSheafWreath(ctx, p2X, r2Y, prizeCardW, r2H, false);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText(isEn ? '🥈 RUNNER-UP TEAM PRIZE MONEY' : '🥈 রানার্স-আপ দলের প্রাইজমানি', p2X + prizeCardW / 2, r2Y + 28);

  // Scaled prize text so it never overlaps the sheaves
  let ruFontPx = 24;
  ctx.font = `900 ${ruFontPx}px "Hind Siliguri", "Segoe UI", sans-serif`;
  if (ctx.measureText) {
    const textW = ctx.measureText(runnerPrize).width;
    if (textW > maxPrizeTextW) {
      ruFontPx = Math.max(14, Math.floor(ruFontPx * (maxPrizeTextW / textW)));
      ctx.font = `900 ${ruFontPx}px "Hind Siliguri", "Segoe UI", sans-serif`;
    }
  }
  ctx.fillStyle = '#ffffff';
  if (ctx.shadowColor !== undefined) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
  }
  ctx.fillText(runnerPrize, p2X + prizeCardW / 2, r2Y + 68);

  ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#cbd5e1';
  if (ctx.shadowBlur !== undefined) ctx.shadowBlur = 0;
  ctx.fillText(isEn ? '+ Runner-Up Trophy & Silver Medals' : '+ রানার্স-আপ ট্রফি ও মেডেল', p2X + prizeCardW / 2, r2Y + 104);
  ctx.restore();

  // 7. ROW 3: SECONDARY PRIZES STRIP
  const r3Y = 396;
  const r3H = 36;
  const fullRowW = prizeCardW * 2 + prizeGap; // 1080px
  drawRoundedRect(ctx, p1X, r3Y, fullRowW, r3H, 18, 'rgba(8, 47, 107, 0.8)', 'rgba(56, 189, 248, 0.5)', 1.5);

  ctx.save();
  ctx.font = 'bold 12.5px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';

  ctx.textAlign = 'left';
  ctx.fillText(`🏆 ${isEn ? '3rd Place:' : '৩য় স্থান:'} ${thirdPrize}`, p1X + 24, r3Y + r3H / 2);

  ctx.textAlign = 'right';
  ctx.fillText(`🏅 ${isEn ? 'Individual Awards:' : 'ব্যক্তিগত পুরস্কার:'} ${otherPrizes}`, p1X + fullRowW - 24, r3Y + r3H / 2);
  ctx.restore();

  // 8. ROW 4: 2-COLUMN INFO & CONTACT STRIP (WITH MIDDLE DIVIDER)
  const r4Y = 442;
  const r4H = 64;
  drawRoundedRect(ctx, p1X, r4Y, fullRowW, r4H, 10, 'rgba(5, 16, 38, 0.94)', 'rgba(250, 204, 21, 0.55)', 1.5);

  // Info strip middle divider
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (typeof ctx.moveTo === 'function') ctx.moveTo(p1X + fullRowW / 2, r4Y + 10);
  if (typeof ctx.lineTo === 'function') ctx.lineTo(p1X + fullRowW / 2, r4Y + r4H - 10);
  if (typeof ctx.stroke === 'function') ctx.stroke();

  ctx.save();
  ctx.textBaseline = 'middle';

  // Left Col
  ctx.textAlign = 'left';
  ctx.font = '12.5px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fde047';
  ctx.fillText(`👥 ${isEn ? 'Team Entry Fee:' : 'প্রতি দলের এন্ট্রি ফি:'} `, p1X + 20, r4Y + 20);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(entryFee, p1X + (isEn ? 140 : 160), r4Y + 20);

  ctx.fillStyle = '#fde047';
  ctx.fillText(`🗓️ ${isEn ? 'Reg. Deadline:' : 'নিবন্ধনের শেষ সময়সীমা:'} `, p1X + 20, r4Y + 44);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(regDeadline, p1X + (isEn ? 140 : 185), r4Y + 44);

  // Right Col
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`📞 ${isEn ? 'Contact / Hotline:' : 'জরুরি যোগাযোগ:'} `, p1X + fullRowW / 2 + 30, r4Y + 20);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(contactPhone, p1X + fullRowW / 2 + (isEn ? 160 : 145), r4Y + 20);

  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`📱 ${isEn ? 'Payment Via:' : 'ফি প্রদানের মাধ্যম:'} `, p1X + fullRowW / 2 + 30, r4Y + 44);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(paymentMethod, p1X + fullRowW / 2 + (isEn ? 160 : 145), r4Y + 44);
  ctx.restore();

  // 9. ROW 5: MASTER RULES BOARD (WHITE ROUNDED CARD WITH VERTICAL DIVIDER)
  const r5Y = 518;
  const r5H = 340;
  ctx.save();
  if (ctx.shadowColor !== undefined) {
    ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;
  }
  drawRoundedRect(ctx, p1X, r5Y, fullRowW, r5H, 14, '#ffffff', '#f59e0b', 3);
  ctx.restore();

  // Vertical divider line between the two columns
  const divX = p1X + fullRowW / 2;
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (typeof ctx.moveTo === 'function') ctx.moveTo(divX, r5Y + 54);
  if (typeof ctx.lineTo === 'function') ctx.lineTo(divX, r5Y + r5H - 14);
  if (typeof ctx.stroke === 'function') ctx.stroke();

  // Retrieve user rules or default reference rules
  const selectedSet = new Set(c.selectedRules || []);
  const activeMasterRules = (typeof MASTER_RULES_CATALOG !== 'undefined' ? MASTER_RULES_CATALOG : [])
    .filter(r => selectedSet.has(r.id) && (typeof isRuleApplicableToFormat !== 'function' || isRuleApplicableToFormat(r.id, c)));
  const activeCustomRules = c.customRules || [];
  let userRules = [...activeMasterRules, ...activeCustomRules].map(r => ({
    title: typeof resolveRuleTitle === 'function' ? resolveRuleTitle(r, c, isEn) : (isEn && r.titleEn ? r.titleEn : r.title),
    desc: typeof resolveRuleDesc === 'function' ? resolveRuleDesc(r, c, isEn) : (isEn && r.descEn ? r.descEn : r.desc)
  }));

  const defaultCoreRules = getPromoCanvasDefaultRules(isEn);
  const rulesToDraw = [...userRules];
  for (const defR of defaultCoreRules) {
    if (rulesToDraw.length >= 10) break;
    if (!rulesToDraw.some(r => r.title === defR.title)) {
      rulesToDraw.push(defR);
    }
  }

  // Header Golden Pill
  const pillHeaderW = 540;
  const pillHeaderH = 32;
  const pillHeaderX = 600 - (pillHeaderW / 2);
  const pillHeaderY = r5Y + 12;
  const headerPillGrad = ctx.createLinearGradient(pillHeaderX, pillHeaderY, pillHeaderX + pillHeaderW, pillHeaderY);
  headerPillGrad.addColorStop(0, '#f59e0b');
  headerPillGrad.addColorStop(1, '#d97706');
  drawRoundedRect(ctx, pillHeaderX, pillHeaderY, pillHeaderW, pillHeaderH, 16, headerPillGrad);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 12.5px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`📋 ${isEn ? 'Tournament Rules & Regulations (10 Key Rules):' : 'টুর্নামেন্ট পরিচালনা ও অংশগ্রহণের প্রধান নিয়মাবলী (১০ টি):'}`, 600, pillHeaderY + pillHeaderH / 2);
  ctx.restore();

  // 10 Rules in 2 Columns of 5 Rows
  const colRuleW = (fullRowW - 60) / 2; // ~510px
  const ruleStartY = r5Y + 58;
  const ruleRowGap = 54;

  rulesToDraw.slice(0, 10).forEach((rule, idx) => {
    const isCol2 = idx >= 5;
    const rowIdx = idx % 5;
    const rx = isCol2 ? (divX + 20) : (p1X + 20);
    const ry = ruleStartY + rowIdx * ruleRowGap;

    // Green circular number badge
    ctx.save();
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    if (typeof ctx.arc === 'function') {
      ctx.arc(rx + 11, ry + 11, 10.5, 0, Math.PI * 2);
    }
    if (typeof ctx.fill === 'function') ctx.fill();

    ctx.font = 'bold 11px "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(idx + 1), rx + 11, ry + 11);

    // Rule Title & Description
    const textStartX = rx + 28;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(rule.title + ':', textStartX, ry);

    ctx.font = '11px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#334155';
    // Clean two-line wrap without truncation
    const maxCharsPerLine = isEn ? 58 : 50;
    if (rule.desc.length <= maxCharsPerLine) {
      ctx.fillText(rule.desc, textStartX, ry + 18);
    } else {
      let breakIdx = rule.desc.lastIndexOf(' ', maxCharsPerLine);
      if (breakIdx === -1 || breakIdx < 20) breakIdx = maxCharsPerLine;
      const line1 = rule.desc.substring(0, breakIdx).trim();
      const line2 = rule.desc.substring(breakIdx).trim();
      ctx.fillText(line1, textStartX, ry + 16);
      ctx.fillText(line2, textStartX, ry + 29);
    }
    ctx.restore();
  });

  // 10. FLOATING GLASS FOOTER RIBBON OVER BOTTOM CROWD
  const footW = 840;
  const footH = 34;
  const footX = 600 - (footW / 2);
  const footY = 870;
  ctx.save();
  if (ctx.shadowColor !== undefined) {
    ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
    ctx.shadowBlur = 14;
  }
  drawRoundedRect(ctx, footX, footY, footW, footH, 17, 'rgba(5, 18, 42, 0.92)', '#38bdf8', 2);
  ctx.restore();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`⚽ ${isEn ? 'In the spirit of sports, united in bond' : 'খেলাধুলার চেতনায়, ঐক্যের বন্ধনে'} — ${title}`, 600, footY + (footH / 2));
  ctx.restore();

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
// VECTOR DRAWING HELPERS FOR FIXTURES POSTER
// ----------------------------------------------------
const DEFAULT_STADIUM_COVER_B64 = 'data:image/jpeg;base64,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';
let cachedDefaultStadiumImg = null;
if (typeof Image !== 'undefined') {
  cachedDefaultStadiumImg = new Image();
  cachedDefaultStadiumImg.src = DEFAULT_STADIUM_COVER_B64;
}

function drawCanvasTrophy(ctx, cx, cy) {
  if (ctx.save) ctx.save();
  // base
  drawRoundedRect(ctx, cx - 18, cy + 20, 36, 8, 2, '#072a60', '#f59e0b', 1.5);
  // stem
  ctx.fillStyle = '#d97706';
  ctx.fillRect(cx - 5, cy + 10, 10, 10);
  // cup
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI, false);
  ctx.lineTo(cx + 18, cy - 8);
  ctx.lineTo(cx - 18, cy - 8);
  ctx.closePath();
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  ctx.strokeStyle = '#072a60';
  ctx.lineWidth = 2;
  ctx.stroke();
  // star inside
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★', cx, cy + 4);
  // handles
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx - 19, cy - 1, 7, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + 19, cy - 1, 7, Math.PI * 1.5, Math.PI * 0.5);
  ctx.stroke();
  if (ctx.restore) ctx.restore();
}

function drawCanvasEmblem(ctx, cx, cy) {
  if (ctx.save) ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 18);
  ctx.lineTo(cx + 20, cy - 18);
  ctx.lineTo(cx + 20, cy + 4);
  ctx.quadraticCurveTo(cx + 20, cy + 24, cx, cy + 28);
  ctx.quadraticCurveTo(cx - 20, cy + 24, cx - 20, cy + 4);
  ctx.closePath();
  ctx.fillStyle = '#0284c7';
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  // Inner soccer ball icon
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚽', cx, cy + 8);
  if (ctx.restore) ctx.restore();
}

function drawHeroSwoosh(ctx, x, y, w, h) {
  if (ctx.save) ctx.save();
  // Gold swoosh
  ctx.beginPath();
  ctx.moveTo(x, y);
  if (ctx.bezierCurveTo) {
    ctx.bezierCurveTo(x + w * 0.2, y + h * 0.9, x + w * 0.35, y + h, x + w * 0.5, y + h * 0.55);
    ctx.bezierCurveTo(x + w * 0.65, y + h * 0.1, x + w * 0.8, y + h * 0.8, x + w, y);
  } else {
    ctx.lineTo(x + w, y);
  }
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  // Dark blue overlay swoosh
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.22);
  if (ctx.bezierCurveTo) {
    ctx.bezierCurveTo(x + w * 0.22, y + h, x + w * 0.37, y + h * 0.9, x + w * 0.5, y + h * 0.65);
    ctx.bezierCurveTo(x + w * 0.63, y + h * 0.45, x + w * 0.78, y + h, x + w, y + h * 0.28);
  } else {
    ctx.lineTo(x + w, y + h * 0.28);
  }
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fillStyle = '#072a60';
  ctx.fill();
  if (ctx.restore) ctx.restore();
}

// ----------------------------------------------------
// 3. MATCH FIXTURES & SCHEDULE CANVAS RENDERER (WYSIWYG)
// 100% matching the live web fixture poster preview:
// - Stadium Hero Banner with Tournament Title, Venue, Date & Badges
// - Match Schedule Table with Match No, Time, Group Pill, and Versus Teams (no scores/winners)
// - Knockout Stage Bracket with Trophy Showcase and 2x2 Knockout Match Cards
// - Disciplinary Footer Notice and Organizer Sign-off
// ----------------------------------------------------
function renderFixturesCanvas() {
  const c = typeof tournamentConfig !== 'undefined' ? tournamentConfig : {};
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  const defaultTitle = isEn ? 'Football Tournament 2026' : 'ফুটবল টুর্নামেন্ট ২০২৬';
  const defaultOrg = isEn ? 'Tournament Organizing Committee' : 'টুর্নামেন্ট পরিচালনা কমিটি';
  const defaultVenue = isEn ? 'Local Sports Ground' : 'স্থানীয় খেলার মাঠ';
  const defaultDate = isEn ? '2026' : '২০২৬';

  const title = c.title || (typeof document !== 'undefined' && document.getElementById('app-title-display')?.textContent?.trim()) || defaultTitle;
  const venue = c.venue || (typeof document !== 'undefined' && document.getElementById('app-venue-display')?.textContent?.trim()) || defaultVenue;
  const org = c.organizer || (typeof document !== 'undefined' && document.getElementById('app-org-display')?.textContent?.trim()) || defaultOrg;
  const date = c.startDate || defaultDate;

  const type = c.tournamentType || 'groups';
  const teamCount = c.teamCount || (c.teams ? c.teams.length : 4);

  // 1. MATCHES DATA
  let matches = typeof getActiveGroupMatches === 'function' ? getActiveGroupMatches() : [];
  if (!matches || matches.length === 0) {
    if (c.generatedStructure && Array.isArray(c.generatedStructure.matches) && c.generatedStructure.matches.length > 0) {
      matches = c.generatedStructure.matches;
    } else if (Array.isArray(c.matches) && c.matches.length > 0) {
      matches = c.matches;
    } else if (typeof GROUP_MATCH_DEFS !== 'undefined' && Array.isArray(GROUP_MATCH_DEFS) && GROUP_MATCH_DEFS.length > 0) {
      matches = GROUP_MATCH_DEFS;
    } else {
      matches = [
        { id: '১', time: isEn ? '6:00 PM' : 'সন্ধ্যা ৬:০০', group: 'B', t1: isEn ? 'Mukundapur' : 'মুকুন্দপুর', t2: isEn ? 'Uttar Odda' : 'উত্তর ওড্ডা' },
        { id: '২', time: isEn ? '6:30 PM' : 'সন্ধ্যা ৬:৩০', group: 'A', t1: isEn ? 'Muriara' : 'মুড়িয়ারা', t2: isEn ? 'Noapara' : 'নোয়াপাড়া' },
        { id: '৩', time: isEn ? '7:00 PM' : 'রাত ৭:০০', group: 'C', t1: isEn ? 'Batabaria' : 'বাতাবাড়িয়া', t2: isEn ? 'Mohammadpur' : 'মোহাম্মদপুর' },
        { id: '৪', time: isEn ? '7:30 PM' : 'রাত ৭:৩০', group: 'A', t1: isEn ? 'Noapara' : 'নোয়াপাড়া', t2: isEn ? 'Chitadda' : 'চিতড্ডা' },
        { id: '৫', time: isEn ? '8:00 PM' : 'রাত ৮:০০', group: 'B', t1: isEn ? 'Uttar Odda' : 'উত্তর ওড্ডা', t2: isEn ? 'Dakshin Odda' : 'দক্ষিণ ওড্ডা' },
        { id: '৬', time: isEn ? '8:30 PM' : 'রাত ৮:৩০', group: 'C', t1: isEn ? 'Mohammadpur' : 'মোহাম্মদপুর', t2: isEn ? 'Bhangua' : 'ভংগুয়া' }
      ];
    }
  }

  // 2. KNOCKOUT DATA
  const koData = typeof getDynamicKnockoutMatchesForPoster === 'function'
    ? getDynamicKnockoutMatchesForPoster(c, isEn)
    : {
        subtitle: isEn ? '4 Teams Knockout: 2 Semifinals & Grand Final' : '৪ দলের নকআউট: ২টি সেমিফাইনাল, ৩য় স্থান ও ফাইনাল',
        cards: [
          { title: isEn ? 'Semi-Final 1' : '১ম সেমিফাইনাল', time: isEn ? '9:00 PM' : 'রাত ৯:০০', colorClass: 'mc-red', t1: isEn ? 'Team 1' : 'দল ১', t2: isEn ? 'Team 2' : 'দল ২' },
          { title: isEn ? 'Semi-Final 2' : '২য় সেমিফাইনাল', time: isEn ? '9:30 PM' : 'রাত ৯:৩০', colorClass: 'mc-blue', t1: isEn ? 'Team 3' : 'দল ৩', t2: isEn ? 'Team 4' : 'দল ৪' },
          { title: isEn ? '🥉 3rd Place Playoff' : '🥉 ৩য় স্থান নির্ধারণী', time: isEn ? '10:00 PM' : 'রাত ১০:০০', colorClass: 'mc-purple', t1: isEn ? 'Semi 1 Runner-Up' : '১ম সেমি পরাজিত', t2: isEn ? 'Semi 2 Runner-Up' : '২য় সেমি পরাজিত' },
          { title: isEn ? '🏆 Grand Final' : '🏆 গ্র্যান্ড ফাইনাল', time: isEn ? '10:30 PM' : 'রাত ১০:৩০', colorClass: 'mc-dark', t1: isEn ? 'Semi 1 Winner' : '১ম সেমি বিজয়ী', t2: isEn ? 'Semi 2 Winner' : '২য় সেমি বিজয়ী' }
        ]
      };

  const koCards = (koData && Array.isArray(koData.cards)) ? koData.cards : [];
  const numKoRows = Math.ceil(koCards.length / 2);
  const totalMatches = matches.length + koCards.length;

  let scheduleTitle = isEn ? '📅 Group & Knockout Match Schedule' : '📅 গ্রুপ পর্বের ম্যাচ সূচি ও নকআউট সময়সূচি';
  if (type === 'knockout') {
    scheduleTitle = isEn ? '📅 Knockout Fixtures & Match Schedule' : '📅 নকআউট পর্বের ম্যাচ সূচি ও সময়সূচি';
  } else if (type === 'league') {
    scheduleTitle = isEn ? '📅 Single League Stage Match Schedule' : '📅 একক লিগ পর্বের ম্যাচ সূচি ও সময়সূচি';
  }

  const groupColors = {
    'A': '#b71c1c',
    'B': '#0d47a1',
    'C': '#1b5e20',
    'D': '#7c3aed',
    'KO': '#d97706'
  };

  // Dynamic Height Calculation
  const width = 1200;
  const padX = 24;
  const padY = 24;
  const bannerW = width - (padX * 2); // 1152px
  const bannerH = 175;

  const tableRowH = 38;
  const tableCardH = 42 + 34 + (matches.length * tableRowH) + 10;
  const koCardH = numKoRows > 0 ? (48 + (numKoRows * 74) + ((numKoRows - 1) * 10) + 14) : 0;
  const footH = 40;

  const height = padY + bannerH + 12 + tableCardH + (numKoRows > 0 ? (12 + koCardH) : 0) + 12 + footH + padY;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. OUTER CARD BACKGROUND & BORDER
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#091a2e');
  bgGrad.addColorStop(0.5, '#0c2b4c');
  bgGrad.addColorStop(1, '#071526');
  drawRoundedRect(ctx, 0, 0, width, height, 16, bgGrad, '#0284c7', 3);

  // 2. HERO COVER BANNER
  const bannerX = padX;
  const bannerY = padY;
  const bannerGrad = ctx.createLinearGradient(bannerX, bannerY, bannerX, bannerY + bannerH);
  bannerGrad.addColorStop(0, '#071f43');
  bannerGrad.addColorStop(0.5, '#0c3875');
  bannerGrad.addColorStop(1, '#071a38');
  drawRoundedRect(ctx, bannerX, bannerY, bannerW, bannerH, { tl: 10, tr: 10, bl: 0, br: 0 }, bannerGrad);

  // Smart Safe Cover Image Rendering (with zero security taint)
  let activeCoverImg = null;
  const domCoverImg = (typeof document !== 'undefined')
    ? (document.querySelector('#fixture-poster-content .poster-hero-img') || document.querySelector('.poster-hero-img'))
    : null;

  // 1. If DOM cover image is already a safe Data URL, use it
  if (domCoverImg && domCoverImg.src && domCoverImg.src.startsWith('data:') && domCoverImg.complete && domCoverImg.naturalWidth > 0) {
    activeCoverImg = domCoverImg;
  } else if (typeof blankRosterImages !== 'undefined' && blankRosterImages && blankRosterImages.customCover && blankRosterImages.customCover.startsWith('data:')) {
    const customImg = new Image();
    customImg.src = blankRosterImages.customCover;
    if (customImg.complete && customImg.naturalWidth > 0) {
      activeCoverImg = customImg;
    }
  }

  // 2. If no custom Data URL cover, test if domCoverImg can be exported without tainting
  if (!activeCoverImg && domCoverImg && domCoverImg.complete && domCoverImg.naturalWidth > 0) {
    try {
      const testC = document.createElement('canvas');
      testC.width = 1;
      testC.height = 1;
      const testCtx = testC.getContext('2d');
      if (testCtx && testCtx.drawImage) {
        testCtx.drawImage(domCoverImg, 0, 0, 1, 1);
        testC.toDataURL('image/png'); // Throws SecurityError if tainted
        activeCoverImg = domCoverImg;
      }
    } catch (e) {
      activeCoverImg = null;
    }
  }

  // 3. Fallback to cached default base64 stadium image (which NEVER taints on file://)
  if (!activeCoverImg && cachedDefaultStadiumImg && cachedDefaultStadiumImg.complete && cachedDefaultStadiumImg.naturalWidth > 0) {
    activeCoverImg = cachedDefaultStadiumImg;
  }

  let drewCover = false;
  if (activeCoverImg && activeCoverImg.naturalWidth > 0) {
    try {
      if (ctx.save && ctx.clip) {
        ctx.save();
        drawRoundedRect(ctx, bannerX, bannerY, bannerW, bannerH, { tl: 10, tr: 10, bl: 0, br: 0 });
        ctx.clip();

        const coverPos = (typeof blankRosterImages !== 'undefined' && blankRosterImages && blankRosterImages.coverPosition !== undefined)
          ? blankRosterImages.coverPosition
          : 35;

        const imgAspect = activeCoverImg.naturalWidth / activeCoverImg.naturalHeight;
        const bannerAspect = bannerW / bannerH;
        let sW, sH, sX, sY;
        if (imgAspect > bannerAspect) {
          sH = activeCoverImg.naturalHeight;
          sW = sH * bannerAspect;
          sX = (activeCoverImg.naturalWidth - sW) / 2;
          sY = 0;
        } else {
          sW = activeCoverImg.naturalWidth;
          sH = sW / bannerAspect;
          sX = 0;
          sY = (activeCoverImg.naturalHeight - sH) * (coverPos / 100);
        }

        ctx.drawImage(activeCoverImg, sX, sY, sW, sH, bannerX, bannerY, bannerW, bannerH);

        // Stadium Atmosphere & Vignette Overlay (matching live web preview)
        const overlayGrad = ctx.createLinearGradient(bannerX, bannerY, bannerX, bannerY + bannerH);
        overlayGrad.addColorStop(0, 'rgba(7, 26, 68, 0.65)');
        overlayGrad.addColorStop(0.5, 'rgba(3, 12, 38, 0.35)');
        overlayGrad.addColorStop(1, 'rgba(5, 18, 50, 0.85)');
        ctx.fillStyle = overlayGrad;
        ctx.fillRect(bannerX, bannerY, bannerW, bannerH);

        ctx.restore();
        drewCover = true;
      }
    } catch (e) {
      drewCover = false;
    }
  }

  // Fallback if cover was not drawn: Stadium floodlights effect
  if (!drewCover && ctx.createRadialGradient) {
    const lightL = ctx.createRadialGradient(bannerX + 60, bannerY + 20, 5, bannerX + 160, bannerY + 90, 220);
    lightL.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
    lightL.addColorStop(1, 'rgba(7, 31, 67, 0)');
    ctx.fillStyle = lightL;
    ctx.fillRect(bannerX, bannerY, 320, bannerH);

    const lightR = ctx.createRadialGradient(bannerX + bannerW - 60, bannerY + 20, 5, bannerX + bannerW - 160, bannerY + 90, 220);
    lightR.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
    lightR.addColorStop(1, 'rgba(7, 31, 67, 0)');
    ctx.fillStyle = lightR;
    ctx.fillRect(bannerX + bannerW - 320, bannerY, 320, bannerH);
  }

  // Smart Logo Drawing (Natural photos with NO border/card, or fallback vector badges)
  function drawLogoItem(side, cx, cy) {
    let drewLogo = false;
    const logoImgEl = (typeof document !== 'undefined')
      ? document.querySelector(`#fixture-poster-content .poster-hero-logo:${side === 'left' ? 'first-child' : 'last-child'} img`)
      : null;

    if (logoImgEl && logoImgEl.complete && logoImgEl.naturalWidth > 0) {
      try {
        const testC = document.createElement('canvas');
        testC.width = 1;
        testC.height = 1;
        const testCtx = testC.getContext('2d');
        if (testCtx && testCtx.drawImage) {
          testCtx.drawImage(logoImgEl, 0, 0, 1, 1);
          testC.toDataURL('image/png'); // Test security taint

          if (ctx.save && ctx.restore) {
            ctx.save();
            // Preserve natural aspect ratio and fit inside max 90x65
            const maxW = 90;
            const maxH = 65;
            const aspect = logoImgEl.naturalWidth / logoImgEl.naturalHeight;
            let dw = maxW;
            let dh = maxW / aspect;
            if (dh > maxH) {
              dh = maxH;
              dw = maxH * aspect;
            }
            const dx = cx - dw / 2;
            const dy = cy - dh / 2;

            // Subtle drop shadow matching web preview, STRICTLY NO border or white card
            if (ctx.shadowColor !== undefined) {
              ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
              ctx.shadowBlur = 8;
              ctx.shadowOffsetY = 3;
            }

            ctx.drawImage(logoImgEl, dx, dy, dw, dh);
            ctx.restore();
            drewLogo = true;
          }
        }
      } catch (e) {
        drewLogo = false;
      }
    }

    if (!drewLogo) {
      if (side === 'left') {
        drawCanvasTrophy(ctx, cx, cy);
      } else {
        drawCanvasEmblem(ctx, cx, cy);
      }
    }
  }

  // Draw Left & Right logos
  drawLogoItem('left', bannerX + 55, bannerY + 68);
  drawLogoItem('right', bannerX + bannerW - 55, bannerY + 68);

  // Center Badge Tag
  const badgeText = isEn ? '✨ OFFICIAL MATCH FIXTURES & SCHEDULE ✨' : '✨ অফিশিয়াল ম্যাচ ফিক্সচার ও খেলার সময়সূচি ✨';
  const badgeW = 320;
  const badgeH = 24;
  const badgeX = bannerX + (bannerW - badgeW) / 2;
  const badgeY = bannerY + 16;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 12, '#0284c7', '#38bdf8', 1);
  ctx.font = 'bold 11.5px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, bannerX + bannerW / 2, badgeY + 16);

  // Main Title
  ctx.font = '900 28px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffca28';
  ctx.textAlign = 'center';
  ctx.fillText(`⚽ ${title} ⚽`, bannerX + bannerW / 2, badgeY + 54);

  // Subtitle Pill
  const subH = 30;
  const subW = Math.min(840, bannerW - 200);
  const subX = bannerX + (bannerW - subW) / 2;
  const subY = badgeY + 70;
  drawRoundedRect(ctx, subX, subY, subW, subH, 15, 'rgba(255, 255, 255, 0.14)', 'rgba(255, 255, 255, 0.3)', 1);
  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'center';
  const subStr = isEn
    ? `🚩 Org: ${org}   |   📍 Venue: ${venue}   |   🗓️ ${date}`
    : `🚩 আয়োজনে: ${org}   |   📍 স্থান: ${venue}   |   🗓️ ${date}`;
  ctx.fillText(subStr, bannerX + bannerW / 2, subY + 20);

  // Curved swoosh ribbon at bottom of banner
  drawHeroSwoosh(ctx, bannerX, bannerY + bannerH - 18, bannerW, 18);

  // 3. MATCH SCHEDULE TABLE CARD
  const tableCardX = bannerX;
  const tableCardY = bannerY + bannerH + 12;
  const tableCardW = bannerW;
  drawRoundedRect(ctx, tableCardX, tableCardY, tableCardW, tableCardH, 8, '#ffffff', '#cbd5e1', 1.2);

  // Schedule Title Bar
  const stGrad = ctx.createLinearGradient(tableCardX, tableCardY, tableCardX + tableCardW, tableCardY);
  stGrad.addColorStop(0, '#072a60');
  stGrad.addColorStop(1, '#0a3d87');
  drawRoundedRect(ctx, tableCardX, tableCardY, tableCardW, 42, { tl: 8, tr: 8, bl: 0, br: 0 }, stGrad);

  ctx.font = 'bold 15px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText(scheduleTitle, tableCardX + 16, tableCardY + 26);

  // Badges on title bar
  const pill1W = 90;
  const pill2W = 98;
  const pill1X = tableCardX + tableCardW - (pill1W + pill2W + 20);
  const pill2X = tableCardX + tableCardW - (pill2W + 12);
  drawRoundedRect(ctx, pill1X, tableCardY + 9, pill1W, 24, 12, 'rgba(255, 255, 255, 0.15)', 'rgba(253, 224, 71, 0.4)', 1);
  ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fde047';
  ctx.textAlign = 'center';
  ctx.fillText(`👥 ${teamCount} ${isEn ? 'Teams' : 'টি দল'}`, pill1X + (pill1W / 2), tableCardY + 25);

  drawRoundedRect(ctx, pill2X, tableCardY + 9, pill2W, 24, 12, 'rgba(255, 255, 255, 0.15)', 'rgba(74, 222, 128, 0.4)', 1);
  ctx.fillStyle = '#4ade80';
  ctx.fillText(`⚽ ${totalMatches} ${isEn ? 'Matches' : 'টি ম্যাচ'}`, pill2X + (pill2W / 2), tableCardY + 25);

  // Table Column Header Bar
  const thY = tableCardY + 42;
  drawRoundedRect(ctx, tableCardX + 8, thY, tableCardW - 16, 34, 4, '#0d2b6b');
  const colMatchCenter = tableCardX + 68;
  const colTimeCenter = tableCardX + 225;
  const colGroupCenter = tableCardX + 425;
  const colVsCenter = tableCardX + 835;

  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(isEn ? 'Match No' : 'ম্যাচ নং', colMatchCenter, thY + 22);
  ctx.fillText(isEn ? 'Time' : 'সময়', colTimeCenter, thY + 22);
  ctx.fillText(isEn ? 'Group / Stage' : 'গ্রুপ / পর্ব', colGroupCenter, thY + 22);
  ctx.fillText(isEn ? 'Versus Teams' : 'মুখোমুখি দল', colVsCenter, thY + 22);

  // Rows
  matches.forEach((m, idx) => {
    const rowY = thY + 34 + (idx * tableRowH);
    if (idx % 2 === 1) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(tableCardX + 8, rowY, tableCardW - 16, tableRowH);
    }
    // Bottom border
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(tableCardX + 8, rowY + tableRowH - 1, tableCardW - 16, 1);

    // Match No
    ctx.font = 'bold 14px "Segoe UI", sans-serif';
    ctx.fillStyle = '#0284c7';
    ctx.textAlign = 'center';
    ctx.fillText(String(m.id), colMatchCenter, rowY + 24);

    // Time
    ctx.font = '600 13px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(m.time || '', colTimeCenter, rowY + 24);

    // Group badge
    const grpColor = groupColors[m.group] || '#475569';
    let grpText = '';
    if (m.group === 'KO') {
      grpText = isEn ? 'Knockout' : 'নকআউট';
    } else if (type === 'league') {
      grpText = isEn ? 'League' : 'লিগ পর্ব';
    } else {
      grpText = isEn ? `Group ${m.group}` : `গ্রুপ ${m.group}`;
    }

    drawRoundedRect(ctx, colGroupCenter - 45, rowY + 7, 90, 24, 6, 'rgba(0, 0, 0, 0.03)', grpColor, 1);
    ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = grpColor;
    ctx.fillText(grpText, colGroupCenter, rowY + 23);

    // Teams & VS badge
    ctx.font = 'bold 14.5px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    ctx.fillText(m.t1, colVsCenter - 24, rowY + 24);

    drawRoundedRect(ctx, colVsCenter - 11, rowY + 8, 22, 22, 11, '#d32f2f');
    ctx.font = 'bold 9px "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('VS', colVsCenter, rowY + 22);

    ctx.font = 'bold 14.5px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.fillText(m.t2, colVsCenter + 24, rowY + 24);
  });

  // 4. KNOCKOUT SECTION CARD
  let lastBottomY = tableCardY + tableCardH;
  if (numKoRows > 0) {
    const koCardX = bannerX;
    const koCardY = lastBottomY + 12;
    const koCardW = bannerW;
    drawRoundedRect(ctx, koCardX, koCardY, koCardW, koCardH, 8, '#ffffff', '#cbd5e1', 1.2);

    // Bracket Header
    const bhY = koCardY + 10;
    ctx.font = '800 15px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#0d2b6b';
    ctx.textAlign = 'left';
    ctx.fillText(isEn ? '👑 Knockout Fixtures & Bracket Roadmap' : '👑 নকআউট পর্বের সময়সূচি ও ব্র্যাকেট', koCardX + 16, bhY + 15);

    ctx.font = 'bold 11.5px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(koData.subtitle || '', koCardX + 16, bhY + 31);

    // Trophies Showcase
    const tW = 96;
    const tH = 22;
    // Gold
    drawRoundedRect(ctx, koCardX + koCardW - 320, bhY + 8, tW, tH, 11, '#fef3c7', '#f59e0b', 1);
    ctx.font = 'bold 11px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillStyle = '#b45309';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 ' + (isEn ? 'Champion' : 'চ্যাম্পিয়ন'), koCardX + koCardW - 320 + tW / 2, bhY + 23);

    // Silver
    drawRoundedRect(ctx, koCardX + koCardW - 212, bhY + 8, tW, tH, 11, '#f1f5f9', '#94a3b8', 1);
    ctx.fillStyle = '#475569';
    ctx.fillText('🏆 ' + (isEn ? 'Runner-Up' : 'রানার্স-আপ'), koCardX + koCardW - 212 + tW / 2, bhY + 23);

    // Bronze
    drawRoundedRect(ctx, koCardX + koCardW - 104, bhY + 8, tW, tH, 11, '#ffedd5', '#ea580c', 1);
    ctx.fillStyle = '#c2410c';
    ctx.fillText('🏆 ' + (isEn ? '3rd Place' : '৩য় স্থান'), koCardX + koCardW - 104 + tW / 2, bhY + 23);

    // 2x2 Knockout Grid Cards
    const gridY = koCardY + 48;
    const cardGap = 12;
    const cardW = (koCardW - 32 - cardGap) / 2;
    const cardH = 74;

    koCards.forEach((card, cIdx) => {
      const row = Math.floor(cIdx / 2);
      const col = cIdx % 2;
      const cX = koCardX + 16 + (col * (cardW + cardGap));
      const cY = gridY + (row * (cardH + 10));

      // Outer match card
      drawRoundedRect(ctx, cX, cY, cardW, cardH, 6, '#ffffff', '#cbd5e1', 1.2);

      // Card Head Gradient
      const headH = 26;
      let gradColors = ['#1e293b', '#0f172a'];
      if (card.colorClass === 'mc-red') gradColors = ['#dc2626', '#b91c1c'];
      else if (card.colorClass === 'mc-blue') gradColors = ['#2563eb', '#1d4ed8'];
      else if (card.colorClass === 'mc-purple') gradColors = ['#7c3aed', '#6d28d9'];
      else if (card.colorClass === 'mc-dark') gradColors = ['#0f172a', '#1e293b'];

      const headGrad = ctx.createLinearGradient(cX, cY, cX + cardW, cY);
      headGrad.addColorStop(0, gradColors[0]);
      headGrad.addColorStop(1, gradColors[1]);
      drawRoundedRect(ctx, cX, cY, cardW, headH, { tl: 6, tr: 6, bl: 0, br: 0 }, headGrad);

      ctx.font = 'bold 12px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`${card.title} | ${card.time}`, cX + (cardW / 2), cY + 18);

      // Card Body (Teams + VS)
      const bodyY = cY + headH;
      const cCenter = cX + (cardW / 2);

      ctx.font = 'bold 13.5px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'right';
      ctx.fillText(card.t1, cCenter - 22, bodyY + 28);

      drawRoundedRect(ctx, cCenter - 10, bodyY + 14, 20, 20, 10, '#d32f2f');
      ctx.font = 'bold 8.5px "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('VS', cCenter, bodyY + 27);

      ctx.font = 'bold 13.5px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'left';
      ctx.fillText(card.t2, cCenter + 22, bodyY + 28);
    });

    lastBottomY = koCardY + koCardH;
  }

  // 5. FOOTER NOTICE & ORGANIZER CREDITS
  const footX = bannerX;
  const footY = lastBottomY + 12;
  const footW = bannerW;
  drawRoundedRect(ctx, footX, footY, footW, footH, 6, 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.18)', 1);

  ctx.font = '12px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'left';
  const footNotice = isEn
    ? '⚠️ All teams must arrive 15 mins prior to kickoff & adhere strictly to tournament rules.'
    : '⚠️ সকল দলকে ম্যাচ শুরুর ১৫ মিনিট পূর্বে মাঠে উপস্থিত থাকতে হবে এবং টুর্নামেন্ট আচরণবিধি মেনে চলতে হবে।';
  ctx.fillText(footNotice, footX + 16, footY + 25);

  ctx.font = 'bold 13px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'right';
  ctx.fillText(`🚩 ${org}`, footX + footW - 16, footY + 25);

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
