(function() {
  var BASE_URL = __BASE_URL__;
  function resolveUrl(href) {
    if (!href) return BASE_URL;
    var trimmed = String(href).trim();
    if (!trimmed || trimmed === '#' || /^javascript:/i.test(trimmed)) return null;
    try {
      return new URL(trimmed, BASE_URL).toString();
    } catch (e) {
      return trimmed;
    }
  }
  function makePlaceholderSvg(w, h, label, role) {
    if (role === 'icon') {
      var iw = parseInt(w, 10) || 32;
      var ih = parseInt(h, 10) || 32;
      var iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + iw + '" height="' + ih + '" viewBox="0 0 32 32">' +
        '<rect x="6" y="6" width="20" height="20" rx="5" fill="#cbd5e1"/></svg>';
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(iconSvg);
    }
    var width = parseInt(w, 10) || (role === 'ad' ? 468 : 320);
    var height = parseInt(h, 10) || (role === 'ad' ? 60 : 200);
    var safeLabel = String(label || (role === 'ad' ? 'Advertisement' : 'Image')).replace(/[<>&"']/g, ' ').substring(0, 65);
    var bg = role === 'ad' ? '#fffbe6' : '#e9ecef';
    var border = role === 'ad' ? '#d97706' : '#868e96';
    var tag = role === 'ad' ? '[AD]' : '[IMG]';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
      '<rect width="100%" height="100%" fill="' + bg + '" stroke="' + border + '" stroke-width="2"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Tahoma, Verdana, monospace" font-size="11" fill="#333333">' +
      tag + ' ' + safeLabel + '</text></svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }
  var LIGHTBOX_PADDING = 32;

  function viewportDimensions() {
    var docEl = document.documentElement || {};
    return {
      width: docEl.clientWidth || window.innerWidth || 0,
      height: docEl.clientHeight || window.innerHeight || 0
    };
  }

  function naturalPixelSize(img) {
    var w = img.naturalWidth || parseInt(img.getAttribute('width'), 10) || 0;
    var h = img.naturalHeight || parseInt(img.getAttribute('height'), 10) || 0;
    return {
      width: w > 0 ? w : 320,
      height: h > 0 ? h : 200
    };
  }

  /*
   * Image-model (raster) art opens at its natural size, capped to the viewport
   * minus padding. Vector/pixel SVG art is resolution independent, so it is
   * scaled until its longest edge spans half the smaller viewport dimension.
   */
  function fullSizeBox(img) {
    var natural = naturalPixelSize(img);
    var vp = viewportDimensions();
    var vw = vp.width || 640;
    var vh = vp.height || 480;
    var src = String(img.getAttribute('src') || '');
    if (/^data:image\/svg\+xml/i.test(src)) {
      var maxSide = Math.min(vw, vh) / 2;
      var svgScale = maxSide / Math.max(natural.width, natural.height);
      return {
        width: Math.max(1, Math.round(natural.width * svgScale)),
        height: Math.max(1, Math.round(natural.height * svgScale))
      };
    }
    var maxW = Math.max(1, vw - LIGHTBOX_PADDING * 2);
    var maxH = Math.max(1, vh - LIGHTBOX_PADDING * 2);
    var fit = Math.min(1, maxW / natural.width, maxH / natural.height);
    return {
      width: Math.max(1, Math.round(natural.width * fit)),
      height: Math.max(1, Math.round(natural.height * fit))
    };
  }

  function closeDreamLightbox() {
    var open = document.querySelector('.dream-lightbox');
    if (open && open.parentNode) open.parentNode.removeChild(open);
  }

  function openDreamLightbox(img) {
    if (!img) return;
    if (img.getAttribute('data-dream-loaded') !== 'true') return;
    var src = img.getAttribute('src') || '';
    if (!src) return;
    closeDreamLightbox();
    var box = fullSizeBox(img);
    var overlay = document.createElement('div');
    overlay.className = 'dream-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', img.alt || 'Image preview');
    var full = document.createElement('img');
    full.className = 'dream-lightbox-img';
    full.setAttribute('alt', img.alt || '');
    full.setAttribute('src', src);
    full.style.width = box.width + 'px';
    full.style.height = box.height + 'px';
    if (img.style && img.style.imageRendering) {
      full.style.imageRendering = img.style.imageRendering;
    }
    var close = document.createElement('button');
    close.setAttribute('type', 'button');
    close.className = 'dream-lightbox-close';
    close.setAttribute('aria-label', 'Close full size view');
    close.textContent = '×';
    overlay.appendChild(full);
    overlay.appendChild(close);
    overlay.addEventListener('click', function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (ev.target === overlay || ev.target === close) closeDreamLightbox();
    });
    var host = document.body || document.documentElement;
    if (host) host.appendChild(overlay);
  }

  var dispatchedSlotIds = {};

  function setupImages() {
    function normalizeAspect(raw, width, height) {
      var allowed = ['1:1', '3:2', '2:3', '4:3', '3:4', '16:9', '9:16', '21:9'];
      var vals = { '21:9': 2.333, '16:9': 1.778, '3:2': 1.5, '4:3': 1.333, '1:1': 1.0, '3:4': 0.75, '2:3': 0.667, '9:16': 0.5625 };
      var cl = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
      for (var k = 0; k < allowed.length; k++) {
        if (cl === allowed[k].toLowerCase()) return allowed[k];
      }
      var r = null;
      if (cl) {
        var m = cl.match(/^([0-9]+(?:\.[0-9]+)?)\s*[:\/xX]\s*([0-9]+(?:\.[0-9]+)?)$/);
        if (m && parseFloat(m[1]) > 0 && parseFloat(m[2]) > 0) r = parseFloat(m[1]) / parseFloat(m[2]);
      }
      if (r === null && width && height && width > 0 && height > 0) r = width / height;
      if (r === null || isNaN(r) || r <= 0) return (width > height * 1.5 ? '16:9' : (height > width * 1.3 ? '3:4' : '1:1'));
      var best = allowed[0], minD = Infinity;
      for (var j = 0; j < allowed.length; j++) {
        var d = Math.abs(r - vals[allowed[j]]);
        if (d < minD) { minD = d; best = allowed[j]; }
      }
      return best;
    }
    var slots = [];
    var imgs = document.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var prompt = img.getAttribute('data-dream-prompt');
      var reuse = img.getAttribute('data-dream-reuse');
      if (!prompt && !reuse) {
        img.addEventListener('error', (function(el) {
          return function() {
            if (!el.getAttribute('data-fallback-applied')) {
              el.setAttribute('data-fallback-applied', '1');
              el.src = makePlaceholderSvg(el.width || 240, el.height || 140, el.alt || 'Graphic', 'photo');
            }
          };
        })(img));
        continue;
      }
      var slotId = img.getAttribute('data-dream-id') || ('dream-img-' + i);
      img.setAttribute('data-dream-id', slotId);
      var role = (img.getAttribute('data-dream-role') || (reuse && /^\[AD\b/i.test(reuse.trim()) ? 'ad' : (reuse && /^\[ICON\b/i.test(reuse.trim()) ? 'icon' : (reuse && /^\[GRAPHIC\b/i.test(reuse.trim()) ? 'graphic' : 'photo')))).toLowerCase();
      var w = parseInt(img.getAttribute('width'), 10) || img.width || (role === 'ad' ? 468 : (role === 'icon' ? 32 : 360));
      var h = parseInt(img.getAttribute('height'), 10) || img.height || (role === 'ad' ? 60 : (role === 'icon' ? 32 : 240));
      if (!img.getAttribute('width') && w > 0) {
        img.setAttribute('width', String(w));
      }
      if (!img.getAttribute('height') && h > 0) {
        img.setAttribute('height', String(h));
      }
      var rawAspect = img.getAttribute('data-dream-aspect');
      var aspect = normalizeAspect(rawAspect, w, h);
      var alreadyLoaded = img.getAttribute('data-dream-loaded') === 'true' && !!img.src;
      if (!alreadyLoaded) {
        img.src = makePlaceholderSvg(w, h, img.alt || prompt || reuse, role);
      }
      if (!img.parentElement || !img.parentElement.classList.contains('dream-img-wrapper')) {
        var wrap = document.createElement('span');
        wrap.className = 'dream-img-wrapper';
        img.parentNode.insertBefore(wrap, img);
        wrap.appendChild(img);
        var badge = document.createElement('button');
        badge.type = 'button';
        badge.className = 'dream-img-badge';
        badge.setAttribute('data-badge-for', slotId);
        badge.textContent = alreadyLoaded ? '↻ Redream' : '🎨 Dream ' + (role === 'ad' ? 'Ad' : (role === 'icon' ? 'Icon' : (role === 'graphic' ? 'Graphic' : 'Photo')));
        badge.title = prompt || reuse || '';
        badge.addEventListener('click', (function(sId, p, re, r, a, sw, sh) {
          return function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            window.parent.postMessage({
              type: 'DREAM_GENERATE_SINGLE_IMAGE',
              url: BASE_URL,
              slotId: sId,
              prompt: p,
              reuse: re,
              role: r,
              aspectRatio: a,
              width: sw,
              height: sh
            }, '*');
          };
        })(slotId, prompt, reuse, role, aspect, w, h));
        wrap.appendChild(badge);
        var expand = document.createElement('button');
        expand.type = 'button';
        expand.className = 'dream-img-expand';
        expand.setAttribute('aria-label', 'View full size');
        expand.title = 'View full size';
        expand.textContent = '⤢';
        expand.addEventListener('click', (function(el) {
          return function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            openDreamLightbox(el);
          };
        })(img));
        wrap.appendChild(expand);
        if (alreadyLoaded) wrap.classList.add('is-dream-loaded');
      }
      if (!dispatchedSlotIds[slotId]) {
        dispatchedSlotIds[slotId] = true;
        slots.push({
          slotId: slotId,
          prompt: prompt || reuse,
          reuse: reuse || '',
          role: role,
          width: w,
          height: h,
          aspectRatio: aspect,
          alt: img.alt || '',
          alreadyLoaded: alreadyLoaded
        });
      }
    }
    if (slots.length > 0) {
      window.parent.postMessage({ type: 'DREAM_IMAGES_DISCOVERED', url: BASE_URL, slots: slots }, '*');
    }
  }
  window.addEventListener('message', function(ev) {
    var msg = ev.data;
    if (!msg || typeof msg !== 'object') return;
    if (msg.type === 'DREAM_IMAGE_STATUS') {
      var b = document.querySelector('[data-badge-for="' + msg.slotId + '"]');
      if (b) b.textContent = msg.statusText;
    } else if (msg.type === 'DREAM_IMAGE_READY') {
      var target = document.querySelector('img[data-dream-id="' + msg.slotId + '"]');
      if (target && msg.dataUrl) {
        target.classList.remove('dream-scanline-reveal');
        if (msg.isPixelArt || String(msg.dataUrl).indexOf('crispEdges') !== -1) {
          target.style.imageRendering = 'pixelated';
        } else {
          target.style.imageRendering = '';
        }
        target.src = msg.dataUrl;
        target.setAttribute('data-dream-loaded', 'true');
        var readyWrapper = target.closest ? target.closest('.dream-img-wrapper') : null;
        if (readyWrapper && readyWrapper.classList) readyWrapper.classList.add('is-dream-loaded');
        void target.offsetWidth;
        target.classList.add('dream-scanline-reveal');
      }
      var badge = document.querySelector('[data-badge-for="' + msg.slotId + '"]');
      if (badge) badge.textContent = '↻ Redream';
    }
  });
  document.addEventListener('mouseover', function(ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (a) {
      var resolved = resolveUrl(a.getAttribute('href'));
      if (resolved) window.parent.postMessage({ type: 'DREAM_HOVER', url: resolved }, '*');
    }
  });
  document.addEventListener('mouseout', function(ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (a) window.parent.postMessage({ type: 'DREAM_HOVER', url: '' }, '*');
  });
  document.addEventListener('click', function(ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var rawHref = a.getAttribute('href');
    var resolved = resolveUrl(rawHref);
    if (!resolved) return;
    ev.preventDefault();
    var linkText = (a.innerText || a.textContent || '').replace(/\s+/g, ' ').trim();
    var childImg = a.querySelector('img');
    if (!linkText && childImg) {
      linkText = childImg.alt || childImg.getAttribute('data-dream-prompt') || 'Banner Advertisement';
    }
    var parentBlock = a.closest('td, article, section, li, div, p') || a.parentElement;
    var linkContext = parentBlock ? (parentBlock.innerText || '').replace(/\s+/g, ' ').trim().substring(0, 260) : '';
    window.parent.postMessage({
      type: 'DREAM_NAVIGATE',
      url: resolved,
      referrerUrl: BASE_URL,
      linkText: linkText.substring(0, 160),
      linkContext: linkContext
    }, '*');
  });
  document.addEventListener('submit', function(ev) {
    var form = ev.target;
    if (!form || form.tagName !== 'FORM') return;
    ev.preventDefault();
    var action = form.getAttribute('action') || BASE_URL;
    var resolved = resolveUrl(action) || BASE_URL;
    var formDataObj = {};
    var elements = form.elements || [];
    var qs = [];
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (!el.name) continue;
      if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) continue;
      formDataObj[el.name] = el.value;
      qs.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value));
    }
    if (qs.length > 0 && resolved.indexOf('?') === -1) {
      resolved += '?' + qs.join('&');
    }
    window.parent.postMessage({
      type: 'DREAM_NAVIGATE',
      url: resolved,
      referrerUrl: BASE_URL,
      linkText: 'Form submission',
      formData: formDataObj
    }, '*');
  });
  document.addEventListener('keydown', function(ev) {
    if (!ev) return;
    if (ev.key === 'Escape' || ev.key === 'Esc' || ev.keyCode === 27) closeDreamLightbox();
  });
  window.__setupDreamImages = setupImages;

  if (typeof MutationObserver !== 'undefined') {
    try {
      var observer = new MutationObserver(function() {
        setupImages();
      });
      observer.observe(document.documentElement || document, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImages);
  } else {
    setupImages();
  }
})();
