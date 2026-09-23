(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  $("#year").textContent = new Date().getFullYear();

  // ---------- Loader ----------
  let loaded = false;
  const finishLoading = () => {
    if (loaded) return;
    loaded = true;
    $("#loader").classList.add("done");
    document.body.classList.remove("is-loading");
    document.body.classList.add("loaded");
  };
  addEventListener("load", () => setTimeout(finishLoading, 350));
  setTimeout(finishLoading, 2500); // never block the page on a slow font/CDN

  // ---------- Cursor glow ----------
  const glow = $("#cursorGlow");
  if (finePointer && !reduceMotion) {
    let x = 0, y = 0, raf = 0;
    addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      glow.classList.add("visible");
      if (!raf) raf = requestAnimationFrame(() => {
        glow.style.transform = `translate(${x - 160}px, ${y - 160}px)`;
        raf = 0;
      });
    });
    document.addEventListener("mouseleave", () => glow.classList.remove("visible"));
  }

  // ---------- Particles ----------
  if (!reduceMotion) {
    const box = $("#particles");
    const colors = ["rgba(108,99,255,.5)", "rgba(0,212,170,.45)", "rgba(255,107,157,.4)", "rgba(255,255,255,.25)"];
    const count = innerWidth < 768 ? 14 : 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      const size = Math.random() * 4 + 1;
      p.className = "particle";
      Object.assign(p.style, {
        width: size + "px",
        height: size + "px",
        left: Math.random() * 100 + "%",
        background: colors[i % colors.length],
        boxShadow: `0 0 ${size * 3}px ${colors[i % colors.length]}`,
        animationDuration: Math.random() * 20 + 12 + "s",
        animationDelay: -Math.random() * 25 + "s",
      });
      box.appendChild(p);
    }
  }

  // ---------- Typed subtitle ----------
  const roles = ["Full-Stack Developer", "Next.js + TypeScript", "Blender Add-on Builder", "AI Pipelines on Gemini", "Postgres & Python"];
  const typed = $("#typedText");
  if (reduceMotion) {
    typed.textContent = roles[0];
  } else {
    let r = 0, i = 0, deleting = false;
    const tick = () => {
      const word = roles[r];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 40 : 80;
      if (!deleting && i === word.length) { deleting = true; delay = 1800; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 400; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 900);
  }

  // ---------- Navbar ----------
  const navbar = $("#navbar");
  const scrollTopBtn = $("#scrollTop");
  const navLinks = $$(".nav-link");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", scrollY > 50);
    scrollTopBtn.classList.toggle("visible", scrollY > 500);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  scrollTopBtn.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("#hero, main .section").forEach((s) => sectionObserver.observe(s));

  const toggle = $("#navToggle");
  const menu = $("#navLinks");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", open);
    menu.classList.toggle("open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  navLinks.forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // ---------- Scroll reveal ----------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal, .stagger").forEach((el) => revealObserver.observe(el));

  // ---------- About mini-terminal types itself in ----------
  const mini = $("#miniTerminal");
  const miniLines = $$(".mt-line, .mt-out", mini);
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    miniLines.forEach((line, i) => setTimeout(() => line.classList.add("shown"), reduceMotion ? 0 : 250 + i * 260));
  }, { threshold: 0.3 }).observe(mini);

  // ---------- 3D tilt on the hero code window ----------
  const heroVisual = $("#heroVisual");
  const codeWindow = $("#codeWindow");
  if (finePointer && !reduceMotion) {
    heroVisual.addEventListener("mousemove", (e) => {
      const r = codeWindow.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
      codeWindow.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    heroVisual.addEventListener("mouseleave", () => { codeWindow.style.transform = ""; });
  }

  // ---------- Magnetic buttons ----------
  if (finePointer && !reduceMotion) {
    $$(".btn, .social-link").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.2;
        const dy = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = `translate(${dx}px, ${dy - 3}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  // ---------- Lightbox ----------
  const lightbox = $("#lightbox");
  const lbImg = $("img", lightbox);
  let lastFocus = null;
  const closeLightbox = () => {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  $$(".shot").forEach((btn) => btn.addEventListener("click", () => {
    lastFocus = btn;
    lbImg.src = btn.dataset.full;
    lbImg.alt = $("img", btn).alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    $(".lightbox-close", lightbox).focus();
  }));
  lightbox.addEventListener("click", closeLightbox);
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  // ---------- Interactive terminal ----------
  const body = $("#terminalBody");
  const form = $("#terminalForm");
  const input = $("#terminalInput");
  const history = [];
  let histIdx = 0;

  const addLine = (cls, { html, text }) => {
    const div = document.createElement("div");
    div.className = "term-line " + cls;
    if (html !== undefined) div.innerHTML = html; else div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  };
  const out = (html) => addLine("term-out", { html });
  const err = (text) => addLine("term-err", { text });
  const link = (href, label) => `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;

  const commands = {
    help: () => [
      "Available commands:",
      "  <span class='hl'>about</span>       who I am",
      "  <span class='hl'>dragonpit</span>   the studio platform I build",
      "  <span class='hl'>projects</span>    other things I've made",
      "  <span class='hl'>skills</span>      tech I use",
      "  <span class='hl'>education</span>   where I study",
      "  <span class='hl'>contact</span>     how to reach me",
      "  <span class='hl'>resume</span>      open my resume",
      "  <span class='hl'>social</span>      GitHub & LinkedIn",
      "  <span class='hl'>clear</span>       clear the screen",
      "Tip: ↑ / ↓ for history, Tab to complete.",
    ].join("\n"),
    about: () => "Akash Kandari — final-year CS student and full-stack developer.\nI build and run software in production, end to end: schema, API, UI, deploy, and what breaks after.",
    whoami: () => "visitor 👋 — but you're probably looking for <span class='hl'>about</span>.",
    dragonpit: () => [
      "<span class='ok'>Dragon Pit</span> — asset platform + Blender add-on for a 3D animation studio",
      "  users     ~100 animators, daily",
      "  catalog   600+ assets, 560 GB on Cloudflare R2",
      "  web       Next.js (App Router), TypeScript, Prisma, PostgreSQL (Supabase), Vercel",
      "  ai        Gemini script breakdown: read script → list needs → cast against catalog",
      "  blender   Python/bpy add-on: browse, import, match scripts, retarget animation",
      "  role      sole developer, 2026 – present",
      "Screenshots: <a href='#dragon-pit'>#projects</a>",
    ].join("\n"),
    projects: () => [
      "<span class='hl'>Dragon Pit</span>             studio asset platform · type <span class='hl'>dragonpit</span>",
      "<span class='hl'>QPGen</span>                  AI question-paper generator · Flask, Gemini, Postgres",
      "                       " + link("https://sem6-miniproject.vercel.app", "live") + " · " + link("https://github.com/Akashkandari7/Sem6_Miniproject", "code"),
      "<span class='hl'>Lead Generation Agent</span>  finds businesses with no website · Playwright, pandas",
      "                       " + link("https://github.com/Akashkandari7/Lead-generation", "code"),
      "<span class='hl'>Halebaked</span>              e-commerce app · Next.js, Tailwind, MongoDB",
      "                       " + link("https://halebaked.vercel.app", "live"),
    ].join("\n"),
    skills: () => [
      "languages   TypeScript, JavaScript, Python, Java, SQL, HTML, CSS",
      "frameworks  Next.js, React, Node.js, Flask, Tailwind CSS, Prisma",
      "data/cloud  PostgreSQL, Supabase, MongoDB, Cloudflare R2 / S3, Vercel",
      "ai/auto     Gemini API, structured output, Blender Python, Playwright, pandas",
    ].join("\n"),
    education: () => "B.Tech CSE — K.R. Mangalam University, Gurugram (2023 – 2027)\nClass XII (PCM) — D.A.V. Public School, Kotdwara",
    contact: () => [
      "email     <a href='mailto:akashkandari7@gmail.com'>akashkandari7@gmail.com</a>",
      "linkedin  " + link("https://linkedin.com/in/akashkandari7", "in/akashkandari7"),
      "github    " + link("https://github.com/Akashkandari7", "@Akashkandari7"),
    ].join("\n"),
    social: () => "github    " + link("https://github.com/Akashkandari7", "@Akashkandari7") + "\nlinkedin  " + link("https://linkedin.com/in/akashkandari7", "in/akashkandari7"),
    resume: () => { open("assets/AkashKandari_Resume.pdf", "_blank", "noopener"); return "Opening resume in a new tab…"; },
    ls: () => "about.txt  dragonpit/  projects/  skills.txt  education.txt  contact.txt  resume.pdf",
    date: () => new Date().toString(),
    sudo: () => "<span class='hl'>Nice try.</span> This incident will be reported to /dev/null.",
    clear: () => { body.innerHTML = ""; return null; },
  };
  commands.cv = commands.resume;
  commands.work = commands.projects;
  const names = Object.keys(commands);

  const run = (raw) => {
    const text = raw.trim();
    const cmdLine = document.createElement("div");
    cmdLine.className = "term-line term-cmd";
    cmdLine.innerHTML = "<span class='p'>visitor@portfolio:~$</span> ";
    cmdLine.append(text);
    body.appendChild(cmdLine);
    if (!text) return;

    const [name, ...rest] = text.split(/\s+/);
    const cmd = name.toLowerCase();
    if (cmd === "echo") {
      addLine("term-out", { text: rest.join(" ") });
    } else if (cmd === "cat" && rest[0]) {
      const target = rest[0].replace(/\/$/, "").replace(/\.(txt|md|pdf)$/, "");
      commands[target] && target !== "clear" ? out(commands[target]()) : err(`cat: ${rest[0]}: No such file`);
    } else if (commands[cmd]) {
      const result = commands[cmd]();
      if (result !== null) out(result);
    } else {
      err(`command not found: ${name}. Type 'help' for available commands.`);
    }
    body.scrollTop = body.scrollHeight;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value;
    if (value.trim()) history.push(value);
    histIdx = history.length;
    input.value = "";
    run(value);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && histIdx > 0) {
      e.preventDefault();
      input.value = history[--histIdx];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      histIdx = Math.min(history.length, histIdx + 1);
      input.value = history[histIdx] || "";
    } else if (e.key === "Tab" && input.value) {
      const match = names.filter((n) => n.startsWith(input.value.toLowerCase()));
      if (match.length === 1) { e.preventDefault(); input.value = match[0]; }
    }
  });
  $("#liveTerminal").addEventListener("click", (e) => {
    if (e.target.tagName !== "A" && !getSelection().toString()) input.focus({ preventScroll: true });
  });
})();
