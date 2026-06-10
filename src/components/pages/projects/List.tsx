import {
  type Project,
  type SimpleResponse,
  type ProjectUpdateRequest,
  type DeleteRequest,
  type Technology,
} from "@/lib/objects";

import { ProjectCard } from "@/components/pages/projects/Card";

type ListProps = {
  technologies: Technology[];
  projects: Project[];
  isUpdatingProject: boolean;
  isDeletingProject: boolean;
  updateProjectAsync: (
    request: ProjectUpdateRequest,
  ) => Promise<SimpleResponse>;
  deleteProjectAsync: (request: DeleteRequest) => Promise<SimpleResponse>;
};

export function List({
  technologies,
  projects,
  isUpdatingProject,
  isDeletingProject,
  updateProjectAsync,
  deleteProjectAsync,
}: ListProps) {
  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        No projects found.
      </p>
    );
  }

  return (
    <div className="transform-[translateZ(0)] columns-1 gap-4 pb-4 backface-hidden sm:columns-2 lg:columns-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          technologies={technologies}
          isUpdatingProject={isUpdatingProject}
          isDeletingProject={isDeletingProject}
          updateProjectAsync={updateProjectAsync}
          deleteProjectAsync={deleteProjectAsync}
        />
      ))}
    </div>
  );
}
