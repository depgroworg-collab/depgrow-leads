/**
 * Depgrow Smart Lead Form — embed/form.js
 *
 * Usage:
 *   <script src="https://leads.depgrow.in/embed/form.js" data-form="CUSTOMER_ID" async></script>
 *
 * Optional attributes:
 *   data-type="floating"  (default) | "inline"
 *   data-target="#my-div"           (for inline mode, renders inside element)
 */
;(function () {
  'use strict'
  if (window.__depgrowFormLoaded) return
  window.__depgrowFormLoaded = true

  var script     = document.currentScript || (function () { var s = document.querySelectorAll('script[data-form]'); return s[s.length - 1] })()
  var customerId = script && script.getAttribute('data-form')
  var embedType  = script && (script.getAttribute('data-type') || 'floating')
  var targetSel  = script && script.getAttribute('data-target')
  var BASE_URL   = script ? script.src.replace('/embed/form.js', '') : ''

  if (!customerId) return console.warn('[Depgrow] Missing data-form attribute.')

  // ── Fetch form config ──────────────────────────────────────────────────
  fetch(BASE_URL + '/api/form/' + customerId)
    .then(function (r) { return r.json() })
    .then(function (res) {
      if (!res.data) return
      boot(res.data)
    })
    .catch(function (e) { console.warn('[Depgrow] Failed to load form config:', e) })

  // ── Main boot ──────────────────────────────────────────────────────────
  function boot(cfg) {
    var pc   = cfg.primary_color || '#7C3AED'
    var bg   = cfg.bg_color      || '#ffffff'
    var tc   = cfg.text_color    || '#111827'
    var type = cfg.embed_type    || embedType

    if (type === 'inline') {
      var target = targetSel ? document.querySelector(targetSel) : null
      var host   = document.createElement('div')
      if (target) { target.appendChild(host) }
      else {
        host.style.cssText = 'margin:20px auto;max-width:480px;'
        document.body.appendChild(host)
      }
      renderForm(host, cfg, pc, bg, tc, false)
    } else {
      renderFloating(cfg, pc, bg, tc)
    }
  }

  // ── Floating trigger button ────────────────────────────────────────────
  function renderFloating(cfg, pc, bg, tc) {
    var host = document.createElement('div')
    host.id  = 'depgrow-form-host'
    host.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:12px;'
    document.body.appendChild(host)

    // Tooltip
    var tooltip = document.createElement('div')
    tooltip.textContent = cfg.title || 'Get a Free Quote'
    tooltip.style.cssText = [
      'background:#1f2937;color:#f9fafb;border-radius:10px;padding:8px 14px;',
      'font-size:13px;font-weight:600;white-space:nowrap;cursor:pointer;',
      'box-shadow:0 4px 20px rgba(0,0,0,0.3);opacity:0;transform:translateY(6px);',
      'transition:opacity 0.3s,transform 0.3s;font-family:-apple-system,sans-serif;',
    ].join('')
    tooltip.addEventListener('click', openModal)
    host.appendChild(tooltip)

    // Button
    var btn = document.createElement('button')
    btn.style.cssText = [
      'width:56px;height:56px;border-radius:50%;background:' + pc + ';border:none;',
      'cursor:pointer;display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 4px 20px rgba(0,0,0,0.25);transition:transform 0.2s,box-shadow 0.2s;',
    ].join('')
    btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-2 8H7v-2h4v2zm4-4H7v-2h8v2z"/></svg>'
    btn.addEventListener('mouseenter', function () { this.style.transform = 'scale(1.1)'; this.style.boxShadow = '0 6px 28px rgba(0,0,0,0.35)' })
    btn.addEventListener('mouseleave', function () { this.style.transform = 'scale(1)';   this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)' })
    btn.addEventListener('click', openModal)
    host.appendChild(btn)

    // Show tooltip after 3s
    setTimeout(function () {
      tooltip.style.opacity = '1'; tooltip.style.transform = 'translateY(0)'
      setTimeout(function () { tooltip.style.opacity = '0' }, 5000)
    }, 3000)

    // Modal overlay
    var overlay = document.createElement('div')
    overlay.id  = 'depgrow-overlay'
    overlay.style.cssText = [
      'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9998;',
      'display:none;align-items:center;justify-content:center;padding:1rem;',
      'backdrop-filter:blur(4px);',
    ].join('')
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal() })
    document.body.appendChild(overlay)

    var modal = document.createElement('div')
    modal.style.cssText = [
      'background:' + bg + ';border-radius:20px;width:100%;max-width:460px;',
      'max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,0.5);',
      'position:relative;',
    ].join('')
    overlay.appendChild(modal)

    function openModal() {
      overlay.style.display = 'flex'
      setTimeout(function () { overlay.style.opacity = '1' }, 10)
      if (!modal.innerHTML) renderForm(modal, cfg, pc, bg, tc, true)
    }
    function closeModal() {
      overlay.style.display = 'none'
    }
  }

  // ── Form renderer ──────────────────────────────────────────────────────
  function renderForm(container, cfg, pc, bg, tc, isModal) {
    var state = { step: 0, submitting: false, done: false }
    var data  = {}

    var steps = [
      { id: 'contact',  title: 'Tell us about you',        fields: contactFields() },
      { id: 'service',  title: 'What do you need?',        fields: serviceFields(cfg.services || []) },
      { id: 'budget',   title: 'Budget & urgency',         fields: budgetFields() },
      { id: 'message',  title: 'Anything else? (optional)', fields: messageField() },
    ]

    render()

    function render() {
      container.innerHTML = ''
      if (state.done) { renderThankYou(); return }

      var wrap = el('div', { style: 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:' + tc + ';' })

      // Header
      var header = el('div', { style: 'padding:24px 24px 0;' })

      // Close button (modal only)
      if (isModal) {
        var closeBtn = el('button', { style: 'position:absolute;top:16px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:' + tc + ';opacity:0.5;line-height:1;padding:4px;' })
        closeBtn.textContent = '×'
        closeBtn.addEventListener('click', function () { var ov = document.getElementById('depgrow-overlay'); if (ov) ov.style.display = 'none' })
        container.style.position = 'relative'
        container.appendChild(closeBtn)
      }

      // Progress bar
      var progress = el('div', { style: 'height:3px;background:rgba(0,0,0,0.08);border-radius:2px;margin-bottom:20px;' })
      var fill     = el('div', { style: 'height:3px;background:' + pc + ';border-radius:2px;transition:width 0.4s;width:' + Math.round(((state.step + 1) / steps.length) * 100) + '%;' })
      progress.appendChild(fill)
      header.appendChild(progress)

      // Logo
      if (cfg.logo_url) {
        var logo = el('img', { src: cfg.logo_url, style: 'height:36px;object-fit:contain;margin-bottom:14px;display:block;' })
        header.appendChild(logo)
      }

      // Title / subtitle (step 0 only)
      if (state.step === 0) {
        var h1 = el('h2', { style: 'font-size:22px;font-weight:800;margin:0 0 6px;color:' + tc + ';' })
        h1.textContent = cfg.title || 'Get a Free Quote'
        var sub = el('p', { style: 'font-size:14px;opacity:0.6;margin:0 0 20px;line-height:1.5;' })
        sub.textContent = cfg.subtitle || ''
        header.appendChild(h1); header.appendChild(sub)
      } else {
        var stepTitle = el('h3', { style: 'font-size:18px;font-weight:700;margin:0 0 18px;color:' + tc + ';' })
        stepTitle.textContent = steps[state.step].title
        header.appendChild(stepTitle)
      }

      wrap.appendChild(header)

      // Step fields
      var body = el('div', { style: 'padding:0 24px;' })
      var step = steps[state.step]
      step.fields.forEach(function (f) { body.appendChild(buildField(f)) })
      wrap.appendChild(body)

      // Step indicator
      var stepIndicator = el('div', { style: 'text-align:center;font-size:12px;opacity:0.4;padding:8px 0 0;' })
      stepIndicator.textContent = 'Step ' + (state.step + 1) + ' of ' + steps.length
      wrap.appendChild(stepIndicator)

      // Buttons
      var footer = el('div', { style: 'padding:16px 24px 24px;display:flex;gap:10px;' })
      if (state.step > 0) {
        var backBtn = el('button', { style: 'flex:1;padding:11px;border-radius:10px;border:1px solid rgba(0,0,0,0.15);background:transparent;color:' + tc + ';font-size:14px;font-weight:600;cursor:pointer;' })
        backBtn.textContent = '← Back'
        backBtn.addEventListener('click', function () { state.step--; render() })
        footer.appendChild(backBtn)
      }
      var nextBtn = el('button', {
        style: 'flex:2;padding:12px;border-radius:10px;background:' + pc + ';color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;transition:opacity 0.15s;',
        disabled: state.submitting,
      })
      nextBtn.textContent = state.submitting ? 'Submitting…' : (state.step === steps.length - 1 ? (cfg.button_text || 'Submit →') : 'Next →')
      nextBtn.addEventListener('click', handleNext)
      footer.appendChild(nextBtn)
      wrap.appendChild(footer)

      // Branding
      var brand = el('div', { style: 'text-align:center;font-size:11px;opacity:0.3;padding-bottom:16px;' })
      brand.textContent = 'Powered by Depgrow'
      wrap.appendChild(brand)

      container.appendChild(wrap)
    }

    function buildField(f) {
      var wrap = el('div', { style: 'margin-bottom:14px;' })
      if (f.label) {
        var lbl = el('label', { style: 'display:block;font-size:12px;font-weight:600;opacity:0.55;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px;' })
        lbl.textContent = f.label
        wrap.appendChild(lbl)
      }
      var input
      if (f.type === 'select') {
        input = el('select', { name: f.name, style: inputStyle() })
        var placeholder = el('option', { value: '', disabled: true, selected: !data[f.name] })
        placeholder.textContent = f.placeholder || 'Select…'
        input.appendChild(placeholder)
        f.options.forEach(function (o) {
          var opt = el('option', { value: o.value })
          opt.textContent = o.label
          if (data[f.name] === o.value) opt.selected = true
          input.appendChild(opt)
        })
      } else if (f.type === 'textarea') {
        input = el('textarea', { name: f.name, placeholder: f.placeholder || '', rows: 3, style: inputStyle() + 'resize:vertical;' })
        input.value = data[f.name] || ''
      } else {
        input = el('input', { type: f.type || 'text', name: f.name, placeholder: f.placeholder || '', style: inputStyle() })
        input.value = data[f.name] || ''
      }
      input.addEventListener('change', function () { data[f.name] = this.value })
      input.addEventListener('input',  function () { data[f.name] = this.value })
      wrap.appendChild(input)
      return wrap
    }

    function inputStyle() {
      return [
        'width:100%;padding:10px 12px;border-radius:8px;',
        'border:1px solid rgba(0,0,0,0.15);',
        'background:' + (bg === '#ffffff' ? '#f9fafb' : 'rgba(0,0,0,0.04)') + ';',
        'color:' + tc + ';font-size:14px;font-family:inherit;outline:none;',
        'box-sizing:border-box;',
      ].join('')
    }

    function handleNext() {
      var step = steps[state.step]
      // Validate required fields
      for (var i = 0; i < step.fields.length; i++) {
        var f = step.fields[i]
        if (f.required && !data[f.name]) {
          alert(f.label + ' is required.')
          return
        }
      }
      if (state.step < steps.length - 1) {
        state.step++; render()
      } else {
        submitForm()
      }
    }

    function submitForm() {
      state.submitting = true; render()
      fetch(BASE_URL + '/api/submit/' + customerId, {
        method: 'POST', mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     data.name,
          phone:    data.phone,
          email:    data.email,
          service:  data.service,
          budget:   data.budget,
          urgency:  data.urgency,
          message:  data.message || '',
          referrer: window.location.href,
          user_agent: navigator.userAgent,
        }),
        keepalive: true,
      })
      .then(function (r) { return r.json() })
      .then(function () { state.done = true; render() })
      .catch(function () { state.submitting = false; alert('Submission failed. Please try again.'); render() })
    }

    function renderThankYou() {
      container.innerHTML = ''
      var wrap = el('div', { style: 'padding:48px 24px;text-align:center;font-family:-apple-system,sans-serif;color:' + tc + ';' })
      var icon = el('div', { style: 'font-size:56px;margin-bottom:16px;' })
      icon.textContent = '🎉'
      var title = el('h2', { style: 'font-size:22px;font-weight:800;margin:0 0 8px;color:' + tc + ';' })
      title.textContent = cfg.thank_you_title || 'Thank you!'
      var msg = el('p', { style: 'font-size:15px;opacity:0.65;margin:0;line-height:1.6;' })
      msg.textContent = cfg.thank_you_message || "We've received your details and will be in touch soon."
      wrap.appendChild(icon); wrap.appendChild(title); wrap.appendChild(msg)
      var brand = el('div', { style: 'font-size:11px;opacity:0.25;margin-top:24px;' })
      brand.textContent = 'Powered by Depgrow'
      wrap.appendChild(brand)
      container.appendChild(wrap)
    }
  }

  // ── Field definitions ──────────────────────────────────────────────────
  function contactFields() {
    return [
      { name: 'name',  label: 'Full name',     placeholder: 'Your name',         required: true },
      { name: 'phone', label: 'Phone number',  placeholder: '+91 98765 43210',    required: true, type: 'tel' },
      { name: 'email', label: 'Email address', placeholder: 'you@company.com',   required: true, type: 'email' },
    ]
  }

  function serviceFields(services) {
    return [{
      name: 'service', label: 'Service needed', type: 'select', required: true,
      options: services.map(function (s) { return { value: s, label: s } }),
    }]
  }

  function budgetFields() {
    return [
      {
        name: 'budget', label: 'Budget range', type: 'select', required: true,
        options: [
          { value: 'under_10k', label: 'Under ₹10,000' },
          { value: '10k_20k',   label: '₹10,000 – ₹20,000' },
          { value: '20k_50k',   label: '₹20,000 – ₹50,000' },
          { value: '50k_1L',    label: '₹50,000 – ₹1,00,000' },
          { value: 'above_1L',  label: 'Above ₹1,00,000' },
        ],
      },
      {
        name: 'urgency', label: 'Timeline', type: 'select', required: true,
        options: [
          { value: 'this_week',      label: '🔥 This week — urgent' },
          { value: 'this_month',     label: '📅 This month' },
          { value: 'next_3_months',  label: '🗓 Next 3 months' },
          { value: 'just_exploring', label: '👀 Just exploring' },
        ],
      },
    ]
  }

  function messageField() {
    return [{ name: 'message', label: 'Additional notes (optional)', type: 'textarea', placeholder: 'Tell us anything else that would help…' }]
  }

  // ── createElement helper ───────────────────────────────────────────────
  function el(tag, attrs) {
    var e = document.createElement(tag)
    attrs = attrs || {}
    Object.keys(attrs).forEach(function (k) {
      if (k === 'style') { e.style.cssText = attrs[k] }
      else if (attrs[k] === true) { e.setAttribute(k, '') }
      else if (attrs[k] !== false && attrs[k] !== null && attrs[k] !== undefined) { e.setAttribute(k, attrs[k]) }
    })
    return e
  }
})()
