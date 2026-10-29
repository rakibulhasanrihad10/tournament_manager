// ========================================================
// TOURNAMENT CALCULATIONS & LEADERBOARDS
// ========================================================

function recalculateAll() {
      const activeGroups = typeof getActiveGroups === 'function' ? getActiveGroups() : GROUPS;
      const activeMatches = typeof getActiveGroupMatches === 'function' ? getActiveGroupMatches() : GROUP_MATCH_DEFS;

      // 1. Initialize stats for all active teams
      const teamStats = {};
      for (const grp in activeGroups) {
        activeGroups[grp].forEach(t => {
          teamStats[t] = {
            name: t,
            group: grp,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            gf: 0,
            ga: 0,
            gd: 0,
            fp: 0, // Fair Play Points
            yellowCards: 0,
            redCards: 0,
            pts: 0,
            form: []
          };
        });
      }

      // 2. Compute group match results
      activeMatches.forEach(m => {
        const score = matchScores[m.id];
        const winnerEl = document.getElementById('m' + m.id + '-winner');
        const penWrap = document.getElementById('m' + m.id + '-pen-wrap');

        if (!teamStats[m.t1]) {
          teamStats[m.t1] = { name: m.t1, group: m.group || 'A', played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, fp: 0, yellowCards: 0, redCards: 0, pts: 0, form: [] };
        }
        if (!teamStats[m.t2]) {
          teamStats[m.t2] = { name: m.t2, group: m.group || 'A', played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, fp: 0, yellowCards: 0, redCards: 0, pts: 0, form: [] };
        }

        if (score && score.s1 !== '' && score.s2 !== '' && !isNaN(score.s1) && !isNaN(score.s2)) {
          const s1 = score.s1;
          const s2 = score.s2;

          teamStats[m.t1].played++;
          teamStats[m.t2].played++;
          teamStats[m.t1].gf += s1;
          teamStats[m.t1].ga += s2;
          teamStats[m.t2].gf += s2;
          teamStats[m.t2].ga += s1;

          let winner = null;
          let loser = null;
          let isDraw = false;

          if (s1 > s2) {
            winner = m.t1;
            loser = m.t2;
            teamStats[m.t1].wins++;
            teamStats[m.t1].pts += 3;
            teamStats[m.t1].form.push('W');

            teamStats[m.t2].losses++;
            teamStats[m.t2].form.push('L');
          } else if (s2 > s1) {
            winner = m.t2;
            loser = m.t1;
            teamStats[m.t2].wins++;
            teamStats[m.t2].pts += 3;
            teamStats[m.t2].form.push('W');

            teamStats[m.t1].losses++;
            teamStats[m.t1].form.push('L');
          } else {
            isDraw = true;
            const chosenPen = penaltyWinners[m.id];
            if (chosenPen) {
              winner = chosenPen;
              loser = (chosenPen === m.t1) ? m.t2 : m.t1;

              teamStats[winner].wins++;
              teamStats[winner].pts += 3;
              teamStats[winner].form.push('W');

              teamStats[loser].losses++;
              teamStats[loser].form.push('L');
            } else {
              teamStats[m.t1].draws++;
              teamStats[m.t1].pts += 1;
              teamStats[m.t1].form.push('D');

              teamStats[m.t2].draws++;
              teamStats[m.t2].pts += 1;
              teamStats[m.t2].form.push('D');
            }
          }

          if (isDraw) {
            const pen = penaltyScores[m.id] || {};
            const hasPenScore = pen.p1 !== undefined && pen.p1 !== '' && pen.p2 !== undefined && pen.p2 !== '';
            const penTxt = hasPenScore ? ' (পেনাল্টি ' + pen.p1 + '-' + pen.p2 + ')' : (winner ? ' (টাইব্রেকার)' : '');

            if (winnerEl) {
              if (winner) {
                winnerEl.innerHTML = '<span style="color:#1b5e20; font-weight:800;">✔ ' + winner + penTxt + '</span>';
              } else {
                winnerEl.innerHTML = '<span style="color:#c62828; font-weight:700;">ড্র (টাইব্রেকার প্রয়োজন)</span>';
              }
            }

            if (penWrap) {
              penWrap.style.display = 'flex';
              const p1Val = pen.p1 !== undefined ? pen.p1 : '';
              const p2Val = pen.p2 !== undefined ? pen.p2 : '';
              penWrap.innerHTML = '<div class="pen-widget-card">' +
                '<div style="display:flex; align-items:center; gap:3px;">' +
                  '<span style="font-size:8px; font-weight:700; color:#b91c1c;">পেনাল্টি:</span>' +
                  '<input type="number" min="0" max="30" class="pen-score-input" id="m' + m.id + '-p1" placeholder="০" value="' + p1Val + '" oninput="onPenaltyScoreChange(' + m.id + ')" title="' + m.t1 + ' পেনাল্টি">' +
                  '<span style="font-size:8px; font-weight:700; color:#64748b;">-</span>' +
                  '<input type="number" min="0" max="30" class="pen-score-input" id="m' + m.id + '-p2" placeholder="০" value="' + p2Val + '" oninput="onPenaltyScoreChange(' + m.id + ')" title="' + m.t2 + ' পেনাল্টি">' +
                '</div>' +
                '<div style="display:flex; gap:3px;">' +
                  '<button type="button" class="pen-btn ' + (winner === m.t1 ? 'active' : '') + '" onclick="setShootoutWinner(' + m.id + ', \'' + m.t1 + '\')">' + m.t1 + '</button>' +
                  '<button type="button" class="pen-btn ' + (winner === m.t2 ? 'active' : '') + '" onclick="setShootoutWinner(' + m.id + ', \'' + m.t2 + '\')">' + m.t2 + '</button>' +
                '</div>' +
              '</div>';
            }
          } else if (winner) {
            if (winnerEl) winnerEl.innerHTML = '<span style="color:#1b5e20;">✔ ' + winner + '</span>';
            if (penWrap) penWrap.style.display = 'none';
          }
        } else {
          if (winnerEl) winnerEl.innerHTML = '__________________';
          if (penWrap) penWrap.style.display = 'none';
        }
      });

      // 3. Process Cards (Fair Play) & Goals Leaderboard from Match Events
      const playerGoals = {}; // { 'Player Name': { goals: number, team: string } }

      for (const mId in matchEvents) {
        const events = matchEvents[mId] || [];
        events.forEach(e => {
          if (e.type === 'card' && teamStats[e.team]) {
            if (e.cardType === 'yellow') {
              teamStats[e.team].yellowCards++;
              teamStats[e.team].fp -= 1; // -1 per yellow
            } else if (e.cardType === 'red') {
              teamStats[e.team].redCards++;
              teamStats[e.team].fp -= 3; // -3 per red
            }
          } else if (e.type === 'goal') {
            const pKey = e.player + ' (' + e.team + ')';
            if (!playerGoals[pKey]) {
              playerGoals[pKey] = { name: e.player, team: e.team, goals: 0 };
            }
            playerGoals[pKey].goals += e.count || 1;
          }
        });
      }

      // Compute GD for all teams
      for (const t in teamStats) {
        teamStats[t].gd = teamStats[t].gf - teamStats[t].ga;
      }

      // 4. Render Standings Tables & Qualifications (Points -> GD -> GF -> FP)
      const groupChampions = {};
      const groupRunnersUp = [];
      const groupKeys = Object.keys(activeGroups);

      for (const grp in activeGroups) {
        const teamsInGrp = (activeGroups[grp] || []).map(t => teamStats[t] || {
          name: t, group: grp, played: 0, wins: 0, draws: 0, losses: 0,
          gf: 0, ga: 0, gd: 0, fp: 0, pts: 0, form: []
        });

        // Complete Football Tiebreaker:
        // 1. Points (DESC) -> 2. Goal Difference (DESC) -> 3. Goals Scored (DESC) -> 4. Fair Play (DESC)
        teamsInGrp.sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.gd !== a.gd) return b.gd - a.gd;
          if (b.gf !== a.gf) return b.gf - a.gf;
          return b.fp - a.fp;
        });

        renderGroupRows(grp, teamsInGrp);

        const champ = (teamsInGrp[0] && (teamsInGrp[0].played > 0 || teamsInGrp[0].pts > 0)) ? teamsInGrp[0] : null;
        const ru = (teamsInGrp[1] && (teamsInGrp[1].played > 0 || teamsInGrp[1].pts > 0)) ? teamsInGrp[1] : null;

        groupChampions[grp] = champ;
        if (ru) groupRunnersUp.push(ru);

        const champDisp = document.getElementById('champ-' + grp.toLowerCase() + '-display');
        if (champDisp) {
          champDisp.textContent = champ ? champ.name : '';
        }
      }

      // 5. Best Runner-Up calculation
      let bestRunnerUp = null;
      if (groupRunnersUp.length > 0) {
        groupRunnersUp.sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.gd !== a.gd) return b.gd - a.gd;
          if (b.gf !== a.gf) return b.gf - a.gf;
          return b.fp - a.fp;
        });
        bestRunnerUp = groupRunnersUp[0];
      }

      const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
      const bestRuDisp = document.getElementById('best-ru-display');
      if (bestRuDisp) {
        if (bestRunnerUp && groupKeys.length >= 3) {
          const grpWord = isEn ? 'Group' : 'গ্রুপ';
          const ptsWord = isEn ? 'pts' : 'পয়েন্ট';
          const gdWord = isEn ? 'GD' : 'ব্যবধান';
          const gdVal = bestRunnerUp.gd > 0 ? '+' + bestRunnerUp.gd : bestRunnerUp.gd;
          bestRuDisp.textContent = `${bestRunnerUp.name} (${grpWord} ${bestRunnerUp.group} - ${bestRunnerUp.pts} ${ptsWord}, ${gdWord} ${gdVal})`;
        } else {
          bestRuDisp.textContent = '';
        }
      }

      // 6. Knockout Bracket Team Names
      let semi1_t1 = '';
      let semi1_t2 = '';
      let semi2_t1 = '';
      let semi2_t2 = '';

      if (groupKeys.length === 2) {
        // 2 Groups Format (6, 7, 8 teams): A1 vs B2, B1 vs A2
        const champA = groupChampions['A']?.name || (isEn ? 'Group A Winner' : 'গ্রুপ এ চ্যাম্পিয়ন');
        const champB = groupChampions['B']?.name || (isEn ? 'Group B Winner' : 'গ্রুপ বি চ্যাম্পিয়ন');
        const ruA = groupRunnersUp.find(r => r.group === 'A')?.name || (isEn ? 'Group A Runner-Up' : 'গ্রুপ এ রানার্স-আপ');
        const ruB = groupRunnersUp.find(r => r.group === 'B')?.name || (isEn ? 'Group B Runner-Up' : 'গ্রুপ বি রানার্স-আপ');
        semi1_t1 = champA;
        semi1_t2 = ruB;
        semi2_t1 = champB;
        semi2_t2 = ruA;
      } else if (groupKeys.length === 1) {
        // Single League / 1 Group
        const grpTeams = activeGroups['A'] ? activeGroups['A'].map(t => teamStats[t] || { name: t, pts: 0, gd: 0, gf: 0, fp: 0 }) : [];
        grpTeams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || b.fp - a.fp);
        semi1_t1 = grpTeams[0]?.name || (isEn ? 'Rank 1 Team' : 'শীর্ষ দল ১');
        semi1_t2 = grpTeams[3]?.name || (isEn ? 'Rank 4 Team' : 'শীর্ষ দল ৪');
        semi2_t1 = grpTeams[1]?.name || (isEn ? 'Rank 2 Team' : 'শীর্ষ দল ২');
        semi2_t2 = grpTeams[2]?.name || (isEn ? 'Rank 3 Team' : 'শীর্ষ দল ৩');
      } else {
        // 3 Groups or default (9 teams): A1 vs Best RU, B1 vs C1
        const champA = groupChampions['A']?.name || '';
        const champB = groupChampions['B']?.name || '';
        const champC = groupChampions['C']?.name || '';
        const bestRuName = bestRunnerUp?.name || '';
        const bestRuGrp = bestRunnerUp?.group || '';

        const defChampA = isEn ? 'Group A Champion' : 'গ্রুপ এ চ্যাম্পিয়ন';
        const defBestRu = isEn ? 'Best Runner-Up' : 'সেরা রানার্স-আপ';
        const defChampB = isEn ? 'Group B Champion' : 'গ্রুপ বি চ্যাম্পিয়ন';
        const defChampC = isEn ? 'Group C Champion' : 'গ্রুপ সি চ্যাম্পিয়ন';

        semi1_t1 = champA || defChampA;
        semi1_t2 = bestRuName || defBestRu;
        semi2_t1 = champB || defChampB;
        semi2_t2 = champC || defChampC;

        const swapNote = document.getElementById('swap-notification-note');
        if (bestRuGrp === 'A' && champA && bestRuName) {
          semi1_t2 = champB;
          semi2_t1 = bestRuName;
          if (swapNote) {
            swapNote.innerHTML = isEn
              ? '<strong>⚡ Special Rule Applied:</strong> Because the Best Runner-Up (' + bestRuName + ') qualified from Group A, they have been swapped with the Group B winner to avoid an immediate rematch in Semi-Final 1.'
              : '<strong>⚡ বিশেষ নিয়ম বাস্তবায়ন:</strong> সেরা রানার্স-আপ (' + bestRuName + ') গ্রুপ এ-র দল হওয়ায় একই গ্রুপের মুড়িয়ারা/নোয়াপাড়া/চিতড্ডার সাথে রি-ম্যাচ এড়াতে ১ম সেমিফাইনালে তাদের গ্রুপ বি চ্যাম্পিয়নের সাথে অদলবদল করা হয়েছে।';
            swapNote.style.background = '#e8f5e9';
            swapNote.style.borderColor = '#4caf50';
          }
        } else if (swapNote) {
          swapNote.innerHTML = isEn
            ? '<strong>ℹ️ Important Note:</strong> If the Best Runner-Up team advances from Group A, tournament regulations permit swapping them with the Group B or C champion to prevent an immediate group-stage rematch in Semi-Final 1.'
            : '<strong>ℹ️ বিশেষ দ্রষ্টব্য:</strong> ১ম সেমিফাইনালে সেরা রানার্স-আপ দলটি যদি আবার \'গ্রুপ এ\' থেকেই আসে, তবে নিয়ম অনুযায়ী নিজেদের গ্রুপের চ্যাম্পিয়নের সাথে না খেলিয়ে তাদের \'গ্রুপ বি\' বা \'সি\' চ্যাম্পিয়নের সাথে অদলবদল করে দেওয়া যাবে।';
          swapNote.style.background = '#fff8e1';
          swapNote.style.borderColor = '#ffe082';
        }
      }

      updateElementText('ko10-t1', semi1_t1);
      updateElementText('ko10-t2', semi1_t2);
      updateElementText('ko11-t1', semi2_t1);
      updateElementText('ko11-t2', semi2_t2);

      const semi1Res = evalKoMatch(10, semi1_t1, semi1_t2);
      const semi2Res = evalKoMatch(11, semi2_t1, semi2_t2);

      const play3_t1 = semi1Res.loser || '১ম সেমি পরাজিত';
      const play3_t2 = semi2Res.loser || '২য় সেমি পরাজিত';
      updateElementText('ko12-t1', play3_t1);
      updateElementText('ko12-t2', play3_t2);

      const final_t1 = semi1Res.winner || '১ম সেমি বিজয়ী';
      const final_t2 = semi2Res.winner || '২য় সেমি বিজয়ী';
      updateElementText('ko13-t1', final_t1);
      updateElementText('ko13-t2', final_t2);

      const play3Res = evalKoMatch(12, play3_t1, play3_t2);
      const play3WinnerBox = document.querySelector('#ko12-winner .winner-blank-content');
      if (play3WinnerBox) {
        play3WinnerBox.textContent = play3Res.winner ? '🥉 ' + play3Res.winner : '';
      }

      const finalRes = evalKoMatch(13, final_t1, final_t2);
      const finalWinnerBox = document.querySelector('#ko13-winner .winner-blank-content');
      if (finalWinnerBox) {
        finalWinnerBox.textContent = finalRes.winner ? '🏆 ' + finalRes.winner : '';
      }

      // 7. Update Golden Boot Leaderboard & Award Input
      updateGoldenBootLeaderboard(playerGoals);
      if (typeof renderPage2OperationsHub === 'function') {
        renderPage2OperationsHub(playerGoals, teamStats);
      }
    }

    function renderGroupRows(grpId, teams) {
      const tbody = document.getElementById('tbody-group-' + grpId);
      if (!tbody) return;

      tbody.innerHTML = teams.map((t, idx) => {
        const rank = idx + 1;
        const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : 'rank-3';
        const gdSign = t.gd > 0 ? '+' + t.gd : t.gd.toString();
        const gdClass = t.gd > 0 ? 'gd-pos' : t.gd < 0 ? 'gd-neg' : 'gd-zero';
        const goalRec = t.played > 0 ? t.gf + '-' + t.ga : '০-০';

        const fpSign = t.fp === 0 ? '০' : t.fp.toString();
        const fpClass = t.fp === 0 ? 'fp-perfect' : t.fp >= -2 ? 'fp-warn' : 'fp-danger';

        const formBadges = t.form.length > 0
          ? t.form.map(f => '<span class="form-badge form-' + f.toLowerCase() + '">' + f + '</span>').join('')
          : '<span class="form-empty">-</span>';

        const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
        const yLbl = typeof t === 'function' ? t('fp.yellow') : 'হলুদ কার্ড';
        const rLbl = typeof t === 'function' ? t('fp.red') : 'লাল কার্ড';
        const zeroDisp = isEn ? '0' : '০';
        const fpDisp = t.fp === 0 ? zeroDisp : t.fp.toString();

        return '<tr class="' + rankClass + '">' +
          '<td style="font-weight: 800; color: #475569;">' + rank + '</td>' +
          '<td class="team-name-cell"><strong>' + t.name + '</strong>' + (rank === 1 && t.pts > 0 ? ' 🥇' : rank === 2 && t.pts > 0 ? ' 🥈' : '') + '</td>' +
          '<td>' + t.played + '</td>' +
          '<td>' + t.wins + '</td>' +
          '<td>' + t.draws + '</td>' +
          '<td>' + t.losses + '</td>' +
          '<td class="goal-record">' + (t.played > 0 ? (t.gf + '-' + t.ga) : (isEn ? '0-0' : '০-০')) + '</td>' +
          '<td class="gd-record ' + gdClass + '">' + (t.played > 0 ? gdSign : zeroDisp) + '</td>' +
          '<td class="fp-record ' + fpClass + '" title="' + yLbl + ': ' + t.yellowCards + ', ' + rLbl + ': ' + t.redCards + '">' + fpDisp + '</td>' +
          '<td><span class="pts-badge">' + t.pts + '</span></td>' +
          '<td><div class="form-wrap">' + formBadges + '</div></td>' +
        '</tr>';
      }).join('');
    }

    function updateGoldenBootLeaderboard(playerGoals) {
      const topListEl = document.getElementById('golden-boot-top-list');
      const topPlayers = Object.values(playerGoals).sort((a, b) => b.goals - a.goals);

      if (!topListEl) return;

      if (topPlayers.length === 0) {
        const noGoalsMsg = typeof t === 'function' ? t('common.no_goals_logged') : 'কোনো গোল এখনো নথিভুক্ত হয়নি';
        topListEl.innerHTML = '<span class="lead-chip" style="background:#f8fafc; border-color:#cbd5e1; color:#64748b;">' + noGoalsMsg + '</span>';
        return;
      }

      const medals = ['🥇', '🥈', '🥉'];
      const goalsWord = typeof t === 'function' ? t('common.goals') : 'গোল';
      topListEl.innerHTML = topPlayers.slice(0, 5).map((p, i) => {
        const medal = medals[i] || '';
        return '<span class="lead-chip">' + (i + 1) + '. ' + p.name + ' (' + p.team + ') — ' + p.goals + ' ' + goalsWord + ' ' + medal + '</span>';
      }).join('');

      // Auto-populate Bottom Award for Golden Boot
      if (topPlayers.length > 0) {
        const topScorer = topPlayers[0];
        const nameInp = document.getElementById('award-top-scorer-name');
        const teamInp = document.getElementById('award-top-scorer-team');
        const goalsInp = document.getElementById('award-top-scorer-goals');

        if (nameInp) nameInp.value = topScorer.name;
        if (teamInp) teamInp.value = topScorer.team;
        if (goalsInp) goalsInp.value = topScorer.goals;
      }
    }

    function evalKoMatch(mId, t1Name, t2Name) {
      const score = koScores[mId];
      const winnerEl = document.querySelector('#ko' + mId + '-winner .winner-blank-content');
      const penWrap = document.getElementById('ko' + mId + '-pen-wrap');

      if (!score || score.s1 === '' || score.s2 === '' || isNaN(score.s1) || isNaN(score.s2)) {
        if (winnerEl) winnerEl.textContent = '';
        if (penWrap) penWrap.style.display = 'none';
        return { winner: null, loser: null };
      }

      const s1 = score.s1;
      const s2 = score.s2;

      let winner = null;
      let loser = null;
      let isDraw = false;

      if (s1 > s2) {
        winner = t1Name;
        loser = t2Name;
      } else if (s2 > s1) {
        winner = t2Name;
        loser = t1Name;
      } else {
        isDraw = true;
        const chosenPen = koPenWinners[mId];
        if (chosenPen) {
          winner = chosenPen;
          loser = (chosenPen === t1Name) ? t2Name : t1Name;
        }
      }

      if (isDraw) {
        const pen = koPenScores[mId] || {};
        const hasPenScore = pen.p1 !== undefined && pen.p1 !== '' && pen.p2 !== undefined && pen.p2 !== '';
        const penTxt = hasPenScore ? ' (পেনাল্টি ' + pen.p1 + '-' + pen.p2 + ')' : (winner ? ' (টাইব্রেকার)' : '');

        if (winnerEl) {
          winnerEl.innerHTML = winner
            ? '<span style="color:#1b5e20; font-weight:800;">✔ ' + winner + penTxt + '</span>'
            : '<span style="color:#c62828; font-weight:700;">ড্র (টাইব্রেকার প্রয়োজন)</span>';
        }

        if (penWrap) {
          penWrap.style.display = 'flex';
          const p1Val = pen.p1 !== undefined ? pen.p1 : '';
          const p2Val = pen.p2 !== undefined ? pen.p2 : '';
          penWrap.innerHTML = '<div class="pen-widget-card">' +
            '<div style="display:flex; align-items:center; gap:3px;">' +
              '<span style="font-size:8px; font-weight:700; color:#b91c1c;">পেনাল্টি:</span>' +
              '<input type="number" min="0" max="30" class="pen-score-input" id="ko' + mId + '-p1" placeholder="০" value="' + p1Val + '" oninput="onKoPenaltyScoreChange(' + mId + ')" title="' + t1Name + ' পেনাল্টি">' +
              '<span style="font-size:8px; font-weight:700; color:#64748b;">-</span>' +
              '<input type="number" min="0" max="30" class="pen-score-input" id="ko' + mId + '-p2" placeholder="০" value="' + p2Val + '" oninput="onKoPenaltyScoreChange(' + mId + ')" title="' + t2Name + ' পেনাল্টি">' +
            '</div>' +
            '<div style="display:flex; gap:3px;">' +
              '<button type="button" class="pen-btn ' + (winner === t1Name ? 'active' : '') + '" onclick="setKoShootoutWinner(' + mId + ', \'' + t1Name + '\')">' + t1Name + '</button>' +
              '<button type="button" class="pen-btn ' + (winner === t2Name ? 'active' : '') + '" onclick="setKoShootoutWinner(' + mId + ', \'' + t2Name + '\')">' + t2Name + '</button>' +
            '</div>' +
          '</div>';
        }
      } else if (winner) {
        if (winnerEl) winnerEl.textContent = '✔ ' + winner;
        if (penWrap) penWrap.style.display = 'none';
      }

      return { winner, loser };
    }

    function updateElementText(id, text) {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    }

    // ========================================================
    // DYNAMIC STANDINGS & SCHEDULE DOM BUILDERS
    // ========================================================
    function renderDynamicStandings() {
      const container = document.getElementById('dynamic-standings-container');
      if (!container) return;

      const activeGroups = typeof getActiveGroups === 'function' ? getActiveGroups() : GROUPS;
      const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
      const groupKeys = Object.keys(activeGroups);
      const type = tournamentConfig.tournamentType || 'groups';

      // For standard default 3-group format with existing markup, if groups match A, B, C, keep IDs
      const groupColors = {
        'A': { border: '#b71c1c', cls: 'ga', titleBn: '🏆 গ্রুপ এ (Group A)', titleEn: '🏆 Group A' },
        'B': { border: '#0d47a1', cls: 'gb', titleBn: '🏆 গ্রুপ বি (Group B)', titleEn: '🏆 Group B' },
        'C': { border: '#1b5e20', cls: 'gc', titleBn: '🏆 গ্রুপ সি (Group C)', titleEn: '🏆 Group C' },
        'D': { border: '#7c3aed', cls: 'gd', titleBn: '🏆 গ্রুপ ডি (Group D)', titleEn: '🏆 Group D' }
      };

      let html = '';
      groupKeys.forEach(grp => {
        const meta = groupColors[grp] || { border: '#0284c7', cls: 'ga', titleBn: `🏆 গ্রুপ ${grp}`, titleEn: `🏆 Group ${grp}` };
        const teamsInGrp = activeGroups[grp] || [];
        const grpTitle = isEn ? meta.titleEn : meta.titleBn;
        const teamWord = isEn ? 'Teams' : 'দল';
        const matchWord = isEn ? 'Matches' : 'ম্যাচ';
        const matchCount = Math.max(1, Math.round((teamsInGrp.length * (teamsInGrp.length - 1)) / 2));

        html += `
          <div class="grp-table-wrap">
            <div class="grp-hd ${meta.cls}">
              <span>${grpTitle}</span>
              <span style="font-size:9px; opacity:0.9;">${teamsInGrp.length} ${teamWord} • ${matchCount} ${matchWord}</span>
            </div>
            <table class="standings-table">
              <thead>
                <tr>
                  <th style="width: 5%;">#</th>
                  <th style="width: 32%; text-align: left; padding-left: 5px;">${isEn ? 'Team Name' : 'দলের নাম'}</th>
                  <th style="width: 7%;" title="${isEn ? 'Played' : 'ম্যাচ খেলেছে'}">PL</th>
                  <th style="width: 6%;" title="${isEn ? 'Won' : 'জয়'}">W</th>
                  <th style="width: 6%;" title="${isEn ? 'Drawn' : 'ড্র'}">D</th>
                  <th style="width: 6%;" title="${isEn ? 'Lost' : 'হার'}">L</th>
                  <th style="width: 11%;" title="${isEn ? 'Goals +/-' : 'দেওয়া-খাওয়া গোল (+/-)'}">+/-</th>
                  <th style="width: 7%;" title="${isEn ? 'Goal Difference' : 'গোল ব্যবধান'}">GD</th>
                  <th style="width: 6%;" title="${isEn ? 'Fair Play' : 'ফেয়ার প্লে পয়েন্ট'}">FP</th>
                  <th style="width: 7%;" title="${isEn ? 'Points' : 'মোট পয়েন্ট'}">PTS</th>
                  <th style="width: 11%;" title="${isEn ? 'Recent Form' : 'সাম্প্রতিক ফর্ম'}">Form</th>
                </tr>
              </thead>
              <tbody id="tbody-group-${grp}">
        `;

        teamsInGrp.forEach((tName, idx) => {
          html += `
            <tr class="rank-${idx + 1}">
              <td>${idx + 1}</td>
              <td class="team-name-cell">${escapeHtml(tName)}</td>
              <td>০</td><td>০</td><td>০</td><td>০</td>
              <td class="goal-record">০-০</td>
              <td class="gd-record gd-zero">০</td>
              <td><span class="pts-badge">০</span></td>
              <td><span class="form-empty">-</span></td>
            </tr>
          `;
        });

        html += `
              </tbody>
            </table>
            <div class="grp-champ-row">
              <span>🏆 ${isEn ? `Group ${grp} Champion:` : `গ্রুপ ${grp} চ্যাম্পিয়ন:`}</span>
              <span class="champ-blank"><span id="champ-${grp.toLowerCase()}-display" class="champ-blank-content"></span></span>
            </div>
          </div>
        `;
      });

      if (groupKeys.length >= 3) {
        html += `
          <div class="best-ru-strip">
            <span>⭐ ${isEn ? 'Best Runner-up advancing to Semi-Finals:' : 'সেমিফাইনালে খেলার যোগ্য সেরা রানার্স-আপ (Best Runner-up):'}</span>
            <span class="ru-blank"><span id="best-ru-display" class="ru-blank-content"></span></span>
          </div>
        `;
      }

      container.innerHTML = html;
    }

    function renderDynamicSchedule() {
      const tbody = document.getElementById('dynamic-schedule-tbody');
      if (!tbody) return;

      const activeMatches = typeof getActiveGroupMatches === 'function' ? getActiveGroupMatches() : GROUP_MATCH_DEFS;
      const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

      const groupColors = {
        'A': '#b71c1c',
        'B': '#0d47a1',
        'C': '#1b5e20',
        'D': '#7c3aed',
        'KO': '#d97706'
      };

      tbody.innerHTML = activeMatches.map(m => {
        const grpColor = groupColors[m.group] || '#475569';
        const grpText = m.group === 'KO' ? (isEn ? 'Knockout' : 'নকআউট') : (isEn ? `Group ${m.group}` : `গ্রুপ ${m.group}`);

        return `
          <tr>
            <td>${m.id}</td>
            <td>${escapeHtml(m.time || '')}</td>
            <td style="color:${grpColor}; font-weight:700;">${grpText}</td>
            <td>
              <div class="match-vs-grid">
                <div class="team-left">${escapeHtml(m.t1)}</div>
                <div><span class="vs-badge">VS</span></div>
                <div class="team-right">${escapeHtml(m.t2)}</div>
              </div>
            </td>
            <td>
              <div class="score-wrap" onclick="openMatchEventsModal(${m.id})" title="${isEn ? 'Click to log goals & cards' : 'ক্লিক করে গোল ও কার্ড যোগ করুন'}">
                <input type="number" min="0" max="99" class="score-input" id="m${m.id}-s1" readonly placeholder="০">
                <span>-</span>
                <input type="number" min="0" max="99" class="score-input" id="m${m.id}-s2" readonly placeholder="০">
              </div>
              <div style="margin-top:2px; text-align:center;"><button type="button" class="btn-match-event" onclick="openMatchEventsModal(${m.id})">⚽/🟨 ${isEn ? 'Events' : 'ইভেন্ট'}</button></div>
            </td>
            <td>
              <span id="m${m.id}-winner" class="match-winner-txt">__________________</span>
              <div id="m${m.id}-pen-wrap" class="pen-picker-wrap" style="display:none;"></div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // ========================================================
    // DEMO DATA & RESET CONTROLS
    // ========================================================