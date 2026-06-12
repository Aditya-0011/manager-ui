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
  type FetchError,
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
    data: experiences,
    isLoading: isLoadingExperiences,
    isError: isExperiencesFetchError,
    error: experiencesError,
  } = useDataQuery<null, GetExperiencesResponse>(
    "manager",
    ["experiences"],
    "/experience/list",
    false,
  );

  const {
    mutateAsync: createExperienceAsync,
    isPending: isCreatingExperience,
    isError: isCreatingExperienceError,
  } = useDataMutation<ExperienceCreateRequest, SimpleResponse>(
    "manager",
    "/experience/add",
    false,
    {
      invalidateKey: [["experiences"]],
      onSuccess: (data) => {
        toast.success(data.message);
      },
    },
  );

  const {
    mutateAsync: updateExperienceAsync,
    isPending: isUpdatingExperience,
    isError: isUpdatingExperienceError,
  } = useDataMutation<ExperienceUpdateRequest, SimpleResponse>(
    "manager",
    "/experience/edit",
    false,
    {
      invalidateKey: [["experiences"]],
      onSuccess: (data) => {
        toast.success(data.message);
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
        toast.success(data.message);
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

  const isExpNotFoundError =
    isExperiencesFetchError &&
    experiencesError &&
    "status" in experiencesError &&
    (experiencesError as FetchError).status === 404;
  const hasExpError = isExperiencesFetchError && !isExpNotFoundError;

  if (
    hasTechError ||
    hasProjError ||
    hasExpError ||
    isCreatingExperienceError ||
    isUpdatingExperienceError ||
    isDeletingExperienceError ||
    (!technologies && !isTechNotFoundError) ||
    (!projects && !isProjNotFoundError) ||
    (!experiences && !isExpNotFoundError)
  ) {
    return <Error content="experiences" />;
  }

  const technologiesList = isTechNotFoundError
    ? []
    : technologies?.technologies || [];
  const projectsList = isProjNotFoundError ? [] : projects?.projects || [];
  const experiencesList = isExpNotFoundError
    ? []
    : experiences?.experiences || [];

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
            technologies={technologiesList}
            projects={projectsList}
            isCreatingExperience={isCreatingExperience}
            mutateExperienceAsync={createExperienceAsync}
          />
        </div>
      </div>
      <List
        technologies={technologiesList}
        projects={projectsList}
        experiences={experiencesList}
        isUpdatingExperience={isUpdatingExperience}
        isDeletingExperience={isDeletingExperience}
        updateExperienceAsync={updateExperienceAsync}
        deleteExperienceAsync={deleteExperienceAsync}
      />
    </div>
  );
}
