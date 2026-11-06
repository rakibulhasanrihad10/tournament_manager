// ========================================================
// CONSTANTS & MASTER DATA DEFINITIONS
// ========================================================

// ========================================================
// TOURNAMENT APPLICATION ENGINE (CHITADDA 2026 - PRO PRO-MAX)
// Master Roster + Auto Golden Boot + Fair Play (Cards)
// ========================================================

// MASTER RULES CATALOG (Universal Football & Minibar Tournament Rules)
const MASTER_RULES_CATALOG = [
  // ১. দল গঠন ও খেলোয়াড় যোগ্যতা (Squad & Eligibility)
  {
    id: 'r_squad_minibar',
    category: 'দল গঠন ও খেলোয়াড় যোগ্যতা',
    categoryEn: 'Squad & Eligibility',
    categoryIcon: '👥',
    title: 'স্কোয়াড ও মাঠের খেলোয়াড় সংখ্যা',
    titleEn: 'Squad Size & Active Players',
    desc: 'প্রতি দলে সর্বোচ্চ {totalSquad} জন নিবন্ধিত খেলোয়াড় থাকবে (মাঠে {startingPlayers} জন ও বেঞ্চে {benchPlayers} জন)।',
    descEn: 'Each squad may register up to {totalSquad} players ({startingPlayers} on-field and {benchPlayers} substitutes).',
    defaultSelected: true
  },
  {
    id: 'r_residency',
    category: 'দল গঠন ও খেলোয়াড় যোগ্যতা',
    categoryEn: 'Squad & Eligibility',
    categoryIcon: '👥',
    title: 'স্থায়ী বাসিন্দা শর্ত',
    titleEn: 'Permanent Residency Requirement',
    desc: 'খেলোয়াড়কে সংশ্লিষ্ট এলাকা/ওয়ার্ডের স্থায়ী বাসিন্দা হতে হবে (প্রয়োজনে আইডি কার্ড যাচাইযোগ্য)।',
    descEn: 'Players must be permanent residents of the respective area or ward (ID verification required if requested).',
    defaultSelected: true
  },
  {
    id: 'r_single_team',
    category: 'দল গঠন ও খেলোয়াড় যোগ্যতা',
    categoryEn: 'Squad & Eligibility',
    categoryIcon: '👥',
    title: 'একক দলে অংশগ্রহণ',
    titleEn: 'Single-Team Participation',
    desc: 'একজন খেলোয়াড় কেবল একটি দলের হয়েই খেলতে পারবেন (একাধিক দলে খেললে সংশ্লিষ্ট দল বাতিল)।',
    descEn: 'A player may only represent a single team (playing for multiple teams results in team disqualification).',
    defaultSelected: true
  },

  // ২. ম্যাচের সময় ও রিপোর্টিং (Match Timing & Reporting)
  {
    id: 'r_match_duration',
    category: 'ম্যাচের সময় ও রিপোর্টিং',
    categoryEn: 'Match Timing & Reporting',
    categoryIcon: '⏱️',
    title: 'ম্যাচের সময়কাল',
    titleEn: 'Match Duration',
    desc: 'ম্যাচের নির্ধারিত সময়কাল মোট {matchDurationTotal} মিনিট (প্রথমার্ধ {half1} মিনিট, মধ্যবিরতি {breakTime} মিনিট, দ্বিতীয়ার্ধ {half2} মিনিট)। ইনজুরি সময় রেফারির বিবেচনায় যোগ হবে।',
    descEn: 'Regulation match duration is {matchDurationTotal} minutes ({half1} min 1st half, {breakTime} min break, {half2} min 2nd half) plus referee stoppage time.',
    defaultSelected: true
  },
  {
    id: 'r_walkover',
    category: 'ম্যাচের সময় ও রিপোর্টিং',
    categoryEn: 'Match Timing & Reporting',
    categoryIcon: '⏱️',
    title: 'ওয়াকওভার ও অনুপস্থিতি',
    titleEn: 'Walkover & Forfeit',
    desc: 'নির্ধারিত সময়ের পর সর্বোচ্চ ১৫ মিনিট অপেক্ষা করা হবে; দল অনুপস্থিত থাকলে বিপক্ষ দলকে ৩-০ গোলে বিজয়ী ঘোষণা করা হবে (ফিফা ডিসিপ্লিনারি কোড রুল ২২/৩১ অনুযায়ী)।',
    descEn: 'Grace period is 15 minutes after kickoff time. If a team fails to report, a 3-0 walkover is awarded to the opponent (per FIFA Disciplinary Code Art. 22/31).',
    defaultSelected: true
  },

  // ৩. ড্র নিষ্পত্তি ও টাইব্রেকার (Draws & Tiebreakers)
  {
    id: 'r_fifa_points',
    category: 'ড্র নিষ্পত্তি ও টাইব্রেকার',
    categoryEn: 'Draws & Tiebreakers',
    categoryIcon: '🎯',
    title: 'গ্রুপ পর্বের পয়েন্ট নীতি (৩-১-০)',
    titleEn: 'Group Stage Points Policy (3-1-0)',
    desc: 'গ্রুপ পর্ব ও লিগের খেলায় জয়ী দল ৩ পয়েন্ট, ড্র হলে উভয় দল ১ পয়েন্ট এবং পরাজিত দল ০ পয়েন্ট পাবে।',
    descEn: 'In group and league matches, 3 points are awarded for a win, 1 point for a draw, and 0 for a defeat.',
    defaultSelected: true
  },
  {
    id: 'r_direct_shootout',
    category: 'ড্র নিষ্পত্তি ও টাইব্রেকার',
    categoryEn: 'Draws & Tiebreakers',
    categoryIcon: '🎯',
    title: 'ম্যাচ ড্র ও সরাসরি টাইব্রেকার',
    titleEn: 'Match Draw & Direct Shootout',
    desc: 'নির্ধারিত সময়ে খেলা ড্র হলে কোনো অতিরিক্ত সময় ছাড়া সরাসরি পেনাল্টি শুটআউট হবে। উভয় দল {penaltyKicks}টি করে শট নেবে; সমতা থাকলে সাডেন ডেথ পদ্ধতিতে (১টি করে শটে) নিষ্পত্তি হবে।',
    descEn: 'If a match is tied at full time, it proceeds directly to a penalty shootout without extra time. Each team takes {penaltyKicks} penalty kicks; if tied, sudden-death kicks decide.',
    defaultSelected: true
  },

  // ৪. পয়েন্ট টেবিল ও অবস্থান নির্ধারণ (Standings & Tiebreaker Order)
  {
    id: 'r_standings_tiebreaker',
    category: 'পয়েন্ট টেবিল ও অবস্থান নির্ধারণ',
    categoryEn: 'Standings & Tiebreakers',
    categoryIcon: '📊',
    title: 'পয়েন্ট সমতার ক্ষেত্রে অবস্থান নির্ধারণ',
    titleEn: 'Standings Tiebreaker Hierarchy',
    desc: 'গ্রুপ পর্বে একাধিক দলের পয়েন্ট সমান হলে যথাক্রমে: ১. গোল ব্যবধান (GD), ২. সর্বাধিক গোল দেওয়ার সংখ্যা (GF), ৩. হেড-টু-হেড ফলাফল এবং ৪. ফেয়ার প্লে ডিসিপ্লিনারি রেকর্ড বিবেচনা করে চূড়ান্ত অবস্থান নির্ধারিত হবে (ফিফা অফিশিয়াল নিয়ম অনুযায়ী)।',
    descEn: 'If points are tied in a group, ranking is decided by: 1. Goal Difference (GD), 2. Goals For (GF), 3. Head-to-head record, 4. Fair Play record (per official FIFA regulations).',
    defaultSelected: true
  },

  // ৫. শৃঙ্খলা ও রেফারির সিদ্ধান্ত (Discipline & Fair Play)
  {
    id: 'r_referee_final',
    category: 'শৃঙ্খলা ও রেফারির সিদ্ধান্ত',
    categoryEn: 'Discipline & Fair Play',
    categoryIcon: '⚖️',
    title: 'রেফারির সিদ্ধান্ত ও শৃঙ্খলা নীতি',
    titleEn: 'Referee Authority & Code of Conduct',
    desc: 'মাঠে রেফারির সিদ্ধান্তই চূড়ান্ত বলে গণ্য হবে। কোনো ধরনের মারামারি, অশালীন আচরণ, গালিগালাজ বা রেফারির সিদ্ধান্তে অসন্তোষ দেখিয়ে খেলা বিঘ্নিত করলে সংশ্লিষ্ট দলকে টুর্নামেন্ট থেকে স্থায়ী বহিষ্কার ও এন্ট্রি ফি বাজেয়াপ্ত করা হবে।',
    descEn: 'The referee decision is final. Any violent conduct, dissent, foul language, or match disruption will result in immediate team expulsion and forfeiture of entry fee.',
    defaultSelected: true
  },
  {
    id: 'r_yellow_card',
    category: 'শৃঙ্খলা ও রেফারির সিদ্ধান্ত',
    categoryEn: 'Discipline & Fair Play',
    categoryIcon: '⚖️',
    title: 'কার্ড ও ফেয়ার প্লে নীতি',
    titleEn: 'Cards & Fair Play Policy',
    desc: 'প্রতিটি হলুদ কার্ডে ১ ও লাল কার্ডে ৩ ফেয়ার প্লে পয়েন্ট কর্তন হবে (এক ম্যাচে ২ হলুদ কার্ড = লাল কার্ড)। লাল কার্ডপ্রাপ্ত খেলোয়াড় পরবর্তী ১ ম্যাচ নিষিদ্ধ থাকবেন।',
    descEn: 'Each yellow card deducts 1 point and a red card deducts 3 Fair Play points (2 yellows = 1 red). A player receiving a red card is suspended for the next match.',
    defaultSelected: true
  },

  // ৬. অভিযোগ ও জরুরি নীতি (Emergency & Contingencies)
  {
    id: 'r_weather_interruption',
    category: 'অভিযোগ ও জরুরি নীতি',
    categoryEn: 'Emergency & Contingencies',
    categoryIcon: '🛡️',
    title: 'প্রাকৃতিক দুর্যোগ ও বৃষ্টি নীতি',
    titleEn: 'Weather & Interruption Policy',
    desc: 'প্রাকৃতিক কারণে বা আলো স্বল্পতায় খেলা বন্ধ হলে আয়োজক কমিটির সিদ্ধান্ত অনুযায়ী বাকি খেলা পরবর্তী দিনে অনুষ্ঠিত হবে বা ড্র নিষ্পত্তির সিদ্ধান্ত নেওয়া হবে।',
    descEn: 'In case of severe rain, force majeure, or low light, the committee will reschedule remaining play or apply tiebreaker provisions.',
    defaultSelected: true
  }
];

function formatDynamicRuleText(text, cfg, isEn) {
  if (!text || typeof text !== 'string') return text || '';
  const c = cfg || (typeof tournamentConfig !== 'undefined' ? tournamentConfig : {});
  const starting = Number(c.startingPlayers) || 11;
  const bench = Number(c.benchPlayers) || 5;
  const total = starting + bench;
  const maxSubs = Number(c.maxSubstitutes) || 5;
  const toBn = (n) => String(n).replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[d]);
  const toEn = (s) => String(s).replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));

  const sStr = isEn ? String(starting) : toBn(starting);
  const bStr = isEn ? String(bench) : toBn(bench);
  const tStr = isEn ? String(total) : toBn(total);
  const subStr = isEn ? String(maxSubs) : toBn(maxSubs);

  // Parse or extract half1, half2, break, total duration
  let h1 = 0, h2 = 0, brk = 0, totalMin = 0;
  if (typeof document !== 'undefined') {
    const h1El = document.getElementById('w-cfg-half1');
    const h2El = document.getElementById('w-cfg-half2');
    const brkEl = document.getElementById('w-cfg-break');
    if (h1El && h1El.value) h1 = parseInt(h1El.value, 10);
    if (h2El && h2El.value) h2 = parseInt(h2El.value, 10);
    if (brkEl && brkEl.value !== '') brk = parseInt(brkEl.value, 10);
  }

  if (c.half1) h1 = parseInt(c.half1, 10);
  if (c.half2) h2 = parseInt(c.half2, 10);
  if (c.break !== undefined && c.break !== '') brk = parseInt(c.break, 10);

  const rawDur = c.matchDuration || '';
  if (!h1 && rawDur) {
    const norm = toEn(rawDur);
    const m = norm.match(/(\d+)\s*\+\s*(?:(\d+)\s*\+\s*)?(\d+)/);
    if (m) {
      h1 = parseInt(m[1], 10);
      if (m[2]) {
        brk = parseInt(m[2], 10);
        h2 = parseInt(m[3], 10);
      } else {
        h2 = parseInt(m[3], 10);
      }
    } else {
      const singleM = norm.match(/(\d+)/);
      if (singleM) {
        totalMin = parseInt(singleM[1], 10);
        h1 = Math.round(totalMin / 2);
        h2 = totalMin - h1;
      }
    }
  }

  if (!h1) {
    if (starting <= 6) {
      h1 = 10; h2 = 10; brk = 2;
    } else {
      h1 = 45; h2 = 45; brk = 15;
    }
  }
  if (!totalMin) totalMin = h1 + h2;

  const totalMinStr = isEn ? String(totalMin) : toBn(totalMin);
  const h1Str = isEn ? String(h1) : toBn(h1);
  const h2Str = isEn ? String(h2) : toBn(h2);
  const brkStr = isEn ? String(brk) : toBn(brk);

  const kicksNum = starting >= 11 ? 5 : 3;
  const kicksStr = isEn ? String(kicksNum) : toBn(kicksNum);

  let formatted = text
    .replace(/\{totalSquad\}/g, tStr)
    .replace(/\{startingPlayers\}/g, sStr)
    .replace(/\{benchPlayers\}/g, bStr)
    .replace(/\{maxSubstitutes\}/g, subStr)
    .replace(/\{matchDurationTotal\}/g, totalMinStr)
    .replace(/\{half1\}/g, h1Str)
    .replace(/\{half2\}/g, h2Str)
    .replace(/\{breakTime\}/g, brkStr)
    .replace(/\{penaltyKicks\}/g, kicksStr);

  if (brk === 0) {
    if (isEn) {
      formatted = formatted.replace(/,\s*\d+\s*min\s*break/gi, '');
    } else {
      formatted = formatted.replace(/,\s*মধ্যবিরতি\s*[০-৯\d]+\s*মিনিট/gi, '');
    }
  }

  return formatted;
}

function resolveRuleDesc(rule, cfg, isEn) {
  if (!rule) return '';
  const rawDesc = (isEn && rule.descEn) ? rule.descEn : (rule.desc || '');
  return formatDynamicRuleText(rawDesc, cfg, isEn);
}

function resolveRuleTitle(rule, cfg, isEn) {
  if (!rule) return '';
  const rawTitle = (isEn && rule.titleEn) ? rule.titleEn : (rule.title || '');
  return formatDynamicRuleText(rawTitle, cfg, isEn);
}

function isRuleApplicableToFormat(ruleId, cfg) {
  const c = cfg || (typeof tournamentConfig !== 'undefined' ? tournamentConfig : {});
  if (c.tournamentType === 'knockout') {
    // In knockout tournament format, points table & standings tiebreaker rules do not apply
    if (ruleId === 'r_fifa_points' || ruleId === 'r_standings_tiebreaker' || ruleId === 'r_best_runnerup' || ruleId === 'r_shootout_pts') {
      return false;
    }
  }
  return true;
}

if (typeof globalThis !== 'undefined') {
  globalThis.formatDynamicRuleText = formatDynamicRuleText;
  globalThis.resolveRuleDesc = resolveRuleDesc;
  globalThis.resolveRuleTitle = resolveRuleTitle;
  globalThis.isRuleApplicableToFormat = isRuleApplicableToFormat;
}
if (typeof window !== 'undefined') {
  window.formatDynamicRuleText = formatDynamicRuleText;
  window.resolveRuleDesc = resolveRuleDesc;
  window.resolveRuleTitle = resolveRuleTitle;
  window.isRuleApplicableToFormat = isRuleApplicableToFormat;
}

const STANDARD_RULES_PRESET = [
  'r_squad_minibar', 'r_residency', 'r_single_team',
  'r_match_duration', 'r_walkover',
  'r_fifa_points', 'r_direct_shootout',
  'r_standings_tiebreaker', 'r_referee_final',
  'r_yellow_card', 'r_weather_interruption'
];

const MINIBAR_RULES_PRESET = [
  'r_squad_minibar', 'r_residency', 'r_single_team',
  'r_match_duration', 'r_walkover',
  'r_fifa_points', 'r_direct_shootout',
  'r_standings_tiebreaker', 'r_referee_final',
  'r_yellow_card', 'r_weather_interruption'
];

const DEFAULT_TEAMS = [
  { id: 't1', name: 'মুড়িয়ারা', group: 'A', manager: 'কবির হোসেন', phone: '০১৭xxxxxxxx', feeStatus: 'paid' },
  { id: 't2', name: 'নোয়াপাড়া', group: 'A', manager: 'সেলিম রেজা', phone: '০১৮xxxxxxxx', feeStatus: 'paid' },
  { id: 't3', name: 'চিতড্ডা', group: 'A', manager: 'রফিকুল ইসলাম', phone: '০১৯xxxxxxxx', feeStatus: 'due' },
  { id: 't4', name: 'মুকুন্দপুর', group: 'B', manager: 'আনোয়ার হোসেন', phone: '০১৭১xxxxxxx', feeStatus: 'paid' },
  { id: 't5', name: 'উত্তর ওড্ডা', group: 'B', manager: 'আমিরুল ইসলাম', phone: '০১৭xxxxxxxx', feeStatus: 'paid' },
  { id: 't6', name: 'দক্ষিণ ওড্ডা', group: 'B', manager: 'মোস্তফা কামাল', phone: '০১৮xxxxxxxx', feeStatus: 'partial' },
  { id: 't7', name: 'বাতাবাড়িয়া', group: 'C', manager: 'আনোয়ার সাদাত', phone: '০১৯xxxxxxxx', feeStatus: 'paid' },
  { id: 't8', name: 'মোহাম্মদপুর', group: 'C', manager: 'জহিরুল ইসলাম', phone: '০১৬xxxxxxxx', feeStatus: 'paid' },
  { id: 't9', name: 'ভংগুয়া', group: 'C', manager: 'নাসির উদ্দিন', phone: '০১৭xxxxxxxx', feeStatus: 'due' }
];

const DEFAULT_CONFIG = {
  title: 'ফুটবল বিশ্বকাপ ২০২৬',
  titleAccent: 'ফুটবল বিশ্বকাপ',
  titleRest: '২০২৬',
  titleIcon: '⚽',
  organizer: 'ফিফা ও বাংলাদেশ ফুটবল ফেডারেশন',
  venue: 'বঙ্গবন্ধু জাতীয় স্টেডিয়াম মাঠ, ঢাকা',
  startDate: '২০২৬',
  formatType: '১১-এ-সাইড (11-a-side)',
  startingPlayers: 11,
  benchPlayers: 5,
  maxSubstitutes: 5,
  matchDuration: '',
  tournamentType: 'groups', // 'groups' (গ্রুপ পর্ব + নকআউট), 'knockout' (সরাসরি নকআউট), 'league' (একক লিগ)
  teamCount: 9,
  teams: DEFAULT_TEAMS,
  entryFee: '৫,০০০ টাকা (অফেরতযোগ্য)',
  regDeadline: 'ম্যাচ শুরুর ৩০ মিনিট পূর্বে',
  contactPhone: '০১৭xxxxxxxx, ০১৮xxxxxxxx',
  paymentMethod: 'বিকাশ / নগদ (পার্সোনাল)',
  registrationUrl: '',
  championPrize: '১,০০,০০০ টাকা ও আকর্ষণীয় বিশ্বকাপ ট্রফি',
  runnerUpPrize: '৫০,০০০ টাকা ও রানার্স-আপ ট্রফি',
  thirdPrize: '২০,০০০ টাকা অথবা ট্রফি ও মেডেল',
  otherPrizes: 'গোল্ডেন বুট, গোল্ডেন গ্লাভস, ফাইনালের ম্যান অব দ্য ম্যাচ',
  selectedRules: [],
  customRules: []
};

const DEFAULT_CONFIG_EN = {
  title: 'Football World Cup 2026',
  titleAccent: 'Football World Cup',
  titleRest: '2026',
  titleIcon: '⚽',
  organizer: 'FIFA & Football Federation',
  venue: 'National Stadium Ground, Dhaka',
  startDate: '2026',
  formatType: '11-a-side',
  startingPlayers: 11,
  benchPlayers: 5,
  maxSubstitutes: 5,
  matchDuration: '',
  tournamentType: 'groups',
  teamCount: 9,
  teams: DEFAULT_TEAMS,
  entryFee: '5,000 BDT (Non-refundable)',
  regDeadline: '30 mins before match kickoff',
  contactPhone: '+880 17xxxxxxxx, +880 18xxxxxxxx',
  paymentMethod: 'bKash / Nagad (Personal)',
  registrationUrl: '',
  championPrize: '100,000 BDT & World Cup Trophy',
  runnerUpPrize: '50,000 BDT & Runner-Up Trophy',
  thirdPrize: '20,000 BDT or Trophy & Medals',
  otherPrizes: 'Golden Boot, Golden Glove, Man of the Final',
  selectedRules: [],
  customRules: []
};

const GROUPS = {
  'A': ['মুড়িয়ারা', 'নোয়াপাড়া', 'চিতড্ডা'],
  'B': ['মুকুন্দপুর', 'উত্তর ওড্ডা', 'দক্ষিণ ওড্ডা'],
  'C': ['বাতাবাড়িয়া', 'মোহাম্মদপুর', 'ভংগুয়া']
};

const GROUP_MATCH_DEFS = [
  { id: 1, group: 'B', t1: 'মুকুন্দপুর', t2: 'উত্তর ওড্ডা' },
  { id: 2, group: 'A', t1: 'মুড়িয়ারা', t2: 'নোয়াপাড়া' },
  { id: 3, group: 'C', t1: 'বাতাবাড়িয়া', t2: 'মোহাম্মদপুর' },
  { id: 4, group: 'A', t1: 'নোয়াপাড়া', t2: 'চিতড্ডা' },
  { id: 5, group: 'B', t1: 'উত্তর ওড্ডা', t2: 'দক্ষিণ ওড্ডা' },
  { id: 6, group: 'C', t1: 'মোহাম্মদপুর', t2: 'ভংগুয়া' },
  { id: 7, group: 'A', t1: 'চিতড্ডা', t2: 'মুড়িয়ারা' },
  { id: 8, group: 'B', t1: 'দক্ষিণ ওড্ডা', t2: 'মুকুন্দপুর' },
  { id: 9, group: 'C', t1: 'ভংগুয়া', t2: 'বাতাবাড়িয়া' }
];

// Default 11-player squads for all 9 teams
const DEFAULT_ROSTERS = {
  'মুড়িয়ারা': {
    group: 'গ্রুপ এ',
    manager: 'কবির হোসেন',
    phone: '০১৭xxxxxxxx',
    feeStatus: 'paid',
    players: [
      { no: 1, jersey: 10, name: 'মোঃ শাকিল আহমেদ' },
      { no: 2, jersey: 7, name: 'আরিফুল ইসলাম' },
      { no: 3, jersey: 1, name: 'নাজমুল হাসান (GK)' },
      { no: 4, jersey: 4, name: 'রাকিব হোসেন' },
      { no: 5, jersey: 8, name: 'তানভীর আহমেদ' },
      { no: 6, jersey: 11, name: 'মেহেদী হাসান' },
      { no: 7, jersey: 9, name: 'সাকিব আল হাসান' },
      { no: 8, jersey: 5, name: 'আল-আমিন' },
      { no: 9, jersey: 3, name: 'জাহিদুল ইসলাম' },
      { no: 10, jersey: 2, name: 'রিফাত হোসেন' },
      { no: 11, jersey: 6, name: 'কামরুল হাসান' }
    ]
  },
  'নোয়াপাড়া': {
    group: 'গ্রুপ এ',
    manager: 'সেলিম রেজা',
    phone: '০১৮xxxxxxxx',
    feeStatus: 'paid',
    players: [
      { no: 1, jersey: 9, name: 'ফারহান মাহমুদ' },
      { no: 2, jersey: 10, name: 'তৌহিদুর রহমান' },
      { no: 3, jersey: 1, name: 'সোহাগ মিয়া (GK)' },
      { no: 4, jersey: 5, name: 'ইমরান খান' },
      { no: 5, jersey: 7, name: 'শাহীন আলম' },
      { no: 6, jersey: 8, name: 'নাসিম ইকবাল' },
      { no: 7, jersey: 11, name: 'রুবেল আহমেদ' },
      { no: 8, jersey: 3, name: 'আশরাফুল হক' },
      { no: 9, jersey: 4, name: 'মাসুদ পারভেজ' },
      { no: 10, jersey: 2, name: 'সুমন মিয়া' },
      { no: 11, jersey: 6, name: 'মাহবুবুল আলম' }
    ]
  },
  'চিতড্ডা': {
    group: 'গ্রুপ এ',
    manager: 'রফিকুল ইসলাম',
    phone: '০১৯xxxxxxxx',
    feeStatus: 'due',
    players: [
      { no: 1, jersey: 10, name: 'আহসান হাবীব' },
      { no: 2, jersey: 7, name: 'মাহমুদুল হাসান' },
      { no: 3, jersey: 1, name: 'রাসেল আহমেদ (GK)' },
      { no: 4, jersey: 4, name: 'সাইফুল ইসলাম' },
      { no: 5, jersey: 8, name: 'নাঈম হোসেন' },
      { no: 6, jersey: 9, name: 'ফয়সাল আহমেদ' },
      { no: 7, jersey: 11, name: 'রায়হান উদ্দিন' },
      { no: 8, jersey: 3, name: 'শরিফুল ইসলাম' },
      { no: 9, jersey: 5, name: 'আতিকুর রহমান' },
      { no: 10, jersey: 2, name: 'মোর্শেদ আলম' },
      { no: 11, jersey: 6, name: 'হাবিবুল্লাহ' }
    ]
  },
  'মুকুন্দপুর': {
    group: 'গ্রুপ বি',
    manager: 'আমির হোসেন',
    phone: '০১৬xxxxxxxx',
    feeStatus: 'paid',
    players: [
      { no: 1, jersey: 10, name: 'শাহাদাত হোসেন' },
      { no: 2, jersey: 9, name: 'রেদোয়ান আহমেদ' },
      { no: 3, jersey: 1, name: 'কায়সার মাহমুদ (GK)' },
      { no: 4, jersey: 4, name: 'মিজানুর রহমান' },
      { no: 5, jersey: 7, name: 'জাকির হোসেন' },
      { no: 6, jersey: 8, name: 'বায়োজিদ বোস্তামী' },
      { no: 7, jersey: 11, name: 'হাবিবুর রহমান' },
      { no: 8, jersey: 3, name: 'এনামুল হক' },
      { no: 9, jersey: 5, name: 'মনিরুল ইসলাম' },
      { no: 10, jersey: 2, name: 'আব্দুল কাদের' },
      { no: 11, jersey: 6, name: 'সাইদুর রহমান' }
    ]
  },
  'উত্তর ওড্ডা': {
    group: 'গ্রুপ বি',
    manager: 'জাহাঙ্গীর আলম',
    phone: '০১৭xxxxxxxx',
    feeStatus: 'paid',
    players: [
      { no: 1, jersey: 7, name: 'তারেক রহমান' },
      { no: 2, jersey: 10, name: 'মোস্তাফিজুর রহমান' },
      { no: 3, jersey: 1, name: 'আলমগীর হোসেন (GK)' },
      { no: 4, jersey: 4, name: 'বোরহান উদ্দিন' },
      { no: 5, jersey: 8, name: 'নয়ন মিয়া' },
      { no: 6, jersey: 9, name: 'কামাল পাশা' },
      { no: 7, jersey: 11, name: 'ইসমাইল হোসেন' },
      { no: 8, jersey: 3, name: 'আব্দুস সালাম' },
      { no: 9, jersey: 5, name: 'লুৎফর রহমান' },
      { no: 10, jersey: 2, name: 'নজরুল ইসলাম' },
      { no: 11, jersey: 6, name: 'হারুন অর রশিদ' }
    ]
  },
  'দক্ষিণ ওড্ডা': {
    group: 'গ্রুপ বি',
    manager: 'মোস্তফা কামাল',
    phone: '০১৮xxxxxxxx',
    feeStatus: 'partial',
    players: [
      { no: 1, jersey: 10, name: 'হাসান মাহমুদ' },
      { no: 2, jersey: 8, name: 'শামীম ওসমান' },
      { no: 3, jersey: 1, name: 'ইকবাল বাহার (GK)' },
      { no: 4, jersey: 5, name: 'আসাদুজ্জামান' },
      { no: 5, jersey: 7, name: 'মাজেদুল হক' },
      { no: 6, jersey: 9, name: 'ওমর সানী' },
      { no: 7, jersey: 11, name: 'দেলোয়ার হোসেন' },
      { no: 8, jersey: 3, name: 'সাইফুল বারী' },
      { no: 9, jersey: 4, name: 'আনোয়ার হোসেন' },
      { no: 10, jersey: 2, name: 'ফারুক আহমেদ' },
      { no: 11, jersey: 6, name: 'শওকত আলী' }
    ]
  },
  'বাতাবাড়িয়া': {
    group: 'গ্রুপ সি',
    manager: 'আনোয়ার সাদাত',
    phone: '০১৯xxxxxxxx',
    feeStatus: 'paid',
    players: [
      { no: 1, jersey: 9, name: 'সাব্বির রহমান' },
      { no: 2, jersey: 10, name: 'আরিফ বিল্লাহ' },
      { no: 3, jersey: 1, name: 'মামুনুর রশিদ (GK)' },
      { no: 4, jersey: 4, name: 'জসিম উদ্দিন' },
      { no: 5, jersey: 7, name: 'খোকা মিয়া' },
      { no: 6, jersey: 8, name: 'ইলিয়াস কাঞ্চন' },
      { no: 7, jersey: 11, name: 'মোজাম্মেল হক' },
      { no: 8, jersey: 3, name: 'সিরাজুল ইসলাম' },
      { no: 9, jersey: 5, name: 'আবুল কালাম' },
      { no: 10, jersey: 2, name: 'রফিক উদ্দিন' },
      { no: 11, jersey: 6, name: 'মুসা ইব্রাহিম' }
    ]
  },
  'মোহাম্মদপুর': {
    group: 'গ্রুপ সি',
    manager: 'জহিরুল ইসলাম',
    phone: '০১৬xxxxxxxx',
    feeStatus: 'paid',
    players: [
      { no: 1, jersey: 10, name: 'জিয়াউর রহমান' },
      { no: 2, jersey: 7, name: 'মারুফ হাসান' },
      { no: 3, jersey: 1, name: 'তৌফিক এলাহী (GK)' },
      { no: 4, jersey: 5, name: 'হুমায়ুন কবির' },
      { no: 5, jersey: 8, name: 'শাহ আলম' },
      { no: 6, jersey: 9, name: 'আজমল হোসেন' },
      { no: 7, jersey: 11, name: 'মোশাররফ হোসেন' },
      { no: 8, jersey: 3, name: 'বশির আহমেদ' },
      { no: 9, jersey: 4, name: 'তাহের আলী' },
      { no: 10, jersey: 2, name: 'আব্দুল মান্নান' },
      { no: 11, jersey: 6, name: 'সোলায়মান খাঁ' }
    ]
  },
  'ভংগুয়া': {
    group: 'গ্রুপ সি',
    manager: 'নাসির উদ্দিন',
    phone: '০১৭xxxxxxxx',
    feeStatus: 'due',
    players: [
      { no: 1, jersey: 8, name: 'রনি তালুকদার' },
      { no: 2, jersey: 10, name: 'সোহেল রানা' },
      { no: 3, jersey: 1, name: 'উজ্জ্বল হোসেন (GK)' },
      { no: 4, jersey: 4, name: 'মতিউর রহমান' },
      { no: 5, jersey: 7, name: 'খায়রুল বাশার' },
      { no: 6, jersey: 9, name: 'আকরাম খান' },
      { no: 7, jersey: 11, name: 'মাসুদ রানা' },
      { no: 8, jersey: 3, name: 'শহীদুল ইসলাম' },
      { no: 9, jersey: 5, name: 'আফজাল হোসেন' },
      { no: 10, jersey: 2, name: 'বাদল মিয়া' },
      { no: 11, jersey: 6, name: 'খালেক সর্দার' }
    ]
  }
};
