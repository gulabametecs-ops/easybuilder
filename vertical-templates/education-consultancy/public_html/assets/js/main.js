// ===== Hamza Consultancy — front-end =====
(function () {
  // Mobile menu
  var toggle = document.getElementById('menuToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) toggle.addEventListener('click', function () { links.classList.toggle('open'); });

  // Navbar shadow on scroll
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    var onScroll = function () { navbar.classList.toggle('scrolled', window.scrollY > 12); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // Carousel arrows
  document.querySelectorAll('.carousel').forEach(function (car) {
    var track = car.querySelector('.track');
    var left = car.querySelector('.carousel-btn.left');
    var right = car.querySelector('.carousel-btn.right');
    var step = 260;
    if (left) left.addEventListener('click', function () { track.scrollBy({ left: -step * 2, behavior: 'smooth' }); });
    if (right) right.addEventListener('click', function () { track.scrollBy({ left: step * 2, behavior: 'smooth' }); });
  });

  // Hero slider
  var slides = document.querySelectorAll('.slide');
  if (slides.length > 1) {
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, 5500);
  }

  // Course tabs
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.querySelector(btn.getAttribute('data-target'));
      if (!target) return;
      var wrap = btn.closest('.course-tabs');
      wrap.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      wrap.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      target.classList.add('active');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () { q.parentElement.classList.toggle('open'); });
  });

  // Count-up stats
  var statEls = document.querySelectorAll('.stat-num[data-target]');
  if (statEls.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseInt(el.getAttribute('data-target'), 10) || 0, cur = 0;
        var stepv = Math.max(1, Math.round(target / 60));
        var t = setInterval(function () {
          cur += stepv; if (cur >= target) { cur = target; clearInterval(t); }
          el.firstChild.nodeValue = cur.toLocaleString();
        }, 25);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    statEls.forEach(function (el) { obs.observe(el); });
  }

  // Auto-open the consultation popup on the home page (once per browser session)
  if (window.HAMZA_AUTOPOPUP) {
    var show = function () { if (typeof openConsult === 'function') openConsult(); };
    var already = false;
    try { already = !!sessionStorage.getItem('hamzaPopupShown'); } catch (e) {}
    if (!already) {
      setTimeout(function () {
        show();
        try { sessionStorage.setItem('hamzaPopupShown', '1'); } catch (e) {}
      }, window.HAMZA_POPUP_DELAY || 1200);
    }
  }
})();

var _overlay = function () { return document.getElementById('consultOverlay'); };

// Fill the Course dropdown based on the chosen university
function populateCourses(uniName, selected) {
  var sel = document.getElementById('consultCourse');
  if (!sel) return;
  var data = window.HAMZA_COURSES || {};
  var list = data[uniName] || [];
  sel.innerHTML = '';
  var first = document.createElement('option');
  first.value = '';
  first.textContent = uniName ? (list.length ? 'Select a course' : 'Any / not sure') : 'Select a university first';
  sel.appendChild(first);
  list.forEach(function (c) {
    var o = document.createElement('option');
    o.value = c; o.textContent = c;
    if (selected && selected === c) o.selected = true;
    sel.appendChild(o);
  });
}

function openConsult() {
  var o = _overlay(); if (!o) return;
  document.getElementById('consultType').value = 'consultation';
  document.getElementById('consultTitle').textContent = 'Free Expert Consultation';
  document.getElementById('consultSub').style.display = '';
  document.getElementById('applySummary').style.display = 'none';
  document.getElementById('uniRow').style.display = '';
  document.getElementById('courseRow').style.display = '';
  var uni = document.getElementById('consultUni'); if (uni) uni.value = '';
  populateCourses('');
  resetConsultMsg();
  o.classList.add('open');
}

// Called by "Apply" buttons on course cards
function openApply(course, university) {
  var o = _overlay(); if (!o) return;
  document.getElementById('consultType').value = 'application';
  document.getElementById('consultTitle').textContent = 'Apply for Admission';
  document.getElementById('consultSub').style.display = 'none';
  var uni = document.getElementById('consultUni');
  if (uni) uni.value = university || '';
  populateCourses(university || '', course);
  // If the course isn't in the list, add it so it still submits
  var cs = document.getElementById('consultCourse');
  if (cs && course && cs.value !== course) {
    var o2 = document.createElement('option'); o2.value = course; o2.textContent = course; o2.selected = true;
    cs.appendChild(o2);
  }
  var sum = document.getElementById('applySummary');
  sum.textContent = 'Applying for: ' + course + (university ? ' — ' + university : '');
  sum.style.display = 'block';
  document.getElementById('uniRow').style.display = 'none';
  document.getElementById('courseRow').style.display = 'none';
  resetConsultMsg();
  o.classList.add('open');
}

function closeConsult() { var o = _overlay(); if (o) o.classList.remove('open'); }

function resetConsultMsg() {
  document.getElementById('consultOk').style.display = 'none';
  document.getElementById('consultErr').style.display = 'none';
  var f = document.getElementById('consultForm'); if (f) f.style.display = '';
}

// close on backdrop click
document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'consultOverlay') closeConsult();
});

function subscribeNews(ev) {
  ev.preventDefault();
  var form = ev.target, msg = document.getElementById('newsMsg');
  var btn = form.querySelector('button'); btn.disabled = true;
  fetch('api/newsletter.php', { method: 'POST', body: new FormData(form) })
    .then(function (r) { return r.json(); })
    .then(function (res) {
      msg.style.color = res.success ? '#7CFC98' : '#ffb3b3';
      msg.textContent = res.success ? 'Subscribed! Thank you.' : (res.error || 'Try again later.');
      if (res.success) form.reset();
    })
    .catch(function () { msg.textContent = 'Network error.'; msg.style.color = '#ffb3b3'; })
    .finally(function () { btn.disabled = false; });
  return false;
}

function submitConsult(ev) {
  ev.preventDefault();
  var form = document.getElementById('consultForm');
  var ok = document.getElementById('consultOk');
  var err = document.getElementById('consultErr');
  err.style.display = 'none';
  var data = new FormData(form);
  var btn = form.querySelector('button[type=submit]');
  btn.disabled = true; btn.textContent = 'Sending...';

  fetch(window.__API_SUBMIT || 'api/submit.php', { method: 'POST', body: data })
    .then(function (r) { return r.json(); })
    .then(function (res) {
      if (res && res.success) {
        form.style.display = 'none';
        ok.style.display = 'block';
      } else {
        err.textContent = (res && res.error) ? res.error : 'Something went wrong. Please try again.';
        err.style.display = 'block';
      }
    })
    .catch(function () {
      err.textContent = 'Network error. Please try again.';
      err.style.display = 'block';
    })
    .finally(function () { btn.disabled = false; btn.textContent = 'Submit'; });
  return false;
}
