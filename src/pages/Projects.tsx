import { toast } from "sonner";

import { useDataQuery, useDataMutation } from "@/api/handler";

import {
  type DeleteRequest,
  type SimpleResponse,
  type GetTechnologiesResponse,
  type GetProjectsResponse,
  type ProjectCreateRequest,
  type ProjectUpdateRequest,
  type FetchError,
} from "@/lib/objects";

import { Form } from "@/components/pages/projects/Form";
import { List } from "@/components/pages/projects/List";

import { Loading } from "@/components/Loading";
import { Error } from "@/components/Error";

export default function Projects() {
  const {
    data: technologies,
    isLoading: isLoadingTechnologies,
    isError: isTechnologiesFetchError,
    error: technologiesError,
  } = useDataQuery<null, GetTechnologiesResponse>(
    "manager",
    ["technologies"],
    "/technology/list",
    false,
  );

  const {
    data: projects,
    isLoading: isLoadingProjects,
    isError: isProjectsFetchError,
    error: projectsError,
  } = useDataQuery<null, GetProjectsResponse>(
    "manager",
    ["projects"],
    "/project/list",
    false,
  );

  const {
    mutateAsync: createProjectAsync,
    isPending: isCreatingProject,
    isError: isCreatingProjectError,
  } = useDataMutation<ProjectCreateRequest, SimpleResponse>(
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

  const {
    mutateAsync: updateProjectAsync,
    isPending: isUpdatingProject,
    isError: isUpdatingProjectError,
  } = useDataMutation<ProjectUpdateRequest, SimpleResponse>(
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

  const {
    mutateAsync: deleteProjectAsync,
    isPending: isDeletingProject,
    isError: isDeletingProjectError,
  } = useDataMutation<DeleteRequest, SimpleResponse>(
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

  if (
    isLoadingTechnologies ||
    isLoadingProjects ||
    isCreatingProject ||
    isUpdatingProject ||
    isDeletingProject
  ) {
    return <Loading content="projects" />;
  }

  const isTechNotFoundError =
    isTechnologiesFetchError &&
    technologiesError &&
    "status" in technologiesError &&
    (technologiesError as FetchError).status === 404;
  const hasTechError = isTechnologiesFetchError && !isTechNotFoundError;

  const isProjNotFoundError =
    isProjectsFetchError &&
    projectsError &&
    "status" in projectsError &&
    (projectsError as FetchError).status === 404;
  const hasProjError = isProjectsFetchError && !isProjNotFoundError;

  if (
    hasTechError ||
    hasProjError ||
    isCreatingProjectError ||
    isUpdatingProjectError ||
    isDeletingProjectError ||
    (!technologies && !isTechNotFoundError) ||
    (!projects && !isProjNotFoundError)
  ) {
    return <Error content="projects" />;
  }

  const technologiesList = isTechNotFoundError
    ? []
    : technologies?.technologies || [];
  const projectsList = isProjNotFoundError ? [] : projects?.projects || [];

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
          mutateProjectAsync={createProjectAsync}
        />
      </div>
      <List
        projects={projectsList}
        technologies={technologiesList}
        isUpdatingProject={isUpdatingProject}
        isDeletingProject={isDeletingProject}
        updateProjectAsync={updateProjectAsync}
        deleteProjectAsync={deleteProjectAsync}
      />
    </div>
  );
}
