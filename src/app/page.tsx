// src/app/page.tsx
"use client";

import type { JSX } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code,
  Github,
  Linkedin,
  Mail,
  Shield,
  Target,
  Wrench,
} from "lucide-react";

import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import type { Project } from "@/data/projects";

/* ---------- Types ---------- */
type TypeWriterProps = {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetween?: number;
};

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
  href?: string; // if provided, renders a link
  external?: boolean; // set true for external links
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/* ---------- Typewriter ---------- */
function TypeWriterText({
  texts,
  typeSpeed = 70,
  deleteSpeed = 35,
  delayBetween = 1600,
}: TypeWriterProps): JSX.Element {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const delayTimer = useRef<number | null>(null);

  useEffect(() => {
    const currentText = texts[currentIndex] ?? "";
    const timeout = window.setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.substring(0, displayText.length + 1));
        } else {
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
  }, [
    displayText,
    currentIndex,
    isDeleting,
    texts,
    typeSpeed,
    deleteSpeed,
    delayBetween,
  ]);

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
      "border-2 border-gray-300 hover:border-gray-400 text-gray-800 hover:text-gray-950 bg-white/80 hover:scale-[1.02] focus:ring-gray-500",
  };
  const cls = `${base} ${styles[variant]} ${className}`;

  if (href) {
    const isSpecial =
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("http");
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

/* ---------- Badge ---------- */
function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "green";
}): JSX.Element {
  const tones: Record<string, string> = {
    neutral: "bg-gray-100 text-gray-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span className={`px-3 py-1 text-sm rounded-full ${tones[tone]}`}>
      {children}
    </span>
  );
}

/* ---------- Small list row ---------- */
function BulletRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}): JSX.Element {
  return (
    <div className="flex gap-4">
      <div className="mt-1 text-blue-700">{icon}</div>
      <div>
        <div className="font-semibold text-gray-950">{title}</div>
        <div className="text-gray-600 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

/* ---------- Home Page ---------- */
export default function Home(): JSX.Element {
  const router = useRouter();

  const grouped = useMemo(() => {
    const acc = new Map<string, Project[]>();
    for (const p of projects) {
      const key = p.category ?? "Projects";
      if (!acc.has(key)) acc.set(key, []);
      acc.get(key)!.push(p);
    }
    return Array.from(acc.entries());
  }, []);

  const onOpenProject = (p: Project) => {
    router.push(`/projects/${p.slug}`);
  };

  const principles = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Leakage-aware evaluation",
      desc: "Time-based splits, release lags, and strict alignment so results are honest.",
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Baseline-first methodology",
      desc: "Start simple, prove lift, then add complexity only if it survives validation.",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      title: "Proper scoring + calibration",
      desc: "For probabilities, calibration and scoring rules matter more than accuracy.",
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      title: "Reproducible systems",
      desc: "Pinned deps, consistent configs, and documented assumptions for backtests.",
    },
  ];

  const now = [
    "Building memo-style project pages with methodology, evaluation, and assumptions.",
    "Iterating on event-driven forecasting (macro → probability → calibration → trade rules).",
    "Pruning factor libraries for redundancy (correlation, stability, cost sensitivity).",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-950">JZ</div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-950 transition-colors"
              >
                About
              </a>
              <a
                href="#projects"
                className="text-gray-600 hover:text-gray-950 transition-colors"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-gray-950 transition-colors"
              >
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
            <h1 className="text-6xl md:text-8xl font-light tracking-tight text-gray-950 leading-[0.9]">
              {profile.name}
            </h1>

            <div className="text-3xl md:text-4xl font-light text-blue-600 tracking-tight h-16 flex items-center justify-center">
              <TypeWriterText
                texts={[
                  "Quant + ML @ Vanderbilt",
                  "Data → Model → Signal → Backtest",
                  "Probabilistic forecasting + calibration",
                  "Leakage-aware evaluation",
                ]}
              />
            </div>
          </div>

          <p className="text-xl md:text-2xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {profile.hero}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button href="#projects">
              <span className="flex items-center">
                See projects <ArrowRight className="ml-2 w-5 h-5" />
              </span>
            </Button>

            <Button variant="outline" href="#about">
              <span className="flex items-center">
                How I build <ChevronRight className="ml-1 w-5 h-5" />
              </span>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <Badge tone="neutral">{profile.tagline}</Badge>
            <Badge tone="neutral">Trading systems</Badge>
            <Badge tone="neutral">Forecasting</Badge>
            <Badge tone="neutral">Backtesting</Badge>
            <Badge tone="neutral">Econometrics</Badge>
          </div>
        </div>
      </section>

      {/* About / Principles */}
      <section id="about" className="py-24 bg-gray-50/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-950 mb-4 tracking-tight">
              How I build
            </h2>
            <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto">
              A portfolio snapshot of the principles I apply to quant + ML work.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl border border-gray-100/80 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-950">
                  Research & evaluation principles
                </h3>
              </div>

              <div className="space-y-6">
                {principles.map((p) => (
                  <BulletRow
                    key={p.title}
                    icon={p.icon}
                    title={p.title}
                    desc={p.desc}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100/80 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-950">
                  Current direction
                </h3>
              </div>

              <p className="text-gray-600 leading-relaxed mb-5">
                I’m intentionally iterating toward quant research / trading roles
                and ML-heavy finance roles — building systems that are rigorous,
                reproducible, and honest.
              </p>

              <ul className="space-y-3">
                {now.map((x, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-950 mb-4 tracking-tight">
              Projects
            </h2>
            <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto">
              Curated work — each project has a writeup with methodology,
              evaluation, and next steps.
            </p>
          </div>

          {grouped.map(([category, ps]) => (
            <div key={category} className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-950">
                  {category}
                </h3>
                <span className="text-sm text-gray-500">
                  {ps.length} project{ps.length === 1 ? "" : "s"}
                </span>
              </div>

              {/* IMPORTANT: items-stretch + card h-full fixes mismatch */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
                {ps.map((p) => (
                  <ProjectCard key={p.id} project={p} onOpen={onOpenProject} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-gray-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-950 mb-6 tracking-tight">
            Say hello
          </h2>
          <p className="text-xl font-light text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Happy to chat about projects, research, internships, or building
            trading/ML systems. If something here sparks a thought, send a note.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button href={`mailto:${profile.email}`}>
              <span className="flex items-center">
                <Mail className="mr-2 w-5 h-5" />
                Email me
              </span>
            </Button>

            <Button variant="outline" href={profile.linkedin} external>
              <span className="flex items-center">
                <Linkedin className="mr-2 w-5 h-5" />
                LinkedIn
              </span>
            </Button>

            <Button
              variant="outline"
              href={profile.github}
              external
              className="hidden sm:inline-flex"
            >
              <span className="flex items-center">
                <Github className="mr-2 w-5 h-5" />
                GitHub
              </span>
            </Button>
          </div>

          <div className="text-gray-500 text-sm">{profile.locationLine}</div>
        </div>
      </section>
    </div>
  );
}
