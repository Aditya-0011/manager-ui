import { toast } from "sonner";

import { useDataQuery, useDataMutation } from "@/api/handler";

import {
  type DeleteRequest,
  type SimpleResponse,
  type GetTechnologiesResponse,
  type GetProjectsResponse,
  type GetExperiencesResponse,
  type ExperienceCreateRequest,
  type ExperienceUpdateRequest,
} from "@/lib/objects";

import { Form } from "@/components/pages/experiences/Form";
import { List } from "@/components/pages/experiences/List";

import { Loading } from "@/components/Loading";
import { Error } from "@/components/Error";

export default function Experiences() {
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
    "/project/get",
    false,
  );

  const {
    data: experiences,
    isLoading: isLoadingExperiences,
    isError: isExperiencesFetchError,
  } = useDataQuery<null, GetExperiencesResponse>(
    "manager",
    ["experiences"],
    "/experience/get",
    false,
  );

  const {
    mutateAsync: createExperienceAsync,
    isPending: isCreatingExperience,
    isError: isCreatingExperienceError,
  } = useDataMutation<ExperienceCreateRequest, SimpleResponse>(
    "manager",
    "/experience/create",
    false,
    {
      invalidateKey: [["experiences"]],
      onSuccess: (data) => {
        toast.success(data.message, { toasterId: "root" });
      },
    },
  );

  const {
    mutateAsync: updateExperienceAsync,
    isPending: isUpdatingExperience,
    isError: isUpdatingExperienceError,
  } = useDataMutation<ExperienceUpdateRequest, SimpleResponse>(
    "manager",
    "/experience/update",
    false,
    {
      invalidateKey: [["experiences"]],
      onSuccess: (data) => {
        toast.success(data.message, { toasterId: "root" });
      },
    },
  );

  const {
    mutateAsync: deleteExperienceAsync,
    isPending: isDeletingExperience,
    isError: isDeletingExperienceError,
  } = useDataMutation<DeleteRequest, SimpleResponse>(
    "manager",
    "/experience/delete",
    false,
    {
      invalidateKey: [["experiences"]],
      onSuccess: (data) => {
        toast.success(data.message, { toasterId: "root" });
      },
    },
  );

  if (
    isLoadingTechnologies ||
    isLoadingProjects ||
    isLoadingExperiences ||
    isCreatingExperience ||
    isUpdatingExperience ||
    isDeletingExperience
  ) {
    return <Loading content="experiences" />;
  }
  if (
    isTechnologiesFetchError ||
    isProjectsFetchError ||
    isExperiencesFetchError ||
    isCreatingExperienceError ||
    isUpdatingExperienceError ||
    isDeletingExperienceError ||
    !technologies ||
    !projects ||
    !experiences
  ) {
    return <Error content="experiences" />;
  }

  return (
    <div className="mx-auto flex max-h-screen w-full flex-col gap-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Experience</h1>
          <p className="text-muted-foreground mt-1 text-xs">
            Cheers to your slavery!
          </p>
        </div>
        <div>
          <Form
            technologies={technologies.technologies}
            projects={projects.projects}
            isCreatingExperience={isCreatingExperience}
            mutateExperienceAsync={createExperienceAsync}
          />
        </div>
      </div>
      <List
        technologies={technologies.technologies}
        projects={projects.projects}
        experiences={experiences.experiences}
        isUpdatingExperience={isUpdatingExperience}
        isDeletingExperience={isDeletingExperience}
        updateExperienceAsync={updateExperienceAsync}
        deleteExperienceAsync={deleteExperienceAsync}
      />
    </div>
  );
}
