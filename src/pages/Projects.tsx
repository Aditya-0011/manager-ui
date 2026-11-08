import { toast } from "sonner";

import { isNotFoundError, useDataQuery, useDataMutation } from "@/api/handler";

import {
  type DeleteRequest,
  type SimpleResponse,
  type GetTechnologiesResponse,
  type GetProjectsResponse,
  type ProjectCreateRequest,
  type ProjectUpdateRequest,
} from "@/lib/objects";

import { Form } from "@/components/pages/projects/Form";
import { List } from "@/components/pages/projects/List";

import { Loading } from "@/components/Loading";
import { Error } from "@/components/Error";

export default function Projects() {
  const {
    data: technologies,
    isLoading: isLoadingTechnologies,
    error: technologiesError,
    refetch: refetchTechnologies,
  } = useDataQuery<null, GetTechnologiesResponse>(
    "manager",
    ["technologies"],
    "/technology/list",
    false,
  );

  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsError,
    refetch: refetchProjects,
  } = useDataQuery<null, GetProjectsResponse>(
    "manager",
    ["projects"],
    "/project/list",
    false,
  );

  const { submit: createProjectAsync, isPending: isCreatingProject } =
    useDataMutation<ProjectCreateRequest, SimpleResponse>(
      "manager",
      "/project/add",
      false,
      {
        invalidateKey: [["projects"]],
        onSuccess: (data) => {
          toast.success(data.message);
        },
      },
    );

  const { submit: updateProjectAsync, isPending: isUpdatingProject } =
    useDataMutation<ProjectUpdateRequest, SimpleResponse>(
      "manager",
      "/project/edit",
      false,
      {
        invalidateKey: [["projects"]],
        onSuccess: (data) => {
          toast.success(data.message);
        },
      },
    );

  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDataMutation<DeleteRequest, SimpleResponse>(
      "manager",
      "/project/delete",
      false,
      {
        invalidateKey: [["projects"]],
        onSuccess: (data) => {
          toast.success(data.message);
        },
      },
    );

  if (isLoadingTechnologies || isLoadingProjects) {
    return <Loading content="projects" />;
  }
  const isTechnologiesEmpty = isNotFoundError(technologiesError);
  const isProjectsEmpty = isNotFoundError(projectsError);

  if (
    (technologiesError && !isTechnologiesEmpty) ||
    (!technologies && !isTechnologiesEmpty) ||
    (projectsError && !isProjectsEmpty) ||
    (!projects && !isProjectsEmpty)
  ) {
    return (
      <Error
        content="projects"
        onRetry={() => {
          void refetchTechnologies();
          void refetchProjects();
        }}
      />
    );
  }

  const technologiesList = technologies?.technologies ?? [];
  const projectsList = projects?.projects ?? [];

  return (
    <div className="mx-auto flex max-h-screen w-full flex-col gap-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Projects</h1>
          <p className="text-muted-foreground mt-1 text-xs">Sky's the limit!</p>
        </div>
        <Form
          technologies={technologiesList}
          isCreatingProject={isCreatingProject}
          submitProject={createProjectAsync}
        />
      </div>
      <List
        projects={projectsList}
        technologies={technologiesList}
        isUpdatingProject={isUpdatingProject}
        isDeletingProject={isDeletingProject}
        updateProjectAsync={updateProjectAsync}
        onDeleteProject={deleteProject}
      />
    </div>
  );
}
