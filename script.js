/* ============================================================
   dzinhoOS 98 — gerenciador de janelas + i18n
   ============================================================ */
(() => {
  "use strict";

  /* ---------------- i18n ---------------- */
  const I18N = {
    en: {
      "boot.skip": "click or press any key to skip",
      "icon.about": "About me",
      "icon.projects": "Projects",
      "icon.skills": "Stack.exe",
      "icon.contact": "Contact",
      "icon.cv": "Resume.pdf",
      "win.welcome": "Welcome",
      "win.about": "About me",
      "win.projects": "Projects",
      "win.contact": "Contact",
      "welcome.hi": "Hi, I'm <strong>Davi</strong>.",
      "welcome.text": "Full-stack software engineer. This is my desktop: open the folders to see my projects, my stack and how to reach me.",
      "welcome.cta": "See projects",
      "welcome.about": "About me",
      "menu.file": "File", "menu.edit": "Edit", "menu.help": "Help", "menu.view": "View",
      "about.role": "Software Engineer · Full-stack",
      "about.p1": "Student at Universidade Veiga de Almeida, building systems end to end: from database modeling to the front end users actually see.",
      "about.p2": "I like taking a real problem, organizing the requirements and turning it into software that works. When I'm not coding, I'm gaming, listening to music or watching anime and movies.",
      "about.quick": "Quick info",
      "about.k.study": "Education",
      "about.k.focus": "Focus",
      "about.v.focus": "Full-stack, back end and databases",
      "about.k.langs": "Languages",
      "about.k.ide": "Tools",
      "about.k.hobbies": "Off the clock",
      "about.v.hobbies": "Games · Music · Anime · Movies",
      "status.ready": "Ready",
      "status.objects": "2 object(s)",
      "badge.wip": "In development",
      "badge.ongoing": "Ongoing",
      "p1.sub": "Event scheduling and digital attendance list",
      "p1.desc": "Web system for Charitas, the José de Dome House of Culture, a museum in Cabo Frio, Brazil. Visitors book tours and events with limited seats, check in through a digital form, and staff follow everything on a dashboard with monthly statistics (e.g. which month had the most visits).",
      "p1.b1": "Full database modeling (brModelo → PostgreSQL)",
      "p1.b2": "Database hosted on Supabase with versioned migrations",
      "p1.b3": "Booking with seat limits and a public events page",
      "p1.b4": "Acted as Product Owner / Requirements Analyst, running sprints on Trello",
      "p2.title": "Fabric Minecraft Server",
      "p2.sub": "Cloud infrastructure for a 24/7 modded server",
      "p2.desc": "Planning and deployment of a Minecraft Fabric 26.3 server with about 220 mods. I compared providers (Google Cloud and Oracle Cloud Always Free), sized the machine for the mod load and set up remote administration.",
      "p2.b1": "Linux VM on Google Cloud (4 vCPU / 12 GB RAM) sized for ~220 mods",
      "p2.b2": "Cost and capacity evaluation across cloud providers",
      "p2.b3": "Remote administration and updates over SSH (Termius)",
      "projects.more": "See more on GitHub →",
      "term.langs": "[ LANGUAGES ]",
      "term.data": "[ DATA & INFRA ]",
      "term.tools": "[ TOOLS ]",
      "contact.text": "Open to internships, freelance work and projects. Drop me a message!",
      "contact.copy": "Copy",
      "contact.copied": "E-mail copied!",
      "contact.cv": "Resume",
      "contact.cvdl": "Download PDF",
      "contact.send": "Send e-mail",
      "start": "Start",
      "start.reboot": "Restart...",
    },
    pt: {}, // preenchido a partir do HTML original
  };

  const nodes = [...document.querySelectorAll("[data-i18n]")];
  nodes.forEach((el) => { I18N.pt[el.dataset.i18n] = el.innerHTML; });
  I18N.pt["contact.copied"] = "E-mail copiado!";

  const BOOT = {
    pt: ["dzinhoBIOS v4.20  (C) 2005 Davi", "", "Verificando memória ...... 640K OK", "Detectando IDE ........... VS Code, IntelliJ", "Carregando Java.sys ...... [OK]", "Carregando Python.dll .... [OK]", "Carregando C.drv ......... [OK]", "Conectando ao PostgreSQL . [OK]", "", "Iniciando dzinhoOS 98 ...", "", "> TAKE YOUR HEART"],
    en: ["dzinhoBIOS v4.20  (C) 2005 Davi", "", "Memory check ............. 640K OK", "Detecting IDE ............ VS Code, IntelliJ", "Loading Java.sys ......... [OK]", "Loading Python.dll ....... [OK]", "Loading C.drv ............ [OK]", "Connecting to PostgreSQL . [OK]", "", "Starting dzinhoOS 98 ...", "", "> TAKE YOUR HEART"],
  };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  let lang = store.get("lang") || (navigator.language || "pt").slice(0, 2);
  if (!I18N[lang]) lang = "en";

  const langBtn = document.getElementById("lang-btn");
  function applyLang(l) {
    lang = l;
    nodes.forEach((el) => {
      const v = I18N[l][el.dataset.i18n];
      if (v != null) el.innerHTML = v;
    });
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
    langBtn.textContent = l.toUpperCase();
    store.set("lang", l);
    refreshTasks();
    tick();
  }
  langBtn.addEventListener("click", () => applyLang(lang === "pt" ? "en" : "pt"));

  /* ---------------- boot ---------------- */
  const boot = document.getElementById("boot");
  const bootLog = document.getElementById("boot-log");
  let bootTimer;
  function endBoot() {
    clearTimeout(bootTimer);
    boot.classList.add("done");
    setTimeout(() => { if (boot.classList.contains("done")) boot.style.display = "none"; }, 400);
    window.removeEventListener("keydown", endBoot);
  }
  function runBoot() {
    boot.style.display = "";
    boot.classList.remove("done");
    bootLog.innerHTML = "";
    const lines = BOOT[lang];
    let i = 0;
    const step = () => {
      if (i >= lines.length) { bootTimer = setTimeout(endBoot, 500); return; }
      const line = lines[i++].replace("[OK]", '<span class="ok">[OK]</span>');
      bootLog.innerHTML += line + "\n";
      bootTimer = setTimeout(step, 110);
    };
    step();
    window.addEventListener("keydown", endBoot);
  }
  boot.addEventListener("click", endBoot);

  /* ---------------- windows ---------------- */
  const desktop = document.getElementById("desktop");
  const taskList = document.getElementById("task-list");
  const windows = [...document.querySelectorAll(".window")];
  const isMobile = () => window.matchMedia("(max-width: 720px)").matches;
  let z = 20;

  function titleOf(win) {
    return win.querySelector(".title").textContent.split(":")[0].trim();
  }

  function focusWin(win) {
    windows.forEach((w) => w.classList.remove("active"));
    win.classList.add("active");
    win.style.zIndex = ++z;
    refreshTasks();
  }

  function openWin(id) {
    const win = document.getElementById(id);
    if (!win) return;
    const wasHidden = win.hidden;
    win.hidden = false;
    win.classList.remove("minimizing");
    win.dataset.open = "1";
    if (wasHidden) placeWin(win);
    focusWin(win);
    closeStart();
  }

  function closeWin(win) {
    win.hidden = true;
    delete win.dataset.open;
    win.classList.remove("active");
    refreshTasks();
  }

  function minimizeWin(win) {
    win.classList.add("minimizing");
    setTimeout(() => { win.hidden = true; win.classList.remove("minimizing", "active"); refreshTasks(); }, 180);
  }

  // converte posições em % (do CSS) para px e mantém a janela dentro da tela
  function placeWin(win) {
    if (isMobile()) return;
    const d = desktop.getBoundingClientRect();
    const w = win.offsetWidth, h = win.offsetHeight; // sem escala da animação
    let x = win.offsetLeft, y = win.offsetTop;
    if (win.hasAttribute("data-center")) x = (d.width - w) / 2;
    x = Math.max(110, Math.min(x, d.width - w - 8));
    y = Math.max(8, Math.min(y, d.height - h - 8));
    win.style.left = x + "px";
    win.style.top = y + "px";
  }

  windows.forEach((win) => {
    win.addEventListener("pointerdown", () => focusWin(win));
    win.querySelector(".ctl-close")?.addEventListener("click", (e) => { e.stopPropagation(); closeWin(win); });
    win.querySelector(".ctl-min")?.addEventListener("click", (e) => { e.stopPropagation(); minimizeWin(win); });

    // arrastar
    const bar = win.querySelector(".titlebar");
    bar.addEventListener("pointerdown", (e) => {
      if (isMobile() || e.target.closest(".ctl")) return;
      const startX = e.clientX, startY = e.clientY;
      const r = win.getBoundingClientRect();
      const d = desktop.getBoundingClientRect();
      bar.setPointerCapture(e.pointerId);
      const move = (ev) => {
        let x = r.left + ev.clientX - startX;
        let y = r.top + ev.clientY - startY;
        x = Math.max(-r.width + 80, Math.min(x, d.width - 80));
        y = Math.max(0, Math.min(y, d.height - 30));
        win.style.left = x + "px";
        win.style.top = y + "px";
      };
      const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); };
      bar.addEventListener("pointermove", move);
      bar.addEventListener("pointerup", up);
    });
  });

  // botões / ícones que abrem janelas
  document.querySelectorAll("[data-open]").forEach((el) => {
    // ícones do desktop: duplo clique no PC, toque único no celular / Enter no teclado
    if (el.classList.contains("icon")) {
      el.addEventListener("dblclick", () => openWin(el.dataset.open));
      el.addEventListener("click", (e) => { if (isMobile() || e.detail === 0) openWin(el.dataset.open); });
    } else {
      el.addEventListener("click", () => openWin(el.dataset.open));
    }
  });

  /* ---------------- taskbar ---------------- */
  function refreshTasks() {
    taskList.innerHTML = "";
    windows.filter((w) => w.dataset.open).forEach((w) => {
      const b = document.createElement("button");
      b.className = "btn task" + (w.classList.contains("active") && !w.hidden ? " active" : "");
      b.textContent = titleOf(w);
      b.addEventListener("click", () => {
        if (w.hidden) { w.hidden = false; focusWin(w); }
        else if (w.classList.contains("active")) minimizeWin(w);
        else focusWin(w);
      });
      taskList.appendChild(b);
    });
  }

  /* ---------------- start menu ---------------- */
  const startBtn = document.getElementById("start-btn");
  const startMenu = document.getElementById("start-menu");
  function closeStart() { startMenu.hidden = true; startBtn.classList.remove("pressed"); startBtn.setAttribute("aria-expanded", "false"); }
  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = startMenu.hidden;
    startMenu.hidden = !open;
    startBtn.classList.toggle("pressed", open);
    startBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => { if (!startMenu.contains(e.target)) closeStart(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeStart(); });
  document.getElementById("btn-reboot").addEventListener("click", () => { closeStart(); runBoot(); });

  /* ---------------- clock ---------------- */
  const clock = document.getElementById("clock");
  const tick = () => {
    const d = new Date();
    clock.textContent = d.toLocaleTimeString(lang === "pt" ? "pt-BR" : "en-US", { hour: "2-digit", minute: "2-digit" });
  };
  tick(); setInterval(tick, 15000);

  /* ---------------- copy e-mail ---------------- */
  document.querySelectorAll("[data-copy]").forEach((b) => {
    b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); } catch {}
      const t = document.createElement("div");
      t.className = "toast"; t.textContent = I18N[lang]["contact.copied"];
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 1600);
    });
  });

  /* ---------------- start ---------------- */
  applyLang(lang);
  const welcome = document.getElementById("win-welcome");
  welcome.dataset.open = "1";
  placeWin(welcome);
  focusWin(welcome);
  if (store.get("booted") && !location.hash.includes("boot")) endBoot();
  else { store.set("booted", "1"); runBoot(); }
  window.addEventListener("resize", () => windows.filter((w) => !w.hidden).forEach(placeWin));
})();
