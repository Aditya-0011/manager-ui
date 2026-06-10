import { toast } from "sonner";

import { useDataQuery, useDataMutation } from "@/api/handler";

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
    isError: isTechnologiesFetchError,
  } = useDataQuery<null, GetTechnologiesResponse>(
    "manager",
    ["technologies"],
    "/technology/get",
    false,
  );

  const {
    data: projects,
    isLoading: isLoadingProjects,
    isError: isProjectsFetchError,
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
        toast.success(data.message, { toasterId: "root" });
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
        toast.success(data.message, { toasterId: "root" });
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
        toast.success(data.message, { toasterId: "root" });
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
  if (
    isTechnologiesFetchError ||
    isProjectsFetchError ||
    isCreatingProjectError ||
    isUpdatingProjectError ||
    isDeletingProjectError ||
    !technologies ||
    !projects
  ) {
    return <Error content="projects" />;
  }

  return (
    <div className="mx-auto flex max-h-screen w-full flex-col gap-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Projects</h1>
          <p className="text-muted-foreground mt-1 text-xs">Sky's the limit!</p>
        </div>
        <Form
          technologies={technologies.technologies}
          isCreatingProject={isCreatingProject}
          mutateProjectAsync={createProjectAsync}
        />
      </div>
      <List
        projects={projects.projects}
        technologies={technologies.technologies}
        isUpdatingProject={isUpdatingProject}
        isDeletingProject={isDeletingProject}
        updateProjectAsync={updateProjectAsync}
        deleteProjectAsync={deleteProjectAsync}
      />
    </div>
  );
}
