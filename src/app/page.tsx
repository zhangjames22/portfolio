// src/app/page.tsx
'use client';

import type { JSX } from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  Palette,
  Zap,
  ExternalLink,
  Github,
  Mail,
  Linkedin,
  X,
} from "lucide-react";

/* ---------- Types ---------- */
type TypeWriterProps = {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetween?: number;
};

type Project = {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  technologies: string[];
  features?: string[];
  challenges?: string;
  demoUrl?: string;
  githubUrl?: string;
  image?: string | null;
};

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
  href?: string;        // if provided, renders a link
  external?: boolean;   // set true for external links
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/* ---------- Typewriter ---------- */
function TypeWriterText({
  texts,
  typeSpeed = 80,
  deleteSpeed = 40,
  delayBetween = 1800,
}: TypeWriterProps): JSX.Element {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const delayTimer = useRef<number | null>(null);

  useEffect(() => {
    const currentText = texts[currentIndex];
    const timeout = window.setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.substring(0, displayText.length + 1));
        } else {
          // pause before deleting
          delayTimer.current = window.setTimeout(
            () => setIsDeleting(true),
            delayBetween
          ) as unknown as number;
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => {
      clearTimeout(timeout);
      if (delayTimer.current) clearTimeout(delayTimer.current);
    };
  }, [displayText, currentIndex, isDeleting, texts, typeSpeed, deleteSpeed, delayBetween]);

  return <span>{displayText}</span>;
}

/* ---------- Button (button OR link) ---------- */
function Button({
  children,
  variant = "primary",
  className = "",
  href,
  external = false,
  ...buttonProps
}: ButtonProps): JSX.Element {
  const base =
    "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:scale-[1.02] focus:ring-blue-500",
    outline:
      "border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 bg-white/80 hover:scale-[1.02] focus:ring-gray-500",
  };
  const cls = `${base} ${styles[variant]} ${className}`;

  if (href) {
    const isSpecial =
      href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http");
    if (isSpecial) {
      return (
        <a
          href={href}
          className={cls}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...buttonProps}>
      {children}
    </button>
  );
}

/* ---------- Project Card ---------- */
function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: (p: Project) => void;
}): JSX.Element {
  return (
    <div
      className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => onClick(project)}
    >
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-4xl font-light text-gray-400">
            {project.title.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
            <ExternalLink className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Project Modal ---------- */
function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element | null {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    } else {
      document.body.style.overflow = "unset";
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const titleId = `project-title-${project.id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden shadow-2xl animate-fade-in-up">
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-6xl font-light text-gray-400">
                {project.title.charAt(0)}
              </div>
            )}
          </div>

          <div className="p-8">
            <h2 id={titleId} className="text-3xl font-bold text-gray-900 mb-4">
              {project.title}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {project.fullDescription || project.description}
                </p>

                {project.features && project.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      What I did
                    </h3>
                    <ul className="space-y-2">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.challenges && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Notes from the build
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {project.challenges}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {(project.demoUrl || project.githubUrl) && (
                  <div className="space-y-3">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        Live demo <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-lg font-medium transition-colors duration-200"
                      >
                        View code <Github className="ml-2 w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Home Page ---------- */
export default function Home(): JSX.Element {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  // Replace with your real projects (images can live in /public)
  const featuredProjects: Project[] = [
    {
      id: 1,
      title: "Terracotta.ai",
      description:
        "Launching soon...",
      fullDescription:
        "Optimized nutritional planning for every busy mom out there",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Docker"],
      features: ["Sign-in/roles", "Stripe webhooks", "Inventory updates"],
      challenges:
        "Keeping state tidy across checkout and webhooks. Used optimistic updates and a small event log.",
      demoUrl: "https://demo.example.com",
      githubUrl: "https://github.com/yourusername/project1",
      image: null,
    },
    {
      id: 2,
      title: "Vanderbilt Machine Learning & AI Lab",
      description:
        "Research with Prof. Kong at the Vanderbilt Machine Learning Lab",
      fullDescription:
        "Researching deep learning",
      technologies: ["Next.js", "TypeScript", "Prisma", "Socket.io", "PostgreSQL"],
      features: ["Live editing", "Filters", "File uploads"],
      challenges:
        "Avoiding sync weirdness during concurrent edits — used OT-style reconciliation.",
      demoUrl: "https://demo.example.com",
      githubUrl: "https://github.com/yourusername/project2",
      image: null,
    },
    {
      id: 3,
      title: "Primis.CX - Growth and Market Entry",
      description:
        "Gulf Cooperation Council entry project for a B2B consumer experience tech startup in the heart of South Africa",
      fullDescription:
        "Transforms raw data into simple visuals. Virtualized rendering + caching keep it snappy.",
      technologies: ["React", "D3.js", "Python", "FastAPI"],
      features: ["Drill-downs", "Streaming updates", "Exports"],
      challenges:
        "Rendering lots of points without jank — chunked fetches + memoization did the trick.",
      demoUrl: "https://demo.example.com",
      githubUrl: "https://github.com/yourusername/project3",
      image: null,
    },
  ];

  const skills = [
    {
      icon: <Code className="w-7 h-7" />,
      title: "Python",
      desc: "Currently pursuing research in Vanderbilt's Machine Learning and AI lab, ",
    },
    {
      icon: <Palette className="w-7 h-7" />,
      title: "C++",
      desc: "During my sophomore year summer, I interned at a hedge fund as a quant researcher. I used C++ as my main language ",
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "JavaScript",
      desc: "Front-end is fun, I can create anything",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-900">JZ</div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
              <a href="#projects" className="text-gray-600 hover:text-gray-900 transition-colors">
                Projects
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-light tracking-tight text-gray-900 leading-[0.9]">
              James Zhang
            </h1>
            <div className="text-3xl md:text-4xl font-light text-blue-600 tracking-tight h-16 flex items-center justify-center">
              <TypeWriterText
                texts={[
                  "Student at Vanderbilt",
                  "I like building things",
                  "Learning in public",
                ]}
              />
            </div>
          </div>

          <p className="text-xl md:text-2xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
            I’m a student who enjoys making simple, useful things for the web. Here are some projects I’ve built and what I’m currently curious about.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button href="#projects">
              <span className="flex items-center">
                See projects <ArrowRight className="ml-2 w-5 h-5" />
              </span>
            </Button>
            <Button variant="outline" href="#contact">
              <span className="flex items-center">Say hi</span>
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-gray-50/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Things I like working on
            </h2>
            <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto">
              Building, debugging, and learning new tools. Shipping small, improving often.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((s) => (
              <div
                key={s.title}
                className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100/80"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-blue-600">{s.icon}</div>
                </div>
                <h3 className="font-semibold text-xl text-gray-900 mb-3 text-center">
                  {s.title}
                </h3>
                <p className="text-gray-600 text-center font-light leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Projects
            </h2>
            <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto">
              Things I’ve built recently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={handleProjectClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-gray-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Say hello
          </h2>
          <p className="text-xl font-light text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Always happy to chat about projects, ideas, or internships. If something here sparks a thought, send a note.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button href="mailto:jameszhang136@gmail.com">
              <span className="flex items-center">
                <Mail className="mr-2 w-5 h-5" />
                Email me
              </span>
            </Button>
            <Button
              variant="outline"
              href="https://www.linkedin.com/in/james-zhang05/"
              external
            >
              <span className="flex items-center">
                <Linkedin className="mr-2 w-5 h-5" />
                LinkedIn
              </span>
            </Button>
          </div>

          <div className="text-gray-500 text-sm">
            Based in Nashville, TN • Building and learning along the way
          </div>
        </div>
      </section>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
