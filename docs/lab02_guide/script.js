
const defaultConfig = {

  // Colors
  background_color: '#A73B24',
  surface_color: '#ffffff',
  text_color: '#2d3748',
  primary_action_color: '#A73B24',
  // Typography
  font_family: 'Prompt',
  font_size: 16
};

const DOM_SELECTORS = {
  canvas: '#logoCanvas',
  form: '#contactForm',
  successMsg: '#successMessage',
  navLinks: 'nav a',
  siteTitle: '.site-title',
  heroH1: '.hero h1',
  heroP: '.hero p',
  sectionTitles: '.section-title',
  placeH3: '.place-content h3',
  submitBtn: '.submit-btn',
  footerP: '.footer-content p'
};

// Larger logo config (size in pixels). We'll set canvas size from this value.
const LOGO_CONFIG = { size: 120, center: 60, outerRadius: 44, innerRadius: 40, dotRadius: 6 };
// Softer animation: removed rotation (static), gentle scale change kept
const ANIMATION_CONFIG = { scaleStep: 0.0025, minScale: 0.975, maxScale: 1.03 };
const SUCCESS_TIMEOUT = 3000;

// ============================================
// Utility Functions
// ============================================

const updateCSSVariable = (key, value) => {
  document.documentElement.style.setProperty(key, value);
};

const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => document.querySelectorAll(selector);

// ============================================
// Canvas Logo Animation (image-based)
// ============================================

function drawLogo() {
  const canvas = getElement(DOM_SELECTORS.canvas);
  if (!canvas) return;
  // ensure canvas backing size matches our config for crisp drawing
  canvas.width = LOGO_CONFIG.size;
  canvas.height = LOGO_CONFIG.size;
  // also set CSS size so layout reflects the larger canvas
  canvas.style.width = `${LOGO_CONFIG.size}px`;
  canvas.style.height = `${LOGO_CONFIG.size}px`;
  const ctx = canvas.getContext('2d');
  let scale = 1;
  let growing = true;

  // Load external image to use as logo
  const logoImg = new Image();
  logoImg.src = 'https://research.kku.ac.th/wp-content/uploads/2024/11/kkulogo.png';
  // don't set crossOrigin — many servers don't allow CORS and that prevents loading
  // log load errors and let the animation draw the fallback until image is ready
  logoImg.onerror = () => console.warn('Logo image failed to load:', logoImg.src);

  const drawCircle = (radius, style, isStroke = false) => {
    if (isStroke) ctx.strokeStyle = style;
    else ctx.fillStyle = style;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    isStroke ? ctx.stroke() : ctx.fill();
  };

  const animate = () => {
    ctx.clearRect(0, 0, LOGO_CONFIG.size, LOGO_CONFIG.size);
    ctx.save();
    ctx.translate(LOGO_CONFIG.center, LOGO_CONFIG.center);
    ctx.scale(scale, scale);

    // If image loaded, draw it centered and scaled to fit inner radius
    if (logoImg.complete && logoImg.naturalWidth) {
      const targetSize = LOGO_CONFIG.innerRadius * 2; // target square size
      // preserve aspect ratio
      const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
      let drawW = targetSize;
      let drawH = targetSize;
      if (aspect > 1) drawH = targetSize / aspect;
      else drawW = targetSize * aspect;
      ctx.drawImage(logoImg, -drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      // fallback: draw a small filled circle if image not ready
      ctx.fillStyle = '#A73B24';
      ctx.beginPath();
      ctx.arc(0, 0, LOGO_CONFIG.innerRadius - 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // draw outer ring as frame
    ctx.lineWidth = 3;
    drawCircle(LOGO_CONFIG.outerRadius, '#A73B24', true);

    ctx.restore();

    // Update animation state (no rotation)
    if (growing) {
      scale += ANIMATION_CONFIG.scaleStep;
      if (scale >= ANIMATION_CONFIG.maxScale) growing = false;
    } else {
      scale -= ANIMATION_CONFIG.scaleStep;
      if (scale <= ANIMATION_CONFIG.minScale) growing = true;
    }

    requestAnimationFrame(animate);
  };

  // Start animation immediately; when the image finishes loading it will be drawn
  logoImg.onload = () => {
    /* image loaded — animate loop will pick it up automatically */
  };
  animate();
}

// ============================================
// Event Handlers
// ============================================

function initFormHandler() {
  const form = getElement(DOM_SELECTORS.form);
  if (!form) return;

  // If the form has a native action (e.g., posts to Web3Forms), do not intercept — let the browser submit it.
  if (form.getAttribute('action')) return;

  const successMessage = getElement(DOM_SELECTORS.successMsg);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the Web3Forms access key from the form
    const accessKey = form.getAttribute('data-web3forms-key');
    if (!accessKey) {
      console.error('Web3Forms key not found');
      return;
    }

    // Create FormData and add the access key
    const formData = new FormData(form);
    formData.append('access_key', accessKey);

    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn?.textContent;
    if (submitBtn) submitBtn.disabled = true;
    if (submitBtn) submitBtn.textContent = 'กำลังส่ง...';

    // Send to Web3Forms API
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Show success message
          successMessage.classList.add('show');
          form.reset();
          setTimeout(() => successMessage.classList.remove('show'), SUCCESS_TIMEOUT);
        } else {
          console.error('Web3Forms error:', data);
          alert('เกิดข้อผิดพลาดในการส่ง: ' + (data.message || JSON.stringify(data)));
        }
      })
      .catch(err => {
        console.error('Form submission error:', err);
        alert('การส่งล้มเหลว กรุณาลองอีกครั้ง');
      })
      .finally(() => {
        // Restore button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
  });
}

function initSmoothScroll() {
  getElements(DOM_SELECTORS.navLinks).forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = getElement(anchor.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============================================
// Element SDK Configuration
// ============================================

const updateFontVariables = (baseSize) => {
  const FONT_MULTIPLIERS = {
    '--custom-site-title-size': 1.5,
    '--custom-hero-h1-size': 3,
    '--custom-hero-p-size': 1.25,
    '--custom-section-title-size': 2.5,
    '--custom-place-h3-size': 1.5,
    '--custom-btn-size': 1.125
  };

  Object.entries(FONT_MULTIPLIERS).forEach(([key, multiplier]) => {
    updateCSSVariable(key, `${baseSize * multiplier}px`);
  });
  updateCSSVariable('--custom-font-size', `${baseSize}px`);
};

const updateColorVariables = (config) => {
  const colors = {
    '--custom-bg-color': config.background_color || defaultConfig.background_color,
    '--custom-action-color': config.primary_action_color || defaultConfig.primary_action_color,
    '--custom-surface-color': config.surface_color || defaultConfig.surface_color,
    '--custom-text-color': config.text_color || defaultConfig.text_color
  };
  Object.entries(colors).forEach(([key, value]) => updateCSSVariable(key, value));
};

const updateTextContent = (config) => {
  const updates = [
    [DOM_SELECTORS.siteTitle, 'site_title'],
    [DOM_SELECTORS.heroH1, 'hero_title'],
    [DOM_SELECTORS.heroP, 'hero_subtitle'],
    [DOM_SELECTORS.submitBtn, 'submit_button'],
    [DOM_SELECTORS.footerP, 'footer_text']
  ];

  updates.forEach(([selector, key]) => {
    const el = getElement(selector);
    if (el) el.textContent = config[key] || defaultConfig[key];
  });

  const sectionTitles = getElements(DOM_SELECTORS.sectionTitles);
  sectionTitles[0].textContent = config.section1_title || defaultConfig.section1_title;
  sectionTitles[1].textContent = config.form_title || defaultConfig.form_title;

  const placeH3s = getElements(DOM_SELECTORS.placeH3);
  placeH3s[0].textContent = config.place1_name || defaultConfig.place1_name;
  placeH3s[1].textContent = config.place2_name || defaultConfig.place2_name;
  placeH3s[2].textContent = config.place3_name || defaultConfig.place3_name;
};

async function onConfigChange(config) {
  const customFont = config.font_family || defaultConfig.font_family;
  const baseSize = config.font_size || defaultConfig.font_size;
  const baseFontStack = 'Tahoma, Geneva, Verdana, sans-serif';

  updateCSSVariable('--custom-font-family', `${customFont}, ${baseFontStack}`);
  updateFontVariables(baseSize);
  updateColorVariables(config);
  updateTextContent(config);
}

const createColorProperty = (key) => ({
  get: () => defaultConfig[key],
  set: (value) => {
    defaultConfig[key] = value;
    window.elementSdk?.setConfig({ [key]: value });
  }
});

function mapToCapabilities(config) {
  return {
    recolorables: [
      createColorProperty('background_color'),
      createColorProperty('surface_color'),
      createColorProperty('text_color'),
      createColorProperty('primary_action_color')
    ],
    borderables: [],
    fontEditable: {
      get: () => defaultConfig.font_family,
      set: (value) => {
        defaultConfig.font_family = value;
        window.elementSdk?.setConfig({ font_family: value });
      }
    },
    fontSizeable: {
      get: () => defaultConfig.font_size,
      set: (value) => {
        defaultConfig.font_size = value;
        window.elementSdk?.setConfig({ font_size: value });
      }
    }
  };
}

function mapToEditPanelValues(config) {
  const contentKeys = [
    'site_title', 'hero_title', 'hero_subtitle', 'section1_title',
    'place1_name', 'place2_name', 'place3_name', 'form_title',
    'submit_button', 'footer_text'
  ];
  return new Map(contentKeys.map(key => [key, config[key] || defaultConfig[key]]));
}

// ============================================
// Initialization
// ============================================

function init() {
  // Initialize event handlers
  initFormHandler();
  initSmoothScroll();

  // Ensure page content is offset below the fixed header
  const adjustBodyOffset = () => {
    const headerEl = document.querySelector('header');
    if (!headerEl) return;
    const h = headerEl.getBoundingClientRect().height;
    document.body.style.paddingTop = `${h}px`;
  };
  // adjust now and on resize
  adjustBodyOffset();
  window.addEventListener('resize', adjustBodyOffset);

  // Start logo animation
  drawLogo();

  // Initialize Element SDK if available
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange,
      mapToCapabilities,
      mapToEditPanelValues
    });
  }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
