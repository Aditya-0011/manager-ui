import { memo } from "react";
import { Link } from "react-router";

import ReactMarkdown from "react-markdown";

import { Globe } from "lucide-react";

import { Github } from "@/lib/brand-icons";

import {
  type Project,
  type SimpleResponse,
  type ProjectUpdateRequest,
  type DeleteRequest,
  type Technology,
} from "@/lib/objects";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { Form } from "@/components/pages/projects/Form";

import { UpdatedOn } from "@/components/pages/UpdatedOn";
import { Delete } from "@/components/pages/Delete";

type CardProps = {
  project: Project;
  technologies: Technology[];
  isUpdatingProject: boolean;
  isDeletingProject: boolean;
  updateProjectAsync: (req: ProjectUpdateRequest) => Promise<SimpleResponse>;
  deleteProjectAsync: (req: DeleteRequest) => Promise<SimpleResponse>;
};

const ProjectCard = memo(
  ({
    project,
    technologies,
    isUpdatingProject,
    isDeletingProject,
    updateProjectAsync,
    deleteProjectAsync,
  }: CardProps) => {
    return (
      <Card className="group bg-muted/5 hover:bg-muted/50 mb-4 break-inside-avoid ring ring-white/10 backdrop-blur transition-all contain-content hover:scale-[1.01] hover:ring-white">
        <div className="flex h-auto w-full overflow-hidden rounded-t-lg border-b">
          <div className="bg-muted/10 flex size-56 flex-1 items-center justify-center p-6 transition-colors group-hover:bg-white/10">
            <img
              src={project.image_url}
              alt={project.name}
              fetchPriority="high"
              loading="lazy"
              className="size-56 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
        <CardContent className="flex flex-1 flex-col justify-between gap-2 p-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h2
              className={`my-1 text-lg leading-tight font-semibold tracking-tight ${
                project.featured ? "text-amber-500" : ""
              }`}
            >
              {project.name}
            </h2>
            <div className="flex items-center justify-between gap-1">
              {project.github_url && (
                <Button
                  variant="link"
                  size="icon-sm"
                  className="hover:text-blue-600"
                  title={project.github_url}
                >
                  <Link
                    to={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github />
                  </Link>
                </Button>
              )}
              {project.project_url && (
                <Button
                  variant="link"
                  size="icon-sm"
                  className="hover:text-blue-600"
                  title={project.project_url}
                >
                  <Link
                    to={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe />
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="prose prose-invert prose-headings:font-mono my-2 rounded-md bg-transparent! font-mono text-inherit!">
              <ReactMarkdown
                components={{
                  ul: ({ className, ...props }) => (
                    <ul className={`list-disc ${className ?? ""}`} {...props} />
                  ),
                  ol: ({ className, ...props }) => (
                    <ol
                      className={`list-decimal ${className ?? ""}`}
                      {...props}
                    />
                  ),
                  a: ({ children, className, href, title, target, rel }) => (
                    <a
                      className={`underline decoration-emerald-500 underline-offset-2 hover:text-emerald-500 hover:no-underline hover:decoration-white ${className ?? ""}`}
                      href={href}
                      title={title}
                      target={target}
                      rel={rel}
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {project.description}
              </ReactMarkdown>
            </div>
          </div>
          {project.technologies && project.technologies.length > 0 && (
            <>
              <Separator />
              <TooltipProvider>
                <ul
                  role="list"
                  className="flex flex-wrap items-center justify-evenly gap-4"
                >
                  {project.technologies
                    .sort((a, b) =>
                      a.name.localeCompare(b.name, "en", {
                        sensitivity: "accent",
                      }),
                    )
                    .map((tech) => (
                      <li key={`${project.id}-${tech.id}`} className="size-6">
                        <Tooltip>
                          <TooltipTrigger className="flex size-full items-center justify-center p-0">
                            <img
                              src={tech.image_url}
                              onError={(event) => {
                                const fallback = tech.fallback_image_url;
                                if (event.currentTarget.src !== fallback) {
                                  event.currentTarget.src = fallback;
                                }
                              }}
                              alt={tech.name}
                              className="size-full object-contain"
                            />
                          </TooltipTrigger>
                          <TooltipContent className="bg-cyan-500/10 text-cyan-600 ring ring-cyan-500 backdrop-blur-sm">
                            {tech.name}
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    ))}
                </ul>
              </TooltipProvider>
            </>
          )}
        </CardContent>
        <CardFooter className="bg-muted/5 flex items-center justify-between border-t p-3">
          <UpdatedOn value={project.updated_at} />
          <div className="flex items-center gap-1">
            <Form
              technologies={technologies}
              project={project}
              isUpdatingProject={isUpdatingProject}
              mutateProjectAsync={updateProjectAsync}
            />
            <Delete
              id={project.id}
              description="This action cannot be undone. This will delete the project"
              name={project.name}
              isDeleting={isDeletingProject}
              mutateAsync={deleteProjectAsync}
            />
          </div>
        </CardFooter>
      </Card>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

export { ProjectCard };
