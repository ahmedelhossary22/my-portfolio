"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { defaultContent } from "@/lib/defaultContent";
import { loadContent, addMessage } from "@/lib/content";

/* ============================================================
   DATA
   ============================================================ */

const navItems = [
  { label: "Home", href: "#home", icon: "home" },
  { label: "About", href: "#about", icon: "user" },
  { label: "Skills", href: "#skills", icon: "code" },
  { label: "Projects", href: "#work", icon: "folder" },
  { label: "Journey", href: "#journey", icon: "journey" },
  { label: "Contact", href: "#contact", icon: "mail" },
];

// Card colours/shapes only — the text comes from the admin dashboard.
const quickInfoStyles = [
  {
    number: "01",
    label: "NAME",
    value: "Ahmed Elhossary",
    icon: "♙",
    side: "left",
    bg: "bg-[#7A3E16]",
    valueClass: "text-lg sm:text-xl",
  },
  {
    number: "02",
    label: "LOCATION",
    value: "Cairo, Egypt",
    icon: "⌖",
    side: "right",
    bg: "bg-[#63300E]",
    valueClass: "text-lg sm:text-xl",
  },
  {
    number: "03",
    label: "ROLE",
    value: "AI Automation & Software Engineering",
    icon: "⌘",
    side: "left",
    bg: "bg-[#7A3E16]",
    valueClass: "text-base leading-snug sm:text-lg",
  },
  {
    number: "04",
    label: "FOCUS",
    value: "AI, Automation, Data & Applications",
    icon: "✦",
    side: "right",
    bg: "bg-[#4B210B]",
    valueClass: "text-base leading-snug sm:text-lg",
  },
];

/* ============================================================
   EDITABLE CONTENT (managed from /admin)
   ============================================================ */

const ContentContext = createContext(defaultContent);
const useContent = () => useContext(ContentContext);

const pad = (n) => String(n).padStart(2, "0");

// Stable anchor id for a section added from the dashboard
const sectionId = (s, i) =>
  s.id ? String(s.id).replace(/[^a-zA-Z0-9_-]/g, "-") : `section-${i + 1}`;

// Home … Journey, then every extra section, then Contact (always last)
function buildNavItems(extraSections = []) {
  const last = navItems[navItems.length - 1];

  return [
    ...navItems.slice(0, -1),
    ...extraSections.map((s, i) => ({
      label: s.navLabel || s.title || "Section",
      href: `#${sectionId(s, i)}`,
      icon: "section",
    })),
    last,
  ];
}

// "Hello **Ahmed**" -> Hello <strong>Ahmed</strong>
function RichText({ text }) {
  return String(text || "")
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
}

// Line breaks typed in the dashboard become <br />
function Lines({ text }) {
  return String(text || "")
    .split("\n")
    .map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
}

/* ============================================================
   ICONS
   ============================================================ */

function NavIcon({ type }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-5 w-5 shrink-0",
    "aria-hidden": true,
  };

  switch (type) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v12h14V9M9 21v-7h6v7" />
        </svg>
      );

    case "user":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
        </svg>
      );

    case "code":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
        </svg>
      );

    case "folder":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M8 11v4M11 11v4M14 11v4" />
        </svg>
      );

    case "journey":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
          <path d="M10 6h4a3 3 0 0 1 3 3v5M14 18h-4a3 3 0 0 1-3-3v-2" />
        </svg>
      );

    case "section":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 14h8" />
        </svg>
      );

    case "mail":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="m3 7 9 7 9-7" />
        </svg>
      );

    default:
      return null;
  }
}

function StrengthIcon({ type }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-7 w-7 shrink-0",
    "aria-hidden": true,
  };

  switch (type) {
    case "ai":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
          <path d="M10 12h4" />
        </svg>
      );

    case "data":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M3 3v18h18" />
          <path d="M7 15v3M12 10v8M17 6v12" />
        </svg>
      );

    case "backend":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="4" width="18" height="6" rx="1.5" />
          <rect x="3" y="14" width="18" height="6" rx="1.5" />
          <path d="M7 7h.01M7 17h.01" />
        </svg>
      );

    case "mobile":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <path d="M11 18h2" />
        </svg>
      );

    default:
      return null;
  }
}

/* ============================================================
   NAVBAR
   ============================================================ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const lockRef = useRef(false);
  const { hero, sections } = useContent();
  const items = buildNavItems(sections?.items);
  const idsKey = items.map((item) => item.href).join("|");

  useEffect(() => {
    const ids = idsKey.split("|").map((href) => href.slice(1));

    const onScroll = () => {
      setScrolled(window.scrollY > 10);

      // while a nav click is smooth-scrolling, don't override the clicked item
      if (lockRef.current) return;

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }

      const line = window.innerHeight * 0.35;
      let current = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }

      setActive(current);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [idsKey]);

  const goTo = (e, href) => {
    const id = href.slice(1);
    const el = document.getElementById(id);

    if (!el) return;

    e.preventDefault();
    setActive(id);

    lockRef.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);

    // release the lock once the smooth scroll has finished
    setTimeout(() => {
      lockRef.current = false;
    }, 900);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b text-[#8B1026] transition-all duration-300 ${
        scrolled
          ? "border-[#8B1026]/20 bg-[#F2EEE3]/95 shadow-sm backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-[78px] max-w-[1600px] items-center justify-between gap-6 overflow-x-auto px-5 sm:px-8 lg:px-12"
        style={{
          backgroundImage: scrolled
            ? "linear-gradient(rgba(139,16,38,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(139,16,38,0.035) 1px, transparent 1px)"
            : "none",
          backgroundSize: "30px 30px",
        }}
      >
        <a
          href="#home"
          onClick={(e) => goTo(e, "#home")}
          className="flex shrink-0 items-center gap-1 whitespace-nowrap font-serif text-xl font-bold text-[#8B1026] sm:text-2xl"
        >
          <span className="text-lg font-normal">&lt;</span>
          <span className="italic">Ahmed Elhossary</span>
          <span className="text-lg font-normal">/&gt;</span>
        </a>

        <div className="flex shrink-0 items-center gap-5 font-serif text-sm font-bold sm:gap-6 lg:gap-7 lg:text-base">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => goTo(e, item.href)}
              aria-current={
                active === item.href.slice(1) ? "page" : undefined
              }
              className={`relative flex shrink-0 items-center gap-2 py-3 transition-opacity duration-200 hover:opacity-60 after:absolute after:bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:bg-[#8B1026] after:transition-transform after:duration-300 ${
                active === item.href.slice(1)
                  ? "after:scale-x-100"
                  : "after:scale-x-0"
              }`}
            >
              <NavIcon type={item.icon} />
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <a
            href={hero.cvUrl}
            download
            aria-label="Download CV"
            className="inline-flex min-h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#151413] px-3 py-1.5 font-serif text-xs font-bold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 shrink-0 !text-white"
              aria-hidden="true"
            >
              <path d="M12 3v12M7 11l5 5 5-5M4 20h16" />
            </svg>
            <span className="!text-white">{hero.cvLabel}</span>
          </a>

          <a
            href="#home"
            onClick={(e) => goTo(e, "#home")}
            aria-label="Back to home"
            className="hidden shrink-0 font-serif text-3xl font-black italic tracking-[-0.12em] text-[#8B1026] xl:block"
          >
            AH
          </a>
        </div>
      </nav>
    </header>
  );
}

/* ============================================================
   HERO + TICKER
   ============================================================ */

function Hero() {
  const { hero: h } = useContent();

  return (
    <section
      id="home"
      className="scroll-mt-24 px-5 pb-0 pt-32 sm:px-8 sm:pt-36 md:px-12 lg:px-16 lg:pb-0"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
          <div className="flex flex-col items-start">
            <p className="mb-7 flex items-center gap-3 font-mono text-[10px] tracking-[0.14em] text-[#514641] sm:text-xs sm:tracking-[0.2em]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#A1343C] shadow-[0_0_0_6px_rgba(161,52,60,0.10)]" />
              {h.badge}
            </p>

            <h1 className="text-[clamp(3.1rem,6.5vw,6.8rem)] font-semibold leading-[0.94] tracking-[-0.075em]">
              {h.titleBefore}
              <br />
              <span className="text-[#A1343C]">{h.titleHighlight}</span>
              <br />
              <Lines text={h.titleAfter} />
            </h1>

            <p className="mt-7 max-w-[680px] text-base leading-8 text-[#625953] sm:text-lg">
              {h.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                className="group inline-flex min-h-[56px] items-center justify-center gap-5 rounded-xl bg-[#A1343C] px-6 py-4 text-sm font-semibold !text-white shadow-lg shadow-[#8B1026]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#8B1026]"
              >
                <span className="!text-white">{h.primaryButton}</span>
                <span className="!text-white transition-transform duration-300 group-hover:translate-y-1">
                  ↓
                </span>
              </a>

              <a
                href="#contact"
                className="inline-flex min-h-[56px] items-center justify-center gap-5 rounded-xl border border-[#D5C9B8] px-6 py-4 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-[#A1343C] hover:bg-white/30"
              >
                {h.secondaryButton} <span>↗</span>
              </a>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative mx-auto mt-2 w-full max-w-[560px] self-center overflow-hidden rounded-[32px] border border-[#D9CDBD] bg-[#EAE2D5]/40 lg:mt-0 lg:w-[calc(clamp(3.1rem,6.5vw,6.8rem)*3.8+120px)] lg:max-w-none lg:justify-self-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(139,16,38,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,16,38,0.08) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={h.photo}
              alt="Ahmed Elhossary"
              className="relative z-10 block h-auto w-full"
            />
          </div>
        </div>

        <div className="mt-10 flex w-full flex-wrap gap-x-7 gap-y-3 border-t border-[#D8CCBC] pb-4 pt-5 font-mono text-[10px] tracking-wide text-[#71655C] sm:text-xs">
          {h.meta.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsTicker() {
  const { ticker } = useContent();

  return (
    <div className="overflow-hidden border-y border-[#D8CCBC] py-5">
      <div className="flex min-w-max animate-[marquee_28s_linear_infinite] items-center gap-8 sm:gap-12">
        {[...ticker.items, ...ticker.items].map((skill, index) => (
          <div
            key={`${skill}-${index}`}
            className="flex items-center gap-8 sm:gap-12"
          >
            <span className="font-mono text-xs tracking-[0.15em] text-[#39332F] sm:text-sm">
              {skill}
            </span>
            <span className="text-lg text-[#A1343C]">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */

function QuickInfoCard({ item }) {
  const isLeft = item.side === "left";

  const shape = isLeft
    ? "rounded-l-2xl rounded-r-[3rem]"
    : "rounded-l-[3rem] rounded-r-2xl text-right";

  const number = (
    <span className="font-serif text-4xl font-black italic">{item.number}</span>
  );

  const icon = (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-xl"
      aria-hidden="true"
    >
      {item.icon}
    </span>
  );

  return (
    <article
      className={`flex min-h-[100px] items-center gap-4 ${shape} ${item.bg} px-5 py-5 text-[#F2EEE3] shadow-lg shadow-[#4B210B]/10 sm:px-7`}
    >
      {isLeft && number}

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold tracking-widest text-[#E8C9A8]">
          {item.label}
        </p>
        <p className={`mt-1 font-extrabold ${item.valueClass}`}>{item.value}</p>
      </div>

      {icon}

      {!isLeft && number}
    </article>
  );
}

function About() {
  const { about } = useContent();

  return (
    <section
      id="about"
      className="scroll-mt-28 bg-[#EAE2D5] px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* Left column */}
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-[#8B1026]">
            01 / ABOUT ME
          </p>

          <h2 className="mt-6 max-w-3xl font-serif text-4xl font-black italic uppercase leading-[1.02] tracking-tight text-[#4B210B] sm:text-5xl md:text-6xl">
            {about.headingMain}
            <br />
            <span className="text-[#8B1026]">{about.headingAccent}</span>
          </h2>

          <div className="mt-6 h-1.5 w-20 rounded-full bg-[#8B1026]" />

          {about.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={`${
                i === 0 ? "mt-7" : "mt-5"
              } max-w-2xl text-base leading-8 text-[#4B210B] sm:text-lg`}
            >
              <RichText text={paragraph} />
            </p>
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="mb-5 font-serif text-sm font-black tracking-[0.16em] text-[#4B210B]">
              QUICK INFO
            </p>

            <div className="space-y-3">
              {about.quickInfo.map((q, i) => (
                <QuickInfoCard
                  key={i}
                  item={{
                    ...quickInfoStyles[i % quickInfoStyles.length],
                    label: q.label,
                    value: q.value,
                    number: pad(i + 1),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="grid grid-cols-2 gap-3">
            {about.strengths.map((strength) => (
              <div
                key={strength.label}
                className="flex min-h-[72px] items-center justify-between gap-3 border-2 border-[#4B210B] bg-[#F2EEE3] px-4 py-4 text-[#4B210B] shadow-[5px_5px_0_0_#4B210B] transition-transform duration-300 hover:-translate-y-1 sm:px-5"
              >
                <span className="text-[10px] font-black tracking-[0.08em] sm:text-xs">
                  {strength.label}
                </span>
                <StrengthIcon type={strength.icon} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SKILLS
   ============================================================ */

function Skills() {
  const { skills } = useContent();

  return (
    <section
      id="skills"
      dir="ltr"
      className="scroll-mt-28 bg-[#F2EEE3] px-5 pb-10 pt-20 text-left sm:px-8 md:px-12 md:pb-12 md:pt-24 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <div>
          <p className="font-serif text-sm font-black tracking-[0.2em] text-[#8B1026]">
            02 / SKILLS
          </p>

          <h2 className="mt-5 font-serif text-4xl font-black italic uppercase leading-tight text-[#8B1026] sm:text-5xl md:text-6xl">
            {skills.title}
          </h2>

          <div className="mt-5 h-1.5 w-20 rounded-full bg-[#8B1026]" />

          <p className="mt-7 max-w-2xl text-base leading-8 text-[#71636A] sm:text-lg">
            {skills.description}
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {skills.categories.map((category) => (
            <div key={category.title}>
              <h3 className="mb-5 text-left text-sm font-bold tracking-[0.14em] text-[#8B1026] sm:text-base">
                {category.title}
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {category.items.map((skill) => (
                  <article
                    key={`${category.title}-${skill.name}`}
                    className="group min-h-[155px] rounded-[20px] border border-[#8B1026]/20 bg-[#EAE2D5] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#8B1026]/60 hover:shadow-lg hover:shadow-[#8B1026]/10"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B1026]/10 font-mono text-sm font-bold text-[#8B1026] transition-colors duration-300 group-hover:bg-[#8B1026] group-hover:text-[#F2EEE3]">
                      {skill.icon}
                    </div>

                    <h4 className="mt-4 text-base font-bold text-[#8B1026]">
                      {skill.name}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-[#71636A]">
                      {skill.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SELECTED WORK
   ============================================================ */

function ProjectPreview({ project }) {
  const { type, number } = project;

  return (
    <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-[#171514] p-6">
      <span className="absolute left-5 top-5 font-mono text-[10px] tracking-[0.18em] text-[#D66C73]">
        PROJECT / {number}
      </span>

      {type === "analytics" && (
        <div className="w-full max-w-lg pt-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              ["104", "MATCHES"],
              ["48", "TEAMS"],
              ["2026", "EDITION"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-3"
              >
                <p className="text-2xl font-semibold text-[#F2EEE3]">{value}</p>
                <p className="mt-1 font-mono text-[9px] text-white/45">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex h-20 items-end gap-2">
            {[35, 65, 45, 80, 55, 95, 70, 50, 85, 60, 75, 45].map(
              (height, index) => (
                <div
                  key={index}
                  style={{ height: `${height}%` }}
                  className="flex-1 rounded-t-sm bg-[#D66C73] transition-all duration-300 group-hover:bg-[#F2EEE3]"
                />
              )
            )}
          </div>

          <p className="mt-3 font-mono text-[9px] tracking-widest text-white/40">
            COLLECT → CLEAN → ANALYZE → VISUALIZE
          </p>
        </div>
      )}

      {(type === "ai" || type === "vision") && (
        <div className="w-full max-w-sm pt-5">
          <div className="flex items-center justify-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[#D66C73]/40 bg-[#D66C73]/10 text-5xl text-[#D66C73] transition-transform duration-300 group-hover:scale-105">
              {type === "ai" ? "♻" : "◎"}
            </div>

            <div className="space-y-3">
              <p className="font-mono text-[10px] tracking-widest text-[#D66C73]">
                {type === "ai" ? "CLASSIFICATION" : "GESTURE ANALYSIS"}
              </p>
              <div className="h-2 w-28 rounded bg-white/20" />
              <div className="h-2 w-20 rounded bg-white/15" />
              <div className="h-2 w-24 rounded bg-[#D66C73]/70" />
            </div>
          </div>

          <div className="mt-5 flex justify-between gap-2 font-mono text-[9px] text-white/45">
            <span>INPUT</span>
            <span>MODEL</span>
            <span>OUTPUT</span>
          </div>
        </div>
      )}

      {type === "tasks" && (
        <div className="w-full max-w-sm space-y-3 pt-5">
          {["Plan and organize", "Track progress", "Review tasks"].map(
            (task, index) => (
              <div
                key={task}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3 text-sm text-[#F2EEE3]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D66C73]/20 text-xs text-[#D66C73]">
                  {index + 1}
                </span>
                {task}
              </div>
            )
          )}
        </div>
      )}

      {["mobile", "news", "islamic"].includes(type) && (
        <div className="flex items-center gap-6 pt-5">
          <div className="w-[110px] rounded-[1.5rem] border-[5px] border-[#37302D] bg-[#F2EEE3] p-2 shadow-xl transition-transform duration-300 group-hover:-rotate-3">
            <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-[#37302D]" />

            <div className="rounded-md bg-[#8B1026] px-1 py-3 text-center text-[9px] font-semibold text-white">
              {type === "mobile"
                ? "EVENTS"
                : type === "news"
                  ? "LATEST NEWS"
                  : "ISLAMI"}
            </div>

            <div className="mt-3 space-y-2">
              <div className="h-9 rounded bg-[#D8CCBC]" />
              <div className="h-2 rounded bg-[#C9B8A5]" />
              <div className="h-2 w-4/5 rounded bg-[#D8CCBC]" />
              <div className="h-7 rounded bg-[#8B1026]/15" />
              <div className="h-7 rounded bg-[#D8CCBC]/70" />
            </div>

            <div className="mx-auto mt-3 h-1 w-8 rounded-full bg-[#37302D]/50" />
          </div>

          <div className="max-w-[145px]">
            <p className="font-mono text-[10px] tracking-widest text-[#D66C73]">
              FLUTTER APP
            </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Designed for a focused mobile experience.
            </p>
          </div>
        </div>
      )}

      <span className="absolute bottom-4 right-5 text-xl text-white/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#D66C73]">
        ↗
      </span>
    </div>
  );
}

function ProjectCard({ project, featured, onSelect }) {
  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(project);
        }
      }}
      className={`group cursor-pointer overflow-hidden rounded-2xl border border-[#D8CCBC] bg-[#EAE2D5] transition-all duration-300 hover:-translate-y-1 hover:border-[#8B1026]/50 hover:shadow-xl hover:shadow-[#4B210B]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1026] ${
        featured ? "md:col-span-2 xl:col-span-2" : ""
      }`}
    >
      <ProjectPreview project={project} />

      <div className="p-6 sm:p-7">
        <p className="font-mono text-[10px] tracking-[0.14em] text-[#8B1026]">
          {project.category}
        </p>

        <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#211C19] sm:text-2xl">
          {project.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#71655C]">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[#CFC1B0] px-3 py-1.5 text-[10px] font-medium text-[#514641]"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.contribution && (
          <p className="mt-4 text-xs text-[#71655C]">{project.contribution}</p>
        )}

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#D8CCBC] pt-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B1026] transition-colors hover:text-[#57101D]"
          >
            View on GitHub <span>↗</span>
          </a>

          <span className="text-xs font-medium text-[#71655C] transition-colors group-hover:text-[#8B1026]">
            View details →
          </span>
        </div>
      </div>
    </article>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#151413]/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#F2EEE3] shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2EEE3] text-lg font-bold text-[#8B1026] shadow-md transition-transform duration-200 hover:scale-105"
        >
          ✕
        </button>

        <ProjectPreview project={project} />

        <div className="p-6 sm:p-8">
          <p className="font-mono text-[10px] tracking-[0.14em] text-[#8B1026]">
            {project.category}
          </p>

          <h3
            id="project-modal-title"
            className="mt-3 text-2xl font-semibold tracking-tight text-[#211C19] sm:text-3xl"
          >
            {project.title}
          </h3>

          <div className="mt-5 space-y-4">
            {project.overview.map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm leading-7 text-[#625953] sm:text-base sm:leading-8"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-8 font-mono text-xs tracking-[0.2em] text-[#8B1026]">
            TECHNOLOGIES USED
          </p>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {project.technologies.map((tech) => (
              <li
                key={tech.name}
                className="rounded-xl border border-[#D8CCBC] bg-[#EAE2D5] p-4"
              >
                <p className="text-sm font-bold text-[#8B1026]">{tech.name}</p>
                <p className="mt-1 text-sm leading-6 text-[#71655C]">
                  {tech.use}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#D8CCBC] pt-5">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#A1343C] px-5 py-3 text-sm font-semibold !text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#8B1026]"
            >
              <span className="!text-white">View on GitHub</span>
              <span className="!text-white">↗</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-[#71655C] transition-colors hover:text-[#8B1026]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectedWork() {
  const [selectedProject, setSelectedProject] = useState(null);
  const { projects } = useContent();

  return (
    <section
      id="work"
      className="scroll-mt-28 px-5 pb-10 pt-10 sm:px-8 md:px-12 md:pb-12 md:pt-12 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono text-xs tracking-[0.2em] text-[#8B1026]">
          03 / PROJECTS
        </p>

        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            {projects.title}
          </h2>

          <p className="max-w-md text-sm leading-7 text-[#71655C]">
            {projects.description}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.items.map((p, index) => (
            <ProjectCard
              key={index}
              project={{
                ...p,
                number: pad(index + 1),
                tech: p.tech || [],
                overview: p.overview || [],
                technologies: p.technologies || [],
              }}
              featured={index === 0}
              onSelect={setSelectedProject}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-[#D8CCBC] pt-6 sm:flex-row sm:items-center">
          <p className="text-sm leading-6 text-[#71655C]">
            Explore the repositories to see the code and project
            implementation.
          </p>

          <a
            href="https://github.com/ahmedelhossary22"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-sm font-semibold text-[#8B1026] transition-colors hover:text-[#57101D]"
          >
            More on GitHub <span>↗</span>
          </a>
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

/* ============================================================
   JOURNEY
   ============================================================ */

function Journey() {
  const { journey } = useContent();
  const milestones = journey.milestones || [];

  const renderIcon = (type) => {
    const common = {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "h-6 w-6",
      "aria-hidden": true,
    };

    switch (type) {
      case "light":
        return (
          <svg viewBox="0 0 24 24" {...common}>
            <path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-1 .8-1 2-1 2h-6s0-1.2-1-2Z" />
          </svg>
        );

      case "education":
        return (
          <svg viewBox="0 0 24 24" {...common}>
            <path d="m2 9 10-5 10 5-10 5L2 9Z" />
            <path d="M6 11v5c4 3 8 3 12 0v-5M22 9v7" />
          </svg>
        );

      case "code":
        return (
          <svg viewBox="0 0 24 24" {...common}>
            <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16" />
          </svg>
        );

      case "mobile":
        return (
          <svg viewBox="0 0 24 24" {...common}>
            <rect x="6" y="2" width="12" height="20" rx="2" />
            <path d="M10 5h4M11 18h2" />
          </svg>
        );

      case "ai":
        return (
          <svg viewBox="0 0 24 24" {...common}>
            <rect x="5" y="5" width="14" height="14" rx="3" />
            <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3M9 12h6" />
          </svg>
        );

      case "automation":
        return (
          <svg viewBox="0 0 24 24" {...common}>
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
            <circle cx="12" cy="12" r="5" />
            <path d="m10 12 1.5 1.5L14 10" />
          </svg>
        );

      case "rocket":
        return (
          <svg viewBox="0 0 24 24" {...common}>
            <path d="M5 15c-1 1-2 4-2 4s3-1 4-2M9 13l-3-3c3-5 8-7 14-7 0 6-2 11-7 14l-3-3" />
            <circle cx="15" cy="8" r="2" />
            <path d="M9 16c-1 2-1 3-1 4 2 0 3-1 4-2" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <section
      id="journey"
      className="scroll-mt-28 bg-[#EAE2D5] px-5 py-20 text-left sm:px-8 md:px-12 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Section heading */}
        <div className="mb-16 max-w-3xl text-left">
          <p className="font-mono text-xs tracking-[0.2em] text-[#8B1026]">
            04 / JOURNEY
          </p>

          <h2 className="mt-5 font-serif text-4xl font-black italic uppercase leading-tight text-[#8B1026] sm:text-5xl md:text-6xl">
            {journey.title}
          </h2>

          <div className="mt-5 h-1.5 w-20 rounded-full bg-[#8B1026]" />

          <p className="mt-7 max-w-2xl text-base leading-8 text-[#63300E] sm:text-lg">
            {journey.subtitle}
          </p>
        </div>

        {/* Introduction card */}
        <div className="mb-16 rounded-[2rem] border border-[#CDB18E] bg-[#F2EEE3]/40 p-6 shadow-sm sm:p-10">
          <p className="font-mono text-xs font-bold tracking-[0.2em] text-[#8B1026]">
            MY STORY SO FAR
          </p>

          <h3 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-[#4B210B] sm:text-4xl">
            {journey.introTitle}
          </h3>

          <p className="mt-5 max-w-4xl text-base leading-8 text-[#63300E] sm:text-lg">
            {journey.introText}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute bottom-8 left-[23px] top-8 w-px bg-[#CDB18E] md:left-[31px]" />

          <div className="space-y-10 sm:space-y-12">
            {milestones.map((milestone, index) => (
              <article
                key={`${milestone.title}-${index}`}
                className="relative pl-14 sm:pl-16 md:pl-24"
              >
                {/* Timeline icon */}
                <div className="absolute left-0 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#CDB18E] bg-[#F2EEE3] text-[#8B1026] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:h-16 md:w-16">
                  {renderIcon(milestone.icon)}
                </div>

                {/* Timeline card */}
                <div className="rounded-[1.75rem] border border-[#D3B894] bg-[#F2EEE3]/45 p-5 shadow-[0_8px_20px_rgba(75,33,11,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#8B1026]/40 hover:shadow-[0_14px_30px_rgba(75,33,11,0.10)] sm:p-7 md:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <span className="inline-flex max-w-full rounded-full bg-[#8B1026]/10 px-4 py-2 font-mono text-[10px] font-bold uppercase leading-relaxed tracking-[0.15em] text-[#8B1026] sm:text-xs">
                        {milestone.period}
                      </span>

                      <h3 className="mt-4 text-xl font-bold leading-snug text-[#4B210B] sm:text-2xl">
                        {milestone.title}
                      </h3>
                    </div>

                    <div className="hidden shrink-0 rounded-2xl bg-[#E8D2B3] p-3 text-[#8B1026] sm:block">
                      {renderIcon(milestone.icon)}
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[#63300E] sm:text-base sm:leading-8">
                    {milestone.description}
                  </p>

                  <div className="mt-6">
                    <p className="mb-3 font-mono text-[10px] font-bold tracking-[0.18em] text-[#8B1026]">
                      SKILLS & KNOWLEDGE
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {milestone.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex rounded-full border border-[#CDB18E] bg-[#E8D2B3]/60 px-3 py-2 text-xs leading-relaxed text-[#3E291D] transition-colors duration-200 hover:border-[#8B1026]/50 hover:bg-[#E8D2B3]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Closing message */}
        <div className="mt-16 rounded-[1.75rem] border border-[#CDB18E] bg-[#E8D2B3]/50 p-7 sm:p-9">
          <p className="font-mono text-xs font-bold tracking-[0.2em] text-[#8B1026]">
            WHAT COMES NEXT
          </p>

          <h3 className="mt-4 text-2xl font-bold text-[#4B210B] sm:text-3xl">
            {journey.closingTitle}
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#63300E] sm:text-base sm:leading-8">
            {journey.closingText}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   EXTRA SECTIONS (added from /admin → Extra sections)
   ============================================================ */

function CustomSections() {
  const { sections } = useContent();
  const list = sections?.items || [];

  return (
    <>
      {list.map((s, i) => {
        const id = sectionId(s, i);
        const cards = s.cards || [];

        return (
          <section
            key={id}
            id={id}
            className={`scroll-mt-28 ${
              s.background === "warm" ? "bg-[#EAE2D5]" : "bg-[#F2EEE3]"
            } px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16`}
          >
            <div className="mx-auto max-w-[1400px]">
              <p className="font-mono text-xs tracking-[0.2em] text-[#8B1026]">
                {pad(5 + i)} / {(s.navLabel || s.title || "").toUpperCase()}
              </p>

              <h2 className="mt-5 font-serif text-4xl font-black italic uppercase leading-tight text-[#8B1026] sm:text-5xl md:text-6xl">
                {s.title}
              </h2>

              <div className="mt-5 h-1.5 w-20 rounded-full bg-[#8B1026]" />

              {s.description && (
                <p className="mt-7 max-w-2xl whitespace-pre-line text-base leading-8 text-[#63300E] sm:text-lg">
                  {s.description}
                </p>
              )}

              {cards.length > 0 && (
                <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {cards.map((c, j) => (
                    <article
                      key={j}
                      className="rounded-[20px] border border-[#8B1026]/20 bg-white/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#8B1026]/60 hover:shadow-lg hover:shadow-[#8B1026]/10 sm:p-7"
                    >
                      {c.subtitle && (
                        <p className="font-mono text-[10px] tracking-[0.14em] text-[#8B1026]">
                          {c.subtitle}
                        </p>
                      )}

                      <h3 className="mt-3 text-xl font-bold text-[#4B210B] sm:text-2xl">
                        {c.title}
                      </h3>

                      {c.text && (
                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#63300E]">
                          {c.text}
                        </p>
                      )}

                      {c.link && (
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8B1026] transition-colors hover:text-[#57101D]"
                        >
                          {c.linkLabel || "Learn more"} <span>↗</span>
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

/* ============================================================
   CONTACT / FOOTER
   ============================================================ */

// Contact form delivery via Web3Forms (free, no backend needed).
// 1. Go to https://web3forms.com and enter ahmedelhossery22@gmail.com
// 2. They email you an "Access Key" — paste it below.
const WEB3FORMS_KEY = "679291c8-b606-462a-85ed-3b6d035f0da0";

async function sendEmailCopy({ name, email, message }) {
  if (!WEB3FORMS_KEY || WEB3FORMS_KEY.startsWith("PASTE_")) {
    throw new Error("Web3Forms key not set");
  }

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      name,
      email,
      message,
      subject: `Portfolio message from ${name}`,
      from_name: "Portfolio Contact Form",
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.success === "false" || data.success === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
}

function SocialIcon({ type }) {
  const common = {
    fill: "currentColor",
    className: "h-5 w-5 shrink-0",
    "aria-hidden": true,
    viewBox: "0 0 24 24",
  };

  if (type === "github") {
    return (
      <svg {...common}>
        <path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.8.56A11.53 11.53 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function Contact() {
  const { contact, sections } = useContent();
  const customCount = sections?.items?.length || 0;

  const socialLinks = [
    { label: "GitHub", href: contact.github, icon: "github" },
    { label: "LinkedIn", href: contact.linkedin, icon: "linkedin" },
  ].filter((link) => link.href);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  // status: "idle" | "sending" | "success" | "error"
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const update = (field) => (e) => {
    if (status !== "sending") setStatus("idle");
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    try {
      // 1) Save in Firestore (shows up in /admin → Messages)
      // 2) Email copy via Web3Forms
      // Success if at least one of them worked.
      const results = await Promise.allSettled([
        addMessage(payload),
        sendEmailCopy(payload),
      ]);

      if (results.every((r) => r.status === "rejected")) {
        throw results[0].reason;
      }

      setForm({ name: "", email: "", message: "" });
      setErrorMessage("");
      setStatus("success");
    } catch (err) {
      console.error("Contact form error:", err);
      setErrorMessage(
        err?.code === "permission-denied"
          ? "Message could not be saved (database permissions)."
          : "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3.5 text-sm text-[#F2EEE3] placeholder:text-white/35 transition-colors duration-200 focus:border-[#D66C73] focus:outline-none focus:ring-2 focus:ring-[#D66C73]/30 [&:-webkit-autofill]:shadow-[0_0_0_1000px_#222020_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#F2EEE3]";

  return (
    <footer
      id="contact"
      className="scroll-mt-28 bg-[#151413] px-5 pb-8 pt-16 text-[#F2EEE3] sm:px-8 md:px-12 md:pt-20 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: intro + social links */}
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-[#D66C73]">
              {pad(5 + customCount)} / GET IN TOUCH
            </p>

            <h2 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              {contact.headingBefore}
              <br />
              <span className="text-[#D66C73]">{contact.headingHighlight}</span>
            </h2>

            <div className="mt-6 h-1.5 w-20 rounded-full bg-[#D66C73]" />

            <p className="mt-7 max-w-md text-base leading-8 text-white/60">
              {contact.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="group inline-flex min-h-12 items-center gap-3 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-[#F2EEE3] transition-all duration-300 hover:-translate-y-1 hover:border-[#D66C73] hover:bg-[#D66C73]/10"
                >
                  <SocialIcon type={link.icon} />
                  {link.label}
                  <span className="text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#D66C73]">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right: contact form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
          >
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#D66C73]">
              SEND A MESSAGE
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-xs font-semibold tracking-wide text-white/70"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your name"
                  autoComplete="name"
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-xs font-semibold tracking-wide text-white/70"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-xs font-semibold tracking-wide text-white/70"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Tell me about your idea or question..."
                  className={`${fieldClass} resize-y`}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex min-h-14 items-center gap-4 rounded-xl bg-[#A1343C] px-6 py-4 text-sm font-semibold !text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#8B1026] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span className="!text-white">
                  {status === "sending" ? "Sending..." : "Send Message"}
                </span>
                <span className="!text-white transition-transform group-hover:translate-x-1">
                  ↗
                </span>
              </button>

              {status === "success" && (
                <p role="status" className="text-sm text-[#E8C9A8]">
                  Thank you! Your message has been sent.
                </p>
              )}

              {status === "error" && (
                <p role="alert" className="text-sm text-[#D66C73]">
                  {errorMessage || "Something went wrong. Please try again."}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>{contact.footerLeft}</span>
          <span>{contact.footerCenter}</span>
          <span>
            © {new Date().getFullYear()} Ahmed Elhossary. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function Home() {
  const [content, setContent] = useState(defaultContent);

  // Load the content saved from /admin (falls back to the built-in defaults).
  useEffect(() => {
    let alive = true;

    loadContent()
      .then((data) => {
        if (alive) setContent(data);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  return (
    <ContentContext.Provider value={content}>
    <main className="min-h-screen overflow-x-clip bg-[#F2EEE3] text-[#191817]">
      <Navbar />
      <Hero />
      <SkillsTicker />
      <About />
      <Skills />
      <SelectedWork />
      <Journey />
      <CustomSections />
      <Contact />
    </main>
    </ContentContext.Provider>
  );
}
