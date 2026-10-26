// ========================================================
// SOCIAL MEDIA POSTER & NOTICE GENERATOR
// ========================================================

function generatePromoPosterCardHtml() {
  const c = tournamentConfig;
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const selectedSet = new Set(c.selectedRules || []);
  const activeMasterRules = MASTER_RULES_CATALOG.filter(r => selectedSet.has(r.id));
  const activeCustomRules = c.customRules || [];
  const allActiveRules = [...activeMasterRules, ...activeCustomRules];

  let rulesListHtml = '';
  allActiveRules.forEach(r => {
    const rTitle = isEn && r.titleEn ? r.titleEn : r.title;
    const rDesc = isEn && r.descEn ? r.descEn : r.desc;
    rulesListHtml += `<li><strong>${escapeHtml(rTitle)}:</strong> ${escapeHtml(rDesc)}</li>`;
  });

  const defaultTitle = isEn ? 'Football Tournament 2026' : 'ফুটবল টুর্নামেন্ট ২০২৬';
  const defaultOrg = isEn ? 'Tournament Organizing Committee' : 'টুর্নামেন্ট পরিচালনা কমিটি';
  const defaultVenue = isEn ? 'Local Sports Ground' : 'স্থানীয় খেলার মাঠ';
  const defaultFormat = isEn ? '6-a-side' : '৬-এ-সাইড';
  const defaultDuration = isEn ? '20 mins' : '২০ মিনিট';
  const defaultDate = isEn ? '2026' : '২০২৬';

  const tFn = typeof t === 'function' ? t : (k) => k;

  return `
    <div class="promo-poster-card">
      <div class="promo-hero-header">
        <span class="promo-badge-tag">${tFn('poster.badge')}</span>
        <h1 class="promo-hero-title">⚽ ${escapeHtml(c.title || defaultTitle)} ⚽</h1>
        <div class="promo-hero-sub">
          🚩 ${tFn('poster.footer_org')} <strong>${escapeHtml(c.organizer || defaultOrg)}</strong>
          &nbsp;|&nbsp; 📍 ${tFn('page1.meta_venue')} <strong>${escapeHtml(c.venue || defaultVenue)}</strong>
        </div>
      </div>

      <div class="promo-meta-grid">
        <div class="promo-meta-item">
          <div class="p-label">${tFn('poster.format')}</div>
          <div class="p-val">${escapeHtml(c.formatType || defaultFormat)}</div>
        </div>
        <div class="promo-meta-item">
          <div class="p-label">${tFn('poster.duration')}</div>
          <div class="p-val">${escapeHtml(c.matchDuration || defaultDuration)}</div>
        </div>
        <div class="promo-meta-item">
          <div class="p-label">${tFn('poster.date')}</div>
          <div class="p-val">${escapeHtml(c.startDate || defaultDate)}</div>
        </div>
      </div>

      <div class="promo-prizes-wrap">
        <div class="promo-prize-card champ">
          <div class="promo-prize-title">${tFn('poster.champ_prize')}</div>
          <div class="promo-prize-amount">${escapeHtml(c.championPrize || (isEn ? 'Champions Trophy & Prize Money' : 'আকর্ষণীয় ট্রফি ও প্রাইজমানি'))}</div>
          <div style="font-size:9.5px; color:#fde68a;">${tFn('poster.champ_sub')}</div>
        </div>
        <div class="promo-prize-card ru">
          <div class="promo-prize-title">${tFn('poster.runner_prize')}</div>
          <div class="promo-prize-amount">${escapeHtml(c.runnerUpPrize || (isEn ? 'Runner-Up Trophy & Cash Prize' : 'রানার্স-আপ ট্রফি ও অর্থ'))}</div>
          <div style="font-size:9.5px; color:#cbd5e1;">${tFn('poster.runner_sub')}</div>
        </div>
      </div>

      ${c.thirdPrize || c.otherPrizes ? `
      <div style="display:flex; justify-content:space-around; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:6px 10px; font-size:10px; flex-wrap:wrap; gap:6px;">
        ${c.thirdPrize ? `<div>🥉 <strong>${tFn('poster.third_place')}</strong> ${escapeHtml(c.thirdPrize)}</div>` : ''}
        ${c.otherPrizes ? `<div>🎖️ <strong>${tFn('poster.special_awards')}</strong> ${escapeHtml(c.otherPrizes)}</div>` : ''}
      </div>` : ''}

      <div class="promo-entry-contact-box">
        <div style="display:flex; flex-direction:column; gap:2px;">
          <div><strong style="color:#fde047;">${tFn('poster.entry_fee')}</strong> ${escapeHtml(c.entryFee || (isEn ? 'Contact Committee' : '২,০০০ টাকা'))}</div>
          <div><strong style="color:#fde047;">${tFn('poster.reg_deadline')}</strong> ${escapeHtml(c.regDeadline || (isEn ? 'Before Kickoff' : 'ম্যাচ শুরুর ৩০ মিনিট পূর্বে'))}</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:2px; text-align:right;">
          <div><strong style="color:#38bdf8;">${tFn('poster.contact')}</strong> ${escapeHtml(c.contactPhone || (isEn ? 'Inbox / Hotline' : '০১৭১১-xxxxxx'))}</div>
          <div><strong style="color:#38bdf8;">${tFn('poster.payment')}</strong> ${escapeHtml(c.paymentMethod || (isEn ? 'Direct / Mobile Banking' : 'বিকাশ / নগদ (পার্সোনাল)'))}</div>
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
        <div>🚩 <strong>${tFn('poster.footer_org')}</strong> ${escapeHtml(c.organizer || defaultOrg)}</div>
        <div>${tFn('poster.footer_rules')}</div>
      </div>
    </div>
  `;
}

function openPromoPosterModal() {
  const container = document.getElementById('promo-poster-render-target');
  if (container) {
    container.innerHTML = generatePromoPosterCardHtml();
  }
  const modal = document.getElementById('promo-poster-modal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
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
    pagePoster.innerHTML = generatePromoPosterCardHtml();
  }
}

function copyFacebookPromoPost() {
  const c = tournamentConfig;
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const selectedSet = new Set(c.selectedRules || []);
  const activeMasterRules = MASTER_RULES_CATALOG.filter(r => selectedSet.has(r.id));
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
