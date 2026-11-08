import { toast } from "sonner";

import { isNotFoundError, useDataQuery, useDataMutation } from "@/api/handler";
import {
  type DeleteMessageRequest,
  type GetMessagesResponse,
  type SimpleResponse,
} from "@/lib/objects";

import { List } from "@/components/pages/messages/List";

import { Loading } from "@/components/Loading";
import { Error } from "@/components/Error";

export default function Messages() {
  const { data, isLoading, error, refetch } = useDataQuery<
    null,
    GetMessagesResponse
  >("manager", ["messages"], "/message/list", false);

  const { mutate: deleteMessage, isPending } = useDataMutation<
    DeleteMessageRequest,
    SimpleResponse
  >("manager", "/message/delete", false, {
    invalidateKey: [["messages"]],
    onSuccess: (response) => {
      toast.success(response.message);
    },
  });

  if (isLoading) {
    return <Loading content="messages" />;
  }

  const isEmpty = isNotFoundError(error);
  if ((error && !isEmpty) || (!data && !isEmpty)) {
    return <Error content="messages" onRetry={() => void refetch()} />;
  }

  const messagesList = data?.messages ?? [];

  return (
    <div className="mx-auto flex max-h-screen w-full flex-col gap-6 text-white">
      <div>
        <h1 className="text-3xl font-semibold">Messages</h1>
        <p className="text-muted-foreground mt-1 text-xs">
          Certainly not from your loved ones… or maybe they are.
        </p>
      </div>

      <List
        data={messagesList}
        isDeleting={isPending}
        onDelete={deleteMessage}
      />
    </div>
  );
}
