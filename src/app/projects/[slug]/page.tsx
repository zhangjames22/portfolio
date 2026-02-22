// src/app/projects/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = projects.find((p) => p.slug === slug);
  if (!project) return notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <Link
          href="/#projects"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to projects
        </Link>

        <div className="mt-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
              {project.status}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
            {project.title}
          </h1>

          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            {project.fullDescription ?? project.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-10">
            <Section title="What I did" items={project.highlights} />

            {project.evaluation?.length ? (
              <Section title="Evaluation" items={project.evaluation} />
            ) : null}

            {project.pitfalls?.length ? (
              <Section title="Pitfalls / Failure Modes" items={project.pitfalls} />
            ) : null}

            {project.nextSteps?.length ? (
              <Section title="Next steps" items={project.nextSteps} />
            ) : null}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium border-2 border-gray-300 hover:border-gray-400 text-gray-800"
              >
                View code →
              </a>
            ) : null}

            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                Live demo →
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
      <ul className="space-y-2">
        {items.map((x, i) => (
          <li key={i} className="flex items-start">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
            <span className="text-gray-700 leading-relaxed">{x}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
