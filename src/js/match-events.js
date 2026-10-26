// ========================================================
// MATCH EVENT TRACKING & LIVE SCOREBOARD
// ========================================================

function getMatchTeams(matchId) {
      const activeMatches = typeof getActiveGroupMatches === 'function' ? getActiveGroupMatches() : GROUP_MATCH_DEFS;
      const def = activeMatches.find(m => m.id === matchId);
      if (def) {
        return { t1: def.t1, t2: def.t2, isKnockout: def.group === 'KO' };
      } else {
        const t1El = document.getElementById('ko' + matchId + '-t1');
        const t2El = document.getElementById('ko' + matchId + '-t2');
        return {
          t1: t1El ? t1El.textContent.trim() : 'টিম ১',
          t2: t2El ? t2El.textContent.trim() : 'টিম ২',
          isKnockout: true
        };
      }
    }

    function populateModalDropdowns(matchId) {
      const { t1, t2 } = getMatchTeams(matchId);

      const t1GoalSel = document.getElementById('modal-t1-player-select');
      const t1CardSel = document.getElementById('modal-t1-card-player-select');
      const t2GoalSel = document.getElementById('modal-t2-player-select');
      const t2CardSel = document.getElementById('modal-t2-card-player-select');

      function buildPlayerOptions(teamName) {
        const teamData = teamRosters[teamName];
        let optionsHtml = '';
        if (teamData && Array.isArray(teamData.players) && teamData.players.length > 0) {
          teamData.players.forEach(p => {
            if (p && p.name && p.name.trim() !== '') {
              const jerseyPrefix = p.jersey ? '#' + p.jersey + ' ' : '';
              optionsHtml += '<option value="' + p.name + '">' + jerseyPrefix + p.name + '</option>';
            }
          });
        }
        if (!optionsHtml) {
          for (let i = 1; i <= 11; i++) {
            optionsHtml += '<option value="' + teamName + ' - খেলোয়াড় ' + i + '">' + teamName + ' - খেলোয়াড় ' + i + '</option>';
          }
        }
        return optionsHtml;
      }

      const t1Options = buildPlayerOptions(t1);
      const t2Options = buildPlayerOptions(t2);

      if (t1GoalSel) {
        t1GoalSel.innerHTML = t1Options + '<option value="অন্যান্য / অজ্ঞাত খেলোয়াড়">অন্যান্য / অজ্ঞাত খেলোয়াড়</option><option value="আত্মঘাতী গোল (Own Goal)">আত্মঘাতী গোল (Own Goal)</option>';
      }
      if (t1CardSel) {
        t1CardSel.innerHTML = t1Options + '<option value="অন্যান্য / কর্মকর্তা">অন্যান্য / কর্মকর্তা</option>';
      }
      if (t2GoalSel) {
        t2GoalSel.innerHTML = t2Options + '<option value="অন্যান্য / অজ্ঞাত খেলোয়াড়">অন্যান্য / অজ্ঞাত খেলোয়াড়</option><option value="আত্মঘাতী গোল (Own Goal)">আত্মঘাতী গোল (Own Goal)</option>';
      }
      if (t2CardSel) {
        t2CardSel.innerHTML = t2Options + '<option value="অন্যান্য / কর্মকর্তা">অন্যান্য / কর্মকর্তা</option>';
      }
    }

    function openMatchEventsModal(matchId) {
      activeModalMatchId = matchId;
      const modal = document.getElementById('match-events-modal');
      const titleEl = document.getElementById('modal-match-title');
      const t1NameEl = document.getElementById('modal-t1-name');
      const t2NameEl = document.getElementById('modal-t2-name');

      const liveT1 = document.getElementById('modal-live-t1-name');
      const liveT2 = document.getElementById('modal-live-t2-name');

      const { t1, t2 } = getMatchTeams(matchId);

      if (titleEl) titleEl.innerHTML = '⚽ ম্যাচ ' + matchId + ' ইভেন্ট ট্র্যাকার: <strong>' + t1 + '</strong> বনাম <strong>' + t2 + '</strong>';
      if (t1NameEl) t1NameEl.textContent = t1;
      if (t2NameEl) t2NameEl.textContent = t2;
      if (liveT1) liveT1.textContent = t1;
      if (liveT2) liveT2.textContent = t2;

      populateModalDropdowns(matchId);
      renderModalEventsLog(matchId);
      updateModalLiveScore(matchId);
      updateModalPenaltySection(matchId);

      const toast = document.getElementById('modal-toast-msg');
      if (toast) toast.style.display = 'none';

      if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
      }
    }

    function closeMatchEventsModal() {
      const modal = document.getElementById('match-events-modal');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
      activeModalMatchId = null;
    }

    function updateModalLiveScore(matchId) {
      const pill = document.getElementById('modal-live-score-pill');
      if (!pill) return;

      const { t1, t2, isKnockout } = getMatchTeams(matchId);
      let s1 = 0;
      let s2 = 0;

      // First check if events exist for this match
      const events = matchEvents[matchId] || [];
      const hasGoalEvents = events.some(e => e.type === 'goal');

      if (hasGoalEvents) {
        events.forEach(e => {
          if (e.type === 'goal') {
            if (e.team === t1) s1 += e.count;
            else if (e.team === t2) s2 += e.count;
          }
        });
      } else {
        // Fall back to current score input if no events logged yet
        if (!isKnockout) {
          s1 = matchScores[matchId]?.s1 !== undefined && matchScores[matchId]?.s1 !== '' ? matchScores[matchId].s1 : 0;
          s2 = matchScores[matchId]?.s2 !== undefined && matchScores[matchId]?.s2 !== '' ? matchScores[matchId].s2 : 0;
        } else {
          s1 = koScores[matchId]?.s1 !== undefined && koScores[matchId]?.s1 !== '' ? koScores[matchId].s1 : 0;
          s2 = koScores[matchId]?.s2 !== undefined && koScores[matchId]?.s2 !== '' ? koScores[matchId].s2 : 0;
        }
      }

      pill.textContent = s1 + ' - ' + s2;
      pill.classList.add('pulse');
      setTimeout(() => pill.classList.remove('pulse'), 300);
    }

    function showModalToast(message, isError) {
      const toast = document.getElementById('modal-toast-msg');
      if (!toast) return;
      toast.style.display = 'block';
      toast.style.background = isError ? '#fee2e2' : '#ecfdf5';
      toast.style.borderColor = isError ? '#ef4444' : '#10b981';
      toast.style.color = isError ? '#991b1b' : '#065f46';
      toast.innerHTML = message;
    }

    function autoSyncMatchScoreFromEvents(matchId) {
      const { t1, t2, isKnockout } = getMatchTeams(matchId);
      const events = matchEvents[matchId] || [];

      let s1 = 0;
      let s2 = 0;
      let hasGoals = false;

      events.forEach(e => {
        if (e.type === 'goal') {
          hasGoals = true;
          if (e.team === t1) s1 += e.count;
          else if (e.team === t2) s2 += e.count;
        }
      });

      if (!isKnockout) {
        const el1 = document.getElementById('m' + matchId + '-s1');
        const el2 = document.getElementById('m' + matchId + '-s2');
        const val1 = hasGoals ? s1 : (events.length > 0 ? 0 : '');
        const val2 = hasGoals ? s2 : (events.length > 0 ? 0 : '');

        if (el1) el1.value = val1;
        if (el2) el2.value = val2;

        matchScores[matchId] = {
          s1: val1,
          s2: val2
        };
        if (val1 === '' || val1 !== val2) {
          delete penaltyWinners[matchId];
          delete penaltyScores[matchId];
        }
      } else {
        const el1 = document.getElementById('ko' + matchId + '-s1');
        const el2 = document.getElementById('ko' + matchId + '-s2');
        const val1 = hasGoals ? s1 : (events.length > 0 ? 0 : '');
        const val2 = hasGoals ? s2 : (events.length > 0 ? 0 : '');

        if (el1) el1.value = val1;
        if (el2) el2.value = val2;

        koScores[matchId] = {
          s1: val1,
          s2: val2
        };
        if (val1 === '' || val1 !== val2) {
          delete koPenWinners[matchId];
          delete koPenScores[matchId];
        }
      }

      updateModalLiveScore(matchId);
      updateModalPenaltySection(matchId);
      recalculateAll();
      saveState();
    }

    function markMatchAsZeroDraw() {
      if (!activeModalMatchId) return;
      const { isKnockout } = getMatchTeams(activeModalMatchId);

      // Remove goals, keep cards if any
      if (matchEvents[activeModalMatchId]) {
        matchEvents[activeModalMatchId] = matchEvents[activeModalMatchId].filter(e => e.type !== 'goal');
      } else {
        matchEvents[activeModalMatchId] = [];
      }

      if (!isKnockout) {
        matchScores[activeModalMatchId] = { s1: 0, s2: 0 };
        const el1 = document.getElementById('m' + activeModalMatchId + '-s1');
        const el2 = document.getElementById('m' + activeModalMatchId + '-s2');
        if (el1) el1.value = 0;
        if (el2) el2.value = 0;
      } else {
        koScores[activeModalMatchId] = { s1: 0, s2: 0 };
        const el1 = document.getElementById('ko' + activeModalMatchId + '-s1');
        const el2 = document.getElementById('ko' + activeModalMatchId + '-s2');
        if (el1) el1.value = 0;
        if (el2) el2.value = 0;
      }

      renderModalEventsLog(activeModalMatchId);
      updateModalLiveScore(activeModalMatchId);
      updateModalPenaltySection(activeModalMatchId);
      recalculateAll();
      saveState();
      showModalToast('🎯 ম্যাচটি <strong>০ - ০ ড্র</strong> হিসেবে চিহ্নিত করা হয়েছে। নিচে টাইব্রেকার / পেনাল্টি শুটআউট থেকে বিজয়ী নির্ধারণ করুন!');
    }

    function clearCurrentMatchEvents() {
      if (!activeModalMatchId) return;
      if (!confirm('⚠️ আপনি কি এই ম্যাচের সমস্ত গোল, কার্ড ও স্কোর রিসেট করতে চান?')) return;

      const { isKnockout } = getMatchTeams(activeModalMatchId);
      delete matchEvents[activeModalMatchId];

      if (!isKnockout) {
        delete matchScores[activeModalMatchId];
        delete penaltyWinners[activeModalMatchId];
        delete penaltyScores[activeModalMatchId];
        const el1 = document.getElementById('m' + activeModalMatchId + '-s1');
        const el2 = document.getElementById('m' + activeModalMatchId + '-s2');
        if (el1) el1.value = '';
        if (el2) el2.value = '';
      } else {
        koScores[activeModalMatchId] = { s1: '', s2: '' };
        delete koPenWinners[activeModalMatchId];
        delete koPenScores[activeModalMatchId];
        const el1 = document.getElementById('ko' + activeModalMatchId + '-s1');
        const el2 = document.getElementById('ko' + activeModalMatchId + '-s2');
        if (el1) el1.value = '';
        if (el2) el2.value = '';
      }

      renderModalEventsLog(activeModalMatchId);
      updateModalLiveScore(activeModalMatchId);
      updateModalPenaltySection(activeModalMatchId);
      recalculateAll();
      saveState();
      showModalToast('🔄 এই ম্যাচের সমস্ত ফলাফল ও ইভেন্ট রিসেট করা হয়েছে।', true);
    }

    function addMatchEvent(type, teamNum) {
      if (!activeModalMatchId) return;

      const { t1, t2 } = getMatchTeams(activeModalMatchId);
      const teamName = teamNum === 1 ? t1 : t2;

      if (!matchEvents[activeModalMatchId]) {
        matchEvents[activeModalMatchId] = [];
      }

      if (type === 'goal') {
        const selectId = teamNum === 1 ? 'modal-t1-player-select' : 'modal-t2-player-select';
        const countId = teamNum === 1 ? 'modal-t1-goal-count' : 'modal-t2-goal-count';
        const player = document.getElementById(selectId)?.value || 'অজ্ঞাত গোলদাতা';
        const count = parseInt(document.getElementById(countId)?.value, 10) || 1;

        if (count > 4) {
          if (!confirm('⚠️ আপনি কি একবারে ' + count + 'টি গোল যোগ করতে চান?')) return;
        }

        matchEvents[activeModalMatchId].push({
          id: Date.now() + Math.random(),
          type: 'goal',
          team: teamName,
          player: player,
          count: count
        });

        // Instant Score Sync & Notification
        autoSyncMatchScoreFromEvents(activeModalMatchId);
        renderModalEventsLog(activeModalMatchId);
        showModalToast('⚽ গোল যোগ হয়েছে: <strong>' + player + '</strong> (' + count + ' গোল)। ম্যাচের স্কোর স্বয়ংক্রিয়ভাবে আপডেট করা হয়েছে!');
      } else if (type === 'card') {
        const selectId = teamNum === 1 ? 'modal-t1-card-player-select' : 'modal-t2-card-player-select';
        const cardTypeId = teamNum === 1 ? 'modal-t1-card-type' : 'modal-t2-card-type';
        const player = document.getElementById(selectId)?.value || 'অজ্ঞাত খেলোয়াড়';
        const cardType = document.getElementById(cardTypeId)?.value || 'yellow';

        // Check if player already received a yellow card in this match
        if (cardType === 'yellow') {
          const alreadyYellow = matchEvents[activeModalMatchId].some(e => e.type === 'card' && e.cardType === 'yellow' && e.player === player && e.team === teamName);
          if (alreadyYellow) {
            if (!confirm('⚠️ সতর্কতা: "' + player + '" ইতিমধ্যে এই ম্যাচে একটি হলুদ কার্ড পেয়েছেন!\n২য় হলুদ কার্ডের ফলে তিনি লাল কার্ড প্রাপ্ত হবেন (-৩ FP)। আপনি কি নিশ্চিত?')) {
              return;
            }
          }
        }

        matchEvents[activeModalMatchId].push({
          id: Date.now() + Math.random(),
          type: 'card',
          cardType: cardType,
          team: teamName,
          player: player
        });

        renderModalEventsLog(activeModalMatchId);
        recalculateAll();
        saveState();

        const cardLabel = cardType === 'red' ? '🟥 লাল কার্ড' : '🟨 হলুদ কার্ড';
        showModalToast(cardLabel + ' যোগ হয়েছে: <strong>' + player + '</strong> (' + teamName + ')। ফেয়ার প্লে পয়েন্ট আপডেট হয়েছে!');
      }
    }

    function deleteMatchEvent(eventId) {
      if (!activeModalMatchId || !matchEvents[activeModalMatchId]) return;

      const event = matchEvents[activeModalMatchId].find(e => e.id === eventId);
      if (!event) return;

      const typeDesc = event.type === 'goal' ? (event.count + 'টি গোল') : (event.cardType === 'red' ? 'লাল কার্ড' : 'হলুদ কার্ড');
      const confirmMsg = '⚠️ নিশ্চিতকরণ:\nআপনি কি "' + event.player + '" (' + event.team + ')-এর নথিভুক্ত ' + typeDesc + ' মুছে ফেলতে চান?\n\n(এটি মুছলে ম্যাচের স্কোর ও পয়েন্ট টেবিল স্বয়ংক্রিয়ভাবে সমন্বয় করা হবে)';

      if (!confirm(confirmMsg)) {
        return; // User cancelled, protection against accidental clicks
      }

      matchEvents[activeModalMatchId] = matchEvents[activeModalMatchId].filter(e => e.id !== eventId);

      // Instant Score Sync & Recalculate
      autoSyncMatchScoreFromEvents(activeModalMatchId);
      renderModalEventsLog(activeModalMatchId);
      showModalToast('🗑️ ' + typeDesc + ' সফলভাবে মুছে ফেলা হয়েছে এবং স্কোর সমন্বয় করা হয়েছে।', true);
    }

    function renderModalEventsLog(matchId) {
      const container = document.getElementById('modal-events-log');
      if (!container) return;

      const events = matchEvents[matchId] || [];
      if (events.length === 0) {
        container.innerHTML = '<div style="color:#94a3b8; font-style:italic;">এখনো কোনো গোল বা কার্ড যুক্ত করা হয়নি। উপরে ড্রপডাউন থেকে প্লেয়ার বেছে নিয়ে যোগ করুন।</div>';
        return;
      }

      container.innerHTML = events.map(e => {
        let icon = '⚽';
        let detail = '';
        if (e.type === 'goal') {
          icon = '⚽';
          detail = '<strong>' + e.player + '</strong> (' + e.team + ') — ' + e.count + ' গোল';
        } else if (e.type === 'card') {
          icon = e.cardType === 'red' ? '🟥 লাল কার্ড (-৩ FP)' : '🟨 হলুদ কার্ড (-১ FP)';
          detail = '<strong>' + e.player + '</strong> (' + e.team + ') — ' + icon;
        }

        return '<div class="event-log-item">' +
          '<div>' + icon + ' ' + detail + '</div>' +
          '<button type="button" class="btn-del-event" onclick="deleteMatchEvent(' + e.id + ')" title="ক্লিক করে এই ইভেন্টটি মুছুন">মুছুন ✕</button>' +
        '</div>';
      }).join('');
    }

    function syncMatchScoreFromEvents() {
      if (!activeModalMatchId) return;
      autoSyncMatchScoreFromEvents(activeModalMatchId);
      alert('ম্যাচের স্কোর ইভেন্ট অনুযায়ী স্বয়ংক্রিয়ভাবে সফলভাবে সিঙ্ক করা হয়েছে!');
    }

    // ========================================================
    // TOURNAMENT SCOREBOARD & RECALCULATION ENGINE
    // ========================================================
    function populateInputsFromState() {
      for (let i = 1; i <= 9; i++) {
        const s1 = matchScores[i]?.s1 !== undefined ? matchScores[i].s1 : '';
        const s2 = matchScores[i]?.s2 !== undefined ? matchScores[i].s2 : '';
        const el1 = document.getElementById('m' + i + '-s1');
        const el2 = document.getElementById('m' + i + '-s2');
        if (el1) el1.value = s1;
        if (el2) el2.value = s2;
      }
      for (let m = 10; m <= 13; m++) {
        const s1 = koScores[m]?.s1 !== undefined ? koScores[m].s1 : '';
        const s2 = koScores[m]?.s2 !== undefined ? koScores[m].s2 : '';
        const el1 = document.getElementById('ko' + m + '-s1');
        const el2 = document.getElementById('ko' + m + '-s2');
        if (el1) el1.value = s1;
        if (el2) el2.value = s2;
      }
    }

    function onScoreInput(matchId) {
      const s1Val = document.getElementById('m' + matchId + '-s1').value.trim();
      const s2Val = document.getElementById('m' + matchId + '-s2').value.trim();
      matchScores[matchId] = {
        s1: s1Val !== '' ? parseInt(s1Val, 10) : '',
        s2: s2Val !== '' ? parseInt(s2Val, 10) : ''
      };
      if (matchScores[matchId].s1 !== matchScores[matchId].s2) {
        delete penaltyWinners[matchId];
        delete penaltyScores[matchId];
      }
      recalculateAll();
      saveState();
    }

    function onKoScoreInput(matchId) {
      const s1Val = document.getElementById('ko' + matchId + '-s1').value.trim();
      const s2Val = document.getElementById('ko' + matchId + '-s2').value.trim();
      koScores[matchId] = {
        s1: s1Val !== '' ? parseInt(s1Val, 10) : '',
        s2: s2Val !== '' ? parseInt(s2Val, 10) : ''
      };
      if (koScores[matchId].s1 !== koScores[matchId].s2) {
        delete koPenWinners[matchId];
        delete koPenScores[matchId];
      }
      recalculateAll();
      saveState();
    }

    function onPenaltyScoreChange(matchId) {
      const p1El = document.getElementById('m' + matchId + '-p1');
      const p2El = document.getElementById('m' + matchId + '-p2');
      const p1Val = p1El ? p1El.value.trim() : '';
      const p2Val = p2El ? p2El.value.trim() : '';

      const p1 = p1Val !== '' ? parseInt(p1Val, 10) : '';
      const p2 = p2Val !== '' ? parseInt(p2Val, 10) : '';

      penaltyScores[matchId] = { p1, p2 };

      const def = GROUP_MATCH_DEFS.find(m => m.id === matchId);
      if (def && p1 !== '' && p2 !== '' && !isNaN(p1) && !isNaN(p2)) {
        if (p1 > p2) {
          penaltyWinners[matchId] = def.t1;
        } else if (p2 > p1) {
          penaltyWinners[matchId] = def.t2;
        }
      }

      recalculateAll();
      saveState();
      updateModalPenaltySection(matchId);
    }

    function onKoPenaltyScoreChange(matchId) {
      const p1El = document.getElementById('ko' + matchId + '-p1');
      const p2El = document.getElementById('ko' + matchId + '-p2');
      const p1Val = p1El ? p1El.value.trim() : '';
      const p2Val = p2El ? p2El.value.trim() : '';

      const p1 = p1Val !== '' ? parseInt(p1Val, 10) : '';
      const p2 = p2Val !== '' ? parseInt(p2Val, 10) : '';

      koPenScores[matchId] = { p1, p2 };

      const { t1, t2 } = getMatchTeams(matchId);
      if (p1 !== '' && p2 !== '' && !isNaN(p1) && !isNaN(p2)) {
        if (p1 > p2) {
          koPenWinners[matchId] = t1;
        } else if (p2 > p1) {
          koPenWinners[matchId] = t2;
        }
      }

      recalculateAll();
      saveState();
      updateModalPenaltySection(matchId);
    }

    function onModalPenScoreChange() {
      if (!activeModalMatchId) return;
      const s1El = document.getElementById('modal-pen-s1');
      const s2El = document.getElementById('modal-pen-s2');
      const p1Val = s1El ? s1El.value.trim() : '';
      const p2Val = s2El ? s2El.value.trim() : '';

      const p1 = p1Val !== '' ? parseInt(p1Val, 10) : '';
      const p2 = p2Val !== '' ? parseInt(p2Val, 10) : '';

      const { t1, t2, isKnockout } = getMatchTeams(activeModalMatchId);

      if (!isKnockout) {
        penaltyScores[activeModalMatchId] = { p1, p2 };
        if (p1 !== '' && p2 !== '' && !isNaN(p1) && !isNaN(p2)) {
          if (p1 > p2) penaltyWinners[activeModalMatchId] = t1;
          else if (p2 > p1) penaltyWinners[activeModalMatchId] = t2;
        }
      } else {
        koPenScores[activeModalMatchId] = { p1, p2 };
        if (p1 !== '' && p2 !== '' && !isNaN(p1) && !isNaN(p2)) {
          if (p1 > p2) koPenWinners[activeModalMatchId] = t1;
          else if (p2 > p1) koPenWinners[activeModalMatchId] = t2;
        }
      }

      recalculateAll();
      saveState();
      updateModalPenaltySection(activeModalMatchId);
    }

    function updateModalPenaltySection(matchId) {
      const penSec = document.getElementById('modal-penalty-section');
      if (!penSec) return;

      const { t1, t2, isKnockout } = getMatchTeams(matchId);
      const score = !isKnockout ? matchScores[matchId] : koScores[matchId];
      const isDraw = score && score.s1 !== '' && score.s2 !== '' && score.s1 === score.s2;

      if (!isDraw) {
        penSec.style.display = 'none';
        return;
      }

      penSec.style.display = 'block';
      const t1NameEl = document.getElementById('modal-pen-t1-name');
      const t2NameEl = document.getElementById('modal-pen-t2-name');
      const s1Inp = document.getElementById('modal-pen-s1');
      const s2Inp = document.getElementById('modal-pen-s2');
      const badgeEl = document.getElementById('modal-pen-winner-badge');

      if (t1NameEl) t1NameEl.textContent = t1 + ':';
      if (t2NameEl) t2NameEl.textContent = t2 + ':';

      const penData = !isKnockout ? (penaltyScores[matchId] || {}) : (koPenScores[matchId] || {});
      const winner = !isKnockout ? penaltyWinners[matchId] : koPenWinners[matchId];

      if (s1Inp) s1Inp.value = penData.p1 !== undefined ? penData.p1 : '';
      if (s2Inp) s2Inp.value = penData.p2 !== undefined ? penData.p2 : '';

      if (winner && badgeEl) {
        const p1 = penData.p1 !== undefined && penData.p1 !== '' ? penData.p1 : '';
        const p2 = penData.p2 !== undefined && penData.p2 !== '' ? penData.p2 : '';
        const scoreTxt = (p1 !== '' && p2 !== '') ? ' (' + p1 + ' - ' + p2 + ')' : '';
        badgeEl.innerHTML = '🏆 টাইব্রেকারে পেনাল্টিতে জয়ী: <strong>' + winner + '</strong>' + scoreTxt;
      } else if (badgeEl) {
        badgeEl.innerHTML = '<span style="color:#e11d48;">টাইব্রেকারের গোল লিখুন বা বিজয়ী দল নির্বাচন করুন</span>';
      }
    }

    function setShootoutWinner(matchId, winnerTeam) {
      penaltyWinners[matchId] = winnerTeam;
      recalculateAll();
      saveState();
    }

    function setKoShootoutWinner(matchId, winnerTeam) {
      koPenWinners[matchId] = winnerTeam;
      recalculateAll();
      saveState();
    }