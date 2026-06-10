import { toast } from "sonner";

import { useDataQuery, useDataMutation } from "@/api/handler";

import {
  type DeleteRequest,
  type SimpleResponse,
  type TechnologyUpdateRequest,
  type TechnologyCreateRequest,
  type GetTechnologiesResponse,
} from "@/lib/objects";

import { List } from "@/components/pages/technologies/List";
import { Form } from "@/components/pages/technologies/Form";

import { Loading } from "@/components/Loading";
import { Error } from "@/components/Error";

export default function Technologies() {
  const { data, isLoading, isError } = useDataQuery<
    null,
    GetTechnologiesResponse
  >("manager", ["technologies"], "/technology/list", false);

  const {
    mutateAsync: createAsync,
    isPending: isCreating,
    isError: createError,
  } = useDataMutation<TechnologyCreateRequest, SimpleResponse>(
    "manager",
    "/technology/add",
    false,
    {
      invalidateKey: [["technologies"]],
      onSuccess: (data) => {
        toast.success(data.message, { toasterId: "root" });
      },
    },
  );

  const {
    mutateAsync: updateAsync,
    isPending: isUpdating,
    isError: updateError,
  } = useDataMutation<TechnologyUpdateRequest, SimpleResponse>(
    "manager",
    "/technology/edit",
    false,
    {
      invalidateKey: [["technologies"]],
      onSuccess: (data) => {
        toast.success(data.message, { toasterId: "root" });
      },
    },
  );

  const {
    mutateAsync: deleteAsync,
    isPending: isDeleting,
    isError: deleteError,
  } = useDataMutation<DeleteRequest, SimpleResponse>(
    "manager",
    "/technology/delete",
    false,
    {
      invalidateKey: [["technologies"]],
      onSuccess: (data) => {
        toast.success(data.message, { toasterId: "root" });
      },
    },
  );

  if (isLoading || isCreating || isUpdating || isDeleting) {
    return <Loading content="technologies" />;
  }

  if (isError || createError || updateError || deleteError || !data) {
    return <Error content="technologies" />;
  }

  return (
    <div className="mx-auto flex max-h-screen w-full flex-col gap-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Technologies</h1>
          <p className="text-muted-foreground mt-1 text-xs">
            Calm down you are not catching pokemons!
          </p>
        </div>
        <Form isCreating={isCreating} mutateAsync={createAsync} />
      </div>
      <List
        technologies={data.technologies}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        updateAsync={updateAsync}
        deleteAsync={deleteAsync}
      />
    </div>
  );
}
