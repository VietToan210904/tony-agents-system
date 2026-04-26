import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Bot, BriefcaseBusiness, Code, Copy, ExternalLink, Loader2, Menu, MessageCircle, Palette, Send, X } from "lucide-react";
import "./styles.css";

const navItems = [
  { label: "About Us", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" }
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tony-hoang-488114222/" },
  { label: "GitHub", href: "https://github.com/VietToan210904" },
  { label: "Facebook", href: "https://www.facebook.com/viettoan.hoangbui" },
  { label: "Instagram", href: "https://www.instagram.com/vtoan0702/" }
];

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

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const ids = ["home", "about", "projects", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

function useCustomCursor() {
  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".cursor");
    if (!cursor) return;

    const move = (event: MouseEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    const interactiveElements = document.querySelectorAll("a, button");
    const showHover = () => cursor.classList.add("is-hovering");
    const hideHover = () => cursor.classList.remove("is-hovering");

    window.addEventListener("mousemove", move);
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", showHover);
      element.addEventListener("mouseleave", hideHover);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", showHover);
        element.removeEventListener("mouseleave", hideHover);
      });
    };
  }, []);
}

function useRevealOnScroll() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
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

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function Header() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  return (
    <header className="header">
      <nav className="nav container">
        <a className="nav__logo" href="#home" onClick={() => setOpen(false)}>
          Tony Hoang
        </a>

        <div className={`nav__menu ${open ? "is-open" : ""}`}>
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            return (
              <a key={item.href} className={`nav__link ${active === id ? "active-link" : ""}`} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            );
          })}
        </div>

        <button className="nav__toggle" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
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
              {link.label.slice(0, 2)}
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
    <section className="about section" id="about">
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
    <section className="projects section" id="projects">
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
    <section className="work section">
      <div className="container">
        <h2 className="section__title" data-reveal="up">
          <span>My Work</span>
          <br />
          Experience
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
    <section className="services section">
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
    <section className="contact section" id="contact">
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi, I'm Tony's AI assistant. Ask me about his experience, projects, skills, or contact details."
    }
  ]);
  const messagesRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What AI experience does Tony have?",
    "Tell me about Tony's projects",
    "What skills does Tony use?",
    "How can I contact Tony?"
  ];

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

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

      if (!response.ok) throw new Error("The assistant is not available right now.");

      const data: { answer: string; used_llm_fallback?: boolean } = await response.json();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I can't reach Tony's assistant service yet. Please make sure the FastAPI backend and vLLM server are running, then try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className={`assistant ${open ? "is-open" : ""}`} aria-label="Tony Hoang AI assistant">
      <button className="assistant__toggle" type="button" aria-label={open ? "Close AI assistant" : "Open AI assistant"} onClick={() => setOpen((value) => !value)}>
        {open ? <X /> : <MessageCircle />}
      </button>

      <div className="assistant__panel">
        <div className="assistant__header">
          <div>
            <span className="assistant__badge">
              <Bot /> RAG Assistant
            </span>
            <h2>Ask About Tony</h2>
          </div>
          <button type="button" aria-label="Close AI assistant" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <div className="assistant__messages" ref={messagesRef}>
          {messages.map((message, index) => (
            <div className={`assistant__message assistant__message--${message.role}`} key={`${message.role}-${index}-${message.content.slice(0, 12)}`}>
              {message.content}
            </div>
          ))}
          {loading && (
            <div className="assistant__message assistant__message--assistant assistant__message--loading">
              <Loader2 /> Thinking with Tony's knowledge base...
            </div>
          )}
        </div>

        <div className="assistant__suggestions" aria-label="Suggested questions">
          {suggestedQuestions.map((question) => (
            <button type="button" key={question} onClick={() => sendMessage(question)}>
              {question}
            </button>
          ))}
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
      <p>
        All Rights Reserved By <span>TonyHoang</span>
      </p>
      <p>&#169; {new Date().getFullYear()}</p>
    </footer>
  );
}

function App() {
  useCustomCursor();
  useRevealOnScroll();

  return (
    <>
      <div className="cursor" />
      <Header />
      <main className="main">
        <Hero />
        <About />
        <Projects />
        <Work />
        <Services />
        <Contact />
      </main>
      <AiAssistant />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
