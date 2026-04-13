(function () {

  if (document.getElementById("gs-plus-widget")) return;

  const style = document.createElement("style");
  style.innerHTML = `
    #gs-plus-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      cursor: grab;
      user-select: none;
      touch-action: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #gs-plus-widget:active { cursor: grabbing; }
    #gs-drag-tip {
      background: #1a1a2e;
      color: white;
      font-size: 10px;
      padding: 3px 10px;
      border-radius: 10px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
      align-self: center;
    }
    #gs-plus-widget:hover #gs-drag-tip { opacity: 1; }
    #gs-widget-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #1a73e8;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 26px;
      box-shadow: 0 4px 16px rgba(26,115,232,0.5);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      outline: none;
    }
    #gs-widget-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(26,115,232,0.6);
    }
    #gs-widget-panel {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 380px;
      height: 560px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      z-index: 2147483646;
      background: white;
      animation: gs-slide-up 0.25s ease;
    }
    #gs-widget-panel.open { display: flex; }
    @keyframes gs-slide-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    #gs-panel-header {
      background: #1a1a2e;
      color: white;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    #gs-panel-header-title {
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #gs-panel-header-sub {
      font-size: 11px;
      opacity: 0.6;
      margin-top: 2px;
    }
    #gs-panel-close {
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    #gs-panel-close:hover { background: rgba(255,255,255,0.2); }
    #gs-panel-body {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 12px;
      padding: 24px;
      text-align: center;
      color: #444;
    }
    #gs-panel-body h3 {
      font-size: 16px;
      color: #1a1a2e;
      font-weight: 600;
      margin: 0;
    }
    #gs-panel-body p {
      font-size: 13px;
      color: #888;
      line-height: 1.5;
      margin: 0;
      max-width: 280px;
    }
    .gs-chat-emoji { font-size: 48px; }
    #gs-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4caf50;
      display: inline-block;
      animation: gs-blink 1.5s infinite;
      flex-shrink: 0;
    }
    @keyframes gs-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    #gs-online-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #e8f5e9;
      color: #2e7d32;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 500;
    }
    #gs-panel-footer {
      padding: 10px;
      text-align: center;
      font-size: 10px;
      color: #bbb;
      border-top: 1px solid #f0f0f0;
      flex-shrink: 0;
    }
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "gs-plus-widget";
  widget.innerHTML = `
    <div id="gs-drag-tip">⠿ Drag to move</div>
    <button id="gs-widget-btn" title="GS+ Support">💬</button>
  `;
  document.body.appendChild(widget);

  const panel = document.createElement("div");
  panel.id = "gs-widget-panel";
  panel.innerHTML = `
    <div id="gs-panel-header">
      <div>
        <div id="gs-panel-header-title">
          <span>💬</span> GS+ Support Chat
        </div>
        <div id="gs-panel-header-sub">
          We typically reply within minutes
        </div>
      </div>
      <button id="gs-panel-close">✕</button>
    </div>
    <div id="gs-panel-body">
      <div class="gs-chat-emoji">👋</div>
      <div id="gs-online-badge">
        <span id="gs-status-dot"></span>
        Support team is online
      </div>
      <h3>How can we help?</h3>
      <p>Click the chat bubble to start a
         conversation with our support team.</p>
    </div>
    <div id="gs-panel-footer">
      Powered by GrowthSuite+
    </div>
  `;
  document.body.appendChild(panel);

  const btn = document.getElementById("gs-widget-btn");
  const closeBtn = document.getElementById("gs-panel-close");

  btn.addEventListener("click", () => {
    if (hasDragged) return;
    panel.classList.toggle("open");
    btn.innerHTML = panel.classList.contains("open") ? "✕" : "💬";
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.remove("open");
    btn.innerHTML = "💬";
  });

  const chatScript = document.createElement("script");
  chatScript.src = "https://widgets.leadconnectorhq.com/loader.js";
  chatScript.setAttribute("data-resources-url",
    "https://widgets.leadconnectorhq.com/chat-widget/loader.js");
  chatScript.setAttribute("data-widget-id", "68e5335fa41a10487480dc97");
  document.body.appendChild(chatScript);

  function clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
  }

  let isDragging = false;
  let hasDragged = false;
  let startX, startY, startLeft, startTop;

  function initPosition() {
    const rect = widget.getBoundingClientRect();
    widget.style.right = "auto";
    widget.style.bottom = "auto";
    widget.style.left = rect.left + "px";
    widget.style.top = rect.top + "px";
  }

  function initDrag(clientX, clientY) {
    isDragging = true;
    hasDragged = false;
    startX = clientX;
    startY = clientY;
    initPosition();
    startLeft = parseFloat(widget.style.left) || 0;
    startTop = parseFloat(widget.style.top) || 0;
    widget.style.cursor = "grabbing";
  }

  function onDragMove(clientX, clientY) {
    if (!isDragging) return;
    const dx = clientX - startX;
    const dy = clientY - startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
    const newLeft = clamp(startLeft + dx, 0,
      window.innerWidth - widget.offsetWidth);
    const newTop = clamp(startTop + dy, 0,
      window.innerHeight - widget.offsetHeight);
    widget.style.left = newLeft + "px";
    widget.style.top = newTop + "px";
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    panel.style.left = newLeft + "px";
    panel.style.top = (newTop - panel.offsetHeight - 10) + "px";
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    widget.style.cursor = "grab";
    savePosition();
    setTimeout(() => { hasDragged = false; }, 100);
  }

  widget.addEventListener("mousedown", e => {
    e.preventDefault();
    initDrag(e.clientX, e.clientY);
  });
  document.addEventListener("mousemove", e => onDragMove(e.clientX, e.clientY));
  document.addEventListener("mouseup", () => onDragEnd());

  widget.addEventListener("touchstart", e => {
    const t = e.touches[0];
    initDrag(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener("touchmove", e => {
    const t = e.touches[0];
    onDragMove(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener("touchend", () => onDragEnd());

  function savePosition() {
    localStorage.setItem("gs_widget_pos", JSON.stringify({
      left: widget.style.left,
      top: widget.style.top
    }));
  }

  function loadPosition() {
    try {
      const saved = JSON.parse(localStorage.getItem("gs_widget_pos"));
      if (saved && saved.left && saved.top) {
        widget.style.right = "auto";
        widget.style.bottom = "auto";
        widget.style.left = saved.left;
        widget.style.top = saved.top;
      }
    } catch (e) {}
  }

  loadPosition();
  console.log("GS+ Widget loaded ✅");

})();
