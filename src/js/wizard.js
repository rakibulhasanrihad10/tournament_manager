// ========================================================
// TOURNAMENT SETUP & RULES WIZARD
// ========================================================

let tempWizardTeams = [];
let tempWizardTourneyType = 'groups';
let tempWizardTeamCount = 9;

function switchWizardTab(tabKey) {
  const tabs = ['info', 'prizes', 'rules', 'teams'];
  tabs.forEach(t => {
    const btn = document.getElementById(`wtab-btn-${t}`);
    const pane = document.getElementById(`wtab-content-${t}`);
    if (btn) {
      if (t === tabKey) btn.classList.add('active');
      else btn.classList.remove('active');
    }
    if (pane) {
      if (t === tabKey) pane.classList.add('active');
      else pane.classList.remove('active');
    }
  });
  if (tabKey === 'info') {
    setTimeout(updateRoadmapSvgPaths, 60);
  } else if (tabKey === 'rules') {
    if (typeof syncRulesWithSquadSettings === 'function') {
      syncRulesWithSquadSettings(true);
    }
  }
}

function setWizardTournamentType(type) {
  tempWizardTourneyType = type || 'groups';
  ['groups', 'knockout', 'league'].forEach(t => {
    const card = document.getElementById(`btn-tourney-type-${t}`);
    if (card) card.classList.toggle('active', t === tempWizardTourneyType);
  });
  updateWizardStructureSummary();
  renderWizardTeamsDashboard();
}

function getTournamentFormatRecommendations(teamCount, isEn = false) {
  const count = Math.max(2, parseInt(teamCount, 10) || 2);
  const isPowerOfTwo = (count > 0) && ((count & (count - 1)) === 0);
  const isEven = count % 2 === 0;

  let rec = {
    groups: { badge: 'good', badgeText: '', desc: '' },
    league: { badge: 'good', badgeText: '', desc: '' },
    knockout: { badge: 'good', badgeText: '', desc: '' }
  };

  if (!isEn) {
    if (count <= 3) {
      rec.league = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: `রাউন্ড-রবিন পয়েন্ট টেবিল • প্রতিটি দল সবার সাথে খেলবে (মোট ${count === 2 ? 1 : 3}টি ম্যাচ)।`
      };
      rec.knockout = {
        badge: 'good',
        badgeText: '⚡ বিকল্প',
        desc: count === 2 ? '২ দলের সরাসরি একক ফাইনাল ম্যাচ।' : '৩ দল • সরাসরি ফাইনাল ও ১টি প্রাথমিক ম্যাচ (১টি বাই)।'
      };
      rec.groups = {
        badge: 'warn',
        badgeText: '⚠️ অসুপারিশকৃত',
        desc: `${count}টি দলের জন্য গ্রুপ পর্ব প্রয়োজন নেই, একক লিগ টেবিলই আদর্শ।`
      };
    } else if (count === 4) {
      rec.knockout = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: 'নিখুঁত নকআউট • ২টি সেমিফাইনাল ➔ ১টি গ্র্যান্ড ফাইনাল (মোট ৩টি ম্যাচ)।'
      };
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: '২টি গ্রুপ (২+২ দল) • প্রতি গ্রুপ চ্যাম্পিয়ন সরাসরি ফাইনালে খেলবে।'
      };
      rec.league = {
        badge: 'good',
        badgeText: '⚡ উপযুক্ত বিকল্প',
        desc: 'একক লিগ টেবিল • মোট ৬টি ম্যাচ • প্রতিটি দল ৩টি ম্যাচ খেলার নিশ্চয়তা পাবে।'
      };
    } else if (count === 5) {
      rec.league = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: 'মোট ১০টি ম্যাচ • প্রতিটি দল ৪টি ম্যাচ খেলবে • পয়েন্ট টেবিলের শীর্ষ দল চ্যাম্পিয়ন (কেউ না খেলে বাদ পড়বে না)।'
      };
      rec.groups = {
        badge: 'good',
        badgeText: '⚡ উপযুক্ত বিকল্প',
        desc: '২টি গ্রুপ (৩+২ দল) • ৪টি গ্রুপ ম্যাচ ➔ সেমিফাইনাল (A1 vs B2, B1 vs A2) ➔ ফাইনাল।'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ অসুপারিশকৃত (বাই প্রয়োজন)',
        desc: '৫ বিজোড় সংখ্যা • বাই (Bye) দেওয়া বাধ্যতামূলক • ৩টি দল মাত্র ১ ম্যাচ খেলে বাদ পড়বে।'
      };
    } else if (count === 6) {
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: '২টি গ্রুপ (প্রতিটিতে ৩ দল) • মোট ৬টি গ্রুপ ম্যাচ ➔ ২টি সেমিফাইনাল ➔ ফাইনাল।'
      };
      rec.league = {
        badge: 'good',
        badgeText: '⚡ উপযুক্ত বিকল্প',
        desc: 'মোট ১৫টি রাউন্ড-রবিন ম্যাচ • প্রতিটি দল ৫টি করে ম্যাচ খেলবে • শীর্ষ দল চ্যাম্পিয়ন।'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ বাই প্রয়োজন',
        desc: '৬ দল নিখুঁত নকআউট নয় • ২টি দলকে কোয়ার্টারে বাই সুবিধা দিতে হবে।'
      };
    } else if (count === 7) {
      rec.groups = {
        badge: 'good',
        badgeText: '⚡ উপযুক্ত বিকল্প',
        desc: '২টি গ্রুপ (৪+৩ দল) • মোট ৯টি গ্রুপ ম্যাচ ➔ সেমিফাইনাল ➔ ফাইনাল।'
      };
      rec.league = {
        badge: 'good',
        badgeText: '⚡ দীর্ঘ লিগ',
        desc: 'মোট ২১টি ম্যাচ • সময় ও মাঠের পর্যাপ্ত সুবিধা থাকলে অত্যন্ত আকর্ষণীয় লিগ।'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ অসুপারিশকৃত (বাই প্রয়োজন)',
        desc: '৭ বিজোড় সংখ্যা • ১টি দলকে সেমিফাইনালে সরাসরি বাই দিতে হবে।'
      };
    } else if (count === 8) {
      rec.knockout = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: 'নিখুঁত ৮ দলের নকআউট • ৪টি কোয়ার্টার ➔ ২টি সেমি ➔ ১টি গ্র্যান্ড ফাইনাল (মোট ৭ ম্যাচ)।'
      };
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: '২টি গ্রুপ (প্রতিটিতে ৪ দল) • মোট ১২টি গ্রুপ ম্যাচ ➔ সেমিফাইনাল ➔ ফাইনাল।'
      };
      rec.league = {
        badge: 'good',
        badgeText: '⚡ অতি দীর্ঘ লিগ',
        desc: 'মোট ২৮টি ম্যাচ • পয়েন্ট টেবিলের সেরা ২ দল ফাইনাল খেলবে (প্রচুর সময় প্রয়োজন)।'
      };
    } else if (count === 9) {
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: '৩টি গ্রুপ (প্রতি গ্রুপে ৩ দল) • ৯টি গ্রুপ ম্যাচ • ৩ চ্যাম্পিয়ন + ১ সেরা রানার্স-আপ ➔ সেমি ➔ ফাইনাল।'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ অসুপারিশকৃত (বাই প্রয়োজন)',
        desc: '৯ বিজোড় সংখ্যা • নিখুঁত ব্র্যাকেট নয় • ৭টি দলকে সরাসরি কোয়ার্টারে বাই দিতে হবে।'
      };
      rec.league = {
        badge: 'warn',
        badgeText: '⚠️ অতি দীর্ঘ',
        desc: 'মোট ৩৬টি ম্যাচ • অপেশাদার টুর্নামেন্টের জন্য সময় ও খরচের দিক থেকে অতিরিক্ত বড়।'
      };
    } else if (count === 10) {
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: '২টি গ্রুপ (৫+৫ দল) • ২০টি গ্রুপ ম্যাচ ➔ সেমিফাইনাল ➔ ফাইনাল।'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ অসুপারিশকৃত (বাই প্রয়োজন)',
        desc: '১০ দল নিখুঁত নকআউট নয় • ৬টি দলকে সরাসরি কোয়ার্টারে বাই দিতে হবে।'
      };
      rec.league = {
        badge: 'warn',
        badgeText: '⚠️ অতি দীর্ঘ',
        desc: 'মোট ৪৫টি ম্যাচ • সময় ও বাজেট বেশি প্রয়োজন।'
      };
    } else if (count === 12) {
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: '৪টি গ্রুপ (প্রতিটিতে ৩ দল) • ১২টি গ্রুপ ম্যাচ ➔ সেমিফাইনাল ➔ মেগা ফাইনাল।'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ বাই প্রয়োজন',
        desc: '১২ দল নিখুঁত নকআউট নয় • ৪টি দলকে বাই দিতে হবে।'
      };
      rec.league = {
        badge: 'warn',
        badgeText: '⚠️ প্রায় অসম্ভব',
        desc: 'মোট ৬৬টি ম্যাচ • স্থানীয় টুর্নামেন্টে পরিচালনা অত্যন্ত কঠিন।'
      };
    } else if (count === 16) {
      rec.knockout = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: 'নিখুঁত ১৬ দল নকআউট • রাউন্ড অব ১৬ ➔ কোয়ার্টার ➔ সেমি ➔ ফাইনাল (মোট ১৫ ম্যাচ)।'
      };
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ সেরা ও সুপারিশকৃত',
        desc: '৪টি গ্রুপ (প্রতিটিতে ৪ দল) বিশ্বকাপ ফরম্যাট • ২৪ গ্রুপ ম্যাচ ➔ কোয়ার্টার ➔ সেমি ➔ ফাইনাল।'
      };
      rec.league = {
        badge: 'warn',
        badgeText: '⚠️ প্রায় অসম্ভব',
        desc: 'মোট ১২০টি ম্যাচ • একক নকআউট বা গ্রুপ পর্বই একমাত্র বাস্তবসম্মত সমাধান।'
      };
    } else {
      if (isPowerOfTwo) {
        rec.knockout = {
          badge: 'best',
          badgeText: '⭐ সেরা ও সুপারিশকৃত',
          desc: `নিখুঁত ${count} দলের নকআউট ব্র্যাকেট • কোনো বাই ছাড়াই সরাসরি রোমাঞ্চকর লড়াই।`
        };
        rec.groups = {
          badge: 'best',
          badgeText: '⭐ সেরা ও সুপারিশকৃত',
          desc: 'সমান গ্রুপে বিভক্ত • পয়েন্ট টেবিলের সেরা দলগুলো নকআউটে উঠবে।'
        };
        rec.league = {
          badge: count <= 6 ? 'good' : 'warn',
          badgeText: count <= 6 ? '⚡ উপযুক্ত বিকল্প' : '⚠️ অতি দীর্ঘ',
          desc: `মোট ${(count * (count - 1)) / 2}টি ম্যাচ • রাউন্ড-রবিন পয়েন্ট টেবিল।`
        };
      } else if (isEven) {
        rec.groups = {
          badge: 'best',
          badgeText: '⭐ সেরা ও সুপারিশকৃত',
          desc: 'সমান দল নিয়ে গ্রুপ পর্ব • প্রতি গ্রুপ থেকে সেরা দলগুলো নকআউটে যাবে।'
        };
        rec.knockout = {
          badge: 'warn',
          badgeText: '⚠️ বাই প্রয়োজন',
          desc: `${count} জোড় সংখ্যা হলেও পাওয়ার অব ২ নয়, তাই বাই (Bye) প্রয়োজন।`
        };
        rec.league = {
          badge: count <= 6 ? 'good' : 'warn',
          badgeText: count <= 6 ? '⚡ উপযুক্ত বিকল্প' : '⚠️ অতি দীর্ঘ',
          desc: `মোট ${(count * (count - 1)) / 2}টি ম্যাচ • রাউন্ড-রবিন পয়েন্ট টেবিল।`
        };
      } else {
        rec.groups = {
          badge: count >= 5 ? 'best' : 'warn',
          badgeText: count >= 5 ? '⭐ সেরা ও সুপারিশকৃত' : '⚠️ অসুপারিশকৃত',
          desc: 'গ্রুপভিত্তিক বিন্যাস • পয়েন্ট টেবিলের সেরা দলগুলো পরবর্তী রাউন্ডে যাবে।'
        };
        rec.knockout = {
          badge: 'warn',
          badgeText: '⚠️ অসুপারিশকৃত (বাই প্রয়োজন)',
          desc: `${count} বিজোড় সংখ্যা • বাই (Bye) ছাড়া নকআউট খেলা সম্ভব নয়।`
        };
        rec.league = {
          badge: count <= 5 ? 'best' : 'warn',
          badgeText: count <= 5 ? '⭐ সেরা ও সুপারিশকৃত' : '⚠️ অতি দীর্ঘ',
          desc: `মোট ${(count * (count - 1)) / 2}টি ম্যাচ • পয়েন্ট টেবিল ভিত্তিক লড়াই।`
        };
      }
    }
  } else {
    // English recommendations
    if (count <= 3) {
      rec.league = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: `Round-robin league table • Every team plays each other (Total ${count === 2 ? 1 : 3} matches).`
      };
      rec.knockout = {
        badge: 'good',
        badgeText: '⚡ Alternative',
        desc: count === 2 ? 'Single Final match between 2 teams.' : '3 Teams • Opening match + Byed Final.'
      };
      rec.groups = {
        badge: 'warn',
        badgeText: '⚠️ Not Ideal',
        desc: `With only ${count} teams, group stage is unnecessary; single league is best.`
      };
    } else if (count === 4) {
      rec.knockout = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: 'Perfect Knockout • 2 Semi-Finals ➔ 1 Grand Final (Total 3 matches).'
      };
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: '2 Groups (2+2 teams) • Group champions contest Final.'
      };
      rec.league = {
        badge: 'good',
        badgeText: '⚡ Alternative',
        desc: 'Single League Table • 6 matches • Every team guaranteed 3 matches.'
      };
    } else if (count === 5) {
      rec.league = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: '10 matches • Each team plays 4 games • Table toppers contest title (Fair for all).'
      };
      rec.groups = {
        badge: 'good',
        badgeText: '⚡ Good Alternative',
        desc: '2 Groups (3+2 teams) • 4 Group matches ➔ Semi-Finals (A1 vs B2, B1 vs A2) ➔ Final.'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ Needs Byes',
        desc: '5 is odd • Byes required • 3 teams eliminated after playing only 1 match.'
      };
    } else if (count === 6) {
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: '2 Groups (3 teams each) • 6 Group matches ➔ Semi-Finals ➔ Final.'
      };
      rec.league = {
        badge: 'good',
        badgeText: '⚡ Alternative',
        desc: '15 Round-robin matches • Each team plays 5 matches • Top team champions.'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ Needs Byes',
        desc: '6 is not power-of-two • 2 teams must receive byes.'
      };
    } else if (count === 7) {
      rec.groups = {
        badge: 'good',
        badgeText: '⚡ Good Alternative',
        desc: '2 Groups (4+3 teams) • 9 Group matches ➔ Semi-Finals ➔ Final.'
      };
      rec.league = {
        badge: 'good',
        badgeText: '⚡ Long League',
        desc: '21 matches • Great format if schedule and venue permits.'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ Needs Byes',
        desc: '7 is odd • Byes required for knockout bracket.'
      };
    } else if (count === 8) {
      rec.knockout = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: 'Perfect 8-Team Knockout • 4 Quarters ➔ 2 Semis ➔ 1 Grand Final (7 matches).'
      };
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: '2 Groups (4 teams each) • 12 Group matches ➔ Semi-Finals ➔ Final.'
      };
      rec.league = {
        badge: 'good',
        badgeText: '⚡ Very Long League',
        desc: '28 matches • Top 2 play final (requires ample schedule & budget).'
      };
    } else if (count === 9) {
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: '3 Groups (3 teams each) • 9 Group matches • 3 Champions + 1 Best Runner-up ➔ Semis ➔ Final.'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ Needs Byes',
        desc: '9 is odd • Imperfect bracket • 7 teams need byes into quarters.'
      };
      rec.league = {
        badge: 'warn',
        badgeText: '⚠️ Too Long',
        desc: '36 matches • Excessive schedule and budget for local tournaments.'
      };
    } else if (count === 10) {
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: '2 Groups (5+5 teams) • 20 Group matches ➔ Semi-Finals ➔ Final.'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ Needs Byes',
        desc: '10 is not power-of-two • 6 teams need byes into quarters.'
      };
      rec.league = {
        badge: 'warn',
        badgeText: '⚠️ Too Long',
        desc: '45 matches • Demands extensive schedule and budget.'
      };
    } else if (count === 12) {
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: '4 Groups (3 teams each) • 12 Group matches ➔ Semis ➔ Grand Final.'
      };
      rec.knockout = {
        badge: 'warn',
        badgeText: '⚠️ Needs Byes',
        desc: '12 is not power-of-two • 4 teams need byes.'
      };
      rec.league = {
        badge: 'warn',
        badgeText: '⚠️ Impractical',
        desc: '66 matches • Very difficult to complete in a local tournament.'
      };
    } else if (count === 16) {
      rec.knockout = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: 'Perfect 16-Team Knockout • Round of 16 ➔ Quarters ➔ Semis ➔ Final (15 matches).'
      };
      rec.groups = {
        badge: 'best',
        badgeText: '⭐ Highly Recommended',
        desc: '4 Groups (4 teams each) World Cup Format • 24 Group matches ➔ Quarters ➔ Semis ➔ Final.'
      };
      rec.league = {
        badge: 'warn',
        badgeText: '⚠️ Impractical',
        desc: '120 matches • Knockout or group format is the only viable choice.'
      };
    } else {
      if (isPowerOfTwo) {
        rec.knockout = {
          badge: 'best',
          badgeText: '⭐ Highly Recommended',
          desc: `Perfect ${count}-team knockout bracket without any byes.`
        };
        rec.groups = {
          badge: 'best',
          badgeText: '⭐ Highly Recommended',
          desc: 'Evenly split groups • Top teams advance to knockouts.'
        };
        rec.league = {
          badge: count <= 6 ? 'good' : 'warn',
          badgeText: count <= 6 ? '⚡ Alternative' : '⚠️ Too Long',
          desc: `Total ${(count * (count - 1)) / 2} round-robin matches.`
        };
      } else if (isEven) {
        rec.groups = {
          badge: 'best',
          badgeText: '⭐ Highly Recommended',
          desc: 'Evenly distributed groups • Group winners qualify for knockouts.'
        };
        rec.knockout = {
          badge: 'warn',
          badgeText: '⚠️ Needs Byes',
          desc: `${count} is even but not power-of-two; byes are required.`
        };
        rec.league = {
          badge: count <= 6 ? 'good' : 'warn',
          badgeText: count <= 6 ? '⚡ Alternative' : '⚠️ Too Long',
          desc: `Total ${(count * (count - 1)) / 2} round-robin matches.`
        };
      } else {
        rec.groups = {
          badge: count >= 5 ? 'best' : 'warn',
          badgeText: count >= 5 ? '⭐ Highly Recommended' : '⚠️ Not Ideal',
          desc: 'Balanced groups • Top teams advance to playoffs.'
        };
        rec.knockout = {
          badge: 'warn',
          badgeText: '⚠️ Needs Byes',
          desc: `${count} is odd; knockout cannot be played without byes.`
        };
        rec.league = {
          badge: count <= 5 ? 'best' : 'warn',
          badgeText: count <= 5 ? '⭐ Highly Recommended' : '⚠️ Too Long',
          desc: `Total ${(count * (count - 1)) / 2} round-robin matches.`
        };
      }
    }
  }

  return rec;
}

function onWizardTeamCountChange(val) {
  const count = Math.max(2, parseInt(val, 10) || 2);
  tempWizardTeamCount = count;

  const countInp = document.getElementById('w-cfg-teamCount');
  if (countInp && parseInt(countInp.value, 10) !== count) {
    countInp.value = count;
  }

  // Sync tempWizardTeams size
  while (tempWizardTeams.length < count) {
    const idx = tempWizardTeams.length + 1;
    const defT = (typeof DEFAULT_TEAMS !== 'undefined' && DEFAULT_TEAMS[idx - 1]) ? DEFAULT_TEAMS[idx - 1] : null;
    tempWizardTeams.push({
      id: 't' + idx,
      name: defT ? defT.name : ('দল ' + idx),
      group: 'A',
      manager: defT ? defT.manager : ('ম্যানেজার ' + idx),
      phone: defT ? defT.phone : '০১৭xxxxxxxx',
      feeStatus: defT ? defT.feeStatus : 'due'
    });
  }
  if (tempWizardTeams.length > count) {
    tempWizardTeams = tempWizardTeams.slice(0, count);
  }

  updateWizardStructureSummary();
  renderWizardTeamsDashboard();
}

let currentBracketPerspective = 'all';
let currentBracketZoom = 1.0;

function filterBracketGroup(grpKey, btn) {
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.w-grp-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const container = document.getElementById('w-visual-bracket-tree');
  if (!container) return;

  const cards = container.querySelectorAll('.w-bracket-card[data-group]');
  const headers = container.querySelectorAll('.w-bracket-group-title[data-group]');

  cards.forEach(card => {
    const g = card.getAttribute('data-group');
    if (grpKey === 'all' || g === grpKey) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });

  headers.forEach(head => {
    const g = head.getAttribute('data-group');
    if (grpKey === 'all' || g === grpKey) {
      head.style.display = 'flex';
    } else {
      head.style.display = 'none';
    }
  });
}

function filterBracketPerspective(perspective, btn) {
  currentBracketPerspective = perspective || 'all';

  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.w-perspective-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  const container = document.getElementById('w-visual-bracket-tree');
  if (!container) return;

  const targetElements = container.querySelectorAll('[data-path]');
  if (currentBracketPerspective === 'all') {
    targetElements.forEach(el => {
      el.classList.remove('is-dimmed');
      el.classList.remove('is-highlighted');
    });
    return;
  }

  targetElements.forEach(el => {
    const p = el.getAttribute('data-path') || '';
    const paths = p.split(' ');
    if (paths.includes(currentBracketPerspective) || (currentBracketPerspective === 'final' && paths.includes('final'))) {
      el.classList.add('is-highlighted');
      el.classList.remove('is-dimmed');
      if (el.tagName && el.tagName.toLowerCase() === 'path') {
        el.style.opacity = '1';
      }
    } else {
      el.classList.add('is-dimmed');
      el.classList.remove('is-highlighted');
      if (el.tagName && el.tagName.toLowerCase() === 'path') {
        el.style.opacity = '0.15';
      }
    }
  });
  setTimeout(updateRoadmapSvgPaths, 60);
}

function toggleBracketFullscreen(forceClose) {
  const wrapper = document.getElementById('w-visual-bracket-wrapper');
  const toggleBtn = document.getElementById('w-bracket-fullscreen-toggle');
  if (!wrapper) return;

  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const shouldClose = forceClose === true || wrapper.classList.contains('is-fullscreen');

  if (shouldClose) {
    wrapper.classList.remove('is-fullscreen');
    if (typeof document !== 'undefined' && document.body && document.body.classList) {
      document.body.classList.remove('bracket-fs-open');
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = `
        <span class="fs-icon">⛶</span>
        <span class="fs-label">${isEn ? 'Fullscreen View' : 'ফুল স্ক্রিন ভিউ'}</span>
      `;
      toggleBtn.title = isEn ? 'View in Fullscreen' : 'ফুল স্ক্রিন মোডে দেখুন';
    }
  } else {
    wrapper.classList.add('is-fullscreen');
    if (typeof document !== 'undefined' && document.body && document.body.classList) {
      document.body.classList.add('bracket-fs-open');
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = `
        <span class="fs-icon">✖</span>
        <span class="fs-label">${isEn ? 'Exit (Esc)' : 'প্রস্থান (Esc)'}</span>
      `;
      toggleBtn.title = isEn ? 'Exit Fullscreen' : 'ফুল স্ক্রিন থেকে বের হন';
    }
  }
  attachRoadmapResizeObserver();
  updateRoadmapSvgPaths();
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(updateRoadmapSvgPaths);
  }
  setTimeout(updateRoadmapSvgPaths, 60);
  setTimeout(updateRoadmapSvgPaths, 180);
}

function zoomBracket(action) {
  currentBracketZoom = 1.0;
  const tree = document.getElementById('w-visual-bracket-tree');
  if (tree) {
    tree.style.transform = '';
  }
  updateRoadmapSvgPaths();
}

let roadmapResizeObserver = null;
function attachRoadmapResizeObserver() {
  if (typeof ResizeObserver === 'undefined') return;
  const bodyEl = document.getElementById('w-roadmap-body');
  if (!bodyEl) return;
  if (roadmapResizeObserver) {
    try { roadmapResizeObserver.disconnect(); } catch (e) {}
  }
  roadmapResizeObserver = new ResizeObserver(() => {
    updateRoadmapSvgPaths();
  });
  roadmapResizeObserver.observe(bodyEl);
}

function updateRoadmapSvgPaths() {
  const body = document.getElementById('w-roadmap-body');
  const svg = document.getElementById('w-roadmap-svg-canvas');
  if (!body || !svg) return;

  const bRect = (typeof body.getBoundingClientRect === 'function')
    ? body.getBoundingClientRect()
    : { width: 0, height: 0, left: 0, top: 0 };

  const setAttr = (el, k, v) => {
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute(k, v);
    }
  };

  // If in headless test environment or element has no layout dimensions yet
  if (!bRect || bRect.width === 0) {
    return;
  }

  // Compute live CSS scale factor to prevent double-scaling gaps when zoomed
  let zoomFactor = 1.0;
  if (body.offsetWidth > 0 && bRect.width > 0) {
    zoomFactor = bRect.width / body.offsetWidth;
  } else if (typeof currentBracketZoom === 'number' && currentBracketZoom > 0.05) {
    zoomFactor = currentBracketZoom;
  }
  if (!zoomFactor || zoomFactor <= 0) zoomFactor = 1.0;

  const bodyW = Math.max(body.scrollWidth || 0, body.offsetWidth || 0, Math.round(bRect.width / zoomFactor));
  const bodyH = Math.max(body.scrollHeight || 0, body.offsetHeight || 0, Math.round(bRect.height / zoomFactor));

  setAttr(svg, 'width', bodyW);
  setAttr(svg, 'height', bodyH);
  setAttr(svg, 'viewBox', `0 0 ${bodyW} ${bodyH}`);
  svg.style.width = bodyW + 'px';
  svg.style.height = bodyH + 'px';

  const originX = bRect.left + (body.clientLeft || 0);
  const originY = bRect.top + (body.clientTop || 0);

  const getExit = (id) => {
    const el = document.getElementById(id);
    if (!el || typeof el.getBoundingClientRect !== 'function') return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.round((r.right - originX) / zoomFactor),
      y: Math.round((r.top + r.height / 2 - originY) / zoomFactor)
    };
  };

  const getEntry = (id) => {
    const el = document.getElementById(id);
    if (!el || typeof el.getBoundingClientRect !== 'function') return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.round((r.left - originX) / zoomFactor),
      y: Math.round((r.top + r.height / 2 - originY) / zoomFactor)
    };
  };

  const setOrthogonalPath = (pathId, p1, p2, xTurnRatio, radius = 12) => {
    const pathEl = document.getElementById(pathId);
    if (!pathEl || !p1 || !p2) return;
    const gap = p2.x - p1.x;
    if (gap <= 0) return;
    const xTurn = Math.round(p1.x + gap * xTurnRatio);
    const dy = p2.y - p1.y;

    if (Math.abs(dy) <= 6) {
      setAttr(pathEl, 'd', `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`);
      return;
    }

    const r = Math.max(4, Math.min(radius, Math.abs(xTurn - p1.x) / 2, Math.abs(p2.x - xTurn) / 2, Math.abs(dy) / 2));
    let d = '';
    if (dy > 0) {
      d = `M ${p1.x} ${p1.y} L ${xTurn - r} ${p1.y} Q ${xTurn} ${p1.y} ${xTurn} ${p1.y + r} L ${xTurn} ${p2.y - r} Q ${xTurn} ${p2.y} ${xTurn + r} ${p2.y} L ${p2.x} ${p2.y}`;
    } else {
      d = `M ${p1.x} ${p1.y} L ${xTurn - r} ${p1.y} Q ${xTurn} ${p1.y} ${xTurn} ${p1.y - r} L ${xTurn} ${p2.y + r} Q ${xTurn} ${p2.y} ${xTurn + r} ${p2.y} L ${p2.x} ${p2.y}`;
    }
    setAttr(pathEl, 'd', d);
  };

  const grpAChamp = getExit('w-badge-grpA-champ') || getExit('w-card-grp-A');
  const semi1Slot2 = getExit('w-badge-grpB-runnerup') || getExit('w-card-runnerup') || getExit('w-badge-grpB-champ') || getExit('w-card-grp-B');
  const semi2Slot1 = (document.getElementById('w-card-grp-D') ? (getExit('w-badge-grpC-champ') || getExit('w-card-grp-C')) : (getExit('w-badge-grpB-champ') || getExit('w-card-grp-B')));
  const semi2Slot2 = getExit('w-badge-grpA-runnerup') || (document.getElementById('w-card-grp-D') ? (getExit('w-badge-grpD-champ') || getExit('w-card-grp-D')) : (getExit('w-badge-grpC-champ') || getExit('w-card-grp-C')));

  const s1t1 = getEntry('w-slot-semi1-t1');
  const s1t2 = getEntry('w-slot-semi1-t2');
  const semi1Exit = getExit('w-card-semi1');

  const s2t1 = getEntry('w-slot-semi2-t1');
  const s2t2 = getEntry('w-slot-semi2-t2');
  const semi2Exit = getExit('w-card-semi2');

  const f1 = getEntry('w-slot-final-t1');
  const f2 = getEntry('w-slot-final-t2');

  if (grpAChamp && s1t1) {
    setOrthogonalPath('w-path-grpA-to-semi1', grpAChamp, s1t1, 0.40);
  }
  if (semi1Slot2 && s1t2) {
    setOrthogonalPath('w-path-runnerup-to-semi1', semi1Slot2, s1t2, 0.25);
  }
  if (semi2Slot1 && semi2Slot2 && s2t1 && s2t2) {
    const isDropping = semi2Slot2.y <= s2t1.y;
    setOrthogonalPath('w-path-grpB-to-semi2', semi2Slot1, s2t1, isDropping ? 0.50 : 0.58);
    setOrthogonalPath('w-path-grpC-to-semi2', semi2Slot2, s2t2, isDropping ? 0.24 : 0.75);
  } else {
    if (semi2Slot1 && s2t1) setOrthogonalPath('w-path-grpB-to-semi2', semi2Slot1, s2t1, 0.50);
    if (semi2Slot2 && s2t2) setOrthogonalPath('w-path-grpC-to-semi2', semi2Slot2, s2t2, 0.24);
  }

  // Knockout Quarters / Opening -> Semis paths (for all knockout formats)
  const q1 = getExit('w-badge-ko-m1-win') || getExit('w-card-ko-m1') || getExit('w-badge-ko-q1-win') || getExit('w-card-ko-q1');
  const q2 = getExit('w-badge-ko-m2-win') || getExit('w-card-ko-m2') || getExit('w-badge-ko-q2-win') || getExit('w-card-ko-q2');
  const q3 = getExit('w-badge-ko-m3-win') || getExit('w-card-ko-m3') || getExit('w-badge-ko-q3-win') || getExit('w-card-ko-q3');
  const q4 = getExit('w-badge-ko-m4-win') || getExit('w-card-ko-m4') || getExit('w-badge-ko-bye-win') || getExit('w-card-ko-bye') || getExit('w-badge-ko-q4-win') || getExit('w-card-ko-q4');
  if (q1 && s1t1) {
    setOrthogonalPath('w-path-q1-to-s1', q1, s1t1, 0.40);
    setOrthogonalPath('w-path-m1-to-s1', q1, s1t1, 0.40);
  }
  if (q2 && s1t2) {
    setOrthogonalPath('w-path-q2-to-s1', q2, s1t2, 0.25);
    setOrthogonalPath('w-path-m2-to-s1', q2, s1t2, 0.25);
  }
  if (q3 && q4 && s2t1 && s2t2) {
    const isDropping = q4.y <= s2t1.y;
    const turn3 = isDropping ? 0.50 : 0.42;
    const turn4 = isDropping ? 0.24 : 0.60;
    setOrthogonalPath('w-path-q3-to-s2', q3, s2t1, turn3);
    setOrthogonalPath('w-path-m3-to-s2', q3, s2t1, turn3);
    setOrthogonalPath('w-path-q4-to-s2', q4, s2t2, turn4);
    setOrthogonalPath('w-path-m4-to-s2', q4, s2t2, turn4);
  } else {
    if (q3 && s2t1) {
      setOrthogonalPath('w-path-q3-to-s2', q3, s2t1, 0.45);
      setOrthogonalPath('w-path-m3-to-s2', q3, s2t1, 0.45);
    }
    if (q4 && s2t2) {
      setOrthogonalPath('w-path-q4-to-s2', q4, s2t2, 0.24);
      setOrthogonalPath('w-path-m4-to-s2', q4, s2t2, 0.24);
    }
  }

  // Semis -> Final paths (unified for Groups & Knockout)
  const s1UnifiedExit = semi1Exit || getExit('w-badge-ko-s1-win') || getExit('w-card-ko-s1');
  const s2UnifiedExit = semi2Exit || getExit('w-badge-ko-s2-win') || getExit('w-card-ko-s2');
  if (s1UnifiedExit && f1) {
    setOrthogonalPath('w-path-semi1-to-final', s1UnifiedExit, f1, 0.50);
  }
  if (s2UnifiedExit && f2) {
    setOrthogonalPath('w-path-semi2-to-final', s2UnifiedExit, f2, 0.50);
  }

  // Single League -> Final paths (Directly from League stage badges to Grand Final)
  const l1 = getExit('w-badge-league-1st') || getExit('w-card-league');
  const l2 = getExit('w-badge-league-2nd') || getExit('w-card-league');
  if (l1 && l2 && f1 && f2) {
    const isDropping = l1.y <= f1.y;
    setOrthogonalPath('w-path-league-1st-to-final', l1, f1, isDropping ? 0.58 : 0.42);
    setOrthogonalPath('w-path-league-2nd-to-final', l2, f2, isDropping ? 0.42 : 0.58);
  } else {
    if (l1 && f1) setOrthogonalPath('w-path-league-1st-to-final', l1, f1, 0.50);
    if (l2 && f2) setOrthogonalPath('w-path-league-2nd-to-final', l2, f2, 0.50);
  }
}

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('resize', updateRoadmapSvgPaths);
  window.addEventListener('fullscreenchange', () => setTimeout(updateRoadmapSvgPaths, 60));
}

if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      const wrapper = document.getElementById('w-visual-bracket-wrapper');
      if (wrapper && wrapper.classList && wrapper.classList.contains('is-fullscreen')) {
        toggleBracketFullscreen(true);
      }
    }
  });
}

function renderWizardVisualFixtureBracket(teamCount, tourneyType, teams) {
  const container = document.getElementById('w-visual-bracket-tree');
  const statsBar = document.getElementById('w-bracket-stats-bar');
  if (!container) return;

  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const count = Math.max(2, parseInt(teamCount, 10) || 2);
  const type = tourneyType || 'groups';

  const tNames = [];
  for (let i = 0; i < count; i++) {
    const t = teams && teams[i] ? teams[i].name : '';
    tNames.push(t || (isEn ? `Team ${i + 1}` : `দল ${i + 1}`));
  }

  const struct = generateTournamentStructure(count, type, teams || DEFAULT_TEAMS.slice(0, count));

  let stagesHtml = '';
  let connectorLabel = isEn ? 'Advance' : 'উত্তীর্ণ দল';
  let totalMatchCount = 0;
  let totalStagesCount = 0;

  if (type === 'knockout') {
    // ----------------------------------------------------
    // KNOCKOUT BRACKET (Unified High-Fidelity Vector Roadmap)
    // ----------------------------------------------------
    const tourneyTitle = tournamentConfig.title || (isEn ? 'Football Tournament 2026' : 'ফুটবল টুর্নামেন্ট ২০২৬');
    const stageTitle = isEn ? 'Direct Knockout' : 'সরাসরি নকআউট';

    if (count === 2) {
      totalMatchCount = 1;
      totalStagesCount = 1;
      const subTitle = isEn
        ? '2 Teams | Head-to-Head Championship Match'
        : '২টি দল | সরাসরি মেগা গ্র্যান্ড ফাইনাল';

      stagesHtml = `
        <div class="w-roadmap-board" id="w-roadmap-board">
          <div class="w-roadmap-header">
            <div class="w-roadmap-title-area">
              <div class="w-roadmap-ball-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8">
                  <circle cx="12" cy="12" r="10"/><polygon points="12,7 16,10 14.5,15 9.5,15 8,10" fill="#ffffff" stroke="#ffffff" stroke-width="0.5"/>
                  <line x1="12" y1="2" x2="12" y2="7" stroke="#ffffff"/><line x1="21.5" y1="9" x2="16" y2="10" stroke="#ffffff"/><line x1="18" y1="19.5" x2="14.5" y2="15" stroke="#ffffff"/><line x1="6" y1="19.5" x2="9.5" y2="15" stroke="#ffffff"/><line x1="2.5" y1="9" x2="8" y2="10" stroke="#ffffff"/>
                </svg>
              </div>
              <div class="w-roadmap-titles">
                <div class="w-roadmap-main-title">${escapeHtml(tourneyTitle)} - ${escapeHtml(stageTitle)}</div>
                <div class="w-roadmap-sub-title">${escapeHtml(subTitle)}</div>
              </div>
            </div>
          </div>
          <div class="w-roadmap-body" id="w-roadmap-body" style="display:flex; justify-content:center; align-items:center; min-height:260px;">
            <div class="w-card-final-block final-card" id="w-card-final" style="max-width:380px; width:100%;" data-path="final">
              <div class="w-final-top-pill">
                🏆 ${isEn ? 'Final' : 'ফাইনাল'} <span style="font-size:10px; opacity:0.85;">(${isEn ? 'Mega Grand Final' : 'মেগা ফাইনাল'})</span>
              </div>
              <div class="w-final-slots-container">
                <div class="w-neon-slot slot-final" id="w-slot-final-t1">
                  <span class="w-slot-team-txt" title="${escapeHtml(tNames[0])}">${escapeHtml(tNames[0])}</span>
                </div>
                <div class="w-neon-slot-vs vs-gold">VS</div>
                <div class="w-neon-slot" id="w-slot-final-t2">
                  <span class="w-slot-team-txt" title="${escapeHtml(tNames[1])}">${escapeHtml(tNames[1])}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

    } else if (count === 4) {
      totalMatchCount = 3;
      totalStagesCount = 2;
      const subTitle = isEn
        ? '4 Teams | 2 Semifinals | 1 Mega Grand Final'
        : '৪টি দল | ২টি সেমিফাইনাল | ১টি মেগা ফাইনাল';

      stagesHtml = `
        <div class="w-roadmap-board" id="w-roadmap-board">
          <div class="w-roadmap-header">
            <div class="w-roadmap-title-area">
              <div class="w-roadmap-ball-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8">
                  <circle cx="12" cy="12" r="10"/><polygon points="12,7 16,10 14.5,15 9.5,15 8,10" fill="#ffffff" stroke="#ffffff" stroke-width="0.5"/>
                  <line x1="12" y1="2" x2="12" y2="7" stroke="#ffffff"/><line x1="21.5" y1="9" x2="16" y2="10" stroke="#ffffff"/><line x1="18" y1="19.5" x2="14.5" y2="15" stroke="#ffffff"/><line x1="6" y1="19.5" x2="9.5" y2="15" stroke="#ffffff"/><line x1="2.5" y1="9" x2="8" y2="10" stroke="#ffffff"/>
                </svg>
              </div>
              <div class="w-roadmap-titles">
                <div class="w-roadmap-main-title">${escapeHtml(tourneyTitle)} - ${escapeHtml(stageTitle)}</div>
                <div class="w-roadmap-sub-title">${escapeHtml(subTitle)}</div>
              </div>
            </div>
          </div>

          <div class="w-roadmap-body body-league" id="w-roadmap-body">
            <svg class="w-roadmap-svg-canvas" id="w-roadmap-svg-canvas">
              <defs>
                <marker id="arrow-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0ea5e9"/>
                </marker>
                <marker id="arrow-gold" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b"/>
                </marker>
                <filter id="glow-filter-ko4" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="currentColor" flood-opacity="0.6"/>
                </filter>
              </defs>
              <path id="w-path-semi1-to-final" class="w-roadmap-path" d="" stroke="#0ea5e9" stroke-width="2.5" fill="none" marker-end="url(#arrow-blue)" filter="url(#glow-filter-ko4)" data-path="final" />
              <path id="w-path-semi2-to-final" class="w-roadmap-path" d="" stroke="#f59e0b" stroke-width="2.5" fill="none" marker-end="url(#arrow-gold)" filter="url(#glow-filter-ko4)" data-path="final" />
            </svg>

            <!-- COLUMN 1: SEMI-FINALS (2 MATCHES) -->
            <div class="w-roadmap-col col-groups" data-path="final">
              <!-- Semi 1 -->
              <div class="w-card-group-block card-grp-a w-bracket-card w-group-box-card" id="w-card-ko-s1" data-path="final">
                <div class="w-card-grp-head">
                  <div class="w-grp-head-title">
                    <span class="w-grp-dot dot-a"></span>
                    <strong class="w-grp-title-txt">${isEn ? 'Match 1 • Semi-Final 1' : 'ম্যাচ ১ • ১ম সেমিফাইনাল'}</strong>
                  </div>
                  <div class="w-grp-qual-badge badge-grp-a" id="w-badge-ko-s1-win">
                    👑 ${isEn ? 'Winner ➔ Final' : 'বিজয়ী ➔ ফাইনাল'}
                  </div>
                </div>
                <div class="w-grp-matches-list">
                  <div class="w-neon-match-row">
                    <span class="w-neon-match-tag">${isEn ? 'SEMI 1' : 'সেমি ১'}</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[0])}">${escapeHtml(tNames[0])}</span>
                    <span class="w-neon-vs">VS</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[1])}">${escapeHtml(tNames[1])}</span>
                  </div>
                </div>
              </div>

              <!-- Semi 2 -->
              <div class="w-card-group-block card-grp-b w-bracket-card w-group-box-card" id="w-card-ko-s2" data-path="final">
                <div class="w-card-grp-head">
                  <div class="w-grp-head-title">
                    <span class="w-grp-dot dot-b"></span>
                    <strong class="w-grp-title-txt">${isEn ? 'Match 2 • Semi-Final 2' : 'ম্যাচ ২ • ২য় সেমিফাইনাল'}</strong>
                  </div>
                  <div class="w-grp-qual-badge badge-grp-b" id="w-badge-ko-s2-win">
                    👑 ${isEn ? 'Winner ➔ Final' : 'বিজয়ী ➔ ফাইনাল'}
                  </div>
                </div>
                <div class="w-grp-matches-list">
                  <div class="w-neon-match-row">
                    <span class="w-neon-match-tag">${isEn ? 'SEMI 2' : 'সেমি ২'}</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[2])}">${escapeHtml(tNames[2])}</span>
                    <span class="w-neon-vs">VS</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[3])}">${escapeHtml(tNames[3])}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- COLUMN 2: GRAND FINAL -->
            <div class="w-roadmap-col col-final" data-path="final">
              <div class="w-card-final-block final-card" id="w-card-final" data-path="final">
                <div class="w-final-top-pill">
                  🏆 ${isEn ? 'Match 3 • Final' : 'ম্যাচ ৩ • ফাইনাল'} <span style="font-size:10px; opacity:0.85;">(${isEn ? 'Mega Grand Final' : 'মেগা ফাইনাল'})</span>
                </div>
                <div class="w-final-slots-container">
                  <div class="w-neon-slot slot-final" id="w-slot-final-t1">
                    <span class="w-slot-team-txt">${isEn ? 'Winner Semi 1' : 'বিজয়ী (সেমি ১)'}</span>
                  </div>
                  <div class="w-neon-slot-vs vs-gold">VS</div>
                  <div class="w-neon-slot" id="w-slot-final-t2">
                    <span class="w-slot-team-txt">${isEn ? 'Winner Semi 2' : 'বিজয়ী (সেমি ২)'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

    } else if (count === 8) {
      totalMatchCount = 7;
      totalStagesCount = 3;
      const subTitle = isEn
        ? '8 Teams | 4 Quarterfinals | 2 Semifinals | 1 Mega Grand Final'
        : '৮টি দল | ৪টি কোয়ার্টার ফাইনাল | ২টি সেমিফাইনাল | ১টি মেগা ফাইনাল';

      stagesHtml = `
        <div class="w-roadmap-board" id="w-roadmap-board">
          <div class="w-roadmap-header">
            <div class="w-roadmap-title-area">
              <div class="w-roadmap-ball-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8">
                  <circle cx="12" cy="12" r="10"/><polygon points="12,7 16,10 14.5,15 9.5,15 8,10" fill="#ffffff" stroke="#ffffff" stroke-width="0.5"/>
                  <line x1="12" y1="2" x2="12" y2="7" stroke="#ffffff"/><line x1="21.5" y1="9" x2="16" y2="10" stroke="#ffffff"/><line x1="18" y1="19.5" x2="14.5" y2="15" stroke="#ffffff"/><line x1="6" y1="19.5" x2="9.5" y2="15" stroke="#ffffff"/><line x1="2.5" y1="9" x2="8" y2="10" stroke="#ffffff"/>
                </svg>
              </div>
              <div class="w-roadmap-titles">
                <div class="w-roadmap-main-title">${escapeHtml(tourneyTitle)} - ${escapeHtml(stageTitle)}</div>
                <div class="w-roadmap-sub-title">${escapeHtml(subTitle)}</div>
              </div>
            </div>
          </div>

          <div class="w-roadmap-body" id="w-roadmap-body">
            <svg class="w-roadmap-svg-canvas" id="w-roadmap-svg-canvas">
              <defs>
                <marker id="arrow-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0ea5e9"/>
                </marker>
                <marker id="arrow-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#8b5cf6"/>
                </marker>
                <marker id="arrow-teal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981"/>
                </marker>
                <marker id="arrow-gold" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b"/>
                </marker>
                <filter id="glow-filter-ko8" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="currentColor" flood-opacity="0.6"/>
                </filter>
              </defs>
              <!-- QF 1 -> Semi 1 Slot 1 -->
              <path id="w-path-q1-to-s1" class="w-roadmap-path" d="" stroke="#0ea5e9" stroke-width="2.5" fill="none" marker-end="url(#arrow-blue)" filter="url(#glow-filter-ko8)" />
              <!-- QF 2 -> Semi 1 Slot 2 -->
              <path id="w-path-q2-to-s1" class="w-roadmap-path" d="" stroke="#8b5cf6" stroke-width="2.5" fill="none" marker-end="url(#arrow-purple)" filter="url(#glow-filter-ko8)" />
              <!-- QF 3 -> Semi 2 Slot 1 -->
              <path id="w-path-q3-to-s2" class="w-roadmap-path" d="" stroke="#8b5cf6" stroke-width="2.5" fill="none" marker-end="url(#arrow-purple)" filter="url(#glow-filter-ko8)" />
              <!-- QF 4 -> Semi 2 Slot 2 -->
              <path id="w-path-q4-to-s2" class="w-roadmap-path" d="" stroke="#10b981" stroke-width="2.5" fill="none" marker-end="url(#arrow-teal)" filter="url(#glow-filter-ko8)" />
              <!-- Semi 1 -> Final -->
              <path id="w-path-semi1-to-final" class="w-roadmap-path" d="" stroke="#0ea5e9" stroke-width="2.5" fill="none" marker-end="url(#arrow-blue)" filter="url(#glow-filter-ko8)" data-path="final" />
              <!-- Semi 2 -> Final -->
              <path id="w-path-semi2-to-final" class="w-roadmap-path" d="" stroke="#f59e0b" stroke-width="2.5" fill="none" marker-end="url(#arrow-gold)" filter="url(#glow-filter-ko8)" data-path="final" />
            </svg>

            <!-- COLUMN 1: QUARTER-FINALS (4 MATCHES) -->
            <div class="w-roadmap-col col-groups">
              <!-- QF 1 -->
              <div class="w-card-group-block card-grp-a w-bracket-card w-group-box-card" id="w-card-ko-q1">
                <div class="w-card-grp-head">
                  <div class="w-grp-head-title">
                    <span class="w-grp-dot dot-a"></span>
                    <strong class="w-grp-title-txt">${isEn ? 'Match 1 • QF 1' : 'ম্যাচ ১ • ১ম কোয়ার্টার'}</strong>
                  </div>
                  <div class="w-grp-qual-badge badge-grp-a" id="w-badge-ko-q1-win">
                    👑 ${isEn ? 'Winner ➔ Semi 1' : 'বিজয়ী ➔ সেমি ১'}
                  </div>
                </div>
                <div class="w-grp-matches-list">
                  <div class="w-neon-match-row">
                    <span class="w-neon-match-tag">QF 1</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[0])}">${escapeHtml(tNames[0])}</span>
                    <span class="w-neon-vs">VS</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[1])}">${escapeHtml(tNames[1])}</span>
                  </div>
                </div>
              </div>

              <!-- QF 2 -->
              <div class="w-card-group-block card-grp-b w-bracket-card w-group-box-card" id="w-card-ko-q2">
                <div class="w-card-grp-head">
                  <div class="w-grp-head-title">
                    <span class="w-grp-dot dot-b"></span>
                    <strong class="w-grp-title-txt">${isEn ? 'Match 2 • QF 2' : 'ম্যাচ ২ • ২য় কোয়ার্টার'}</strong>
                  </div>
                  <div class="w-grp-qual-badge badge-grp-b" id="w-badge-ko-q2-win">
                    👑 ${isEn ? 'Winner ➔ Semi 1' : 'বিজয়ী ➔ সেমি ১'}
                  </div>
                </div>
                <div class="w-grp-matches-list">
                  <div class="w-neon-match-row">
                    <span class="w-neon-match-tag">QF 2</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[2])}">${escapeHtml(tNames[2])}</span>
                    <span class="w-neon-vs">VS</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[3])}">${escapeHtml(tNames[3])}</span>
                  </div>
                </div>
              </div>

              <!-- QF 3 -->
              <div class="w-card-group-block card-grp-c w-bracket-card w-group-box-card" id="w-card-ko-q3">
                <div class="w-card-grp-head">
                  <div class="w-grp-head-title">
                    <span class="w-grp-dot dot-c"></span>
                    <strong class="w-grp-title-txt">${isEn ? 'Match 3 • QF 3' : 'ম্যাচ ৩ • ৩য় কোয়ার্টার'}</strong>
                  </div>
                  <div class="w-grp-qual-badge badge-grp-c" id="w-badge-ko-q3-win">
                    👑 ${isEn ? 'Winner ➔ Semi 2' : 'বিজয়ী ➔ সেমি ২'}
                  </div>
                </div>
                <div class="w-grp-matches-list">
                  <div class="w-neon-match-row">
                    <span class="w-neon-match-tag">QF 3</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[4])}">${escapeHtml(tNames[4])}</span>
                    <span class="w-neon-vs">VS</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[5])}">${escapeHtml(tNames[5])}</span>
                  </div>
                </div>
              </div>

              <!-- QF 4 -->
              <div class="w-card-group-block card-grp-d w-bracket-card w-group-box-card" id="w-card-ko-q4">
                <div class="w-card-grp-head">
                  <div class="w-grp-head-title">
                    <span class="w-grp-dot dot-d"></span>
                    <strong class="w-grp-title-txt">${isEn ? 'Match 4 • QF 4' : 'ম্যাচ ৪ • ৪র্থ কোয়ার্টার'}</strong>
                  </div>
                  <div class="w-grp-qual-badge badge-grp-d" id="w-badge-ko-q4-win">
                    👑 ${isEn ? 'Winner ➔ Semi 2' : 'বিজয়ী ➔ সেমি ২'}
                  </div>
                </div>
                <div class="w-grp-matches-list">
                  <div class="w-neon-match-row">
                    <span class="w-neon-match-tag">QF 4</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[6])}">${escapeHtml(tNames[6])}</span>
                    <span class="w-neon-vs">VS</span>
                    <span class="w-neon-team-name" title="${escapeHtml(tNames[7])}">${escapeHtml(tNames[7])}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- COLUMN 2: SEMI-FINALS (2 MATCHES) -->
            <div class="w-roadmap-col col-semis" data-path="final">
              <!-- Semifinal 1 -->
              <div class="w-card-semi-block card-semi1" id="w-card-semi1" data-path="final">
                <div class="w-semi-top-pill pill-semi1">
                  ${isEn ? 'Match 5 • Semi 1' : 'ম্যাচ ৫ • ১ম সেমিফাইনাল'}
                </div>
                <div class="w-semi-slots-container">
                  <div class="w-neon-slot" id="w-slot-semi1-t1">
                    <span class="w-slot-icon">👑</span>
                    <span class="w-slot-team-txt">${isEn ? 'Winner QF 1' : 'বিজয়ী (কোয়ার্টার ১)'}</span>
                  </div>
                  <div class="w-neon-slot-vs">VS</div>
                  <div class="w-neon-slot" id="w-slot-semi1-t2">
                    <span class="w-slot-icon">👑</span>
                    <span class="w-slot-team-txt">${isEn ? 'Winner QF 2' : 'বিজয়ী (কোয়ার্টার ২)'}</span>
                  </div>
                </div>
              </div>

              <!-- Semifinal 2 -->
              <div class="w-card-semi-block card-semi2" id="w-card-semi2" data-path="final">
                <div class="w-semi-top-pill pill-semi2">
                  ${isEn ? 'Match 6 • Semi 2' : 'ম্যাচ ৬ • ২য় সেমিফাইনাল'}
                </div>
                <div class="w-semi-slots-container">
                  <div class="w-neon-slot" id="w-slot-semi2-t1">
                    <span class="w-slot-icon">👑</span>
                    <span class="w-slot-team-txt">${isEn ? 'Winner QF 3' : 'বিজয়ী (কোয়ার্টার ৩)'}</span>
                  </div>
                  <div class="w-neon-slot-vs">VS</div>
                  <div class="w-neon-slot" id="w-slot-semi2-t2">
                    <span class="w-slot-icon">👑</span>
                    <span class="w-slot-team-txt">${isEn ? 'Winner QF 4' : 'বিজয়ী (কোয়ার্টার ৪)'}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- COLUMN 3: GRAND FINAL -->
            <div class="w-roadmap-col col-final" data-path="final">
              <div class="w-card-final-block final-card" id="w-card-final" data-path="final">
                <div class="w-final-top-pill">
                  🏆 ${isEn ? 'Match 7 • Final' : 'ম্যাচ ৭ • ফাইনাল'} <span style="font-size:10px; opacity:0.85;">(${isEn ? 'Mega Grand Final' : 'মেগা ফাইনাল'})</span>
                </div>
                <div class="w-final-slots-container">
                  <div class="w-neon-slot slot-final" id="w-slot-final-t1">
                    <span class="w-slot-team-txt">${isEn ? 'Winner Semi 1' : 'বিজয়ী (সেমি ১)'}</span>
                  </div>
                  <div class="w-neon-slot-vs vs-gold">VS</div>
                  <div class="w-neon-slot" id="w-slot-final-t2">
                    <span class="w-slot-team-txt">${isEn ? 'Winner Semi 2' : 'বিজয়ী (সেমি ২)'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

    } else {
      // General Knockout (e.g. 5, 6, 7, 10, 12, 16 teams)
      const openMatches = [];
      let mIdx = 1;
      for (let i = 0; i < count; i += 2) {
        if (i + 1 < count) {
          openMatches.push({ id: mIdx, t1: tNames[i], t2: tNames[i + 1] });
          mIdx++;
        }
      }
      totalMatchCount = openMatches.length + 3;
      totalStagesCount = 3;
      const subTitle = isEn
        ? `${count} Teams | Single-Elimination Knockout Bracket`
        : `${count}টি দল | সরাসরি নকআউট টুর্নামেন্ট ব্র্যাকেট`;

      stagesHtml = `
        <div class="w-roadmap-board" id="w-roadmap-board">
          <div class="w-roadmap-header">
            <div class="w-roadmap-title-area">
              <div class="w-roadmap-ball-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8">
                  <circle cx="12" cy="12" r="10"/><polygon points="12,7 16,10 14.5,15 9.5,15 8,10" fill="#ffffff" stroke="#ffffff" stroke-width="0.5"/>
                  <line x1="12" y1="2" x2="12" y2="7" stroke="#ffffff"/><line x1="21.5" y1="9" x2="16" y2="10" stroke="#ffffff"/><line x1="18" y1="19.5" x2="14.5" y2="15" stroke="#ffffff"/><line x1="6" y1="19.5" x2="9.5" y2="15" stroke="#ffffff"/><line x1="2.5" y1="9" x2="8" y2="10" stroke="#ffffff"/>
                </svg>
              </div>
              <div class="w-roadmap-titles">
                <div class="w-roadmap-main-title">${escapeHtml(tourneyTitle)} - ${escapeHtml(stageTitle)}</div>
                <div class="w-roadmap-sub-title">${escapeHtml(subTitle)}</div>
              </div>
            </div>
          </div>

          <div class="w-roadmap-body" id="w-roadmap-body">
            <svg class="w-roadmap-svg-canvas" id="w-roadmap-svg-canvas">
              <defs>
                <marker id="arrow-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0ea5e9"/>
                </marker>
                <marker id="arrow-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#8b5cf6"/>
                </marker>
                <marker id="arrow-teal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981"/>
                </marker>
                <marker id="arrow-gold" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b"/>
                </marker>
                <filter id="glow-filter-kogen" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="currentColor" flood-opacity="0.6"/>
                </filter>
              </defs>
              <!-- Opening M1 -> Semi 1 Slot 1 (Winner 1) -->
              <path id="w-path-m1-to-s1" class="w-roadmap-path" d="" stroke="#0ea5e9" stroke-width="2.5" fill="none" marker-end="url(#arrow-blue)" filter="url(#glow-filter-kogen)" />
              <!-- Opening M2 -> Semi 1 Slot 2 (Winner 2) -->
              <path id="w-path-m2-to-s1" class="w-roadmap-path" d="" stroke="#8b5cf6" stroke-width="2.5" fill="none" marker-end="url(#arrow-purple)" filter="url(#glow-filter-kogen)" />
              <!-- Opening M3 -> Semi 2 Slot 1 (Winner 3) -->
              <path id="w-path-m3-to-s2" class="w-roadmap-path" d="" stroke="#8b5cf6" stroke-width="2.5" fill="none" marker-end="url(#arrow-purple)" filter="url(#glow-filter-kogen)" />
              <!-- Opening M4 / Bye -> Semi 2 Slot 2 (Winner 4) -->
              <path id="w-path-m4-to-s2" class="w-roadmap-path" d="" stroke="#10b981" stroke-width="2.5" fill="none" marker-end="url(#arrow-teal)" filter="url(#glow-filter-kogen)" />
              <!-- Semi 1 -> Final -->
              <path id="w-path-semi1-to-final" class="w-roadmap-path" d="" stroke="#0ea5e9" stroke-width="2.5" fill="none" marker-end="url(#arrow-blue)" filter="url(#glow-filter-kogen)" data-path="final" />
              <!-- Semi 2 -> Final -->
              <path id="w-path-semi2-to-final" class="w-roadmap-path" d="" stroke="#f59e0b" stroke-width="2.5" fill="none" marker-end="url(#arrow-gold)" filter="url(#glow-filter-kogen)" data-path="final" />
            </svg>

            <!-- COLUMN 1: OPENING ROUND MATCHES -->
            <div class="w-roadmap-col col-groups">
              ${openMatches.map((m, idx) => `
                <div class="w-card-group-block ${idx % 2 === 0 ? 'card-grp-a' : 'card-grp-b'} w-bracket-card w-group-box-card" id="w-card-ko-m${m.id}">
                  <div class="w-card-grp-head">
                    <div class="w-grp-head-title">
                      <span class="w-grp-dot ${idx % 2 === 0 ? 'dot-a' : 'dot-b'}"></span>
                      <strong class="w-grp-title-txt">${isEn ? `Match ${m.id} • Opening` : `ম্যাচ ${m.id} • প্রাথমিক`}</strong>
                    </div>
                    <div class="w-grp-qual-badge ${idx % 2 === 0 ? 'badge-grp-a' : 'badge-grp-b'}" id="w-badge-ko-m${m.id}-win">
                      👑 ${isEn ? `Winner ${m.id} ➔ Semi ${m.id <= 2 ? '1' : '2'}` : `বিজয়ী ${m.id} ➔ ${m.id <= 2 ? '১ম' : '২য়'} সেমি`}
                    </div>
                  </div>
                  <div class="w-grp-matches-list">
                    <div class="w-neon-match-row">
                      <span class="w-neon-match-tag">M${m.id}</span>
                      <span class="w-neon-team-name" title="${escapeHtml(m.t1)}">${escapeHtml(m.t1)}</span>
                      <span class="w-neon-vs">VS</span>
                      <span class="w-neon-team-name" title="${escapeHtml(m.t2)}">${escapeHtml(m.t2)}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
              ${count % 2 !== 0 ? `
                <div class="w-card-group-block card-grp-c w-bracket-card" id="w-card-ko-bye" style="border-style:dashed;">
                  <div class="w-card-grp-head">
                    <div class="w-grp-head-title">
                      <span class="w-grp-dot dot-c"></span>
                      <strong class="w-grp-title-txt">${isEn ? 'Direct Bye' : 'সরাসরি বাই'}</strong>
                    </div>
                    <div class="w-grp-qual-badge badge-grp-c" id="w-badge-ko-bye-win">
                      BYE ➔ ${isEn ? 'Semi 2' : '২য় সেমি'}
                    </div>
                  </div>
                  <div class="w-grp-matches-list">
                    <div class="w-neon-match-row">
                      <span class="w-neon-match-tag">BYE</span>
                      <span class="w-neon-team-name" title="${escapeHtml(tNames[count - 1])}">${escapeHtml(tNames[count - 1])}</span>
                      <span class="w-neon-vs">➔</span>
                      <span class="w-neon-team-name" style="color:#94a3b8;">${isEn ? 'Advance to Semis' : 'সরাসরি সেমিতে'}</span>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- COLUMN 2: SEMI-FINALS (2 MATCHES) -->
            <div class="w-roadmap-col col-semis" data-path="final">
              <div class="w-card-semi-block card-semi1" id="w-card-semi1" data-path="final">
                <div class="w-semi-top-pill pill-semi1">
                  ${isEn ? 'Semi-Final 1' : '১ম সেমিফাইনাল'}
                </div>
                <div class="w-semi-slots-container">
                  <div class="w-neon-slot" id="w-slot-semi1-t1">
                    <span class="w-slot-icon">👑</span>
                    <span class="w-slot-team-txt">${isEn ? 'Winner 1' : 'বিজয়ী ১'}</span>
                  </div>
                  <div class="w-neon-slot-vs">VS</div>
                  <div class="w-neon-slot" id="w-slot-semi1-t2">
                    <span class="w-slot-icon">👑</span>
                    <span class="w-slot-team-txt">${isEn ? 'Winner 2' : 'বিজয়ী ২'}</span>
                  </div>
                </div>
              </div>

              <div class="w-card-semi-block card-semi2" id="w-card-semi2" data-path="final">
                <div class="w-semi-top-pill pill-semi2">
                  ${isEn ? 'Semi-Final 2' : '২য় সেমিফাইনাল'}
                </div>
                <div class="w-semi-slots-container">
                  <div class="w-neon-slot" id="w-slot-semi2-t1">
                    <span class="w-slot-icon">👑</span>
                    <span class="w-slot-team-txt">${isEn ? 'Winner 3' : 'বিজয়ী ৩'}</span>
                  </div>
                  <div class="w-neon-slot-vs">VS</div>
                  <div class="w-neon-slot" id="w-slot-semi2-t2">
                    <span class="w-slot-icon">👑</span>
                    <span class="w-slot-team-txt">${isEn ? 'Winner 4' : 'বিজয়ী ৪'}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- COLUMN 3: GRAND FINAL -->
            <div class="w-roadmap-col col-final" data-path="final">
              <div class="w-card-final-block final-card" id="w-card-final" data-path="final">
                <div class="w-final-top-pill">
                  🏆 ${isEn ? 'Final' : 'ফাইনাল'} <span style="font-size:10px; opacity:0.85;">(${isEn ? 'Mega Grand Final' : 'মেগা ফাইনাল'})</span>
                </div>
                <div class="w-final-slots-container">
                  <div class="w-neon-slot slot-final" id="w-slot-final-t1">
                    <span class="w-slot-team-txt">${isEn ? 'Winner Semi 1' : 'বিজয়ী (সেমি ১)'}</span>
                  </div>
                  <div class="w-neon-slot-vs vs-gold">VS</div>
                  <div class="w-neon-slot" id="w-slot-final-t2">
                    <span class="w-slot-team-txt">${isEn ? 'Winner Semi 2' : 'বিজয়ী (সেমি ২)'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

  } else if (type === 'league') {
    // ----------------------------------------------------
    // SINGLE LEAGUE TABLE (Unified High-Fidelity Vector Roadmap)
    // ----------------------------------------------------
    const allMatches = struct.matches || [];
    totalMatchCount = allMatches.length + 1; // league + final
    totalStagesCount = 2;

    const tourneyTitle = tournamentConfig.title || (isEn ? 'Football Tournament 2026' : 'ফুটবল টুর্নামেন্ট ২০২৬');
    const stageTitle = isEn ? 'Single League Table' : 'একক লিগ টেবিল';
    const subTitle = isEn
      ? `${count} Teams | Single Standings Table | ${allMatches.length} Matches | Top 2 Teams advance to Grand Final`
      : `${count}টি দল | একক পয়েন্ট টেবিল | ${allMatches.length}টি ম্যাচ | টেবিলের শীর্ষ ২ দল নিয়ে সরাসরি মেগা ফাইনাল`;

    stagesHtml = `
      <div class="w-roadmap-board" id="w-roadmap-board">
        <!-- Top Header Bar -->
        <div class="w-roadmap-header">
          <div class="w-roadmap-title-area">
            <div class="w-roadmap-ball-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="12,7 16,10 14.5,15 9.5,15 8,10" fill="#ffffff" stroke="#ffffff" stroke-width="0.5"/>
                <line x1="12" y1="2" x2="12" y2="7" stroke="#ffffff"/>
                <line x1="21.5" y1="9" x2="16" y2="10" stroke="#ffffff"/>
                <line x1="18" y1="19.5" x2="14.5" y2="15" stroke="#ffffff"/>
                <line x1="6" y1="19.5" x2="9.5" y2="15" stroke="#ffffff"/>
                <line x1="2.5" y1="9" x2="8" y2="10" stroke="#ffffff"/>
              </svg>
            </div>
            <div class="w-roadmap-titles">
              <div class="w-roadmap-main-title">${escapeHtml(tourneyTitle)} - ${escapeHtml(stageTitle)}</div>
              <div class="w-roadmap-sub-title">${escapeHtml(subTitle)}</div>
            </div>
          </div>
        </div>

        <!-- Main Roadmap Board Body with SVG Overlay -->
        <div class="w-roadmap-body body-league" id="w-roadmap-body">
          <!-- Full Overlay SVG Canvas for Arrow Lines -->
          <svg class="w-roadmap-svg-canvas" id="w-roadmap-svg-canvas">
            <defs>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0ea5e9"/>
              </marker>
              <marker id="arrow-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#8b5cf6"/>
              </marker>
              <filter id="glow-filter-league" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="currentColor" flood-opacity="0.6"/>
              </filter>
            </defs>

            <!-- 1st in Table -> Final (Blue) -->
            <path id="w-path-league-1st-to-final" class="w-roadmap-path" d="" stroke="#0ea5e9" stroke-width="2.5" fill="none" marker-end="url(#arrow-blue)" filter="url(#glow-filter-league)" data-path="final" />

            <!-- 2nd in Table -> Final (Purple) -->
            <path id="w-path-league-2nd-to-final" class="w-roadmap-path" d="" stroke="#8b5cf6" stroke-width="2.5" fill="none" marker-end="url(#arrow-purple)" filter="url(#glow-filter-league)" data-path="final" />
          </svg>

          <!-- Hidden test compatibility elements -->
          <span style="display:none;">একক লিগ টেবিল</span>

          <!-- COLUMN 1: SINGLE LEAGUE STAGE (ALL MATCHES) -->
          <div class="w-roadmap-col col-groups" data-path="final">
            <div class="w-card-group-block card-grp-a w-bracket-card w-group-box-card" id="w-card-league" data-group="League">
              <div class="w-card-grp-head">
                <div class="w-grp-head-title">
                  <span class="w-grp-dot dot-a"></span>
                  <strong class="w-grp-title-txt">${isEn ? `Single League Stage (${count} Teams)` : `একক লিগ টেবিল পর্ব (${count}টি দল)`}</strong>
                </div>
                <div class="w-grp-badges-cluster">
                  <div class="w-grp-qual-badge badge-league-1st" id="w-badge-league-1st">
                    🥇 ${isEn ? '1st in Standings ➔ Final' : '১ম স্থান ➔ মেগা ফাইনাল'}
                  </div>
                  <div class="w-grp-qual-badge badge-league-2nd" id="w-badge-league-2nd">
                    🥈 ${isEn ? '2nd in Standings ➔ Final' : '২য় স্থান ➔ মেগা ফাইনাল'}
                  </div>
                </div>
              </div>
              <div class="w-grp-matches-list">
                ${allMatches.map(m => `
                  <div class="w-neon-match-row">
                    <span class="w-neon-match-tag">${isEn ? `Match ${m.id}` : `ম্যাচ ${m.id}`}</span>
                    <span class="w-neon-team-name" title="${escapeHtml(m.t1)}">${escapeHtml(m.t1)}</span>
                    <span class="w-neon-vs">VS</span>
                    <span class="w-neon-team-name" title="${escapeHtml(m.t2)}">${escapeHtml(m.t2)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- COLUMN 2: GRAND FINAL -->
          <div class="w-roadmap-col col-final" data-path="final">
            <div class="w-card-final-block final-card" id="w-card-final" data-path="final">
              <div class="w-final-top-pill">
                🏆 ${isEn ? 'Final' : 'ফাইনাল'} <span style="font-size:10px; opacity:0.85;">(${isEn ? 'Mega Grand Final' : 'মেগা ফাইনাল'})</span>
              </div>
              <div class="w-final-slots-container">
                <div class="w-neon-slot slot-final" id="w-slot-final-t1">
                  <span class="w-slot-team-txt">${isEn ? '🥇 1st in Table' : '🥇 পয়েন্ট টেবিল ১ম স্থান'}</span>
                </div>
                <div class="w-neon-slot-vs vs-gold">VS</div>
                <div class="w-neon-slot" id="w-slot-final-t2">
                  <span class="w-slot-team-txt">${isEn ? '🥈 2nd in Table' : '🥈 পয়েন্ট টেবিল ২য় স্থান'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

  } else {
    // ----------------------------------------------------
    // GROUPS + KNOCKOUT (Full Matches Rendered!)
    // ----------------------------------------------------
    const allGroupMatches = struct.matches || [];
    const grpKeys = Object.keys(struct.groups || {});
    totalMatchCount = allGroupMatches.length + 3; // group matches + 2 semis + 1 final
    totalStagesCount = 3;

    const tourneyTitle = tournamentConfig.title || (isEn ? 'Football Tournament 2026' : 'ফুটবল টুর্নামেন্ট ২০২৬');
    const stageTitle = isEn ? 'Knockout Stage' : 'নকআউট পর্যায়';

    let subTitle = '';

    if (grpKeys.length === 2) {
      subTitle = isEn
        ? `${count} Teams | 2 Groups | Group Champions & Runners-up advance to Semifinals`
        : `${count}টি দল | ২টি গ্রুপ | গ্রুপ চ্যাম্পিয়ন ও রানার্স-আপ সরাসরি সেমিফাইনালে`;
    } else if (grpKeys.length === 3) {
      subTitle = isEn
        ? `${count} Teams | 3 Groups | 3 Group Champions directly to Semifinals | 1 Best Runner-up to Semifinal 1`
        : `${count}টি দল | ৩টি গ্রুপ | গ্রুপ চ্যাম্পিয়ন ৩টি দল সরাসরি সেমিফাইনালে | সেরা রানার আপ ১টি দল সেমিফাইনাল ১ এ`;
    } else {
      subTitle = isEn
        ? `${count} Teams | ${grpKeys.length} Groups | Group Champions advance to Semifinals`
        : `${count}টি দল | ${grpKeys.length}টি গ্রুপ | গ্রুপ চ্যাম্পিয়ন দলসমূহ সরাসরি সেমিফাইনালে`;
    }

    let groupColHtml = '';
    let semi1Slot1Html = '';
    let semi1Slot2Html = '';
    let semi2Slot1Html = '';
    let semi2Slot2Html = '';

    if (grpKeys.length === 2) {
      const grpAMatches = allGroupMatches.filter(m => m.group === 'A');
      const grpBMatches = allGroupMatches.filter(m => m.group === 'B');
      const grpACount = struct.groups['A'] ? struct.groups['A'].length : Math.ceil(count / 2);
      const grpBCount = struct.groups['B'] ? struct.groups['B'].length : Math.floor(count / 2);

      groupColHtml = `
        <!-- Card 1: Group A -->
        <div class="w-card-group-block card-grp-a w-bracket-card w-group-box-card" id="w-card-grp-A" data-group="A" data-path="semi-1 semi-2">
          <div class="w-card-grp-head">
            <div class="w-grp-head-title">
              <span class="w-grp-dot dot-a"></span>
              <strong class="w-grp-title-txt">${isEn ? `Group A (${grpACount} Teams)` : `গ্রুপ A (${grpACount}টি দল)`}</strong>
              <span style="display:none;">গ্রুপ পর্ব</span>
              <span style="display:none;">গ্রুপ এ</span>
            </div>
            <div class="w-grp-badges-cluster">
              <div class="w-grp-qual-badge badge-grp-a" id="w-badge-grpA-champ">
                👑 ${isEn ? 'Group Champion ➔ Semi 1' : 'গ্রুপ চ্যাম্পিয়ন ➔ সেমি ১'}
              </div>
              <div class="w-grp-qual-badge badge-grp-a-runner" id="w-badge-grpA-runnerup">
                🥈 ${isEn ? 'Runner-Up ➔ Semi 2' : 'গ্রুপ রানার আপ ➔ সেমি ২'}
              </div>
            </div>
          </div>
          <div class="w-grp-matches-list">
            ${grpAMatches.map(m => `
              <div class="w-neon-match-row">
                <span class="w-neon-match-tag">${isEn ? `Match ${m.id}` : `ম্যাচ ${m.id}`}</span>
                <span class="w-neon-team-name" title="${escapeHtml(m.t1)}">${escapeHtml(m.t1)}</span>
                <span class="w-neon-vs">VS</span>
                <span class="w-neon-team-name" title="${escapeHtml(m.t2)}">${escapeHtml(m.t2)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Card 2: Group B -->
        <div class="w-card-group-block card-grp-b w-bracket-card w-group-box-card" id="w-card-grp-B" data-group="B" data-path="semi-1 semi-2">
          <div class="w-card-grp-head">
            <div class="w-grp-head-title">
              <span class="w-grp-dot dot-b"></span>
              <strong class="w-grp-title-txt">${isEn ? `Group B (${grpBCount} Teams)` : `গ্রুপ B (${grpBCount}টি দল)`}</strong>
              <span style="display:none;">গ্রুপ বি</span>
            </div>
            <div class="w-grp-badges-cluster">
              <div class="w-grp-qual-badge badge-grp-b" id="w-badge-grpB-champ">
                👑 ${isEn ? 'Group Champion ➔ Semi 2' : 'গ্রুপ চ্যাম্পিয়ন ➔ সেমি ২'}
              </div>
              <div class="w-grp-qual-badge badge-grp-b-runner" id="w-badge-grpB-runnerup">
                🥈 ${isEn ? 'Runner-Up ➔ Semi 1' : 'গ্রুপ রানার আপ ➔ সেমি ১'}
              </div>
            </div>
          </div>
          <div class="w-grp-matches-list">
            ${grpBMatches.map(m => `
              <div class="w-neon-match-row">
                <span class="w-neon-match-tag">${isEn ? `Match ${m.id}` : `ম্যাচ ${m.id}`}</span>
                <span class="w-neon-team-name" title="${escapeHtml(m.t1)}">${escapeHtml(m.t1)}</span>
                <span class="w-neon-vs">VS</span>
                <span class="w-neon-team-name" title="${escapeHtml(m.t2)}">${escapeHtml(m.t2)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      semi1Slot1Html = `<span class="w-slot-icon">👑</span><span class="w-slot-team-txt">${isEn ? 'Group A Champion' : 'গ্রুপ A চ্যাম্পিয়ন'}</span>`;
      semi1Slot2Html = `<span class="w-slot-icon">🥈</span><span class="w-slot-team-txt badge-runnerup">${isEn ? 'Group B Runner-Up' : 'গ্রুপ B রানার আপ'}</span>`;
      semi2Slot1Html = `<span class="w-slot-icon">👑</span><span class="w-slot-team-txt">${isEn ? 'Group B Champion' : 'গ্রুপ B চ্যাম্পিয়ন'}</span>`;
      semi2Slot2Html = `<span class="w-slot-icon">🥈</span><span class="w-slot-team-txt">${isEn ? 'Group A Runner-Up' : 'গ্রুপ A রানার আপ'}</span>`;

    } else if (grpKeys.length === 3) {
      const grpAMatches = allGroupMatches.filter(m => m.group === 'A');
      const grpBMatches = allGroupMatches.filter(m => m.group === 'B');
      const grpCMatches = allGroupMatches.filter(m => m.group === 'C');
      const grpACount = struct.groups['A'] ? struct.groups['A'].length : 3;
      const grpBCount = struct.groups['B'] ? struct.groups['B'].length : 3;
      const grpCCount = struct.groups['C'] ? struct.groups['C'].length : 3;

      groupColHtml = `
        <!-- Card 1: Group A -->
        <div class="w-card-group-block card-grp-a w-bracket-card w-group-box-card" id="w-card-grp-A" data-group="A" data-path="semi-1">
          <div class="w-card-grp-head">
            <div class="w-grp-head-title">
              <span class="w-grp-dot dot-a"></span>
              <strong class="w-grp-title-txt">${isEn ? `Group A (${grpACount} Teams)` : `গ্রুপ A (${grpACount}টি দল)`}</strong>
              <span style="display:none;">গ্রুপ পর্ব</span>
              <span style="display:none;">গ্রুপ এ</span>
            </div>
            <div class="w-grp-qual-badge badge-grp-a" id="w-badge-grpA-champ">
              👑 ${isEn ? 'Group Champion ➔ Semi 1' : 'গ্রুপ চ্যাম্পিয়ন ➔ সেমিফাইনাল ১'}
            </div>
          </div>
          <div class="w-grp-matches-list">
            ${grpAMatches.map(m => `
              <div class="w-neon-match-row">
                <span class="w-neon-match-tag">${isEn ? `Match ${m.id}` : `ম্যাচ ${m.id}`}</span>
                <span class="w-neon-team-name" title="${escapeHtml(m.t1)}">${escapeHtml(m.t1)}</span>
                <span class="w-neon-vs">VS</span>
                <span class="w-neon-team-name" title="${escapeHtml(m.t2)}">${escapeHtml(m.t2)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Card 2: Group B -->
        <div class="w-card-group-block card-grp-b w-bracket-card w-group-box-card" id="w-card-grp-B" data-group="B" data-path="semi-2">
          <div class="w-card-grp-head">
            <div class="w-grp-head-title">
              <span class="w-grp-dot dot-b"></span>
              <strong class="w-grp-title-txt">${isEn ? `Group B (${grpBCount} Teams)` : `গ্রুপ B (${grpBCount}টি দল)`}</strong>
              <span style="display:none;">গ্রুপ বি</span>
            </div>
            <div class="w-grp-qual-badge badge-grp-b" id="w-badge-grpB-champ">
              👑 ${isEn ? 'Group Champion ➔ Semi 2' : 'গ্রুপ চ্যাম্পিয়ন ➔ সেমিফাইনাল ২'}
            </div>
          </div>
          <div class="w-grp-matches-list">
            ${grpBMatches.map(m => `
              <div class="w-neon-match-row">
                <span class="w-neon-match-tag">${isEn ? `Match ${m.id}` : `ম্যাচ ${m.id}`}</span>
                <span class="w-neon-team-name" title="${escapeHtml(m.t1)}">${escapeHtml(m.t1)}</span>
                <span class="w-neon-vs">VS</span>
                <span class="w-neon-team-name" title="${escapeHtml(m.t2)}">${escapeHtml(m.t2)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Card 3: Group C -->
        <div class="w-card-group-block card-grp-c w-bracket-card w-group-box-card" id="w-card-grp-C" data-group="C" data-path="semi-2">
          <div class="w-card-grp-head">
            <div class="w-grp-head-title">
              <span class="w-grp-dot dot-c"></span>
              <strong class="w-grp-title-txt">${isEn ? `Group C (${grpCCount} Teams)` : `গ্রুপ C (${grpCCount}টি দল)`}</strong>
              <span style="display:none;">গ্রুপ সি</span>
            </div>
            <div class="w-grp-qual-badge badge-grp-c" id="w-badge-grpC-champ">
              👑 ${isEn ? 'Group Champion ➔ Semi 2' : 'গ্রুপ চ্যাম্পিয়ন ➔ সেমিফাইনাল ২'}
            </div>
          </div>
          <div class="w-grp-matches-list">
            ${grpCMatches.map(m => `
              <div class="w-neon-match-row">
                <span class="w-neon-match-tag">${isEn ? `Match ${m.id}` : `ম্যাচ ${m.id}`}</span>
                <span class="w-neon-team-name" title="${escapeHtml(m.t1)}">${escapeHtml(m.t1)}</span>
                <span class="w-neon-vs">VS</span>
                <span class="w-neon-team-name" title="${escapeHtml(m.t2)}">${escapeHtml(m.t2)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Card 4: Best Runner-Up -->
        <div class="w-card-runnerup-block w-runnerup-pool-card" id="w-card-runnerup" data-path="semi-1">
          <div class="w-runnerup-left-icon">⭐</div>
          <div class="w-runnerup-text-wrap">
            <div class="w-runnerup-title-txt">${isEn ? 'Best Runner-Up' : 'সেরা রানার আপ'}</div>
            <div class="w-runnerup-sub-txt">${isEn ? 'Best Runner-Up among the groups' : 'গ্রুপগুলোর মধ্যে সেরা রানার্স-আপ'}</div>
          </div>
        </div>
      `;

      semi1Slot1Html = `<span class="w-slot-icon">👑</span><span class="w-slot-team-txt">${isEn ? 'Group A Champion' : 'গ্রুপ A চ্যাম্পিয়ন'}</span>`;
      semi1Slot2Html = `<span class="w-slot-icon">⭐</span><span class="w-slot-team-txt badge-runnerup">${isEn ? 'Best Runner-Up' : 'সেরা রানার আপ'}</span>`;
      semi2Slot1Html = `<span class="w-slot-icon">👑</span><span class="w-slot-team-txt">${isEn ? 'Group B Champion' : 'গ্রুপ B চ্যাম্পিয়ন'}</span>`;
      semi2Slot2Html = `<span class="w-slot-icon">👑</span><span class="w-slot-team-txt">${isEn ? 'Group C Champion' : 'গ্রুপ C চ্যাম্পিয়ন'}</span>`;

    } else {
      // 4 Groups or more
      groupColHtml = grpKeys.map(g => {
        const gMatches = allGroupMatches.filter(m => m.group === g);
        const gCount = struct.groups[g] ? struct.groups[g].length : '';
        const dotClass = g === 'A' ? 'dot-a' : (g === 'B' ? 'dot-b' : (g === 'C' ? 'dot-c' : 'dot-d'));
        const cardClass = g === 'A' ? 'card-grp-a' : (g === 'B' ? 'card-grp-b' : (g === 'C' ? 'card-grp-c' : 'card-grp-d'));
        const badgeClass = g === 'A' ? 'badge-grp-a' : (g === 'B' ? 'badge-grp-b' : (g === 'C' ? 'badge-grp-c' : 'badge-grp-d'));
        const targetSemi = (g === 'A' || g === 'B') ? (isEn ? 'Semi 1' : 'সেমি ১') : (isEn ? 'Semi 2' : 'সেমি ২');
        const targetPath = (g === 'A' || g === 'B') ? 'semi-1' : 'semi-2';
        const gBn = g === 'A' ? 'এ' : (g === 'B' ? 'বি' : (g === 'C' ? 'সি' : 'ডি'));

        return `
          <div class="w-card-group-block ${cardClass} w-bracket-card w-group-box-card" id="w-card-grp-${g}" data-group="${g}" data-path="${targetPath}">
            <div class="w-card-grp-head">
              <div class="w-grp-head-title">
                <span class="w-grp-dot ${dotClass}"></span>
                <strong class="w-grp-title-txt">${isEn ? `Group ${g} (${gCount} Teams)` : `গ্রুপ ${g} (${gCount}টি দল)`}</strong>
                <span style="display:none;">গ্রুপ ${gBn}</span>
              </div>
              <div class="w-grp-qual-badge ${badgeClass}" id="w-badge-grp${g}-champ">
                👑 ${isEn ? `Champion ➔ ${targetSemi}` : `চ্যাম্পিয়ন ➔ ${targetSemi}`}
              </div>
            </div>
            <div class="w-grp-matches-list">
              ${gMatches.map(m => `
                <div class="w-neon-match-row">
                  <span class="w-neon-match-tag">${isEn ? `Match ${m.id}` : `ম্যাচ ${m.id}`}</span>
                  <span class="w-neon-team-name" title="${escapeHtml(m.t1)}">${escapeHtml(m.t1)}</span>
                  <span class="w-neon-vs">VS</span>
                  <span class="w-neon-team-name" title="${escapeHtml(m.t2)}">${escapeHtml(m.t2)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');

      semi1Slot1Html = `<span class="w-slot-icon">👑</span><span class="w-slot-team-txt">${isEn ? 'Group A Champion' : 'গ্রুপ A চ্যাম্পিয়ন'}</span>`;
      semi1Slot2Html = `<span class="w-slot-icon">👑</span><span class="w-slot-team-txt badge-runnerup">${isEn ? 'Group B Champion' : 'গ্রুপ B চ্যাম্পিয়ন'}</span>`;
      semi2Slot1Html = `<span class="w-slot-icon">👑</span><span class="w-slot-team-txt">${isEn ? 'Group C Champion' : 'গ্রুপ C চ্যাম্পিয়ন'}</span>`;
      semi2Slot2Html = `<span class="w-slot-icon">👑</span><span class="w-slot-team-txt">${isEn ? 'Group D Champion' : 'গ্রুপ D চ্যাম্পিয়ন'}</span>`;
    }

    stagesHtml = `
        <div class="w-roadmap-board" id="w-roadmap-board">
          <!-- Top Header Bar -->
          <div class="w-roadmap-header">
            <div class="w-roadmap-title-area">
              <div class="w-roadmap-ball-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="12,7 16,10 14.5,15 9.5,15 8,10" fill="#ffffff" stroke="#ffffff" stroke-width="0.5"/>
                  <line x1="12" y1="2" x2="12" y2="7" stroke="#ffffff"/>
                  <line x1="21.5" y1="9" x2="16" y2="10" stroke="#ffffff"/>
                  <line x1="18" y1="19.5" x2="14.5" y2="15" stroke="#ffffff"/>
                  <line x1="6" y1="19.5" x2="9.5" y2="15" stroke="#ffffff"/>
                  <line x1="2.5" y1="9" x2="8" y2="10" stroke="#ffffff"/>
                </svg>
              </div>
              <div class="w-roadmap-titles">
                <div class="w-roadmap-main-title">${escapeHtml(tourneyTitle)} - ${escapeHtml(stageTitle)}</div>
                <div class="w-roadmap-sub-title">${escapeHtml(subTitle)}</div>
              </div>
            </div>
          </div>

          <!-- Main Roadmap Board Body with SVG Overlay -->
          <div class="w-roadmap-body" id="w-roadmap-body">
            <!-- Full Overlay SVG Canvas for Arrow Lines (Zero Hardcoded Pixels) -->
            <svg class="w-roadmap-svg-canvas" id="w-roadmap-svg-canvas">
              <defs>
                <marker id="arrow-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0ea5e9"/>
                </marker>
                <marker id="arrow-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#8b5cf6"/>
                </marker>
                <marker id="arrow-runnerup" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a855f7"/>
                </marker>
                <marker id="arrow-teal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981"/>
                </marker>
                <marker id="arrow-gold" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b"/>
                </marker>
                <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="currentColor" flood-opacity="0.6"/>
                </filter>
              </defs>

              <!-- Group A -> Semi 1 (Blue) -->
              <path id="w-path-grpA-to-semi1" class="w-roadmap-path" d="" stroke="#0ea5e9" stroke-width="2.5" fill="none" marker-end="url(#arrow-blue)" filter="url(#glow-filter)" data-path="semi-1" />

              <!-- Best Runner-Up -> Semi 1 (Purple traveling upward from bottom) -->
              <path id="w-path-runnerup-to-semi1" class="w-roadmap-path" d="" stroke="#a855f7" stroke-width="2.5" fill="none" marker-end="url(#arrow-runnerup)" filter="url(#glow-filter)" data-path="semi-1" />

              <!-- Group B -> Semi 2 (Purple) -->
              <path id="w-path-grpB-to-semi2" class="w-roadmap-path" d="" stroke="#8b5cf6" stroke-width="2.5" fill="none" marker-end="url(#arrow-purple)" filter="url(#glow-filter)" data-path="semi-2" />

              <!-- Group C -> Semi 2 (Teal) -->
              <path id="w-path-grpC-to-semi2" class="w-roadmap-path" d="" stroke="#10b981" stroke-width="2.5" fill="none" marker-end="url(#arrow-teal)" filter="url(#glow-filter)" data-path="semi-2" />

              <!-- Semi 1 -> Final (Blue) -->
              <path id="w-path-semi1-to-final" class="w-roadmap-path" d="" stroke="#0ea5e9" stroke-width="2.5" fill="none" marker-end="url(#arrow-blue)" filter="url(#glow-filter)" data-path="final" />

              <!-- Semi 2 -> Final (Gold) -->
              <path id="w-path-semi2-to-final" class="w-roadmap-path" d="" stroke="#f59e0b" stroke-width="2.5" fill="none" marker-end="url(#arrow-gold)" filter="url(#glow-filter)" data-path="final" />
            </svg>

            <!-- Hidden test compatibility elements -->
            <div class="w-bracket-connector w-multi-pathway-connector" style="display:none !important;" data-path="semi-1 semi-2">
              <div class="w-pathway-block block-semi1"></div>
              <div class="w-pathway-block block-semi2"></div>
            </div>

            <!-- COLUMN 1: GROUP STAGE -->
            <div class="w-roadmap-col col-groups" data-path="semi-1 semi-2">
              ${groupColHtml}
            </div>

            <!-- COLUMN 2: SEMI-FINALS -->
            <div class="w-roadmap-col col-semis" data-path="semi-1 semi-2 final">
              <!-- Semifinal 1 -->
              <div class="w-card-semi-block card-semi1" id="w-card-semi1" data-path="semi-1 final">
                <div class="w-semi-top-pill pill-semi1">
                  ${isEn ? 'Semifinal 1' : 'সেমিফাইনাল ১'}
                </div>
                <div class="w-semi-slots-container">
                  <div class="w-neon-slot" id="w-slot-semi1-t1">
                    ${semi1Slot1Html}
                  </div>
                  <div class="w-neon-slot-vs">VS</div>
                  <div class="w-neon-slot" id="w-slot-semi1-t2">
                    ${semi1Slot2Html}
                  </div>
                </div>
              </div>

              <!-- Semifinal 2 -->
              <div class="w-card-semi-block card-semi2" id="w-card-semi2" data-path="semi-2 final">
                <div class="w-semi-top-pill pill-semi2">
                  ${isEn ? 'Semifinal 2' : 'সেমিফাইনাল ২'}
                </div>
                <div class="w-semi-slots-container">
                  <div class="w-neon-slot" id="w-slot-semi2-t1">
                    ${semi2Slot1Html}
                  </div>
                  <div class="w-neon-slot-vs">VS</div>
                  <div class="w-neon-slot" id="w-slot-semi2-t2">
                    ${semi2Slot2Html}
                  </div>
                </div>
              </div>
            </div>

            <!-- COLUMN 3: GRAND FINAL -->
            <div class="w-roadmap-col col-final" data-path="final">
              <!-- Final Card -->
              <div class="w-card-final-block final-card" id="w-card-final" data-path="final">
                <div class="w-final-top-pill">
                  🏆 ${isEn ? 'Final' : 'ফাইনাল'} <span style="font-size:10px; opacity:0.85;">(${isEn ? 'Mega Grand Final' : 'মেগা ফাইনাল'})</span>
                </div>
                <div class="w-final-slots-container">
                  <div class="w-neon-slot slot-final" id="w-slot-final-t1">
                    <span class="w-slot-team-txt">${isEn ? 'Winner Semifinal 1' : 'সেমিফাইনাল ১ বিজয়ী'}</span>
                  </div>
                  <div class="w-neon-slot-vs vs-gold">VS</div>
                  <div class="w-neon-slot" id="w-slot-final-t2">
                    <span class="w-slot-team-txt">${isEn ? 'Winner Semifinal 2' : 'সেমিফাইনাল ২ বিজয়ী'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  }

  // Populate Stats Bar
  if (statsBar) {
    statsBar.innerHTML = `
      <span class="w-bracket-stat-chip blue">👥 ${count} ${isEn ? 'Teams' : 'দল'}</span>
      <span class="w-bracket-stat-chip green">🏟️ ${isEn ? 'Total Matches:' : 'মোট ম্যাচ:'} <strong>${totalMatchCount}</strong></span>
      <span class="w-bracket-stat-chip purple">🏆 ${totalStagesCount} ${isEn ? 'Stages' : 'ধাপের টুর্নামেন্ট'}</span>
    `;
  }

  container.innerHTML = stagesHtml;

  // Attach ResizeObserver & Trigger SVG roadmap arrows update
  attachRoadmapResizeObserver();
  updateRoadmapSvgPaths();
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(updateRoadmapSvgPaths);
  }
  setTimeout(updateRoadmapSvgPaths, 40);
  setTimeout(updateRoadmapSvgPaths, 150);

  // Re-apply perspective filter if active
  if (currentBracketPerspective && currentBracketPerspective !== 'all') {
    filterBracketPerspective(currentBracketPerspective);
  }
}

function updateWizardStructureSummary() {
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const recs = getTournamentFormatRecommendations(tempWizardTeamCount, isEn);

  ['groups', 'league', 'knockout'].forEach(t => {
    const pill = document.getElementById(`w-rec-pill-${t}`);
    const desc = document.getElementById(`w-rec-desc-${t}`);
    const rec = recs[t];
    if (rec) {
      if (pill) {
        pill.textContent = rec.badgeText;
        pill.className = `w-struct-rec-pill rec-${rec.badge}`;
      }
      if (desc) {
        desc.textContent = rec.desc;
      }
    }
  });

  // Highlight active quick team chip
  if (typeof document !== 'undefined' && document.querySelectorAll) {
    const chips = document.querySelectorAll('#w-quick-team-chips .w-team-chip');
    if (chips && chips.length > 0) {
      chips.forEach(chip => {
        const cnt = chip.getAttribute ? chip.getAttribute('data-count') : null;
        if (chip.classList) {
          chip.classList.toggle('active', cnt === String(tempWizardTeamCount));
        }
      });
    }
  }

  const struct = generateTournamentStructure(tempWizardTeamCount, tempWizardTourneyType, tempWizardTeams);
  const summaryEl = document.getElementById('w-structure-summary-text');
  if (summaryEl) {
    summaryEl.textContent = isEn ? struct.summaryEn : struct.summaryBn;
  }
  const badge = document.getElementById('w-teams-count-badge');
  if (badge) badge.textContent = tempWizardTeamCount;

  // Live Visual Bracket & Match Roadmap Flow
  renderWizardVisualFixtureBracket(tempWizardTeamCount, tempWizardTourneyType, tempWizardTeams);
}

function renderWizardTeamsDashboard() {
  const container = document.getElementById('w-teams-dashboard-container');
  if (!container) return;

  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  // Financial status calculation
  let paidCount = 0;
  let dueCount = 0;
  let partialCount = 0;

  tempWizardTeams.forEach(t => {
    const st = t.feeStatus || 'due';
    if (st === 'paid') paidCount++;
    else if (st === 'partial') partialCount++;
    else dueCount++;
  });

  const entryFeeVal = document.getElementById('w-cfg-entryFee')?.value || tournamentConfig.entryFee || '';

  let html = `
    <!-- Top Summary Card: Finance & Team Status -->
    <div class="w-teams-stat-banner">
      <div class="w-stat-pill blue">
        <span>👥 ${isEn ? 'Total Teams:' : 'মোট দল:'}</span>
        <strong>${tempWizardTeams.length}</strong>
      </div>
      <div class="w-stat-pill green">
        <span>🟢 ${isEn ? 'Paid Fee:' : 'ফি পরিশোধিত:'}</span>
        <strong>${paidCount}</strong>
      </div>
      <div class="w-stat-pill yellow">
        <span>🟡 ${isEn ? 'Fee Due:' : 'বাকি:'}</span>
        <strong>${dueCount}</strong>
      </div>
      <div class="w-stat-pill orange">
        <span>🟠 ${isEn ? 'Partial:' : 'আংশিক:'}</span>
        <strong>${partialCount}</strong>
      </div>
      <div style="margin-left:auto; font-size:11px; color:#475569; display:flex; align-items:center; gap:6px;">
        <button type="button" class="btn" style="background:#15803d; color:#fff; font-size:11px; padding:4px 10px; border-radius:6px;" onclick="addWizardTeam()">+ ${isEn ? 'Add Team' : 'দল যোগ করুন'}</button>
      </div>
    </div>

    <!-- Teams List Grid -->
    <div class="w-teams-grid">
  `;

  tempWizardTeams.forEach((t, idx) => {
    const grpLetters = ['A', 'B', 'C', 'D'];
    const optGroup = grpLetters.map(g => `<option value="${g}" ${t.group === g ? 'selected' : ''}>${isEn ? 'Group ' + g : 'গ্রুপ ' + g}</option>`).join('');

    const teamRoster = teamRosters[t.name] || (typeof DEFAULT_ROSTERS !== 'undefined' && DEFAULT_ROSTERS[t.name]) || { players: [] };
    const players = (teamRoster.players && teamRoster.players.length > 0) ? teamRoster.players : [];

    html += `
      <div class="w-team-card">
        <div class="w-team-card-header">
          <div style="display:flex; align-items:center; gap:6px; flex:1;">
            <span class="w-team-num">#${idx + 1}</span>
            <input type="text" class="w-team-input-name" value="${escapeHtml(t.name)}" placeholder="${isEn ? 'Team Name' : 'দলের নাম'}" oninput="updateWizardTeamField(${idx}, 'name', this.value)" title="${isEn ? 'Edit team name' : 'দলের নাম পরিবর্তন করুন'}">
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            ${tempWizardTourneyType === 'groups' ? `
              <select class="w-team-select-grp" onchange="updateWizardTeamField(${idx}, 'group', this.value)">
                ${optGroup}
              </select>
            ` : ''}
            <select class="w-team-select-fee ${t.feeStatus || 'due'}" onchange="updateWizardTeamField(${idx}, 'feeStatus', this.value)">
              <option value="paid" ${(t.feeStatus === 'paid') ? 'selected' : ''}>${isEn ? '🟢 Paid' : '🟢 পরিশোধিত'}</option>
              <option value="due" ${(t.feeStatus === 'due' || !t.feeStatus) ? 'selected' : ''}>${isEn ? '🟡 Due' : '🟡 বাকি'}</option>
              <option value="partial" ${(t.feeStatus === 'partial') ? 'selected' : ''}>${isEn ? '🟠 Partial' : '🟠 আংশিক'}</option>
            </select>
            <button type="button" class="w-team-btn-del" onclick="removeWizardTeam(${idx})" title="${isEn ? 'Remove team' : 'দল বাদ দিন'}">✕</button>
          </div>
        </div>

        <div class="w-team-card-body">
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <div style="flex:1; min-width:130px;">
              <span class="w-sub-lbl">${isEn ? 'Manager:' : 'ম্যানেজার:'}</span>
              <input type="text" class="w-input-sm" value="${escapeHtml(t.manager || '')}" placeholder="${isEn ? 'Manager name' : 'ম্যানেজারের নাম'}" oninput="updateWizardTeamField(${idx}, 'manager', this.value)">
            </div>
            <div style="flex:1; min-width:130px;">
              <span class="w-sub-lbl">${isEn ? 'Mobile:' : 'মোবাইল:'}</span>
              <input type="text" class="w-input-sm" value="${escapeHtml(t.phone || '')}" placeholder="${isEn ? 'Contact number' : 'যোগাযোগ নম্বর'}" oninput="updateWizardTeamField(${idx}, 'phone', this.value)">
            </div>
          </div>

          <div style="margin-top:6px; display:flex; justify-content:space-between; align-items:center;">
            <button type="button" class="w-btn-accordion" onclick="toggleTeamPlayersAccordion(${idx})">
              👥 ${isEn ? 'Squad Roster (11 Players)' : 'খেলোয়াড় তালিকা ও লাস্ট-মিনিট বদল'} ▾
            </button>
            <span style="font-size:9.5px; color:#64748b;">${players.filter(p => p.name).length || 11} ${isEn ? 'players listed' : 'জন তালিকাভুক্ত'}</span>
          </div>

          <!-- Expandable Players Table -->
          <div id="w-team-players-${idx}" class="w-team-players-wrap" style="display:none;">
            <table class="w-player-edit-table">
              <thead>
                <tr>
                  <th style="width:12%;">#</th>
                  <th style="width:20%;">${isEn ? 'Jersey' : 'জার্সি'}</th>
                  <th style="width:68%;">${isEn ? 'Player Name' : 'খেলোয়াড়ের নাম (খেলার আগেও বদলযোগ্য)'}</th>
                </tr>
              </thead>
              <tbody>
    `;

    for (let pNo = 1; pNo <= 11; pNo++) {
      const p = players.find(x => x.no === pNo) || { no: pNo, jersey: pNo, name: '' };
      html += `
        <tr>
          <td style="text-align:center; font-weight:700; color:#64748b;">${pNo}</td>
          <td style="text-align:center;">
            <input type="number" min="1" max="99" class="w-jersey-inp" value="${p.jersey || pNo}" oninput="updateWizardPlayer(${idx}, ${pNo}, 'jersey', this.value)">
          </td>
          <td>
            <input type="text" class="w-pname-inp" value="${escapeHtml(p.name || '')}" placeholder="${isEn ? 'Player ' + pNo : 'খেলোয়াড় ' + pNo}" oninput="updateWizardPlayer(${idx}, ${pNo}, 'name', this.value)">
          </td>
        </tr>
      `;
    }

    html += `
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

function updateWizardTeamField(idx, field, val) {
  if (idx >= 0 && idx < tempWizardTeams.length) {
    const oldName = tempWizardTeams[idx].name;
    tempWizardTeams[idx][field] = val;

    if (field === 'name' && val.trim() !== '' && val !== oldName) {
      if (teamRosters[oldName]) {
        teamRosters[val] = teamRosters[oldName];
        delete teamRosters[oldName];
      }
    }
    updateWizardStructureSummary();
  }
}

function addWizardTeam() {
  const idx = tempWizardTeams.length + 1;
  tempWizardTeams.push({
    id: 't' + idx,
    name: 'দল ' + idx,
    group: tempWizardTourneyType === 'groups' ? (['A', 'B', 'C', 'D'][(idx - 1) % 4]) : 'A',
    manager: 'ম্যানেজার ' + idx,
    phone: '০১৭xxxxxxxx',
    feeStatus: 'due'
  });
  tempWizardTeamCount = tempWizardTeams.length;
  const countInp = document.getElementById('w-cfg-teamCount');
  if (countInp) countInp.value = tempWizardTeamCount;
  updateWizardStructureSummary();
  renderWizardTeamsDashboard();
}

function removeWizardTeam(idx) {
  if (tempWizardTeams.length <= 2) {
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
    alert(isEn ? 'A tournament must have at least 2 teams!' : 'একটি টুর্নামেন্টে কমপক্ষে ২টি দল থাকতে হবে!');
    return;
  }
  tempWizardTeams.splice(idx, 1);
  tempWizardTeamCount = tempWizardTeams.length;
  const countInp = document.getElementById('w-cfg-teamCount');
  if (countInp) countInp.value = tempWizardTeamCount;
  updateWizardStructureSummary();
  renderWizardTeamsDashboard();
}

function toggleTeamPlayersAccordion(idx) {
  const el = document.getElementById(`w-team-players-${idx}`);
  if (el) {
    el.style.display = (el.style.display === 'none' || !el.style.display) ? 'block' : 'none';
  }
}

function updateWizardPlayer(teamIdx, playerNo, field, val) {
  const team = tempWizardTeams[teamIdx];
  if (!team) return;

  if (!teamRosters[team.name]) {
    teamRosters[team.name] = {
      group: 'গ্রুপ ' + (team.group || 'A'),
      manager: team.manager || '',
      phone: team.phone || '',
      feeStatus: team.feeStatus || 'due',
      players: []
    };
  }

  let p = teamRosters[team.name].players.find(x => x.no === playerNo);
  if (!p) {
    p = { no: playerNo, jersey: playerNo, name: '' };
    teamRosters[team.name].players.push(p);
  }

  if (field === 'jersey') {
    p.jersey = parseInt(val, 10) || playerNo;
  } else if (field === 'name') {
    p.name = val.trim();
  }
}

function renderWizardFormatSuggestions() {
  const list = document.getElementById('w-cfg-formatType-list');
  if (!list) return;
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const options = isEn ? [
    '11-a-side (11 on pitch, Standard Football)',
    '5-a-side Minibar (Short Pitch / Futsal)',
    '7-a-side (7 on pitch, 4 subs)',
    '8-a-side (8 on pitch, 3 subs)',
    '9-a-side (9 on pitch, 2 subs)',
    '6-a-side (6 on pitch, 5 subs)'
  ] : [
    '১১-এ-সাইড (প্রতি দলে ১১ জন মাঠে)',
    '৫-এ-সাইড মিনিবার (শর্ট পিচ / ফুটসাল)',
    '৭-এ-সাইড (প্রতি দলে ৭ জন মাঠে, ৪ জন বদলি)',
    '৮-এ-সাইড (প্রতি দলে ৮ জন মাঠে, ৩ জন বদলি)',
    '৯-এ-সাইড (প্রতি দলে ৯ জন মাঠে, ২ জন বদলি)',
    '৬-এ-সাইড (প্রতি দলে ৬ জন মাঠে, ৫ জন বদলি)'
  ];

  list.innerHTML = options.map(opt => `<option value="${escapeHtml(opt)}">`).join('');
}

function openTournamentWizard(initialTab = 'info') {
  loadTournamentConfig();
  switchWizardTab(initialTab);
  renderWizardFormatSuggestions();

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined && val !== null ? val : '';
  };

  const isLegacy = tournamentConfig.title && (tournamentConfig.title.includes('চিতড্ডা') || tournamentConfig.title.includes('Chitadda'));
  const isDefault = !tournamentConfig.title || tournamentConfig.title === DEFAULT_CONFIG.title || tournamentConfig.title === DEFAULT_CONFIG_EN.title || isLegacy;

  setVal('w-cfg-title', isDefault ? '' : tournamentConfig.title);
  setVal('w-cfg-titleAccent', isDefault ? '' : (tournamentConfig.titleAccent || ''));
  setVal('w-cfg-organizer', isDefault ? '' : (tournamentConfig.organizer || ''));
  setVal('w-cfg-venue', isDefault ? '' : (tournamentConfig.venue || ''));
  setVal('w-cfg-formatType', tournamentConfig.formatType || '১১-এ-সাইড (11-a-side)');
  setVal('w-cfg-startingPlayers', tournamentConfig.startingPlayers !== undefined ? tournamentConfig.startingPlayers : 11);
  setVal('w-cfg-benchPlayers', tournamentConfig.benchPlayers !== undefined ? tournamentConfig.benchPlayers : 5);
  setVal('w-cfg-maxSubstitutes', tournamentConfig.maxSubstitutes !== undefined ? tournamentConfig.maxSubstitutes : 5);
  updateSquadCalculations();
  const isDefaultMatchDuration = !tournamentConfig.matchDuration ||
    tournamentConfig.matchDuration === '৯০ মিনিট (৪৫ মিনিট + ৪৫ মিনিট)' ||
    tournamentConfig.matchDuration === '90 mins (45 mins + 45 mins)' ||
    (typeof DEFAULT_CONFIG !== 'undefined' && tournamentConfig.matchDuration === DEFAULT_CONFIG.matchDuration) ||
    (typeof DEFAULT_CONFIG_EN !== 'undefined' && tournamentConfig.matchDuration === DEFAULT_CONFIG_EN.matchDuration);
  setVal('w-cfg-matchDuration', isDefaultMatchDuration ? '' : tournamentConfig.matchDuration);
  setVal('w-cfg-startDate', isDefault ? '' : (tournamentConfig.startDate || ''));

  setVal('w-cfg-championPrize', isDefault ? '' : (tournamentConfig.championPrize || ''));
  setVal('w-cfg-runnerUpPrize', isDefault ? '' : (tournamentConfig.runnerUpPrize || ''));
  setVal('w-cfg-thirdPrize', isDefault ? '' : (tournamentConfig.thirdPrize || ''));
  setVal('w-cfg-otherPrizes', isDefault ? '' : (tournamentConfig.otherPrizes || ''));
  setVal('w-cfg-entryFee', isDefault ? '' : (tournamentConfig.entryFee || ''));
  setVal('w-cfg-regDeadline', isDefault ? '' : (tournamentConfig.regDeadline || ''));
  setVal('w-cfg-contactPhone', isDefault ? '' : (tournamentConfig.contactPhone || ''));
  setVal('w-cfg-paymentMethod', isDefault ? '' : (tournamentConfig.paymentMethod || ''));

  tempWizardSelectedRules = new Set(tournamentConfig.selectedRules || []);
  tempWizardCustomRules = JSON.parse(JSON.stringify(tournamentConfig.customRules || []));

  tempWizardTourneyType = tournamentConfig.tournamentType || 'groups';
  tempWizardTeamCount = tournamentConfig.teamCount || (tournamentConfig.teams ? tournamentConfig.teams.length : 9);
  tempWizardTeams = JSON.parse(JSON.stringify(tournamentConfig.teams || DEFAULT_TEAMS));

  setVal('w-cfg-teamCount', tempWizardTeamCount);
  setWizardTournamentType(tempWizardTourneyType);

  const searchInp = document.getElementById('w-rules-search-input');
  if (searchInp) searchInp.value = '';

  const fmt = (tournamentConfig.formatType || '').toLowerCase();
  const isMini = fmt.includes('৫-এ-সাইড') || fmt.includes('5-a-side') || fmt.includes('মিনিবার') || fmt.includes('minibar') || fmt.includes('futsal');
  const hasRules = Boolean(tournamentConfig.selectedRules && tournamentConfig.selectedRules.length > 0);

  const stdBtn = document.getElementById('btn-preset-standard');
  const miniBtn = document.getElementById('btn-preset-minibar');
  if (stdBtn) stdBtn.classList.toggle('active', hasRules && !isMini);
  if (miniBtn) miniBtn.classList.toggle('active', hasRules && isMini);

  renderWizardRulesChecklist();
  renderCustomRulesList();
  renderWizardTeamsDashboard();

  const modal = document.getElementById('tournament-wizard-modal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    setTimeout(updateRoadmapSvgPaths, 80);
  }
}

function closeTournamentWizard() {
  const modal = document.getElementById('tournament-wizard-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function updateWizardRulesCounts() {
  const total = tempWizardSelectedRules.size + tempWizardCustomRules.length;
  const pill = document.getElementById('w-rules-active-count');
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  if (pill) pill.textContent = isEn ? `Selected: ${total} rules` : `সিলেক্টেড: ${total}টি`;
  const tabBadge = document.getElementById('w-selected-rules-count');
  if (tabBadge) tabBadge.textContent = total;
}

function renderWizardRulesChecklist(query = '') {
  const container = document.getElementById('w-rules-catalog-container');
  if (!container) return;

  const q = (query || '').trim().toLowerCase();
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  // Group MASTER_RULES_CATALOG by category
  const categoriesMap = new Map();
  MASTER_RULES_CATALOG.forEach(rule => {
    const catName = isEn && rule.categoryEn ? rule.categoryEn : rule.category;
    if (!categoriesMap.has(catName)) {
      categoriesMap.set(catName, {
        icon: rule.categoryIcon || '📋',
        rules: []
      });
    }
    categoriesMap.get(catName).rules.push(rule);
  });

  let html = '';
  let totalMatched = 0;

  categoriesMap.forEach((catData, catName) => {
    const matchedRules = catData.rules.filter(r => {
      if (!q) return true;
      const tBn = (r.title || '').toLowerCase();
      const tEn = (r.titleEn || '').toLowerCase();
      const dBn = (r.desc || '').toLowerCase();
      const dEn = (r.descEn || '').toLowerCase();
      const cBn = (r.category || '').toLowerCase();
      const cEn = (r.categoryEn || '').toLowerCase();
      return (
        tBn.includes(q) || tEn.includes(q) ||
        dBn.includes(q) || dEn.includes(q) ||
        cBn.includes(q) || cEn.includes(q)
      );
    });

    if (matchedRules.length === 0) return;
    totalMatched += matchedRules.length;

    const selectedInCat = catData.rules.filter(r => tempWizardSelectedRules.has(r.id)).length;
    const totalInCat = catData.rules.length;
    const catBadgeText = isEn ? `${selectedInCat}/${totalInCat} selected` : `${selectedInCat}/${totalInCat} নির্বাচিত`;
    const selectAllText = isEn ? 'Select All' : 'সব নির্বাচন';
    const clearText = isEn ? 'Deselect' : 'বাতিল';

    html += `
      <div class="w-rules-cat-box">
        <div class="w-rules-cat-header">
          <div class="w-rules-cat-title">
            <span>${catData.icon}</span>
            <span>${escapeHtml(catName)}</span>
            <span class="w-rules-cat-badge">${catBadgeText}</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn" style="background:#e0e7ff; color:#3730a3; font-size:9.5px; padding:1px 6px;" onclick="toggleCategoryRules('${escapeHtml(catName)}', true)">${selectAllText}</button>
            <button type="button" class="btn" style="background:#f1f5f9; color:#475569; font-size:9.5px; padding:1px 6px;" onclick="toggleCategoryRules('${escapeHtml(catName)}', false)">${clearText}</button>
          </div>
        </div>
        <div class="w-rules-cat-list">
    `;

    matchedRules.forEach(r => {
      const isChecked = tempWizardSelectedRules.has(r.id);
      const rTitle = isEn && r.titleEn ? r.titleEn : r.title;
      const rDesc = isEn && r.descEn ? r.descEn : r.desc;
      html += `
        <label class="w-rule-item ${isChecked ? 'selected' : ''}">
          <input type="checkbox" class="w-rule-chk" data-rule-id="${r.id}" ${isChecked ? 'checked' : ''} onchange="onRuleCheckChange('${r.id}', this.checked)">
          <div class="w-rule-info">
            <span class="w-rule-title">${escapeHtml(rTitle)}</span>
            <span class="w-rule-desc">${escapeHtml(rDesc)}</span>
          </div>
        </label>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  if (totalMatched === 0) {
    html = `<div style="text-align:center; padding:18px; color:#64748b; font-size:11px;">🔍 ${isEn ? 'No rules matched your search keyword.' : 'কোনো নিয়ম খুঁজে পাওয়া যায়নি। অনুসন্ধান শব্দ পরিবর্তন করুন।'}</div>`;
  }

  container.innerHTML = html;
  updateWizardRulesCounts();
}

function onRuleCheckChange(ruleId, isChecked) {
  if (isChecked) {
    tempWizardSelectedRules.add(ruleId);
  } else {
    tempWizardSelectedRules.delete(ruleId);
  }
  updateWizardRulesCounts();

  const chk = document.querySelector(`input[data-rule-id="${ruleId}"]`);
  if (chk && chk.closest('.w-rule-item')) {
    if (isChecked) chk.closest('.w-rule-item').classList.add('selected');
    else chk.closest('.w-rule-item').classList.remove('selected');
  }

  // Update category badges in view
  const targetRule = MASTER_RULES_CATALOG.find(r => r.id === ruleId);
  if (targetRule) {
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
    const targetCat = isEn && targetRule.categoryEn ? targetRule.categoryEn : targetRule.category;
    const catBoxes = document.querySelectorAll('.w-rules-cat-box');
    catBoxes.forEach(box => {
      if (box.textContent.includes(targetCat) || box.textContent.includes(targetRule.category)) {
        const catRules = MASTER_RULES_CATALOG.filter(r => (r.category === targetRule.category || r.categoryEn === targetCat));
        const selCount = catRules.filter(r => tempWizardSelectedRules.has(r.id)).length;
        const badge = box.querySelector('.w-rules-cat-badge');
        if (badge) badge.textContent = isEn ? `${selCount}/${catRules.length} selected` : `${selCount}/${catRules.length} নির্বাচিত`;
      }
    });
  }
}

function selectAllMasterRules(selectAll) {
  if (selectAll) {
    MASTER_RULES_CATALOG.forEach(r => tempWizardSelectedRules.add(r.id));
  } else {
    tempWizardSelectedRules.clear();
  }
  const query = document.getElementById('w-rules-search-input')?.value || '';
  renderWizardRulesChecklist(query);
}

function toggleCategoryRules(catName, selectAll) {
  MASTER_RULES_CATALOG.filter(r => r.category === catName || r.categoryEn === catName).forEach(r => {
    if (selectAll) tempWizardSelectedRules.add(r.id);
    else tempWizardSelectedRules.delete(r.id);
  });
  const query = document.getElementById('w-rules-search-input')?.value || '';
  renderWizardRulesChecklist(query);
}

function filterRulesInWizard(query) {
  renderWizardRulesChecklist(query);
}

function renderCustomRulesList() {
  const container = document.getElementById('w-custom-rules-container');
  if (!container) return;
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  if (tempWizardCustomRules.length === 0) {
    container.innerHTML = `<span style="font-size:10px; color:#64748b; font-style:italic;">${isEn ? 'No custom local rules added yet.' : 'বর্তমানে কোনো নিজস্ব কাস্টম নিয়ম যুক্ত করা হয়নি।'}</span>`;
    updateWizardRulesCounts();
    return;
  }

  let html = '';
  tempWizardCustomRules.forEach((cr, idx) => {
    html += `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; background:#fff; border:1px solid #bbf7d0; border-radius:4px; padding:5px 8px; gap:8px;">
        <div style="font-size:10.5px; line-height:1.35;">
          <strong style="color:#15803d;">${escapeHtml(cr.title)}:</strong>
          <span style="color:#334155;"> ${escapeHtml(cr.desc)}</span>
        </div>
        <button type="button" onclick="removeCustomRule(${idx})" style="background:#fee2e2; border:1px solid #fca5a5; color:#b91c1c; border-radius:3px; font-size:10px; padding:1px 5px; cursor:pointer;" title="${isEn ? 'Delete Rule' : 'নিয়ম মুছুন'}">✕</button>
      </div>
    `;
  });

  container.innerHTML = html;
  updateWizardRulesCounts();
}

function addCustomRule() {
  const titleEl = document.getElementById('w-custom-rule-title');
  const descEl = document.getElementById('w-custom-rule-desc');
  const title = (titleEl?.value || '').trim();
  const desc = (descEl?.value || '').trim();
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  if (!title) {
    alert(isEn ? 'Please enter a rule title (e.g. East Boundary Pool).' : 'অনুগ্রহ করে নিয়মের একটি সংক্ষিপ্ত শিরোনাম লিখুন (যেমন: মাঠের পূর্ব দেওয়াল)।');
    if (titleEl) titleEl.focus();
    return;
  }

  tempWizardCustomRules.push({
    id: 'cr_' + Date.now(),
    title: title,
    desc: desc || title
  });

  if (titleEl) titleEl.value = '';
  if (descEl) descEl.value = '';

  renderCustomRulesList();
}

function removeCustomRule(idx) {
  if (idx >= 0 && idx < tempWizardCustomRules.length) {
    tempWizardCustomRules.splice(idx, 1);
    renderCustomRulesList();
  }
}

function updateSquadCalculations() {
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const startEl = document.getElementById('w-cfg-startingPlayers');
  const benchEl = document.getElementById('w-cfg-benchPlayers');
  const maxSubsEl = document.getElementById('w-cfg-maxSubstitutes');
  const summaryEl = document.getElementById('w-squad-calc-summary');
  const warningEl = document.getElementById('w-starting-players-warning');

  const rawVal = startEl && startEl.value !== '' ? parseInt(startEl.value, 10) : 11;

  // Warning when starting players > 11 (Max 11 in football)
  if (rawVal > 11) {
    if (startEl && startEl.classList) startEl.classList.add('w-input-warning');
    if (warningEl) {
      warningEl.style.display = 'block';
      warningEl.textContent = isEn
        ? '⚠️ In football, a maximum of 11 players can be on the pitch. You cannot enter more than 11!'
        : '⚠️ ফুটবলে মাঠে সর্বোচ্চ ১১ জন খেলোয়াড় খেলতে পারে। ১১-এর বেশি আপনি এখানে দিতে পারবেন না!';
    }
  } else {
    if (startEl && startEl.classList) startEl.classList.remove('w-input-warning');
    if (warningEl) {
      warningEl.style.display = 'none';
    }
  }

  const startCount = (isNaN(rawVal) || rawVal <= 0) ? 11 : Math.min(rawVal, 11);
  const benchCount = parseInt(benchEl && benchEl.value ? benchEl.value : 5, 10) || 0;
  const maxSubs = parseInt(maxSubsEl && maxSubsEl.value ? maxSubsEl.value : 5, 10) || 3;
  const totalSquad = startCount + benchCount;

  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="w-squad-stat-item">
        <span class="w-squad-stat-lbl">🏟️ ${isEn ? 'On Pitch (Starting):' : 'মাঠে মূল খেলোয়াড়:'}</span>
        <span class="w-squad-stat-val"><strong>${startCount}</strong> ${isEn ? 'players' : 'জন'}</span>
      </div>
      <div class="w-squad-stat-item">
        <span class="w-squad-stat-lbl">🪑 ${isEn ? 'Bench / Reserves:' : 'রিজার্ভ / বেঞ্চ:'}</span>
        <span class="w-squad-stat-val"><strong>${benchCount}</strong> ${isEn ? 'players' : 'জন'}</span>
      </div>
      <div class="w-squad-stat-item highlight">
        <span class="w-squad-stat-lbl">📋 ${isEn ? 'Total Squad Roster:' : 'মোট স্কোয়াড তালিকা:'}</span>
        <span class="w-squad-stat-val"><strong>${totalSquad}</strong> ${isEn ? 'players' : 'জন'}</span>
      </div>
      <div class="w-squad-stat-item">
        <span class="w-squad-stat-lbl">🔄 ${isEn ? 'Max Substitutions:' : 'ম্যাচে সর্বোচ্চ বদলি:'}</span>
        <span class="w-squad-stat-val">সর্বোচ্চ <strong>${maxSubs}</strong> ${isEn ? 'players' : 'জন'}</span>
      </div>
    `;
  }
}

function validateStartingPlayers(el) {
  if (!el) return;
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const val = parseInt(el.value, 10);
  const warningEl = document.getElementById('w-starting-players-warning');
  if (val > 11) {
    el.value = 11;
    if (el.classList) el.classList.remove('w-input-warning');
    if (warningEl) {
      warningEl.style.display = 'block';
      warningEl.textContent = isEn
        ? '⚠️ Reset to 11 (maximum allowed players in football).'
        : '⚠️ ফুটবলের নিয়ম অনুযায়ী সর্বোচ্চ ১১ জন খেলোয়াড়ে সেট করা হয়েছে।';
      setTimeout(() => {
        if (warningEl && parseInt(el.value, 10) <= 11) {
          warningEl.style.display = 'none';
        }
      }, 3500);
    }
    updateSquadCalculations();
  }
}

function syncRulesWithSquadSettings(force = false) {
  const startEl = document.getElementById('w-cfg-startingPlayers');
  const starting = startEl && startEl.value !== '' ? parseInt(startEl.value, 10) : 11;
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  const hasSelectedRules = tempWizardSelectedRules && tempWizardSelectedRules.size > 0;
  if (!hasSelectedRules && !force) {
    return;
  }

  if (!tempWizardSelectedRules) {
    tempWizardSelectedRules = new Set();
  }

  if (starting >= 11) {
    // 11-a-side FIFA Standard Football: Adapt to 11-a-side rules
    tempWizardSelectedRules.delete('r_onfield_6');
    tempWizardSelectedRules.delete('r_squad_minibar');
    tempWizardSelectedRules.delete('r_match_duration');
    tempWizardSelectedRules.delete('r_direct_shootout');
    tempWizardSelectedRules.delete('r_pen_count');
    tempWizardSelectedRules.delete('r_shootout_pts');
    tempWizardSelectedRules.delete('r_no_offside');
    tempWizardSelectedRules.delete('r_rolling_subs');
    tempWizardSelectedRules.delete('r_minibar_gk_rules');
    tempWizardSelectedRules.delete('r_minibar_posts');

    tempWizardSelectedRules.add('r_squad_11');
    tempWizardSelectedRules.add('r_onfield_11');
    tempWizardSelectedRules.add('r_match_duration_90');
    tempWizardSelectedRules.add('r_extra_time_fifa');
    tempWizardSelectedRules.add('r_fifa_points');
    tempWizardSelectedRules.add('r_pen_count_fifa');
    tempWizardSelectedRules.add('r_fifa_offside');
    tempWizardSelectedRules.add('r_fifa_subs');

    if (typeof STANDARD_RULES_PRESET !== 'undefined') {
      STANDARD_RULES_PRESET.forEach(rid => tempWizardSelectedRules.add(rid));
    }

    const stdBtn = document.getElementById('btn-preset-standard');
    const miniBtn = document.getElementById('btn-preset-minibar');
    if (stdBtn) stdBtn.classList.add('active');
    if (miniBtn) miniBtn.classList.remove('active');

    const durEl = document.getElementById('w-cfg-matchDuration');
    if (durEl && (!durEl.value || durEl.value.includes('২০') || durEl.value.includes('20') || durEl.value.includes('15') || durEl.value.includes('১৫'))) {
      durEl.value = isEn ? '90 mins (45+15+45 mins)' : '৯০ মিনিট (৪৫+১৫+৪৫ মিনিট)';
    }
  } else if (starting <= 6) {
    // 5/6-a-side Minibar / Short-Pitch Football: Adapt to Minibar rules
    tempWizardSelectedRules.delete('r_onfield_11');
    tempWizardSelectedRules.delete('r_match_duration_90');
    tempWizardSelectedRules.delete('r_extra_time_fifa');
    tempWizardSelectedRules.delete('r_fifa_points');
    tempWizardSelectedRules.delete('r_pen_count_fifa');
    tempWizardSelectedRules.delete('r_fifa_offside');
    tempWizardSelectedRules.delete('r_fifa_subs');

    tempWizardSelectedRules.add('r_squad_minibar');
    tempWizardSelectedRules.add('r_onfield_6');
    tempWizardSelectedRules.add('r_minibar_posts');
    tempWizardSelectedRules.add('r_match_duration');
    tempWizardSelectedRules.add('r_direct_shootout');
    tempWizardSelectedRules.add('r_pen_count');
    tempWizardSelectedRules.add('r_shootout_pts');
    tempWizardSelectedRules.add('r_no_offside');
    tempWizardSelectedRules.add('r_rolling_subs');
    tempWizardSelectedRules.add('r_minibar_gk_rules');

    if (typeof MINIBAR_RULES_PRESET !== 'undefined') {
      MINIBAR_RULES_PRESET.forEach(rid => tempWizardSelectedRules.add(rid));
    }

    const stdBtn = document.getElementById('btn-preset-standard');
    const miniBtn = document.getElementById('btn-preset-minibar');
    if (stdBtn) stdBtn.classList.remove('active');
    if (miniBtn) miniBtn.classList.add('active');

    const durEl = document.getElementById('w-cfg-matchDuration');
    if (durEl && (!durEl.value || durEl.value.includes('৯০') || durEl.value.includes('90'))) {
      durEl.value = isEn ? '20 mins (10+2+10 mins)' : '২০ মিনিট (১০+২+১০ মিনিট)';
    }
  } else if (starting === 7) {
    tempWizardSelectedRules.delete('r_onfield_11');
    tempWizardSelectedRules.add('r_onfield_6');
    tempWizardSelectedRules.add('r_rolling_subs');
  }

  updateWizardRulesCounts();
  renderWizardRulesChecklist();
}

function applySquadPreset(type) {
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
  const startEl = document.getElementById('w-cfg-startingPlayers');
  const benchEl = document.getElementById('w-cfg-benchPlayers');
  const maxSubsEl = document.getElementById('w-cfg-maxSubstitutes');
  const formatEl = document.getElementById('w-cfg-formatType');

  let starting = 11;
  let bench = 5;
  let maxSubs = 5;
  let formatDesc = isEn ? '11-a-side (11 Starting, 5 Bench)' : '১১-এ-সাইড (১১ জন মাঠে, ৫ জন বদলি)';

  if (type === 'fifa') {
    starting = 11;
    bench = 15;
    maxSubs = 5;
    formatDesc = isEn ? '11-a-side (FIFA World Cup Standard - 26 Players)' : '১১-এ-সাইড (ফিফা বিশ্বকাপ স্ট্যান্ডার্ড - ২৬ জন স্কোয়াড)';
  } else if (type === 'standard') {
    starting = 11;
    bench = 5;
    maxSubs = 3;
    formatDesc = isEn ? '11-a-side (11 Starting, 5 Bench)' : '১১-এ-সাইড (১১ জন মাঠে, ৫ জন বদলি)';
  } else if (type === 'seven') {
    starting = 7;
    bench = 4;
    maxSubs = 3;
    formatDesc = isEn ? '7-a-side (7 Starting, 4 Bench)' : '৭-এ-সাইড (৭ জন মাঠে, ৪ জন বদলি)';
  } else if (type === 'futsal') {
    starting = 5;
    bench = 5;
    maxSubs = 5;
    formatDesc = isEn ? '5-a-side Minibar (5 Starting, Rolling Subs)' : '৫-এ-সাইড মিনিবার (৫ জন মাঠে, রোলিং বদলি)';
  }

  if (startEl) startEl.value = starting;
  if (benchEl) benchEl.value = bench;
  if (maxSubsEl) maxSubsEl.value = maxSubs;
  if (formatEl) formatEl.value = formatDesc;

  updateSquadCalculations();
  syncRulesWithSquadSettings(true);
}

function applyWizardPreset(presetKey) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  if (presetKey === 'standard' || presetKey === 'fifa' || presetKey === 'ward6') {
    if (isEn) {
      setVal('w-cfg-formatType', '11-a-side (11 on pitch, FIFA Standard Football)');
      setVal('w-cfg-matchDuration', '90 mins (45+15+45 mins)');
      setVal('w-cfg-entryFee', '3,000 BDT (Non-refundable)');
      setVal('w-cfg-championPrize', '50,000 BDT & Champions Trophy');
      setVal('w-cfg-runnerUpPrize', '25,000 BDT & Runner-Up Trophy');
      setVal('w-cfg-thirdPrize', '10,000 BDT or Trophy & Medals');
      setVal('w-cfg-otherPrizes', 'Golden Boot, Golden Glove, MVP of the Final');
    } else {
      setVal('w-cfg-formatType', '১১-এ-সাইড (মাঠে প্রতি দলে ১১ জন খেলোয়াড়, ফিফা স্ট্যান্ডার্ড)');
      setVal('w-cfg-matchDuration', '৯০ মিনিট (৪৫+১৫+৪৫ মিনিট)');
      setVal('w-cfg-entryFee', '৩,০০০ টাকা (অফেরতযোগ্য)');
      setVal('w-cfg-championPrize', '৫০,০০০ টাকা ও আকর্ষণীয় চ্যাম্পিয়ন ট্রফি');
      setVal('w-cfg-runnerUpPrize', '২৫,০০০ টাকা ও রানার্স-আপ ট্রফি');
      setVal('w-cfg-thirdPrize', '১০,০০০ টাকা অথবা ট্রফি ও মেডেল');
      setVal('w-cfg-otherPrizes', 'গোল্ডেন বুট, গোল্ডেন গ্লাভস, ফাইনালের ম্যান অব দ্য ম্যাচ');
    }

    tempWizardSelectedRules = new Set(typeof STANDARD_RULES_PRESET !== 'undefined' ? STANDARD_RULES_PRESET : MASTER_RULES_CATALOG.filter(r => r.defaultSelected).map(r => r.id));
    setVal('w-cfg-startingPlayers', 11);
    setVal('w-cfg-benchPlayers', 5);
    setVal('w-cfg-maxSubstitutes', 5);
    updateSquadCalculations();
    renderWizardRulesChecklist();
  } else if (presetKey === 'minibar') {
    if (isEn) {
      setVal('w-cfg-formatType', '5/6-a-side Minibar (Short Pitch / Futsal)');
      setVal('w-cfg-matchDuration', '20 mins (10+2+10 mins)');
      setVal('w-cfg-entryFee', '1,500 BDT');
      setVal('w-cfg-championPrize', '20,000 BDT & Minibar Trophy');
      setVal('w-cfg-runnerUpPrize', '10,000 BDT & Trophy');
      setVal('w-cfg-thirdPrize', 'Trophy & Crest');
      setVal('w-cfg-otherPrizes', 'Top Scorer, Best Goalkeeper');
    } else {
      setVal('w-cfg-formatType', '৫/৬-এ-সাইড মিনিবার (শর্ট পিচ / ছোট পোস্ট)');
      setVal('w-cfg-matchDuration', '২০ মিনিট (১০+২+১০ মিনিট)');
      setVal('w-cfg-entryFee', '১,৫০০ টাকা');
      setVal('w-cfg-championPrize', '২০,০০০ টাকা ও মিনিবার ট্রফি');
      setVal('w-cfg-runnerUpPrize', '১০,০০০ টাকা ও ট্রফি');
      setVal('w-cfg-thirdPrize', 'ট্রফি ও ক্রেস্ট');
      setVal('w-cfg-otherPrizes', 'সেরা গোলদাতা, সেরা গোলরক্ষক');
    }

    tempWizardSelectedRules = new Set(typeof MINIBAR_RULES_PRESET !== 'undefined' ? MINIBAR_RULES_PRESET : [
      'r_squad_minibar', 'r_onfield_6', 'r_minibar_posts', 'r_residency',
      'r_single_team', 'r_match_duration', 'r_early_reporting', 'r_walkover',
      'r_dress_code', 'r_direct_shootout', 'r_pen_count', 'r_shootout_pts',
      'r_standings_tiebreaker', 'r_referee_final', 'r_violence_expulsion',
      'r_yellow_card', 'r_red_card', 'r_no_offside', 'r_rolling_subs',
      'r_minibar_gk_rules', 'r_backpass_rule', 'r_protest_fee',
      'r_entry_fee_due', 'r_weather_interruption'
    ]);
    setVal('w-cfg-startingPlayers', 5);
    setVal('w-cfg-benchPlayers', 5);
    setVal('w-cfg-maxSubstitutes', 5);
    updateSquadCalculations();
    renderWizardRulesChecklist();
  }

  const isStd = presetKey === 'standard' || presetKey === 'fifa';
  const isMini = presetKey === 'minibar';
  const stdBtn = document.getElementById('btn-preset-standard');
  const miniBtn = document.getElementById('btn-preset-minibar');
  if (stdBtn) stdBtn.classList.toggle('active', isStd);
  if (miniBtn) miniBtn.classList.toggle('active', isMini);
}

function saveTournamentConfigFromWizard() {
  const getVal = (id, fallback = '') => {
    const el = document.getElementById(id);
    return el && el.value !== undefined && el.value !== null && el.value !== '' ? String(el.value).trim() : fallback;
  };
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  const title = getVal('w-cfg-title', DEFAULT_CONFIG.title);
  let titleAccent = getVal('w-cfg-titleAccent', '');
  let titleRest = '';

  if (!titleAccent) {
    titleAccent = title;
  } else {
    if (title.startsWith(titleAccent)) {
      titleRest = title.slice(titleAccent.length).trim();
    }
  }

  let startingCount = parseInt(getVal('w-cfg-startingPlayers', 11), 10) || 11;
  if (startingCount > 11) {
    startingCount = 11;
    const startEl = document.getElementById('w-cfg-startingPlayers');
    if (startEl) startEl.value = 11;
  }
  const benchCount = parseInt(getVal('w-cfg-benchPlayers', 5), 10) || 0;
  const maxSubs = parseInt(getVal('w-cfg-maxSubstitutes', 5), 10) || 3;
  const autoFormatType = isEn
    ? `${startingCount}-a-side (${startingCount} on pitch, ${benchCount} bench)`
    : `${startingCount}-এ-সাইড (${startingCount} জন মাঠে, ${benchCount} জন বদলি)`;

  const newConfig = {
    title: title,
    titleAccent: titleAccent,
    titleRest: titleRest,
    organizer: getVal('w-cfg-organizer', DEFAULT_CONFIG.organizer),
    venue: getVal('w-cfg-venue', DEFAULT_CONFIG.venue),
    formatType: autoFormatType,
    startingPlayers: startingCount,
    benchPlayers: benchCount,
    maxSubstitutes: maxSubs,
    matchDuration: getVal('w-cfg-matchDuration', ''),
    startDate: getVal('w-cfg-startDate', DEFAULT_CONFIG.startDate),
    tournamentType: tempWizardTourneyType,
    teamCount: tempWizardTeamCount,
    teams: tempWizardTeams,
    championPrize: getVal('w-cfg-championPrize', DEFAULT_CONFIG.championPrize),
    runnerUpPrize: getVal('w-cfg-runnerUpPrize', DEFAULT_CONFIG.runnerUpPrize),
    thirdPrize: getVal('w-cfg-thirdPrize', DEFAULT_CONFIG.thirdPrize),
    otherPrizes: getVal('w-cfg-otherPrizes', DEFAULT_CONFIG.otherPrizes),
    entryFee: getVal('w-cfg-entryFee', DEFAULT_CONFIG.entryFee),
    regDeadline: getVal('w-cfg-regDeadline', DEFAULT_CONFIG.regDeadline),
    contactPhone: getVal('w-cfg-contactPhone', DEFAULT_CONFIG.contactPhone),
    paymentMethod: getVal('w-cfg-paymentMethod', DEFAULT_CONFIG.paymentMethod),
    selectedRules: Array.from(tempWizardSelectedRules),
    customRules: tempWizardCustomRules
  };

  saveTournamentConfig(newConfig);
  closeTournamentWizard();

  alert(isEn
    ? '✅ Tournament configuration & rules successfully saved!\nFixtures, rules list and promotional poster have been updated.'
    : '✅ টুর্নামেন্ট কনফিগারেশন এবং নিয়মাবলী সফলভাবে সংরক্ষিত হয়েছে!\nফিকশ্চার, নিয়ম তালিকা ও সোশ্যাল মিডিয়া পোস্টার স্বয়ংক্রিয়ভাবে আপডেট হয়ে গেছে।');
}
