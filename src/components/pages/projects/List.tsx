import { useState } from "react";

import {
  type Project,
  type ProjectUpdateRequest,
  type DeleteRequest,
  type Technology,
} from "@/lib/objects";

import { ListSearch } from "@/components/pages/ListSearch";
import { ProjectCard } from "@/components/pages/projects/Card";

type ListProps = {
  technologies: Technology[];
  projects: Project[];
  isUpdatingProject: boolean;
  isDeletingProject: boolean;
  updateProjectAsync: (request: ProjectUpdateRequest) => Promise<boolean>;
  onDeleteProject: (request: DeleteRequest) => void;
};

export function List({
  technologies,
  projects,
  isUpdatingProject,
  isDeletingProject,
  updateProjectAsync,
  onDeleteProject,
}: ListProps) {
  const [search, setSearch] = useState("");

  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        No projects found.
      </p>
    );
  }

  const query = search.trim().toLowerCase();
  const visible = query
    ? projects.filter((project) =>
        [
          project.name,
          project.description,
          ...(project.technologies ?? []).map((tech) => tech.name),
        ].some((text) => text.toLowerCase().includes(query)),
      )
    : projects;

  return (
    <div className="flex flex-col gap-4">
      <ListSearch
        label="Search projects"
        placeholder="Search projects..."
        value={search}
        onChange={setSearch}
      />
      {visible.length === 0 ? (
        <p className="text-muted-foreground py-10 text-center text-sm">
          No projects match "{search.trim()}".
        </p>
      ) : (
        <div className="transform-[translateZ(0)] columns-1 gap-4 pb-4 backface-hidden sm:columns-2 lg:columns-4">
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              technologies={technologies}
              isUpdatingProject={isUpdatingProject}
              isDeletingProject={isDeletingProject}
              updateProjectAsync={updateProjectAsync}
              onDeleteProject={onDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
