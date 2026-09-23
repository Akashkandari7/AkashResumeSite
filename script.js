(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  $("#year").textContent = new Date().getFullYear();

  // Nav: background on scroll, active link, back-to-top
  const nav = $("#nav");
  const toTop = $("#toTop");
  const onScroll = () => {
    nav.classList.toggle("scrolled", scrollY > 20);
    toTop.classList.toggle("show", scrollY > 600);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0 }));

  const links = $$(".nav-links a");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => sectionObserver.observe(s));

  // Mobile menu
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  const setMenu = (open) => {
    menuBtn.setAttribute("aria-expanded", open);
    navLinks.classList.toggle("open", open);
    nav.classList.toggle("menu-open", open);
  };
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  links.forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // Reveal on scroll
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  // Typed roles
  const roles = ["Full-Stack Developer", "Next.js + TypeScript", "Blender add-on builder", "AI pipelines on Gemini", "Postgres & Python"];
  const typed = $("#typed");
  if (reduceMotion) {
    typed.textContent = roles[0];
  } else {
    let r = 0, i = 0, deleting = false;
    const tick = () => {
      const word = roles[r];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 35 : 70;
      if (!deleting && i === word.length) { deleting = true; delay = 1800; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
      setTimeout(tick, delay);
    };
    tick();
  }

  // Lightbox
  const lightbox = $("#lightbox");
  const lbImg = $("img", lightbox);
  let lastFocus = null;
  const closeLightbox = () => {
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
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });

  // Terminal
  const out = $("#termOut");
  const form = $("#termForm");
  const input = $("#termInput");
  const history = [];
  let histIdx = 0;

  const print = (html, cls = "out") => {
    const div = document.createElement("div");
    div.className = "line " + cls;
    div.innerHTML = html;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  };
  const printCmd = (text) => {
    const div = document.createElement("div");
    div.className = "line cmd";
    div.textContent = text;
    out.appendChild(div);
  };
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
      "  <span class='hl'>clear</span>       clear the screen",
      "Tip: ↑ / ↓ for history, Tab to complete.",
    ].join("\n"),
    about: () => "Akash Kandari — final-year CS student and full-stack developer.\nI build and run software in production, end to end: schema, API, UI, deploy, and what breaks after.",
    whoami: () => "visitor — but you're probably looking for <span class='hl'>about</span>.",
    dragonpit: () => [
      "<span class='ok'>Dragon Pit</span> — asset platform + Blender add-on for a 3D animation studio",
      "  users     ~100 animators, daily",
      "  catalog   600+ assets, 560 GB on Cloudflare R2",
      "  web       Next.js (App Router), TypeScript, Prisma, PostgreSQL (Supabase), Vercel",
      "  ai        Gemini script breakdown: read script → list needs → cast against catalog",
      "  blender   Python/bpy add-on: browse, import, match scripts, retarget animation",
      "  role      sole developer, 2026 – present",
      "Scroll up to <a href='#dragon-pit'>#projects</a> for screenshots.",
    ].join("\n"),
    projects: () => [
      "<span class='hl'>QPGen</span>                  AI question-paper generator · Flask, Gemini, Postgres",
      "                       " + link("https://sem6-miniproject.vercel.app", "live") + " · " + link("https://github.com/Akashkandari7/Sem6_Miniproject", "code"),
      "<span class='hl'>Lead Generation Agent</span>  finds businesses with no website · Playwright, pandas",
      "                       " + link("https://github.com/Akashkandari7/Lead-generation", "code"),
      "<span class='hl'>Halebaked</span>              e-commerce app · Next.js, Tailwind, MongoDB",
      "                       " + link("https://halebaked.vercel.app", "live"),
      "Type <span class='hl'>dragonpit</span> for the main one.",
    ].join("\n"),
    skills: () => [
      "languages   TypeScript, JavaScript, Python, Java, SQL, HTML, CSS",
      "frameworks  Next.js, React, Node.js, Flask, Tailwind CSS, Prisma",
      "data/cloud  PostgreSQL, Supabase, MongoDB, Cloudflare R2 / S3, Vercel",
      "ai/auto     Gemini API, structured output, Blender Python, Playwright, pandas",
    ].join("\n"),
    education: () => "B.Tech CSE — K.R. Mangalam University, Gurugram (2023 – 2027)\nClass XII & X — D.A.V. Public School, Kotdwara",
    contact: () => [
      "email     <a href='mailto:akashkandari7@gmail.com'>akashkandari7@gmail.com</a>",
      "linkedin  " + link("https://linkedin.com/in/akashkandari7", "in/akashkandari7"),
      "github    " + link("https://github.com/Akashkandari7", "@Akashkandari7"),
    ].join("\n"),
    resume: () => { open("assets/AkashKandari_Resume.pdf", "_blank", "noopener"); return "Opening resume in a new tab…"; },
    ls: () => "about  dragonpit  projects  skills  education  contact  resume.pdf",
    date: () => new Date().toString(),
    sudo: () => "<span class='err'>Nice try.</span> This incident will be reported to /dev/null.",
    clear: () => { out.innerHTML = ""; return null; },
  };
  commands.cv = commands.resume;
  commands.work = commands.projects;
  const names = Object.keys(commands);

  const run = (raw) => {
    const text = raw.trim();
    printCmd(text);
    if (!text) return;
    const [name, ...rest] = text.split(/\s+/);
    const cmd = name.toLowerCase();
    if (cmd === "echo") {
      const div = document.createElement("div");
      div.className = "line out";
      div.textContent = rest.join(" ");
      out.appendChild(div);
    } else if (cmd === "cat" && rest[0]) {
      const target = rest[0].replace(/\.(txt|md|pdf)$/, "");
      commands[target] ? print(commands[target]()) : print("cat: no such file", "err");
    } else if (commands[cmd]) {
      const result = commands[cmd]();
      if (result !== null) print(result);
    } else {
      const div = document.createElement("div");
      div.className = "line err";
      div.textContent = `command not found: ${name}. Type 'help'.`;
      out.appendChild(div);
    }
    out.scrollTop = out.scrollHeight;
  };

  print("Welcome! This terminal knows about my work.\nType <span class='hl'>help</span> to start, or try <span class='hl'>dragonpit</span>.", "out");

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
  $(".term").addEventListener("click", (e) => { if (e.target.tagName !== "A") input.focus({ preventScroll: true }); });
})();
