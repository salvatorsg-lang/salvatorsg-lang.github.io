/* Jonny Chai — portfolio interactions. No backend, no tracking. */
(function () {
  'use strict';

  /* ---------- Dark mode ---------- */
  var toggle = document.getElementById('theme-toggle');
  function applyTheme(dark) {
    document.documentElement.classList.toggle('dark', dark);
    if (toggle) toggle.textContent = dark ? 'Light mode' : 'Dark mode';
  }
  try {
    applyTheme(localStorage.getItem('jc-theme') === 'dark');
  } catch (e) { applyTheme(false); }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var dark = !document.documentElement.classList.contains('dark');
      try { localStorage.setItem('jc-theme', dark ? 'dark' : 'light'); } catch (e) {}
      applyTheme(dark);
    });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null;
    var duration = 1200;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('.stat-num');
  if ('IntersectionObserver' in window && counters.length) {
    var seen = new WeakSet();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { obs.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Health-score demo ----------
     Mirrors health_score.py exactly:
     adoption: adoption_pct * 0.4 (max 40)
     tickets:  max(0, 25 - tickets * 2.5) (max 25)
     sponsor:  20 if yes else 0
     QBR:      15 if <= 90 days, 0 if >= 180, else 15 * (180 - days) / 90
     Bands:    75+ Green, 50-74 Amber, below 50 Red. */
  function scoreHealth(adoption, tickets, sponsor, qbrDays) {
    var reasons = [];
    var adoptionPoints = adoption * 0.4;
    if (adoption < 50) reasons.push('low adoption (' + Math.round(adoption) + '%)');
    var ticketPoints = Math.max(0, 25 - tickets * 2.5);
    if (tickets >= 8) reasons.push('high ticket volume (' + tickets + ' in 90 days)');
    var sponsorPoints = sponsor ? 20 : 0;
    if (!sponsor) reasons.push('no active exec sponsor');
    var qbrPoints;
    if (qbrDays <= 90) qbrPoints = 15;
    else if (qbrDays >= 180) qbrPoints = 0;
    else qbrPoints = 15 * (180 - qbrDays) / 90;
    if (qbrDays > 120) reasons.push('no QBR in ' + qbrDays + ' days');
    var score = Math.round((adoptionPoints + ticketPoints + sponsorPoints + qbrPoints) * 10) / 10;
    var band = score >= 75 ? 'Green' : (score >= 50 ? 'Amber' : 'Red');
    return { score: score, band: band, reasons: reasons };
  }

  var adoptionEl = document.getElementById('adoption');
  var ticketsEl = document.getElementById('tickets');
  var sponsorEl = document.getElementById('sponsor');
  var qbrEl = document.getElementById('qbr');
  var scoreEl = document.getElementById('demo-score');
  var bandEl = document.getElementById('demo-band');
  var reasonEl = document.getElementById('demo-reason');

  function updateDemo() {
    if (!adoptionEl) return;
    var adoption = parseInt(adoptionEl.value, 10);
    var tickets = parseInt(ticketsEl.value, 10);
    var sponsor = sponsorEl.checked;
    var qbrDays = parseInt(qbrEl.value, 10);
    document.getElementById('adoption-out').textContent = adoption + '%';
    document.getElementById('tickets-out').textContent = tickets;
    document.getElementById('qbr-out').textContent = qbrDays;
    var r = scoreHealth(adoption, tickets, sponsor, qbrDays);
    scoreEl.textContent = r.score.toFixed(1);
    bandEl.textContent = r.band;
    bandEl.className = 'demo-band band-' + r.band.toLowerCase();
    reasonEl.textContent = r.reasons.length
      ? 'Watch: ' + r.reasons.join('; ') + '.'
      : 'Healthy — no red flags. Worth checking for expansion.';
  }
  if (adoptionEl) {
    [adoptionEl, ticketsEl, sponsorEl, qbrEl].forEach(function (el) {
      el.addEventListener('input', updateDemo);
      el.addEventListener('change', updateDemo);
    });
    updateDemo();
  }

  /* ---------- Prompt playground ---------- */
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
      var panel = document.getElementById('panel-' + tab.getAttribute('data-scenario'));
      if (panel) panel.classList.add('active');
    });
  });

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('data-copy'));
      var pre = panel ? panel.querySelector('.prompt') : null;
      if (!pre) return;
      var text = pre.textContent;
      function done() {
        var old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = old; }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });
  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    done();
  }

  /* Expose the scorer for testing (window.__scoreHealth). */
  window.__scoreHealth = scoreHealth;
})();
