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
      card.style.display = 'block';
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
    // KNOCKOUT BRACKET
    // ----------------------------------------------------
    if (count === 2) {
      totalMatchCount = 1;
      totalStagesCount = 1;
      stagesHtml += `
        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Final' : 'ফাইনাল'}</span>
            <span class="w-bracket-col-title">${isEn ? 'Grand Final (1 Match)' : 'মেগা ফাইনাল (১ ম্যাচ)'}</span>
          </div>
          <div class="w-bracket-matches-list">
            <div class="w-bracket-card final-card">
              <div class="w-bracket-card-head">
                <span>${isEn ? 'Grand Final' : 'মেগা ফাইনাল'}</span>
                <span>👑</span>
              </div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(tNames[0])}">${escapeHtml(tNames[0])}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(tNames[1])}">${escapeHtml(tNames[1])}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (count === 4) {
      totalMatchCount = 3;
      totalStagesCount = 2;
      stagesHtml += `
        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Semi-Finals' : 'সেমিফাইনাল'}</span>
            <span class="w-bracket-col-title">${isEn ? 'Semi-Finals (2 Matches)' : 'সেমিফাইনাল (২টি ম্যাচ)'}</span>
          </div>
          <div class="w-bracket-matches-list">
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Semi-Final 1 (Match 1)' : '১ম সেমিফাইনাল (ম্যাচ ১)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(tNames[0])}">${escapeHtml(tNames[0])}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(tNames[1])}">${escapeHtml(tNames[1])}</span>
              </div>
            </div>
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Semi-Final 2 (Match 2)' : '২য় সেমিফাইনাল (ম্যাচ ২)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(tNames[2])}">${escapeHtml(tNames[2])}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(tNames[3])}">${escapeHtml(tNames[3])}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="w-bracket-connector">
          <div class="w-connector-arrow">➔</div>
          <div class="w-connector-label">${connectorLabel}</div>
        </div>

        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Final' : 'ফাইনাল'}</span>
            <span class="w-bracket-col-title">${isEn ? 'Grand Final (1 Match)' : 'মেগা ফাইনাল (১টি ম্যাচ)'}</span>
          </div>
          <div class="w-bracket-matches-list">
            <div class="w-bracket-card final-card">
              <div class="w-bracket-card-head">
                <span>${isEn ? 'Mega Grand Final (Match 3)' : 'মেগা গ্র্যান্ড ফাইনাল (ম্যাচ ৩)'}</span>
                <span>👑</span>
              </div>
              <div class="w-bracket-matchup">
                <span class="w-team-name">${isEn ? 'Winner Semi 1' : 'বিজয়ী (সেমি ১)'}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name">${isEn ? 'Winner Semi 2' : 'বিজয়ী (সেমি ২)'}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (count === 8) {
      totalMatchCount = 7;
      totalStagesCount = 3;
      stagesHtml += `
        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Quarters' : 'কোয়ার্টার'}</span>
            <span class="w-bracket-col-title">${isEn ? 'Quarters (4 Matches)' : 'কোয়ার্টার ফাইনাল (৪টি ম্যাচ)'}</span>
          </div>
          <div class="w-bracket-matches-list">
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Quarter 1 (Match 1)' : '১ম কোয়ার্টার (ম্যাচ ১)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(tNames[0])}">${escapeHtml(tNames[0])}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(tNames[1])}">${escapeHtml(tNames[1])}</span>
              </div>
            </div>
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Quarter 2 (Match 2)' : '২য় কোয়ার্টার (ম্যাচ ২)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(tNames[2])}">${escapeHtml(tNames[2])}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(tNames[3])}">${escapeHtml(tNames[3])}</span>
              </div>
            </div>
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Quarter 3 (Match 3)' : '৩য় কোয়ার্টার (ম্যাচ ৩)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(tNames[4])}">${escapeHtml(tNames[4])}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(tNames[5])}">${escapeHtml(tNames[5])}</span>
              </div>
            </div>
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Quarter 4 (Match 4)' : '৪র্থ কোয়ার্টার (ম্যাচ ৪)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(tNames[6])}">${escapeHtml(tNames[6])}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(tNames[7])}">${escapeHtml(tNames[7])}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="w-bracket-connector">
          <div class="w-connector-arrow">➔</div>
          <div class="w-connector-label">${connectorLabel}</div>
        </div>

        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Semi-Finals' : 'সেমিফাইনাল'}</span>
            <span class="w-bracket-col-title">${isEn ? 'Semi-Finals (2 Matches)' : 'সেমিফাইনাল (২টি ম্যাচ)'}</span>
          </div>
          <div class="w-bracket-matches-list">
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Semi 1 (Match 5)' : '১ম সেমিফাইনাল (ম্যাচ ৫)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name">${isEn ? 'Winner QF 1' : 'বিজয়ী (কোয়ার্টার ১)'}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name">${isEn ? 'Winner QF 2' : 'বিজয়ী (কোয়ার্টার ২)'}</span>
              </div>
            </div>
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Semi 2 (Match 6)' : '২য় সেমিফাইনাল (ম্যাচ ৬)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name">${isEn ? 'Winner QF 3' : 'বিজয়ী (কোয়ার্টার ৩)'}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name">${isEn ? 'Winner QF 4' : 'বিজয়ী (কোয়ার্টার ৪)'}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="w-bracket-connector">
          <div class="w-connector-arrow">➔</div>
          <div class="w-connector-label">${connectorLabel}</div>
        </div>

        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Final' : 'ফাইনাল'}</span>
            <span class="w-bracket-col-title">${isEn ? 'Grand Final (1 Match)' : 'মেগা ফাইনাল (১টি ম্যাচ)'}</span>
          </div>
          <div class="w-bracket-matches-list">
            <div class="w-bracket-card final-card">
              <div class="w-bracket-card-head">
                <span>${isEn ? 'Mega Grand Final (Match 7)' : 'মেগা গ্র্যান্ড ফাইনাল (ম্যাচ ৭)'}</span>
                <span>👑</span>
              </div>
              <div class="w-bracket-matchup">
                <span class="w-team-name">${isEn ? 'Winner Semi 1' : 'বিজয়ী (সেমি ১)'}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name">${isEn ? 'Winner Semi 2' : 'বিজয়ী (সেমি ২)'}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (count === 5) {
      totalMatchCount = 5;
      totalStagesCount = 3;
      stagesHtml += `
        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Playoffs' : 'প্লে-অফ'}</span>
            <span class="w-bracket-col-title">${isEn ? 'Opening Round (2 Matches)' : 'প্রাথমিক রাউন্ড (২টি ম্যাচ)'}</span>
          </div>
          <div class="w-bracket-matches-list">
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Match 1' : 'ম্যাচ ১ (নকআউট)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(tNames[0])}">${escapeHtml(tNames[0])}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(tNames[1])}">${escapeHtml(tNames[1])}</span>
              </div>
            </div>
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Match 2' : 'ম্যাচ ২ (নকআউট)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(tNames[2])}">${escapeHtml(tNames[2])}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(tNames[3])}">${escapeHtml(tNames[3])}</span>
              </div>
            </div>
            <div class="w-bracket-card" style="border-style:dashed;">
              <div class="w-bracket-card-head"><span>${isEn ? 'Direct Bye' : 'সরাসরি বাই (দল ৫)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(tNames[4])}">${escapeHtml(tNames[4])}</span>
                <span class="w-vs-pill" style="background:#e0e7ff; color:#3730a3;">BYE</span>
                <span class="w-team-name" style="color:#64748b;">${isEn ? 'Bye to Semi' : 'সরাসরি সেমিতে'}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="w-bracket-connector">
          <div class="w-connector-arrow">➔</div>
          <div class="w-connector-label">${connectorLabel}</div>
        </div>

        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Semi-Finals' : 'সেমিফাইনাল'}</span>
            <span class="w-bracket-col-title">${isEn ? 'Semi-Finals (2 Matches)' : 'সেমিফাইনাল (২টি ম্যাচ)'}</span>
          </div>
          <div class="w-bracket-matches-list">
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Semi 1' : '১ম সেমিফাইনাল (ম্যাচ ৩)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name">${isEn ? 'Winner Match 1' : 'বিজয়ী (ম্যাচ ১)'}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(tNames[4])}">${escapeHtml(tNames[4])}</span>
              </div>
            </div>
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Semi 2' : '২য় সেমিফাইনাল (ম্যাচ ৪)'}</span></div>
              <div class="w-bracket-matchup">
                <span class="w-team-name">${isEn ? 'Winner Match 2' : 'বিজয়ী (ম্যাচ ২)'}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name">${isEn ? 'Best Lucky Loser' : 'সেরা লাকি লুজার'}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="w-bracket-connector">
          <div class="w-connector-arrow">➔</div>
          <div class="w-connector-label">${connectorLabel}</div>
        </div>

        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Final' : 'ফাইনাল'}</span>
            <span class="w-bracket-col-title">${isEn ? 'Grand Final (1 Match)' : 'মেগা ফাইনাল (১টি ম্যাচ)'}</span>
          </div>
          <div class="w-bracket-matches-list">
            <div class="w-bracket-card final-card">
              <div class="w-bracket-card-head">
                <span>${isEn ? 'Mega Grand Final' : 'মেগা গ্র্যান্ড ফাইনাল (ম্যাচ ৫)'}</span>
                <span>👑</span>
              </div>
              <div class="w-bracket-matchup">
                <span class="w-team-name">${isEn ? 'Winner Semi 1' : 'বিজয়ী (সেমি ১)'}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name">${isEn ? 'Winner Semi 2' : 'বিজয়ী (সেমি ২)'}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      const openMatches = [];
      let mIdx = 1;
      for (let i = 0; i < count; i += 2) {
        if (i + 1 < count) {
          openMatches.push({ head: isEn ? `Match ${mIdx}` : `ম্যাচ ${mIdx}`, t1: tNames[i], t2: tNames[i + 1] });
          mIdx++;
        }
      }
      totalMatchCount = openMatches.length + 3;
      totalStagesCount = 3;
      stagesHtml += `
        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Stage 1' : 'ধাপ ১'}</span>
            <span class="w-bracket-col-title">${isEn ? `Opening (${openMatches.length} Matches)` : `প্রাথমিক রাউন্ড (${openMatches.length}টি ম্যাচ)`}</span>
          </div>
          <div class="w-bracket-matches-list">
            ${openMatches.map(m => `
              <div class="w-bracket-card">
                <div class="w-bracket-card-head"><span>${escapeHtml(m.head)}</span></div>
                <div class="w-bracket-matchup">
                  <span class="w-team-name">${escapeHtml(m.t1)}</span>
                  <span class="w-vs-pill">VS</span>
                  <span class="w-team-name">${escapeHtml(m.t2)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="w-bracket-connector"><div class="w-connector-arrow">➔</div><div class="w-connector-label">${connectorLabel}</div></div>

        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Semi-Finals' : 'সেমিফাইনাল'}</span>
            <span class="w-bracket-col-title">${isEn ? 'Semi-Finals (2 Matches)' : 'সেমিফাইনাল (২টি ম্যাচ)'}</span>
          </div>
          <div class="w-bracket-matches-list">
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Semi 1' : '১ম সেমিফাইনাল'}</span></div>
              <div class="w-bracket-matchup"><span class="w-team-name">${isEn ? 'Winner 1' : 'বিজয়ী ১'}</span><span class="w-vs-pill">VS</span><span class="w-team-name">${isEn ? 'Winner 2' : 'বিজয়ী ২'}</span></div>
            </div>
            <div class="w-bracket-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Semi 2' : '২য় সেমিফাইনাল'}</span></div>
              <div class="w-bracket-matchup"><span class="w-team-name">${isEn ? 'Winner 3' : 'বিজয়ী ৩'}</span><span class="w-vs-pill">VS</span><span class="w-team-name">${isEn ? 'Winner 4' : 'বিজয়ী ৪'}</span></div>
            </div>
          </div>
        </div>

        <div class="w-bracket-connector"><div class="w-connector-arrow">➔</div><div class="w-connector-label">${connectorLabel}</div></div>

        <div class="w-bracket-column">
          <div class="w-bracket-col-header">
            <span class="w-bracket-col-badge">${isEn ? 'Final' : 'ফাইনাল'}</span>
            <span class="w-bracket-col-title">${isEn ? 'Grand Final (1 Match)' : 'মেগা ফাইনাল (১টি ম্যাচ)'}</span>
          </div>
          <div class="w-bracket-matches-list">
            <div class="w-bracket-card final-card">
              <div class="w-bracket-card-head"><span>${isEn ? 'Grand Final' : 'মেগা গ্র্যান্ড ফাইনাল'}</span><span>👑</span></div>
              <div class="w-bracket-matchup"><span class="w-team-name">${isEn ? 'Winner Semi 1' : 'বিজয়ী সেমি ১'}</span><span class="w-vs-pill">VS</span><span class="w-team-name">${isEn ? 'Winner Semi 2' : 'বিজয়ী সেমি ২'}</span></div>
            </div>
          </div>
        </div>
      `;
    }

  } else if (type === 'league') {
    // ----------------------------------------------------
    // SINGLE LEAGUE TABLE
    // ----------------------------------------------------
    const allMatches = struct.matches || [];
    totalMatchCount = allMatches.length + 1; // league + final
    totalStagesCount = 2;

    stagesHtml += `
      <div class="w-bracket-column" style="min-width:240px; max-width:280px;">
        <div class="w-bracket-col-header">
          <span class="w-bracket-col-badge">${isEn ? 'Stage 1' : 'ধাপ ১'}</span>
          <span class="w-bracket-col-title">${isEn ? `Single League Stage (${allMatches.length} Matches)` : `একক লিগ টেবিল পর্ব (মোট ${allMatches.length}টি ম্যাচ)`}</span>
        </div>
        <div class="w-bracket-matches-list">
          ${allMatches.map(m => `
            <div class="w-bracket-card" data-group="League">
              <div class="w-bracket-card-head">
                <span>${isEn ? `Match ${m.id} • League` : `ম্যাচ ${m.id} • লিগ`}</span>
              </div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(m.t1)}">${escapeHtml(m.t1)}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(m.t2)}">${escapeHtml(m.t2)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="w-bracket-connector">
        <div class="w-connector-arrow">➔</div>
        <div class="w-connector-label">${isEn ? 'Top 2 Teams' : 'শীর্ষ ২ দল'}</div>
      </div>

      <div class="w-bracket-column">
        <div class="w-bracket-col-header">
          <span class="w-bracket-col-badge">${isEn ? 'Final' : 'ফাইনাল'}</span>
          <span class="w-bracket-col-title">${isEn ? 'Grand Final (1 Match)' : 'মেগা ফাইনাল (১টি ম্যাচ)'}</span>
        </div>
        <div class="w-bracket-matches-list">
          <div class="w-bracket-card final-card">
            <div class="w-bracket-card-head">
              <span>${isEn ? 'Mega Grand Final' : 'মেগা গ্র্যান্ড ফাইনাল'}</span>
              <span>👑</span>
            </div>
            <div class="w-bracket-matchup">
              <span class="w-team-name">${isEn ? '🥇 1st in Table' : '🥇 পয়েন্ট টেবিল ১ম স্থান'}</span>
              <span class="w-vs-pill">VS</span>
              <span class="w-team-name">${isEn ? '🥈 2nd in Table' : '🥈 পয়েন্ট টেবিল ২য় স্থান'}</span>
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

    // Filter Buttons HTML if multiple groups
    let filterBarHtml = '';
    if (grpKeys.length > 1) {
      filterBarHtml = `
        <div class="w-group-filter-bar">
          <button type="button" class="w-grp-filter-btn active" onclick="filterBracketGroup('all', this)">${isEn ? `All (${allGroupMatches.length})` : `সব (${allGroupMatches.length}টি)`}</button>
          ${grpKeys.map(g => {
            const grpCount = allGroupMatches.filter(m => m.group === g).length;
            return `<button type="button" class="w-grp-filter-btn" onclick="filterBracketGroup('${g}', this)">${isEn ? `Grp ${g} (${grpCount})` : `গ্রুপ ${g} (${grpCount})`}</button>`;
          }).join('')}
        </div>
      `;
    }

    // Render Stage 1: Group Stage with ALL matches grouped cleanly!
    let groupMatchesHtml = '';
    grpKeys.forEach(g => {
      const gMatches = allGroupMatches.filter(m => m.group === g);
      if (gMatches.length > 0) {
        groupMatchesHtml += `
          <div class="w-bracket-group-title" data-group="${g}">
            <span>${isEn ? `Group ${g} (${gMatches.length} Matches)` : `গ্রুপ ${g} (${gMatches.length}টি ম্যাচ)`}</span>
            <span>⚽</span>
          </div>
        `;
        gMatches.forEach(m => {
          groupMatchesHtml += `
            <div class="w-bracket-card" data-group="${g}">
              <div class="w-bracket-card-head">
                <span>${isEn ? `Match ${m.id} • Group ${g}` : `ম্যাচ ${m.id} • গ্রুপ ${g}`}</span>
              </div>
              <div class="w-bracket-matchup">
                <span class="w-team-name" title="${escapeHtml(m.t1)}">${escapeHtml(m.t1)}</span>
                <span class="w-vs-pill">VS</span>
                <span class="w-team-name" title="${escapeHtml(m.t2)}">${escapeHtml(m.t2)}</span>
              </div>
            </div>
          `;
        });
      }
    });

    // Semis & Final match descriptions based on group count
    let semi1_t1 = isEn ? 'Group A Winner (A1)' : 'গ্রুপ এ ১ম (A1)';
    let semi1_t2 = isEn ? 'Group B Runner-Up (B2)' : 'গ্রুপ বি ২য় (B2)';
    let semi2_t1 = isEn ? 'Group B Winner (B1)' : 'গ্রুপ বি ১ম (B1)';
    let semi2_t2 = isEn ? 'Group A Runner-Up (A2)' : 'গ্রুপ এ ২য় (A2)';

    if (grpKeys.length === 3) {
      semi1_t1 = isEn ? 'Group A Champion' : 'গ্রুপ এ চ্যাম্পিয়ন';
      semi1_t2 = isEn ? 'Best Runner-Up' : 'সেরা রানার্স-আপ';
      semi2_t1 = isEn ? 'Group B Champion' : 'গ্রুপ বি চ্যাম্পিয়ন';
      semi2_t2 = isEn ? 'Group C Champion' : 'গ্রুপ সি চ্যাম্পিয়ন';
    } else if (grpKeys.length === 4) {
      semi1_t1 = isEn ? 'Group A Winner (A1)' : 'গ্রুপ এ ১ম (A1)';
      semi1_t2 = isEn ? 'Group B Winner (B1)' : 'গ্রুপ বি ১ম (B1)';
      semi2_t1 = isEn ? 'Group C Winner (C1)' : 'গ্রুপ সি ১ম (C1)';
      semi2_t2 = isEn ? 'Group D Winner (D1)' : 'গ্রুপ ডি ১ম (D1)';
    }

    stagesHtml += `
      <!-- STAGE 1: GROUP STAGE -->
      <div class="w-bracket-column" style="min-width:230px; max-width:270px;">
        <div class="w-bracket-col-header">
          <span class="w-bracket-col-badge">${isEn ? 'Stage 1' : 'ধাপ ১'}</span>
          <span class="w-bracket-col-title">${isEn ? `Group Stage (Total ${allGroupMatches.length} Matches)` : `গ্রুপ পর্ব (মোট ${allGroupMatches.length}টি ম্যাচ)`}</span>
        </div>
        ${filterBarHtml}
        <div class="w-bracket-matches-list">
          ${groupMatchesHtml}
        </div>
      </div>

      <div class="w-bracket-connector">
        <div class="w-connector-arrow">➔</div>
        <div class="w-connector-label">${isEn ? 'Top Teams' : 'শীর্ষ দল'}</div>
      </div>

      <!-- STAGE 2: SEMI-FINALS -->
      <div class="w-bracket-column">
        <div class="w-bracket-col-header">
          <span class="w-bracket-col-badge">${isEn ? 'Semi-Finals' : 'সেমিফাইনাল'}</span>
          <span class="w-bracket-col-title">${isEn ? 'Semi-Finals (2 Matches)' : 'সেমিফাইনাল (২টি ম্যাচ)'}</span>
        </div>
        <div class="w-bracket-matches-list">
          <div class="w-bracket-card">
            <div class="w-bracket-card-head">
              <span>${isEn ? `Semi-Final 1 (Match ${allGroupMatches.length + 1})` : `১ম সেমিফাইনাল (ম্যাচ ${allGroupMatches.length + 1})`}</span>
            </div>
            <div class="w-bracket-matchup">
              <span class="w-team-name" title="${semi1_t1}">${semi1_t1}</span>
              <span class="w-vs-pill">VS</span>
              <span class="w-team-name" title="${semi1_t2}">${semi1_t2}</span>
            </div>
          </div>
          <div class="w-bracket-card">
            <div class="w-bracket-card-head">
              <span>${isEn ? `Semi-Final 2 (Match ${allGroupMatches.length + 2})` : `২য় সেমিফাইনাল (ম্যাচ ${allGroupMatches.length + 2})`}</span>
            </div>
            <div class="w-bracket-matchup">
              <span class="w-team-name" title="${semi2_t1}">${semi2_t1}</span>
              <span class="w-vs-pill">VS</span>
              <span class="w-team-name" title="${semi2_t2}">${semi2_t2}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="w-bracket-connector">
        <div class="w-connector-arrow">➔</div>
        <div class="w-connector-label">${connectorLabel}</div>
      </div>

      <!-- STAGE 3: GRAND FINAL -->
      <div class="w-bracket-column">
        <div class="w-bracket-col-header">
          <span class="w-bracket-col-badge">${isEn ? 'Final' : 'ফাইনাল'}</span>
          <span class="w-bracket-col-title">${isEn ? 'Grand Final (1 Match)' : 'মেগা ফাইনাল (১টি ম্যাচ)'}</span>
        </div>
        <div class="w-bracket-matches-list">
          <div class="w-bracket-card final-card">
            <div class="w-bracket-card-head">
              <span>${isEn ? `Grand Final (Match ${allGroupMatches.length + 3})` : `মেগা গ্র্যান্ড ফাইনাল (ম্যাচ ${allGroupMatches.length + 3})`}</span>
              <span>👑</span>
            </div>
            <div class="w-bracket-matchup">
              <span class="w-team-name">${isEn ? 'Winner Semi 1' : 'বিজয়ী (সেমি ১)'}</span>
              <span class="w-vs-pill">VS</span>
              <span class="w-team-name">${isEn ? 'Winner Semi 2' : 'বিজয়ী (সেমি ২)'}</span>
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

  // Add Final Champion Trophy Column
  stagesHtml += `
    <div class="w-bracket-connector">
      <div class="w-connector-arrow">➔</div>
      <div class="w-connector-label">${isEn ? 'Champion' : 'চ্যাম্পিয়ন'}</div>
    </div>
    <div class="w-bracket-column trophy-column">
      <div class="w-trophy-card">
        <div class="w-trophy-icon">🏆</div>
        <div class="w-trophy-title">${isEn ? 'CHAMPION' : 'মেগা চ্যাম্পিয়ন'}</div>
        <div class="w-trophy-sub">${isEn ? 'Winner of Grand Final' : 'ফাইনালের বিজয়ী দল'}</div>
      </div>
    </div>
  `;

  container.innerHTML = stagesHtml;
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
}

function applyWizardPreset(presetKey) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

  if (presetKey === 'standard' || presetKey === 'fifa' || presetKey === 'ward6') {
    if (isEn) {
      setVal('w-cfg-formatType', '11-a-side (11 on pitch, Standard Football)');
      setVal('w-cfg-matchDuration', '');
      setVal('w-cfg-entryFee', '3,000 BDT (Non-refundable)');
      setVal('w-cfg-championPrize', '50,000 BDT & Champions Trophy');
      setVal('w-cfg-runnerUpPrize', '25,000 BDT & Runner-Up Trophy');
      setVal('w-cfg-thirdPrize', '10,000 BDT or Trophy & Medals');
      setVal('w-cfg-otherPrizes', 'Golden Boot, Golden Glove, MVP of the Final');
    } else {
      setVal('w-cfg-formatType', '১১-এ-সাইড (প্রতি দলে ১১ জন মাঠে)');
      setVal('w-cfg-matchDuration', '');
      setVal('w-cfg-entryFee', '৩,০০০ টাকা (অফেরতযোগ্য)');
      setVal('w-cfg-championPrize', '৫০,০০০ টাকা ও আকর্ষণীয় চ্যাম্পিয়ন ট্রফি');
      setVal('w-cfg-runnerUpPrize', '২৫,০০০ টাকা ও রানার্স-আপ ট্রফি');
      setVal('w-cfg-thirdPrize', '১০,০০০ টাকা অথবা ট্রফি ও মেডেল');
      setVal('w-cfg-otherPrizes', 'গোল্ডেন বুট, গোল্ডেন গ্লাভস, ফাইনালের ম্যান অব দ্য ম্যাচ');
    }

    tempWizardSelectedRules = new Set(typeof STANDARD_RULES_PRESET !== 'undefined' ? STANDARD_RULES_PRESET : MASTER_RULES_CATALOG.filter(r => r.defaultSelected).map(r => r.id));
    setVal('w-cfg-startingPlayers', 11);
    setVal('w-cfg-benchPlayers', 5);
    setVal('w-cfg-maxSubstitutes', 3);
    updateSquadCalculations();
    renderWizardRulesChecklist();
  } else if (presetKey === 'minibar') {
    if (isEn) {
      setVal('w-cfg-formatType', '5-a-side Minibar (Short Pitch / Futsal)');
      setVal('w-cfg-matchDuration', '15 mins (7+1+7 mins)');
      setVal('w-cfg-entryFee', '1,500 BDT');
      setVal('w-cfg-championPrize', '20,000 BDT & Minibar Trophy');
      setVal('w-cfg-runnerUpPrize', '10,000 BDT & Trophy');
      setVal('w-cfg-thirdPrize', 'Trophy & Crest');
      setVal('w-cfg-otherPrizes', 'Top Scorer, Best Goalkeeper');
    } else {
      setVal('w-cfg-formatType', '৫-এ-সাইড মিনিবার (শর্ট পিচ / ফুটসাল)');
      setVal('w-cfg-matchDuration', '১৫ মিনিট (৭+১+৭ মিনিট)');
      setVal('w-cfg-entryFee', '১,৫০০ টাকা');
      setVal('w-cfg-championPrize', '২০,০০০ টাকা ও মিনিবার ট্রফি');
      setVal('w-cfg-runnerUpPrize', '১০,০০০ টাকা ও ট্রফি');
      setVal('w-cfg-thirdPrize', 'ট্রফি ও ক্রেস্ট');
      setVal('w-cfg-otherPrizes', 'সেরা গোলদাতা, সেরা গোলরক্ষক');
    }

    tempWizardSelectedRules = new Set(typeof MINIBAR_RULES_PRESET !== 'undefined' ? MINIBAR_RULES_PRESET : [
      'r_squad_11', 'r_onfield_6', 'r_match_duration', 'r_early_reporting',
      'r_walkover', 'r_direct_shootout', 'r_pen_count', 'r_shootout_pts',
      'r_standings_tiebreaker', 'r_referee_final', 'r_yellow_card', 'r_red_card',
      'r_rolling_subs', 'r_no_offside', 'r_backpass_rule', 'r_protest_fee'
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
