import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BriefcaseBusiness,
  ChevronDown,
  Code,
  Copy,
  ExternalLink,
  Menu,
  Palette,
  X
} from "lucide-react";
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
    tone: "from-[#5b241c] via-[#b5342d] to-[#f7d046]"
  },
  {
    number: "02",
    category: "NLP",
    title: "IMDB Sentiment Analysis",
    tech: "Python, NLTK, TF-IDF, Bag-of-Words, Logistic Regression, Naive Bayes and Neural Networks.",
    description:
      "Compared traditional machine learning and deep learning models on 50,000+ IMDB reviews with evaluation through ROC curves and confusion matrices.",
    tone: "from-[#314229] via-[#7e955d] to-[#f0dcab]"
  },
  {
    number: "03",
    category: "Computer Vision",
    title: "Human Activity Recognition",
    tech: "TensorFlow, PyTorch, video preprocessing, feature extraction and deep learning models.",
    description:
      "Implemented models for detecting and classifying human actions from video data, targeting applications in surveillance, healthcare, and smart environments.",
    tone: "from-[#4d3f2b] via-[#c89a2f] to-[#fff1a3]"
  },
  {
    number: "04",
    category: "Data Mining",
    title: "NBA Rookie Career Longevity",
    tech: "Python, data mining, feature analysis, classification models and performance evaluation.",
    description:
      "Predicted whether NBA rookies would remain in the league for five years using player attributes and performance data.",
    tone: "from-[#2f4936] via-[#6e8b61] to-[#d7ddcd]"
  },
  {
    number: "05",
    category: "Social Impact",
    title: "Virtual Library Platform",
    tech: "Firebase, Java backend, HTML, CSS, API integration and project coordination.",
    description:
      "Led a programming team to build a digital library platform providing textbook access for children in disadvantaged areas.",
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

const services = [
  {
    icon: Code,
    title: "Developer",
    description: "Website creation with HTML, CSS, JavaScript. Professional websites with TypeScript, React, Node JS, and lots of creativity.",
    skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Node Js", "Next Js", "PHP", "GitHub"]
  },
  {
    icon: Palette,
    title: "Design",
    description: "Web designer with Figma and Sketch, creating motion designs with After Effects, creativity and design at its best.",
    skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Sketch", "3D Modeling", "After Effects"]
  }
];

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
            observer.unobserve(entry.target);
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
  const project = projects[index];

  return (
    <section className="projects section" id="projects">
      <div className="container">
        <h2 className="section__title" data-reveal="up">
          I Make Incredible
          <br />
          <span>Projects</span>
        </h2>

        <div className="projects__shell">
          <button className="projects__arrow" onClick={() => setIndex((value) => (value - 1 + projects.length) % projects.length)} aria-label="Previous project">
            Prev
          </button>

          <article className="projects__card" key={project.number} data-reveal="zoom">
            <div className={`projects__visual bg-gradient-to-br ${project.tone}`}>
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

          <button className="projects__arrow" onClick={() => setIndex((value) => (value + 1) % projects.length)} aria-label="Next project">
            Next
          </button>
        </div>

        <div className="projects__dots" aria-label="Project navigation">
          {projects.map((item, itemIndex) => (
            <button key={item.number} className={itemIndex === index ? "active-dot" : ""} onClick={() => setIndex(itemIndex)} aria-label={`Show project ${item.number}`} />
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
          Timeline
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
  const [open, setOpen] = useState(0);

  return (
    <section className="services section">
      <div className="container">
        <h2 className="section__title" data-reveal="up">
          What I <span>Offer</span>
        </h2>

        <div className="services__grid">
          {services.map(({ icon: Icon, title, description, skills }, index) => (
            <article className={`services__card ${open === index ? "is-open" : ""}`} key={title} data-reveal="up">
              <button onClick={() => setOpen(open === index ? -1 : index)}>
                <Icon />
                <span>{title}</span>
                <ChevronDown className="services__chevron" />
              </button>
              <div className="services__body">
                <p>{description}</p>
                <h3>Skills &amp; Tools</h3>
                <div>
                  {skills.map((skill) => (
                    <span key={skill}>{skill}</span>
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
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
