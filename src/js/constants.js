// ========================================================
// CONSTANTS & MASTER DATA DEFINITIONS
// ========================================================

// ========================================================
// TOURNAMENT APPLICATION ENGINE (CHITADDA 2026 - PRO PRO-MAX)
// Master Roster + Auto Golden Boot + Fair Play (Cards)
// ========================================================

// MASTER RULES CATALOG (Comprehensive FIFA 11-a-side & Bangladeshi Minibar Football Tournament Rules)
const MASTER_RULES_CATALOG = [
  // ১. দল গঠন ও খেলোয়াড় যোগ্যতা (Squad & Eligibility)
  {
    id: 'r_squad_11',
    category: 'দল গঠন ও খেলোয়াড় যোগ্যতা',
    categoryEn: 'Squad & Eligibility',
    categoryIcon: '👥',
    title: 'দল গঠন ও সর্বোচ্চ স্কোয়াড',
    titleEn: 'Squad Size & Player Registration',
    desc: 'ফিফা স্ট্যান্ডার্ড টুর্নামেন্টে প্রতি দলে সর্বোচ্চ ১৬ থেকে ২৬ জন নিবন্ধিত খেলোয়াড় অন্তর্ভুক্ত করা যাবে। এর মধ্যে ১১ জন মূল একাদশে এবং বাকিরা বিকল্প (বেঞ্চ) হিসেবে থাকবেন।',
    descEn: 'Squads may register 16 to 26 players (11 starters and registered substitutes). Only officially registered players can participate.',
    defaultSelected: true
  },
  {
    id: 'r_onfield_11',
    category: 'দল গঠন ও খেলোয়াড় যোগ্যতা',
    categoryEn: 'Squad & Eligibility',
    categoryIcon: '👥',
    title: 'মাঠের সদস্য সংখ্যা (১১-এ-সাইড ফিফা স্ট্যান্ডার্ড)',
    titleEn: 'Active On-Field Players (11-a-side)',
    desc: 'মাঠে একসঙ্গে প্রতি দলের ১১ জন খেলোয়াড় (১ জন গোলরক্ষক ও ১০ জন ফিল্ড খেলোয়াড়) অংশ নেবেন (ফিফা ল ৩)। মাঠের খেলোয়াড় সংখ্যা ৭ জনের নিচে নেমে গেলে ম্যাচ বাতিল হবে।',
    descEn: 'Each team fields 11 players simultaneously (1 goalkeeper and 10 outfield players) per FIFA Law 3. A match cannot continue if a team has fewer than 7 players.',
    defaultSelected: true
  },
  {
    id: 'r_squad_minibar',
    category: 'দল গঠন ও খেলোয়াড় যোগ্যতা',
    categoryEn: 'Squad & Eligibility',
    categoryIcon: '👥',
    title: 'মিনিবার স্কোয়াড গঠন (১০-১২ জন)',
    titleEn: 'Minibar Squad Registration',
    desc: 'মিনিবার ফুটবলে প্রতি দলে সর্বোচ্চ ১০-১২ জন খেলোয়াড় নিবন্ধন করা যাবে (৫/৬ জন মাঠে ও ৫/৬ জন অতিরিক্ত খেলোয়াড়)।',
    descEn: 'Squads may register 10-12 players for minibar format (5-6 active on-field and 5-6 registered substitutes).',
    defaultSelected: false
  },
  {
    id: 'r_onfield_6',
    category: 'দল গঠন ও খেলোয়াড় যোগ্যতা',
    categoryEn: 'Squad & Eligibility',
    categoryIcon: '👥',
    title: 'মাঠের সদস্য সংখ্যা (মিনিবার ৫/৬-এ-সাইড)',
    titleEn: 'Active On-Field Players (Minibar 5/6-a-side)',
    desc: 'মাঠে একসঙ্গে প্রতি দলের ৫ বা ৬ জন খেলোয়াড় (গোলরক্ষকসহ) অংশ নেবেন (মিনিবার / শর্ট-পিচ ফরম্যাট)।',
    descEn: 'Each team fields 5 or 6 active players (including the goalkeeper) simultaneously based on tournament regulations.',
    defaultSelected: false
  },
  {
    id: 'r_residency',
    category: 'দল গঠন ও খেলোয়াড় যোগ্যতা',
    categoryEn: 'Squad & Eligibility',
    categoryIcon: '👥',
    title: 'স্থায়ী বাসিন্দার শর্ত (Ward Residency)',
    titleEn: 'Permanent Residency Requirement',
    desc: 'খেলোয়াড়দের অবশ্যই সংশ্লিষ্ট ইউনিয়ন/ওয়ার্ডের স্থায়ী বাসিন্দা হতে হবে। পরিচয়পত্র বা জন্মনিবন্ধন যাচাই বাধ্যতামূলক।',
    descEn: 'Players must be permanent residents of the respective union or ward. ID verification is mandatory.',
    defaultSelected: true
  },
  {
    id: 'r_single_team',
    category: 'দল গঠন ও খেলোয়াড় যোগ্যতা',
    categoryEn: 'Squad & Eligibility',
    categoryIcon: '👥',
    title: 'একাধিক দলে অংশগ্রহণ নিষেধ',
    titleEn: 'Single-Team Limitation',
    desc: 'একজন খেলোয়াড় পুরো টুর্নামেন্টে শুধুমাত্র একটি দলের হয়েই খেলতে পারবেন। একাধিক দলে নাম প্রমাণিত হলে সংশ্লিষ্ট দল বাতিল বলে গণ্য হবে।',
    descEn: 'A player may only represent one team throughout the tournament. Dual representation results in disqualification.',
    defaultSelected: true
  },
  {
    id: 'r_hire_players_no',
    category: 'দল গঠন ও খেলোয়াড় যোগ্যতা',
    categoryEn: 'Squad & Eligibility',
    categoryIcon: '👥',
    title: 'হায়ার/বহিরাগত খেলোয়াড় সম্পূর্ণ নিষিদ্ধ',
    titleEn: 'Guest / Hired Players Prohibited',
    desc: 'কোনো বহিরাগত বা ভাড়াটে খেলোয়াড় অংশ নিতে পারবে না। শতভাগ স্থানীয় খেলোয়াড় নিয়ে দল গঠন করতে হবে।',
    descEn: 'Hired or guest players from outside the ward/area are strictly prohibited. 100% homegrown squads required.',
    defaultSelected: false
  },
  {
    id: 'r_hire_players_limit',
    category: 'দল গঠন ও খেলোয়াড় যোগ্যতা',
    categoryEn: 'Squad & Eligibility',
    categoryIcon: '👥',
    title: 'সীমিত হায়ার খেলোয়াড় কোটা',
    titleEn: 'Limited Guest Player Quota',
    desc: 'প্রতি ম্যাচে একাদশে সর্বোচ্চ ২ জন বহিরাগত/হায়ার খেলোয়াড় অংশ নেওয়ার অনুমতি থাকবে।',
    descEn: 'A maximum of 2 external/guest players per team are allowed in the active playing lineup per match.',
    defaultSelected: false
  },

  // ২. ম্যাচের সময় ও রিপোর্টিং (Match Timing & Reporting)
  {
    id: 'r_match_duration_90',
    category: 'ম্যাচের সময় ও রিপোর্টিং',
    categoryEn: 'Match Timing & Reporting',
    categoryIcon: '⏱️',
    title: 'ম্যাচের সময়কাল (৯০ মিনিট ফিফা স্ট্যান্ডার্ড)',
    titleEn: 'Match Duration (90 Minutes - FIFA Standard)',
    desc: 'নির্ধারিত ম্যাচ সময় ৯০ মিনিট (প্রথমার্ধ ৪৫ মিনিট, ১৫ মিনিট মধ্যবিরতি, দ্বিতীয়ার্ধ ৪৫ মিনিট)। ইনজুরি ও স্টপেজ টাইম রেফারির বিবেচনায় যোগ হবে (ফিফা ল ৭)।',
    descEn: 'Regulation match duration is 90 minutes (45 min first half, 15 min half-time interval, 45 min second half) plus referee stoppage time (FIFA Law 7).',
    defaultSelected: true
  },
  {
    id: 'r_extra_time_fifa',
    category: 'ম্যাচের সময় ও রিপোর্টিং',
    categoryEn: 'Match Timing & Reporting',
    categoryIcon: '⏱️',
    title: 'নকআউট অতিরিক্ত সময় (৩০ মিনিট)',
    titleEn: 'Knockout Extra Time (30 Minutes)',
    desc: 'নকআউট পর্বে নির্ধারিত ৯০ মিনিটে খেলা ড্র হলে ১৫ মিনিট করে দুই অর্ধে মোট ৩০ মিনিট অতিরিক্ত সময় (Extra Time) খেলা হবে। এরপরও অমীমাংসিত থাকলে পেনাল্টি শুটআউট হবে।',
    descEn: 'In knockout rounds, if tied after 90 minutes, two 15-minute extra time periods (total 30 mins) will be played before proceeding to a penalty shootout.',
    defaultSelected: true
  },
  {
    id: 'r_match_duration',
    category: 'ম্যাচের সময় ও রিপোর্টিং',
    categoryEn: 'Match Timing & Reporting',
    categoryIcon: '⏱️',
    title: 'ম্যাচের সময়কাল (মিনিবার ২০-৩০ মিনিট)',
    titleEn: 'Minibar Match Duration (20-30 Minutes)',
    desc: 'মিনিবার টুর্নামেন্টে ম্যাচ সময়কাল ২০ থেকে ৩০ মিনিট (১০-১৫ মিনিট প্রথমার্ধ, ৩-৫ মিনিট বিরতি, ১০-১৫ মিনিট দ্বিতীয়ার্ধ)।',
    descEn: 'Minibar match duration is 20-30 minutes (10-15 min first half, 3-5 min break, 10-15 min second half).',
    defaultSelected: false
  },
  {
    id: 'r_early_reporting',
    category: 'ম্যাচের সময় ও রিপোর্টিং',
    categoryEn: 'Match Timing & Reporting',
    categoryIcon: '⏱️',
    title: 'মাঠে নির্ধারিত সময়ে উপস্থিতি',
    titleEn: 'Punctual Pitch Reporting',
    desc: 'নির্ধারিত ম্যাচ শুরুর কমপক্ষে ১৫ মিনিট পূর্বে দলকে মাঠে উপস্থিত হয়ে ম্যাচ কমিশনারের কাছে রিপোর্ট করতে হবে।',
    descEn: 'Teams must report to the pitch and match commissioner at least 15 minutes before scheduled kickoff.',
    defaultSelected: true
  },
  {
    id: 'r_walkover',
    category: 'ম্যাচের সময় ও রিপোর্টিং',
    categoryEn: 'Match Timing & Reporting',
    categoryIcon: '⏱️',
    title: 'ওয়াকওভার (Walkover) ও অনুপস্থিতি',
    titleEn: 'Walkover (3-0 Forfeit)',
    desc: 'ম্যাচ শুরুর নির্ধারিত সময়ের পর সর্বোচ্চ ১৫ মিনিট অপেক্ষা করা হবে; দল অনুপস্থিত থাকলে বিপক্ষ দলকে ৩-০ গোলে বিজয়ী ঘোষণা করা হবে।',
    descEn: 'Grace period is 15 minutes after kickoff time. If a team fails to show up, a 3-0 walkover is awarded to the opponent.',
    defaultSelected: true
  },
  {
    id: 'r_dress_code',
    category: 'ম্যাচের সময় ও রিপোর্টিং',
    categoryEn: 'Match Timing & Reporting',
    categoryIcon: '⏱️',
    title: 'জার্সি ও পোশাক বিধি',
    titleEn: 'Team Kit & Dress Code',
    desc: 'প্রতিটি দলকে একই রঙের জার্সি ও শর্টস পরে খেলতে হবে। উভয় দলের জার্সির রঙ এক হলে টসের মাধ্যমে এক দলকে বিবস (Bibs) পরতে হবে।',
    descEn: 'Teams must wear uniform jerseys. In case of color clashes, toss determines which team wears bibs.',
    defaultSelected: true
  },

  // ৩. ড্র নিষ্পত্তি ও টাইব্রেকার (Draws & Tiebreakers)
  {
    id: 'r_fifa_points',
    category: 'ড্র নিষ্পত্তি ও টাইব্রেকার',
    categoryEn: 'Draws & Tiebreakers',
    categoryIcon: '🎯',
    title: 'লিগ ও গ্রুপ পর্বের পয়েন্ট নীতি (ফিফা ৩-১-০)',
    titleEn: 'League & Group Points Policy (FIFA 3-1-0)',
    desc: 'গ্রুপ পর্ব ও লিগে নির্ধারিত সময়ে জয়ী দল ৩ পয়েন্ট, ড্র হলে উভয় দল ১টি করে পয়েন্ট পাবে এবং পরাজিত দল ০ পয়েন্ট পাবে। গ্রুপ পর্বে সরাসরি কোনো টাইব্রেকার থাকবে না।',
    descEn: 'Group/league matches award 3 points for a win, 1 point for a draw, and 0 for a loss (FIFA 3-1-0 standard). Tied matches share points with no shootout.',
    defaultSelected: true
  },
  {
    id: 'r_pen_count_fifa',
    category: 'ড্র নিষ্পত্তি ও টাইব্রেকার',
    categoryEn: 'Draws & Tiebreakers',
    categoryIcon: '🎯',
    title: 'ফিফা অফিসিয়াল টাইব্রেকার (৫টি শট ও সাডেন ডেথ)',
    titleEn: 'FIFA Official Penalty Shootout (5 Kicks & Sudden Death)',
    desc: 'নকআউট পর্বে অতিরিক্ত সময়ের পরও খেলা ড্র থাকলে টাইব্রেকারে উভয় দল ৫টি করে পেনাল্টি শট নেবে (FIFA Law 10)। ৫ শটে সমতা থাকলে ১টি করে সাডেন ডেথ পদ্ধতিতে নিষ্পত্তি হবে।',
    descEn: 'Knockout tiebreakers start with a best-of-5 penalty shootout per team (FIFA Law 10). If tied after 5 kicks, sudden-death rounds (1 kick each) decide.',
    defaultSelected: true
  },
  {
    id: 'r_direct_shootout',
    category: 'ড্র নিষ্পত্তি ও টাইব্রেকার',
    categoryEn: 'Draws & Tiebreakers',
    categoryIcon: '🎯',
    title: 'মিনিবার সরাসরি টাইব্রেকার (ড্র হলে কোনো অতিরিক্ত সময় নেই)',
    titleEn: 'Direct Shootout in Minibar (No Extra Time)',
    desc: 'মিনিবার টুর্নামেন্টে নির্ধারিত সময়ে খেলা ড্র হলে কোনো অতিরিক্ত সময় থাকবে না; সরাসরি পেনাল্টি শুটআউটের মাধ্যমে বিজয়ী নির্ধারিত হবে।',
    descEn: 'In minibar tournaments, tied matches at full time go straight to a penalty shootout with no extra time played.',
    defaultSelected: false
  },
  {
    id: 'r_pen_count',
    category: 'ড্র নিষ্পত্তি ও টাইব্রেকার',
    categoryEn: 'Draws & Tiebreakers',
    categoryIcon: '🎯',
    title: 'মিনিবার পেনাল্টি শটের সংখ্যা (৩টি শট)',
    titleEn: 'Minibar Shootout (3 Kicks & Sudden Death)',
    desc: 'মিনিবার টাইব্রেকারে প্রাথমিক পর্যায়ে উভয় দল ৩টি করে শট নেবে। ৩ শটে সমতা থাকলে সাডেন ডেথ (১টি করে শট) পদ্ধতিতে নিষ্পত্তি হবে।',
    descEn: 'Minibar shootout begins with 3 shots per team. If tied after 3 kicks, sudden death rounds (1 kick each) decide.',
    defaultSelected: false
  },
  {
    id: 'r_shootout_pts',
    category: 'ড্র নিষ্পত্তি ও টাইব্রেকার',
    categoryEn: 'Draws & Tiebreakers',
    categoryIcon: '🎯',
    title: 'মিনিবার অল-অর-নাথিং পয়েন্ট নীতি',
    titleEn: 'Minibar Shootout Points Policy',
    desc: 'স্থানীয় মিনিবার টুর্নামেন্টে কোনো ম্যাচ ড্র হিসেবে গণ্য না হলে নির্ধারিত সময়ে বা টাইব্রেকারে জয়ী দল পূর্ণ ৩ পয়েন্ট লাভ করবে।',
    descEn: 'No match ends in a draw. The winning team (either in regulation or via shootout) receives full 3 points.',
    defaultSelected: false
  },

  // ৪. পয়েন্ট টেবিল ও অবস্থান নির্ধারণ (Standings & Tiebreaker Order)
  {
    id: 'r_standings_tiebreaker',
    category: 'পয়েন্ট টেবিল ও অবস্থান নির্ধারণ',
    categoryEn: 'Standings & Tiebreakers',
    categoryIcon: '📊',
    title: 'পয়েন্ট সমতার ক্ষেত্রে অবস্থান নির্ধারণ',
    titleEn: 'Standings Tiebreaker Hierarchy',
    desc: 'গ্রুপে একাধিক দলের পয়েন্ট সমান হলে যথাক্রমে: ১. হেড-টু-হেড ফলাফল, ২. গোল ব্যবধান (GD), ৩. সর্বাধিক গোল সংখ্যা (GF) এবং ৪. ফেয়ার প্লে ডিসিপ্লিনারি পয়েন্ট বিবেচনা করে র‍্যাঙ্কিং নির্ধারিত হবে।',
    descEn: 'If points are tied in a group, ranking is decided by: 1. Head-to-head, 2. Goal Difference (GD), 3. Goals For (GF), 4. Fair Play record.',
    defaultSelected: true
  },
  {
    id: 'r_best_runnerup',
    category: 'পয়েন্ট টেবিল ও অবস্থান নির্ধারণ',
    categoryEn: 'Standings & Tiebreakers',
    categoryIcon: '📊',
    title: 'সেরা রানার্স-আপ বাছাই সমীকরণ',
    titleEn: 'Best Runner-Up Qualification Formula',
    desc: '৩টি গ্রুপের রানার্স-আপ দলের মধ্যে সর্বাধিক পয়েন্ট, গোল ব্যবধান ও ডিসিপ্লিনারি রেকর্ড বিবেচনা করে সেমিফাইনালের চতুর্থ দল (সেরা রানার্স-আপ) নির্ধারিত হবে।',
    descEn: 'The 4th semi-final slot is awarded to the best runner-up across the 3 groups evaluated by Points, GD, GF, and Fair Play.',
    defaultSelected: true
  },

  // ৫. শৃঙ্খলা, কার্ড ও রেফারির সিদ্ধান্ত (Discipline & Fair Play)
  {
    id: 'r_referee_final',
    category: 'শৃঙ্খলা ও রেফারির সিদ্ধান্ত',
    categoryEn: 'Discipline & Fair Play',
    categoryIcon: '⚖️',
    title: 'রেফারির সিদ্ধান্তই চূড়ান্ত',
    titleEn: 'Referee Decision is Absolute',
    desc: 'মাঠে রেফারির সিদ্ধান্তই চূড়ান্ত ও সর্বসম্মত বলে গণ্য হবে। রেফারির যেকোনো সিদ্ধান্তের প্রতি খেলোয়াড় ও কর্মকর্তাদের পূর্ণ সম্মান প্রদর্শন বাধ্যতামূলক।',
    descEn: 'The referee decision on the pitch is final and binding. Unsportsmanlike dissent will not be tolerated.',
    defaultSelected: true
  },
  {
    id: 'r_violence_expulsion',
    category: 'শৃঙ্খলা ও রেফারির সিদ্ধান্ত',
    categoryEn: 'Discipline & Fair Play',
    categoryIcon: '⚖️',
    title: 'অসদাচরণ ও দল বহিষ্কার',
    titleEn: 'Zero Tolerance for Violent Conduct',
    desc: 'মাঠে যেকোনো ধরনের মারামারি, অশালীন গালিগালাজ, খেলা বিঘ্নিত করা বা রেফারির সাথে অসদাচরণের দায়ে সংশ্লিষ্ট দলকে টুর্নামেন্ট থেকে স্থায়ী বহিষ্কার ও এন্ট্রি ফি বাজেয়াপ্ত করা হবে।',
    descEn: 'Any fighting, abusive language, or deliberate match disruption results in immediate team expulsion and forfeiture of entry fee.',
    defaultSelected: true
  },
  {
    id: 'r_yellow_card',
    category: 'শৃঙ্খলা ও রেফারির সিদ্ধান্ত',
    categoryEn: 'Discipline & Fair Play',
    categoryIcon: '⚖️',
    title: 'হলুদ কার্ড শৃঙ্খলা নীতি (-১ FP)',
    titleEn: 'Yellow Card Policy (-1 Fair Play)',
    desc: 'একটি হলুদ কার্ডের জন্য দলের ফেয়ার প্লে স্কোর থেকে ১ পয়েন্ট কর্তন হবে। এক ম্যাচে ২ হলুদ কার্ড পাওয়া খেলোয়াড় স্বয়ংক্রিয়ভাবে লাল কার্ড প্রাপ্ত হবেন।',
    descEn: 'Each yellow card deducts 1 point from the team Fair Play score. 2 yellows in a single match convert into an automatic red.',
    defaultSelected: true
  },
  {
    id: 'r_red_card',
    category: 'শৃঙ্খলা ও রেফারির সিদ্ধান্ত',
    categoryEn: 'Discipline & Fair Play',
    categoryIcon: '⚖️',
    title: 'লাল কার্ড ও ম্যাচ নিষেধাজ্ঞা (-৩ FP)',
    titleEn: 'Red Card & Suspension (-3 Fair Play)',
    desc: 'সরাসরি লাল কার্ড পেলে সংশ্লিষ্ট দল থেকে ৩ ফেয়ার প্লে পয়েন্ট কর্তন হবে এবং উক্ত খেলোয়াড় পরবর্তী ম্যাচে মাঠের বাইরে থাকবেন।',
    descEn: 'A direct red card deducts 3 Fair Play points and imposes a mandatory one-match suspension on the player.',
    defaultSelected: true
  },

  // ৬. খেলার বিশেষ নিয়ম ও বদলি (In-Game Rules & Substitutions)
  {
    id: 'r_fifa_offside',
    category: 'খেলার বিশেষ নিয়ম ও বদলি',
    categoryEn: 'In-Game Rules & Substitutions',
    categoryIcon: '🔄',
    title: 'অফসাইড নিয়ম কার্যকর (ফিফা ল ১১)',
    titleEn: 'Offside Rule Enforced (FIFA Law 11)',
    desc: 'ফিফা ল ১১ অনুযায়ী অফসাইড নিয়ম পূর্ণাঙ্গভাবে বলবৎ থাকবে। পাস দেওয়ার মুহূর্তে আক্রমণভাগের খেলোয়াড় বল ও প্রতিপক্ষের শেষ দ্বিতীয় খেলোয়াড়ের চেয়ে এগিয়ে থাকলে অফসাইড গণ্য হবে।',
    descEn: 'Offside is strictly enforced per FIFA Law 11. An attacking player nearer to the opponent goal line than both the ball and the second-last opponent is penalized.',
    defaultSelected: true
  },
  {
    id: 'r_fifa_subs',
    category: 'খেলার বিশেষ নিয়ম ও বদলি',
    categoryEn: 'In-Game Rules & Substitutions',
    categoryIcon: '🔄',
    title: 'সর্বোচ্চ ৫ জন খেলোয়াড় বদলি (ফিফা ৩ উইন্ডো)',
    titleEn: 'FIFA 5 Substitutions Policy (3 In-Game Windows)',
    desc: 'ম্যাচে প্রতিটি দল সর্বোচ্চ ৫ জন খেলোয়াড় বদলি করার সুযোগ পাবে (সর্বোচ্চ ৩টি সাবস্টিটিউশন উইন্ডোতে)। একবার মাঠ ছেড়ে উঠে যাওয়া খেলোয়াড় পুনরায় খেলায় নামতে পারবেন না।',
    descEn: 'Each team is permitted a maximum of 5 substitutions across at most 3 in-game substitution windows. Substituted players cannot return to the pitch.',
    defaultSelected: true
  },
  {
    id: 'r_no_offside',
    category: 'খেলার বিশেষ নিয়ম ও বদলি',
    categoryEn: 'In-Game Rules & Substitutions',
    categoryIcon: '🔄',
    title: 'মিনিবার অফসাইড নিয়ম শিথিল (নো অফসাইড)',
    titleEn: 'No Offside in Minibar (Small-Sided)',
    desc: 'মিনিবার / ছোট মাঠের গতিশীল খেলার স্বার্থে এই টুর্নামেন্টে কোনো অফসাইড নিয়ম প্রযোজ্য হবে না।',
    descEn: 'To facilitate fast-paced dynamic gameplay on small-sided pitches, no offside rule applies in minibar football.',
    defaultSelected: false
  },
  {
    id: 'r_rolling_subs',
    category: 'খেলার বিশেষ নিয়ম ও বদলি',
    categoryEn: 'In-Game Rules & Substitutions',
    categoryIcon: '🔄',
    title: 'মিনিবার রোলিং সাবস্টিটিউশন (চলমান বদলি)',
    titleEn: 'Minibar Rolling Substitutions (Fly Substitutions)',
    desc: 'খেলা চলাকালে রেফারিকে অবগত করে অথবা নির্দিষ্ট সাবস্টিটিউশন জোন দিয়ে যেকোনো সময় একাধিকবার খেলোয়াড় বদলি (Rolling/Fly Substitution) করা যাবে।',
    descEn: 'Unlimited rolling substitutions are permitted during play breaks upon notifying officials.',
    defaultSelected: false
  },
  {
    id: 'r_minibar_gk_rules',
    category: 'খেলার বিশেষ নিয়ম ও বদলি',
    categoryEn: 'In-Game Rules & Substitutions',
    categoryIcon: '🔄',
    title: 'মিনিবার গোলরক্ষক ও ডি-বক্স নিয়ম',
    titleEn: 'Minibar Goalkeeper & D-Box Restrictions',
    desc: 'মিনিবারে গোলরক্ষক নিজ ডি-বক্সের বাইরে হাত দিয়ে বল স্পর্শ করতে পারবেন না এবং নিজের পায়ে বল নিয়ে ৪ সেকেন্ডের বেশি সময় ধরে রাখতে পারবেন না।',
    descEn: 'In minibar football, goalkeepers may not handle the ball outside the penalty D-box and cannot hold the ball at their feet for more than 4 seconds.',
    defaultSelected: false
  },
  {
    id: 'r_minibar_posts',
    category: 'খেলার বিশেষ নিয়ম ও বদলি',
    categoryEn: 'In-Game Rules & Substitutions',
    categoryIcon: '🔄',
    title: 'মিনিবার ছোট গোলপোস্ট ও কিক-ইন',
    titleEn: 'Minibar Small Goalposts & Kick-Ins',
    desc: 'খেলায় ছোট সাইজের গোলপোস্ট (মিনিবার) ব্যবহৃত হবে। সাইডলাইনের বাইরে বল গেলে টুর্নামেন্ট নীতি অনুযায়ী থ্রো-ইন অথবা গ্রাউন্ড কিক-ইন করা যাবে।',
    descEn: 'Small-sized minibar goalposts are used. Ground kick-ins or throw-ins apply when the ball crosses touchlines.',
    defaultSelected: false
  },
  {
    id: 'r_backpass_rule',
    category: 'খেলার বিশেষ নিয়ম ও বদলি',
    categoryEn: 'In-Game Rules & Substitutions',
    categoryIcon: '🔄',
    title: 'গোলরক্ষকের ব্যাক-পাস নিয়ম',
    titleEn: 'Goalkeeper Back-Pass Rule',
    desc: 'সতীর্থ খেলোয়াড়ের পা দিয়ে ইচ্ছাকৃত ব্যাক-পাস গোলরক্ষক সরাসরি হাতে ধরতে পারবেন না; ধরলে বিপক্ষ দল ইনডাইরেক্ট ফ্রি-কিক পাবে।',
    descEn: 'Goalkeepers cannot handle deliberate foot back-passes from teammates; doing so awards an indirect free kick.',
    defaultSelected: true
  },

  // ৭. অভিযোগ, এন্ট্রি ফি ও জরুরি নীতি (Protest, Fees & Weather)
  {
    id: 'r_protest_fee',
    category: 'অভিযোগ, ফি ও জরুরি নীতি',
    categoryEn: 'Protests, Fees & Contingencies',
    categoryIcon: '🛡️',
    title: 'লিখিত অভিযোগ ও প্রতিবাদ ফি',
    titleEn: 'Official Protest & Dispute Fee',
    desc: 'কোনো দলের বিরুদ্ধে নিয়মভঙ্গের আপত্তি থাকলে ম্যাচ শেষের ৩০ মিনিটের মধ্যে ১,০০০ টাকা অফিশিয়াল প্রতিবাদ ফিসহ লিখিত অভিযোগ জমা দিতে হবে। অভিযোগ প্রমাণিত হলে ফি ফেরত দেওয়া হবে।',
    descEn: 'Written protests regarding player eligibility or rule breaches must be filed within 30 mins with a 1,000 BDT fee (refundable if upheld).',
    defaultSelected: true
  },
  {
    id: 'r_entry_fee_due',
    category: 'অভিযোগ, ফি ও জরুরি নীতি',
    categoryEn: 'Protests, Fees & Contingencies',
    categoryIcon: '🛡️',
    title: 'এন্ট্রি ফি পরিশোধের শর্ত',
    titleEn: 'Advance Entry Fee Clearance',
    desc: 'ফিকশ্চার প্রকাশের বা প্রথম ম্যাচ খেলার পূর্বেই টুর্নামেন্টের সম্পূর্ণ এন্ট্রি ফি পরিশোধ করতে হবে। অনাদায়ে দল বাতিল হবে।',
    descEn: 'All team entry fees must be fully paid prior to fixture release or kickoff. Unpaid squads forfeit their slot.',
    defaultSelected: true
  },
  {
    id: 'r_weather_interruption',
    category: 'অভিযোগ, ফি ও জরুরি নীতি',
    categoryEn: 'Protests, Fees & Contingencies',
    categoryIcon: '🛡️',
    title: 'প্রাকৃতিক দুর্যোগ ও বৃষ্টি নীতি',
    titleEn: 'Weather & Interruption Policy',
    desc: 'প্রাকৃতিক কারণে বা আলো স্বল্পতায় খেলা বন্ধ হলে আয়োজক কমিটির সিদ্ধান্ত অনুযায়ী বাকি খেলা পরবর্তী দিনে অনুষ্ঠিত হবে বা ড্র নিষ্পত্তির সিদ্ধান্ত নেওয়া হবে।',
    descEn: 'In case of severe rain, force majeure, or low light, the committee will reschedule remaining play or apply tiebreaker provisions.',
    defaultSelected: true
  }
];

const STANDARD_RULES_PRESET = [
  'r_squad_11', 'r_onfield_11', 'r_residency', 'r_single_team',
  'r_match_duration_90', 'r_extra_time_fifa', 'r_early_reporting',
  'r_walkover', 'r_dress_code', 'r_fifa_points', 'r_pen_count_fifa',
  'r_standings_tiebreaker', 'r_referee_final', 'r_violence_expulsion',
  'r_yellow_card', 'r_red_card', 'r_fifa_offside', 'r_fifa_subs',
  'r_backpass_rule', 'r_protest_fee', 'r_entry_fee_due', 'r_weather_interruption'
];

const MINIBAR_RULES_PRESET = [
  'r_squad_minibar', 'r_onfield_6', 'r_minibar_posts', 'r_residency',
  'r_single_team', 'r_match_duration', 'r_early_reporting', 'r_walkover',
  'r_dress_code', 'r_direct_shootout', 'r_pen_count', 'r_shootout_pts',
  'r_standings_tiebreaker', 'r_referee_final', 'r_violence_expulsion',
  'r_yellow_card', 'r_red_card', 'r_no_offside', 'r_rolling_subs',
  'r_minibar_gk_rules', 'r_backpass_rule', 'r_protest_fee',
  'r_entry_fee_due', 'r_weather_interruption'
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
