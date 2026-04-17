export type ProjectCategory =
  | "Trading Systems"
  | "ML Research"
  | "Econometrics"
  | "Engineering";

export type ProjectStatus = "In progress" | "Shipped";

export type Project = {
  id: number;
  slug: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;

  // short card copy
  description: string;

  // longer write-up intro
  fullDescription?: string;

  technologies: string[];

  // “What I did” bullets
  highlights: string[];

  // credibility: eval + pitfalls
  evaluation?: string[];
  pitfalls?: string[];

  // roadmap for WIP
  nextSteps?: string[];

  githubUrl?: string;
  demoUrl?: string;
  image?: string | null;
};

export const projects: Project[] = [
  {
    id: 1,
    slug: "kalshi-cpi-engine",
    title: "Kalshi CPI Surprise Engine",
    category: "Trading Systems",
    status: "In progress",
    description:
      "A quantitative probability engine that pulls live macro data from FRED and Kalshi market prices to estimate fair-value CPI surprise probabilities across discrete buckets. Identifies mispricing signals ahead of CPI release dates.",
    fullDescription:
      "Pipeline: macro data ingestion → feature engineering → probabilistic models → calibration → backtesting vs market-implied probabilities.",
    technologies: ["Python", "pandas", "scipy", "FRED API", "Kalshi API"],
    highlights: [
      "Designed a time-series dataset pipeline with versioned features and clean joins",
      "Trained probabilistic baselines and evaluated with proper scoring rules (Brier)",
      "Implemented leakage-aware time splits and calibration checks",
      "Backtested trading rules vs market-implied probabilities with conservative assumptions",
    ],
    evaluation: [
      "Metrics: Brier score, log loss, calibration (reliability) curves",
      "Validation: time-based splits to prevent leakage",
      "Baseline-first: naive + logistic baseline before more complex models",
    ],
    pitfalls: [
      "Release lags & data revisions (macro series revisions can fake alpha)",
      "Lookahead leakage via improperly aligned timestamps",
      "Overfitting to a small number of event outcomes",
    ],
    nextSteps: [
      "Add market-implied probability features + spread/edge logic",
      "Run robustness checks across different time windows",
      "Document assumptions: slippage, sizing, and execution constraints",
    ],
    githubUrl: "https://github.com/zhangjames22/kalshi-cpi-engine",
    image: null,
  },

  {
    id: 2,
    slug: "ml-lab-research",
    title: "Vanderbilt ML Lab Research (Prof. Kong)",
    category: "ML Research",
    status: "In progress",
    description:
      "Research work in applied ML with emphasis on clean evaluation, baselines, and reproducibility.",
    technologies: ["Python", "PyTorch", "NumPy", "pandas"],
    highlights: [
      "Built/ran experiments with reproducible configurations and tracked results",
      "Focused on rigorous evaluation and baseline comparisons",
      "Wrote research notes on failure modes and what improved performance",
    ],
    nextSteps: [
      "Publish a short memo-style writeup page with methods + results summary",
    ],
    githubUrl: "https://github.com/zhangjames22/<repo>",
    image: null,
  },

  {
    id: 3,
    slug: "alpha-factor-library",
    title: "Alpha Factor Research Library",
    category: "Trading Systems",
    status: "In progress",
    description:
      "Systematic factor research framework: signal construction, validation, correlation pruning, and attribution.",
    technologies: ["Python", "pandas", "NumPy", "C++"],
    highlights: [
      "Signal construction + normalization across assets",
      "Cross-sectional testing framework with clear baselines",
      "Correlation pruning to reduce redundancy and improve diversity",
    ],
    evaluation: [
      "Cross-sectional IC / rank IC tracking",
      "Turnover + transaction cost sensitivity",
      "Stability checks across market regimes",
    ],
    nextSteps: [
      "Add factor clustering and selection heuristics",
      "Write a clear methodology doc for validation & pruning",
    ],
    githubUrl: "https://github.com/zhangjames22/alpha-factor-library",
    image: null,
  },
];