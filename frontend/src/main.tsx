import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Bot, BriefcaseBusiness, Code, Copy, ExternalLink, Loader2, Maximize2, Menu, MessageCircle, Minimize2, Palette, Send, X } from "lucide-react";
import "./styles.css";

const navItems = [
  { label: "About Me", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experiences", href: "#experiences" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" }
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tony-hoang-488114222/" },
  { label: "GitHub", href: "https://github.com/VietToan210904" },
  { label: "Facebook", href: "https://www.facebook.com/viettoan.hoangbui" },
  { label: "Instagram", href: "https://www.instagram.com/vtoan0702/" }
];

const assistantPanelSizes = [
  { width: 27, height: 32 },
  { width: 30, height: 36 },
  { width: 33, height: 40 },
  { width: 36, height: 45 },
  { width: 39, height: 50 }
];

function SocialIcon({ label }: { label: string }) {
  switch (label) {
    case "LinkedIn":
      return (
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.55V9h3.57v11.45ZM22.23 0H1.76C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.76 24h20.47c.97 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0Z" />
        </svg>
      );
    case "GitHub":
      return (
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.46 11.46 0 0 1 12 5.79c1.02 0 2.04.14 3 .4 2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"
          />
        </svg>
      );
    case "Facebook":
      return (
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.09 4.39 23.08 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07Z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
          <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.95 1.9a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7ZM12 7.35A4.65 4.65 0 1 1 12 16.65 4.65 4.65 0 0 1 12 7.35Zm0 2A2.65 2.65 0 1 0 12 14.65 2.65 2.65 0 0 0 12 9.35Z" />
        </svg>
      );
    default:
      return <span>{label.slice(0, 2)}</span>;
  }
}

const projects = [
  {
    number: "01",
    category: "Computer Vision",
    title: "Hazard and Collision Detection",
    tech: "YOLOv8m, DeepSORT, CNNs, UNet, OpenCV, PyTorch, CUDA, CVAT and Roboflow.",
    description:
      "Real-time ADAS system for NSW driving scenarios, detecting brake lights, turn indicators, lanes, and potential hazards with stabilised inference.",
    image: "/project-adas.jpg",
    tone: "from-[#5b241c] via-[#b5342d] to-[#f7d046]"
  },
  {
    number: "02",
    category: "NLP",
    title: "IMDB Sentiment Analysis",
    tech: "Python, NLTK, TF-IDF, Bag-of-Words, Logistic Regression, Naive Bayes and Neural Networks.",
    description:
      "Compared traditional machine learning and deep learning models on 50,000+ IMDB reviews with evaluation through ROC curves and confusion matrices.",
    image: "/project-imdb.jpg",
    tone: "from-[#314229] via-[#7e955d] to-[#f0dcab]"
  },
  {
    number: "03",
    category: "Computer Vision",
    title: "Human Activity Recognition",
    tech: "TensorFlow, PyTorch, video preprocessing, feature extraction and deep learning models.",
    description:
      "Implemented models for detecting and classifying human actions from video data, targeting applications in surveillance, healthcare, and smart environments.",
    image: "/project-activity.webp",
    tone: "from-[#4d3f2b] via-[#c89a2f] to-[#fff1a3]"
  },
  {
    number: "04",
    category: "Data Mining",
    title: "NBA Rookie Career Longevity",
    tech: "Python, data mining, feature analysis, classification models and performance evaluation.",
    description:
      "Predicted whether NBA rookies would remain in the league for five years using player attributes and performance data.",
    image: "/project-nba.webp",
    tone: "from-[#2f4936] via-[#6e8b61] to-[#d7ddcd]"
  },
  {
    number: "05",
    category: "Social Impact",
    title: "Virtual Library Platform",
    tech: "Firebase, Java backend, HTML, CSS, API integration and project coordination.",
    description:
      "Led a programming team to build a digital library platform providing textbook access for children in disadvantaged areas.",
    image: "/project-library.jpg",
    tone: "from-[#5b241c] via-[#7e955d] to-[#f3ead6]"
  }
];

const experienceTimeline = [
  {
    period: "Apr 2025 - Present",
    title: "Research Assistant - LLM Researcher",
    organization: "The GrapheneX - Human-centric Artificial Intelligence Centre (HAI)",
    summary:
      "Building AI-driven platform systems for RNA vaccine data, developing agentic multi-agent AI systems, and researching prompt engineering, RAG, RLAIF, and DPO for vaccine target discovery.",
    highlights: ["Full-stack AI platform development", "Agentic multi-agent systems", "RAG and LLM research", "Healthcare AI collaboration"]
  },
  {
    period: "Apr 2023 - Nov 2023",
    title: "Head of Programming",
    organization: "Virtual Library",
    summary:
      "Led development of a digital library platform for children in disadvantaged areas, coordinating programmers, project timelines, Firebase services, Java backend, HTML/CSS frontend, and API integration.",
    highlights: ["Team leadership", "Firebase and Java backend", "HTML/CSS frontend", "Social impact technology"]
  }
];

const skillRows = [
  ["Python", "Java", "HTML/CSS", "Firebase", "React", "TypeScript", "FastAPI", "GitHub"],
  ["TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "Computer Vision", "LLMs", "RAG", "AI Agents"],
  ["YOLOv8", "DeepSORT", "UNet", "OpenCV", "CUDA", "Roboflow", "CVAT", "Data Annotation"],
  ["Post-Processing", "Models & Algorithms", "Microsoft Excel", "Project Management", "Team Collaboration", "Problem Solving", "Communication"]
];

const sameOriginApiHostsValue = (
  import.meta.env.VITE_SAME_ORIGIN_API_HOSTS ??
  "tonyhoang.space,www.tonyhoang.space,tony-portfolio-prod.web.app,tony-portfolio-prod.firebaseapp.com"
) as string;

const sameOriginApiHosts = sameOriginApiHostsValue
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);

const resolveApiBaseUrl = () => {
  const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";
  const currentHost = window.location.hostname.toLowerCase();
  const shouldUseSameOriginApi = import.meta.env.DEV || sameOriginApiHosts.includes(currentHost);

  return shouldUseSameOriginApi ? "" : configuredApiBaseUrl.replace(/\/$/, "");
};

const apiBaseUrl = resolveApiBaseUrl();

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  sources?: ChatSource[];
  usedRetrievalFallback?: boolean;
  usedLlmFallback?: boolean;
};

type ChatSource = {
  source: string | null;
  score: number;
  preview: string;
};

type ChatResponse = {
  answer: string;
  sources: ChatSource[];
  used_retrieval_fallback?: boolean;
  used_llm_fallback?: boolean;
};

const dribblePlayers = [
  { id: "one", jersey: "07" },
  { id: "two", jersey: "24" },
  { id: "three", jersey: "11" },
  { id: "four", jersey: "AI" },
  { id: "five", jersey: "33" },
  { id: "six", jersey: "03" },
  { id: "seven", jersey: "10" },
  { id: "eight", jersey: "21" },
  { id: "nine", jersey: "05" },
  { id: "ten", jersey: "30" }
];

function useActiveSection() {
  const [active, setActive] = useState("home");
  const targetSectionRef = useRef<string | null>(null);
  const targetLockUntilRef = useRef(0);

  useEffect(() => {
    const ids = ["home", ...navItems.map((item) => item.href.replace("#", ""))];
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const targetSection = targetSectionRef.current;

      if (targetSection) {
        const targetElement = document.getElementById(targetSection);
        const targetTop = targetElement?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        const headerOffset = window.matchMedia("(max-width: 640px)").matches ? 72 : 88;

        if (Math.abs(targetTop - headerOffset) < 12 || Date.now() < targetLockUntilRef.current) {
          setActive(targetSection);
          if (Math.abs(targetTop - headerOffset) < 12) targetSectionRef.current = null;
          return;
        }

        targetSectionRef.current = null;
      }

      const documentHeight = document.documentElement.scrollHeight;
      const isNearBottom = window.scrollY + window.innerHeight >= documentHeight - 8;

      if (isNearBottom) {
        setActive("contact");
        return;
      }

      const headerOffset = window.matchMedia("(max-width: 640px)").matches ? 72 : 88;
      const anchorY = headerOffset + (window.innerHeight - headerOffset) * 0.42;
      const visibleSections = ids
        .map((id) => {
          const section = document.getElementById(id);
          return section ? { id, rect: section.getBoundingClientRect() } : null;
        })
        .filter((section): section is { id: string; rect: DOMRect } => {
          return Boolean(section && section.rect.bottom > headerOffset && section.rect.top < window.innerHeight);
        });

      const anchoredSection = visibleSections.find((section) => {
        return section.rect.top <= anchorY && section.rect.bottom >= anchorY;
      });

      if (anchoredSection) {
        setActive(anchoredSection.id);
        return;
      }

      const current = visibleSections.reduce((selected, section) => {
        const currentDistance = Math.abs(section.rect.top - headerOffset);
        const selectedDistance = Math.abs(selected.rect.top - headerOffset);
        return currentDistance < selectedDistance ? section : selected;
      }, visibleSections[0]);

      setActive(current?.id ?? "home");
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const navigateToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    targetSectionRef.current = id;
    targetLockUntilRef.current = Date.now() + 1600;
    setActive(id);
    section.classList.add("is-visible");
    section.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => element.classList.add("is-visible"));
    section.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
    window.history.replaceState(null, "", id === "home" ? window.location.pathname : `#${id}`);
  };

  return { active, navigateToSection };
}

function useCustomCursor() {
  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".cursor");
    if (!cursor) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const interactiveSelector = "a, button, input, textarea, select, [role='button']";
    const activeTrails = new Set<HTMLElement>();
    let lastX: number | null = null;
    let lastY: number | null = null;
    let ballSpin = 0;
    let lastTrailAt = 0;
    let settleTimer = 0;

    const addTrail = (x: number, y: number, angle: number) => {
      const trail = document.createElement("span");
      trail.className = "cursor-trail";
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      trail.style.setProperty("--trail-angle", `${angle}rad`);
      document.body.appendChild(trail);
      activeTrails.add(trail);

      window.setTimeout(() => {
        trail.remove();
        activeTrails.delete(trail);
      }, 560);
    };

    const move = (event: MouseEvent) => {
      const distance = lastX === null || lastY === null ? 0 : Math.hypot(event.clientX - lastX, event.clientY - lastY);
      const angle = lastX === null || lastY === null ? 0 : Math.atan2(event.clientY - lastY, event.clientX - lastX);

      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add("is-visible");

      if (!reduceMotion.matches && distance > 0) {
        ballSpin += distance * 0.55;
        cursor.style.setProperty("--ball-spin", `${ballSpin}deg`);
        cursor.style.setProperty("--dribble-lift", `${Math.min(distance * 0.28, 10)}px`);
        cursor.classList.add("is-moving");

        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          cursor.style.setProperty("--dribble-lift", "0px");
          cursor.classList.remove("is-moving");
        }, 120);

        if (distance > 9 && event.timeStamp - lastTrailAt > 46) {
          addTrail(event.clientX, event.clientY, angle);
          lastTrailAt = event.timeStamp;
        }
      }

      lastX = event.clientX;
      lastY = event.clientY;
    };

    const showHover = (event: MouseEvent | FocusEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest(interactiveSelector)) {
        cursor.classList.add("is-hovering");
      }
    };

    const hideHover = (event: MouseEvent | FocusEvent) => {
      const relatedTarget = "relatedTarget" in event ? event.relatedTarget : null;
      if (!(relatedTarget instanceof Element) || !relatedTarget.closest(interactiveSelector)) {
        cursor.classList.remove("is-hovering");
      }
    };

    const hideCursor = () => {
      cursor.classList.remove("is-visible", "is-hovering", "is-moving");
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", showHover);
    document.addEventListener("mouseout", hideHover);
    document.addEventListener("focusin", showHover);
    document.addEventListener("focusout", hideHover);
    document.addEventListener("mouseleave", hideCursor);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", showHover);
      document.removeEventListener("mouseout", hideHover);
      document.removeEventListener("focusin", showHover);
      document.removeEventListener("focusout", hideHover);
      document.removeEventListener("mouseleave", hideCursor);
      window.clearTimeout(settleTimer);
      activeTrails.forEach((trail) => trail.remove());
      activeTrails.clear();
    };
  }, []);
}

function useRevealOnScroll() {
  useEffect(() => {
    const sectionElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal^="section-"]'));
    const contentElements = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal^="section-"])');

    const contentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -70px 0px" }
    );

    let frame = 0;

    const updateSectionVisibility = () => {
      frame = 0;
      const headerOffset = window.matchMedia("(max-width: 640px)").matches ? 72 : 88;
      const anchorY = headerOffset + (window.innerHeight - headerOffset) * 0.42;

      const visibleSections = sectionElements.filter((section) => {
        const rect = section.getBoundingClientRect();
        return rect.bottom > headerOffset && rect.top < window.innerHeight;
      });

      const activeSection =
        visibleSections.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= anchorY && rect.bottom >= anchorY;
        }) ??
        visibleSections.reduce<HTMLElement | null>((selected, section) => {
          if (!selected) return section;
          const rect = section.getBoundingClientRect();
          const selectedRect = selected.getBoundingClientRect();
          return Math.abs(rect.top - headerOffset) < Math.abs(selectedRect.top - headerOffset) ? section : selected;
        }, null);

      sectionElements.forEach((section) => {
        const isActive = section === activeSection;
        section.classList.toggle("is-visible", isActive);
        if (isActive) {
          section.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal^="section-"])').forEach((element) => {
            element.classList.add("is-visible");
          });
        }
      });
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateSectionVisibility);
    };

    contentElements.forEach((element) => contentObserver.observe(element));
    updateSectionVisibility();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      contentObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);
}

function DribblePlayer({ id, jersey }: { id: string; jersey: string }) {
  return (
    <div className={`dribble-player dribble-player--${id}`}>
      <span className="dribble-player__shadow" />
      <span className="dribble-player__body">
        <span className="dribble-player__head" />
        <span className="dribble-player__torso">
          <span>{jersey}</span>
        </span>
        <span className="dribble-player__arm dribble-player__arm--left" />
        <span className="dribble-player__arm dribble-player__arm--right" />
        <span className="dribble-player__leg dribble-player__leg--left" />
        <span className="dribble-player__leg dribble-player__leg--right" />
        <span className="dribble-player__shoe dribble-player__shoe--left" />
        <span className="dribble-player__shoe dribble-player__shoe--right" />
        <span className="dribble-player__ball" />
      </span>
    </div>
  );
}

function VerticalNbaCourt() {
  return (
    <div className="nba-court">
      <span className="nba-court__boundary" />
      <span className="nba-court__half-line" />
      <span className="nba-court__center-circle" />
      <span className="nba-court__logo">HOOPS</span>
      <span className="nba-court__paint nba-court__paint--top" />
      <span className="nba-court__paint nba-court__paint--bottom" />
      <span className="nba-court__free-throw nba-court__free-throw--top" />
      <span className="nba-court__free-throw nba-court__free-throw--bottom" />
      <span className="nba-court__three-point nba-court__three-point--top" />
      <span className="nba-court__three-point nba-court__three-point--bottom" />
      <span className="nba-court__hoop nba-court__hoop--top">
        <span className="nba-court__board" />
        <span className="nba-court__rim" />
        <span className="nba-court__net" />
      </span>
      <span className="nba-court__hoop nba-court__hoop--bottom">
        <span className="nba-court__board" />
        <span className="nba-court__rim" />
        <span className="nba-court__net" />
      </span>
    </div>
  );
}

function DribbleCourtBackdrop() {
  return (
    <div className="dribble-backdrop" aria-hidden="true">
      <div className="dribble-backdrop__floor" />
      <VerticalNbaCourt />
      {dribblePlayers.map((player) => (
        <DribblePlayer key={player.id} id={player.id} jersey={player.jersey} />
      ))}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { active, navigateToSection } = useActiveSection();

  return (
    <header className="header">
      <nav className="nav container">
        <a
          className="nav__logo"
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            navigateToSection("home");
            setOpen(false);
          }}
        >
          <span className="nav__logo-command">whoami</span>
          <span className="nav__logo-output">Tony Hoang</span>
        </a>

        <div className={`nav__menu ${open ? "is-open" : ""}`}>
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            return (
              <a
                key={item.href}
                className={`nav__link ${active === id ? "active-link" : ""}`}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  navigateToSection(id);
                  setOpen(false);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <button className="nav__toggle" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      <div className="header__flag-runner" aria-hidden="true">
        <span className="header__flag-pole" />
        <span className="header__flag">
          <span className="header__flag-star" />
        </span>
        <span className="header__flag-leg header__flag-leg--left" />
        <span className="header__flag-leg header__flag-leg--right" />
        <span className="header__flag-shadow" />
      </div>
    </header>
  );
}

function Hero() {
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const names = [
    ["Bui Viet", "Toan Hoang"],
    ["Tony", "Hoang"]
  ];
  const roles = [
    ["AI Engineer", "& Researcher"],
    ["Data", "Scientist"]
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroTextIndex((index) => (index + 1) % names.length);
    }, 3800);

    return () => window.clearInterval(interval);
  }, [names.length]);

  const currentName = names[heroTextIndex];
  const currentRole = roles[heroTextIndex];

  return (
    <section className="home section" id="home">
      <div className="home__blob home__blob--one" />
      <div className="home__blob home__blob--two" />

      <div className="home__container container">
        <div className="home__left home-animate home-animate--left">
          <p className="home__greeting">Xin Chao, I'm</p>
          <h1 className="home__name" key={`name-${heroTextIndex}`}>
            <span data-text={currentName[0]}>{currentName[0]}</span>
            <br />
            <span data-text={currentName[1]}>{currentName[1]}</span>
          </h1>
        </div>

        <div className="home__portrait home-animate home-animate--portrait">
          <div className="home__glow" />
          <img
            src="/portrait.png"
            alt="Portfolio portrait"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <div className="home__fade" />
        </div>

        <div className="home__right home-animate home-animate--right">
          <p className="home__split">Creative</p>
          <h2 className="home__profession" key={`role-${heroTextIndex}`}>
            <span data-text={currentRole[0]}>{currentRole[0]}</span>
            <span data-text={currentRole[1]}>{currentRole[1]}</span>
          </h2>
        </div>

        <div className="home__social home-animate home-animate--bottom">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} aria-label={link.label} target="_blank" rel="noreferrer">
              <SocialIcon label={link.label} />
            </a>
          ))}
        </div>

        <a className="home__cv home-animate home-animate--bottom" href="/resume.pdf" download="Tony-Hoang-Resume.pdf">
          Resume <ExternalLink />
        </a>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section" id="about" data-reveal="section-pop">
      <div className="container about__container">
        <div className="about__media" data-reveal="left">
          <div className="about__image" />
        </div>

        <div className="about__content" data-reveal="right">
          <h2 className="section__title text-left">
            <span>Designing AI Systems</span>
            <br />
            that See, Think, and Act
          </h2>
          <p className="about__description">
            I'm an <b>AI engineer and developer</b> passionate about building intelligent systems that solve real-world problems.
            My work focuses on <b>computer vision, machine learning, LLM applications, and Agentic AI</b>, with hands-on experience in real-time
            hazard detection, data-driven projects, and full-stack AI systems.
          </p>
          <a className="button" href="/resume.pdf" download="Tony-Hoang-Resume.pdf">
            Resume <ExternalLink />
          </a>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const setActiveProject = (nextIndex: number) => {
    setIndex((currentIndex) => {
      if (nextIndex === currentIndex) return currentIndex;
      setPreviousIndex(currentIndex);
      setSlideDirection(nextIndex > currentIndex ? "left" : "right");
      return nextIndex;
    });
  };

  const scrollToProject = (projectIndex: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollTo({ left: projectIndex * slider.clientWidth, behavior: "smooth" });
    setActiveProject(projectIndex);
  };

  const updateActiveProject = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    setActiveProject(Math.round(slider.scrollLeft / slider.clientWidth));
  };

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const slider = sliderRef.current;
    if (!slider) return;
    dragRef.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: slider.scrollLeft
    };
    slider.setPointerCapture(event.pointerId);
    slider.classList.add("is-dragging");
  };

  const drag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const slider = sliderRef.current;
    if (!slider || !dragRef.current.isDragging) return;
    const distance = event.clientX - dragRef.current.startX;
    slider.scrollLeft = dragRef.current.scrollLeft - distance;
  };

  const stopDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && !dragRef.current.isDragging) return;
    const slider = sliderRef.current;
    if (!slider) return;
    dragRef.current.isDragging = false;
    slider.classList.remove("is-dragging");
    if (slider.hasPointerCapture(event.pointerId)) slider.releasePointerCapture(event.pointerId);
    updateActiveProject();
  };

  return (
    <section className="projects section" id="projects" data-reveal="section-slide-left">
      <div className="container">
        <h2 className="section__title" data-reveal="up">
          I Make Incredible
          <br />
          <span>Projects</span>
        </h2>

        <div
          className="projects__shell"
          data-reveal="zoom"
          ref={sliderRef}
          onScroll={updateActiveProject}
          onPointerDown={startDrag}
          onPointerMove={drag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onPointerLeave={(event) => {
            if (dragRef.current.isDragging) stopDrag(event);
          }}
        >
          <div className="projects__track">
            {projects.map((project, projectIndex) => {
              const stateClass =
                projectIndex === index
                  ? `is-active throw-in-${slideDirection}`
                  : projectIndex === previousIndex
                    ? `throw-out-${slideDirection}`
                    : "";

              return (
              <article className={`projects__card ${stateClass}`} key={project.number}>
                <div className={`projects__visual bg-gradient-to-br ${project.tone}`} style={project.image ? { backgroundImage: `url(${project.image})` } : undefined}>
                  <span>{project.category}</span>
                </div>

                <div className="projects__content">
                  <div className="projects__number">{project.number}</div>
                  <p className="projects__category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className="projects__description">{project.description}</p>
                  <p className="projects__subtitle">Technologies used</p>
                  <p>{project.tech}</p>
                </div>
              </article>
              );
            })}
          </div>
        </div>

        <div className="projects__dots" aria-label="Project navigation">
          {projects.map((item, itemIndex) => (
              <button key={item.number} className={itemIndex === index ? "active-dot" : ""} onClick={() => scrollToProject(itemIndex)} aria-label={`Show project ${item.number}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="work section" id="experiences" data-reveal="section-slide-right">
      <div className="container">
        <h2 className="section__title" data-reveal="up">
          <span>My</span>
          <br />
          Experiences
        </h2>

        <div className="timeline">
          {experienceTimeline.map((item, index) => (
            <article className="timeline__item" key={`${item.period}-${item.title}`} data-reveal={index % 2 === 0 ? "left" : "right"}>
              <div className="timeline__marker">
                <BriefcaseBusiness />
              </div>
              <div className="timeline__content">
                <time>{item.period}</time>
                <h3>{item.title}</h3>
                <p className="timeline__org">{item.organization}</p>
                <p>{item.summary}</p>
                <div className="timeline__tags">
                  {item.highlights.map((highlight) => (
                    <span key={highlight}>{highlight}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="services section" id="skills" data-reveal="section-zoom-scan">
      <div className="container">
        <h2 className="section__title" data-reveal="up">
          Skills I <span>Work With</span>
        </h2>

        <div className="skills-showcase" data-reveal="up">
          <div className="skills-showcase__intro">
            <div>
              <Code />
              <span>AI Engineering</span>
            </div>
            <div>
              <Palette />
              <span>Data, Vision & Research</span>
            </div>
          </div>

          <div className="skills-marquee" aria-label="Technical skills">
            {skillRows.map((row, rowIndex) => (
              <div className={`skills-marquee__row ${rowIndex % 2 ? "reverse" : ""}`} key={row.join("-")}>
                <div className="skills-marquee__track">
                  {[...row, ...row].map((skill, skillIndex) => (
                    <span key={`${skill}-${skillIndex}`}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "hoangbuiviettoan1912@gmail.com";

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="contact section" id="contact" data-reveal="section-glow">
      <div className="container contact__container">
        <div data-reveal="left">
          <h2 className="section__title text-left">Contact Me</h2>
          <p className="contact__description">Tell me about your next project. Open to connections!</p>
          <button className="button" onClick={copyEmail}>
            <Copy /> {copied ? "Copied" : "Copy email"}
          </button>
          <p className="contact__email">{email}</p>
        </div>

        <div className="contact__info" data-reveal="right">
          <article>
            <h3>Email</h3>
            <a href={`mailto:${email}`}>{email}</a>
          </article>
          <article>
            <h3>Location</h3>
            <p>Sydney, Australia</p>
          </article>
          <article>
            <h3>Social Media</h3>
            <div className="contact__links">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [panelSizeLevel, setPanelSizeLevel] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi, I'm Tony's RAG assistant. Ask me about Tony's experience, projects, skills, resume, or contact details."
    }
  ]);
  const assistantRef = useRef<HTMLElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const wheelResizeRef = useRef(0);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !assistantRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const panelSize = assistantPanelSizes[panelSizeLevel];
  const panelExpanded = panelSizeLevel === assistantPanelSizes.length - 1;
  const panelStyle = {
    "--assistant-panel-width": `${panelSize.width}rem`,
    "--assistant-panel-height": `${panelSize.height}rem`
  } as React.CSSProperties;

  const resizePanel = (direction: 1 | -1) => {
    setPanelSizeLevel((current) => Math.min(assistantPanelSizes.length - 1, Math.max(0, current + direction)));
  };

  const handlePanelWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const now = window.performance.now();
    if (now - wheelResizeRef.current < 90) return;

    wheelResizeRef.current = now;
    resizePanel(event.deltaY < 0 ? 1 : -1);
  };

  const sendMessage = async (message: string) => {
    const clean = message.trim();
    if (!clean || loading) return;

    setMessages((current) => [...current, { role: "user", content: clean }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean })
      });

      if (response.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }

      if (!response.ok) throw new Error("The assistant is not available right now.");

      const data: ChatResponse = await response.json();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          usedRetrievalFallback: data.used_retrieval_fallback,
          usedLlmFallback: data.used_llm_fallback
        }
      ]);
    } catch (error) {
      const message =
        error instanceof Error && error.message.includes("Too many requests")
          ? "Too many requests. Please wait a moment and try again."
          : "I can't reach Tony's assistant service yet. Please make sure the FastAPI backend and vLLM server are running, then try again.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: message
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className={`assistant ${open ? "is-open" : ""}`} aria-label="Tony Hoang AI assistant" ref={assistantRef}>
      <button className="assistant__toggle" type="button" aria-label={open ? "Close AI assistant" : "Open AI assistant"} onClick={() => setOpen((value) => !value)}>
        {open ? <X /> : <MessageCircle />}
      </button>

      <div className="assistant__panel" onWheel={handlePanelWheel} style={panelStyle}>
        <div className="assistant__header">
          <div>
            <span className="assistant__badge">
              <Bot /> RAG Assistant
            </span>
            <h2>Ask About Tony</h2>
            <p>Answers are grounded in Tony's portfolio knowledge base.</p>
          </div>
          <div className="assistant__actions">
            <button
              type="button"
              aria-label={panelExpanded ? "Shrink AI assistant" : "Expand AI assistant"}
              title={panelExpanded ? "Shrink" : "Expand"}
              onClick={() => setPanelSizeLevel(panelExpanded ? 0 : assistantPanelSizes.length - 1)}
            >
              {panelExpanded ? <Minimize2 /> : <Maximize2 />}
            </button>
            <button type="button" aria-label="Close AI assistant" title="Close" onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>
        </div>

        <div className="assistant__messages" ref={messagesRef}>
          {messages.map((message, index) => (
            <div className={`assistant__message assistant__message--${message.role}`} key={`${message.role}-${index}-${message.content.slice(0, 12)}`}>
              <p>{message.content}</p>
              {message.role === "assistant" && (message.usedRetrievalFallback || message.usedLlmFallback) && (
                <div className="assistant__notice">
                  {message.usedLlmFallback ? "Model fallback used" : "Retrieval fallback used"}
                </div>
              )}
              {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                <div className="assistant__sources" aria-label="Answer sources">
                  {message.sources.slice(0, 3).map((source, sourceIndex) => (
                    <span key={`${source.source ?? "source"}-${sourceIndex}`}>
                      {source.source ?? "Portfolio"} · {source.score.toFixed(2)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="assistant__message assistant__message--assistant assistant__message--loading">
              <Loader2 /> Thinking with Tony's knowledge base...
            </div>
          )}
        </div>

        <form
          className="assistant__form"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
        >
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask anything about Tony..." maxLength={1200} />
          <button type="submit" aria-label="Send message" disabled={loading || !input.trim()}>
            <Send />
          </button>
        </form>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copy">
        All Rights Reserved By <span>Tony Hoang</span>
      </p>
      <span className="footer__divider" aria-hidden="true" />
      <p className="footer__year">&#169; {new Date().getFullYear()}</p>
    </footer>
  );
}

function App() {
  useCustomCursor();
  useRevealOnScroll();

  return (
    <>
      <div className="cursor" aria-hidden="true">
        <span className="cursor__shadow" />
        <span className="cursor__ball" />
      </div>
      <Header />
      <main className="main">
        <Hero />
        <div className="basketball-zone">
          <DribbleCourtBackdrop />
          <About />
          <Projects />
          <Work />
          <Services />
          <Contact />
          <Footer />
        </div>
      </main>
      <AiAssistant />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
