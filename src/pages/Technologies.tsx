import { toast } from "sonner";

import { isNotFoundError, useDataQuery, useDataMutation } from "@/api/handler";

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

const INVALIDATE: string[][] = [["technologies"]];
const notifySuccess = (data: SimpleResponse) => toast.success(data.message);

export default function Technologies() {
  const { data, isLoading, error, refetch } = useDataQuery<
    null,
    GetTechnologiesResponse
  >("manager", ["technologies"], "/technology/list", false);

  const { submit: createAsync, isPending: isCreating } = useDataMutation<
    TechnologyCreateRequest,
    SimpleResponse
  >("manager", "/technology/add", false, {
    invalidateKey: INVALIDATE,
    onSuccess: notifySuccess,
  });

  const { submit: updateAsync, isPending: isUpdating } = useDataMutation<
    TechnologyUpdateRequest,
    SimpleResponse
  >("manager", "/technology/edit", false, {
    invalidateKey: INVALIDATE,
    onSuccess: notifySuccess,
  });

  const { mutate: deleteTechnology, isPending: isDeleting } = useDataMutation<
    DeleteRequest,
    SimpleResponse
  >("manager", "/technology/delete", false, {
    invalidateKey: INVALIDATE,
    onSuccess: notifySuccess,
  });

  if (isLoading) {
    return <Loading content="technologies" />;
  }

  const isEmpty = isNotFoundError(error);
  if ((error && !isEmpty) || (!data && !isEmpty)) {
    return <Error content="technologies" onRetry={() => void refetch()} />;
  }

  const technologiesList = data?.technologies ?? [];

  return (
    <div className="mx-auto flex max-h-screen w-full flex-col gap-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Technologies</h1>
          <p className="text-muted-foreground mt-1 text-xs">
            Calm down you are not catching pokemons!
          </p>
        </div>
        <Form isCreating={isCreating} submit={createAsync} />
      </div>
      <List
        technologies={technologiesList}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        updateAsync={updateAsync}
        onDelete={deleteTechnology}
      />
    </div>
  );
}
