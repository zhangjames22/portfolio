// src/components/ProjectCard.tsx
import type { Project } from "@/data/projects";
import { ExternalLink } from "lucide-react";

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  const topTech = project.technologies?.slice(0, 4) ?? [];

  return (
    <button
      className="group h-full text-left bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
      onClick={() => onOpen(project)}
    >
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-5xl font-light text-gray-400">
              {project.title.charAt(0)}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
            {project.category}
          </span>
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              project.status === "Shipped"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {project.status}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2">
            <span className="text-sm text-gray-800">Read</span>
            <ExternalLink className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-gray-950 mb-2 group-hover:text-blue-700 transition-colors duration-200">
          {project.title}
        </h3>

        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* pushes tech pills down so cards align better */}
        <div className="mt-auto flex flex-wrap gap-2">
          {topTech.map((tech, idx) => (
            <span
              key={`${tech}-${idx}`}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > topTech.length && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              +{project.technologies.length - topTech.length}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
