import { toast } from "sonner";

import { useDataQuery, useDataMutation } from "@/api/handler";
import {
  type DeleteMessageRequest,
  type GetMessagesResponse,
  type SimpleResponse,
} from "@/lib/objects";

import { List } from "@/components/pages/messages/List";

import { Loading } from "@/components/Loading";
import { Error } from "@/components/Error";

export default function Messages() {
  const { data, isLoading, isError } = useDataQuery<null, GetMessagesResponse>(
    "manager",
    ["messages"],
    "/message/list",
    false,
  );

  const {
    mutateAsync,
    isPending,
    isError: deleteError,
  } = useDataMutation<DeleteMessageRequest, SimpleResponse>(
    "manager",
    "/message/delete",
    false,
    {
      invalidateKey: [["messages"]],
      onSuccess: (data) => {
        toast.success(data.message);
      },
    },
  );

  if (isLoading || isPending) {
    return <Loading content="messages" />;
  }

  if (isError || deleteError || !data) {
    return <Error content="messages" />;
  }

  return (
    <div className="mx-auto flex max-h-screen w-full flex-col gap-6 text-white">
      <div>
        <h1 className="text-3xl font-semibold">Messages</h1>
        <p className="text-muted-foreground mt-1 text-xs">
          Certainly not from your loved ones… or maybe they are.
        </p>
      </div>

      <List
        data={data.messages}
        isDeleting={isPending}
        mutateAsync={mutateAsync}
      />
    </div>
  );
}
