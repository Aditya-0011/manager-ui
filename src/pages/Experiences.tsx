import { toast } from "sonner";

import { isNotFoundError, useDataQuery, useDataMutation } from "@/api/handler";

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

  const {
    data: experiences,
    isLoading: isLoadingExperiences,
    error: experiencesError,
    refetch: refetchExperiences,
  } = useDataQuery<null, GetExperiencesResponse>(
    "manager",
    ["experiences"],
    "/experience/list",
    false,
  );

  const { submit: createExperienceAsync, isPending: isCreatingExperience } =
    useDataMutation<ExperienceCreateRequest, SimpleResponse>(
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

  const { submit: updateExperienceAsync, isPending: isUpdatingExperience } =
    useDataMutation<ExperienceUpdateRequest, SimpleResponse>(
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

  const { mutate: deleteExperience, isPending: isDeletingExperience } =
    useDataMutation<DeleteRequest, SimpleResponse>(
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

  if (isLoadingTechnologies || isLoadingProjects || isLoadingExperiences) {
    return <Loading content="experiences" />;
  }
  const isTechnologiesEmpty = isNotFoundError(technologiesError);
  const isProjectsEmpty = isNotFoundError(projectsError);
  const isExperiencesEmpty = isNotFoundError(experiencesError);

  if (
    (technologiesError && !isTechnologiesEmpty) ||
    (!technologies && !isTechnologiesEmpty) ||
    (projectsError && !isProjectsEmpty) ||
    (!projects && !isProjectsEmpty) ||
    (experiencesError && !isExperiencesEmpty) ||
    (!experiences && !isExperiencesEmpty)
  ) {
    return (
      <Error
        content="experiences"
        onRetry={() => {
          void refetchTechnologies();
          void refetchProjects();
          void refetchExperiences();
        }}
      />
    );
  }

  const technologiesList = technologies?.technologies ?? [];
  const projectsList = projects?.projects ?? [];
  const experiencesList = experiences?.experiences ?? [];

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
            submitExperience={createExperienceAsync}
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
        onDeleteExperience={deleteExperience}
      />
    </div>
  );
}
